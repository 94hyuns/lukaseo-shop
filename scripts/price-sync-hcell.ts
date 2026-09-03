import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { printSummary, writeSyncOutputs } from '../lib/price-sync/output';
import { validateRows, type PriceRow } from '../lib/price-sync/validate';
import { PRODUCTS } from '../lib/shop/catalog';

/**
 * 한컴 한셀(HCell)로 관리되는 "CPU 가성비 비교표"용 수집기.
 *
 *   사용법: npx tsx scripts/price-sync-hcell.ts "C:\...\CPU 비교표.xlsx"
 *
 * 실물 엑셀을 받아 보니 두 가지가 표준 파이프라인과 어긋났다.
 *
 * ① 한셀이 저장한 xlsx 는 exceljs·SheetJS 모두 시트 해석에 실패한다
 *    (docProps·관계 매핑이 MS 엑셀과 미묘하게 다름). 그래서 xlsx(zip)를
 *    직접 풀어 시트 XML 을 읽는다 — 의존성 없이 node 내장만 쓴다.
 * ② 상품코드(SKU) 컬럼이 없다. 상품명뿐이라, 네이버 매핑(설계 8-5)과 같은
 *    원칙으로 "상품명 ↔ SKU 를 최초 1회 수동 매핑"해 두고 그 표로 잇는다.
 *    매핑에 없는 행은 우리 가게가 안 파는 상품이므로 건너뛰고 수만 센다.
 *
 * 이 파일은 수집 단계만 다르고, 검증·출력은 표준 엑셀 수집기와 같은
 * 코드를 쓴다 (설계 8-2 — 수집기만 교체 가능한 파이프라인).
 *
 * ⚠️ 실물 비교표 파일 자체는 저장소에 커밋하지 않는다. 경로로만 받는다.
 */

/* ── 최소 zip 리더: central directory 에서 항목을 찾아 inflate ── */
function readZipEntry(buf: Buffer, entryName: string): Buffer {
  const eocd = buf.lastIndexOf(Buffer.from('PK\x05\x06', 'binary'));
  if (eocd < 0) throw new Error('zip 형식이 아닙니다');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);

  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nameLen).toString();

    if (name === entryName) {
      const lNameLen = buf.readUInt16LE(localOffset + 26);
      const lExtraLen = buf.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + lNameLen + lExtraLen;
      const data = buf.subarray(start, start + compSize);
      return method === 8 ? zlib.inflateRawSync(data) : Buffer.from(data);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error(`zip 에서 ${entryName} 를 찾지 못했습니다`);
}

/* ── 시트 XML 파싱 (네임스페이스 접두사 허용) ── */
function decodeEntities(text: string): string {
  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function parseSharedStrings(xml: string): string[] {
  return [...xml.matchAll(/<(?:\w+:)?si>([\s\S]*?)<\/(?:\w+:)?si>/g)].map((m) =>
    decodeEntities(
      [...m[1].matchAll(/<(?:\w+:)?t[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)]
        .map((t) => t[1])
        .join(''),
    ),
  );
}

type SheetRow = { rowNum: number; cells: Record<string, string> };

function parseSheetRows(xml: string, strings: string[]): SheetRow[] {
  const rows: SheetRow[] = [];
  for (const [, rowNum, body] of xml.matchAll(
    /<(?:\w+:)?row [^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/g,
  )) {
    const cells: Record<string, string> = {};
    for (const [, col, attrs, inner] of body.matchAll(
      /<(?:\w+:)?c r="([A-Z]+)\d+"([^>]*)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?c>)/g,
    )) {
      const value = inner?.match(/<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1];
      if (value === undefined) continue;
      cells[col] = /t="s"/.test(attrs) ? strings[Number(value)] : decodeEntities(value);
    }
    rows.push({ rowNum: Number(rowNum), cells });
  }
  return rows;
}

/* ── 비교표 상품명 ↔ 카탈로그 SKU 수동 매핑 (최초 1회, 이후 유지보수) ── */
const NAME_TO_SKU: Record<string, string> = {
  '코어i5-14400F DDR4': 'CPU-INT-14400F',
  '코어i7-14700K DDR5': 'CPU-INT-14700K',
  '라이젠5 7600': 'CPU-AMD-7600',
  '라이젠7 9700X': 'CPU-AMD-9700X',
  '라이젠5 5600': 'CPU-AMD-5600',
};

/** 비교표 레이아웃: 4행까지 다층 헤더, 5행부터 데이터. A=상품명, I=현재가 */
const DATA_START_ROW = 5;
const COL_NAME = 'A';
const COL_CURRENT_PRICE = 'I';

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('사용법: npx tsx scripts/price-sync-hcell.ts <비교표.xlsx 경로>');
    process.exit(1);
  }

  const buf = fs.readFileSync(inputFile);
  const strings = parseSharedStrings(readZipEntry(buf, 'xl/sharedStrings.xml').toString());
  const sheetRows = parseSheetRows(readZipEntry(buf, 'xl/worksheets/sheet1.xml').toString(), strings);

  const rows: PriceRow[] = [];
  let skipped = 0;

  for (const { rowNum, cells } of sheetRows) {
    if (rowNum < DATA_START_ROW) continue;
    const name = (cells[COL_NAME] ?? '').trim();
    if (!name) continue;

    const sku = NAME_TO_SKU[name];
    if (!sku) {
      skipped += 1; // 우리 카탈로그에 없는 상품 — 검증 대상 아님
      continue;
    }

    const priceRaw = cells[COL_CURRENT_PRICE];
    const price = priceRaw !== undefined ? Number(priceRaw) : null;

    rows.push({
      sku,
      name,
      price: price !== null && Number.isFinite(price) ? Math.round(price) : null,
      // 비교표의 현재가는 시장 실가라 할인 개념이 없다 → 할인 제거로 반영
      salePrice: null,
      stock: null, // 재고 컬럼 없음 — 변경하지 않는다
      sourceLabel: `${rowNum}행`,
    });
  }

  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = validateRows(rows, PRODUCTS);

  writeSyncOutputs(rootDir, 'hcell-cpu', path.basename(inputFile), result);
  console.log(`비교표 ${sheetRows.length}행 중 매핑 ${rows.length}건, 카탈로그 외 상품 ${skipped}건 건너뜀`);
  printSummary(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

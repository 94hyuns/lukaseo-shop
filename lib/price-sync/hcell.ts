import zlib from 'node:zlib';

/**
 * 한컴 한셀(HCell)이 저장한 "CPU 가성비 비교표"를 읽는 공통 모듈.
 *
 * 한셀 xlsx 는 exceljs·SheetJS 모두 시트 해석에 실패해서 zip·XML 을
 * 직접 파싱한다. 카탈로그 임포트와 가격 갱신 두 스크립트가 같은 파일을
 * 읽으므로, 파싱과 상품명→식별자 규칙을 여기 한 곳에 둔다 —
 * 두 벌로 갈라지면 반드시 어긋난다.
 *
 * 비교표 레이아웃 (2026-08 실물 기준):
 *   1~4행  다층 헤더 (병합 셀 포함)
 *   5행~   데이터. A=상품명, B=FHD 게임 상대성능(RTX 5070 기준),
 *          F=싱글스레드, G=멀티스레드, H=전월가, I=현재가, J=특이사항
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

const DATA_START_ROW = 5;

export type CpuRow = {
  rowNum: number;
  name: string;
  /** 현재가(I열). 비어 있으면 취급 중단으로 본다 */
  currentPrice: number | null;
  prevPrice: number | null;
  /** '벌크 21', '품절', '입고' 같은 특이사항(J열). 병합 때문에 값이 섞여 있을 수 있다 */
  note: string | null;
  /** RTX 5070 기준 FHD 게임 상대 성능(B열) */
  perfGame: number | null;
  perfSingle: number | null;
  perfMulti: number | null;
};

function num(value: string | undefined): number | null {
  if (value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** 비교표에서 CPU 데이터 행을 뽑는다 */
export function extractCpuRows(buf: Buffer): CpuRow[] {
  const strings = parseSharedStrings(readZipEntry(buf, 'xl/sharedStrings.xml').toString());
  const sheetXml = readZipEntry(buf, 'xl/worksheets/sheet1.xml').toString();

  const rows: CpuRow[] = [];
  for (const [, rowNumText, body] of sheetXml.matchAll(
    /<(?:\w+:)?row [^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/(?:\w+:)?row>/g,
  )) {
    const rowNum = Number(rowNumText);
    if (rowNum < DATA_START_ROW) continue;

    const cells: Record<string, string> = {};
    for (const [, col, attrs, inner] of body.matchAll(
      /<(?:\w+:)?c r="([A-Z]+)\d+"([^>]*)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?c>)/g,
    )) {
      const value = inner?.match(/<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1];
      if (value === undefined) continue;
      cells[col] = /t="s"/.test(attrs) ? strings[Number(value)] : decodeEntities(value);
    }

    const name = (cells.A ?? '').trim();
    if (!name) continue;

    const noteRaw = (cells.J ?? '').trim();
    rows.push({
      rowNum,
      name,
      currentPrice: num(cells.I),
      prevPrice: num(cells.H),
      // J열이 숫자면 병합으로 밀린 다른 값이므로 특이사항으로 보지 않는다
      note: noteRaw !== '' && Number.isNaN(Number(noteRaw)) ? noteRaw : null,
      perfGame: num(cells.B),
      perfSingle: num(cells.F),
      perfMulti: num(cells.G),
    });
  }
  return rows;
}

/* ── 상품명 → slug/SKU 규칙 ──
   비교표에는 상품코드가 없어 상품명이 유일한 열쇠다. 이름에서 결정적으로
   식별자를 만들되, 이미 배포된 5종은 기존 slug·SKU 를 유지한다 (링크·
   테스트·오버라이드가 물려 있다). */

const LEGACY_IDS: Record<string, { slug: string; sku: string }> = {
  '코어i5-14400F DDR4': { slug: 'intel-i5-14400f', sku: 'CPU-INT-14400F' },
  '코어i7-14700K DDR5': { slug: 'intel-i7-14700k', sku: 'CPU-INT-14700K' },
  '라이젠5 7600': { slug: 'amd-ryzen5-7600', sku: 'CPU-AMD-7600' },
  '라이젠7 9700X': { slug: 'amd-ryzen7-9700x', sku: 'CPU-AMD-9700X' },
  '라이젠5 5600': { slug: 'amd-ryzen5-5600', sku: 'CPU-AMD-5600' },
};

const WORD_MAP: [RegExp, string][] = [
  [/라이젠/g, 'ryzen'],
  [/코어\s?울트라/g, 'core-ultra'],
  [/코어/g, 'core'],
  [/스레드리퍼/g, 'threadripper'],
];

export function nameToIds(name: string): { slug: string; sku: string } {
  const legacy = LEGACY_IDS[name];
  if (legacy) return legacy;

  let text = name;
  for (const [pattern, replacement] of WORD_MAP) text = text.replace(pattern, replacement);
  const slugBase = text
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // 괄호 주석 제거 — "(버미어)" 같은 것
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const slug = `cpu-${slugBase}`;
  return { slug, sku: `CPU-${slugBase.toUpperCase()}` };
}

export function nameToBrand(name: string): string {
  if (name.includes('라이젠') || name.includes('스레드리퍼')) return 'AMD';
  if (name.includes('코어') || name.includes('울트라') || name.includes('셀러론') || name.includes('펜티엄'))
    return 'Intel';
  return '기타';
}

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { PRODUCTS } from '../lib/shop/catalog';
import { printSummary, writeSyncOutputs } from '../lib/price-sync/output';
import { validateRows, type PriceRow } from '../lib/price-sync/validate';

/**
 * 엑셀 가격 갱신 (설계문서 8-4의 빌드 타임 축소판).
 *
 *   data/prices.xlsx 읽기 → 검증(validate.ts) → 승인분만 overrides 로 저장
 *
 * 반영 흐름: 이 스크립트를 돌리고 git push 하면 빌드가 새 가격으로 나간다.
 * 보류(held)·거부(rejected) 행은 반영하지 않고 리포트에만 남는다 —
 * "부분 실패 시 정상 행만 반영"이 설계문서 8-7의 결정이다.
 *
 * DB 가 붙으면 읽기·저장 부분만 서버 API 로 바뀌고 검증은 그대로 간다.
 */

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excelFile = path.join(rootDir, 'data', 'prices.xlsx');

/** 헤더 이름 → 필드. 실물 엑셀의 헤더가 다르면 여기만 고친다 */
const HEADER_MAP: Record<string, keyof RawColumns> = {
  상품코드: 'sku',
  상품명: 'name',
  판매가: 'price',
  할인가: 'salePrice',
  재고: 'stock',
};

type RawColumns = { sku: number; name: number; price: number; salePrice: number; stock: number };

function cellNumber(value: ExcelJS.CellValue): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value.replaceAll(',', ''));
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function cellText(value: ExcelJS.CellValue): string {
  return value == null ? '' : String(value).trim();
}

async function readRows(): Promise<PriceRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFile);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error('시트가 없습니다');

  // 1행 헤더에서 컬럼 위치를 찾는다. 컬럼 순서가 바뀌어도 동작하게
  const columns: Partial<RawColumns> = {};
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const field = HEADER_MAP[cellText(cell.value)];
    if (field) columns[field] = colNumber;
  });
  if (!columns.sku || !columns.price) {
    throw new Error(`헤더에서 상품코드/판매가 컬럼을 찾지 못했습니다. 기대 헤더: ${Object.keys(HEADER_MAP).join(', ')}`);
  }

  const rows: PriceRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // 헤더
    const sku = cellText(row.getCell(columns.sku!).value);
    if (!sku && !cellText(row.getCell(columns.name ?? 0)?.value ?? null)) return; // 완전 빈 행
    rows.push({
      sku,
      name: columns.name ? cellText(row.getCell(columns.name).value) || null : null,
      price: cellNumber(row.getCell(columns.price!).value),
      salePrice: columns.salePrice ? cellNumber(row.getCell(columns.salePrice).value) : null,
      stock: columns.stock ? cellNumber(row.getCell(columns.stock).value) : null,
      sourceLabel: `${rowNumber}행`,
    });
  });
  return rows;
}

async function main() {
  const rows = await readRows();
  const result = validateRows(rows, PRODUCTS);

  writeSyncOutputs(rootDir, 'excel', path.basename(excelFile), result);
  printSummary(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCpuRows, nameToIds } from '../lib/price-sync/hcell';
import { printSummary, writeSyncOutputs } from '../lib/price-sync/output';
import { validateRows, type PriceRow } from '../lib/price-sync/validate';
import { PRODUCTS } from '../lib/shop/catalog';

/**
 * 실물 CPU 비교표(한셀)용 가격 갱신 수집기.
 *
 *   사용법: npx tsx scripts/price-sync-hcell.ts "C:\...\CPU 비교표.xlsx"
 *
 * 상품 목록 자체를 다시 만드는 임포트(scripts/import-catalog-hcell.ts)와 달리,
 * 이 스크립트는 이미 카탈로그에 있는 상품의 가격만 검증을 거쳐 갱신한다.
 * 임계치·거부 규칙·리포트는 표준 엑셀 수집기와 같은 코드를 쓴다 (설계 8-2).
 *
 * 매칭: 비교표 상품명 → nameToIds() 로 SKU 를 만들고 카탈로그와 잇는다.
 * 카탈로그에 없는 SKU(신상품)는 검증에서 '보류'로 잡힌다 — 신상품 추가는
 * 가격 갱신이 아니라 임포트의 몫이기 때문이다.
 */

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('사용법: npx tsx scripts/price-sync-hcell.ts <비교표.xlsx 경로>');
    process.exit(1);
  }

  const cpuRows = extractCpuRows(fs.readFileSync(inputFile));

  const rows: PriceRow[] = [];
  let skipped = 0;
  for (const row of cpuRows) {
    if (row.currentPrice === null) {
      skipped += 1; // 현재가 없음 — 취급 중단 상품이라 갱신 대상 아님
      continue;
    }
    rows.push({
      sku: nameToIds(row.name).sku,
      name: row.name,
      price: Math.round(row.currentPrice),
      // 비교표의 현재가는 시장 실가라 할인 개념이 없다 → 할인 제거로 반영
      salePrice: null,
      stock: null, // 재고 컬럼 없음 — 변경하지 않는다
      sourceLabel: `${row.rowNum}행`,
    });
  }

  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const result = validateRows(rows, PRODUCTS);

  writeSyncOutputs(rootDir, 'hcell-cpu', path.basename(inputFile), result);
  console.log(`비교표 ${cpuRows.length}행 중 갱신 대상 ${rows.length}건, 현재가 없어 건너뜀 ${skipped}건`);
  printSummary(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

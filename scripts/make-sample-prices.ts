import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';

/**
 * 샘플 가격표 생성기.
 *
 * 실제 현행 엑셀을 아직 받지 못해, 파이프라인이 기대하는 형식을 이 파일로
 * 정의해 둔다. 실물을 받으면 이 형식에 맞추거나(권장: SKU 컬럼 추가),
 * scripts/price-sync.ts 의 헤더 매핑을 실물에 맞춘다.
 *
 * 일부러 문제 있는 행을 섞어 검증 단계가 잡아내는 걸 시연한다.
 */

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ROWS: [string, string, number | null, number | null, number | null][] = [
  // [상품코드, 상품명(참고), 판매가, 할인가, 재고]
  ['SSD-SAM-990P2T', '삼성전자 990 PRO 2TB', 249000, 224000, 30], // 할인가 인하 → 반영
  ['CPU-INT-14400F', '인텔 코어 i5-14400F', 249000, 228000, 40], // 변동 없음 → 반영
  ['GPU-MSI-5080', 'MSI RTX 5080 GAMING TRIO', 1990000, null, 4], // 할인 없음 → 반영
  ['RAM-SAM-D5-32', '삼성전자 DDR5-5600 16GB x2', 13900, null, 50], // 자릿수 오타 → 보류
  ['SSD-XXX-9999', '단종된 예전 SSD', 100000, null, 5], // 없는 상품코드 → 보류
  ['PSU-SEA-550', '시소닉 FOCUS GX-550', 0, null, 22], // 가격 0 → 거부
  ['MON-LGE-27GS60', 'LG 울트라기어 27GS60F', 289000, 259000, 17], // 중복 앞행 → 거부
  ['MON-LGE-27GS60', 'LG 울트라기어 27GS60F', 289000, 259000, 16], // 중복 마지막 행 → 반영
];

async function main() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('가격표');

  sheet.addRow(['상품코드', '상품명', '판매가', '할인가', '재고']);
  for (const row of ROWS) sheet.addRow(row);

  const outFile = path.join(rootDir, 'data', 'prices.xlsx');
  await workbook.xlsx.writeFile(outFile);
  console.log(`생성: ${outFile} (${ROWS.length}행)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

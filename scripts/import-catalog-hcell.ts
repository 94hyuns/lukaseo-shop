import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCpuRows, nameToBrand, nameToIds } from '../lib/price-sync/hcell';

/**
 * 실물 CPU 비교표(한셀) → 상품 마스터 임포트.
 *
 *   사용법: npx tsx scripts/import-catalog-hcell.ts "C:\...\CPU 비교표.xlsx"
 *
 * "엑셀이 원본"이라는 결정에 따라, CPU 카테고리의 상품 목록 자체를
 * 비교표에서 생성한다 (data/catalog-cpu.json). 카탈로그 코드는 이 파일을
 * 읽어 상품으로 만들고, 소켓·TDP 같은 조립 스펙은 lib/shop/cpu-specs.ts 의
 * 수동 보강표에서 얹는다 — 비교표에는 그 정보가 없기 때문이다.
 *
 * 규칙:
 *   현재가(I) 없는 행  → 취급 중단으로 보고 제외
 *   특이사항에 '품절'  → 재고 0 · soldout
 *   그 외              → 재고 10 (비교표에 재고 개념이 없어 기본값)
 *
 * ⚠️ 실물 비교표 파일 자체는 저장소에 커밋하지 않는다.
 */

export type CatalogCpuEntry = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  status: 'active' | 'soldout';
  note: string | null;
  perfGame: number | null;
  perfSingle: number | null;
  perfMulti: number | null;
};

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('사용법: npx tsx scripts/import-catalog-hcell.ts <비교표.xlsx 경로>');
    process.exit(1);
  }

  const rows = extractCpuRows(fs.readFileSync(inputFile));

  // 같은 이름이 두 번 나오면 마지막 행을 채택한다 — 가격 갱신 검증(설계 8-3)과
  // 같은 정책이어야 임포트와 갱신의 결과가 어긋나지 않는다
  const bySlug = new Map<string, CatalogCpuEntry>();
  let dropped = 0;

  for (const row of rows) {
    if (row.currentPrice === null || row.currentPrice <= 0) {
      dropped += 1; // 현재가 없음 — 취급 중단
      continue;
    }

    const { slug, sku } = nameToIds(row.name);
    if (bySlug.has(slug)) {
      console.warn(`  [중복] "${row.name}" — 마지막 행(${row.rowNum}행)의 값을 채택`);
    }

    const soldout = row.note?.includes('품절') ?? false;
    bySlug.set(slug, {
      slug,
      sku,
      name: row.name,
      brand: nameToBrand(row.name),
      price: Math.round(row.currentPrice),
      stock: soldout ? 0 : 10,
      status: soldout ? 'soldout' : 'active',
      note: row.note,
      perfGame: row.perfGame,
      perfSingle: row.perfSingle,
      perfMulti: row.perfMulti,
    });
  }

  const entries = [...bySlug.values()];

  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  fs.writeFileSync(
    path.join(rootDir, 'data', 'catalog-cpu.json'),
    JSON.stringify(entries, null, 2) + '\n',
  );

  const soldoutCount = entries.filter((entry) => entry.status === 'soldout').length;
  console.log(
    `비교표 ${rows.length}행 → 상품 ${entries.length}개 (품절 ${soldoutCount}) · 현재가 없어 제외 ${dropped}행`,
  );
  console.log('data/catalog-cpu.json 갱신됨');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

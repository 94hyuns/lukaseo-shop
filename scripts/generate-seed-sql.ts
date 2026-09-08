/**
 * 현재 코드 카탈로그(CATEGORIES + PRODUCTS)를 Supabase 시드 SQL로 변환한다.
 *
 *   npx tsx scripts/generate-seed-sql.ts
 *
 * 출력: supabase/seed/0002_catalog_seed.sql
 *
 * - 빈 DB에 1회 실행하는 용도다. 재실행하면 slug 충돌로 멈춘다(의도).
 * - PRICE_OVERRIDES 가 이미 적용된 최종 가격이 들어간다.
 * - 판별 유니온 spec 은 key-value 행으로 펼친다. 'kind' 행이 항상 첫 행이라
 *   어댑터가 이 값으로 유니온을 복원한다. 배열은 JSON 문자열로 둔다.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { CATEGORIES, PRODUCTS } from '../lib/shop/catalog';

/** 작은따옴표를 이스케이프한 SQL 문자열 리터럴 */
function q(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'number') return String(value);
  return q(String(value));
}

const lines: string[] = [
  '-- 코드 카탈로그 → DB 시드 (scripts/generate-seed-sql.ts 가 생성)',
  `-- 생성 시각: ${new Date().toISOString()}`,
  'begin;',
  '',
  '-- 카테고리',
];

CATEGORIES.forEach((c, i) => {
  lines.push(
    `insert into categories (slug, name, sort_order) values (${q(c.slug)}, ${q(c.name)}, ${i * 10});`,
  );
});

lines.push('', '-- 상품');

for (const p of PRODUCTS) {
  lines.push(
    'insert into products (category_id, slug, sku, name, brand, price, sale_price, stock, status, short_desc, description)',
    `values ((select id from categories where slug = ${q(p.categorySlug)}), ${q(p.slug)}, ${q(p.sku)}, ${q(p.name)}, ${q(p.brand)}, ${p.price}, ${sqlValue(p.salePrice)}, ${p.stock}, ${q(p.status)}, ${q(p.shortDesc)}, ${q(p.description)});`,
  );

  // spec 을 key-value 로 펼친다. kind 를 sort_order 0 으로 고정
  const entries = Object.entries(p.spec) as [string, unknown][];
  entries.sort(([a], [b]) => (a === 'kind' ? -1 : b === 'kind' ? 1 : 0));
  entries.forEach(([key, value], i) => {
    const serialized =
      Array.isArray(value) ? JSON.stringify(value) : String(value);
    lines.push(
      `insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = ${q(p.slug)}), ${q(key)}, ${q(serialized)}, ${i});`,
    );
  });

  if (p.badges && p.badges.length > 0) {
    lines.push(
      `insert into product_specs (product_id, spec_key, spec_value, sort_order) values ((select id from products where slug = ${q(p.slug)}), 'badges', ${q(JSON.stringify(p.badges))}, 99);`,
    );
  }
}

lines.push(
  '',
  '-- 가격 갱신 설정 싱글턴 행',
  'insert into price_sync_settings (id) values (1);',
  '',
  'commit;',
  '',
);

const outPath = join(__dirname, '..', 'supabase', 'seed', '0002_catalog_seed.sql');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join('\n'), 'utf8');

const productCount = PRODUCTS.length;
const specRows = lines.filter((l) => l.includes('product_specs')).length;
console.log(
  `완료: 카테고리 ${CATEGORIES.length}, 상품 ${productCount}, 스펙 행 ${specRows} → ${outPath}`,
);

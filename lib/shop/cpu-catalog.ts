import rawCatalogCpu from '../../data/catalog-cpu.json';
import { CPU_ENRICHMENT } from './cpu-specs';
import type { Product } from './types';

/**
 * CPU 상품은 실물 비교표(엑셀)가 원본이다.
 *
 * scripts/import-catalog-hcell.ts 가 비교표를 data/catalog-cpu.json 으로
 * 내려주면, 여기서 상품으로 만든다. 조립 스펙(소켓·TDP 등)은 비교표에
 * 없어서 cpu-specs.ts 의 수동 보강표에서 얹고, 보강이 없는 모델은
 * 비교표의 성능 수치를 그대로 보여주는 상품이 된다 (견적짜기 제외).
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

const ENTRIES = rawCatalogCpu as CatalogCpuEntry[];

function perfHighlights(entry: CatalogCpuEntry): string[] {
  const highlights: string[] = [];
  if (entry.perfGame !== null) highlights.push(`FHD 게임 ${entry.perfGame.toFixed(2)}`);
  if (entry.perfSingle !== null) highlights.push(`싱글 ${entry.perfSingle.toFixed(2)}`);
  if (entry.perfMulti !== null) highlights.push(`멀티 ${entry.perfMulti.toFixed(2)}`);
  return highlights.length > 0 ? highlights : ['비교표 등재 상품'];
}

function buildShortDesc(entry: CatalogCpuEntry): string {
  const parts: string[] = [];
  if (entry.perfGame !== null) parts.push(`FHD 게임 상대성능 ${entry.perfGame.toFixed(2)}`);
  if (entry.perfMulti !== null) parts.push(`멀티스레드 ${entry.perfMulti.toFixed(2)}`);
  return parts.length > 0
    ? `${parts.join(' · ')} (RTX 5070 조합 기준)`
    : '실물 가격 비교표에서 가져온 상품입니다.';
}

function buildDescription(entry: CatalogCpuEntry): string {
  const note = entry.note ? ` 매입 특이사항: ${entry.note}.` : '';
  return (
    '실물 가격 비교표에서 가져온 상품입니다. 성능 수치는 RTX 5070 조합, FHD 해상도 기준의 상대값입니다.' +
    `${note} 조립 스펙(소켓·TDP)이 아직 등록되지 않아 견적짜기에는 나타나지 않습니다.`
  );
}

export function buildCpuProducts(): Product[] {
  return ENTRIES.map((entry) => {
    const enrichment = CPU_ENRICHMENT[entry.sku];

    return {
      slug: entry.slug,
      sku: entry.sku,
      name: entry.name,
      brand: entry.brand,
      categorySlug: 'cpu',
      price: entry.price,
      stock: entry.stock,
      status: entry.status,
      shortDesc: enrichment?.shortDesc ?? buildShortDesc(entry),
      description: enrichment?.description ?? buildDescription(entry),
      spec: enrichment?.spec ?? { kind: 'generic', highlights: perfHighlights(entry) },
      ...(enrichment?.badges ? { badges: enrichment.badges } : {}),
    };
  });
}

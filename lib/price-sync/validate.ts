import type { Product } from '../shop/types';

/**
 * 가격 갱신 검증 (설계문서 8-3).
 *
 * 수집원이 엑셀이든 네이버 API 든, 이 검증 단계는 공통이다. 그래서 파일을
 * 읽는 쪽(scripts/price-sync.ts)과 분리해 순수 함수로 둔다 — 입력을 넣으면
 * 판정이 나오는 형태라야 테스트가 붙고, 나중에 수집원을 추가해도 이 코드는
 * 그대로 재사용된다.
 *
 * 매칭 키는 상품코드(SKU) 1순위다. 상품명 매칭은 띄어쓰기·모델명 표기
 * 차이로 반드시 실패한다 (설계문서 8-4).
 */

/** 수집 단계가 넘겨주는 행 하나. 값이 비어 있으면 null */
export type PriceRow = {
  sku: string;
  /** 참고용 상품명. 매칭에는 쓰지 않는다 */
  name: string | null;
  price: number | null;
  salePrice: number | null;
  stock: number | null;
  /** '3행' 처럼 출처를 가리키는 라벨. 리포트에서 원본을 찾아가는 용도 */
  sourceLabel: string;
};

/**
 * ok       그대로 반영해도 되는 행
 * held     사람이 봐야 하는 행 — 매칭 실패, 급격한 변동
 * rejected 반영하면 안 되는 행 — 값 자체가 틀림
 */
export type SyncVerdict = 'ok' | 'held' | 'rejected';

export type SyncItem = {
  sku: string;
  productSlug: string | null;
  productName: string | null;
  oldPrice: number | null;
  newPrice: number | null;
  oldSalePrice: number | null;
  newSalePrice: number | null;
  oldStock: number | null;
  newStock: number | null;
  verdict: SyncVerdict;
  reason: string | null;
  sourceLabel: string;
};

export type SyncResult = {
  items: SyncItem[];
  counts: { total: number; ok: number; held: number; rejected: number };
};

/** 전일 대비 이 비율을 넘는 변동은 보류한다. 자릿수 오타가 이 한 줄로 걸린다 */
export const DEFAULT_CHANGE_THRESHOLD = 0.3;

function isValidPrice(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && Number.isInteger(value) && value > 0;
}

export function validateRows(
  rows: PriceRow[],
  products: Product[],
  changeThreshold: number = DEFAULT_CHANGE_THRESHOLD,
): SyncResult {
  const bySku = new Map(products.map((product) => [product.sku, product]));

  // 동일 SKU 중복 행은 마지막 값을 채택한다 (설계문서 8-3)
  const lastIndexBySku = new Map<string, number>();
  rows.forEach((row, index) => {
    if (row.sku) lastIndexBySku.set(row.sku, index);
  });

  const items = rows.map((row, index): SyncItem => {
    const product = row.sku ? (bySku.get(row.sku) ?? null) : null;

    const base: Omit<SyncItem, 'verdict' | 'reason'> = {
      sku: row.sku,
      productSlug: product?.slug ?? null,
      productName: product?.name ?? row.name,
      oldPrice: product?.price ?? null,
      newPrice: row.price,
      oldSalePrice: product?.salePrice ?? null,
      newSalePrice: row.salePrice,
      oldStock: product?.stock ?? null,
      newStock: row.stock,
      sourceLabel: row.sourceLabel,
    };

    if (!row.sku) {
      return { ...base, verdict: 'rejected', reason: '상품코드가 비어 있음' };
    }

    const lastIndex = lastIndexBySku.get(row.sku);
    if (lastIndex !== undefined && lastIndex !== index) {
      return {
        ...base,
        verdict: 'rejected',
        reason: `중복 행 — 마지막 행(${rows[lastIndex].sourceLabel})의 값을 채택`,
      };
    }

    if (!isValidPrice(row.price)) {
      return { ...base, verdict: 'rejected', reason: '판매가가 없거나 0 이하' };
    }

    if (row.salePrice !== null) {
      if (!isValidPrice(row.salePrice)) {
        return { ...base, verdict: 'rejected', reason: '할인가가 0 이하' };
      }
      if (row.salePrice > row.price) {
        return { ...base, verdict: 'rejected', reason: '할인가가 정가보다 높음' };
      }
    }

    if (row.stock !== null && (!Number.isInteger(row.stock) || row.stock < 0)) {
      return { ...base, verdict: 'rejected', reason: '재고가 음수이거나 정수가 아님' };
    }

    if (!product) {
      return { ...base, verdict: 'held', reason: '일치하는 상품코드가 카탈로그에 없음' };
    }

    const changeRate = Math.abs(row.price - product.price) / product.price;
    if (changeRate > changeThreshold) {
      const percent = Math.round(changeRate * 100);
      return {
        ...base,
        verdict: 'held',
        reason: `현재가 대비 ${percent}% 변동 — 임계치(${Math.round(changeThreshold * 100)}%) 초과. 오타 의심`,
      };
    }

    return { ...base, verdict: 'ok', reason: null };
  });

  return {
    items,
    counts: {
      total: items.length,
      ok: items.filter((item) => item.verdict === 'ok').length,
      held: items.filter((item) => item.verdict === 'held').length,
      rejected: items.filter((item) => item.verdict === 'rejected').length,
    },
  };
}

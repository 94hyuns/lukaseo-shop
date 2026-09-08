'use client';

/**
 * 정적 카탈로그 위에 DB 실시간 값을 덮는 오버레이.
 *
 * 고객 페이지는 빌드 시점 데이터 그대로 두고(빠름, SEO), 관리자 화면만
 * 마운트 후 한 번 DB 를 조회해 가격·재고·상태를 최신으로 바꾼다.
 * 조회가 실패해도 화면은 그대로 뜬다 — 원래 보여주던 정적 데이터가 폴백이다.
 */

import { useEffect, useState } from 'react';
import type { Product } from './types';
import { fetchLiveProducts, type LiveProductRow } from './supabase';

export type LiveState = 'loading' | 'live' | 'offline';

export function useLiveOverrides(): {
  state: LiveState;
  overrides: Map<string, LiveProductRow> | null;
} {
  const [state, setState] = useState<LiveState>('loading');
  const [overrides, setOverrides] = useState<Map<string, LiveProductRow> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLiveProducts().then((rows) => {
      if (cancelled) return;
      if (rows === null) {
        setState('offline');
        return;
      }
      setOverrides(new Map(rows.map((row) => [row.slug, row])));
      setState('live');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { state, overrides };
}

/**
 * DB 행이 있으면 그 값으로 바꾼 상품을, 없으면 원본 그대로 돌려준다.
 *
 * RLS 가 hidden 행을 아예 반환하지 않으므로, live 상태에서 조회 결과에
 * 없는 상품 = DB 에서 숨겨졌거나 삭제된 상품이다. 그 판정은 missingFromDb 로.
 */
export function applyLive(
  product: Product,
  overrides: Map<string, LiveProductRow> | null,
): Product {
  const row = overrides?.get(product.slug);
  if (!row) return product;
  const status = row.status === 'active' ? 'active' : 'soldout';
  return {
    ...product,
    price: row.price,
    salePrice: row.sale_price ?? undefined,
    stock: row.stock,
    status,
  };
}

/** live 조회가 성공했는데도 DB 에 없는(숨김·삭제된) 상품인지 */
export function missingFromDb(
  product: Product,
  state: LiveState,
  overrides: Map<string, LiveProductRow> | null,
): boolean {
  return state === 'live' && overrides !== null && !overrides.has(product.slug);
}

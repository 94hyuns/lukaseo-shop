'use client';

/**
 * 상품 slug ↔ DB id 매핑.
 *
 * 프론트 카탈로그는 slug 로 움직이지만 cart_items·build_items 의 FK 는
 * products.id(bigint)다. 여기서 한 번 조회해 세션 동안 캐시한다.
 */

import { getSupabase } from './supabaseClient';

let cached: Promise<Map<string, number> | null> | null = null;

export function getProductIdMap(): Promise<Map<string, number> | null> {
  if (!cached) {
    cached = (async () => {
      const supabase = getSupabase();
      if (!supabase) return null;
      const { data, error } = await supabase.from('products').select('id, slug').limit(1000);
      if (error || !data) {
        cached = null; // 다음 호출에서 재시도
        return null;
      }
      return new Map(data.map((row: { id: number; slug: string }) => [row.slug, row.id]));
    })();
  }
  return cached;
}

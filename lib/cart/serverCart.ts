/**
 * 서버(DB) 장바구니 동기화 (설계문서 10장 4단계).
 *
 * 동작 원칙:
 * - localStorage 가 항상 화면의 원본이다. 서버는 "로그인 계정에 백업"이다.
 *   네트워크가 죽어도 장바구니는 동작해야 한다.
 * - 로그인 직후 한 번: 서버 ↔ 로컬을 병합해 양쪽에 쓴다.
 * - 이후 로컬이 바뀔 때마다: 서버 행을 통째로 교체한다 (행이 몇 개 안 된다).
 *
 * mergeLines 는 순수 함수로 분리해 테스트한다.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { StoredLine } from './store';

/**
 * 로컬·서버 장바구니 병합.
 *
 * 같은 상품이 양쪽에 있으면 큰 수량을 택한다. 합산하면 로그인을 반복할
 * 때마다 수량이 불어나는 사고가 난다 (병합 결과가 다시 서버에 저장되므로).
 */
export function mergeLines(local: StoredLine[], server: StoredLine[]): StoredLine[] {
  const merged = new Map<string, number>();
  for (const line of [...server, ...local]) {
    const prev = merged.get(line.slug) ?? 0;
    merged.set(line.slug, Math.max(prev, line.quantity));
  }
  return [...merged.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([slug, quantity]) => ({ slug, quantity }));
}

/** 내 장바구니 행을 찾고, 없으면 만든다 */
async function ensureCartId(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single();
  if (error || !created) return null;
  return created.id as string;
}

/** 서버 장바구니를 slug 기준으로 읽는다. 실패하면 null */
export async function fetchServerCart(
  supabase: SupabaseClient,
  userId: string,
): Promise<StoredLine[] | null> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity, products(slug), carts!inner(user_id)')
    .eq('carts.user_id', userId);
  if (error || !data) return null;

  return data.flatMap((row) => {
    const slug = (row.products as unknown as { slug: string } | null)?.slug;
    return slug ? [{ slug, quantity: row.quantity as number }] : [];
  });
}

/** 서버 장바구니를 lines 로 통째로 교체한다 */
export async function replaceServerCart(
  supabase: SupabaseClient,
  userId: string,
  lines: StoredLine[],
  idMap: Map<string, number>,
): Promise<boolean> {
  const cartId = await ensureCartId(supabase, userId);
  if (!cartId) return false;

  const { error: deleteError } = await supabase.from('cart_items').delete().eq('cart_id', cartId);
  if (deleteError) return false;

  const rows = lines.flatMap((line) => {
    const productId = idMap.get(line.slug);
    // DB 에 없는 상품(카탈로그가 앞선 경우)은 서버 백업에서만 빠진다
    return productId ? [{ cart_id: cartId, product_id: productId, quantity: line.quantity }] : [];
  });
  if (rows.length === 0) return true;

  const { error: insertError } = await supabase.from('cart_items').insert(rows);
  return !insertError;
}

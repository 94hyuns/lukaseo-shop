'use client';

/**
 * 견적 저장·조회 (builds / build_items, 설계문서 7장).
 *
 * 저장은 로그인 사용자의 RLS 정책("본인 견적 관리")으로 이뤄지고,
 * 불러오기는 계정 페이지가 저장된 구성을 기존 공유 토큰(?b=)으로
 * 인코딩해 /builder 로 링크한다 — 빌더 쪽 복원 코드를 재사용한다.
 */

import { getSupabase } from '@/lib/shop/supabaseClient';
import { getProductIdMap } from '@/lib/shop/productIds';
import type { BuildSlots } from './compatibility';
import type { PartSlot } from '@/lib/shop/types';

export type SavedBuild = {
  id: string;
  name: string;
  createdAt: string;
  /** 공유 링크가 발급됐으면 그 토큰 */
  shareToken: string | null;
  /** 슬롯 → 상품 slug. 토큰 인코딩과 화면 표시에 쓴다 */
  slots: Partial<Record<PartSlot, string>>;
};

export async function saveBuild(name: string, build: BuildSlots): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return false;

  const idMap = await getProductIdMap();
  if (!idMap) return false;

  const { data: created, error } = await supabase
    .from('builds')
    .insert({ user_id: userId, name })
    .select('id')
    .single();
  if (error || !created) return false;

  const rows = Object.entries(build).flatMap(([slot, product]) => {
    const productId = idMap.get(product.slug);
    return productId ? [{ build_id: created.id, slot, product_id: productId }] : [];
  });
  if (rows.length === 0) return true;

  const { error: itemsError } = await supabase.from('build_items').insert(rows);
  if (itemsError) {
    // 품목을 못 넣었으면 빈 견적을 남기지 않는다
    await supabase.from('builds').delete().eq('id', created.id);
    return false;
  }
  return true;
}

export async function listMyBuilds(): Promise<SavedBuild[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('builds')
    .select('id, name, created_at, share_token, build_items(slot, products(slug))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return null;

  return data.map((row) => {
    const slots: Partial<Record<PartSlot, string>> = {};
    for (const item of row.build_items as unknown as {
      slot: PartSlot;
      products: { slug: string } | null;
    }[]) {
      if (item.products?.slug) slots[item.slot] = item.products.slug;
    }
    return {
      id: row.id as string,
      name: row.name as string,
      createdAt: row.created_at as string,
      shareToken: (row.share_token as string | null) ?? null,
      slots,
    };
  });
}

/** URL 에 쓸 무작위 토큰. 추측 불가능하면 충분하다 — 비밀값이 아니라 공유용이다 */
function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

/**
 * 견적을 공개로 전환하고 공유 토큰을 돌려준다. 이미 발급됐으면 그 토큰 재사용.
 * 쓰기 권한은 RLS "본인 견적 관리"가 검사한다.
 */
export async function shareBuild(id: string, existingToken: string | null): Promise<string | null> {
  if (existingToken) return existingToken;
  const supabase = getSupabase();
  if (!supabase) return null;

  const token = randomToken();
  const { error } = await supabase
    .from('builds')
    .update({ is_public: true, share_token: token })
    .eq('id', id);
  return error ? null : token;
}

/**
 * 공유 토큰으로 견적 구성을 읽는다 (비로그인 포함 누구나).
 * RLS "공개 견적은 누구나 조회"(is_public = true)가 열어준다.
 */
export async function fetchSharedBuild(
  token: string,
): Promise<Partial<Record<PartSlot, string>> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('builds')
    .select('build_items(slot, products(slug))')
    .eq('share_token', token)
    .maybeSingle();
  if (error || !data) return null;

  const slots: Partial<Record<PartSlot, string>> = {};
  for (const item of data.build_items as unknown as {
    slot: PartSlot;
    products: { slug: string } | null;
  }[]) {
    if (item.products?.slug) slots[item.slot] = item.products.slug;
  }
  return slots;
}

export async function deleteBuild(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('builds').delete().eq('id', id);
  return !error;
}

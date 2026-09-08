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
    .select('id, name, created_at, build_items(slot, products(slug))')
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
      slots,
    };
  });
}

export async function deleteBuild(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('builds').delete().eq('id', id);
  return !error;
}

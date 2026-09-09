'use client';

/**
 * DB 구매후기 (reviews 테이블).
 *
 * 조회는 누구나, 작성·삭제는 본인만 — 전부 RLS 정책이 강제한다
 * (0001_init.sql). 여기는 supabase-js 호출을 화면이 쓰기 좋게 감쌀 뿐이다.
 *
 * 작성자 표기: auth.users 는 클라이언트에 노출되지 않아 남의 이메일은
 * 알 수 없다(알아서도 안 된다). user_id 앞 4자로 "회원 xxxx"라고만 쓴다.
 */

import { getSupabase } from './supabaseClient';
import { getProductIdMap } from './productIds';

export type DbReview = {
  id: number;
  userId: string;
  rating: number;
  body: string;
  /** 'YYYY-MM-DD' */
  createdAt: string;
};

export function reviewAuthorLabel(userId: string): string {
  return `회원 ${userId.slice(0, 4)}`;
}

export async function fetchProductReviews(slug: string): Promise<DbReview[] | null> {
  const supabase = getSupabase();
  const idMap = await getProductIdMap();
  const productId = idMap?.get(slug);
  if (!supabase || !productId) return null;

  const { data, error } = await supabase
    .from('reviews')
    .select('id, user_id, rating, body, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error || !data) return null;

  return data.map((row) => ({
    id: row.id as number,
    userId: row.user_id as string,
    rating: row.rating as number,
    body: row.body as string,
    createdAt: String(row.created_at).slice(0, 10),
  }));
}

export async function addReview(
  slug: string,
  rating: number,
  body: string,
): Promise<boolean> {
  const supabase = getSupabase();
  const idMap = await getProductIdMap();
  const productId = idMap?.get(slug);
  if (!supabase || !productId) return false;

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return false;

  const { error } = await supabase
    .from('reviews')
    .insert({ product_id: productId, user_id: userId, rating, body });
  return !error;
}

export async function deleteReview(id: number): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  return !error;
}

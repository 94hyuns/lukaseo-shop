'use client';

/**
 * supabase-js 싱글턴 (브라우저 전용).
 *
 * 익명 읽기(lib/shop/supabase.ts)는 fetch 로 충분하지만, 인증 세션 관리
 * (토큰 갱신·탭 간 동기화)와 로그인 사용자의 RLS 쓰기는 supabase-js 에
 * 맡기는 게 맞다. 직접 짜면 그게 다 버그 표면이 된다.
 *
 * publishable 키만 쓴다 — 로그인 후의 권한은 키가 아니라 세션 토큰과
 * RLS 정책이 결정한다.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/** 환경변수가 없으면 null — 호출부는 로그인 기능을 조용히 숨긴다 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

'use client';

/**
 * 로그인 상태와 장바구니 저장소를 잇는 동기화 훅. CartProvider 가 쓴다.
 *
 * - 로그인 감지 → 서버·로컬 병합 1회 (mergeLines)
 * - 이후 로컬 변경 → 짧은 디바운스 뒤 서버 교체
 * - 병합이 로컬을 갱신할 때 그 갱신이 다시 서버 쓰기를 트리거하지 않도록
 *   suppress 플래그로 한 바퀴 막는다.
 */

import { useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth/useSession';
import { getSupabase } from '@/lib/shop/supabaseClient';
import { getProductIdMap } from '@/lib/shop/productIds';
import { fetchServerCart, mergeLines, replaceServerCart } from './serverCart';
import { getSnapshot, subscribe, update } from './store';

const PUSH_DELAY_MS = 800;

export function useCartSync(): void {
  const { session } = useSession();
  const userId = session?.user.id ?? null;
  const suppressPush = useRef(false);
  const timer = useRef<number | null>(null);

  // 로그인 직후 병합
  useEffect(() => {
    if (!userId) return;
    const supabase = getSupabase();
    if (!supabase) return;

    let cancelled = false;
    (async () => {
      const [server, idMap] = await Promise.all([
        fetchServerCart(supabase, userId),
        getProductIdMap(),
      ]);
      if (cancelled || server === null || idMap === null) return;

      const merged = mergeLines(getSnapshot(), server);
      suppressPush.current = true;
      update(() => merged);
      suppressPush.current = false;
      await replaceServerCart(supabase, userId, merged, idMap);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // 로컬 변경 → 서버 반영
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribe(() => {
      if (suppressPush.current) return;
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(async () => {
        const supabase = getSupabase();
        const idMap = await getProductIdMap();
        if (!supabase || !idMap) return;
        await replaceServerCart(supabase, userId, getSnapshot(), idMap);
      }, PUSH_DELAY_MS);
    });

    return () => {
      unsubscribe();
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [userId]);
}

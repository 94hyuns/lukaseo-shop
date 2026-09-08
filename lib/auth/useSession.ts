'use client';

/**
 * 로그인 세션 훅.
 *
 * supabase-js 가 localStorage 에 세션을 들고 토큰 갱신까지 해주므로,
 * 여기서는 onAuthStateChange 를 React 상태로 이어주기만 한다.
 */

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/shop/supabaseClient';

export function useSession(): {
  session: Session | null;
  /** 저장된 세션을 읽어보기 전(첫 렌더)에는 false */
  isReady: boolean;
} {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      // 환경변수가 빠진 빌드 — 로그인 기능만 조용히 꺼진다
      queueMicrotask(() => setIsReady(true));
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  return { session, isReady };
}

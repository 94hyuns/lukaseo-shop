'use client';

import { useSyncExternalStore } from 'react';

/**
 * 모션 최소화 설정을 구독한다.
 *
 * useEffect 에서 matchMedia 를 읽어 상태에 복사하면, 설정을 바꿔도 반영되지
 * 않고 렌더가 한 번 더 돈다. 미디어쿼리는 React 밖의 시스템이므로
 * useSyncExternalStore 로 직접 구독하는 편이 맞다.
 */

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(listener: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** 서버에는 미디어쿼리가 없다. 애니메이션이 있는 쪽을 기본값으로 둔다 */
function getServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

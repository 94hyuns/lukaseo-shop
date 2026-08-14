/**
 * 장바구니의 실제 저장소.
 *
 * React 상태로 들고 있다가 useEffect 에서 localStorage 를 읽는 방식도 되지만,
 * 그건 "외부 시스템의 값을 React 상태로 복사"하는 안티패턴이다. localStorage 는
 * React 밖에 있는 저장소이므로, useSyncExternalStore 가 읽을 수 있는 형태로
 * 구독·스냅샷을 직접 제공한다. 다른 탭에서 담은 것도 이 구조라야 따라온다.
 */

const STORAGE_KEY = 'lukaseo-shop.cart.v1';

export type StoredLine = { slug: string; quantity: number };

type Listener = () => void;

const listeners = new Set<Listener>();

/** 서버(빌드 시점)에는 저장소가 없다. 항상 같은 배열을 돌려줘야 무한 렌더를 피한다 */
const EMPTY: StoredLine[] = [];

/**
 * getSnapshot 은 값이 안 바뀌었으면 '같은 참조'를 돌려줘야 한다.
 * 매번 JSON.parse 하면 새 배열이 나와 React 가 계속 바뀐 것으로 본다.
 */
let cache: StoredLine[] | null = null;

function parse(raw: string | null): StoredLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    // 저장 형식이 바뀌었거나 손상된 항목은 조용히 버린다. 장바구니 하나 때문에
    // 사이트 전체가 흰 화면이 되는 편이 훨씬 나쁘다.
    return parsed.filter(
      (item): item is StoredLine =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as StoredLine).slug === 'string' &&
        typeof (item as StoredLine).quantity === 'number',
    );
  } catch {
    return EMPTY;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  // 다른 탭에서 장바구니를 바꾸면 storage 이벤트가 온다
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function getSnapshot(): StoredLine[] {
  if (cache === null) {
    try {
      cache = parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      // 사파리 프라이빗 모드처럼 localStorage 접근 자체가 막히는 환경이 있다
      cache = EMPTY;
    }
  }
  return cache;
}

export function getServerSnapshot(): StoredLine[] {
  return EMPTY;
}

/** 서버 렌더에서는 false, 클라이언트에서는 true. 값을 읽어왔는지 판단에 쓴다 */
export function getHydrated(): boolean {
  return true;
}

export function getServerHydrated(): boolean {
  return false;
}

/** 갱신 함수를 받아 저장하고 구독자에게 알린다 */
export function update(recipe: (prev: StoredLine[]) => StoredLine[]): void {
  const next = recipe(getSnapshot());
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 저장에 실패해도 이번 세션 동안은 메모리 캐시로 동작시킨다
  }
  emit();
}

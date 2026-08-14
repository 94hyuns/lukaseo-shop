'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import { effectivePrice, getProduct } from '@/lib/shop/catalog';
import type { Product } from '@/lib/shop/types';
import {
  getHydrated,
  getServerHydrated,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  update,
} from './store';

/**
 * 장바구니 상태.
 *
 * 저장은 lib/cart/store.ts 가 맡고 여기서는 화면이 쓰기 좋은 형태로 바꿔준다.
 * 설계문서 10장 4단계에서 "비로그인 localStorage → 로그인 시 서버 장바구니로
 * 병합"으로 확장할 자리다.
 *
 * 저장하는 값은 slug 와 수량뿐이다. 가격을 함께 저장하면 그 값이 곧 낡고,
 * 낡은 가격으로 결제 금액을 계산하는 사고로 이어진다. 금액 스냅샷은
 * 주문을 만드는 시점에 서버가 찍는다 (설계문서 5-3 ②③).
 */

/** 화면에서 쓰는 형태 — 저장된 slug 를 실제 상품으로 풀어놓은 것 */
export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  /** 서로 다른 상품 종류 수 */
  count: number;
  /** 수량까지 합친 총 개수 */
  totalQuantity: number;
  totalPrice: number;
  /** 저장소를 읽기 전에는 false. 배지가 0에서 튀는 걸 막는 데 쓴다 */
  isReady: boolean;
  add: (slug: string, quantity?: number) => void;
  addMany: (slugs: string[]) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isReady = useSyncExternalStore(subscribe, getHydrated, getServerHydrated);

  const add = useCallback((slug: string, quantity = 1) => {
    update((prev) => {
      const found = prev.find((line) => line.slug === slug);
      if (!found) return [...prev, { slug, quantity }];
      return prev.map((line) =>
        line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line,
      );
    });
  }, []);

  /** 견적 → 장바구니 일괄 담기 (설계문서 7장 부가 기능) */
  const addMany = useCallback((slugs: string[]) => {
    update((prev) => {
      const next = [...prev];
      for (const slug of slugs) {
        const index = next.findIndex((line) => line.slug === slug);
        if (index === -1) next.push({ slug, quantity: 1 });
        else next[index] = { ...next[index], quantity: next[index].quantity + 1 };
      }
      return next;
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    update((prev) =>
      quantity <= 0
        ? prev.filter((line) => line.slug !== slug)
        : prev.map((line) => (line.slug === slug ? { ...line, quantity } : line)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    update((prev) => prev.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => update(() => []), []);

  const value = useMemo<CartContextValue>(() => {
    // 카탈로그에서 사라진 상품은 걸러낸다. 목데이터를 고치면 실제로 생기는 상황이다.
    const lines: CartLine[] = stored.flatMap((line) => {
      const product = getProduct(line.slug);
      return product ? [{ product, quantity: line.quantity }] : [];
    });

    return {
      lines,
      count: lines.length,
      totalQuantity: lines.reduce((acc, line) => acc + line.quantity, 0),
      totalPrice: lines.reduce(
        (acc, line) => acc + effectivePrice(line.product) * line.quantity,
        0,
      ),
      isReady,
      add,
      addMany,
      setQuantity,
      remove,
      clear,
    };
  }, [stored, isReady, add, addMany, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart 는 CartProvider 안에서만 쓸 수 있습니다.');
  return context;
}

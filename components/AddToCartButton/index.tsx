'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';
import type { Product } from '@/lib/shop/types';
import styles from './AddToCartButton.module.css';

const FEEDBACK_MS = 2500;

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // 담았다는 표시를 잠깐 띄웠다 지운다. 지우는 타이머는 반드시 정리해야
  // 페이지를 빠져나간 뒤 setState 가 호출되지 않는다.
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [added]);

  if (product.status === 'soldout') {
    return (
      <button type="button" className={`${styles.button} ${styles.buttonDisabled}`} disabled>
        품절
      </button>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.quantityRow}>
        <label className={styles.quantityLabel} htmlFor="quantity">
          수량
        </label>
        <div className={styles.stepper}>
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            aria-label="수량 줄이기"
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) return;
              setQuantity(Math.min(product.stock, Math.max(1, next)));
            }}
          />
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
            aria-label="수량 늘리기"
          >
            +
          </button>
        </div>
        <span className={styles.stock}>재고 {product.stock}개</span>
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={() => {
          add(product.slug, quantity);
          setAdded(true);
        }}
      >
        장바구니 담기
      </button>

      {/* aria-live 로 감싸 두면 스크린리더도 담긴 걸 안다 */}
      <p className={styles.feedback} aria-live="polite">
        {added && (
          <>
            장바구니에 담았습니다. <Link href="/cart">장바구니 보기 →</Link>
          </>
        )}
      </p>
    </div>
  );
}

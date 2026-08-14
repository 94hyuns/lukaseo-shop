'use client';

import Link from 'next/link';
import SpecBadge from '@/components/SpecBadge';
import { useCart } from '@/lib/cart/CartContext';
import { effectivePrice, getCategory } from '@/lib/shop/catalog';
import { featuredSpecs, formatPrice } from '@/lib/shop/format';
import styles from './CartView.module.css';

/** 배송비 정책. 실제 값은 나중에 설정 테이블로 뺀다 */
const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 500000;

export default function CartView() {
  const { lines, totalPrice, isReady, setQuantity, remove, clear } = useCart();

  // localStorage 를 읽기 전에 "장바구니가 비었습니다"를 보여주면
  // 담아둔 사용자에게 잘못된 정보다. 읽을 때까지 자리만 잡아 둔다.
  if (!isReady) {
    return <p className={styles.loading}>장바구니를 불러오는 중…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>장바구니가 비어 있습니다.</p>
        <div className={styles.emptyActions}>
          <Link href="/products" className={styles.emptyLink}>
            상품 둘러보기
          </Link>
          <Link href="/builder" className={styles.emptyLinkPrimary}>
            견적 짜러 가기
          </Link>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return (
    <div className={styles.layout}>
      <div>
        <div className={styles.listHead}>
          <span>{lines.length}개 상품</span>
          <button type="button" className={styles.clearAll} onClick={clear}>
            전체 비우기
          </button>
        </div>

        <ul className={styles.list}>
          {lines.map(({ product, quantity }) => {
            const category = getCategory(product.categorySlug);
            const unit = effectivePrice(product);

            return (
              <li key={product.slug} className={styles.item}>
                <div className={styles.thumb} aria-hidden="true">
                  {category?.icon ?? '📦'}
                </div>

                <div className={styles.info}>
                  <Link href={`/products/${product.slug}`} className={styles.name}>
                    {product.name}
                  </Link>
                  <ul className={styles.specs}>
                    {featuredSpecs(product.spec)
                      .slice(0, 3)
                      .map((spec) => (
                        <li key={spec}>
                          <SpecBadge>{spec}</SpecBadge>
                        </li>
                      ))}
                  </ul>
                  <span className={styles.unit}>개당 {formatPrice(unit)}</span>
                </div>

                <div className={styles.controls}>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.slug, quantity - 1)}
                      aria-label={`${product.name} 수량 줄이기`}
                    >
                      −
                    </button>
                    <span className={styles.quantity}>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.slug, quantity + 1)}
                      aria-label={`${product.name} 수량 늘리기`}
                    >
                      +
                    </button>
                  </div>

                  <strong className={styles.lineTotal}>{formatPrice(unit * quantity)}</strong>

                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => remove(product.slug)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className={styles.summary}>
        <h2 className={styles.summaryTitle}>결제 예정 금액</h2>

        <dl className={styles.summaryList}>
          <div className={styles.summaryRow}>
            <dt>상품 금액</dt>
            <dd>{formatPrice(totalPrice)}</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>배송비</dt>
            <dd>{shipping === 0 ? '무료' : formatPrice(shipping)}</dd>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <dt>합계</dt>
            <dd>{formatPrice(totalPrice + shipping)}</dd>
          </div>
        </dl>

        {shipping > 0 && (
          <p className={styles.shippingNote}>
            {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} 더 담으면 배송비가 무료입니다.
          </p>
        )}

        {/* 결제는 서버 검증이 전제라 뼈대 단계에서 만들지 않는다 (설계문서 5장).
            버튼을 감추는 대신 왜 막혀 있는지 적어 둔다 */}
        <button type="button" className={styles.checkout} disabled>
          주문하기
        </button>
        <p className={styles.checkoutNote}>
          결제는 서버에서 금액을 다시 계산해 검증해야 안전합니다. 이 데모는 정적 사이트라
          결제 단계를 아직 열지 않았습니다.
        </p>
      </aside>
    </div>
  );
}

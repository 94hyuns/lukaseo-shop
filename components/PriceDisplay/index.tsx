import { discountRate, effectivePrice } from '@/lib/shop/catalog';
import { formatPrice } from '@/lib/shop/format';
import type { Product } from '@/lib/shop/types';
import styles from './PriceDisplay.module.css';

type Props = {
  product: Product;
  /** 상세 페이지처럼 금액이 주인공인 자리에서 크게 쓴다 */
  size?: 'md' | 'lg';
};

export default function PriceDisplay({ product, size = 'md' }: Props) {
  const price = effectivePrice(product);
  const rate = discountRate(product);

  return (
    <div className={`${styles.wrap} ${size === 'lg' ? styles.wrapLg : ''}`}>
      {rate > 0 && (
        <div className={styles.originalRow}>
          <span className={styles.rate}>{rate}%</span>
          <s className={styles.original}>{formatPrice(product.price)}</s>
        </div>
      )}
      <strong className={styles.price}>{formatPrice(price)}</strong>
    </div>
  );
}

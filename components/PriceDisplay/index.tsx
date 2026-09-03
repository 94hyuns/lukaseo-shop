import { discountRate, effectivePrice } from '@/lib/shop/catalog';
import { formatPrice } from '@/lib/shop/format';
import type { Product } from '@/lib/shop/types';
import styles from './PriceDisplay.module.css';

type Props = {
  product: Product;
  /** 상세 페이지처럼 금액이 주인공인 자리에서 크게 쓴다 */
  size?: 'md' | 'lg';
  /** 카드는 가운데 정렬, 표·패널은 왼쪽 정렬 */
  align?: 'left' | 'center';
};

export default function PriceDisplay({ product, size = 'md', align = 'left' }: Props) {
  const price = effectivePrice(product);
  const rate = discountRate(product);

  return (
    <div
      className={`${styles.wrap} ${size === 'lg' ? styles.wrapLg : ''} ${
        align === 'center' ? styles.wrapCenter : ''
      }`}
    >
      {rate > 0 && <s className={styles.original}>{formatPrice(product.price)}</s>}
      <div className={styles.priceRow}>
        {rate > 0 && <span className={styles.rate}>{rate}%</span>}
        <strong className={styles.price}>{formatPrice(price)}</strong>
      </div>
    </div>
  );
}

import Link from 'next/link';
import PriceDisplay from '@/components/PriceDisplay';
import SpecBadge from '@/components/SpecBadge';
import { getCategory } from '@/lib/shop/catalog';
import { featuredSpecs } from '@/lib/shop/format';
import type { Product } from '@/lib/shop/types';
import styles from './ProductCard.module.css';

/** 카드에 뱃지를 다 늘어놓으면 무엇이 중요한지 안 보인다 */
const MAX_SPECS = 4;

export default function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categorySlug);
  const specs = featuredSpecs(product.spec).slice(0, MAX_SPECS);
  const soldout = product.status === 'soldout';

  return (
    <article className={`${styles.card} ${soldout ? styles.cardSoldout : ''}`}>
      {/* 실제 상품 이미지가 들어올 자리. 지금은 카테고리 아이콘으로 대신한다 */}
      <div className={styles.thumb} aria-hidden="true">
        <span className={styles.thumbIcon}>{category?.icon ?? '📦'}</span>
        {soldout && <span className={styles.soldoutTag}>품절</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.brandRow}>
          <span className={styles.brand}>{product.brand}</span>
          {product.badges?.map((badge) => (
            <span key={badge} className={styles.badge}>
              {badge}
            </span>
          ))}
        </div>

        <h3 className={styles.name}>
          {/* 카드 전체를 <a> 로 감싸면 내부 링크가 중첩 앵커가 된다.
              제목 링크를 ::after 로 카드 크기만큼 늘려 대신한다 */}
          <Link href={`/products/${product.slug}`} className={styles.nameLink}>
            {product.name}
          </Link>
        </h3>

        <ul className={styles.specs}>
          {specs.map((spec) => (
            <li key={spec}>
              <SpecBadge>{spec}</SpecBadge>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <PriceDisplay product={product} />
        </div>
      </div>
    </article>
  );
}

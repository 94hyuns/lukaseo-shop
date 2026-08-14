import Link from 'next/link';
import { getProduct } from '@/lib/shop/catalog';
import type { Review } from '@/lib/shop/reviews';
import styles from './ReviewList.module.css';

/** 별점. 문자로 그리되 실제 값은 aria-label 로 읽어준다 */
function StarRating({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`5점 만점에 ${rating}점`}>
      <span aria-hidden="true">{'★'.repeat(rating)}</span>
      <span aria-hidden="true" className={styles.starsEmpty}>
        {'★'.repeat(5 - rating)}
      </span>
    </span>
  );
}

type Props = {
  reviews: Review[];
  /** 후기가 어떤 상품에 달린 것인지 함께 보여줄지. 상품 상세에서는 불필요하다 */
  showProduct?: boolean;
};

export default function ReviewList({ reviews, showProduct = false }: Props) {
  if (reviews.length === 0) {
    return <p className={styles.empty}>아직 등록된 후기가 없습니다.</p>;
  }

  return (
    <ul className={styles.list}>
      {reviews.map((review) => {
        const product = showProduct ? getProduct(review.productSlug) : undefined;

        return (
          <li key={review.id} className={styles.item}>
            <div className={styles.head}>
              <StarRating rating={review.rating} />
              <span className={styles.author}>{review.author}</span>
              <time className={styles.date} dateTime={review.createdAt}>
                {review.createdAt}
              </time>
            </div>

            {product && (
              <Link href={`/products/${product.slug}`} className={styles.product}>
                {product.name}
              </Link>
            )}

            <p className={styles.body}>{review.body}</p>
          </li>
        );
      })}
    </ul>
  );
}

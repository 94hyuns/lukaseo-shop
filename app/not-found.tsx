import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>찾는 페이지가 없습니다</h1>
      <p className={styles.description}>
        주소가 바뀌었거나 삭제된 상품일 수 있습니다.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.link}>
          홈으로
        </Link>
        <Link href="/products" className={styles.linkPrimary}>
          전체 상품 보기
        </Link>
      </div>
    </div>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductBrowser from '@/components/ProductBrowser';
import { PRODUCTS } from '@/lib/shop/catalog';
import styles from './products.module.css';

export const metadata: Metadata = {
  title: '전체 상품',
  description: '완제품 PC와 부품 전체 목록입니다. 분류·정렬·검색으로 좁혀보세요.',
};

export default function ProductsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>전체 상품</h1>
        <p className={styles.description}>
          완제품 PC와 부품을 한 곳에 모았습니다. 직접 맞추실 거라면{' '}
          <strong>견적짜기</strong>에서 호환성을 검사받으며 고르는 편이 빠릅니다.
        </p>
      </header>

      {/* useSearchParams 는 프리렌더 중 빈 값을 돌려주므로 Suspense 경계가 필요하다 */}
      <Suspense fallback={<p className={styles.loading}>목록을 불러오는 중…</p>}>
        <ProductBrowser products={PRODUCTS} />
      </Suspense>
    </div>
  );
}

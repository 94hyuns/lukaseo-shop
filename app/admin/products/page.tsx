import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminProductTable from '@/components/AdminProductTable';
import styles from './products-admin.module.css';

export const metadata: Metadata = {
  title: '상품 관리',
};

export default function AdminProductsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>상품 관리</h1>
        <p className={styles.description}>
          전체 상품의 SKU·가격·재고·견적짜기 노출 상태를 조회합니다. CPU 카테고리는 실물
          비교표(엑셀)에서 생성되며, &quot;미노출&quot;은 조립 스펙이 아직 보강되지 않아
          견적짜기에 나타나지 않는 상품입니다.
        </p>
      </header>

      {/* 필터 상태를 URL 쿼리에서 읽으므로 Suspense 경계가 필요하다 */}
      <Suspense fallback={<p className={styles.loading}>목록을 불러오는 중…</p>}>
        <AdminProductTable />
      </Suspense>
    </div>
  );
}

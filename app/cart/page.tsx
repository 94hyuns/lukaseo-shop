import type { Metadata } from 'next';
import CartView from '@/components/CartView';
import styles from './cart.module.css';

export const metadata: Metadata = {
  title: '장바구니',
  description: '담아둔 상품을 확인하고 수량을 조정합니다.',
};

export default function CartPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>장바구니</h1>
        <p className={styles.description}>
          담은 내용은 이 브라우저에만 저장됩니다. 로그인 기능이 붙으면 계정으로 옮겨집니다.
        </p>
      </header>

      <CartView />
    </div>
  );
}

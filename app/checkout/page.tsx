import type { Metadata } from 'next';
import CheckoutView from './CheckoutView';

export const metadata: Metadata = {
  title: '주문하기',
  description: '배송지를 입력하고 주문을 확정합니다.',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}

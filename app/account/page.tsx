import type { Metadata } from 'next';
import AccountView from './AccountView';

export const metadata: Metadata = {
  title: '내 계정',
  description: '로그인하고 장바구니와 견적을 계정에 저장하세요.',
};

export default function AccountPage() {
  return <AccountView />;
}

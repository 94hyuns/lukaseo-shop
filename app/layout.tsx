import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/lib/cart/CartContext';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://shop.lukaseo.com'),
  title: {
    default: 'lukashop — 부품 호환성을 검증하는 컴퓨터 판매 사이트',
    template: '%s | lukashop',
  },
  description:
    '조립 PC와 부품을 판매하고, 견적짜기에서 소켓·메모리 규격·파워 용량까지 호환성을 검증해주는 데모 쇼핑몰입니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://shop.lukaseo.com',
    siteName: 'lukashop',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {/* 장바구니는 헤더 배지와 각 페이지가 함께 읽으므로 최상단에 둔다 */}
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/CartContext';
import { useSession } from '@/lib/auth/useSession';
import styles from './Header.module.css';

const NAV = [
  { href: '/category/gaming-pc', label: '게이밍 PC' },
  { href: '/category/overclock-pc', label: '오버클럭 PC' },
  { href: '/products', label: '부품' },
  { href: '/category/monitor', label: '모니터' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalQuantity, isReady } = useCart();
  const { session, isReady: sessionReady } = useSession();
  const [keyword, setKeyword] = useState('');

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = keyword.trim();
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products');
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          luka<span className={styles.logoAccent}>shop</span>
        </Link>

        <nav className={styles.nav} aria-label="주요 메뉴">
          {NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/builder"
            className={`${styles.navLink} ${styles.navLinkFeature} ${
              pathname.startsWith('/builder') ? styles.navLinkActive : ''
            }`}
          >
            견적짜기
          </Link>
          {/* 포트폴리오 데모라 관리자도 메뉴에 공개한다 */}
          <Link
            href="/admin"
            className={`${styles.navLink} ${styles.navLinkAdmin} ${
              pathname.startsWith('/admin') ? styles.navLinkActive : ''
            }`}
          >
            관리자
          </Link>
        </nav>

        <form className={styles.search} onSubmit={handleSearch} role="search">
          <label className={styles.srOnly} htmlFor="header-search">
            상품 검색
          </label>
          <input
            id="header-search"
            className={styles.searchInput}
            type="search"
            placeholder="상품 검색"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" className={styles.searchButton} aria-label="검색">
            🔍
          </button>
        </form>

        <Link href="/cart" className={styles.cart}>
          장바구니
          {/* localStorage 를 읽기 전에는 배지를 감춘다. 0에서 N으로 튀는 게 더 어색하다 */}
          {isReady && totalQuantity > 0 && (
            <span className={styles.cartCount}>{totalQuantity}</span>
          )}
        </Link>

        <Link
          href="/account"
          className={`${styles.cart} ${pathname.startsWith('/account') ? styles.navLinkActive : ''}`}
        >
          {/* 세션을 읽기 전에는 중립 라벨. 로그인/내 계정이 깜빡 바뀌는 걸 막는다 */}
          {!sessionReady ? '계정' : session ? '내 계정' : '로그인'}
        </Link>

        {/* 이 사이트는 포트폴리오의 일부다. 허브로 돌아가는 길을 항상 열어 둔다 */}
        <a href="https://lukaseo.com" className={styles.portfolioLink}>
          포트폴리오 ↗
        </a>
      </div>
    </header>
  );
}

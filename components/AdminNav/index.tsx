'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminNav.module.css';

const MENU = [
  { href: '/admin', label: '대시보드', exact: true },
  { href: '/admin/products', label: '상품 관리', exact: false },
  { href: '/admin/price-sync', label: '가격 갱신 리포트', exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="관리자 메뉴">
      <div className={styles.inner}>
        {MENU.map((item) => {
          const isActive = item.exact
            ? pathname === item.href || pathname === `${item.href}/`
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
        <Link href="/" className={styles.storeLink}>
          ← 매장으로
        </Link>
      </div>
    </nav>
  );
}

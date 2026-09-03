import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* 설계문서 3-4 — 사업자등록 없이 상거래 사이트 형태를 띠면 오해 소지가 있다.
            이 고지는 어떤 경우에도 빼지 않는다 */}
        <p className={styles.notice}>
          본 사이트는 <strong>포트폴리오 목적의 데모</strong>이며 실제 판매·결제가 이루어지지
          않습니다. 표시된 상품과 가격은 기능 시연을 위한 가상의 데이터입니다.
        </p>

        <div className={styles.columns}>
          <div className={styles.brandColumn}>
            <span className={styles.logo}>
              luka<span className={styles.logoAccent}>shop</span>
            </span>
            <p className={styles.tagline}>
              부품 호환성을 검증해주는 컴퓨터 판매 사이트. Next.js와 TypeScript로 만들었습니다.
            </p>
          </div>

          <nav className={styles.linkColumn} aria-label="쇼핑">
            <h2 className={styles.columnTitle}>쇼핑</h2>
            <Link href="/products">전체 상품</Link>
            <Link href="/builder">견적짜기</Link>
            <Link href="/cart">장바구니</Link>
            <Link href="/admin">관리자 (공개 데모)</Link>
          </nav>

          <div className={styles.linkColumn}>
            <h2 className={styles.columnTitle}>만든 사람</h2>
            <a href="https://lukaseo.com" target="_blank" rel="noopener noreferrer">
              포트폴리오 →
            </a>
            <a
              href="https://github.com/94hyuns"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
          </div>
        </div>

        <p className={styles.copyright}>© 2026 Luka Seo. Demo project.</p>
      </div>
    </footer>
  );
}

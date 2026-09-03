import Link from 'next/link';
import CategoryIconGrid from '@/components/CategoryIconGrid';
import HeroSlider from '@/components/HeroSlider';
import ProductGrid from '@/components/ProductGrid';
import ProductTabs from '@/components/ProductTabs';
import ReviewList from '@/components/ReviewList';
import SectionHeading from '@/components/SectionHeading';
import {
  PRODUCTS,
  getCategoriesByGroup,
  getProductsByCategory,
} from '@/lib/shop/catalog';
import { getRecentReviews } from '@/lib/shop/reviews';
import styles from './page.module.css';

/** 메인의 각 섹션에 노출할 상품 수 */
const SECTION_SIZE = 4;

export default function HomePage() {
  const gamingPcs = getProductsByCategory('gaming-pc').slice(0, SECTION_SIZE);
  const overclockPcs = getProductsByCategory('overclock-pc').slice(0, SECTION_SIZE);
  const peripherals = [
    ...getProductsByCategory('monitor'),
    ...getProductsByCategory('peripheral'),
  ].slice(0, SECTION_SIZE);

  const newProducts = PRODUCTS.filter((product) => product.badges?.includes('신제품'));
  const popularProducts = PRODUCTS.filter((product) => product.badges?.includes('인기'));

  return (
    <>
      <HeroSlider />

      {/* 레퍼런스처럼 본문 + 우측 유틸 사이드바 2단 */}
      <div className={styles.container}>
        <div className={styles.main}>
          <section className={styles.section}>
            <SectionHeading
              title="게이밍 PC"
              description="조립과 세팅, 부하 테스트를 마치고 배송합니다."
              moreHref="/category/gaming-pc"
            />
            <ProductGrid products={gamingPcs} />
          </section>

          <section className={styles.section}>
            <SectionHeading
              title="오버클럭 PC"
              description="수랭 쿨링과 고급 전원부. 출고 전 안정성을 검증합니다."
              moreHref="/category/overclock-pc"
            />
            <ProductGrid products={overclockPcs} />
          </section>

          <section className={styles.section}>
            <SectionHeading
              title="컴퓨터 부품"
              description="직접 맞추실 분들을 위한 부품 8종."
              moreHref="/products"
            />
            <CategoryIconGrid categories={getCategoriesByGroup('part')} />
          </section>

          <section className={styles.section}>
            <SectionHeading title="주변기기" moreHref="/category/monitor" />
            <ProductGrid products={peripherals} />
          </section>

          <section className={styles.section}>
            <SectionHeading title="신제품 · 인기상품" />
            <ProductTabs
              tabs={[
                { id: 'popular', label: '인기상품', products: popularProducts },
                { id: 'new', label: '신제품', products: newProducts },
              ]}
            />
          </section>
        </div>

        <aside className={styles.sidebar}>
          {/* 무이자 안내는 UI만 — 실제 카드사 연동은 하지 않는다 (설계 3-2) */}
          <div className={styles.installment}>
            <strong className={styles.installmentTitle}>신용카드 무이자 할부</strong>
            <p className={styles.installmentBody}>
              전 카드사 3개월, 100만원 이상 결제 시 6개월까지.
            </p>
          </div>

          <div className={styles.quickLinks}>
            <Link href="/builder" className={styles.quickPrimary}>
              🧩 견적짜기 — 호환성 자동 검사
            </Link>
            <Link href="/category/gaming-pc" className={styles.quickLink}>
              내 PC 찾기
            </Link>
            <Link href="/products" className={styles.quickLink}>
              전체 상품 보기
            </Link>
          </div>

          <div className={styles.sideBlock}>
            <SectionHeading title="구매후기" moreHref="/products" />
            <ReviewList reviews={getRecentReviews(3)} showProduct />
          </div>
        </aside>
      </div>
    </>
  );
}

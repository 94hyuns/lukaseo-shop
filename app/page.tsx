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

const QUICK_ACTIONS = [
  {
    href: '/builder',
    icon: '🧩',
    title: '견적짜기',
    description: '부품을 고르면 소켓·규격·용량을 바로 검사합니다.',
    featured: true,
  },
  {
    href: '/category/gaming-pc',
    icon: '🎯',
    title: '내 PC 찾기',
    description: '용도별로 맞춰둔 완제품 구성을 둘러보세요.',
    featured: false,
  },
  {
    href: '/products',
    icon: '💳',
    title: '무이자 할부',
    description: '전 카드사 3개월, 100만원 이상 6개월.',
    featured: false,
  },
];

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

      <div className={styles.container}>
        <ul className={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className={`${styles.quickAction} ${
                  action.featured ? styles.quickActionFeatured : ''
                }`}
              >
                <span className={styles.quickIcon} aria-hidden="true">
                  {action.icon}
                </span>
                <span>
                  <strong className={styles.quickTitle}>{action.title}</strong>
                  <span className={styles.quickDescription}>{action.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

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
            description="수랭 쿨링과 고급 전원부. 출고 전 오버클럭 안정성을 검증합니다."
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

        <section className={styles.section}>
          <SectionHeading title="구매후기" description="최근 등록된 후기입니다." />
          <ReviewList reviews={getRecentReviews(4)} showProduct />
        </section>
      </div>
    </>
  );
}

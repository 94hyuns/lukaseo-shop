import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import PriceDisplay from '@/components/PriceDisplay';
import ReviewList from '@/components/ReviewList';
import SectionHeading from '@/components/SectionHeading';
import SpecBadge from '@/components/SpecBadge';
import { getCategory, getProduct, getProductParams, getProductsByCategory } from '@/lib/shop/catalog';
import { specTable } from '@/lib/shop/format';
import { getReviewsByProduct } from '@/lib/shop/reviews';
import { SLOT_ORDER } from '@/lib/builder/compatibility';
import type { PartSlot } from '@/lib/shop/types';
import styles from './product.module.css';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProductParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDesc,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const reviews = getReviewsByProduct(product.slug);
  const specs = specTable(product.spec);

  // 부품이면 견적짜기로 이어주는 링크를 단다. 카테고리 slug 와 슬롯 이름을
  // 같은 문자열로 맞춰뒀기 때문에 이 판정이 가능하다.
  const isPart = SLOT_ORDER.includes(product.categorySlug as PartSlot);

  const related = getProductsByCategory(product.categorySlug)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="위치">
        <Link href="/products">전체 상품</Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </>
        )}
      </nav>

      <div className={styles.top}>
        <div className={styles.gallery} aria-hidden="true">
          <span className={styles.galleryIcon}>{category?.icon ?? '📦'}</span>
          <p className={styles.galleryNote}>상품 이미지가 들어갈 자리입니다</p>
        </div>

        <div className={styles.summary}>
          <div className={styles.brandRow}>
            <span className={styles.brand}>{product.brand}</span>
            {product.badges?.map((badge) => (
              <span key={badge} className={styles.badge}>
                {badge}
              </span>
            ))}
          </div>

          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.shortDesc}>{product.shortDesc}</p>

          <div className={styles.priceBlock}>
            <PriceDisplay product={product} size="lg" />
            <span className={styles.sku}>상품코드 {product.sku}</span>
          </div>

          <AddToCartButton product={product} />

          {isPart && (
            <Link href="/builder" className={styles.builderLink}>
              이 부품으로 견적 짜보기 — 나머지 부품과 맞는지 검사해드립니다 →
            </Link>
          )}
        </div>
      </div>

      <section className={styles.section}>
        <SectionHeading title="상세 사양" />
        <dl className={styles.specTable}>
          {specs.map((row, index) => (
            <div key={`${row.label}-${index}`} className={styles.specRow}>
              <dt className={styles.specLabel}>{row.label}</dt>
              <dd className={styles.specValue}>
                <SpecBadge>{row.value}</SpecBadge>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <SectionHeading title="상품 설명" />
        <p className={styles.description}>{product.description}</p>
      </section>

      <section className={styles.section}>
        <SectionHeading title={`구매후기 (${reviews.length})`} />
        <ReviewList reviews={reviews} />
      </section>

      {related.length > 0 && (
        <section className={styles.section}>
          <SectionHeading
            title="같은 분류의 다른 상품"
            moreHref={category ? `/category/${category.slug}` : undefined}
          />
          <ul className={styles.related}>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/products/${item.slug}`} className={styles.relatedItem}>
                  <span className={styles.relatedName}>{item.name}</span>
                  <PriceDisplay product={item} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

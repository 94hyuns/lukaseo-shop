import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PartIllustration from '@/components/PartIllustration';
import ProductBrowser from '@/components/ProductBrowser';
import { getCategory, getCategoryParams, getProductsByCategory } from '@/lib/shop/catalog';
import styles from './category.module.css';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCategoryParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <PartIllustration slug={category.slug} className={styles.iconArt} />
        </span>
        <div>
          <h1 className={styles.title}>{category.name}</h1>
          <p className={styles.description}>{category.description}</p>
        </div>
      </header>

      <Suspense fallback={<p className={styles.loading}>목록을 불러오는 중…</p>}>
        {/* 이미 한 분류로 좁혀진 화면이라 분류 필터는 숨긴다 */}
        <ProductBrowser products={products} showCategoryFilter={false} />
      </Suspense>
    </div>
  );
}

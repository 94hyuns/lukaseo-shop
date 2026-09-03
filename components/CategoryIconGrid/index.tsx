import Link from 'next/link';
import PartIllustration from '@/components/PartIllustration';
import type { Category } from '@/lib/shop/types';
import styles from './CategoryIconGrid.module.css';

export default function CategoryIconGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className={styles.grid}>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link href={`/category/${category.slug}`} className={styles.item}>
            <PartIllustration slug={category.slug} className={styles.icon} />
            <span className={styles.name}>{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

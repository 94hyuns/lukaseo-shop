import Link from 'next/link';
import type { Category } from '@/lib/shop/types';
import styles from './CategoryIconGrid.module.css';

export default function CategoryIconGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className={styles.grid}>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link href={`/category/${category.slug}`} className={styles.item}>
            <span className={styles.icon} aria-hidden="true">
              {category.icon}
            </span>
            <span className={styles.name}>{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

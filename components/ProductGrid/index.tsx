import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/shop/types';
import styles from './ProductGrid.module.css';

type Props = {
  products: Product[];
  /** 상품이 없을 때 보여줄 문구 */
  emptyMessage?: string;
};

export default function ProductGrid({ products, emptyMessage = '상품이 없습니다.' }: Props) {
  if (products.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

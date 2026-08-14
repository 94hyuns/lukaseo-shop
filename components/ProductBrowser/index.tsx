'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import ProductGrid from '@/components/ProductGrid';
import { CATEGORIES, effectivePrice } from '@/lib/shop/catalog';
import type { Product } from '@/lib/shop/types';
import styles from './ProductBrowser.module.css';

/**
 * 목록 화면의 필터·정렬·페이지네이션.
 *
 * 상태를 컴포넌트 안이 아니라 URL 쿼리에 둔다. 그래야 필터를 건 화면을
 * 그대로 링크로 넘길 수 있고, 뒤로가기가 기대대로 동작한다.
 *
 * 정적 내보내기라 서버에서 searchParams 를 읽을 수 없어(빌드 시점에는 요청이
 * 없다) 클라이언트에서 useSearchParams 로 읽는다. 이 훅은 프리렌더 중에는
 * 빈 값을 돌려주므로 호출부에서 Suspense 로 감싸야 한다.
 */

const PAGE_SIZE = 12;

const SORTS = [
  { id: 'recommend', label: '추천순' },
  { id: 'price-asc', label: '낮은 가격순' },
  { id: 'price-desc', label: '높은 가격순' },
  { id: 'name', label: '이름순' },
] as const;

type SortId = (typeof SORTS)[number]['id'];

type Props = {
  products: Product[];
  /** 카테고리 필터를 노출할지. 카테고리 페이지에서는 이미 고정돼 있어 숨긴다 */
  showCategoryFilter?: boolean;
};

export default function ProductBrowser({ products, showCategoryFilter = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keyword = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = (searchParams.get('sort') as SortId | null) ?? 'recommend';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);

  /** 쿼리 하나를 바꾸면서 나머지는 유지한다. 값이 비면 키 자체를 지운다 */
  function updateQuery(patch: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    // 필터가 바뀌면 3페이지에 머물 이유가 없다
    if (!('page' in patch)) next.delete('page');
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const filtered = useMemo(() => {
    const needle = keyword.trim().toLowerCase();

    const matched = products.filter((product) => {
      if (category && product.categorySlug !== category) return false;
      if (!needle) return true;
      // 상품명·브랜드·SKU 를 함께 본다. 모델명으로 찾는 사용자가 많다
      return (
        product.name.toLowerCase().includes(needle) ||
        product.brand.toLowerCase().includes(needle) ||
        product.sku.toLowerCase().includes(needle)
      );
    });

    const sorted = [...matched];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
        break;
      default:
        // 추천순 — 품절을 뒤로 밀고 뱃지가 붙은 상품을 앞으로
        sorted.sort((a, b) => {
          const soldout = Number(a.status === 'soldout') - Number(b.status === 'soldout');
          if (soldout !== 0) return soldout;
          return (b.badges?.length ?? 0) - (a.badges?.length ?? 0);
        });
    }
    return sorted;
  }, [products, keyword, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /** 목록에 실제로 존재하는 카테고리만 필터에 띄운다 */
  const availableCategories = useMemo(() => {
    const present = new Set(products.map((product) => product.categorySlug));
    return CATEGORIES.filter((item) => present.has(item.slug));
  }, [products]);

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>검색</span>
            <input
              type="search"
              className={styles.input}
              value={keyword}
              placeholder="상품명 · 브랜드 · 상품코드"
              onChange={(event) => updateQuery({ q: event.target.value })}
            />
          </label>

          {showCategoryFilter && (
            <label className={styles.field}>
              <span className={styles.fieldLabel}>분류</span>
              <select
                className={styles.select}
                value={category}
                onChange={(event) => updateQuery({ category: event.target.value })}
              >
                <option value="">전체</option>
                {availableCategories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.fieldLabel}>정렬</span>
            <select
              className={styles.select}
              value={sort}
              onChange={(event) => updateQuery({ sort: event.target.value })}
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className={styles.count} aria-live="polite">
          <strong>{filtered.length}</strong>개 상품
        </p>
      </div>

      <ProductGrid
        products={visible}
        emptyMessage="조건에 맞는 상품이 없습니다. 검색어나 분류를 바꿔보세요."
      />

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onChange={(next) => updateQuery({ page: String(next) })}
      />
    </div>
  );
}

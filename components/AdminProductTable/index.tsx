'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { CATEGORIES, PRODUCTS, effectivePrice, getCategory } from '@/lib/shop/catalog';
import { formatPrice } from '@/lib/shop/format';
import { applyLive, missingFromDb, useLiveOverrides } from '@/lib/shop/live';
import { SLOT_ORDER } from '@/lib/builder/compatibility';
import type { PartSlot, Product } from '@/lib/shop/types';
import styles from './AdminProductTable.module.css';

/**
 * 상품 관리 테이블 (조회 전용).
 *
 * 필터 상태는 ProductBrowser 와 같은 이유로 URL 쿼리에 둔다 — 대시보드의
 * "카테고리별 현황"에서 필터 걸린 화면으로 바로 링크할 수 있어야 한다.
 * 수정·삭제 버튼이 없는 이유는 관리자 레이아웃의 고지 그대로다.
 */

const PAGE_SIZE = 30;

/** 견적짜기 노출 여부. 부품 카테고리가 아니면 해당 없음 */
function builderState(product: Product): '노출' | '미노출' | '—' {
  if (!SLOT_ORDER.includes(product.categorySlug as PartSlot)) return '—';
  return product.spec.kind === product.categorySlug ? '노출' : '미노출';
}

export default function AdminProductTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state: liveState, overrides } = useLiveOverrides();

  const keyword = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const status = searchParams.get('status') ?? '';
  const builder = searchParams.get('builder') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);

  function updateQuery(patch: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!('page' in patch)) next.delete('page');
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  // DB 실시간 값(가격·재고·상태)을 정적 카탈로그 위에 덮는다
  const products = useMemo(
    () => PRODUCTS.map((product) => applyLive(product, overrides)),
    [overrides],
  );

  const filtered = useMemo(() => {
    const needle = keyword.trim().toLowerCase();
    return products.filter((product) => {
      if (category && product.categorySlug !== category) return false;
      if (status && product.status !== status) return false;
      if (builder && builderState(product) !== builder) return false;
      if (!needle) return true;
      return (
        product.name.toLowerCase().includes(needle) ||
        product.sku.toLowerCase().includes(needle) ||
        product.brand.toLowerCase().includes(needle)
      );
    });
  }, [products, keyword, category, status, builder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>검색</span>
          <input
            type="search"
            className={styles.input}
            value={keyword}
            placeholder="상품명 · SKU · 브랜드"
            onChange={(event) => updateQuery({ q: event.target.value })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>카테고리</span>
          <select
            className={styles.select}
            value={category}
            onChange={(event) => updateQuery({ category: event.target.value })}
          >
            <option value="">전체</option>
            {CATEGORIES.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>상태</span>
          <select
            className={styles.select}
            value={status}
            onChange={(event) => updateQuery({ status: event.target.value })}
          >
            <option value="">전체</option>
            <option value="active">판매중</option>
            <option value="soldout">품절</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>견적짜기</span>
          <select
            className={styles.select}
            value={builder}
            onChange={(event) => updateQuery({ builder: event.target.value })}
          >
            <option value="">전체</option>
            <option value="노출">노출</option>
            <option value="미노출">미노출 (스펙 미보강)</option>
          </select>
        </label>

        <p className={styles.count} aria-live="polite">
          <strong>{filtered.length}</strong>개
          <span
            className={`${styles.source} ${liveState === 'live' ? styles.sourceLive : ''}`}
            title={
              liveState === 'live'
                ? 'Supabase에서 가격·재고·상태를 실시간 조회 중'
                : liveState === 'offline'
                  ? 'DB에 연결하지 못해 빌드 시점 데이터를 보여줍니다'
                  : 'DB 연결 확인 중'
            }
          >
            {liveState === 'live' ? 'DB 실시간' : liveState === 'offline' ? '정적 데이터' : '연결 중…'}
          </span>
        </p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>상품명</th>
              <th>카테고리</th>
              <th>판매가</th>
              <th>재고</th>
              <th>상태</th>
              <th>견적짜기</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => {
              const state = builderState(product);
              return (
                <tr key={product.slug}>
                  <td className={styles.mono}>{product.sku}</td>
                  <td>
                    <Link href={`/products/${product.slug}`} className={styles.nameLink}>
                      {product.name}
                    </Link>
                  </td>
                  <td className={styles.muted}>
                    {getCategory(product.categorySlug)?.name ?? product.categorySlug}
                  </td>
                  <td className={styles.number}>{formatPrice(effectivePrice(product))}</td>
                  <td className={styles.number}>{product.stock}</td>
                  <td>
                    {missingFromDb(product, liveState, overrides) ? (
                      <span
                        className={`${styles.badge} ${styles.badgePlain}`}
                        title="DB 조회 결과에 없는 상품 — 숨김 처리됐거나 아직 등록 전입니다"
                      >
                        DB 미등록
                      </span>
                    ) : (
                      <span
                        className={`${styles.badge} ${
                          product.status === 'soldout' ? styles.badgeSoldout : styles.badgeActive
                        }`}
                      >
                        {product.status === 'soldout' ? '품절' : '판매중'}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        state === '노출'
                          ? styles.badgeActive
                          : state === '미노출'
                            ? styles.badgeHeld
                            : styles.badgePlain
                      }`}
                    >
                      {state}
                    </span>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  조건에 맞는 상품이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onChange={(next) => updateQuery({ page: String(next) })}
      />
    </div>
  );
}

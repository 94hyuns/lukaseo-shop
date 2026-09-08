'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import rawReport from '@/data/price-sync-report.json';
import { CATEGORIES, PRODUCTS, effectivePrice } from '@/lib/shop/catalog';
import { formatPrice } from '@/lib/shop/format';
import { applyLive, useLiveOverrides } from '@/lib/shop/live';
import type { PartSlot } from '@/lib/shop/types';
import { SLOT_ORDER } from '@/lib/builder/compatibility';
import styles from './admin.module.css';

/**
 * 운영 현황 대시보드.
 *
 * 통계는 정적 카탈로그로 먼저 그리고, 마운트 후 Supabase 조회가 성공하면
 * 가격·재고·상태를 DB 값으로 다시 집계한다. 조회 실패 시 정적 수치 유지.
 */

type Report = {
  runAt: string;
  source: string;
  file: string;
  counts: { total: number; ok: number; held: number; rejected: number };
};

const report = rawReport as Report;

export default function AdminDashboard() {
  const { state: liveState, overrides } = useLiveOverrides();

  const products = useMemo(
    () => PRODUCTS.map((product) => applyLive(product, overrides)),
    [overrides],
  );

  const total = products.length;
  const soldout = products.filter((product) => product.status === 'soldout').length;
  const stockValue = products.reduce(
    (acc, product) => acc + effectivePrice(product) * product.stock,
    0,
  );
  const builderReady = products.filter(
    (product) =>
      SLOT_ORDER.includes(product.categorySlug as PartSlot) &&
      product.spec.kind === product.categorySlug,
  ).length;

  const categoryRows = CATEGORIES.map((category) => {
    const items = products.filter((product) => product.categorySlug === category.slug);
    return {
      slug: category.slug,
      name: category.name,
      count: items.length,
      soldout: items.filter((product) => product.status === 'soldout').length,
      // CPU 는 실물 비교표(엑셀)가 원본, 나머지는 아직 손으로 관리하는 목데이터
      source: category.slug === 'cpu' ? '엑셀 (실물 비교표)' : '수기 목데이터',
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>대시보드</h1>
        <span
          className={`${styles.liveBadge} ${liveState === 'live' ? styles.liveBadgeOn : ''}`}
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
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>등록 상품</span>
          <strong className={styles.statValue}>{total}개</strong>
          <span className={styles.statSub}>
            판매중 {total - soldout} · 품절 {soldout}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>재고 자산 가치</span>
          <strong className={styles.statValue}>{formatPrice(stockValue)}</strong>
          <span className={styles.statSub}>판매가 × 재고 합계</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>견적짜기 등록 부품</span>
          <strong className={styles.statValue}>{builderReady}개</strong>
          <span className={styles.statSub}>조립 스펙이 보강된 부품만 노출</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>최근 가격 갱신</span>
          <strong className={styles.statValue}>
            반영 {report.counts.ok} / {report.counts.total}건
          </strong>
          <span className={styles.statSub}>
            {new Date(report.runAt).toLocaleDateString('ko-KR')} ·{' '}
            {report.source === 'hcell-cpu' ? '실물 비교표' : report.source} ·{' '}
            <Link href="/admin/price-sync" className={styles.statLink}>
              리포트 →
            </Link>
          </span>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>카테고리별 현황</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>상품 수</th>
                <th>품절</th>
                <th>데이터 원천</th>
              </tr>
            </thead>
            <tbody>
              {categoryRows.map((row) => (
                <tr key={row.slug}>
                  <td>
                    <Link
                      href={`/admin/products?category=${row.slug}`}
                      className={styles.rowLink}
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className={styles.number}>{row.count}</td>
                  <td className={styles.number}>{row.soldout > 0 ? row.soldout : '—'}</td>
                  <td className={styles.muted}>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>데이터 흐름</h2>
        <div className={styles.flow}>
          <span className={styles.flowNode}>CPU 비교표.xlsx (한셀)</span>
          <span className={styles.flowArrow} aria-hidden="true">
            →
          </span>
          <span className={styles.flowNode}>임포트·검증 (임계치 ±30%)</span>
          <span className={styles.flowArrow} aria-hidden="true">
            →
          </span>
          <span className={styles.flowNode}>git push → 자동 빌드·배포</span>
          <span className={styles.flowArrow} aria-hidden="true">
            →
          </span>
          <span className={styles.flowNode}>Supabase DB (관리자 실시간 조회)</span>
        </div>
        <p className={styles.flowNote}>
          CPU 상품 목록과 가격의 원천은 실물 엑셀입니다. 검증에서 보류·거부된 행은 반영되지
          않고 <Link href="/admin/price-sync">리포트</Link>에만 남습니다. 관리자 화면의
          가격·재고·상태는 Supabase DB를 실시간 조회하며, 고객 페이지는 빌드 시점 데이터로
          정적 서빙됩니다.
        </p>
      </section>
    </div>
  );
}

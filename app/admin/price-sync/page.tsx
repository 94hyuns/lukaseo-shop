import type { Metadata } from 'next';
import rawReport from '@/data/price-sync-report.json';
import { formatPrice } from '@/lib/shop/format';
import type { SyncItem, SyncVerdict } from '@/lib/price-sync/validate';
import PriceSyncQueue from './PriceSyncQueue';
import styles from './price-sync.module.css';

/**
 * 가격 갱신 — 업로드·승인 대기열 + 리포트 (설계문서 8-6).
 *
 * 관리자는 비교표(xlsx)를 브라우저에 올려 검증 결과를 대기열에 스테이징하고,
 * 승인하면 ok 행이 DB 상품에 반영된다. 아래의 정적 리포트는 로컬 파이프라인
 * (`npm run price-sync`)의 마지막 실행 기록으로, 참고용으로 남겨 둔다.
 */

// robots(noindex)는 관리자 레이아웃이 일괄 적용한다
export const metadata: Metadata = {
  title: '가격 갱신',
};

type Report = {
  runAt: string;
  source: string;
  file: string;
  changeThreshold: number;
  counts: { total: number; ok: number; held: number; rejected: number };
  items: SyncItem[];
};

const report = rawReport as Report;

const VERDICT_LABEL: Record<SyncVerdict, string> = {
  ok: '반영',
  held: '보류',
  rejected: '거부',
};

const VERDICT_CLASS: Record<SyncVerdict, string> = {
  ok: styles.verdictOk,
  held: styles.verdictHeld,
  rejected: styles.verdictRejected,
};

function money(value: number | null): string {
  return value === null ? '—' : formatPrice(value);
}

/** 전→후 표기. 값이 같으면 한 번만 */
function transition(before: number | null, after: number | null): string {
  if (before === null && after === null) return '—';
  if (before === after || before === null) return money(after);
  if (after === null) return `${money(before)} → 없음`;
  return `${money(before)} → ${money(after)}`;
}

export default function PriceSyncReportPage() {
  const { counts } = report;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>가격 갱신</h1>
        <p className={styles.description}>
          비교표(xlsx)를 올리면 브라우저에서 파싱·검증하고, 결과를 승인 대기열에 올립니다.
          승인하면 반영(ok) 행만 DB 상품에 적용되고 가격 이력이 남습니다. 보류·거부 행은
          기록에만 남습니다.
        </p>
      </header>

      <PriceSyncQueue />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>로컬 파이프라인 마지막 실행 (참고)</h2>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>실행 시각</dt>
            <dd>{new Date(report.runAt).toLocaleString('ko-KR')}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>수집원</dt>
            <dd>{report.source === 'excel' ? `엑셀 (${report.file})` : report.source}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>변동 임계치</dt>
            <dd>±{Math.round(report.changeThreshold * 100)}% — 초과 시 보류</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>결과</dt>
            <dd>
              총 {counts.total}행 — 반영 <strong className={styles.okText}>{counts.ok}</strong> · 보류{' '}
              <strong className={styles.heldText}>{counts.held}</strong> · 거부{' '}
              <strong className={styles.rejectedText}>{counts.rejected}</strong>
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>행별 결과</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>출처</th>
                <th>상품코드</th>
                <th>상품</th>
                <th>정가</th>
                <th>할인가</th>
                <th>재고</th>
                <th>판정</th>
                <th>사유</th>
              </tr>
            </thead>
            <tbody>
              {report.items.map((item) => (
                <tr key={`${item.sourceLabel}-${item.sku}`}>
                  <td className={styles.mono}>{item.sourceLabel}</td>
                  <td className={styles.mono}>{item.sku || '—'}</td>
                  <td>{item.productName ?? '—'}</td>
                  <td className={styles.number}>{transition(item.oldPrice, item.newPrice)}</td>
                  <td className={styles.number}>{transition(item.oldSalePrice, item.newSalePrice)}</td>
                  <td className={styles.number}>
                    {item.newStock === null
                      ? '변경 없음'
                      : `${item.oldStock ?? '—'} → ${item.newStock}`}
                  </td>
                  <td>
                    <span className={`${styles.verdict} ${VERDICT_CLASS[item.verdict]}`}>
                      {VERDICT_LABEL[item.verdict]}
                    </span>
                  </td>
                  <td className={styles.reason}>{item.reason ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>설정 (설계 8-1 · 서버 연동 전이라 읽기 전용)</h2>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>갱신 모드</dt>
            <dd>자동 + 승인 (기본값) — 외부 값을 그대로 반영하지 않고 사람이 확인 후 반영</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>매칭 키</dt>
            <dd>상품코드(SKU) 1순위. 상품명 매칭은 표기 차이로 실패하므로 쓰지 않음</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>예정 기능</dt>
            <dd>네이버 쇼핑 최저가 교차 비교(8-8), 반영 이력·롤백(8-7), 승인 대기열</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

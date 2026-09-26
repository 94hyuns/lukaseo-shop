'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useIsAdmin } from '@/lib/shop/adminApi';
import { useSession } from '@/lib/auth/useSession';
import { formatPrice } from '@/lib/shop/format';
import {
  approveRun,
  discardRun,
  fetchRunItems,
  listRuns,
  parseAndValidate,
  stageRun,
  type QueueItem,
  type QueueRun,
  type UploadPreview,
} from '@/lib/price-sync/webSync';
import styles from './price-sync.module.css';

/**
 * 비교표 업로드 → 검증 미리보기 → 대기열 → 승인/폐기 (설계문서 8-6).
 *
 * 파싱·검증은 브라우저에서 로컬 파이프라인과 같은 코드로 돌고, DB 에는
 * 검증 결과만 스테이징된다. 반영(승인)은 DB 함수가 트랜잭션으로 처리한다.
 */

const RUN_STATUS_LABELS: Record<string, string> = {
  awaiting_approval: '승인 대기',
  applied: '반영됨',
  failed: '폐기됨',
  rolled_back: '롤백됨',
  pending: '준비 중',
};

const VERDICT_LABELS: Record<string, string> = { ok: '반영', held: '보류', rejected: '거부' };

function verdictClass(verdict: string): string {
  if (verdict === 'ok') return styles.verdictOk;
  if (verdict === 'held') return styles.verdictHeld;
  return styles.verdictRejected;
}

function money(value: number | null): string {
  return value === null ? '—' : formatPrice(value);
}

export default function PriceSyncQueue() {
  const { session, isReady } = useSession();
  const isAdmin = useIsAdmin();

  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [parsing, setParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [staging, setStaging] = useState(false);

  const [runs, setRuns] = useState<QueueRun[] | null>(null);
  const [openRunId, setOpenRunId] = useState<number | null>(null);
  const [runItems, setRunItems] = useState<Record<number, QueueItem[]>>({});
  const [acting, setActing] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reloadRuns = useCallback(() => {
    if (!isAdmin) return;
    listRuns().then((result) => {
      if (result) setRuns(result);
    });
  }, [isAdmin]);

  useEffect(reloadRuns, [reloadRuns]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setUploadError(null);
    setPreview(null);
    setNotice(null);
    try {
      setPreview(await parseAndValidate(file));
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : '파일을 읽지 못했습니다. 비교표(xlsx)가 맞는지 확인해주세요.',
      );
    } finally {
      setParsing(false);
      event.target.value = ''; // 같은 파일 재선택도 change 로 잡히게
    }
  }

  async function handleStage() {
    if (!preview) return;
    setStaging(true);
    const runId = await stageRun(preview);
    setStaging(false);
    if (runId === null) {
      setUploadError('대기열 등록에 실패했습니다. 관리자 권한을 확인해주세요.');
      return;
    }
    setPreview(null);
    setNotice(`실행 #${runId} 이(가) 승인 대기열에 올라갔습니다.`);
    reloadRuns();
  }

  async function toggleRun(runId: number) {
    if (openRunId === runId) {
      setOpenRunId(null);
      return;
    }
    setOpenRunId(runId);
    if (!runItems[runId]) {
      const items = await fetchRunItems(runId);
      if (items) setRunItems((prev) => ({ ...prev, [runId]: items }));
    }
  }

  async function handleApprove(runId: number) {
    setActing(runId);
    setNotice(null);
    const applied = await approveRun(runId);
    setActing(null);
    if (applied === null) {
      setNotice(`실행 #${runId} 승인에 실패했습니다.`);
      return;
    }
    setNotice(`실행 #${runId} 승인 완료 — ${applied}건이 상품에 반영됐습니다.`);
    reloadRuns();
  }

  async function handleDiscard(runId: number) {
    setActing(runId);
    setNotice(null);
    const ok = await discardRun(runId);
    setActing(null);
    setNotice(ok ? `실행 #${runId} 을(를) 폐기했습니다.` : `실행 #${runId} 폐기에 실패했습니다.`);
    reloadRuns();
  }

  if (!isReady) return null;

  if (!session || !isAdmin) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>업로드 · 승인 대기열</h2>
        <p className={styles.guardNote}>
          비교표 업로드와 승인은 관리자 계정 전용입니다.{' '}
          {!session && (
            <>
              <Link href="/account" className={styles.guardLink}>
                로그인
              </Link>
              후 이용할 수 있습니다.
            </>
          )}{' '}
          아래의 로컬 파이프라인 리포트는 누구나 볼 수 있습니다.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>비교표 업로드</h2>
        <div className={styles.uploadBox}>
          <label className={styles.fileLabel}>
            {parsing ? '파싱·검증 중…' : '비교표(xlsx) 선택'}
            <input type="file" accept=".xlsx" onChange={handleFile} disabled={parsing} hidden />
          </label>
          <p className={styles.uploadHint}>
            파일은 브라우저 안에서만 파싱되고, DB에는 검증 결과만 올라갑니다. 검증 기준가는 DB
            현재가입니다.
          </p>
          {uploadError && (
            <p className={styles.errorText} role="alert">
              {uploadError}
            </p>
          )}
        </div>

        {preview && (
          <div className={styles.previewBox}>
            <p className={styles.previewSummary}>
              <strong>{preview.fileName}</strong> — 비교표 {preview.totalRows}행, 갱신 대상{' '}
              {preview.result.counts.total}건 (현재가 없어 건너뜀 {preview.skipped}건)
              <br />
              반영 <strong className={styles.okText}>{preview.result.counts.ok}</strong> · 보류{' '}
              <strong className={styles.heldText}>{preview.result.counts.held}</strong> · 거부{' '}
              <strong className={styles.rejectedText}>{preview.result.counts.rejected}</strong>
            </p>
            <div className={`${styles.tableWrap} ${styles.previewTable}`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>출처</th>
                    <th>상품코드</th>
                    <th>상품</th>
                    <th>정가</th>
                    <th>판정</th>
                    <th>사유</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.result.items.map((item) => (
                    <tr key={`${item.sourceLabel}-${item.sku}`}>
                      <td className={styles.mono}>{item.sourceLabel}</td>
                      <td className={styles.mono}>{item.sku || '—'}</td>
                      <td>{item.productName ?? '—'}</td>
                      <td className={styles.number}>
                        {money(item.oldPrice)} → {money(item.newPrice)}
                      </td>
                      <td>
                        <span className={`${styles.verdict} ${verdictClass(item.verdict)}`}>
                          {VERDICT_LABELS[item.verdict]}
                        </span>
                      </td>
                      <td className={styles.reason}>{item.reason ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleStage}
              disabled={staging || preview.result.counts.ok === 0}
            >
              {staging
                ? '등록 중…'
                : preview.result.counts.ok === 0
                  ? '반영 가능한 행이 없습니다'
                  : `승인 대기열에 올리기 (반영 ${preview.result.counts.ok}건)`}
            </button>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>승인 대기열 · 반영 이력</h2>
        {notice && <p className={styles.notice}>{notice}</p>}
        {runs === null ? (
          <p className={styles.guardNote}>불러오는 중…</p>
        ) : runs.length === 0 ? (
          <p className={styles.guardNote}>아직 웹 업로드 실행이 없습니다.</p>
        ) : (
          <ul className={styles.runList}>
            {runs.map((run) => (
              <li key={run.id} className={styles.runItem}>
                <button
                  type="button"
                  className={styles.runRow}
                  onClick={() => toggleRun(run.id)}
                  aria-expanded={openRunId === run.id}
                >
                  <span className={styles.mono}>#{run.id}</span>
                  <span
                    className={`${styles.runStatus} ${
                      run.status === 'awaiting_approval'
                        ? styles.heldText
                        : run.status === 'applied'
                          ? styles.okText
                          : styles.rejectedText
                    }`}
                  >
                    {RUN_STATUS_LABELS[run.status] ?? run.status}
                  </span>
                  <span className={styles.runCounts}>
                    총 {run.totalCount} · 반영 {run.appliedCount} · 보류 {run.heldCount} · 거부{' '}
                    {run.rejectedCount}
                  </span>
                  <span className={styles.runDate}>
                    {new Date(run.createdAt).toLocaleString('ko-KR')}
                  </span>
                </button>

                {openRunId === run.id && (
                  <div className={styles.runDetail}>
                    {run.status === 'awaiting_approval' && (
                      <div className={styles.runActions}>
                        <button
                          type="button"
                          className={styles.primaryButton}
                          onClick={() => handleApprove(run.id)}
                          disabled={acting === run.id}
                        >
                          {acting === run.id ? '처리 중…' : '승인 — ok 행 반영'}
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={() => handleDiscard(run.id)}
                          disabled={acting === run.id}
                        >
                          폐기
                        </button>
                      </div>
                    )}
                    {runItems[run.id] ? (
                      <div className={`${styles.tableWrap} ${styles.previewTable}`}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>출처</th>
                              <th>상품코드</th>
                              <th>상품</th>
                              <th>정가</th>
                              <th>판정</th>
                              <th>사유</th>
                            </tr>
                          </thead>
                          <tbody>
                            {runItems[run.id].map((item, index) => (
                              <tr key={`${run.id}-${index}`}>
                                <td className={styles.mono}>{item.sourceLabel ?? '—'}</td>
                                <td className={styles.mono}>{item.matchKey || '—'}</td>
                                <td>{item.productName ?? '—'}</td>
                                <td className={styles.number}>
                                  {money(item.oldPrice)} → {money(item.newPrice)}
                                </td>
                                <td>
                                  <span className={`${styles.verdict} ${verdictClass(item.verdict)}`}>
                                    {VERDICT_LABELS[item.verdict] ?? item.verdict}
                                  </span>
                                </td>
                                <td className={styles.reason}>{item.reason ?? ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className={styles.guardNote}>행 불러오는 중…</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

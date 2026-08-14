'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, type ReadonlyURLSearchParams } from 'next/navigation';
import BuilderSlot from '@/components/BuilderSlot';
import CompatibilityAlert from '@/components/CompatibilityAlert';
import { useCart } from '@/lib/cart/CartContext';
import {
  SLOT_LABELS,
  SLOT_ORDER,
  missingSlots,
  recommendedWattage,
  summarize,
  totalPrice,
  totalTdp,
  validateBuild,
  type BuildSlots,
} from '@/lib/builder/compatibility';
import { getPartsBySlot, getProduct } from '@/lib/shop/catalog';
import { formatPrice } from '@/lib/shop/format';
import type { PartSlot } from '@/lib/shop/types';
import styles from './Builder.module.css';

/**
 * 견적짜기 화면 (설계문서 7장).
 *
 * 견적 공유는 원래 DB에 저장하고 share_token 을 발급하는 설계지만,
 * 뼈대 단계에는 서버가 없다. 대신 슬롯 구성을 쿼리스트링에 실어
 * `?cpu=...&gpu=...` 형태의 링크로 만든다. 서버가 붙으면 이 링크를
 * 그대로 저장 요청의 입력으로 쓸 수 있어 버려지는 코드가 아니다.
 */

/**
 * 공유 링크의 쿼리를 견적 구성으로 되돌린다.
 *
 * slug 는 URL 로 들어오는 값이라 신뢰하지 않는다. 카탈로그에 있고 그 슬롯에
 * 맞는 부품일 때만 받아들인다. 아니면 조용히 무시한다 — 링크 하나가 틀렸다고
 * 견적짜기 화면 전체가 죽으면 안 된다.
 */
function restoreFromQuery(searchParams: ReadonlyURLSearchParams): BuildSlots {
  const restored: BuildSlots = {};
  for (const slot of SLOT_ORDER) {
    const slug = searchParams.get(slot);
    if (!slug) continue;
    const product = getProduct(slug);
    if (product && product.categorySlug === slot) restored[slot] = product;
  }
  return restored;
}

export default function Builder() {
  const searchParams = useSearchParams();
  const { addMany } = useCart();
  // 첫 렌더에서 한 번만 복원한다. 이후로는 화면 상태가 원본이고
  // URL 은 내보내기(공유 링크) 전용이다.
  const [build, setBuild] = useState<BuildSlots>(() => restoreFromQuery(searchParams));
  const [copied, setCopied] = useState(false);

  const issues = useMemo(() => validateBuild(build), [build]);
  const { hasError } = summarize(issues);
  const missing = missingSlots(build);
  const price = totalPrice(build);
  const power = totalTdp(build);
  const suggestedPsu = recommendedWattage(build);

  /** 슬롯별로 가장 심각한 문제 수준. 슬롯 테두리 색에 쓴다 */
  const slotLevels = useMemo(() => {
    const levels: Partial<Record<PartSlot, 'error' | 'warning'>> = {};
    for (const issue of issues) {
      for (const slot of issue.slots) {
        if (levels[slot] === 'error') continue;
        levels[slot] = issue.level;
      }
    }
    return levels;
  }, [issues]);

  const selectedSlugs = Object.values(build).map((product) => product.slug);

  function handleSelect(slot: PartSlot, slug: string) {
    const product = getProduct(slug);
    if (!product) return;
    setBuild((prev) => ({ ...prev, [slot]: product }));
  }

  function handleClear(slot: PartSlot) {
    setBuild((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }

  async function handleShare() {
    const query = new URLSearchParams();
    for (const slot of SLOT_ORDER) {
      const product = build[slot];
      if (product) query.set(slot, product.slug);
    }
    const url = `${window.location.origin}${window.location.pathname}?${query.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // 클립보드 권한이 없거나 http 환경이면 실패한다. 주소창에라도 반영해 둔다.
      window.history.replaceState(null, '', url);
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.slots}>
        {SLOT_ORDER.map((slot) => (
          <BuilderSlot
            key={slot}
            slot={slot}
            label={SLOT_LABELS[slot]}
            options={getPartsBySlot(slot)}
            selected={build[slot]}
            issueLevel={slotLevels[slot]}
            onSelect={handleSelect}
            onClear={handleClear}
          />
        ))}
      </div>

      <aside className={styles.panel}>
        <div className={styles.panelBlock}>
          <h2 className={styles.panelTitle}>호환성 검사</h2>
          <CompatibilityAlert issues={issues} isComplete={missing.length === 0} />
        </div>

        <div className={styles.panelBlock}>
          <h2 className={styles.panelTitle}>구성 요약</h2>
          <dl className={styles.summary}>
            <div className={styles.summaryRow}>
              <dt>고른 부품</dt>
              <dd>{selectedSlugs.length} / {SLOT_ORDER.length}개</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>예상 소비전력</dt>
              <dd>{power > 0 ? `${power}W` : '—'}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>권장 파워 용량</dt>
              <dd>{suggestedPsu > 0 ? `${suggestedPsu}W 이상` : '—'}</dd>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <dt>합계</dt>
              <dd>{formatPrice(price)}</dd>
            </div>
          </dl>

          {missing.length > 0 && (
            <p className={styles.missing}>
              아직 안 고른 필수 부품: {missing.map((slot) => SLOT_LABELS[slot]).join(', ')}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={selectedSlugs.length === 0 || hasError}
            onClick={() => addMany(selectedSlugs)}
          >
            {hasError ? '호환성 오류를 먼저 해결하세요' : '견적 전체 장바구니에 담기'}
          </button>

          <div className={styles.subActions}>
            <button
              type="button"
              className={styles.subButton}
              onClick={handleShare}
              disabled={selectedSlugs.length === 0}
            >
              {copied ? '링크를 복사했습니다' : '견적 링크 복사'}
            </button>
            <button
              type="button"
              className={styles.subButton}
              onClick={() => setBuild({})}
              disabled={selectedSlugs.length === 0}
            >
              전체 비우기
            </button>
          </div>

          <Link href="/cart" className={styles.cartLink}>
            장바구니 보기 →
          </Link>
        </div>
      </aside>
    </div>
  );
}

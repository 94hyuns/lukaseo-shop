'use client';

import Link from 'next/link';
import SpecBadge from '@/components/SpecBadge';
import { effectivePrice } from '@/lib/shop/catalog';
import { featuredSpecs, formatPrice } from '@/lib/shop/format';
import type { PartSlot, Product } from '@/lib/shop/types';
import styles from './BuilderSlot.module.css';

type Props = {
  slot: PartSlot;
  label: string;
  options: Product[];
  selected?: Product;
  /** 이 슬롯이 오류에 연루되어 있으면 테두리를 붉게 바꾼다 */
  issueLevel?: 'error' | 'warning';
  onSelect: (slot: PartSlot, slug: string) => void;
  onClear: (slot: PartSlot) => void;
};

export default function BuilderSlot({
  slot,
  label,
  options,
  selected,
  issueLevel,
  onSelect,
  onClear,
}: Props) {
  const selectId = `builder-slot-${slot}`;

  return (
    <div
      className={`${styles.slot} ${
        issueLevel === 'error'
          ? styles.slotError
          : issueLevel === 'warning'
            ? styles.slotWarning
            : ''
      }`}
    >
      <div className={styles.head}>
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
        {selected && (
          <button type="button" className={styles.clear} onClick={() => onClear(slot)}>
            비우기
          </button>
        )}
      </div>

      <select
        id={selectId}
        className={styles.select}
        value={selected?.slug ?? ''}
        onChange={(event) => {
          const { value } = event.target;
          if (value) onSelect(slot, value);
          else onClear(slot);
        }}
      >
        <option value="">선택하세요</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.name} · {formatPrice(effectivePrice(option))}
          </option>
        ))}
      </select>

      {selected ? (
        <div className={styles.detail}>
          <ul className={styles.specs}>
            {featuredSpecs(selected.spec).map((spec) => (
              <li key={spec}>
                <SpecBadge>{spec}</SpecBadge>
              </li>
            ))}
          </ul>
          <div className={styles.priceRow}>
            <Link href={`/products/${selected.slug}`} className={styles.detailLink}>
              상품 정보 →
            </Link>
            <strong className={styles.price}>{formatPrice(effectivePrice(selected))}</strong>
          </div>
        </div>
      ) : (
        <p className={styles.placeholder}>아직 고르지 않았습니다.</p>
      )}
    </div>
  );
}

import type { JSX } from 'react';

/**
 * 카테고리별 부품 라인아트.
 *
 * 실제 상품 사진이 없는 데모 단계의 대체물이다. 제조사 사진을 가져다 쓰는 건
 * 저작권 문제가 있어, 직접 그린 SVG 일러스트로 도록 같은 인상을 만든다.
 * 실사진이 생기면 이 컴포넌트를 <img> 로 바꾸기만 하면 된다.
 *
 * 전부 stroke: currentColor 라서 쓰는 쪽에서 색을 정한다.
 */

const ART: Record<string, JSX.Element> = {
  cpu: (
    <>
      <rect x="16" y="16" width="32" height="32" rx="3" />
      <rect x="26" y="26" width="12" height="12" />
      {/* 핀 */}
      <path d="M24 16v-6M32 16v-6M40 16v-6M24 54v-6M32 54v-6M40 54v-6M16 24h-6M16 32h-6M16 40h-6M54 24h-6M54 32h-6M54 40h-6" />
    </>
  ),
  mainboard: (
    <>
      <rect x="9" y="9" width="46" height="46" rx="2" />
      <rect x="15" y="15" width="14" height="14" />
      <path d="M36 15v16M42 15v16M48 15v16" />
      <path d="M15 38h26M15 46h18" />
      <circle cx="49" cy="47" r="3" />
    </>
  ),
  ram: (
    <>
      <rect x="22" y="7" width="20" height="44" rx="2" />
      <rect x="27" y="13" width="10" height="7" />
      <rect x="27" y="25" width="10" height="7" />
      <rect x="27" y="37" width="10" height="7" />
      <path d="M26 51v6M32 51v6M38 51v6" />
    </>
  ),
  gpu: (
    <>
      <rect x="12" y="20" width="44" height="22" rx="3" />
      <circle cx="26" cy="31" r="7" />
      <circle cx="44" cy="31" r="7" />
      <path d="M26 27v8M44 27v8" />
      <path d="M12 26H7v14" />
      <path d="M18 42v5h14v-5" />
    </>
  ),
  ssd: (
    <>
      <rect x="8" y="25" width="44" height="14" rx="2" />
      <path d="M52 28l5 3-5 3" />
      <rect x="14" y="29" width="9" height="6" />
      <rect x="28" y="29" width="9" height="6" />
      <path d="M12 39v4M18 39v4M24 39v4M30 39v4M36 39v4" />
    </>
  ),
  psu: (
    <>
      <rect x="9" y="17" width="46" height="30" rx="2" />
      <circle cx="24" cy="32" r="9" />
      <path d="M24 26v12M18.8 29l10.4 6M18.8 35l10.4-6" />
      <path d="M40 24h9M40 30h9M40 36h9" />
      <path d="M20 47v5M32 47v5" />
    </>
  ),
  case: (
    <>
      <rect x="17" y="6" width="30" height="52" rx="3" />
      <rect x="23" y="14" width="18" height="26" />
      <circle cx="32" cy="10" r="1.5" />
      <path d="M23 47h18M23 52h18" />
    </>
  ),
  cooler: (
    <>
      <rect x="10" y="10" width="44" height="44" rx="8" />
      <circle cx="32" cy="32" r="5" />
      <path d="M32 14c6 6 0 10 0 13M50 32c-6 6-10 0-13 0M32 50c-6-6 0-10 0-13M14 32c6-6 10 0 13 0" />
      <circle cx="15.5" cy="15.5" r="1.5" />
      <circle cx="48.5" cy="15.5" r="1.5" />
      <circle cx="15.5" cy="48.5" r="1.5" />
      <circle cx="48.5" cy="48.5" r="1.5" />
    </>
  ),
  'gaming-pc': (
    <>
      <rect x="14" y="6" width="30" height="52" rx="3" />
      <rect x="20" y="12" width="18" height="24" />
      <circle cx="29" cy="45" r="4" />
      <circle cx="29" cy="45" r="1" />
      <path d="M50 18v28" />
      <circle cx="50" cy="14" r="1.5" />
    </>
  ),
  'overclock-pc': (
    <>
      <rect x="8" y="10" width="26" height="44" rx="3" />
      <rect x="13" y="16" width="16" height="18" />
      <rect x="42" y="14" width="14" height="30" rx="2" />
      <path d="M45 18v22M49 18v22M53 18v22" />
      <path d="M34 24c4 0 4 4 8 4M34 40c4 0 4-4 8-4" />
    </>
  ),
  monitor: (
    <>
      <rect x="8" y="10" width="48" height="32" rx="2" />
      <path d="M32 42v8" />
      <path d="M22 54h20" />
      <path d="M14 34l10-10 6 6 10-12" />
    </>
  ),
  peripheral: (
    <>
      <rect x="6" y="30" width="34" height="20" rx="3" />
      <path d="M11 36h4M19 36h4M27 36h4M11 42h4M19 42h4M27 42h4" />
      <rect x="45" y="26" width="13" height="24" rx="6.5" />
      <path d="M51.5 30v5" />
    </>
  ),
};

const FALLBACK = (
  <>
    <rect x="12" y="12" width="40" height="40" rx="4" />
    <path d="M22 42l8-12 6 7 4-5 8 10" />
  </>
);

type Props = {
  /** 카테고리 slug. 없는 값이면 범용 상자 아이콘 */
  slug: string;
  className?: string;
};

export default function PartIllustration({ slug, className }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ART[slug] ?? FALLBACK}
    </svg>
  );
}

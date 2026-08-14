import { Suspense } from 'react';
import type { Metadata } from 'next';
import Builder from '@/components/Builder';
import styles from './builder.module.css';

export const metadata: Metadata = {
  title: '견적짜기',
  description:
    'CPU 소켓, 메모리 규격, 그래픽카드 길이, 파워 용량까지. 부품을 고르는 즉시 호환성을 검사합니다.',
};

const RULES = [
  'CPU와 메인보드의 소켓이 같은지',
  '메모리 규격(DDR4/DDR5)이 메인보드와 맞는지',
  '메인보드 규격이 케이스에 들어가는지',
  '그래픽카드 길이와 쿨러 높이가 케이스 한계 안인지',
  '쿨러가 CPU 소켓을 지원하고 발열을 감당하는지',
  '파워 용량이 전체 소비전력에 여유를 두고 충분한지',
  'CPU와 그래픽카드의 성능 급이 크게 어긋나지 않는지',
];

export default function BuilderPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>견적짜기</h1>
        <p className={styles.description}>
          부품을 고를 때마다 아래 항목을 검사합니다. 조립하고 나서 안 맞는 걸 발견하는 일이
          없도록 만든 기능입니다.
        </p>
        <ul className={styles.rules}>
          {RULES.map((rule) => (
            <li key={rule} className={styles.rule}>
              {rule}
            </li>
          ))}
        </ul>
      </header>

      {/* 공유 링크(?cpu=...&gpu=...)를 읽으므로 Suspense 경계가 필요하다 */}
      <Suspense fallback={<p className={styles.loading}>견적표를 준비하는 중…</p>}>
        <Builder />
      </Suspense>
    </div>
  );
}

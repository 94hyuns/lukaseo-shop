import styles from './SpecBadge.module.css';

/**
 * 스펙 뱃지. `i5-14400F` 같은 모델명은 자간이 일정한 mono 폰트로 찍어야
 * 숫자와 알파벳이 섞인 문자열이 읽힌다.
 */
export default function SpecBadge({ children }: { children: React.ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}

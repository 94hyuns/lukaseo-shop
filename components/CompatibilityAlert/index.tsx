import { SLOT_LABELS, type Issue } from '@/lib/builder/compatibility';
import styles from './CompatibilityAlert.module.css';

type Props = {
  issues: Issue[];
  /** 필수 슬롯을 다 채웠는지. 다 채웠고 문제도 없으면 통과 배너를 띄운다 */
  isComplete: boolean;
};

export default function CompatibilityAlert({ issues, isComplete }: Props) {
  if (issues.length === 0) {
    return (
      <div className={`${styles.alert} ${styles.alertOk}`} role="status">
        <span className={styles.icon} aria-hidden="true">
          ✓
        </span>
        <div>
          <strong className={styles.title}>
            {isComplete ? '호환성 문제가 없습니다' : '지금까지는 문제가 없습니다'}
          </strong>
          <p className={styles.body}>
            {isComplete
              ? '이 구성 그대로 조립할 수 있습니다.'
              : '남은 부품을 마저 고르면 계속 검사합니다.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {issues.map((issue) => (
        <li
          key={`${issue.level}-${issue.slots.join('-')}-${issue.message}`}
          className={`${styles.alert} ${
            issue.level === 'error' ? styles.alertError : styles.alertWarning
          }`}
          // 오류는 즉시 읽어줘야 하고, 경고는 하던 조작을 끊지 않는 편이 낫다
          role={issue.level === 'error' ? 'alert' : 'status'}
        >
          <span className={styles.icon} aria-hidden="true">
            {issue.level === 'error' ? '✕' : '!'}
          </span>
          <div>
            <strong className={styles.title}>
              {issue.slots.map((slot) => SLOT_LABELS[slot]).join(' ↔ ')}
              <span className={styles.levelTag}>
                {issue.level === 'error' ? '장착 불가' : '확인 필요'}
              </span>
            </strong>
            <p className={styles.body}>{issue.message}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

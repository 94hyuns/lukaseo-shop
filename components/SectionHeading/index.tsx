import Link from 'next/link';
import styles from './SectionHeading.module.css';

type Props = {
  title: string;
  description?: string;
  /** 있으면 오른쪽에 "더보기" 링크를 단다 */
  moreHref?: string;
};

export default function SectionHeading({ title, description, moreHref }: Props) {
  return (
    <div className={styles.wrap}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {moreHref && (
        <Link href={moreHref} className={styles.more}>
          더보기 →
        </Link>
      )}
    </div>
  );
}

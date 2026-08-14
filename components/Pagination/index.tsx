import styles from './Pagination.module.css';

type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.wrap} aria-label="페이지 이동">
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        ←
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`${styles.page} ${page === currentPage ? styles.pageActive : ''}`}
          onClick={() => onChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        →
      </button>
    </nav>
  );
}

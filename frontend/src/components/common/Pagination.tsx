"use client";

import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        {total > 0 ? `${start}-${end} of ${total}` : "No results"}
      </div>

      <div className={styles.controls}>
        <select
          className={styles.pageSize}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>

        <button
          className={styles.navButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          &#x2039;
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let p: number;
          if (totalPages <= 5) {
            p = i + 1;
          } else if (page <= 3) {
            p = i + 1;
          } else if (page >= totalPages - 2) {
            p = totalPages - 4 + i;
          } else {
            p = page - 2 + i;
          }
          return (
            <button
              key={p}
              className={`${styles.pageButton} ${p === page ? styles.active : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          );
        })}

        <button
          className={styles.navButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          &#x203A;
        </button>
      </div>
    </div>
  );
}

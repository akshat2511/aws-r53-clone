import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <svg className={styles.icon} width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="var(--color-border)" strokeWidth="2" />
        <circle cx="24" cy="24" r="8" stroke="var(--color-border)" strokeWidth="2" />
        <line x1="4" y1="24" x2="44" y2="24" stroke="var(--color-border)" strokeWidth="2" />
        <ellipse cx="24" cy="24" rx="12" ry="20" stroke="var(--color-border)" strokeWidth="2" />
      </svg>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

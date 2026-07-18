import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormField({ label, htmlFor, required, error, description, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {description && <p className={styles.description}>{description}</p>}
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

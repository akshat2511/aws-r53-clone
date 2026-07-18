"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./FlashBar.module.css";

export default function FlashBar() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.flashBar}>
      {notifications.map((n) => (
        <div key={n.id} className={`${styles.flash} ${styles[n.type]}`}>
          <span className={styles.icon}>
            {n.type === "success" && "\u2713"}
            {n.type === "error" && "\u2717"}
            {n.type === "info" && "\u24D8"}
            {n.type === "warning" && "\u26A0"}
          </span>
          <span className={styles.message}>{n.message}</span>
          <button
            className={styles.dismiss}
            onClick={() => removeNotification(n.id)}
            aria-label="Dismiss notification"
          >
            {"\u2715"}
          </button>
        </div>
      ))}
    </div>
  );
}

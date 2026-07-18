"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { DnsRecord, deleteRecord } from "@/lib/records-api";
import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./DeleteRecordModal.module.css";

interface Props {
  zoneId: string;
  record: DnsRecord;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteRecordModal({ zoneId, record, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteRecord(zoneId, record.id);
      addNotification("success", `${record.type} record for ${record.name} deleted`);
      onDeleted();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete record";
      addNotification("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Delete record" onClose={onClose} width="480px">
      <div className={styles.content}>
        <p className={styles.warning}>
          Are you sure you want to delete the <strong>{record.type}</strong> record
          for <strong>{record.name}</strong>? This action cannot be undone.
        </p>
        <div className={styles.recordInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Type</span>
            <span>{record.type}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Name</span>
            <span>{record.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Value</span>
            <span>{record.value.join(", ")}</span>
          </div>
        </div>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="danger" onClick={handleDelete} disabled={submitting}>
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

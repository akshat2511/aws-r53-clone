"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { HostedZone, deleteHostedZone } from "@/lib/hosted-zones-api";
import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./DeleteZoneModal.module.css";

interface Props {
  zone: HostedZone;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteZoneModal({ zone, onClose, onDeleted }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteHostedZone(zone.zone_id);
      addNotification("success", `Hosted zone ${zone.name} deleted`);
      onDeleted();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete hosted zone";
      addNotification("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Delete hosted zone" onClose={onClose} width="480px">
      <div className={styles.content}>
        <p className={styles.warning}>
          Are you sure you want to delete the hosted zone <strong>{zone.name}</strong>?
          This will also delete all {zone.record_count} DNS records in this zone.
          This action cannot be undone.
        </p>
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

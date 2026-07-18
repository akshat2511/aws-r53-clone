"use client";

import { useState, FormEvent } from "react";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import Button from "@/components/common/Button";
import { HostedZone, updateHostedZone } from "@/lib/hosted-zones-api";
import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./CreateZoneModal.module.css";

interface Props {
  zone: HostedZone;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditZoneModal({ zone, onClose, onUpdated }: Props) {
  const [comment, setComment] = useState(zone.comment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await updateHostedZone(zone.zone_id, { comment });
      addNotification("success", `Hosted zone ${zone.name} updated`);
      onUpdated();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update hosted zone";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Edit hosted zone" onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.formError}>{error}</div>}

        <FormField label="Domain name">
          <input className={styles.input} value={zone.name} disabled />
        </FormField>

        <FormField label="Type">
          <input className={styles.input} value={zone.type} disabled />
        </FormField>

        <FormField label="Comment" htmlFor="edit-comment">
          <textarea
            id="edit-comment"
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            autoFocus
          />
        </FormField>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import { useState, FormEvent } from "react";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import Button from "@/components/common/Button";
import { createHostedZone } from "@/lib/hosted-zones-api";
import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./CreateZoneModal.module.css";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateZoneModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Public");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Domain name is required");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      await createHostedZone({ name: name.trim(), type, comment });
      addNotification("success", `Hosted zone ${name} created successfully`);
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create hosted zone";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Create hosted zone" onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.formError}>{error}</div>}

        <FormField label="Domain name" htmlFor="zone-name" required>
          <input
            id="zone-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="example.com"
            autoFocus
          />
        </FormField>

        <FormField label="Type" description="Choose whether this is a public or private hosted zone">
          <div className={styles.radioGroup}>
            <label className={styles.radio}>
              <input
                type="radio"
                name="zone-type"
                value="Public"
                checked={type === "Public"}
                onChange={(e) => setType(e.target.value)}
              />
              <span>Public hosted zone</span>
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="zone-type"
                value="Private"
                checked={type === "Private"}
                onChange={(e) => setType(e.target.value)}
              />
              <span>Private hosted zone</span>
            </label>
          </div>
        </FormField>

        <FormField label="Comment" htmlFor="zone-comment" description="Optional description for this hosted zone">
          <textarea
            id="zone-comment"
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </FormField>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create hosted zone"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

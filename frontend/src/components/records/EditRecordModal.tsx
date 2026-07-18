"use client";

import { useState, FormEvent } from "react";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import Button from "@/components/common/Button";
import { DnsRecord, updateRecord } from "@/lib/records-api";
import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./RecordModal.module.css";

interface Props {
  zoneId: string;
  record: DnsRecord;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditRecordModal({ zoneId, record, onClose, onUpdated }: Props) {
  const [ttl, setTtl] = useState(record.ttl.toString());
  const [values, setValues] = useState(record.value.join("\n"));
  const [routingPolicy, setRoutingPolicy] = useState(record.routing_policy);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const valueList = values.split("\n").map((v) => v.trim()).filter(Boolean);

    if (valueList.length === 0) {
      setError("At least one value is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await updateRecord(zoneId, record.id, {
        ttl: parseInt(ttl, 10) || 300,
        value: valueList,
        routing_policy: routingPolicy,
      });
      addNotification("success", `${record.type} record for ${record.name} updated`);
      onUpdated();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update record";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Edit record" onClose={onClose} width="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.formError}>{error}</div>}

        <FormField label="Record name">
          <input className={styles.input} value={record.name} disabled />
        </FormField>

        <FormField label="Record type">
          <input className={styles.input} value={record.type} disabled />
        </FormField>

        <FormField label="TTL (seconds)" htmlFor="edit-ttl">
          <input
            id="edit-ttl"
            type="number"
            className={styles.input}
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            min="0"
            max="2147483647"
          />
        </FormField>

        <FormField
          label="Value"
          htmlFor="edit-value"
          required
          description="One value per line."
        >
          <textarea
            id="edit-value"
            className={styles.textarea}
            value={values}
            onChange={(e) => setValues(e.target.value)}
            rows={4}
          />
        </FormField>

        <FormField label="Routing policy" htmlFor="edit-routing">
          <select
            id="edit-routing"
            className={styles.select}
            value={routingPolicy}
            onChange={(e) => setRoutingPolicy(e.target.value)}
          >
            <option value="Simple">Simple</option>
            <option value="Weighted">Weighted</option>
            <option value="Latency">Latency</option>
            <option value="Failover">Failover</option>
            <option value="Geolocation">Geolocation</option>
            <option value="Multivalue">Multivalue answer</option>
          </select>
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

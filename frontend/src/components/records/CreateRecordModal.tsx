"use client";

import { useState, FormEvent } from "react";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import Button from "@/components/common/Button";
import { createRecord } from "@/lib/records-api";
import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./RecordModal.module.css";

const RECORD_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"];

interface Props {
  zoneId: string;
  zoneName: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateRecordModal({ zoneId, zoneName, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("A");
  const [ttl, setTtl] = useState("300");
  const [values, setValues] = useState("");
  const [routingPolicy, setRoutingPolicy] = useState("Simple");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim() || zoneName;
    const valueList = values.split("\n").map((v) => v.trim()).filter(Boolean);

    if (valueList.length === 0) {
      setError("At least one value is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createRecord(zoneId, {
        name: trimmedName,
        type,
        ttl: parseInt(ttl, 10) || 300,
        value: valueList,
        routing_policy: routingPolicy,
      });
      addNotification("success", `${type} record created for ${trimmedName}`);
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create record";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Create record" onClose={onClose} width="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.formError}>{error}</div>}

        <FormField
          label="Record name"
          htmlFor="record-name"
          description={`Subdomain prefix. Leave empty for ${zoneName}`}
        >
          <div className={styles.nameInput}>
            <input
              id="record-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={zoneName}
            />
            <span className={styles.nameSuffix}>.{zoneName}</span>
          </div>
        </FormField>

        <FormField label="Record type" htmlFor="record-type" required>
          <select
            id="record-type"
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField label="TTL (seconds)" htmlFor="record-ttl">
          <input
            id="record-ttl"
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
          htmlFor="record-value"
          required
          description="One value per line. For multiple values, add each on a separate line."
        >
          <textarea
            id="record-value"
            className={styles.textarea}
            value={values}
            onChange={(e) => setValues(e.target.value)}
            rows={4}
            placeholder={type === "A" ? "192.0.2.1" : type === "CNAME" ? "target.example.com." : ""}
          />
        </FormField>

        <FormField label="Routing policy" htmlFor="record-routing">
          <select
            id="record-routing"
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
            {submitting ? "Creating..." : "Create record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

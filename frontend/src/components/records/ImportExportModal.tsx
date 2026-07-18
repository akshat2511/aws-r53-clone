"use client";

import { useState, useRef } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { HostedZone } from "@/lib/hosted-zones-api";
import { DnsRecord, listRecords, createRecord } from "@/lib/records-api";
import { useNotifications } from "@/contexts/NotificationContext";
import styles from "./ImportExportModal.module.css";

interface ExportData {
  zone: {
    name: string;
    type: string;
    comment: string;
  };
  records: {
    name: string;
    type: string;
    ttl: number;
    value: string[];
    routing_policy: string;
  }[];
  exported_at: string;
}

interface Props {
  mode: "export" | "import";
  zone: HostedZone;
  records?: DnsRecord[];
  onClose: () => void;
  onImported?: () => void;
}

export default function ImportExportModal({ mode, zone, records = [], onClose, onImported }: Props) {
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  const handleExport = () => {
    const data: ExportData = {
      zone: {
        name: zone.name,
        type: zone.type,
        comment: zone.comment,
      },
      records: records
        .filter((r) => r.type !== "NS" && r.type !== "SOA")
        .map((r) => ({
          name: r.name,
          type: r.type,
          ttl: r.ttl,
          value: r.value,
          routing_policy: r.routing_policy,
        })),
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${zone.name.replace(/\.$/, "")}-records.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification("success", `Exported ${data.records.length} records from ${zone.name}`);
    onClose();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportError("");

    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);

      if (!data.records || !Array.isArray(data.records)) {
        throw new Error("Invalid file format: missing records array");
      }

      let created = 0;
      for (const record of data.records) {
        try {
          await createRecord(zone.zone_id, {
            name: record.name,
            type: record.type,
            ttl: record.ttl,
            value: record.value,
            routing_policy: record.routing_policy,
          });
          created++;
        } catch {
          // skip duplicate or invalid records
        }
      }

      addNotification("success", `Imported ${created} of ${data.records.length} records into ${zone.name}`);
      onImported?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to parse import file";
      setImportError(msg);
    } finally {
      setImporting(false);
    }
  };

  if (mode === "export") {
    return (
      <Modal title="Export records" onClose={onClose} width="480px">
        <div className={styles.content}>
          <p className={styles.info}>
            Export all user-created records from <strong>{zone.name}</strong> as a JSON file.
            System records (NS, SOA) are excluded from the export.
          </p>
          <p className={styles.count}>
            Records to export: <strong>{records.filter((r) => r.type !== "NS" && r.type !== "SOA").length}</strong>
          </p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleExport}>Export</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Import records" onClose={onClose} width="480px">
      <div className={styles.content}>
        <p className={styles.info}>
          Import DNS records into <strong>{zone.name}</strong> from a JSON file.
          The file should match the export format.
        </p>

        {importError && <div className={styles.error}>{importError}</div>}

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className={styles.fileInput}
          onChange={handleImport}
          disabled={importing}
        />

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? "Importing..." : "Select file"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

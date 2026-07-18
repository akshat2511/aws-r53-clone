"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import CreateRecordModal from "@/components/records/CreateRecordModal";
import EditRecordModal from "@/components/records/EditRecordModal";
import DeleteRecordModal from "@/components/records/DeleteRecordModal";
import ImportExportModal from "@/components/records/ImportExportModal";
import { DnsRecord, listRecords } from "@/lib/records-api";
import { getHostedZone, HostedZone } from "@/lib/hosted-zones-api";
import styles from "./Records.module.css";

const RECORD_TYPES = ["", "A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA", "SOA"];

export default function RecordsPage() {
  const params = useParams();
  const zoneId = params.zoneId as string;

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [showCreate, setShowCreate] = useState(false);
  const [editRecord, setEditRecord] = useState<DnsRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<DnsRecord | null>(null);
  const [importExportMode, setImportExportMode] = useState<"export" | "import" | null>(null);

  useEffect(() => {
    getHostedZone(zoneId).then(setZone).catch(() => { });
  }, [zoneId]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listRecords(zoneId, page, pageSize, search, typeFilter);
      setRecords(data.items);
      setTotal(data.total);
    } catch {
      // handled by API layer
    } finally {
      setLoading(false);
    }
  }, [zoneId, page, pageSize, search, typeFilter]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === records.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(records.map((r) => r.id)));
    }
  };

  const selectedRecord = records.find((r) => selected.has(r.id));
  const isSystemRecord = selectedRecord && (selectedRecord.type === "NS" || selectedRecord.type === "SOA") && zone && selectedRecord.name === zone.name;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Route 53" },
          { label: "Hosted zones", href: "/hosted-zones" },
          { label: zone?.name || zoneId },
          { label: "Records" },
        ]}
      />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Records</h1>
          {zone && (
            <p className={styles.subtitle}>
              {zone.name} ({zone.zone_id}) - {zone.type} hosted zone
            </p>
          )}
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Find records"
            />
            <select
              className={styles.typeFilter}
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            >
              <option value="">All types</option>
              {RECORD_TYPES.filter(Boolean).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={styles.toolbarActions}>
            <Button
              variant="secondary"
              size="small"
              disabled={selected.size !== 1 || !!isSystemRecord}
              onClick={() => selectedRecord && setEditRecord(selectedRecord)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="small"
              disabled={selected.size !== 1 || !!isSystemRecord}
              onClick={() => selectedRecord && setDeleteRecord(selectedRecord)}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setImportExportMode("import")}
            >
              Import
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setImportExportMode("export")}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowCreate(true)}
            >
              Create record
            </Button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading records...</div>
        ) : records.length === 0 ? (
          <EmptyState
            title={search || typeFilter ? "No records found" : "No records"}
            description={search || typeFilter ? "Try a different filter" : "Create a DNS record for this hosted zone"}
            action={
              !search && !typeFilter ? (
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                  Create record
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkboxCol}>
                    <input
                      type="checkbox"
                      checked={selected.size === records.length && records.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Record name</th>
                  <th>Type</th>
                  <th>Routing policy</th>
                  <th>TTL</th>
                  <th>Value/Route traffic to</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className={selected.has(record.id) ? styles.selectedRow : ""}
                  >
                    <td className={styles.checkboxCol}>
                      <input
                        type="checkbox"
                        checked={selected.has(record.id)}
                        onChange={() => toggleSelect(record.id)}
                      />
                    </td>
                    <td className={styles.nameCell}>{record.name}</td>
                    <td>
                      <span className={styles.typeBadge}>{record.type}</span>
                    </td>
                    <td>{record.routing_policy}</td>
                    <td>{record.ttl}</td>
                    <td className={styles.valueCell}>
                      {record.value.map((v, i) => (
                        <div key={i} className={styles.valueLine}>{v}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            />
          </>
        )}
      </div>

      {showCreate && zone && (
        <CreateRecordModal
          zoneId={zoneId}
          zoneName={zone.name}
          onClose={() => setShowCreate(false)}
          onCreated={fetchRecords}
        />
      )}
      {editRecord && (
        <EditRecordModal
          zoneId={zoneId}
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onUpdated={() => { fetchRecords(); setSelected(new Set()); }}
        />
      )}
      {deleteRecord && (
        <DeleteRecordModal
          zoneId={zoneId}
          record={deleteRecord}
          onClose={() => setDeleteRecord(null)}
          onDeleted={() => { fetchRecords(); setSelected(new Set()); }}
        />
      )}
      {importExportMode && zone && (
        <ImportExportModal
          mode={importExportMode}
          zone={zone}
          records={records}
          onClose={() => setImportExportMode(null)}
          onImported={fetchRecords}
        />
      )}
    </div>
  );
}

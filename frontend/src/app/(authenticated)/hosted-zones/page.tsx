"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import CreateZoneModal from "@/components/hosted-zones/CreateZoneModal";
import EditZoneModal from "@/components/hosted-zones/EditZoneModal";
import DeleteZoneModal from "@/components/hosted-zones/DeleteZoneModal";
import { HostedZone, listHostedZones } from "@/lib/hosted-zones-api";
import styles from "./HostedZones.module.css";

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [showCreate, setShowCreate] = useState(false);
  const [editZone, setEditZone] = useState<HostedZone | null>(null);
  const [deleteZone, setDeleteZone] = useState<HostedZone | null>(null);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listHostedZones(page, pageSize, search);
      setZones(data.items);
      setTotal(data.total);
    } catch {
      // handled by API layer
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

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
    if (selected.size === zones.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(zones.map((z) => z.id)));
    }
  };

  const selectedZone = zones.find((z) => selected.has(z.id));

  return (
    <div>
      <Breadcrumb items={[{ label: "Route 53" }, { label: "Hosted zones" }]} />

      <div className={styles.header}>
        <h1 className={styles.title}>Hosted zones</h1>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Find hosted zones"
          />
          <div className={styles.toolbarActions}>
            <Button
              variant="secondary"
              size="small"
              disabled={selected.size !== 1}
              onClick={() => selectedZone && setEditZone(selectedZone)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="small"
              disabled={selected.size !== 1}
              onClick={() => selectedZone && setDeleteZone(selectedZone)}
            >
              Delete
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowCreate(true)}
            >
              Create hosted zone
            </Button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading hosted zones...</div>
        ) : zones.length === 0 ? (
          <EmptyState
            title={search ? "No hosted zones found" : "No hosted zones"}
            description={search ? "Try a different search term" : "Create a hosted zone to get started with DNS management"}
            action={
              !search ? (
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                  Create hosted zone
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
                      checked={selected.size === zones.length && zones.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Record count</th>
                  <th>Comment</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr
                    key={zone.id}
                    className={selected.has(zone.id) ? styles.selectedRow : ""}
                  >
                    <td className={styles.checkboxCol}>
                      <input
                        type="checkbox"
                        checked={selected.has(zone.id)}
                        onChange={() => toggleSelect(zone.id)}
                      />
                    </td>
                    <td>
                      <Link href={`/hosted-zones/${zone.zone_id}/records`} className={styles.zoneLink}>
                        {zone.name}
                      </Link>
                    </td>
                    <td>{zone.type}</td>
                    <td>{zone.record_count}</td>
                    <td className={styles.commentCell}>{zone.comment || "\u2014"}</td>
                    <td className={styles.dateCell}>
                      {new Date(zone.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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

      {showCreate && (
        <CreateZoneModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchZones}
        />
      )}
      {editZone && (
        <EditZoneModal
          zone={editZone}
          onClose={() => setEditZone(null)}
          onUpdated={() => { fetchZones(); setSelected(new Set()); }}
        />
      )}
      {deleteZone && (
        <DeleteZoneModal
          zone={deleteZone}
          onClose={() => setDeleteZone(null)}
          onDeleted={() => { fetchZones(); setSelected(new Set()); }}
        />
      )}
    </div>
  );
}

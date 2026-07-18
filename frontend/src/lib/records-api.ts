import { apiFetch } from "./api";

export interface DnsRecord {
  id: string;
  name: string;
  type: string;
  ttl: number;
  value: string[];
  routing_policy: string;
  set_identifier: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecordListResponse {
  items: DnsRecord[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateRecordPayload {
  name: string;
  type: string;
  ttl: number;
  value: string[];
  routing_policy?: string;
  set_identifier?: string;
}

export interface UpdateRecordPayload {
  ttl?: number;
  value?: string[];
  routing_policy?: string;
  set_identifier?: string;
}

export async function listRecords(
  zoneId: string,
  page: number = 1,
  pageSize: number = 20,
  search: string = "",
  recordType: string = "",
): Promise<RecordListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  if (search) params.set("search", search);
  if (recordType) params.set("type", recordType);
  return apiFetch(`/api/hosted-zones/${zoneId}/records?${params}`);
}

export async function getRecord(zoneId: string, recordId: string): Promise<DnsRecord> {
  return apiFetch(`/api/hosted-zones/${zoneId}/records/${recordId}`);
}

export async function createRecord(zoneId: string, data: CreateRecordPayload): Promise<DnsRecord> {
  return apiFetch(`/api/hosted-zones/${zoneId}/records`, { method: "POST", body: data });
}

export async function updateRecord(zoneId: string, recordId: string, data: UpdateRecordPayload): Promise<DnsRecord> {
  return apiFetch(`/api/hosted-zones/${zoneId}/records/${recordId}`, { method: "PUT", body: data });
}

export async function deleteRecord(zoneId: string, recordId: string): Promise<void> {
  return apiFetch(`/api/hosted-zones/${zoneId}/records/${recordId}`, { method: "DELETE" });
}

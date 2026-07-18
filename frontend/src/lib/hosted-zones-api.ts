import { apiFetch } from "./api";

export interface HostedZone {
  id: string;
  zone_id: string;
  name: string;
  type: string;
  record_count: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface HostedZoneListResponse {
  items: HostedZone[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateHostedZonePayload {
  name: string;
  type: string;
  comment: string;
}

export async function listHostedZones(
  page: number = 1,
  pageSize: number = 20,
  search: string = "",
): Promise<HostedZoneListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  if (search) params.set("search", search);
  return apiFetch(`/api/hosted-zones?${params}`);
}

export async function getHostedZone(zoneId: string): Promise<HostedZone> {
  return apiFetch(`/api/hosted-zones/${zoneId}`);
}

export async function createHostedZone(data: CreateHostedZonePayload): Promise<HostedZone> {
  return apiFetch("/api/hosted-zones", { method: "POST", body: data });
}

export async function updateHostedZone(zoneId: string, data: { comment: string }): Promise<HostedZone> {
  return apiFetch(`/api/hosted-zones/${zoneId}`, { method: "PUT", body: data });
}

export async function deleteHostedZone(zoneId: string): Promise<void> {
  return apiFetch(`/api/hosted-zones/${zoneId}`, { method: "DELETE" });
}

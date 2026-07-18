import { apiFetch } from "./api";

export interface User {
  id: string;
  email: string;
  account_id: string;
  display_name: string | null;
}

export async function loginApi(email: string, password: string): Promise<User> {
  return apiFetch<User>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function logoutApi(): Promise<void> {
  return apiFetch("/api/auth/logout", { method: "POST" });
}

export async function getMeApi(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}

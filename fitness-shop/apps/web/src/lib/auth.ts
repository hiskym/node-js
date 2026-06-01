import { apiFetch } from "./api";

export type User = {
  id: number;
  email: string;
  name: string;
  role: "admin" | "customer";
  isRegistered: boolean;
};

export function login(input: { email: string; password: string }) {
  return apiFetch<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiFetch<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}

export function getMe() {
  return apiFetch<User>("/auth/me", {
    cache: "no-store",
  });
}
import { apiFetch } from "./api";

export type AdminDashboardStats = {
  totalProducts: number;
  totalOrders: number;
  newOrders: number;
  completedRevenue: string;
  currency: string;
};

export function getAdminDashboardStats() {
  return apiFetch<AdminDashboardStats>("/admin/dashboard/stats");
}
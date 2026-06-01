"use client";

import Link from "next/link";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminProtected } from "@/components/admin/admin-protected";
import { logout } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/admin-dashboard";

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getAdminDashboardStats,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push("/admin/login");
    },
  });

  return (
    <AdminProtected>
      <main>
        <div className="page-header">
          <div>
            <h1>Administrace</h1>
            <p className="muted">Správa produktů, kategorií a objednávek.</p>
          </div>

          <button className="button secondary" onClick={() => logoutMutation.mutate()}>
            Odhlásit se
          </button>
        </div>

        <div className="grid product-grid" style={{ marginBottom: 32 }}>
          <div className="card">
            <p className="muted">Produkty</p>
            <h2>{statsQuery.data?.totalProducts ?? "—"}</h2>
          </div>

          <div className="card">
            <p className="muted">Objednávky</p>
            <h2>{statsQuery.data?.totalOrders ?? "—"}</h2>
          </div>

          <div className="card">
            <p className="muted">Nové objednávky</p>
            <h2>{statsQuery.data?.newOrders ?? "—"}</h2>
          </div>

          <div className="card">
            <p className="muted">Dokončené tržby</p>
            <h2>
              {statsQuery.data
                ? `${statsQuery.data.completedRevenue} ${statsQuery.data.currency}`
                : "—"}
            </h2>
          </div>
        </div>

        <div className="grid product-grid">
          <Link className="card" href="/admin/products">
            <h2>Produkty</h2>
            <p className="muted">Správa produktů, variant, obrázků a skladu.</p>
          </Link>

          <Link className="card" href="/admin/categories">
            <h2>Kategorie</h2>
            <p className="muted">Správa kategorií pro katalog.</p>
          </Link>

          <Link className="card" href="/admin/orders">
            <h2>Objednávky</h2>
            <p className="muted">Přehled objednávek a změna jejich stavu.</p>
          </Link>
        </div>
      </main>
    </AdminProtected>
  );
}
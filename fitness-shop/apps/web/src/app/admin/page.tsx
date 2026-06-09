"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminProtected } from "@/components/admin/admin-protected";
import { logout } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/admin-dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Administrace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-zinc-600">
              Přehled produktů, objednávek a základních statistik.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Odhlásit se
          </Button>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm text-zinc-500">Produkty</p>
            <h2 className="mt-2 text-3xl font-bold">
              {statsQuery.data?.totalProducts ?? "—"}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-zinc-500">Objednávky</p>
            <h2 className="mt-2 text-3xl font-bold">
              {statsQuery.data?.totalOrders ?? "—"}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-zinc-500">Nové objednávky</p>
            <h2 className="mt-2 text-3xl font-bold">
              {statsQuery.data?.newOrders ?? "—"}
            </h2>
          </Card>

          <Card>
            <p className="text-sm text-zinc-500">Dokončené tržby</p>
            <h2 className="mt-2 text-3xl font-bold">
              {statsQuery.data
                ? `${statsQuery.data.completedRevenue} ${statsQuery.data.currency}`
                : "—"}
            </h2>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/products" className="group">
            <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <h2 className="text-xl font-semibold">Produkty</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Správa produktů, variant, obrázků a skladu.
              </p>
            </Card>
          </Link>

          <Link href="/admin/categories" className="group">
            <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <h2 className="text-xl font-semibold">Kategorie</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Správa kategorií pro katalog produktů.
              </p>
            </Card>
          </Link>

          <Link href="/admin/orders" className="group">
            <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
              <h2 className="text-xl font-semibold">Objednávky</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Přehled objednávek a změna jejich stavu.
              </p>
            </Card>
          </Link>
        </section>
      </main>
    </AdminProtected>
  );
}
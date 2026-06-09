"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "@/lib/admin-orders";
import { AdminProtected } from "@/components/admin/admin-protected";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export default function AdminOrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });

  return (
    <AdminProtected>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Objednávky"
          description="Přehled objednávek a změna jejich stavu."
        />

        <Card>
          {ordersQuery.isLoading && (
            <p className="text-zinc-600">Načítám objednávky...</p>
          )}

          {ordersQuery.isError && (
            <p className="text-red-700">
              Objednávky se nepodařilo načíst.
            </p>
          )}

          {ordersQuery.data && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-3 pr-4 font-medium">Číslo</th>
                    <th className="py-3 pr-4 font-medium">Zákazník</th>
                    <th className="py-3 pr-4 font-medium">Stav</th>
                    <th className="py-3 pr-4 font-medium">Celkem</th>
                    <th className="py-3 pr-4 font-medium">Vytvořeno</th>
                    <th className="py-3 font-medium" />
                  </tr>
                </thead>

                <tbody>
                  {ordersQuery.data.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-zinc-100 last:border-0"
                    >
                      <td className="py-4 pr-4 font-medium">
                        {order.orderNumber}
                      </td>

                      <td className="py-4 pr-4">
                        <strong>{order.customerName}</strong>
                        <br />
                        <span className="text-xs text-zinc-500">
                          {order.customerEmail}
                        </span>
                      </td>

                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                          {order.status}
                        </span>
                      </td>

                      <td className="py-4 pr-4 font-medium">
                        {order.total} {order.currency}
                      </td>

                      <td className="py-4 pr-4 text-zinc-600">
                        {new Date(order.createdAt).toLocaleString("cs-CZ")}
                      </td>

                      <td className="py-4 text-right">
                        <ButtonLink
                          href={`/admin/orders/${order.id}`}
                          variant="secondary"
                        >
                          Detail
                        </ButtonLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </AdminProtected>
  );
}
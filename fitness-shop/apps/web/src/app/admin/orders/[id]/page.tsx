"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminOrder, updateAdminOrderStatus } from "@/lib/admin-orders";
import { AdminProtected } from "@/components/admin/admin-protected";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const statuses = [
  "new",
  "confirmed",
  "ready_for_pickup",
  "completed",
  "cancelled",
];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getAdminOrder(id),
    enabled: Number.isInteger(id),
  });

  const statusMutation = useMutation({
    mutationFn: updateAdminOrderStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
    },
  });

  if (orderQuery.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-zinc-600">Načítám objednávku...</p>
      </main>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-red-700">Objednávku se nepodařilo načíst.</p>
      </main>
    );
  }

  const order = orderQuery.data;

  return (
    <AdminProtected>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title={`Objednávka ${order.orderNumber}`}
          description="Detail objednávky, zákazník a stav."
          backHref="/admin/orders"
          backLabel="← Zpět na objednávky"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-xl font-semibold">Zákazník</h2>

            <div className="mt-4 text-sm leading-7 text-zinc-700">
              <p>
                <strong className="text-zinc-950">{order.customerName}</strong>
              </p>
              <p>{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold">Stav objednávky</h2>

            <div className="mt-4">
              <Select
                value={order.status}
                onChange={(event) =>
                  statusMutation.mutate({
                    id: order.id,
                    status: event.target.value,
                  })
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>

              {statusMutation.isPending && (
                <p className="mt-3 text-sm text-zinc-600">Ukládám...</p>
              )}

              {statusMutation.isError && (
                <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  Stav se nepodařilo změnit.
                </p>
              )}
            </div>
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="text-xl font-semibold">Položky</h2>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="py-3 pr-4 font-medium">Produkt</th>
                  <th className="py-3 pr-4 font-medium">Varianta</th>
                  <th className="py-3 pr-4 font-medium">Množství</th>
                  <th className="py-3 pr-4 font-medium">Cena/ks</th>
                  <th className="py-3 font-medium">Celkem</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="py-4 pr-4 font-medium">
                      {item.productName}
                    </td>
                    <td className="py-4 pr-4 text-zinc-600">
                      {item.variantName}
                    </td>
                    <td className="py-4 pr-4">{item.quantity}</td>
                    <td className="py-4 pr-4">
                      {item.unitPrice} {item.currency}
                    </td>
                    <td className="py-4 font-medium">
                      {item.totalPrice} {item.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end border-t border-zinc-200 pt-5">
            <div className="text-right">
              <p className="text-sm text-zinc-500">Celkem objednávka</p>
              <p className="text-2xl font-bold">
                {order.total} {order.currency}
              </p>
            </div>
          </div>
        </Card>

        {order.note && (
          <Card className="mt-6">
            <h2 className="text-xl font-semibold">Poznámka</h2>
            <p className="mt-3 text-zinc-700">{order.note}</p>
          </Card>
        )}
      </main>
    </AdminProtected>
  );
}
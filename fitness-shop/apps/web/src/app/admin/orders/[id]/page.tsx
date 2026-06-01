"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAdminOrder,
    updateAdminOrderStatus,
} from "@/lib/admin-orders";
import { AdminProtected } from "@/components/admin/admin-protected";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

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
        return <main style={{ padding: 32 }}>Načítám objednávku...</main>;
    }

    if (orderQuery.isError || !orderQuery.data) {
        return <main style={{ padding: 32 }}>Objednávku se nepodařilo načíst.</main>;
    }

    const order = orderQuery.data;

return (
  <AdminProtected>
    <main>
      <AdminPageHeader
        title={`Objednávka ${order.orderNumber}`}
        backHref="/admin/orders"
        backLabel="← Zpět na objednávky"
      />

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <section className="card">
          <h2>Zákazník</h2>
          <p>
            <strong>{order.customerName}</strong>
            <br />
            {order.customerEmail}
            <br />
            {order.customerPhone}
          </p>
        </section>

        <section className="card">
          <h2>Stav</h2>

          <select
            className="select"
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
          </select>

          {statusMutation.isPending && <p className="muted">Ukládám...</p>}
        </section>
      </div>

      <section className="card" style={{ marginTop: 24 }}>
        <h2>Položky</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Varianta</th>
              <th>Množství</th>
              <th>Cena/ks</th>
              <th>Celkem</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.variantName}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.unitPrice} {item.currency}
                </td>
                <td>
                  {item.totalPrice} {item.currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>
          Celkem objednávka: {order.total} {order.currency}
        </h3>
      </section>

      {order.note && (
        <section className="card" style={{ marginTop: 24 }}>
          <h2>Poznámka</h2>
          <p>{order.note}</p>
        </section>
      )}
    </main>
  </AdminProtected>
);
}
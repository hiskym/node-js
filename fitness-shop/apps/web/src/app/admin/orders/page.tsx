"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "@/lib/admin-orders";
import { AdminProtected } from "@/components/admin/admin-protected";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminOrdersPage() {
    const ordersQuery = useQuery({
        queryKey: ["admin-orders"],
        queryFn: getAdminOrders,
    });

    if (ordersQuery.isLoading) {
        return <main style={{ padding: 32 }}>Načítám objednávky...</main>;
    }

    if (ordersQuery.isError) {
        return <main style={{ padding: 32 }}>Objednávky se nepodařilo načíst.</main>;
    }

    return (
        <AdminProtected>
            <main>
                <AdminPageHeader title="Objednávky" />

                <section className="card">
                    {ordersQuery.isLoading && <p>Načítám objednávky...</p>}
                    {ordersQuery.isError && <p>Objednávky se nepodařilo načíst.</p>}

                    {ordersQuery.data && (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Číslo</th>
                                    <th>Zákazník</th>
                                    <th>Stav</th>
                                    <th>Celkem</th>
                                    <th>Vytvořeno</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {ordersQuery.data.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.orderNumber}</td>
                                        <td>
                                            <strong>{order.customerName}</strong>
                                            <br />
                                            <small className="muted">{order.customerEmail}</small>
                                        </td>
                                        <td>{order.status}</td>
                                        <td>
                                            {order.total} {order.currency}
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleString("cs-CZ")}</td>
                                        <td>
                                            <Link className="button secondary" href={`/admin/orders/${order.id}`}>
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </AdminProtected>
    );
}
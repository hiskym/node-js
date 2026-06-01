import { apiFetch } from "./api";

export type AdminOrder = {
  id: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingMethod: string;
  total: string;
  currency: string;
  createdAt: string;
};

export type AdminOrderItem = {
  id: number;
  productName: string;
  variantName?: string | null;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
  currency: string;
};

export type AdminOrderDetail = AdminOrder & {
  note?: string | null;
  items: AdminOrderItem[];
};

export function getAdminOrders() {
  return apiFetch<AdminOrder[]>("/admin/orders");
}

export function getAdminOrder(id: number) {
  return apiFetch<AdminOrderDetail>(`/admin/orders/${id}`);
}

export function updateAdminOrderStatus(input: {
  id: number;
  status: string;
}) {
  return apiFetch<AdminOrder>(`/admin/orders/${input.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status: input.status,
    }),
  });
}
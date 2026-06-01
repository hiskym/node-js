import { apiFetch } from "./api";

export type CreateOrderInput = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    productId: number;
    variantId: number;
    quantity: number;
  }[];
  note?: string;
};

export type CreateOrderResponse = {
  orderNumber: string;
  status: string;
  total: string;
  currency: string;
};

export function createOrder(input: CreateOrderInput) {
  return apiFetch<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
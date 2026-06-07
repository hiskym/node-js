import { apiFetch } from "./api";
import type { Product } from "./types";

export type CreateProductInput = {
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: string;
  currency?: string;
  isFeatured?: boolean;
  categoryIds: number[];
  images: {
    imageUrl: string;
    altText?: string;
    sortOrder?: number;
  }[];
  variants: {
    name: string;
    sku: string;
    price?: string;
    currency?: string;
    stockQuantity: number;
  }[];
};

export type UpdateProductInput = Partial<CreateProductInput> & {
  id: number;
  isActive?: boolean;
};

export function getAdminProducts() {
  return apiFetch<Product[]>("/admin/products");
}

export function createAdminProduct(input: CreateProductInput) {
  return apiFetch<Product>("/admin/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAdminProduct(input: UpdateProductInput) {
  const { id, ...body } = input;

  return apiFetch<Product>(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function getAdminProduct(id: number) {
  return apiFetch<Product>(`/admin/products/${id}`);
}

export function createAdminProductVariant(input: {
  productId: number;
  name: string;
  sku: string;
  price?: string;
  currency?: string;
  stockQuantity: number;
}) {
  const { productId, ...body } = input;

  return apiFetch(`/admin/products/${productId}/variants`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateAdminProductVariant(input: {
  productId: number;
  variantId: number;
  name?: string;
  sku?: string;
  price?: string;
  currency?: string;
  stockQuantity?: number;
  isActive?: boolean;
}) {
  const { productId, variantId, ...body } = input;

  return apiFetch(`/admin/products/${productId}/variants/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function createAdminProductImage(input: {
  productId: number;
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
}) {
  const { productId, ...body } = input;

  return apiFetch(`/admin/products/${productId}/images`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateAdminProductImage(input: {
  productId: number;
  imageId: number;
  imageUrl?: string;
  altText?: string;
  sortOrder?: number;
}) {
  const { productId, imageId, ...body } = input;

  return apiFetch(`/admin/products/${productId}/images/${imageId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteAdminProductImage(input: {
  productId: number;
  imageId: number;
}) {
  return apiFetch<{ success: boolean }>(
    `/admin/products/${input.productId}/images/${input.imageId}`,
    {
      method: "DELETE",
    },
  );
}
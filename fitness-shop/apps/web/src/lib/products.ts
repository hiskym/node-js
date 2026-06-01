import { apiFetch } from "./api";
import type { Category, Product } from "./types";

export function getProducts(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";


  return apiFetch<Product[]>(`/products${query}`, {
    cache: "no-store",
  });
}

export function getProduct(slug: string) {
  return apiFetch<Product>(`/products/${slug}`, {
    cache: "no-store",
  });
}

export function getCategories() {
  return apiFetch<Category[]>("/categories", {
    cache: "no-store",
  });
}
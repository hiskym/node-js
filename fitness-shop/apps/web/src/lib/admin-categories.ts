import { apiFetch } from "./api";
import type { Category } from "./types";

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput> & {
  id: number;
  isActive?: boolean;
};

export function getAdminCategories() {
  return apiFetch<Category[]>("/admin/categories");
}

export function createAdminCategory(input: CreateCategoryInput) {
  return apiFetch<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAdminCategory(input: UpdateCategoryInput) {
  const { id, ...body } = input;

  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
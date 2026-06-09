"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/lib/admin-categories";
import { AdminProtected } from "@/components/admin/admin-protected";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { slugify } from "@/lib/slugify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  });

  const createMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: async () => {
      setName("");
      setSlug("");
      setDescription("");
      setImageUrl("");
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createMutation.mutate({
      name,
      slug,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
    });
  }

  return (
  <AdminProtected>
    <main className="mx-auto max-w-6xl px-6 py-10">
      <AdminPageHeader
        title="Kategorie"
        description="Správa kategorií produktů."
      />

      <Card className="mb-8">
        <h2 className="text-xl font-semibold">
          Nová kategorie
        </h2>

        <form
          className="mt-5 grid gap-4"
          onSubmit={handleCreate}
        >
          <Input
            placeholder="Název"
            value={name}
            onChange={(event) => {
              const value = event.target.value;

              setName(value);
              setSlug(slugify(value));
            }}
            required
          />

          <Input
            placeholder="Slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          />

          <Input
            placeholder="Popis"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <Input
            placeholder="/products/categories/..."
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />

          {createMutation.isError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              Kategorii se nepodařilo vytvořit.
            </p>
          )}

          <Button disabled={createMutation.isPending}>
            {createMutation.isPending
              ? "Ukládám..."
              : "Vytvořit kategorii"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">
          Seznam kategorií
        </h2>

        {categoriesQuery.isLoading && (
          <p className="mt-4 text-zinc-600">
            Načítám...
          </p>
        )}

        {categoriesQuery.isError && (
          <p className="mt-4 text-red-700">
            Kategorie se nepodařilo načíst.
          </p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {categoriesQuery.data?.map((category) => (
            <Card key={category.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {category.slug}
                  </p>

                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {category.isActive
                        ? "Aktivní"
                        : "Neaktivní"}
                    </span>
                  </div>

                  {category.description && (
                    <p className="mt-3 text-sm text-zinc-700">
                      {category.description}
                    </p>
                  )}
                </div>

                <Button
                  variant="secondary"
                  onClick={() =>
                    updateMutation.mutate({
                      id: category.id,
                      isActive: !category.isActive,
                    })
                  }
                >
                  {category.isActive
                    ? "Deaktivovat"
                    : "Aktivovat"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </main>
  </AdminProtected>
);
}
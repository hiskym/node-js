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
    <main>
      <AdminPageHeader title="Kategorie" />

      <section className="card" style={{ marginBottom: 32 }}>
        <h2>Nová kategorie</h2>

        <form className="form-grid" onSubmit={handleCreate}>
          <input
            className="input"
            placeholder="Název"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <input
            className="input"
            placeholder="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Popis"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <input
            className="input"
            placeholder="/products/categories/..."
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />

          {createMutation.isError && (
            <p style={{ color: "var(--danger)" }}>
              Kategorii se nepodařilo vytvořit.
            </p>
          )}

          <button className="button" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Ukládám..." : "Vytvořit kategorii"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Seznam kategorií</h2>

        {categoriesQuery.isLoading && <p>Načítám...</p>}
        {categoriesQuery.isError && <p>Kategorie se nepodařilo načíst.</p>}

        <div className="grid">
          {categoriesQuery.data?.map((category) => (
            <div
              key={category.id}
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div>
                <strong>{category.name}</strong>
                <div className="muted">{category.slug}</div>
                <small>{category.isActive ? "Aktivní" : "Neaktivní"}</small>
              </div>

              <button
                className="button secondary"
                onClick={() =>
                  updateMutation.mutate({
                    id: category.id,
                    isActive: !category.isActive,
                  })
                }
              >
                {category.isActive ? "Deaktivovat" : "Aktivovat"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  </AdminProtected>
);
}
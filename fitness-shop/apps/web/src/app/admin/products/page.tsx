"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from "@/lib/admin-products";
import { getAdminCategories } from "@/lib/admin-categories";
import { AdminProtected } from "@/components/admin/admin-protected";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getImageUrl } from "@/lib/image-url";
import { uploadProductImage } from "@/lib/admin-uploads";
import { slugify } from "@/lib/slugify";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [variantName, setVariantName] = useState("");
  const [variantSku, setVariantSku] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  });

  const createMutation = useMutation({
    mutationFn: createAdminProduct,
    onSuccess: async () => {
      setName("");
      setSlug("");
      setShortDescription("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setVariantName("");
      setVariantSku("");
      setStockQuantity(0);
      setCategoryIds([]);
      setIsFeatured(false);

      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      setImageUrl(data.imageUrl);
    },
  });

  function toggleCategory(categoryId: number) {
    setCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createMutation.mutate({
      name,
      slug,
      shortDescription: shortDescription || undefined,
      description,
      price,
      currency: "CZK",
      isFeatured,
      categoryIds,
      images: [
        {
          imageUrl,
          altText: name,
          sortOrder: 1,
        },
      ],
      variants: [
        {
          name: variantName,
          sku: variantSku,
          price,
          currency: "CZK",
          stockQuantity,
        },
      ],
    });
  }

  return (
    <AdminProtected>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title="Produkty"
          description="Správa produktů, variant, obrázků a skladu."
        />

        <Card className="mb-8">
          <h2 className="text-xl font-semibold">Nový produkt</h2>

          <form className="mt-5 grid gap-5" onSubmit={handleCreate}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Název
                <Input
                  value={name}
                  onChange={(event) => {
                    const value = event.target.value;
                    setName(value);
                    setSlug(slugify(value));
                  }}
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Slug
                <Input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  required
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Krátký popis
              <Input
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Popis
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Cena
              <Input
                placeholder="např. 499.00"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>

            <section className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="font-semibold">Hlavní obrázek</h3>

              <div className="mt-4 grid gap-4">
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      uploadImageMutation.mutate(file);
                    }
                  }}
                />

                {uploadImageMutation.isPending && (
                  <p className="text-sm text-zinc-600">Nahrávám obrázek...</p>
                )}

                {uploadImageMutation.isError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    Obrázek se nepodařilo nahrát.
                  </p>
                )}

                <Input
                  placeholder="/uploads/products/example.jpg"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  required
                />

                {imageUrl && (
                  <img
                    src={getImageUrl(imageUrl)}
                    alt="Náhled produktu"
                    className="h-32 w-32 rounded-xl object-cover"
                  />
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="font-semibold">Kategorie</h3>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {categoriesQuery.data?.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="font-semibold">První varianta</h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-medium">
                  Název varianty
                  <Input
                    placeholder="např. 12 kg"
                    value={variantName}
                    onChange={(event) => setVariantName(event.target.value)}
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium">
                  SKU
                  <Input
                    value={variantSku}
                    onChange={(event) => setVariantSku(event.target.value)}
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium">
                  Sklad
                  <Input
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(event) =>
                      setStockQuantity(Number(event.target.value))
                    }
                    required
                  />
                </label>
              </div>
            </section>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
              />
              Doporučený produkt
            </label>

            {createMutation.isError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : "Produkt se nepodařilo vytvořit."}
              </p>
            )}

            <Button disabled={createMutation.isPending}>
              {createMutation.isPending ? "Ukládám..." : "Vytvořit produkt"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Seznam produktů</h2>

          {productsQuery.isLoading && (
            <p className="mt-4 text-zinc-600">Načítám...</p>
          )}

          {productsQuery.isError && (
            <p className="mt-4 text-red-700">
              Produkty se nepodařilo načíst.
            </p>
          )}

          <div className="mt-6 grid gap-4">
            {productsQuery.data?.map((product) => (
              <Card key={product.id}>
                <div className="grid gap-4 md:grid-cols-[88px_1fr_auto] md:items-center">
                  {product.images[0] ? (
                    <img
                      src={getImageUrl(product.images[0].imageUrl)}
                      alt={product.images[0].altText ?? product.name}
                      className="h-24 w-full rounded-xl object-cover md:h-20 md:w-20"
                    />
                  ) : (
                    <div className="h-24 rounded-xl bg-zinc-100 md:h-20 md:w-20" />
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{product.name}</h3>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {product.isActive ? "Aktivní" : "Neaktivní"}
                      </span>

                      {product.isFeatured && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Doporučený
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-zinc-500">
                      {product.slug}
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {product.price} {product.currency}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ButtonLink
                      href={`/admin/products/${product.id}`}
                      variant="secondary"
                    >
                      Detail
                    </ButtonLink>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        updateMutation.mutate({
                          id: product.id,
                          isActive: !product.isActive,
                        })
                      }
                      disabled={updateMutation.isPending}
                    >
                      {product.isActive ? "Deaktivovat" : "Aktivovat"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </main>
    </AdminProtected>
  );
}
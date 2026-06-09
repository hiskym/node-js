"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminProductImage,
  createAdminProductVariant,
  deleteAdminProductImage,
  getAdminProduct,
  updateAdminProduct,
  updateAdminProductImage,
  updateAdminProductVariant,
} from "@/lib/admin-products";
import { AdminProtected } from "@/components/admin/admin-protected";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getImageUrl } from "@/lib/image-url";
import { uploadProductImage } from "@/lib/admin-uploads";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const queryClient = useQueryClient();

  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantSku, setNewVariantSku] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState("");
  const [newVariantStock, setNewVariantStock] = useState(0);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageSortOrder, setNewImageSortOrder] = useState(1);

  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);

  const productQuery = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => getAdminProduct(productId),
    enabled: Number.isInteger(productId),
  });

  const updateProductMutation = useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data) => {
      setNewImageUrl(data.imageUrl);
    },
  });

  const createVariantMutation = useMutation({
    mutationFn: createAdminProductVariant,
    onSuccess: async () => {
      setNewVariantName("");
      setNewVariantSku("");
      setNewVariantPrice("");
      setNewVariantStock(0);
      await queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: updateAdminProductVariant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
  });

  const createImageMutation = useMutation({
    mutationFn: createAdminProductImage,
    onSuccess: async () => {
      setNewImageUrl("");
      setNewImageAlt("");
      setNewImageSortOrder(1);
      await queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: updateAdminProductImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteAdminProductImage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
    },
  });

  if (productQuery.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-zinc-600">Načítám produkt...</p>
      </main>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-red-700">Produkt se nepodařilo načíst.</p>
      </main>
    );
  }

  const product = productQuery.data;

  function handleBasicUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    updateProductMutation.mutate({
      id: productId,
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      shortDescription: String(formData.get("shortDescription")),
      description: String(formData.get("description")),
      price: String(formData.get("price")),
      currency: String(formData.get("currency")),
      isFeatured: formData.get("isFeatured") === "on",
      isActive: formData.get("isActive") === "on",
    });
  }

  function handleCreateVariant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createVariantMutation.mutate({
      productId,
      name: newVariantName.trim(),
      sku: newVariantSku.trim(),
      price: newVariantPrice.trim() || undefined,
      currency: "CZK",
      stockQuantity: newVariantStock,
    });
  }

  function handleCreateImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createImageMutation.mutate({
      productId,
      imageUrl: newImageUrl,
      altText: newImageAlt || undefined,
      sortOrder: newImageSortOrder,
    });
  }

  return (
    <AdminProtected>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminPageHeader
          title={product.name}
          description="Detail produktu, varianty, sklad a obrázky."
          backHref="/admin/products"
          backLabel="← Zpět na produkty"
        />

        <Card className="mb-8">
          <h2 className="text-xl font-semibold">Základní údaje</h2>

          <form className="mt-5 grid gap-4" onSubmit={handleBasicUpdate}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Název
                <Input name="name" defaultValue={product.name} />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Slug
                <Input name="slug" defaultValue={product.slug} />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Krátký popis
              <Input
                name="shortDescription"
                defaultValue={product.shortDescription ?? ""}
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Popis
              <Textarea name="description" defaultValue={product.description} />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Cena
                <Input name="price" defaultValue={product.price} />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Měna
                <Input name="currency" defaultValue={product.currency} />
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  name="isFeatured"
                  type="checkbox"
                  defaultChecked={product.isFeatured}
                />
                Doporučený
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={product.isActive}
                />
                Aktivní
              </label>
            </div>

            {updateProductMutation.isError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {updateProductMutation.error instanceof Error
                  ? updateProductMutation.error.message
                  : "Produkt se nepodařilo uložit."}
              </p>
            )}

            <Button disabled={updateProductMutation.isPending}>
              {updateProductMutation.isPending
                ? "Ukládám..."
                : "Uložit základní údaje"}
            </Button>
          </form>
        </Card>

        <Card className="mb-8">
          <h2 className="text-xl font-semibold">Varianty</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {product.variants.map((variant) => (
              <Card key={variant.id} className="bg-zinc-50">
                {editingVariantId === variant.id ? (
                  <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                      event.preventDefault();

                      const formData = new FormData(event.currentTarget);

                      updateVariantMutation.mutate(
                        {
                          productId,
                          variantId: variant.id,
                          name: String(formData.get("name")),
                          sku: String(formData.get("sku")),
                          price: String(formData.get("price")) || undefined,
                          currency: String(formData.get("currency")) || undefined,
                          stockQuantity: Number(formData.get("stockQuantity")),
                          isActive: formData.get("isActive") === "on",
                        },
                        {
                          onSuccess: () => setEditingVariantId(null),
                        },
                      );
                    }}
                  >
                    <Input name="name" defaultValue={variant.name} />
                    <Input name="sku" defaultValue={variant.sku} />
                    <Input name="price" defaultValue={variant.price ?? ""} />
                    <Input name="currency" defaultValue={variant.currency ?? "CZK"} />
                    <Input
                      name="stockQuantity"
                      type="number"
                      min={0}
                      defaultValue={variant.stockQuantity}
                    />

                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        name="isActive"
                        type="checkbox"
                        defaultChecked={variant.isActive}
                      />
                      Aktivní
                    </label>

                    {updateVariantMutation.isError && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {updateVariantMutation.error instanceof Error
                          ? updateVariantMutation.error.message
                          : "Variantu se nepodařilo upravit."}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button type="submit">Uložit variantu</Button>

                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setEditingVariantId(null)}
                      >
                        Zrušit
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{variant.name}</h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          SKU: {variant.sku}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          variant.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-200 text-zinc-600"
                        }`}
                      >
                        {variant.isActive ? "Aktivní" : "Neaktivní"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-1 text-sm text-zinc-700">
                      <p>
                        Cena:{" "}
                        <strong>
                          {variant.price ?? product.price}{" "}
                          {variant.currency ?? product.currency}
                        </strong>
                      </p>
                      <p>
                        Sklad: <strong>{variant.stockQuantity}</strong>
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setEditingVariantId(variant.id)}
                      >
                        Upravit
                      </Button>

                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          updateVariantMutation.mutate({
                            productId,
                            variantId: variant.id,
                            stockQuantity: variant.stockQuantity + 1,
                          })
                        }
                      >
                        +1 sklad
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-zinc-50 p-5">
            <h3 className="font-semibold">Nová varianta</h3>

            <form className="mt-4 grid gap-4 md:grid-cols-4" onSubmit={handleCreateVariant}>
              <Input
                placeholder="Název varianty"
                value={newVariantName}
                onChange={(event) => setNewVariantName(event.target.value)}
                required
              />

              <Input
                placeholder="SKU"
                value={newVariantSku}
                onChange={(event) => setNewVariantSku(event.target.value)}
                required
              />

              <Input
                placeholder="Cena varianty"
                value={newVariantPrice}
                onChange={(event) => setNewVariantPrice(event.target.value)}
              />

              <Input
                type="number"
                min={0}
                placeholder="Sklad"
                value={newVariantStock}
                onChange={(event) => setNewVariantStock(Number(event.target.value))}
              />

              <div className="md:col-span-4">
                {createVariantMutation.isError && (
                  <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {createVariantMutation.error instanceof Error
                      ? createVariantMutation.error.message
                      : "Variantu se nepodařilo vytvořit."}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={createVariantMutation.isPending}
                >
                  {createVariantMutation.isPending
                    ? "Ukládám..."
                    : "Přidat variantu"}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Obrázky</h2>

          <div className="mt-5 grid gap-4">
            {product.images.map((image) => (
              <Card key={image.id} className="bg-zinc-50">
                <div className="grid gap-4 md:grid-cols-[96px_1fr] md:items-start">
                  <img
                    src={getImageUrl(image.imageUrl)}
                    alt={image.altText ?? product.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  {editingImageId === image.id ? (
                    <form
                      className="grid gap-4"
                      onSubmit={(event) => {
                        event.preventDefault();

                        const formData = new FormData(event.currentTarget);

                        updateImageMutation.mutate(
                          {
                            productId,
                            imageId: image.id,
                            imageUrl: String(formData.get("imageUrl")),
                            altText: String(formData.get("altText")),
                            sortOrder: Number(formData.get("sortOrder")),
                          },
                          {
                            onSuccess: () => setEditingImageId(null),
                          },
                        );
                      }}
                    >
                      <Input name="imageUrl" defaultValue={image.imageUrl} />
                      <Input
                        name="altText"
                        defaultValue={image.altText ?? ""}
                        placeholder="Alt popis"
                      />
                      <Input
                        name="sortOrder"
                        type="number"
                        min={1}
                        defaultValue={image.sortOrder}
                      />

                      <div className="flex flex-wrap gap-2">
                        <Button type="submit">Uložit obrázek</Button>

                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => setEditingImageId(null)}
                        >
                          Zrušit
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p className="break-all text-sm font-medium">
                        {image.imageUrl}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {image.altText || "Bez alt popisu"}
                      </p>

                      <p className="mt-2 text-sm text-zinc-700">
                        Pořadí: <strong>{image.sortOrder}</strong>
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => setEditingImageId(image.id)}
                        >
                          Upravit
                        </Button>

                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() =>
                            updateImageMutation.mutate({
                              productId,
                              imageId: image.id,
                              sortOrder: image.sortOrder + 1,
                            })
                          }
                        >
                          Posunout níž
                        </Button>

                        <Button
                          variant="danger"
                          type="button"
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Opravdu chceš obrázek odebrat?",
                            );

                            if (!confirmed) return;

                            deleteImageMutation.mutate({
                              productId,
                              imageId: image.id,
                            });
                          }}
                        >
                          Odebrat
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {deleteImageMutation.isError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Obrázek se nepodařilo odebrat.
              </p>
            )}
          </div>

          <div className="mt-8 rounded-2xl bg-zinc-50 p-5">
            <h3 className="font-semibold">Nový obrázek</h3>

            <form className="mt-4 grid gap-4" onSubmit={handleCreateImage}>
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
                value={newImageUrl}
                onChange={(event) => setNewImageUrl(event.target.value)}
                required
              />

              {newImageUrl && (
                <img
                  src={getImageUrl(newImageUrl)}
                  alt="Náhled obrázku"
                  className="h-32 w-32 rounded-xl object-cover"
                />
              )}

              <Input
                placeholder="Alt text"
                value={newImageAlt}
                onChange={(event) => setNewImageAlt(event.target.value)}
              />

              <Input
                type="number"
                min={1}
                value={newImageSortOrder}
                onChange={(event) => setNewImageSortOrder(Number(event.target.value))}
              />

              <Button disabled={createImageMutation.isPending}>
                {createImageMutation.isPending
                  ? "Ukládám..."
                  : "Přidat obrázek"}
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </AdminProtected>
  );
}
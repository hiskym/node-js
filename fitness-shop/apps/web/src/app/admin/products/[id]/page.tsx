"use client";

import Link from "next/link";
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
      await queryClient.invalidateQueries({
        queryKey: ["admin-product", productId],
      });
    },
  });

  if (productQuery.isLoading) {
    return <main style={{ padding: 32 }}>Načítám produkt...</main>;
  }

  if (productQuery.isError || !productQuery.data) {
    return <main style={{ padding: 32 }}>Produkt se nepodařilo načíst.</main>;
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
      name: newVariantName,
      sku: newVariantSku,
      price: newVariantPrice || undefined,
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
      <main>
        <AdminPageHeader
          title={product.name}
          backHref="/admin/products"
          backLabel="← Zpět na produkty"
        />

        <section className="card" style={{ marginBottom: 32 }}>
          <h2>Základní údaje</h2>

          <form className="form-grid" onSubmit={handleBasicUpdate}>
            <input className="input" name="name" defaultValue={product.name} />
            <input className="input" name="slug" defaultValue={product.slug} />
            <input
              className="input"
              name="shortDescription"
              defaultValue={product.shortDescription ?? ""}
            />
            <textarea
              className="textarea"
              name="description"
              defaultValue={product.description}
            />
            <input className="input" name="price" defaultValue={product.price} />
            <input className="input" name="currency" defaultValue={product.currency} />

            <label>
              <input name="isFeatured" type="checkbox" defaultChecked={product.isFeatured} />{" "}
              Doporučený
            </label>

            <label>
              <input name="isActive" type="checkbox" defaultChecked={product.isActive} />{" "}
              Aktivní
            </label>

            <button className="button" disabled={updateProductMutation.isPending}>
              {updateProductMutation.isPending ? "Ukládám..." : "Uložit základní údaje"}
            </button>
          </form>
        </section>

        <section className="card" style={{ marginBottom: 32 }}>
          <h2>Varianty</h2>

          <div className="grid">
            {product.variants.map((variant) => (
              <div key={variant.id} className="card">
                {editingVariantId === variant.id ? (
                  <form
                    className="form-grid"
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
                          onSuccess: () => {
                            setEditingVariantId(null);
                          },
                        },
                      );
                    }}
                  >
                    <input className="input" name="name" defaultValue={variant.name} />
                    <input className="input" name="sku" defaultValue={variant.sku} />
                    <input className="input" name="price" defaultValue={variant.price ?? ""} />
                    <input className="input" name="currency" defaultValue={variant.currency ?? "CZK"} />
                    <input
                      className="input"
                      name="stockQuantity"
                      type="number"
                      min={0}
                      defaultValue={variant.stockQuantity}
                    />

                    <label>
                      <input
                        name="isActive"
                        type="checkbox"
                        defaultChecked={variant.isActive}
                      />{" "}
                      Aktivní
                    </label>

                    {updateVariantMutation.isError && (
                      <p style={{ color: "var(--danger)" }}>
                        {updateVariantMutation.error instanceof Error
                          ? updateVariantMutation.error.message
                          : "Variantu se nepodařilo upravit."}
                      </p>
                    )}

                    <div className="actions">
                      <button className="button" type="submit">
                        Uložit variantu
                      </button>

                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => setEditingVariantId(null)}
                      >
                        Zrušit
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <strong>{variant.name}</strong>
                    <p className="muted">SKU: {variant.sku}</p>
                    <p>
                      Cena: {variant.price ?? product.price}{" "}
                      {variant.currency ?? product.currency}
                    </p>
                    <p>Sklad: {variant.stockQuantity}</p>
                    <p>{variant.isActive ? "Aktivní" : "Neaktivní"}</p>

                    <div className="actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => setEditingVariantId(variant.id)}
                      >
                        Upravit
                      </button>

                      <button
                        className="button secondary"
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
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <h3>Nová varianta</h3>

          <form className="form-grid" onSubmit={handleCreateVariant}>
            <input
              className="input"
              placeholder="Název varianty"
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="SKU"
              value={newVariantSku}
              onChange={(e) => setNewVariantSku(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Cena varianty"
              value={newVariantPrice}
              onChange={(e) => setNewVariantPrice(e.target.value)}
            />
            <input
              className="input"
              type="number"
              min={0}
              placeholder="Sklad"
              value={newVariantStock}
              onChange={(e) => setNewVariantStock(Number(e.target.value))}
            />

            {createVariantMutation.isError && (
              <p style={{ color: "var(--danger)" }}>
                {createVariantMutation.error instanceof Error
                  ? createVariantMutation.error.message
                  : "Variantu se nepodařilo vytvořit."}
              </p>
            )}

            <button
              type="submit"
              className="button"
              disabled={createVariantMutation.isPending}
            >
              {createVariantMutation.isPending ? "Ukládám..." : "Přidat variantu"}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Obrázky</h2>

          <div className="grid">
            {product.images.map((image) => (
              <div
                key={image.id}
                className="card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <img
                  src={getImageUrl(image.imageUrl)}
                  alt={image.altText ?? product.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                {editingImageId === image.id ? (
                  <form
                    className="form-grid"
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
                    <input
                      className="input"
                      name="imageUrl"
                      defaultValue={image.imageUrl}
                    />

                    <input
                      className="input"
                      name="altText"
                      defaultValue={image.altText ?? ""}
                      placeholder="Alt popis"
                    />

                    <input
                      className="input"
                      name="sortOrder"
                      type="number"
                      min={1}
                      defaultValue={image.sortOrder}
                    />

                    <div className="actions">
                      <button className="button" type="submit">
                        Uložit obrázek
                      </button>

                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => setEditingImageId(null)}
                      >
                        Zrušit
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <strong>{image.imageUrl}</strong>
                    <p className="muted">{image.altText || "Bez alt popisu"}</p>
                    <p>Pořadí: {image.sortOrder}</p>

                    <div className="actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => setEditingImageId(image.id)}
                      >
                        Upravit
                      </button>

                      <button
                        className="button secondary"
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
                      </button>

                      <button
                        className="button danger"
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm("Opravdu chceš obrázek odebrat?");
                          if (!confirmed) return;

                          deleteImageMutation.mutate({
                            productId,
                            imageId: image.id,
                          });
                        }}
                      >
                        Odebrat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {deleteImageMutation.isError && (
              <p style={{ color: "var(--danger)" }}>
                Obrázek se nepodařilo odebrat.
              </p>
            )}
          </div>

          <h3>Nový obrázek</h3>

          <form className="form-grid" onSubmit={handleCreateImage}>
            <input
              className="input"
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
              <p className="muted">Nahrávám obrázek...</p>
            )}

            {uploadImageMutation.isError && (
              <p style={{ color: "var(--danger)" }}>
                Obrázek se nepodařilo nahrát.
              </p>
            )}
            <input
              className="input"
              placeholder="/products/example.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              required
            />
            {newImageUrl && (
              <img
                src={getImageUrl(newImageUrl)}
                alt="Náhled obrázku"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            )}
            <input
              className="input"
              placeholder="Alt text"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
            />
            <input
              className="input"
              type="number"
              min={1}
              value={newImageSortOrder}
              onChange={(e) => setNewImageSortOrder(Number(e.target.value))}
            />

            <button className="button" disabled={createImageMutation.isPending}>
              Přidat obrázek
            </button>
          </form>
        </section>
      </main>
    </AdminProtected>
  );
}
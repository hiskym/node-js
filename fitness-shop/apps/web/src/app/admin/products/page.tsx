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
            <main>
                <AdminPageHeader title="Produkty" />

                <section className="card" style={{ marginBottom: 32 }}>
                    <h2>Nový produkt</h2>

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
                            placeholder="Krátký popis"
                            value={shortDescription}
                            onChange={(event) => setShortDescription(event.target.value)}
                        />

                        <textarea
                            className="textarea"
                            placeholder="Popis"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                        />

                        <input
                            className="input"
                            placeholder="Cena, např. 499.00"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                            required
                        />

                        <div className="form-grid">
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
                                placeholder="/uploads/products/example.jpg"
                                value={imageUrl}
                                onChange={(event) => setImageUrl(event.target.value)}
                                required
                            />

                            {imageUrl && (
                                <img
                                    src={getImageUrl(imageUrl)}
                                    alt="Náhled produktu"
                                    style={{
                                        width: 120,
                                        height: 120,
                                        objectFit: "cover",
                                        borderRadius: 10,
                                    }}
                                />
                            )}
                        </div>

                        <div>
                            <h3>Kategorie</h3>

                            {categoriesQuery.data?.map((category) => (
                                <label key={category.id} style={{ display: "block" }}>
                                    <input
                                        type="checkbox"
                                        checked={categoryIds.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                    />{" "}
                                    {category.name}
                                </label>
                            ))}
                        </div>

                        <div>
                            <h3>První varianta</h3>

                            <input
                                className="input"
                                placeholder="Název varianty, např. 12 kg"
                                value={variantName}
                                onChange={(event) => setVariantName(event.target.value)}
                                required
                            />

                            <input
                                className="input"
                                placeholder="SKU"
                                value={variantSku}
                                onChange={(event) => setVariantSku(event.target.value)}
                                required
                                style={{ marginTop: 8 }}
                            />

                            <input
                                className="input"
                                type="number"
                                min={0}
                                placeholder="Sklad"
                                value={stockQuantity}
                                onChange={(event) => setStockQuantity(Number(event.target.value))}
                                required
                                style={{ marginTop: 8 }}
                            />
                        </div>

                        <label>
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(event) => setIsFeatured(event.target.checked)}
                            />{" "}
                            Doporučený produkt
                        </label>

                        {createMutation.isError && (
                            <p style={{ color: "var(--danger)" }}>
                                Produkt se nepodařilo vytvořit.
                            </p>
                        )}

                        <button className="button" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Ukládám..." : "Vytvořit produkt"}
                        </button>
                    </form>
                </section>

                <section className="card">
                    <h2>Seznam produktů</h2>

                    {productsQuery.isLoading && <p>Načítám...</p>}
                    {productsQuery.isError && <p>Produkty se nepodařilo načíst.</p>}

                    <div className="grid">
                        {productsQuery.data?.map((product) => (
                            <div
                                key={product.id}
                                className="card"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "80px 1fr auto",
                                    gap: 16,
                                    alignItems: "center",
                                }}
                            >
                                {product.images[0] ? (
                                    <img
                                        src={getImageUrl(product.images[0].imageUrl)}
                                        alt={product.images[0].altText ?? product.name}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                    />
                                ) : (
                                    <div />
                                )}

                                <div>
                                    <strong>{product.name}</strong>
                                    <div className="muted">{product.slug}</div>
                                    <div>
                                        {product.price} {product.currency}
                                    </div>
                                    <small>{product.isActive ? "Aktivní" : "Neaktivní"}</small>
                                </div>

                                <div className="actions">
                                    <Link className="button secondary" href={`/admin/products/${product.id}`}>
                                        Detail
                                    </Link>

                                    <button
                                        className="button secondary"
                                        onClick={() =>
                                            updateMutation.mutate({
                                                id: product.id,
                                                isActive: !product.isActive,
                                            })
                                        }
                                    >
                                        {product.isActive ? "Deaktivovat" : "Aktivovat"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </AdminProtected>
    );
}
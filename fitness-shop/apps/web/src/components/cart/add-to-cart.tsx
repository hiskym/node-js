"use client";

import { useState } from "react";
import { createCartItem } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === variantId,
  );

  if (!selectedVariant) {
    return <p className="text-sm text-zinc-600">Produkt nemá dostupnou variantu.</p>;
  }

  const displayPrice = selectedVariant.price ?? product.price;
  const displayCurrency = selectedVariant.currency ?? product.currency;
  const isOutOfStock = selectedVariant.stockQuantity <= 0;

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <h2 className="text-2xl font-bold">
        {displayPrice} {displayCurrency}
      </h2>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          Varianta
          <Select
            value={variantId}
            onChange={(event) => setVariantId(Number(event.target.value))}
          >
            {product.variants.map((variant) => {
              const variantPrice = variant.price ?? product.price;
              const variantCurrency = variant.currency ?? product.currency;

              return (
                <option key={variant.id} value={variant.id}>
                  {variant.name} — {variantPrice} {variantCurrency} — skladem{" "}
                  {variant.stockQuantity} ks
                </option>
              );
            })}
          </Select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Množství
          <Input
            type="number"
            min={1}
            max={selectedVariant.stockQuantity}
            value={quantity}
            onChange={(event) => {
              const value = Number(event.target.value);

              if (value < 1) {
                setQuantity(1);
                return;
              }

              if (value > selectedVariant.stockQuantity) {
                setQuantity(selectedVariant.stockQuantity);
                return;
              }

              setQuantity(value);
            }}
          />
        </label>

        <Button
          disabled={isOutOfStock}
          onClick={() => {
            const safeQuantity = Math.min(quantity, selectedVariant.stockQuantity);
            addItem(createCartItem(product, selectedVariant, safeQuantity));
          }}
        >
          {isOutOfStock ? "Není skladem" : "Přidat do košíku"}
        </Button>
      </div>
    </div>
  );
}
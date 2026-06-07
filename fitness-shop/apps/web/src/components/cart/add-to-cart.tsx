"use client";

import { useState } from "react";
import { createCartItem } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { useCart } from "./cart-provider";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);



  const selectedVariant = product.variants.find(
    (variant) => variant.id === variantId,
  );

  if (!selectedVariant) {
    return <p>Produkt nemá dostupnou variantu.</p>;
  }

  const isOutOfStock = selectedVariant.stockQuantity <= 0;

  const displayPrice = selectedVariant.price ?? product.price;
  const displayCurrency = selectedVariant.currency ?? product.currency;

  return (
    <div style={{ marginTop: 24 }}>
      <h2>
        {displayPrice} {displayCurrency}
      </h2>

      <label>
        Varianta{" "}
        <select
          value={variantId}
          onChange={(event) => setVariantId(Number(event.target.value))}
        >
          {product.variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.name} — skladem {variant.stockQuantity} ks
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 12 }}>
        <label>
          Množství{" "}
          <input
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
            style={{ width: 80 }}
          />
        </label>
      </div>

      <button
        disabled={isOutOfStock}
        onClick={() => {
          const safeQuantity = Math.min(quantity, selectedVariant.stockQuantity);
          addItem(createCartItem(product, selectedVariant, safeQuantity));
        }}
        style={{ marginTop: 12 }}
      >
        {isOutOfStock ? "Není skladem" : "Přidat do košíku"}
      </button>
    </div>
  );
}
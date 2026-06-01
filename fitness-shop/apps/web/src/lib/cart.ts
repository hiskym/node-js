import type { Product, ProductVariant } from "./types";

export type CartItem = {
  productId: number;
  variantId: number;
  productName: string;
  variantName: string;
  slug: string;
  imageUrl?: string;
  unitPrice: string;
  currency: string;
  quantity: number;
};

export function createCartItem(
  product: Product,
  variant: ProductVariant,
  quantity: number,
): CartItem {
  return {
    productId: product.id,
    variantId: variant.id,
    productName: product.name,
    variantName: variant.name,
    slug: product.slug,
    imageUrl: product.images[0]?.imageUrl,
    unitPrice: variant.price ?? product.price,
    currency: variant.currency ?? product.currency,
    quantity,
  };
}
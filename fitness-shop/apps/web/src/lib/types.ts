export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
};

export type ProductImage = {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
};

export type ProductVariant = {
  id: number;
  productId: number;
  name: string;
  sku: string;
  price?: string | null;
  currency?: string | null;
  stockQuantity: number;
  isActive: boolean;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  price: string;
  currency: string;
  isActive: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: Category[];
};
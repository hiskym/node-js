export class ProductImageDto {
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
}

export class ProductVariantDto {
  name: string;
  sku: string;
  price?: string;
  currency?: string;
  stockQuantity: number;
}

export class CreateProductDto {
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: string;
  currency?: string;
  isFeatured?: boolean;
  categoryIds: number[];
  images: ProductImageDto[];
  variants: ProductVariantDto[];
}
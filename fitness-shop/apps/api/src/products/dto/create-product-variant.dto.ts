export class CreateProductVariantDto {
  name: string;
  sku: string;
  price?: string;
  currency?: string;
  stockQuantity: number;
}
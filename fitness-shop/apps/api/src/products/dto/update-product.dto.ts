import {
  ProductImageDto,
  ProductVariantDto,
} from './create-product.dto';

export class UpdateProductDto {
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price?: string;
  currency?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryIds?: number[];
}
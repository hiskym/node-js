import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import {
  categories,
  db,
  productCategories,
  productImages,
  products,
  productVariants,
} from '@fitness-shop/db';
import { and, asc, eq, like, or } from 'drizzle-orm';
import { DATABASE } from '../database/database.module';

type Database = typeof db;

@Injectable()
export class ProductsService {
  constructor(@Inject(DATABASE) private readonly database: Database) {}

  async findAll(search?: string) {
    const rows = await this.database
      .select()
      .from(products)
      .where(
        search
          ? and(
              eq(products.isActive, true),
              or(
                like(products.name, `%${search}%`),
                like(products.shortDescription, `%${search}%`),
                like(products.description, `%${search}%`),
              ),
            )
          : eq(products.isActive, true),
      )
      .orderBy(asc(products.name));

    return Promise.all(rows.map((product) => this.attachProductRelations(product)));
  }

  async findBySlug(slug: string) {
    const product = await this.database.query.products.findFirst({
      where: and(eq(products.slug, slug), eq(products.isActive, true)),
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.attachProductRelations(product);
  }

  async adminFindAll() {
  const rows = await this.database
    .select()
    .from(products)
    .orderBy(asc(products.name));

  return Promise.all(rows.map((product) => this.attachProductRelations(product)));
}

async adminFindById(id: number) {
  if (!Number.isInteger(id)) {
    throw new BadRequestException('Invalid product id');
  }

  const product = await this.database.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return this.attachProductRelations(product);
}

async adminCreate(dto: CreateProductDto) {
  this.validateCreateProductDto(dto);

  const now = new Date().toISOString();

  const existingProduct = await this.database.query.products.findFirst({
    where: eq(products.slug, dto.slug),
  });

  if (existingProduct) {
    throw new BadRequestException('Product slug already exists');
  }

  await this.validateCategoryIds(dto.categoryIds);

  const [createdProduct] = await this.database
    .insert(products)
    .values({
      name: dto.name,
      slug: dto.slug,
      shortDescription: dto.shortDescription,
      description: dto.description,
      price: dto.price,
      currency: dto.currency ?? 'CZK',
      isActive: true,
      isFeatured: dto.isFeatured ?? false,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  await this.replaceProductRelations(createdProduct.id, dto, now);

  return this.adminFindById(createdProduct.id);
}

async adminUpdate(id: number, dto: UpdateProductDto) {
  if (!Number.isInteger(id)) {
    throw new BadRequestException('Invalid product id');
  }

  const existingProduct = await this.database.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existingProduct) {
    throw new NotFoundException('Product not found');
  }

  if (dto.slug && dto.slug !== existingProduct.slug) {
    const productWithSameSlug = await this.database.query.products.findFirst({
      where: eq(products.slug, dto.slug),
    });

    if (productWithSameSlug) {
      throw new BadRequestException('Product slug already exists');
    }
  }

  if (dto.categoryIds) {
    await this.validateCategoryIds(dto.categoryIds);
  }

  const now = new Date().toISOString();

  await this.database
    .update(products)
    .set({
      name: dto.name ?? existingProduct.name,
      slug: dto.slug ?? existingProduct.slug,
      shortDescription: dto.shortDescription ?? existingProduct.shortDescription,
      description: dto.description ?? existingProduct.description,
      price: dto.price ?? existingProduct.price,
      currency: dto.currency ?? existingProduct.currency,
      isActive: dto.isActive ?? existingProduct.isActive,
      isFeatured: dto.isFeatured ?? existingProduct.isFeatured,
      updatedAt: now,
    })
    .where(eq(products.id, id));

  await this.replaceProductRelations(id, {
    categoryIds: dto.categoryIds,
    }, now);

  return this.adminFindById(id);
}

async adminCreateVariant(productId: number, dto: CreateProductVariantDto) {
  if (!Number.isInteger(productId)) {
    throw new BadRequestException('Invalid product id');
  }

  const product = await this.database.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  if (!dto.name?.trim()) {
    throw new BadRequestException('Variant name is required');
  }

  if (!dto.sku?.trim()) {
    throw new BadRequestException('Variant SKU is required');
  }

  if (!Number.isInteger(dto.stockQuantity) || dto.stockQuantity < 0) {
    throw new BadRequestException('Stock quantity must be 0 or more');
  }

  const existingVariant = await this.database.query.productVariants.findFirst({
    where: eq(productVariants.sku, dto.sku),
  });

  if (existingVariant) {
    throw new BadRequestException('Variant SKU already exists');
  }

  const now = new Date().toISOString();

  const [createdVariant] = await this.database
    .insert(productVariants)
    .values({
      productId,
      name: dto.name,
      sku: dto.sku,
      price: dto.price,
      currency: dto.currency,
      stockQuantity: dto.stockQuantity,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return createdVariant;
}

async adminUpdateVariant(
  productId: number,
  variantId: number,
  dto: UpdateProductVariantDto,
) {
  if (!Number.isInteger(productId) || !Number.isInteger(variantId)) {
    throw new BadRequestException('Invalid product or variant id');
  }

  const existingVariant = await this.database.query.productVariants.findFirst({
    where: and(
      eq(productVariants.id, variantId),
      eq(productVariants.productId, productId),
    ),
  });

  if (!existingVariant) {
    throw new NotFoundException('Variant not found');
  }

  if (dto.sku && dto.sku !== existingVariant.sku) {
    const variantWithSameSku =
      await this.database.query.productVariants.findFirst({
        where: eq(productVariants.sku, dto.sku),
      });

    if (variantWithSameSku) {
      throw new BadRequestException('Variant SKU already exists');
    }
  }

  if (
    dto.stockQuantity !== undefined &&
    (!Number.isInteger(dto.stockQuantity) || dto.stockQuantity < 0)
  ) {
    throw new BadRequestException('Stock quantity must be 0 or more');
  }

  const now = new Date().toISOString();

  const [updatedVariant] = await this.database
    .update(productVariants)
    .set({
      name: dto.name ?? existingVariant.name,
      sku: dto.sku ?? existingVariant.sku,
      price: dto.price ?? existingVariant.price,
      currency: dto.currency ?? existingVariant.currency,
      stockQuantity: dto.stockQuantity ?? existingVariant.stockQuantity,
      isActive: dto.isActive ?? existingVariant.isActive,
      updatedAt: now,
    })
    .where(eq(productVariants.id, variantId))
    .returning();

  return updatedVariant;
}

async adminCreateImage(productId: number, dto: CreateProductImageDto) {
  if (!Number.isInteger(productId)) {
    throw new BadRequestException('Invalid product id');
  }

  const product = await this.database.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  if (!dto.imageUrl?.trim()) {
    throw new BadRequestException('Image URL is required');
  }

  const now = new Date().toISOString();

  const [createdImage] = await this.database
    .insert(productImages)
    .values({
      productId,
      imageUrl: dto.imageUrl,
      altText: dto.altText,
      sortOrder: dto.sortOrder ?? 1,
      createdAt: now,
    })
    .returning();

  return createdImage;
}

async adminUpdateImage(
  productId: number,
  imageId: number,
  dto: UpdateProductImageDto,
) {
  if (!Number.isInteger(productId) || !Number.isInteger(imageId)) {
    throw new BadRequestException('Invalid product or image id');
  }

  const existingImage = await this.database.query.productImages.findFirst({
    where: and(
      eq(productImages.id, imageId),
      eq(productImages.productId, productId),
    ),
  });

  if (!existingImage) {
    throw new NotFoundException('Image not found');
  }

  const [updatedImage] = await this.database
    .update(productImages)
    .set({
      imageUrl: dto.imageUrl ?? existingImage.imageUrl,
      altText: dto.altText ?? existingImage.altText,
      sortOrder: dto.sortOrder ?? existingImage.sortOrder,
    })
    .where(eq(productImages.id, imageId))
    .returning();

  return updatedImage;
}

private validateCreateProductDto(dto: CreateProductDto) {
  if (!dto.name?.trim()) {
    throw new BadRequestException('Product name is required');
  }

  if (!dto.slug?.trim()) {
    throw new BadRequestException('Product slug is required');
  }

  if (!dto.description?.trim()) {
    throw new BadRequestException('Product description is required');
  }

  if (!dto.price?.trim()) {
    throw new BadRequestException('Product price is required');
  }

  if (!dto.categoryIds?.length) {
    throw new BadRequestException('Product must have at least one category');
  }

  if (!dto.images?.length) {
    throw new BadRequestException('Product must have at least one image');
  }

  if (!dto.variants?.length) {
    throw new BadRequestException('Product must have at least one variant');
  }

  for (const variant of dto.variants) {
    if (!variant.name?.trim()) {
      throw new BadRequestException('Variant name is required');
    }

    if (!variant.sku?.trim()) {
      throw new BadRequestException('Variant SKU is required');
    }

    if (
      !Number.isInteger(variant.stockQuantity) ||
      variant.stockQuantity < 0
    ) {
      throw new BadRequestException('Variant stock quantity must be 0 or more');
    }
  }
}

private async validateCategoryIds(categoryIds: number[]) {
  for (const categoryId of categoryIds) {
    const category = await this.database.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!category) {
      throw new BadRequestException(`Category ${categoryId} does not exist`);
    }
  }
}

private async replaceProductRelations(
  productId: number,
  dto: Partial<CreateProductDto>,
  now: string,
) {
  if (dto.categoryIds) {
    await this.database
      .delete(productCategories)
      .where(eq(productCategories.productId, productId));

    if (dto.categoryIds.length) {
      await this.database.insert(productCategories).values(
        dto.categoryIds.map((categoryId) => ({
          productId,
          categoryId,
        })),
      );
    }
  }

  if (dto.images) {
    await this.database
      .delete(productImages)
      .where(eq(productImages.productId, productId));

    if (dto.images.length) {
      await this.database.insert(productImages).values(
        dto.images.map((image, index) => ({
          productId,
          imageUrl: image.imageUrl,
          altText: image.altText,
          sortOrder: image.sortOrder ?? index + 1,
          createdAt: now,
        })),
      );
    }
  }

  if (dto.variants) {
    await this.database
      .delete(productVariants)
      .where(eq(productVariants.productId, productId));

    if (dto.variants.length) {
      await this.database.insert(productVariants).values(
        dto.variants.map((variant) => ({
          productId,
          name: variant.name,
          sku: variant.sku,
          price: variant.price,
          currency: variant.currency,
          stockQuantity: variant.stockQuantity,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        })),
      );
    }
  }
}

  private async attachProductRelations(product: typeof products.$inferSelect) {
    const images = await this.database
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.sortOrder));

    const variants = await this.database
      .select()
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, product.id),
          eq(productVariants.isActive, true),
        ),
      )
      .orderBy(asc(productVariants.id));

    const productCategoryRows = await this.database
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(productCategories)
      .innerJoin(categories, eq(productCategories.categoryId, categories.id))
      .where(eq(productCategories.productId, product.id));

    return {
      ...product,
      images,
      variants,
      categories: productCategoryRows,
    };
  }
}
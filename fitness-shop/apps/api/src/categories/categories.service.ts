import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  categories,
  db,
  productCategories,
  products,
} from '@fitness-shop/db';
import { and, asc, eq } from 'drizzle-orm';
import { DATABASE } from '../database/database.module';
import { ProductsService } from '../products/products.service';

type Database = typeof db;

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    private readonly productsService: ProductsService,
  ) {}

  async findAll() {
    return this.database
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.name));
  }

  async findProductsByCategory(slug: string) {
    const category = await this.database.query.categories.findFirst({
      where: and(eq(categories.slug, slug), eq(categories.isActive, true)),
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const productRows = await this.database
      .select({
        product: products,
      })
      .from(productCategories)
      .innerJoin(products, eq(productCategories.productId, products.id))
      .where(
        and(
          eq(productCategories.categoryId, category.id),
          eq(products.isActive, true),
        ),
      )
      .orderBy(asc(products.name));

    const enrichedProducts = await Promise.all(
      productRows.map((row) => this.productsService.findBySlug(row.product.slug)),
    );

    return {
      category,
      products: enrichedProducts,
    };
  }

  async adminFindAll() {
  return this.database
    .select()
    .from(categories)
    .orderBy(asc(categories.name));
}

async adminCreate(dto: CreateCategoryDto) {
  if (!dto.name?.trim()) {
    throw new BadRequestException('Category name is required');
  }

  if (!dto.slug?.trim()) {
    throw new BadRequestException('Category slug is required');
  }

  const now = new Date().toISOString();

  const existingCategory = await this.database.query.categories.findFirst({
    where: eq(categories.slug, dto.slug),
  });

  if (existingCategory) {
    throw new BadRequestException('Category slug already exists');
  }

  const [createdCategory] = await this.database
    .insert(categories)
    .values({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      imageUrl: dto.imageUrl,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return createdCategory;
}

async adminUpdate(id: number, dto: UpdateCategoryDto) {
  if (!Number.isInteger(id)) {
    throw new BadRequestException('Invalid category id');
  }

  const existingCategory = await this.database.query.categories.findFirst({
    where: eq(categories.id, id),
  });

  if (!existingCategory) {
    throw new NotFoundException('Category not found');
  }

  if (dto.slug && dto.slug !== existingCategory.slug) {
    const categoryWithSameSlug = await this.database.query.categories.findFirst({
      where: eq(categories.slug, dto.slug),
    });

    if (categoryWithSameSlug) {
      throw new BadRequestException('Category slug already exists');
    }
  }

  const now = new Date().toISOString();

  const [updatedCategory] = await this.database
    .update(categories)
    .set({
      name: dto.name ?? existingCategory.name,
      slug: dto.slug ?? existingCategory.slug,
      description: dto.description ?? existingCategory.description,
      imageUrl: dto.imageUrl ?? existingCategory.imageUrl,
      isActive: dto.isActive ?? existingCategory.isActive,
      updatedAt: now,
    })
    .where(eq(categories.id, id))
    .returning();

  return updatedCategory;
}
}
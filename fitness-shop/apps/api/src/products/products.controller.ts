import { Body, Controller, Get, Param, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  findAll(@Query('search') search?: string) {
    return this.productsService.findAll(search);
  }

  @Get('products/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @UseGuards(AdminGuard)
  @Get('admin/products')
  adminFindAll() {
    return this.productsService.adminFindAll();
  }

  @UseGuards(AdminGuard)
  @Get('admin/products/:id')
  adminFindById(@Param('id') id: string) {
    return this.productsService.adminFindById(Number(id));
  }

  @UseGuards(AdminGuard)
  @Post('admin/products')
  adminCreate(@Body() dto: CreateProductDto) {
    return this.productsService.adminCreate(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('admin/products/:id')
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.adminUpdate(Number(id), dto);
  }

  @UseGuards(AdminGuard)
@Post('admin/products/:productId/variants')
adminCreateVariant(
  @Param('productId') productId: string,
  @Body() dto: CreateProductVariantDto,
) {
  return this.productsService.adminCreateVariant(Number(productId), dto);
}

@UseGuards(AdminGuard)
@Patch('admin/products/:productId/variants/:variantId')
adminUpdateVariant(
  @Param('productId') productId: string,
  @Param('variantId') variantId: string,
  @Body() dto: UpdateProductVariantDto,
) {
  return this.productsService.adminUpdateVariant(
    Number(productId),
    Number(variantId),
    dto,
  );
}

@UseGuards(AdminGuard)
@Post('admin/products/:productId/images')
adminCreateImage(
  @Param('productId') productId: string,
  @Body() dto: CreateProductImageDto,
) {
  return this.productsService.adminCreateImage(Number(productId), dto);
}

@UseGuards(AdminGuard)
@Patch('admin/products/:productId/images/:imageId')
adminUpdateImage(
  @Param('productId') productId: string,
  @Param('imageId') imageId: string,
  @Body() dto: UpdateProductImageDto,
) {
  return this.productsService.adminUpdateImage(
    Number(productId),
    Number(imageId),
    dto,
  );
}
}
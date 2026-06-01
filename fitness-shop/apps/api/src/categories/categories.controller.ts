import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('categories/:slug/products')
  findProductsByCategory(@Param('slug') slug: string) {
    return this.categoriesService.findProductsByCategory(slug);
  }

  @UseGuards(AdminGuard)
  @Get('admin/categories')
  adminFindAll() {
    return this.categoriesService.adminFindAll();
  }

  @UseGuards(AdminGuard)
  @Post('admin/categories')
  adminCreate(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.adminCreate(dto);
  }

  @UseGuards(AdminGuard)
  @Patch('admin/categories/:id')
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.adminUpdate(Number(id), dto);
  }
}
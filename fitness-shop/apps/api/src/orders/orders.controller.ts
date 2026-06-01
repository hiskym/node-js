import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get('orders/:orderNumber')
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @UseGuards(AdminGuard)
  @Get('admin/orders')
  adminFindAll() {
    return this.ordersService.adminFindAll();
  }

  @UseGuards(AdminGuard)
  @Get('admin/orders/:id')
  adminFindById(@Param('id') id: string) {
    return this.ordersService.adminFindById(Number(id));
  }

  @UseGuards(AdminGuard)
  @Patch('admin/orders/:id/status')
  adminUpdateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.adminUpdateStatus(Number(id), dto.status);
  }
}
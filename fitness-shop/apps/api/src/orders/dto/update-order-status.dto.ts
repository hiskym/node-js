import { orderStatusEnum } from '@fitness-shop/db';

export class UpdateOrderStatusDto {
  status: (typeof orderStatusEnum)[number];
}
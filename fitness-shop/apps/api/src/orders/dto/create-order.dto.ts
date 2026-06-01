export class CreateOrderCustomerDto {
  name: string;
  email: string;
  phone: string;
}

export class CreateOrderItemDto {
  productId: number;
  variantId: number;
  quantity: number;
}

export class CreateOrderDto {
  customer: CreateOrderCustomerDto;
  items: CreateOrderItemDto[];
  note?: string;
}
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    db,
    orderItems,
    orders,
    productVariants,
    products,
    users,
} from '@fitness-shop/db';
import { asc, and, desc, eq } from 'drizzle-orm';
import { orderStatusEnum } from '@fitness-shop/db';
import { DATABASE } from '../database/database.module';
import { CreateOrderDto } from './dto/create-order.dto';

type Database = typeof db;

type ValidatedOrderItem = {
    productId: number;
    variantId: number;
    productName: string;
    variantName: string;
    unitPrice: string;
    currency: string;
    quantity: number;
    totalPrice: string;
};

@Injectable()
export class OrdersService {
    constructor(@Inject(DATABASE) private readonly database: Database) { }

    async create(dto: CreateOrderDto) {
        this.validateCreateOrderDto(dto);

        const validatedItems = await this.validateItems(dto.items);

        const currency = validatedItems[0].currency;
        const subtotal = this.sumPrices(validatedItems.map((item) => item.totalPrice));
        const total = subtotal;

        const now = new Date().toISOString();

        const user = await this.findOrCreateCustomer({
            name: dto.customer.name,
            email: dto.customer.email,
            phone: dto.customer.phone,
            now,
        });

        const orderNumber = await this.generateOrderNumber();

        const [createdOrder] = await this.database
            .insert(orders)
            .values({
                orderNumber,
                userId: user.id,
                customerEmail: dto.customer.email,
                customerName: dto.customer.name,
                customerPhone: dto.customer.phone,
                note: dto.note,
                status: 'new',
                paymentMethod: 'cash_on_delivery',
                paymentStatus: 'pending',
                shippingMethod: 'personal_pickup',
                subtotal,
                total,
                currency,
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        await this.database.insert(orderItems).values(
            validatedItems.map((item) => ({
                orderId: createdOrder.id,
                productId: item.productId,
                variantId: item.variantId,
                productName: item.productName,
                variantName: item.variantName,
                unitPrice: item.unitPrice,
                currency: item.currency,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            })),
        );

        for (const item of validatedItems) {
            const variant = await this.database.query.productVariants.findFirst({
                where: eq(productVariants.id, item.variantId),
            });

            if (!variant) {
                throw new BadRequestException('Variant disappeared during checkout');
            }

            await this.database
                .update(productVariants)
                .set({
                    stockQuantity: variant.stockQuantity - item.quantity,
                    updatedAt: now,
                })
                .where(eq(productVariants.id, item.variantId));
        }

        return {
            orderNumber: createdOrder.orderNumber,
            status: createdOrder.status,
            total: createdOrder.total,
            currency: createdOrder.currency,
        };
    }

    async findByOrderNumber(orderNumber: string) {
        const order = await this.database.query.orders.findFirst({
            where: eq(orders.orderNumber, orderNumber),
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const items = await this.database
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

        return {
            ...order,
            items,
        };
    }

    async adminFindAll() {
        const rows = await this.database
            .select()
            .from(orders)
            .orderBy(desc(orders.createdAt));

        return rows;
    }

    async adminFindById(id: number) {
        if (!Number.isInteger(id)) {
            throw new BadRequestException('Invalid order id');
        }

        const order = await this.database.query.orders.findFirst({
            where: eq(orders.id, id),
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const items = await this.database
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id))
            .orderBy(asc(orderItems.id));

        return {
            ...order,
            items,
        };
    }

    async adminUpdateStatus(
        id: number,
        status: (typeof orderStatusEnum)[number],
    ) {
        if (!Number.isInteger(id)) {
            throw new BadRequestException('Invalid order id');
        }

        if (!orderStatusEnum.includes(status)) {
            throw new BadRequestException('Invalid order status');
        }

        const existingOrder = await this.database.query.orders.findFirst({
            where: eq(orders.id, id),
        });

        if (!existingOrder) {
            throw new NotFoundException('Order not found');
        }

        const now = new Date().toISOString();

        const [updatedOrder] = await this.database
            .update(orders)
            .set({
                status,
                updatedAt: now,
            })
            .where(eq(orders.id, id))
            .returning();

        return updatedOrder;
    }

    private validateCreateOrderDto(dto: CreateOrderDto) {
        if (!dto.customer?.name?.trim()) {
            throw new BadRequestException('Customer name is required');
        }

        if (!dto.customer?.email?.trim()) {
            throw new BadRequestException('Customer email is required');
        }

        if (!dto.customer?.phone?.trim()) {
            throw new BadRequestException('Customer phone is required');
        }

        if (!dto.items?.length) {
            throw new BadRequestException('Order must contain at least one item');
        }

        for (const item of dto.items) {
            if (!item.productId || !item.variantId) {
                throw new BadRequestException('Product and variant are required');
            }

            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new BadRequestException('Quantity must be a positive integer');
            }
        }
    }

    private async validateItems(
        items: CreateOrderDto['items'],
    ): Promise<ValidatedOrderItem[]> {
        const validatedItems: ValidatedOrderItem[] = [];

        for (const item of items) {
            const product = await this.database.query.products.findFirst({
                where: and(eq(products.id, item.productId), eq(products.isActive, true)),
            });

            if (!product) {
                throw new BadRequestException(`Product ${item.productId} does not exist`);
            }

            const variant = await this.database.query.productVariants.findFirst({
                where: and(
                    eq(productVariants.id, item.variantId),
                    eq(productVariants.productId, item.productId),
                    eq(productVariants.isActive, true),
                ),
            });

            if (!variant) {
                throw new BadRequestException(
                    `Variant ${item.variantId} does not exist for product ${item.productId}`,
                );
            }

            if (variant.stockQuantity < item.quantity) {
                throw new BadRequestException(
                    `Není dostatek kusů skladem pro variantu ${variant.name}. Aktuálně skladem: ${variant.stockQuantity} ks.`,
                );
            }

            const unitPrice = variant.price ?? product.price;
            const currency = variant.currency ?? product.currency;
            const totalPrice = this.multiplyPrice(unitPrice, item.quantity);

            validatedItems.push({
                productId: product.id,
                variantId: variant.id,
                productName: product.name,
                variantName: variant.name,
                unitPrice,
                currency,
                quantity: item.quantity,
                totalPrice,
            });
        }

        const currencies = new Set(validatedItems.map((item) => item.currency));

        if (currencies.size > 1) {
            throw new BadRequestException('Order cannot contain multiple currencies');
        }

        return validatedItems;
    }

    private async findOrCreateCustomer(input: {
        name: string;
        email: string;
        phone: string;
        now: string;
    }) {
        const existingUser = await this.database.query.users.findFirst({
            where: eq(users.email, input.email),
        });

        if (existingUser) {
            return existingUser;
        }

        const [createdUser] = await this.database
            .insert(users)
            .values({
                email: input.email,
                name: input.name,
                phone: input.phone,
                role: 'customer',
                isRegistered: false,
                createdAt: input.now,
                updatedAt: input.now,
            })
            .returning();

        return createdUser;
    }

    private async generateOrderNumber() {
        const year = new Date().getFullYear();

        const latestOrder = await this.database.query.orders.findFirst({
            orderBy: desc(orders.id),
        });

        const nextNumber = latestOrder ? latestOrder.id + 1 : 1;

        return `FS${year}${String(nextNumber).padStart(5, '0')}`;
    }

    private multiplyPrice(price: string, quantity: number) {
        return (Number(price) * quantity).toFixed(2);
    }

    private sumPrices(prices: string[]) {
        return prices.reduce((sum, price) => sum + Number(price), 0).toFixed(2);
    }
}
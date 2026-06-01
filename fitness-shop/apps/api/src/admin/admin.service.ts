import { Inject, Injectable } from '@nestjs/common';
import { db, orders, products } from '@fitness-shop/db';
import { eq, sql } from 'drizzle-orm';
import { DATABASE } from '../database/database.module';

type Database = typeof db;

@Injectable()
export class AdminService {
  constructor(@Inject(DATABASE) private readonly database: Database) {}

  async getStats() {
    const [productStats] = await this.database
      .select({
        totalProducts: sql<number>`count(*)`,
      })
      .from(products);

    const [orderStats] = await this.database
      .select({
        totalOrders: sql<number>`count(*)`,
      })
      .from(orders);

    const [newOrderStats] = await this.database
      .select({
        newOrders: sql<number>`count(*)`,
      })
      .from(orders)
      .where(eq(orders.status, 'new'));

    const [revenueStats] = await this.database
      .select({
        revenue: sql<string>`coalesce(sum(cast(${orders.total} as real)), 0)`,
      })
      .from(orders)
      .where(eq(orders.status, 'completed'));

    return {
      totalProducts: Number(productStats.totalProducts),
      totalOrders: Number(orderStats.totalOrders),
      newOrders: Number(newOrderStats.newOrders),
      completedRevenue: Number(revenueStats.revenue).toFixed(2),
      currency: 'CZK',
    };
  }
}
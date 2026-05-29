import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text
} from "drizzle-orm/sqlite-core";

export const userRoleEnum = ["admin", "customer"] as const;

export const orderStatusEnum = [
  "new",
  "confirmed",
  "ready_for_pickup",
  "completed",
  "cancelled"
] as const;

export const paymentMethodEnum = ["cash_on_delivery"] as const;
export const paymentStatusEnum = ["pending", "paid", "cancelled"] as const;
export const shippingMethodEnum = ["personal_pickup"] as const;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),

  name: text("name").notNull(),
  phone: text("phone"),

  role: text("role", { enum: userRoleEnum }).notNull().default("customer"),
  isRegistered: integer("is_registered", { mode: "boolean" }).notNull().default(false),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),

  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description").notNull(),

  price: text("price").notNull(),
  currency: text("currency").notNull().default("CZK"),

  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const productCategories = sqliteTable(
  "product_categories",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" })
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.productId, table.categoryId]
    })
  })
);

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  sortOrder: integer("sort_order").notNull().default(0),

  createdAt: text("created_at").notNull()
});

export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),

  price: text("price"),
  currency: text("currency"),

  stockQuantity: integer("stock_quantity").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  orderNumber: text("order_number").notNull().unique(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id),

  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),

  note: text("note"),

  status: text("status", { enum: orderStatusEnum }).notNull().default("new"),
  paymentMethod: text("payment_method", { enum: paymentMethodEnum })
    .notNull()
    .default("cash_on_delivery"),
  paymentStatus: text("payment_status", { enum: paymentStatusEnum })
    .notNull()
    .default("pending"),
  shippingMethod: text("shipping_method", { enum: shippingMethodEnum })
    .notNull()
    .default("personal_pickup"),

  subtotal: text("subtotal").notNull(),
  total: text("total").notNull(),
  currency: text("currency").notNull().default("CZK"),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id),

  variantId: integer("variant_id").references(() => productVariants.id),

  productName: text("product_name").notNull(),
  variantName: text("variant_name"),

  unitPrice: text("unit_price").notNull(),
  currency: text("currency").notNull().default("CZK"),

  quantity: integer("quantity").notNull(),
  totalPrice: text("total_price").notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  productCategories: many(productCategories)
}));

export const productsRelations = relations(products, ({ many }) => ({
  productCategories: many(productCategories),
  images: many(productImages),
  variants: many(productVariants),
  orderItems: many(orderItems)
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.productId],
    references: [products.id]
  }),
  category: one(categories, {
    fields: [productCategories.categoryId],
    references: [categories.id]
  })
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  })
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id]
  }),
  orderItems: many(orderItems)
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id]
  })
}));
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemsRelations = exports.ordersRelations = exports.productVariantsRelations = exports.productImagesRelations = exports.productCategoriesRelations = exports.productsRelations = exports.categoriesRelations = exports.usersRelations = exports.orderItems = exports.orders = exports.productVariants = exports.productImages = exports.productCategories = exports.products = exports.categories = exports.users = exports.shippingMethodEnum = exports.paymentStatusEnum = exports.paymentMethodEnum = exports.orderStatusEnum = exports.userRoleEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.userRoleEnum = ["admin", "customer"];
exports.orderStatusEnum = [
    "new",
    "confirmed",
    "ready_for_pickup",
    "completed",
    "cancelled"
];
exports.paymentMethodEnum = ["cash_on_delivery"];
exports.paymentStatusEnum = ["pending", "paid", "cancelled"];
exports.shippingMethodEnum = ["personal_pickup"];
exports.users = (0, sqlite_core_1.sqliteTable)("users", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    email: (0, sqlite_core_1.text)("email").notNull().unique(),
    passwordHash: (0, sqlite_core_1.text)("password_hash"),
    name: (0, sqlite_core_1.text)("name").notNull(),
    phone: (0, sqlite_core_1.text)("phone"),
    role: (0, sqlite_core_1.text)("role", { enum: exports.userRoleEnum }).notNull().default("customer"),
    isRegistered: (0, sqlite_core_1.integer)("is_registered", { mode: "boolean" }).notNull().default(false),
    createdAt: (0, sqlite_core_1.text)("created_at").notNull(),
    updatedAt: (0, sqlite_core_1.text)("updated_at").notNull()
});
exports.categories = (0, sqlite_core_1.sqliteTable)("categories", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    description: (0, sqlite_core_1.text)("description"),
    imageUrl: (0, sqlite_core_1.text)("image_url"),
    isActive: (0, sqlite_core_1.integer)("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: (0, sqlite_core_1.text)("created_at").notNull(),
    updatedAt: (0, sqlite_core_1.text)("updated_at").notNull()
});
exports.products = (0, sqlite_core_1.sqliteTable)("products", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    shortDescription: (0, sqlite_core_1.text)("short_description"),
    description: (0, sqlite_core_1.text)("description").notNull(),
    price: (0, sqlite_core_1.text)("price").notNull(),
    currency: (0, sqlite_core_1.text)("currency").notNull().default("CZK"),
    isActive: (0, sqlite_core_1.integer)("is_active", { mode: "boolean" }).notNull().default(true),
    isFeatured: (0, sqlite_core_1.integer)("is_featured", { mode: "boolean" }).notNull().default(false),
    createdAt: (0, sqlite_core_1.text)("created_at").notNull(),
    updatedAt: (0, sqlite_core_1.text)("updated_at").notNull()
});
exports.productCategories = (0, sqlite_core_1.sqliteTable)("product_categories", {
    productId: (0, sqlite_core_1.integer)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    categoryId: (0, sqlite_core_1.integer)("category_id")
        .notNull()
        .references(() => exports.categories.id, { onDelete: "cascade" })
}, (table) => ({
    pk: (0, sqlite_core_1.primaryKey)({
        columns: [table.productId, table.categoryId]
    })
}));
exports.productImages = (0, sqlite_core_1.sqliteTable)("product_images", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    productId: (0, sqlite_core_1.integer)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    imageUrl: (0, sqlite_core_1.text)("image_url").notNull(),
    altText: (0, sqlite_core_1.text)("alt_text"),
    sortOrder: (0, sqlite_core_1.integer)("sort_order").notNull().default(0),
    createdAt: (0, sqlite_core_1.text)("created_at").notNull()
});
exports.productVariants = (0, sqlite_core_1.sqliteTable)("product_variants", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    productId: (0, sqlite_core_1.integer)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    name: (0, sqlite_core_1.text)("name").notNull(),
    sku: (0, sqlite_core_1.text)("sku").notNull().unique(),
    price: (0, sqlite_core_1.text)("price"),
    currency: (0, sqlite_core_1.text)("currency"),
    stockQuantity: (0, sqlite_core_1.integer)("stock_quantity").notNull().default(0),
    isActive: (0, sqlite_core_1.integer)("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: (0, sqlite_core_1.text)("created_at").notNull(),
    updatedAt: (0, sqlite_core_1.text)("updated_at").notNull()
});
exports.orders = (0, sqlite_core_1.sqliteTable)("orders", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    orderNumber: (0, sqlite_core_1.text)("order_number").notNull().unique(),
    userId: (0, sqlite_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.users.id),
    customerEmail: (0, sqlite_core_1.text)("customer_email").notNull(),
    customerName: (0, sqlite_core_1.text)("customer_name").notNull(),
    customerPhone: (0, sqlite_core_1.text)("customer_phone").notNull(),
    note: (0, sqlite_core_1.text)("note"),
    status: (0, sqlite_core_1.text)("status", { enum: exports.orderStatusEnum }).notNull().default("new"),
    paymentMethod: (0, sqlite_core_1.text)("payment_method", { enum: exports.paymentMethodEnum })
        .notNull()
        .default("cash_on_delivery"),
    paymentStatus: (0, sqlite_core_1.text)("payment_status", { enum: exports.paymentStatusEnum })
        .notNull()
        .default("pending"),
    shippingMethod: (0, sqlite_core_1.text)("shipping_method", { enum: exports.shippingMethodEnum })
        .notNull()
        .default("personal_pickup"),
    subtotal: (0, sqlite_core_1.text)("subtotal").notNull(),
    total: (0, sqlite_core_1.text)("total").notNull(),
    currency: (0, sqlite_core_1.text)("currency").notNull().default("CZK"),
    createdAt: (0, sqlite_core_1.text)("created_at").notNull(),
    updatedAt: (0, sqlite_core_1.text)("updated_at").notNull()
});
exports.orderItems = (0, sqlite_core_1.sqliteTable)("order_items", {
    id: (0, sqlite_core_1.integer)("id").primaryKey({ autoIncrement: true }),
    orderId: (0, sqlite_core_1.integer)("order_id")
        .notNull()
        .references(() => exports.orders.id, { onDelete: "cascade" }),
    productId: (0, sqlite_core_1.integer)("product_id")
        .notNull()
        .references(() => exports.products.id),
    variantId: (0, sqlite_core_1.integer)("variant_id").references(() => exports.productVariants.id),
    productName: (0, sqlite_core_1.text)("product_name").notNull(),
    variantName: (0, sqlite_core_1.text)("variant_name"),
    unitPrice: (0, sqlite_core_1.text)("unit_price").notNull(),
    currency: (0, sqlite_core_1.text)("currency").notNull().default("CZK"),
    quantity: (0, sqlite_core_1.integer)("quantity").notNull(),
    totalPrice: (0, sqlite_core_1.text)("total_price").notNull()
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    orders: many(exports.orders)
}));
exports.categoriesRelations = (0, drizzle_orm_1.relations)(exports.categories, ({ many }) => ({
    productCategories: many(exports.productCategories)
}));
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    productCategories: many(exports.productCategories),
    images: many(exports.productImages),
    variants: many(exports.productVariants),
    orderItems: many(exports.orderItems)
}));
exports.productCategoriesRelations = (0, drizzle_orm_1.relations)(exports.productCategories, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.productCategories.productId],
        references: [exports.products.id]
    }),
    category: one(exports.categories, {
        fields: [exports.productCategories.categoryId],
        references: [exports.categories.id]
    })
}));
exports.productImagesRelations = (0, drizzle_orm_1.relations)(exports.productImages, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.productImages.productId],
        references: [exports.products.id]
    })
}));
exports.productVariantsRelations = (0, drizzle_orm_1.relations)(exports.productVariants, ({ one, many }) => ({
    product: one(exports.products, {
        fields: [exports.productVariants.productId],
        references: [exports.products.id]
    }),
    orderItems: many(exports.orderItems)
}));
exports.ordersRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.orders.userId],
        references: [exports.users.id]
    }),
    items: many(exports.orderItems)
}));
exports.orderItemsRelations = (0, drizzle_orm_1.relations)(exports.orderItems, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderItems.orderId],
        references: [exports.orders.id]
    }),
    product: one(exports.products, {
        fields: [exports.orderItems.productId],
        references: [exports.products.id]
    }),
    variant: one(exports.productVariants, {
        fields: [exports.orderItems.variantId],
        references: [exports.productVariants.id]
    })
}));

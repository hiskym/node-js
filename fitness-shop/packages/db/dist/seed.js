"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const index_1 = require("./index");
const now = () => new Date().toISOString();
async function seed() {
    console.log("Seeding database...");
    const existingAdmin = await index_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(index_1.users.email, "admin@example.com")
    });
    if (!existingAdmin) {
        await index_1.db.insert(index_1.users).values({
            email: "admin@example.com",
            passwordHash: "$2b$10$3z8BTc2oMfarUm6TmKTtZ.t.nE8AhYmYposwGJlQPVlp4j26fx2Gi", // "admin123"
            name: "Admin",
            role: "admin",
            isRegistered: true,
            createdAt: now(),
            updatedAt: now()
        });
    }
    const insertedCategories = await index_1.db
        .insert(index_1.categories)
        .values([
        {
            name: "Kettlebelly",
            slug: "kettlebelly",
            description: "Kettlebelly pro silový a funkční trénink.",
            imageUrl: "/products/categories/kettlebelly.jpg",
            createdAt: now(),
            updatedAt: now()
        },
        {
            name: "Expandéry",
            slug: "expandery",
            description: "Odporové gumy a expandéry pro domácí cvičení.",
            imageUrl: "/products/categories/expandery.jpg",
            createdAt: now(),
            updatedAt: now()
        },
        {
            name: "Regenerace",
            slug: "regenerace",
            description: "Pomůcky pro masáž, mobilitu a regeneraci.",
            imageUrl: "/products/categories/regenerace.jpg",
            createdAt: now(),
            updatedAt: now()
        }
    ])
        .returning();
    const insertedProducts = await index_1.db
        .insert(index_1.products)
        .values([
        {
            name: "Kettlebell Competition 12 kg",
            slug: "kettlebell-competition-12kg",
            shortDescription: "Ocelový kettlebell pro silový trénink.",
            description: "Competition kettlebell s jednotnou velikostí těla, vhodný pro technický i silový trénink.",
            price: "1290.00",
            currency: "CZK",
            isFeatured: true,
            createdAt: now(),
            updatedAt: now()
        },
        {
            name: "Sada odporových gum",
            slug: "sada-odporovych-gum",
            shortDescription: "Praktická sada expandérů s různou obtížností.",
            description: "Sada odporových gum pro posílení celého těla, rehabilitaci i mobilitu.",
            price: "499.00",
            currency: "CZK",
            isFeatured: true,
            createdAt: now(),
            updatedAt: now()
        },
        {
            name: "Masážní válec",
            slug: "masazni-valec",
            shortDescription: "Pomůcka pro uvolnění svalů po tréninku.",
            description: "Masážní válec pomáhá s regenerací, uvolněním svalů a zlepšením mobility.",
            price: "399.00",
            currency: "CZK",
            isFeatured: false,
            createdAt: now(),
            updatedAt: now()
        }
    ])
        .returning();
    const kettleCategory = insertedCategories.find((c) => c.slug === "kettlebelly");
    const expandersCategory = insertedCategories.find((c) => c.slug === "expandery");
    const recoveryCategory = insertedCategories.find((c) => c.slug === "regenerace");
    const kettlebell = insertedProducts.find((p) => p.slug === "kettlebell-competition-12kg");
    const expanders = insertedProducts.find((p) => p.slug === "sada-odporovych-gum");
    const roller = insertedProducts.find((p) => p.slug === "masazni-valec");
    await index_1.db.insert(index_1.productCategories).values([
        {
            productId: kettlebell.id,
            categoryId: kettleCategory.id
        },
        {
            productId: expanders.id,
            categoryId: expandersCategory.id
        },
        {
            productId: expanders.id,
            categoryId: recoveryCategory.id
        },
        {
            productId: roller.id,
            categoryId: recoveryCategory.id
        }
    ]);
    await index_1.db.insert(index_1.productImages).values([
        {
            productId: kettlebell.id,
            imageUrl: "/products/kettlebell-12kg-1.jpg",
            altText: "Kettlebell Competition 12 kg",
            sortOrder: 1,
            createdAt: now()
        },
        {
            productId: kettlebell.id,
            imageUrl: "/products/kettlebell-12kg-2.jpg",
            altText: "Detail kettlebellu",
            sortOrder: 2,
            createdAt: now()
        },
        {
            productId: expanders.id,
            imageUrl: "/products/expanders-set-1.jpg",
            altText: "Sada odporových gum",
            sortOrder: 1,
            createdAt: now()
        },
        {
            productId: roller.id,
            imageUrl: "/products/foam-roller-1.jpg",
            altText: "Masážní válec",
            sortOrder: 1,
            createdAt: now()
        }
    ]);
    await index_1.db.insert(index_1.productVariants).values([
        {
            productId: kettlebell.id,
            name: "12 kg",
            sku: "KB-COMP-12",
            price: "1290.00",
            currency: "CZK",
            stockQuantity: 8,
            createdAt: now(),
            updatedAt: now()
        },
        {
            productId: kettlebell.id,
            name: "16 kg",
            sku: "KB-COMP-16",
            price: "1590.00",
            currency: "CZK",
            stockQuantity: 5,
            createdAt: now(),
            updatedAt: now()
        },
        {
            productId: expanders.id,
            name: "Light",
            sku: "EXP-SET-LIGHT",
            stockQuantity: 20,
            createdAt: now(),
            updatedAt: now()
        },
        {
            productId: expanders.id,
            name: "Medium",
            sku: "EXP-SET-MEDIUM",
            stockQuantity: 15,
            createdAt: now(),
            updatedAt: now()
        },
        {
            productId: roller.id,
            name: "Černá",
            sku: "ROLLER-BLACK",
            stockQuantity: 12,
            createdAt: now(),
            updatedAt: now()
        }
    ]);
    console.log("Database seeded successfully.");
}
seed();

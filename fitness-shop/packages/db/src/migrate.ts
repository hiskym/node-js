// packages/db/src/migrate.ts
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";

const dbUrl = process.env.DATABASE_URL ?? "./packages/db/sqlite.db";

const sqlite = new Database(dbUrl);
const db = drizzle(sqlite);

migrate(db, {
  migrationsFolder: "./packages/db/drizzle",
});

console.log("Database migrated successfully.");
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// packages/db/src/migrate.ts
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const migrator_1 = require("drizzle-orm/better-sqlite3/migrator");
const better_sqlite3_2 = require("drizzle-orm/better-sqlite3");
const dbUrl = process.env.DATABASE_URL ?? "./packages/db/sqlite.db";
const sqlite = new better_sqlite3_1.default(dbUrl);
const db = (0, better_sqlite3_2.drizzle)(sqlite);
(0, migrator_1.migrate)(db, {
    migrationsFolder: "./packages/db/drizzle",
});
console.log("Database migrated successfully.");

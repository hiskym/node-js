import { sqliteTable, int, text } from "drizzle-orm/sqlite-core"

export const todosTable = sqliteTable("todos", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  done: int({ mode: "boolean" }).notNull().default(0),
  priority: text({ enum: ["low", "medium", "high"] }).notNull().default("medium")
})
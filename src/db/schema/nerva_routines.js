// src/db/schema/nerva_routines.js
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const nervaRoutines = pgTable("nerva_routines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  goal: varchar("goal", { length: 280 }).notNull(),
  area: varchar("area", { length: 60 }).notNull().default("Operação"),
  status: varchar("status", { length: 24 }).notNull().default("draft"), // draft | active | paused

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
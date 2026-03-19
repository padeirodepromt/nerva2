import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { nervaRoutines } from "./nerva_routines.js";

export const nervaOperators = pgTable("nerva_operators", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 120 }).notNull(),
  verb: varchar("verb", { length: 40 }).notNull(),
  channel: varchar("channel", { length: 60 }).notNull().default("System"),
  autonomy: varchar("autonomy", { length: 20 }).notNull().default("Aprovação"),

  // optional back‑reference to the parent routine (useful for queries)
  routineId: uuid("routine_id").references(() => nervaRoutines.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

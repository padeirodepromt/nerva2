// src/db/schema/nerva_logs.js
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { nervaRoutines } from "./nerva_routines.js";
import { nervaOperators } from "./nerva_operators.js";

export const nervaLogs = pgTable("nerva_logs", {
  id: uuid("id").primaryKey().defaultRandom(),

  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),

  level: varchar("level", { length: 12 }).notNull().default("INFO"), // INFO | WARN | ALERT | CRIT
  area: varchar("area", { length: 60 }).notNull().default("Operação"),
  channel: varchar("channel", { length: 80 }).notNull().default("System"),
  code: varchar("code", { length: 80 }).notNull().default("NERVA.EVENT"),
  msg: varchar("msg", { length: 280 }).notNull(),
  ctx: varchar("ctx", { length: 280 }).notNull().default(""),

  routineId: uuid("routine_id").references(() => nervaRoutines.id, { onDelete: "set null" }),
  operatorId: uuid("operator_id").references(() => nervaOperators.id, { onDelete: "set null" })
});
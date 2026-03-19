// src/db/schema/nerva_approvals.js
import { pgTable, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";
import { nervaRoutines } from "./nerva_routines.js";
import { nervaOperators } from "./nerva_operators.js";
import { nervaLogs } from "./nerva_logs.js";

export const nervaApprovals = pgTable("nerva_approvals", {
  id: uuid("id").primaryKey().defaultRandom(),

  status: varchar("status", { length: 24 }).notNull().default("pending"), // pending | approved | rejected
  kind: varchar("kind", { length: 40 }).notNull().default("action"), // action | plan | routine_change | connector_auth

  logId: uuid("log_id").references(() => nervaLogs.id, { onDelete: "set null" }),
  routineId: uuid("routine_id").references(() => nervaRoutines.id, { onDelete: "set null" }),
  operatorId: uuid("operator_id").references(() => nervaOperators.id, { onDelete: "set null" }),

  title: varchar("title", { length: 140 }).notNull(),
  summary: varchar("summary", { length: 280 }).notNull().default(""),

  // ✅ payload real (plano, steps, parâmetros)
  payload: jsonb("payload").notNull().default({}),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),

  // idempotência (engine consome 1 vez)
  handledAt: timestamp("handled_at", { withTimezone: true })
});
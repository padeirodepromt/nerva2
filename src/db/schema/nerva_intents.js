// src/db/schema/nerva_intents.js
import { pgTable, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";

export const nervaIntents = pgTable("nerva_intents", {
  id: uuid("id").primaryKey().defaultRandom(),

  mode: varchar("mode", { length: 32 }).notNull().default("prompt_short"),
  prompt: varchar("prompt", { length: 600 }).notNull(),

  // inferred / chosen
  area: varchar("area", { length: 60 }).notNull().default("Operação"),
  platform: varchar("platform", { length: 60 }).notNull().default("unknown"), // WhatsApp | Gmail | Sheets | CRM | Meta Ads | Google Ads | unknown

  // lifecycle
  status: varchar("status", { length: 32 }).notNull().default("draft"), // draft | compiled | submitted | activated

  // compiled artifacts (drafts)
  card: jsonb("card").notNull().default({}), // 6-field execution card
  plan: jsonb("plan").notNull().default({}), // plan draft

  // extra debug/metadata (signals, confidence, missing fields)
  meta: jsonb("meta").notNull().default({}),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
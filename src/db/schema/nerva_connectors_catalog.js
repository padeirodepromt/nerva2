// src/db/schema/nerva_connectors_catalog.js
import { pgTable, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";

export const nervaConnectorsCatalog = pgTable("nerva_connectors_catalog", {
  id: uuid("id").primaryKey().defaultRandom(),

  key: varchar("key", { length: 60 }).notNull(), // ex: WhatsApp, Gmail, Meta Ads
  type: varchar("type", { length: 40 }).notNull().default("platform"), // platform | connector
  defaultArea: varchar("default_area", { length: 60 }).notNull().default("Operação"),

  // discovery aids (data-driven)
  synonyms: jsonb("synonyms").notNull().default([]), // ["whatsapp","zap","wpp"]
  needs: jsonb("needs").notNull().default([]), // ["google_oauth"] etc

  // “integração universal por camadas”
  layers: jsonb("layers").notNull().default([
    // { layer:"api", stable:true }, { layer:"sdk" }, { layer:"cli" }, { layer:"ui_automation", fragile:true, optIn:true }
  ]),

  risk: varchar("risk", { length: 12 }).notNull().default("low"), // low | medium | high
  notes: varchar("notes", { length: 280 }).notNull().default(""),

  isEnabled: varchar("is_enabled", { length: 8 }).notNull().default("true"), // "true"/"false"

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
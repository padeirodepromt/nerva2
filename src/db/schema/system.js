/* src/db/schema/system.js
   desc: System Layer V1 (Postgres)
   feat: Instalação de sistemas no workspace + ativação por projeto + DNA do Brand Code.
   add : Brand Code Interviews (histórico do protocolo) + tracking leve em brand_codes.
*/

import { pgTable, text, integer, boolean, jsonb, timestamp, serial, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

import { users, projects } from './core.js';

/**
 * USER_SYSTEMS
 * Representa "sistemas contratados/instalados" no workspace do usuário.
 * Ex: Brand Code (capacidade instalada), outros sistemas futuros.
 */

export const brandCodeGeneEvents = pgTable("brand_code_gene_events", {
  id: serial("id").primaryKey(),

  projectId: text("project_id").notNull(),

  geneKey: text("gene_key"), // pode ser null para evento global
  type: text("type").notNull(), // BRANDCODE_EVENT_TYPES

  // delta recomendado -1..+1 (impacto na vitalidade)
  delta: integer("delta"), // opcional (pode migrar para numeric depois)

  payload: jsonb("payload").notNull().default({}),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});


export const userSystems = pgTable('user_systems', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Chave do sistema (ex: 'brand_code')
  systemKey: text('system_key').notNull(),

  // Estado de instalação (instalado, pausado, etc.)
  status: text('status', { enum: ['installed', 'paused', 'removed'] })
    .notNull()
    .default('installed'),

  // Metadados/config do sistema no workspace
  config: jsonb('config').default({}),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  userSystemUnique: uniqueIndex('user_systems_user_system_unique').on(t.userId, t.systemKey),
}));

export const userSystemsRelations = relations(userSystems, ({ one, many }) => ({
  user: one(users, { fields: [userSystems.userId], references: [users.id] }),
  projectSystems: many(projectSystems),
}));

/**
 * PROJECT_SYSTEMS
 * Representa "sistema habilitado" em um projeto (onde a monetização por projeto acontece).
 * Ex: Brand Code habilitado em um projeto específico.
 */
export const projectSystems = pgTable('project_systems', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),

  // Chave do sistema (ex: 'brand_code')
  systemKey: text('system_key').notNull(),

  // Estado no projeto
  status: text('status', { enum: ['enabled', 'disabled'] })
    .notNull()
    .default('enabled'),

  // Quando foi habilitado
  enabledAt: timestamp('enabled_at').defaultNow().notNull(),

  // Cobrança por projeto (ex: 2000 = R$20,00)
  monthlyPriceCents: integer('monthly_price_cents').default(2000).notNull(),

  // Flags operacionais (ex: travas, modo revisão, etc.)
  flags: jsonb('flags').default({}),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  projectSystemUnique: uniqueIndex('project_systems_project_system_unique').on(t.projectId, t.systemKey),
}));

export const projectSystemsRelations = relations(projectSystems, ({ one }) => ({
  user: one(users, { fields: [projectSystems.userId], references: [users.id] }),
  project: one(projects, { fields: [projectSystems.projectId], references: [projects.id] }),
}));

/**
 * BRAND_CODES
 * O DNA do Brand Code por projeto.
 * Híbrido: blocos estruturados (jsonb) + um resumo humano para leitura rápida.
 */
export const brandCodes = pgTable('brand_codes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),

  // lifecycle do Brand Code dentro do projeto
  status: text('status', { enum: ['empty', 'building', 'active', 'review'] })
    .notNull()
    .default('empty'),

  // Núcleo (DNA estruturado). Aqui vai morar tudo: essência, promessa, personas, tom etc.
  dna: jsonb('dna').default({
    identity: {},
    positioning: {},
    personas: {},
    voice: {},
    story: {},
    governance: {}
  }),

  // Resumo humano curto para UI (cards, preview, etc.)
  summary: text('summary'),

  // Confiança/coerência do DNA (0..100)
  confidenceScore: integer('confidence_score').default(0).notNull(),

  // [ADD] versionamento simples e ponte para a última entrevista
  dnaVersion: integer('dna_version').default(1).notNull(),
  lastInterviewId: text('last_interview_id'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  brandCodeProjectUnique: uniqueIndex('brand_codes_project_unique').on(t.projectId),
}));

export const brandCodesRelations = relations(brandCodes, ({ one, many }) => ({
  user: one(users, { fields: [brandCodes.userId], references: [users.id] }),
  project: one(projects, { fields: [brandCodes.projectId], references: [projects.id] }),
  interviews: many(brandCodeInterviews),
}));

/**
 * BRAND_CODE_INTERVIEWS
 * Histórico do protocolo rodado pela Flor.
 * Serve para: auditoria, reprocessamento, refino, versionamento e "revisões".
 */
export const brandCodeInterviews = pgTable('brand_code_interviews', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),

  brandCodeId: text('brand_code_id')
    .notNull()
    .references(() => brandCodes.id, { onDelete: 'cascade' }),

  operatorAgentKey: text('operator_agent_key').notNull().default('flor'),
  protocolVersion: text('protocol_version').notNull().default('v1'),

  // Conteúdo cru: respostas por key e transcript opcional
  answers: jsonb('answers').default({}).notNull(),
  transcript: jsonb('transcript').default([]).notNull(),

  // Derivados: snapshot do DNA gerado + mini-resumo + score
  dnaSnapshot: jsonb('dna_snapshot').default({}).notNull(),
  summary: text('summary'),
  confidenceScore: integer('confidence_score').default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const brandCodeInterviewsRelations = relations(brandCodeInterviews, ({ one }) => ({
  user: one(users, { fields: [brandCodeInterviews.userId], references: [users.id] }),
  project: one(projects, { fields: [brandCodeInterviews.projectId], references: [projects.id] }),
  brandCode: one(brandCodes, { fields: [brandCodeInterviews.brandCodeId], references: [brandCodes.id] }),
}));

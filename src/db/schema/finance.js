/* src/db/schema/finance.js
   desc: Catálogo de modelos IA + overrides por plano + transações de créditos + auditoria por chamada.
*/

import { pgTable, text, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { plans, users } from './core.js';

/**
 * ai_models: catálogo de modelos configuráveis (DB-driven)
 */
export const aiModels = pgTable('ai_models', {
  id: text('id').primaryKey().$defaultFn(() => createId('mdl')),
  provider: text('provider').notNull(), // 'openai' | 'google'
  modelIdentifier: text('model_identifier').notNull(), // ex: 'gpt-5-mini' / 'gemini-3.0-flash'
  tier: text('tier', { enum: ['FAST', 'SMART'] }).notNull(),
  alias: text('alias'),
  active: boolean('active').default(true),
  priority: integer('priority').default(10), // menor = mais prioridade
  meta: jsonb('meta').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * plan_model_overrides: opcionalmente força um modelo para um plano específico
 */
export const planModelOverrides = pgTable('plan_model_overrides', {
  id: text('id').primaryKey().$defaultFn(() => createId('ovr')),
  planKey: text('plan_key').notNull().references(() => plans.key, { onDelete: 'cascade' }),
  aiModelId: text('ai_model_id').notNull().references(() => aiModels.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * credits_transactions: auditoria de créditos por usuário
 */
export const creditsTransactions = pgTable('credits_transactions', {
  id: text('id').primaryKey().$defaultFn(() => createId('crx')),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['credit', 'debit', 'refund', 'grant'] }).notNull(),
  amount: integer('amount').notNull(), // unidades inteiras de créditos
  balanceAfter: integer('balance_after'),
  reference: text('reference'),
  meta: jsonb('meta').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * ai_usage: registro por chamada IA (para auditoria e conversão em créditos)
 */
export const aiUsage = pgTable('ai_usage', {
  id: text('id').primaryKey().$defaultFn(() => createId('use')),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  aiModelId: text('ai_model_id').references(() => aiModels.id),
  provider: text('provider'),
  modelIdentifier: text('model_identifier'),
  tokensUsed: integer('tokens_used').default(0),
  cost: integer('cost').default(0),
  details: jsonb('details').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Relations
 */
export const aiModelsRelations = relations(aiModels, ({ many }) => ({
  planOverrides: many(planModelOverrides),
}));

export const planModelOverridesRelations = relations(planModelOverrides, ({ one }) => ({
  plan: one(plans, { fields: [planModelOverrides.planKey], references: [plans.key] }),
  model: one(aiModels, { fields: [planModelOverrides.aiModelId], references: [aiModels.id] }),
}));

export const creditsTransactionsRelations = relations(creditsTransactions, ({ one }) => ({
  user: one(users, { fields: [creditsTransactions.userId], references: [users.id] }),
}));

export const aiUsageRelations = relations(aiUsage, ({ one }) => ({
  user: one(users, { fields: [aiUsage.userId], references: [users.id] }),
  model: one(aiModels, { fields: [aiUsage.aiModelId], references: [aiModels.id] }),
}));

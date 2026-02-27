/* src/db/schema/agents.js
   desc: Registry + Contratos de Multi-Agentes (V10).
   feat: agents = catálogo central; userAgents = ativação por usuário.
*/

import { pgTable, text, jsonb, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { users } from './core.js';

/**
 * 🤖 AGENT REGISTRY
 * O catálogo central de inteligências do sistema.
 */
export const agents = pgTable('agents', {
  id: text('id').primaryKey().$defaultFn(() => createId('agt')),
  key: text('key').unique().notNull(), // ex: 'neo', 'monja', 'ash_custom_1'

  // 🧬 ORIGEM: Define se é um Lego (SYSTEM) ou Forjado (ASH)
  source: text('source', { enum: ['SYSTEM_BUNDLE', 'ASH_FORGED'] }).notNull(),

  name: text('name').notNull(),
  description: text('description'),

  // 🧠 CÉREBRO: O comando que define a personalidade
  systemPrompt: text('system_prompt').notNull(),

  // 🛠️ MÃOS: Lista de ferramentas permitidas (JSON)
  // Ex: ['search', 'github_api', 'calculator']
  capabilities: jsonb('capabilities').default([]),

  // 🎭 ROSTO: Metadados para a Interface
  // Ex: { component: 'NeoWorkspace', icon: 'CodeIcon', theme: 'dark' }
  uiMetadata: jsonb('ui_metadata').default({}),

  category: text('category', { enum: ['productivity', 'specialist', 'business', 'custom'] }),
  isPublic: boolean('is_public').default(false), // LEGOs públicos; ASH_FORGED privados por user

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * 🤝 USER AGENTS (Contratos)
 * Define quais agentes o usuário "contratou" ou "ativou".
 */
export const userAgents = pgTable('user_agents', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentId: text('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),

  // Configurações específicas do usuário para aquele agente
  // Ex: token do Github para o Neo, preferências da Monja, etc.
  config: jsonb('config').default({}),

  isActive: boolean('is_active').default(true),
  activatedAt: timestamp('activated_at').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.agentId] }),
}));

// =====================
// RELATIONS
// =====================

export const agentsRelations = relations(agents, ({ many }) => ({
  contracts: many(userAgents),
}));

export const userAgentsRelations = relations(userAgents, ({ one }) => ({
  user: one(users, { fields: [userAgents.userId], references: [users.id] }),
  agent: one(agents, { fields: [userAgents.agentId], references: [agents.id] }),
}));

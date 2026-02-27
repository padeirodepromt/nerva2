/* src/db/schema/logs.js
   desc: Observabilidade e auditoria de ações de agentes.
*/

import { pgTable, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { users } from './core.js';
import { agents } from './agents.js';

export const agentLogs = pgTable('agent_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId('log')),

  // Quem fez a ação?
  agentId: text('agent_id').references(() => agents.id),

  // Para quem foi a ação? (hand-off/colaboração)
  targetAgentId: text('target_agent_id').references(() => agents.id),

  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Tipo: 'AUDIT', 'REFACTOR', 'COLLAB_SUGGESTION', 'HANDOFF_EXECUTION', etc
  type: text('type').notNull(),

  // O "recheio": contexto, diffs, payloads, respostas externas
  content: jsonb('content').notNull(),

  // Score de impacto (útil para medir “tamanho” da ação)
  impactScore: integer('impact_score').default(0),

  createdAt: timestamp('created_at').defaultNow(),
});

export const agentLogsRelations = relations(agentLogs, ({ one }) => ({
  user: one(users, { fields: [agentLogs.userId], references: [users.id] }),
  agent: one(agents, { fields: [agentLogs.agentId], references: [agents.id] }),
  targetAgent: one(agents, { fields: [agentLogs.targetAgentId], references: [agents.id] }),
}));

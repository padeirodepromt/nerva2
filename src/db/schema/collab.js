/* src/db/schema/collab.js
   desc: Collaboração Humana (Chat de Time, Comentários, etc).
*/
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { users, teams, projects } from './core.js';

// === MENSAGENS DE TIME/PROJETO ===
export const teamMessages = pgTable('team_messages', {
  id: text('id').primaryKey().$defaultFn(() => createId('tmsg')),
  
  content: text('content').notNull(),
  
  // Contexto (Pode ser do time inteiro ou de um projeto específico)
  teamId: text('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }), // Opcional (se for chat de projeto)

  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  attachments: jsonb('attachments').default([]), // URLs de arquivos

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === RELATIONS ===
export const teamMessagesRelations = relations(teamMessages, ({ one }) => ({
  team: one(teams, { fields: [teamMessages.teamId], references: [teams.id] }),
  project: one(projects, { fields: [teamMessages.projectId], references: [projects.id] }),
  sender: one(users, { fields: [teamMessages.senderId], references: [users.id] }),
}));

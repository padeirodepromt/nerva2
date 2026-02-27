/* src/db/schema/chat.js
   desc: Esquema de Memória e Conversa (Nexus).
   feat: Suporte a Tool Responses ricas (UI Generativa) e Contexto.
*/

import { pgTable, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
// [CORREÇÃO] Adicionado 'projects' na importação
import { users, projects } from './core.js'; 

// === CONVERSAS (SESSÕES) ===
export const nexusChats = pgTable('nexus_chats', {
  id: text('id').primaryKey().$defaultFn(() => createId('chat')),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').default('Nova Conversa'),
  
  // [V10] Isolamento por Realm
  realmId: text('realm_id').notNull().default('personal'),
  
  // Contexto Macro (Ex: "Planejamento 2025")
  context: jsonb('context').default({}), 
  
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === MENSAGENS (O FLUXO) ===
export const nexusMessages = pgTable('nexus_messages', {
  id: text('id').primaryKey().$defaultFn(() => createId('msg')),
  nexusId: text('nexus_id').notNull().references(() => nexusChats.id, { onDelete: 'cascade' }),
  
  // [V10] Isolamento por Realm
  realmId: text('realm_id').notNull().default('personal'),
  
  role: text('role', { enum: ['user', 'model', 'system', 'tool'] }).notNull(),
  content: text('content'), // Texto (Markdown)
  
  // [CRUCIAL PARA O HOLOCANVAS]
  // Guarda o JSON que o Ash gerou para montar a tela (Widgets, Gráficos, Highlights)
  toolResponse: jsonb('tool_response'), 
  
  // Anexos (URLs de arquivos enviados)
  fileUrls: jsonb('file_urls').default([]),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === RELATIONS ===
export const nexusChatsRelations = relations(nexusChats, ({ one, many }) => ({
  user: one(users, { fields: [nexusChats.userId], references: [users.id] }),
  messages: many(nexusMessages),
}));

export const nexusMessagesRelations = relations(nexusMessages, ({ one }) => ({
  chat: one(nexusChats, { fields: [nexusMessages.nexusId], references: [nexusChats.id] }),
}));

// [NOVO] Canais de Texto para Projetos (Slack-like)
export const projectChannels = pgTable('project_channels', {
  id: text('id').primaryKey().$defaultFn(() => createId('chan')),
  // Agora 'projects' está definido e o erro sumirá
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').default('general'), // ex: 'general', 'design', 'dev'
  createdAt: timestamp('created_at').defaultNow(),
});

export const channelMessages = pgTable('channel_messages', {
  id: text('id').primaryKey().$defaultFn(() => createId('msg')),
  channelId: text('channel_id').notNull().references(() => projectChannels.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id), // Quem falou
  content: text('content').notNull(),
  attachments: jsonb('attachments'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations...
export const projectChannelsRelations = relations(projectChannels, ({ one, many }) => ({
  project: one(projects, { fields: [projectChannels.projectId], references: [projects.id] }),
  messages: many(channelMessages),
}));
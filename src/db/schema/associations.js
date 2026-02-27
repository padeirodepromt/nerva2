/* src/db/schema/associations.js */
import { pgTable, text, boolean, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { users } from './core.js';
import { tasks } from './planning.js';
import { papyrusDocuments } from './docs.js';

// Tabela de Junção: Arquivos <-> Tarefas
export const fileTaskAssociations = pgTable('file_task_associations', {
  id: text('id').$defaultFn(() => createId('fta')),
  
  fileId: text('file_id').notNull()
    .references(() => papyrusDocuments.id, { onDelete: 'cascade' }),
    
  taskId: text('task_id').notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  
  documentType: text('document_type', {
    enum: ['note', 'diary', 'agreement', 'manifest', 'guide', 'code', 'other']
  }).default('note'), 
  
  relationship: text('relationship', {
    enum: ['modify', 'review', 'create', 'reference', 'depends_on']
  }).default('modify'), 
  
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: text('created_by')
    .references(() => users.id, { onDelete: 'set null' }),
  
  isActive: boolean('is_active').default(true),
}, (table) => ({
  // PK Composta e Índices Corretos
  pk: primaryKey({ columns: [table.fileId, table.taskId] }),
  fileIdx: index('fta_file_idx').on(table.fileId),
  taskIdx: index('fta_task_idx').on(table.taskId),
}));

// Relações da Junção
export const fileTaskAssociationsRelations = relations(fileTaskAssociations, ({ one }) => ({
  file: one(papyrusDocuments, { fields: [fileTaskAssociations.fileId], references: [papyrusDocuments.id] }),
  task: one(tasks, { fields: [fileTaskAssociations.taskId], references: [tasks.id] }),
  creator: one(users, { fields: [fileTaskAssociations.createdBy], references: [users.id] }),
}));
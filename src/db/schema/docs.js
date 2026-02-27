/* src/db/schema/docs.js 
   desc: DNA do Conhecimento (Papyrus) e Nexus Visual (Mindmaps).
   feat: Poda Radical via realmId integrada em todas as entidades mestre.
*/
import { pgTable, text, jsonb, timestamp, boolean, integer, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { projects, users } from './core.js';

// --- 1. DOCUMENTOS (Papyrus & Uploads) ---
export const papyrusDocuments = pgTable('papyrus_documents', {
  id: text('id').primaryKey().$defaultFn(() => createId('doc')),
  title: text('title').notNull(),
  
  // [V10] Âncora de Multiverso
  realmId: text('realm_id').notNull().default('personal'), 
  
  type: text('type', { enum: ['text', 'file', 'chat_snapshot', 'code_file'] }).default('text'),
  content: text('content'), 
  fileUrl: text('file_url'),
  
  documentType: text('document_type', { 
    enum: ['note', 'diary', 'agreement', 'manifest', 'guide', 'other', 'code'] 
  }).default('note'), 
  
  energyLevel: integer('energy_level'), 
  mood: text('mood'), 
  tags: text('tags'), 
  insights: text('insights'), 
  
  projectId: text('project_id'),
  authorId: text('author_id'),
  
  status: text('status').default('active'),
  isPrivate: boolean('is_private').default(false),
  
  relatedTasksCount: integer('related_tasks_count').default(0), 
  isLinkedToTask: boolean('is_linked_to_task').default(false), 
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectFk: foreignKey({ columns: [table.projectId], foreignColumns: [projects.id] }).onDelete('cascade'),
  authorFk: foreignKey({ columns: [table.authorId], foreignColumns: [users.id] }).onDelete('set null'),
}));

// --- 2. MIND MAPS (Nexus Visual) ---
export const mindMaps = pgTable('mind_maps', {
  id: text('id').primaryKey().$defaultFn(() => createId('map')),
  title: text('title').notNull(),
  
  // [V10] Âncora de Multiverso
  realmId: text('realm_id').notNull().default('personal'),

  projectId: text('project_id'), 
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectFk: foreignKey({ columns: [table.projectId], foreignColumns: [projects.id] }).onDelete('cascade'),
}));

// --- 3. NÓS E EDGES ---
export const mindMapNodes = pgTable('mind_map_nodes', {
  id: text('id').primaryKey().$defaultFn(() => createId('node')),
  mapId: text('map_id').notNull(), 
  label: text('label').notNull(),
  type: text('type').default('idea'), 
  position: jsonb('position'), 
  style: jsonb('style'), 
  referenceId: text('reference_id'), 
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  mapFk: foreignKey({ columns: [table.mapId], foreignColumns: [mindMaps.id] }).onDelete('cascade'),
}));

export const mindMapEdges = pgTable('mind_map_edges', {
  id: text('id').primaryKey().$defaultFn(() => createId('edge')),
  mapId: text('map_id').notNull(),
  sourceId: text('source_id').notNull(),
  targetId: text('target_id').notNull(),
  type: text('type').default('smoothstep'),
  animated: boolean('animated').default(true),
  label: text('label'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  mapFk: foreignKey({ columns: [table.mapId], foreignColumns: [mindMaps.id] }).onDelete('cascade'),
  sourceFk: foreignKey({ columns: [table.sourceId], foreignColumns: [mindMapNodes.id] }).onDelete('cascade'),
  targetFk: foreignKey({ columns: [table.targetId], foreignColumns: [mindMapNodes.id] }).onDelete('cascade'),
}));

// --- RELAÇÕES (Relations) ---
export const papyrusRelations = relations(papyrusDocuments, ({ one, many }) => ({
  project: one(projects, { fields: [papyrusDocuments.projectId], references: [projects.id] }),
  author: one(users, { fields: [papyrusDocuments.authorId], references: [users.id] }),
}));

export const mindMapsRelations = relations(mindMaps, ({ one, many }) => ({
  project: one(projects, { fields: [mindMaps.projectId], references: [projects.id] }),
  nodes: many(mindMapNodes),
  edges: many(mindMapEdges),
}));

export const mindMapNodesRelations = relations(mindMapNodes, ({ one }) => ({
  map: one(mindMaps, { fields: [mindMapNodes.mapId], references: [mindMaps.id] }),
}));

export const mindMapEdgesRelations = relations(mindMapEdges, ({ one }) => ({
  map: one(mindMaps, { fields: [mindMapEdges.mapId], references: [mindMaps.id] }),
}));
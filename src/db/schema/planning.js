/* src/db/schema/planning.js
   desc: Módulo Mestre de Planejamento, Execução e Data Engine (V10).
   feat: Unificação Total Sankalpa+Goal, Poda Radical (Realms), Rotinas, Time Tracking e Co-responsabilidade de Agentes.
   status: 100% INTEGRAL - AUDITADO E CORRIGIDO.
*/

import { pgTable, text, boolean, jsonb, timestamp, date, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

// Importações de Chaves Estrangeiras (CORE & DOCS)
import { users, teams, projects, tags, templates } from './core.js';
import { papyrusDocuments } from './docs.js';

// =========================================================
// 1. TAREFAS (O NÚCLEO DA EXECUÇÃO)
// =========================================================
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => createId('task')),
  
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['todo', 'in_progress', 'done', 'waiting', 'archived', 'inbox'] }).default('todo').notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  isDone: boolean('is_done').default(false), 
  
  // [V10] Contexto de Consciência (Poda Radical)
  realmId: text('realm_id').notNull().default('personal'),

  // Estrutura e Hierarquia
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'), 
  
  // 👉 Atribuição Humana (Quem lidera/aprova)
  ownerId: text('owner_id').references(() => users.id),
  
  // 🤖 [NOVO - V10] A LÓGICA DE CO-RESPONSABILIDADE (Quem executa/assiste)
  agentAssignee: text('agent_assignee'), // Ex: 'flor', 'neo', 'olly', 'ash'

  teamId: text('team_id').references(() => teams.id),
  templateId: text('template_id').references(() => templates.id),

  // Planejamento & Esforço
  order: integer('order').default(0),
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  energyLevel: text('energy_level'), // 'high', 'medium', 'low'
  estimatedTime: integer('estimated_time'), // em minutos
  estimatedHours: integer('estimated_hours'), 

  // Dados Ricos (V8 + V10)
  checklist: jsonb('checklist'), 
  tagsPreview: jsonb('tags_preview'), 
  energyTags: jsonb('energy_tags'),
  energyImpact: text('energy_impact').default('neutro'),
  recurrence: jsonb('recurrence'),
  chainConnections: jsonb('chain_connections'),
  customData: jsonb('custom_data'),
  plannerSlot: jsonb('planner_slot'), 
  
  // Data Engine & Asset Linking
  relatedRecordId: text('related_record_id'), // Referência à tabela project_records
  automationOriginId: text('automation_origin_id'),
  relatedFilesCount: integer('related_files_count').default(0),
  fileId: text('file_id').references(() => papyrusDocuments.id, { onDelete: 'set null' }), 
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// =========================================================
// 2. PROJECT RECORDS (O Motor das Planilhas Dinâmicas)
// =========================================================
export const projectRecords = pgTable('project_records', {
  id: text('id').primaryKey().$defaultFn(() => createId('rec')),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  realmId: text('realm_id').notNull().default('personal'),
  
  title: text('title').notNull(), 
  
  // [V10] JSONB para Colunas Dinâmicas (Onde vivem os dados das planilhas)
  properties: jsonb('properties').default({}), 
  
  type: text('type').default('default'), 
  order: integer('order').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// =========================================================
// 3. SANKALPAS (A INTENÇÃO + FUSÃO DE GOALS)
// =========================================================
export const sankalpas = pgTable('sankalpas', {
  id: text('id').primaryKey().$defaultFn(() => createId('sank')),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  teamId: text('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  realmId: text('realm_id').notNull().default('personal'),

  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['ativo', 'concluido', 'abandonado'] }).default('ativo'),
  
  // [V10] Fusão de Metas (Goals)
  metric: text('metric').default('%'), 
  targetValue: text('target_value'),
  currentValue: text('current_value').default('0'),
  deadline: timestamp('deadline'),
  isCompleted: boolean('is_completed').default(false),
  
  year: text('year'),
  quarter: text('quarter'),
  pillars: jsonb('pillars'), 
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// =========================================================
// 4. EVENTS (ÂNCORAS TEMPORAIS)
// =========================================================
export const events = pgTable('events', {
  id: text('id').primaryKey().$defaultFn(() => createId('evt')),

  // [V10] Identidade Interna (Prana é a fonte da verdade)
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  realmId: text('realm_id').notNull().default('personal'),

  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),

  // ------------------------------------------------------------------
  // [Legacy Compat] (Calendar API atual ainda usa email + date)
  // ------------------------------------------------------------------
  createdBy: text('created_by'),              // email
  date: date('date'),                        // YYYY-MM-DD (uso legacy)

  // ------------------------------------------------------------------
  // [V10] Tempo Real (Ash/ContextEngine)
  // Durante migração, pode estar null para eventos legacy.
  // ------------------------------------------------------------------
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  isAllDay: boolean('is_all_day').default(false),

  // ------------------------------------------------------------------
  // [Sync] Conectores externos (ex.: Google Calendar)
  // ------------------------------------------------------------------
  externalProvider: text('external_provider'),        // 'google'
  externalCalendarId: text('external_calendar_id'),   // id do calendário no provider
  externalEventId: text('external_event_id'),         // id do evento no provider
  syncStatus: text('sync_status').default('synced'),  // pending|synced|error
  lastSyncedAt: timestamp('last_synced_at'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// =========================================================
// 5. THOUGHTS (SEMENTES E INSIGHTS)
// =========================================================
export const thoughts = pgTable('thoughts', {
  id: text('id').primaryKey().$defaultFn(() => createId('tht')),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  realmId: text('realm_id').notNull().default('personal'),
  
  title: text('title').notNull(),
  content: text('content'),
  status: text('status').default('seed'), // seed, growing, transmuted
  tags: jsonb('tags').default([]),
  
  transmutedToId: text('transmuted_to_id'),
  transmutedToType: text('transmuted_to_type'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// =========================================================
// 6. ROTINAS & SEMANA
// =========================================================
export const routines = pgTable('routines', {
  id: text('id').primaryKey().$defaultFn(() => createId('rtn')),

  // [V10] Identidade Interna (ContextEngine/Ash)
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  realmId: text('realm_id').notNull().default('personal'),

  // [V10] Natureza do Slot
  behavior: text('behavior').notNull().default('habit'), // 'habit' | 'block'

  title: text('title').notNull(),

  // Compat com Calendar API atual (usa "type")
  type: text('type', { enum: ['work', 'wellness', 'admin', 'sport', 'leisure'] }).notNull(),

  // Slot tem horário (geometria semanal)
  startHour: integer('start_hour').notNull(),
  endHour: integer('end_hour').notNull(), // recomendado permitir 24 via validação no app
  days: jsonb('days').notNull().default([]), // [0..6]

  icon: text('icon'),

  // [Legacy Compat] (Calendar routes ainda usam email)
  createdBy: text('created_by'),
  isActive: boolean('is_active').default(true),
  deletedAt: timestamp('deleted_at'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


// =========================================================
// 6.1 ROUTINE FILLS (Ocupações do Slot por Data)
// =========================================================
export const routineFills = pgTable('routine_fills', {
  id: text('id').primaryKey().$defaultFn(() => createId('fill')),

  routineId: text('routine_id').notNull().references(() => routines.id, { onDelete: 'cascade' }),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'cascade' }),

  // 'personal' | 'professional'
  realmId: text('realm_id').notNull().default('personal'),

  // Dia específico que este slot foi preenchido
  date: date('date').notNull(),

  // planned | done | skipped | missed
  status: text('status').notNull().default('planned'),

  // event | task | project | practice | note | empty
  fillType: text('fill_type').notNull().default('empty'),
  fillRefId: text('fill_ref_id'),

  notes: text('notes'),
  meta: jsonb('meta').default({}),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const routineFillsRelations = relations(routineFills, ({ one }) => ({
  routine: one(routines, { fields: [routineFills.routineId], references: [routines.id] }),
  owner: one(users, { fields: [routineFills.ownerId], references: [users.id] }),
}));

export const weeklyTasks = pgTable('weekly_tasks', {
  id: text('id').primaryKey().$defaultFn(() => createId('week')),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  
  content: text('content').notNull(),
  weekStartDate: date('week_start_date').notNull(),
  dayOfWeek: text('day_of_week').notNull(),
  status: text('status', { enum: ['todo', 'done', 'migrated'] }).default('todo'),
  type: text('type', { enum: ['task', 'event', 'note'] }).default('task'),
  timeBlock: text('time_block'), 
  
  createdAt: timestamp('created_at').defaultNow(),
});

// =========================================================
// 7. TIME SESSIONS (DEEP WORK TRACKER)
// =========================================================
export const timeSessions = pgTable('time_sessions', {
  id: text('id').primaryKey().$defaultFn(() => createId('time')),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskId: text('task_id').references(() => tasks.id),
  projectId: text('project_id').references(() => projects.id),
  
  durationSeconds: integer('duration_seconds').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  
  focusRating: integer('focus_rating'), 
  notes: text('notes'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// =========================================================
// 8. SATELLITES
// =========================================================
export const subtasks = pgTable('subtasks', {
  id: text('id').primaryKey().$defaultFn(() => createId('sub')),
  name: text('name').notNull(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  status: text('status').default('pendente'),
  isDone: boolean('is_done').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const checklists = pgTable('checklists', {
  id: text('id').primaryKey().$defaultFn(() => createId('chk')),
  title: text('title').notNull(),
  isDone: boolean('is_done').default(false),
  realmId: text('realm_id').default('personal'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const taskTags = pgTable('task_tags', {
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.taskId, t.tagId] }),
}));

// =========================================================
// 9. RELAÇÕES (O SISTEMA NERVOSO SINTONIZADO)
// =========================================================

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  owner: one(users, { fields: [tasks.ownerId], references: [users.id] }),
  team: one(teams, { fields: [tasks.teamId], references: [teams.id] }),
  template: one(templates, { fields: [tasks.templateId], references: [templates.id] }),
  parent: one(tasks, { fields: [tasks.parentId], references: [tasks.id], relationName: 'childTasks' }),
  childTasks: many(tasks, { relationName: 'childTasks' }),
  subtasks: many(subtasks),
  tags: many(taskTags),
  weeklyRefs: many(weeklyTasks),
  timeSessions: many(timeSessions),
  // Link correto para o Data Engine
  relatedRecord: one(projectRecords, { 
    fields: [tasks.relatedRecordId], 
    references: [projectRecords.id] 
  }),
}));

export const projectRecordsRelations = relations(projectRecords, ({ one, many }) => ({
  project: one(projects, { fields: [projectRecords.projectId], references: [projects.id] }),
  linkedTasks: many(tasks), // Uma linha da planilha pode ter várias tasks vinculadas
}));

export const sankalpasRelations = relations(sankalpas, ({ one }) => ({
  user: one(users, { fields: [sankalpas.userId], references: [users.id] }),
  project: one(projects, { fields: [sankalpas.projectId], references: [projects.id] }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  project: one(projects, { fields: [events.projectId], references: [projects.id] }),
  owner: one(users, { fields: [events.ownerId], references: [users.id] }),
}));

export const thoughtsRelations = relations(thoughts, ({ one }) => ({
  owner: one(users, { fields: [thoughts.ownerId], references: [users.id] }),
}));

export const routinesRelations = relations(routines, ({ one }) => ({
  user: one(users, { fields: [routines.userId], references: [users.id] }),
}));

export const weeklyTasksRelations = relations(weeklyTasks, ({ one }) => ({
  user: one(users, { fields: [weeklyTasks.userId], references: [users.id] }),
  task: one(tasks, { fields: [weeklyTasks.taskId], references: [tasks.id] }),
}));

export const timeSessionsRelations = relations(timeSessions, ({ one }) => ({
  user: one(users, { fields: [timeSessions.userId], references: [users.id] }),
  task: one(tasks, { fields: [timeSessions.taskId], references: [tasks.id] }),
  project: one(projects, { fields: [timeSessions.projectId], references: [projects.id] }),
}));
/* src/db/schema/core.js
   desc: Schema Core V9 (Postgres). 
   updates: Limpeza de Tasks (movidas para planning.js) para corrigir conflito de exports.
*/
import { pgTable, text, integer, boolean, jsonb, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js'; // Ajuste o caminho do createId se necessário


// === TAGS (O Cérebro das Etiquetas) ===
export const tags = pgTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  color: text('color').default('#94a3b8'),
  icon: text('icon'),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// === TEMPLATES ===
export const templates = pgTable('templates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), 
  structure: jsonb('structure').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === PLANOS (Fonte da Verdade) ===
export const plans = pgTable('plans', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  key: text('key').unique().notNull(), // SEED, FLUX, FOREST, MOUNTAIN
  name: text('name').notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  
  // [V10] Isolamento por Realm
  realmId: text('realm_id').notNull().default('personal'),
  
  monthlyPrice: integer('monthly_price').default(0),
  yearlyPrice: integer('yearly_price').default(0),
  isOneTime: boolean('is_one_time').default(false),
  limits: jsonb('limits').notNull(),
  features: jsonb('features').notNull(),
  identity: jsonb('identity').notNull(),
  cta: text('cta'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === USUÁRIOS ===
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password_hash: text('password_hash'),
  avatarUrl: text('avatar_url'),
  credits: integer('credits').default(100),
  
  // [V10] Isolamento por Realm (pessoal | profissional)
  realmId: text('realm_id').notNull().default('personal'),
  
  // Vinculação com Planos
  planType: text('plan_type').references(() => plans.key).default('SEED').notNull(), 
  subscriptionId: text('subscription_id'),
  planExpiresAt: timestamp('plan_expires_at'),
  
  role: text('role', { enum: ['admin', 'user'] }).default('user').notNull(),
  aiSettings: jsonb('ai_settings').default({}), 
  dashboardPreferences: jsonb('dashboard_preferences').default({
    sankalpa: true, projects: true, tasks: true, velocity: true,
    astral: true, rituals: true, energy: true, mood: true,
    tags: true, ash: true, menstrualCycle: true
  }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === TIMES ===
export const teams = pgTable('teams', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  ownerId: text('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['admin', 'editor', 'viewer'] }).default('editor'),
  energyStatus: integer('energy_status').default(100),
  workLoad: integer('work_load').default(0),
  status: text('status').default('offline'),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const teamInvites = pgTable('team_invites', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  teamId: text('team_id').notNull().references(() => teams.id),
  email: text('email').notNull(),
  role: text('role').default('editor'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// === DEPARTAMENTOS (Unidade arquitetural instalável) ===
// Departamento = Interface + Agente(s) + Fields + Sistemas acopláveis + Templates
// Ex: dev, narrative
export const departments = pgTable('departments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  // chave estável (ex: 'dev', 'narrative')
  key: text('key').notNull().unique(),

  name: text('name').notNull(),
  description: text('description'),

  // Isolamento por Realm (pessoal | profissional)
  realmId: text('realm_id').notNull().default('personal'),

  // configuração leve (defaults, flags, etc.)
  config: jsonb('config').default({}),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Instalação/contrato do Departamento por usuário
export const userDepartments = pgTable('user_departments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),

  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  departmentId: text('department_id').notNull().references(() => departments.id, { onDelete: 'cascade' }),

  status: text('status', { enum: ['installed', 'paused', 'removed'] }).notNull().default('installed'),
  config: jsonb('config').default({}),

  installedAt: timestamp('installed_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  userDepartmentUnique: uniqueIndex('user_departments_user_department_unique').on(t.userId, t.departmentId),
}));

// === PROJETOS ===
export const projects = pgTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description'),
  parentId: text('parent_id'), 
  ownerId: text('owner_id').references(() => users.id),
  teamId: text('team_id').references(() => teams.id),
  type: text('type', { enum: ['personal', 'professional'] }).default('personal').notNull(),
  isShared: boolean('is_shared').default(false).notNull(),
  visibility: text('visibility', { enum: ['private', 'shared', 'public'] }).default('private').notNull(),
  status: text('status').default('active').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  color: text('color').default('#3B82F6'),
  icon: text('icon'), 
  settings: jsonb('settings').default({}), 
  templateId: text('template_id').references(() => templates.id),
  customData: jsonb('custom_data'),
  plannerSlot: jsonb('planner_slot'), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
  // Departamento (dev | narrative | ...). Base da modularização.
  departmentId: text('department_id').references(() => departments.id),
});

// === INTEGRAÇÕES ===
export const integrations = pgTable('integrations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), 
  accessToken: text('access_token'), 
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  profileData: jsonb('profile_data').default({}),
  settings: jsonb('settings').default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === PROJECT TEMPLATES ===
export const projectTemplates = pgTable('project_templates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(), 
  description: text('description'), 
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  savedData: jsonb('saved_data').notNull(),
  includedFields: jsonb('included_fields').default({}), 
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === ENTITY ASSOCIATIONS (Polimórfica) ===
export const entityAssociations = pgTable('entity_associations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  sourceId: text('source_id').notNull(), 
  sourceType: text('source_type').notNull(), 
  targetId: text('target_id').notNull(),
  targetType: text('target_type').notNull(),
  relationType: text('relation_type').default('reference'),
  createdAt: timestamp('created_at').defaultNow()
});

// === PROJECT AUTOMATIONS ===
export const projectAutomations = pgTable('project_automations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectId: text('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(), 
  triggerField: text('trigger_field').notNull(), 
  triggerCondition: text('trigger_condition').notNull(), 
  triggerValue: text('trigger_value'), 
  actionType: text('action_type').notNull(),
  actionConfig: jsonb('action_config'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// === RELATIONS (Core Aggregation) ===

export const departmentsRelations = relations(departments, ({ many }) => ({
  userDepartments: many(userDepartments),
  projects: many(projects),
}));

export const userDepartmentsRelations = relations(userDepartments, ({ one }) => ({
  user: one(users, { fields: [userDepartments.userId], references: [users.id] }),
  department: one(departments, { fields: [userDepartments.departmentId], references: [departments.id] }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  plan: one(plans, { fields: [users.planType], references: [plans.key] }),
  teamMemberships: many(teamMembers),
  ownedTeams: many(teams, { relationName: 'owner' }),
  ownedProjects: many(projects, { relationName: 'owner' }),
  // ownedTasks removido aqui para evitar dependência circular - gerenciado pelo planning.js
  projectTemplates: many(projectTemplates),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, { fields: [teams.ownerId], references: [users.id], relationName: 'owner' }),
  members: many(teamMembers),
  projects: many(projects),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  template: one(templates, { fields: [projects.templateId], references: [templates.id] }),
  parent: one(projects, { fields: [projects.parentId], references: [projects.id], relationName: 'subProjects' }),
  subProjects: many(projects, { relationName: 'subProjects' }),
  owner: one(users, { fields: [projects.ownerId], references: [users.id], relationName: 'owner' }),
  team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
  department: one(departments, { fields: [projects.departmentId], references: [departments.id] }),
  // tasks: many(tasks) -> Removido para evitar circularidade. A relação existe no banco.
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  projects: many(projects),
}));

export const projectTemplatesRelations = relations(projectTemplates, ({ one }) => ({
  owner: one(users, { fields: [projectTemplates.userId], references: [users.id] }),
}));

// OBS: 'taskTags' e 'tagsRelations' (referente a tasks) foram movidos para planning.js

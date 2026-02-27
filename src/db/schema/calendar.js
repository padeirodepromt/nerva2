// src/db/schema/calendar.js
// V1: Events & Routines Tables
// Events: one-time calendar events | Routines: recurring time blocks

import { pgTable, text, integer, jsonb, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { users } from './core.js';
import { projects } from './core.js';

// ═══════════════════════════════════════════════════════════════════════════
// TABLE: Events (Calendar)
// ═══════════════════════════════════════════════════════════════════════════

export const calendarEvents = pgTable('calendar_events', {
  // Identity
  id: text('id').primaryKey().$defaultFn(() => createId()),
  createdBy: text('created_by').notNull().references(() => users.id),
  
  // Content
  title: text('title').notNull(),
  description: text('description'),
  date: text('date').notNull(), // YYYY-MM-DD
  
  // Relations
  projectId: text('project_id'),
  
  // Metadata
  createdAt: timestamp('created_at', { precision: 3 }).$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at', { precision: 3 }).$defaultFn(() => new Date()),
  deletedAt: timestamp('deleted_at', { precision: 3 }),
});

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  creator: one(users, { fields: [calendarEvents.createdBy], references: [users.id] }),
  project: one(projects, { fields: [calendarEvents.projectId], references: [projects.id] }),
}));

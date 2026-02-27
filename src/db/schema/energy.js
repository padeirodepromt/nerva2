// src/db/schema/energy.js
// V3: Triple Check-in System (Morning + Afternoon + Evening States)
// Energy Types: 9 | Emotional States: 10 | Intensity: 1-5

import { pgTable, text, integer, jsonb, timestamp, foreignKey, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { users } from './core.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS: Energy Types & Emotional States
// ═══════════════════════════════════════════════════════════════════════════

export const ENERGY_TYPES = [
  'foco_profundo',      // Deep work, high concentration
  'criativo',           // Ideation, brainstorm
  'administrativo',     // Routine, maintenance
  'estrategico',        // Planning, decision-making
  'colaborativo',       // Team work, pair programming
  'social',             // Networking, community
  'restaurador',        // Active rest, yoga, meditation
  'introspectivo',      // Journaling, personal reflection
  'fisico'              // Exercise, movement
];

export const EMOTIONAL_STATES = [
  'alegre',             // Light, positive, carefree
  'confiante',          // Secure, powerful, assertive
  'entusiasmado',       // Energized, motivated, excited
  'esperancoso',        // Optimistic, forward-looking
  'grato',              // Appreciative, warm-hearted
  'calmo',              // Serene, present, tranquil
  'vulneravel',         // Open, fragile, exposed
  'ansioso',            // Apprehensive, worried (mental)
  'estressado',         // Tense, pressured (physical)
  'triste'              // Withdrawn, restorative sadness
];

// ═══════════════════════════════════════════════════════════════════════════
// TABLE: Energy Check-ins (Morning + Afternoon)
// ═══════════════════════════════════════════════════════════════════════════

export const energyCheckIns = pgTable('energy_checkins', {
  id: text('id').primaryKey().$defaultFn(() => createId('nrg')),
  userId: text('user_id').notNull(),
  
  // TIMING: morning or afternoon
  timeOfDay: text('time_of_day').notNull(), // 'morning' | 'afternoon'
  
  // PRIMARY ENERGY TYPE
  energyType: text('energy_type').notNull(), // One of ENERGY_TYPES
  energyIntensity: integer('energy_intensity').notNull(), // 1-5 scale
  
  // SECONDARY ENERGY (optional, mainly for morning transitions)
  secondaryType: text('secondary_type'),     // Another energy type if changed
  secondaryTime: timestamp('secondary_time'), // When did it change?
  secondaryIntensity: integer('secondary_intensity'), // 1-5
  
  // RECORDING TIMING
  recordedAt: timestamp('recorded_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'energy_checkins_user_id_fk'
  }).onDelete('cascade')
}));

// Perfil Astral
export const astralProfiles = pgTable('astral_profiles', {
  id: text('id').primaryKey().$defaultFn(() => createId('ast')),
  userId: text('user_id').unique(),
  sunSign: text('sun_sign'),
  moonSign: text('moon_sign'),
  risingSign: text('rising_sign'),
  birthDate: timestamp('birth_date'),
  birthTime: text('birth_time'),
  birthPlace: text('birth_place'),
  chartData: jsonb('chart_data'), // Dados complexos do mapa
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'astral_profiles_user_id_fk'
  }).onDelete('cascade')
}));

// ═══════════════════════════════════════════════════════════════════════════
// TABLE: Diary Entries (Evening reflection with emotional states)
// ═══════════════════════════════════════════════════════════════════════════

export const diaryEntries = pgTable('diary_entries', {
  id: text('id').primaryKey().$defaultFn(() => createId('dia')),
  userId: text('user_id').notNull(),
  
  // CONTENT: Rich text entry
  content: text('content').notNull(),
  
  // EMOTIONAL STATES (up to 3)
  emotionalStates: jsonb('emotional_states'), // Array<string> - max 3 from EMOTIONAL_STATES
  
  // LINKS TO ENERGY CHECK-INS
  linkedMorningEnergyId: text('linked_morning_energy_id'), // Reference to morning check-in
  linkedAfternoonEnergyId: text('linked_afternoon_energy_id'), // Reference to afternoon check-in
  
  // ENTRY DATE (user's local date, not UTC)
  entryDate: timestamp('entry_date').notNull(),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'diary_entries_user_id_fk'
  }).onDelete('cascade'),
  morningEnergyFk: foreignKey({
    columns: [table.linkedMorningEnergyId],
    foreignColumns: [energyCheckIns.id],
    name: 'diary_entries_morning_energy_fk'
  }).onDelete('set null'),
  afternoonEnergyFk: foreignKey({
    columns: [table.linkedAfternoonEnergyId],
    foreignColumns: [energyCheckIns.id],
    name: 'diary_entries_afternoon_energy_fk'
  }).onDelete('set null')
}));

// ═══════════════════════════════════════════════════════════════════════════
// TABLE: Rituals (Detected patterns of energy + states)
// ═══════════════════════════════════════════════════════════════════════════

export const rituals = pgTable('rituals', {
  id: text('id').primaryKey().$defaultFn(() => createId('rit')),
  userId: text('user_id').notNull(),
  
  // RITUAL IDENTIFICATION
  name: text('name').notNull(), // e.g., "SEGUNDA PRODUTIVA"
  description: text('description'),
  
  // SEQUENCE: Morning + Afternoon + Evening pattern
  morningEnergy: jsonb('morning_energy'), // { type, intensity }
  afternoonEnergy: jsonb('afternoon_energy'), // { type, intensity }
  eveningStates: jsonb('evening_states'), // Array<string> - emotional states
  
  // TIMING
  dayOfWeek: text('day_of_week'), // 'monday', 'tuesday'... or null for any day
  
  // EFFECTIVENESS METRICS
  detectionScore: integer('detection_score'), // 0-100: confidence of pattern
  efficiencyScore: integer('efficiency_score'), // 0-100: task completion rate
  completionRate: integer('completion_rate'), // % of days ritual was followed
  
  // ACTIVATION
  isActive: boolean('is_active').default(true),
  autoReminder: boolean('auto_reminder').default(false),
  reminderTime: text('reminder_time'), // e.g., "06:00" for morning reminder
  
  // DETECTION INFO
  occurrences: integer('occurrences').default(1), // How many times detected?
  lastActivatedAt: timestamp('last_activated_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'rituals_user_id_fk'
  }).onDelete('cascade')
}));

// Ciclo Menstrual (Rastreamento)
export const menstrualCycles = pgTable('menstrual_cycles', {
  id: text('id').primaryKey().$defaultFn(() => createId('mcs')),
  userId: text('user_id').notNull(),
  startDate: timestamp('start_date').notNull(), // Início do ciclo
  notes: text('notes'), // Notas opcionais
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userFk: foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'menstrual_cycles_user_id_fk'
  }).onDelete('cascade')
}));

// ═══════════════════════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const energyCheckInsRelations = relations(energyCheckIns, ({ one, many }) => ({
  user: one(users, { fields: [energyCheckIns.userId], references: [users.id] }),
  diaryEntriesMorning: many(diaryEntries, { relationName: 'morningEnergy' }),
  diaryEntriesAfternoon: many(diaryEntries, { relationName: 'afternoonEnergy' })
}));

export const diaryEntriesRelations = relations(diaryEntries, ({ one }) => ({
  user: one(users, { fields: [diaryEntries.userId], references: [users.id] }),
  morningEnergy: one(energyCheckIns, {
    fields: [diaryEntries.linkedMorningEnergyId],
    references: [energyCheckIns.id],
    relationName: 'morningEnergy'
  }),
  afternoonEnergy: one(energyCheckIns, {
    fields: [diaryEntries.linkedAfternoonEnergyId],
    references: [energyCheckIns.id],
    relationName: 'afternoonEnergy'
  })
}));

export const ritualsRelations = relations(rituals, ({ one }) => ({
  user: one(users, { fields: [rituals.userId], references: [users.id] })
}));

export const astralProfilesRelations = relations(astralProfiles, ({ one }) => ({
  user: one(users, { fields: [astralProfiles.userId], references: [users.id] }),
}));

export const menstrualCyclesRelations = relations(menstrualCycles, ({ one }) => ({
  user: one(users, { fields: [menstrualCycles.userId], references: [users.id] }),
}));
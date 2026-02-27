/* src/db/schema/inventory.js
   desc: Inventário de Features do usuário (packs, unlocks, flags).
*/

import { pgTable, text, timestamp, boolean, varchar, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { users } from './core.js';

export const userFeatures = pgTable('user_features', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId('feat')),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // ex: 'PACK_HARD_CODE', 'PACK_SOCRATIC', 'CONTEXT_SEPARATION'
  featureKey: varchar('feature_key', { length: 80 }).notNull(),

  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.featureKey), // Impede duplicatas
}));

export const userFeaturesRelations = relations(userFeatures, ({ one }) => ({
  user: one(users, { fields: [userFeatures.userId], references: [users.id] }),
}));

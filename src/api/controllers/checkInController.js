import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { createId } from '../../utils/id.js';
import { desc, and, eq } from 'drizzle-orm';

export const checkInController = {
  async getCheckIns(req, res) {
    try {
      const checks = await db.select().from(schema.energyCheckIns).orderBy(desc(schema.energyCheckIns.createdAt));
      res.json(checks);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // Alias
  async list(req, res) { return this.getCheckIns(req, res); },

  async createCheckIn(req, res) {
    try {
      const { userId, energyLevel, mood, tags , realmId } = req.body;
      const newItem = {
        id: createId('nrg'),
        userId,
        energyLevel: parseInt(energyLevel),
        mood,
        tags: tags || [],
        createdAt: new Date()
      };
      await db.insert(schema.energyCheckIns).values(newItem);
      res.status(201).json(newItem);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // Alias
  async create(req, res) { return this.createCheckIn(req, res); }
};
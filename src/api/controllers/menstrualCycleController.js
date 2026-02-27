import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { createId } from '../../utils/id.js';
import { desc, eq } from 'drizzle-orm';

export const menstrualCycleController = {
  // List all cycles for a user
  async list(req, res) {
    try {
      const { userId , realmId } = req.query;
      if (!userId) return res.status(400).json({ error: 'userId required' });
      
      const cycles = await db
        .select()
        .from(schema.menstrualCycles)
        .where(and(eq(schema.menstrualCycles.userId, userId), realmId && realmId !== 'all' ? eq(schema.menstrualCycles.realmId, realmId) : undefined))
        .orderBy(desc(schema.menstrualCycles.startDate));
      
      res.json(cycles);
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  },

  // Get latest cycle for a user (most recent start_date)
  async getLatest(req, res) {
    try {
      const { userId , realmId } = req.query;
      if (!userId) return res.status(400).json({ error: 'userId required' });
      
      const [latestCycle] = await db
        .select()
        .from(schema.menstrualCycles)
        .where(and(eq(schema.menstrualCycles.userId, userId), realmId && realmId !== 'all' ? eq(schema.menstrualCycles.realmId, realmId) : undefined))
        .orderBy(desc(schema.menstrualCycles.startDate))
        .limit(1);
      
      res.json(latestCycle || null);
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  },

  // Create a new cycle entry
  async create(req, res) {
    try {
      const { userId, startDate, notes , realmId } = req.body;
      if (!userId || !startDate) {
        return res.status(400).json({ error: 'userId and startDate required' });
      }
      
      const newCycle = {
        id: createId('mcs'),
        userId,
        startDate: new Date(startDate),
        notes: notes || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.insert(schema.menstrualCycles).values(newCycle);
      res.status(201).json(newCycle);
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  },

  // Update a cycle entry
  async update(req, res) {
    try {
      const { id , realmId } = req.params;
      const { startDate, notes } = req.body;
      
      const updateData = {
        updatedAt: new Date()
      };
      
      if (startDate) updateData.startDate = new Date(startDate);
      if (notes !== undefined) updateData.notes = notes;
      
      const result = await db
        .update(schema.menstrualCycles)
        .set(updateData)
        .where(and(eq(schema.menstrualCycles.id, id), realmId && realmId !== 'all' ? eq(schema.menstrualCycles.realmId, realmId) : undefined))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Cycle not found' });
      }
      
      res.json(result[0]);
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  },

  // Delete a cycle entry
  async delete(req, res) {
    try {
      const { id , realmId } = req.params;
      
      const result = await db
        .delete(schema.menstrualCycles)
        .where(and(eq(schema.menstrualCycles.id, id), realmId && realmId !== 'all' ? eq(schema.menstrualCycles.realmId, realmId) : undefined))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Cycle not found' });
      }
      
      res.json({ success: true, deleted: result[0] });
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  }
};

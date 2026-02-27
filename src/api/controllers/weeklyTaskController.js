/* src/api/controllers/weeklyTaskController.js
   desc: Controlador de Tarefas Semanais (Planner V4). Padronizado.
*/
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const weeklyTaskController = {
  // Lista itens (pode filtrar por userId e data)
  async list(req, res) {
    try {
      const { userId, weekStartDate , realmId } = req.query;
      
      let query = db.select().from(schema.weeklyTasks);
      
      if (userId) {
        // Se houver filtro de data, aplica
        if (weekStartDate) {
            query = query.where(and(
                eq(schema.weeklyTasks.userId, userId),
                eq(schema.weeklyTasks.weekStartDate, weekStartDate)
            ));
        } else {
            query = query.where(and(eq(schema.weeklyTasks.userId, userId), realmId && realmId !== 'all' ? eq(schema.weeklyTasks.realmId, realmId) : undefined));
        }
      }
      
      const items = await query.orderBy(desc(schema.weeklyTasks.createdAt));
      res.json(items);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const newItem = { 
        id: createId('week'), 
        ...req.body, 
        createdAt: new Date() 
      };
      await db.insert(schema.weeklyTasks).values(newItem);
      res.status(201).json(newItem);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const { id , realmId } = req.params;
      const [updated] = await db.update(schema.weeklyTasks)
        .set(req.body)
        .where(and(eq(schema.weeklyTasks.id, id), realmId && realmId !== 'all' ? eq(schema.weeklyTasks.realmId, realmId) : undefined))
        .returning();
      
      if (!updated) return res.status(404).json({ error: "Item não encontrado" });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await db.delete(schema.weeklyTasks).where(and(eq(schema.weeklyTasks.id, req.params.id), realmId && realmId !== 'all' ? eq(schema.weeklyTasks.realmId, realmId) : undefined));
      res.json({ message: 'Item removido' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
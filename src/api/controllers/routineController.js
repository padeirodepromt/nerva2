/* src/api/controllers/routineController.js
   desc: Controlador de Ciclos V10 (Neural OS).
   feat: Suporte a Persistência de Realms, Comportamento (Habit/Block) e Biorritmo.
*/
import { db } from '../../db/index.js';
import { routines } from '../../db/schema/planning.js'; 
import { eq, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const routineController = {
  // 1. LISTAGEM (Pode receber realmId via query se o backend quiser otimizar a poda)
  async list(req, res) {
    try {
      const { realmId } = req.query;
      
      let query = db.select().from(routines);
      
      // Se o backend quiser ajudar na poda radical, filtramos aqui
      if (realmId && realmId !== 'all') {
        query = query.where(eq(routines.realmId, realmId));
      }

      const all = await query.orderBy(routines.startHour);
      res.json(all);
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  },

  // 2. CRIAÇÃO (Manifestação de DNA V10)
  async create(req, res) {
    try {
      const id = createId('rtn');
      const data = { 
        ...req.body, 
        id, 
        // Garante valores default caso venham nulos da UI
        realmId: req.body.realmId || 'personal',
        behavior: req.body.behavior || 'habit',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(routines).values(data);
      res.json(data);
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  },

  // 3. ATUALIZAÇÃO (Necessário para o RoutineManagerModal)
  async update(req, res) {
    try {
      const { id , realmId } = req.params;
      const data = { 
        ...req.body, 
        updatedAt: new Date() 
      };

      // Remove IDs e metadados que não devem ser alterados via update
      delete data.id;
      delete data.createdAt;

      await db.update(routines)
        .set(data)
        .where(and(eq(routines.id, id), realmId && realmId !== 'all' ? eq(routines.realmId, realmId) : undefined));

      res.json({ success: true, id });
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  },
  
  // 4. DELEÇÃO (Remoção de Ciclo)
  async delete(req, res) {
    try {
      const { id , realmId } = req.params;
      await db.delete(routines).where(and(eq(routines.id, id), realmId && realmId !== 'all' ? eq(routines.realmId, realmId) : undefined));
      res.json({ success: true });
    } catch (e) { 
      res.status(500).json({ error: e.message }); 
    }
  }
};
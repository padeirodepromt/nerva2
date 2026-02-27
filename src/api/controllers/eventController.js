/* backend/controllers/eventController.js
   desc: Gestor de Âncoras Temporais (Eventos) V10.
   feat: Aplicação estrita de Poda Radical por RealmId.
   feat: Integração com o motor de planejamento do Arquiteto.
*/
import { db } from '../../db/index.js';
import { events } from '../../db/schema/planning.js';
import { eq, and, desc, asc, gt } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const eventController = {
  
  // 1. LISTAR (O Coração da Poda Radical)
  list: async (req, res) => {
    const { realmId } = req.query; // 'personal', 'professional' ou 'all'
    const userId = req.user.id; // Assumindo auth middleware

    try {
      const filters = [eq(events.ownerId, userId)];
      
      // Regra de Ouro V10: Nunca vazar dados entre Realms
      if (realmId && realmId !== 'all') {
        filters.push(eq(events.realmId, realmId));
      }

      const results = await db.select()
        .from(events)
        .where(and(...filters))
        .orderBy(asc(events.startTime));

      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Erro ao acessar o tecido temporal." });
    }
  },

  // 2. CRIAR ÂNCORA
  create: async (req, res) => {
    const userId = req.user.id;
    const { title, description, startTime, endTime, projectId , realmId} = req.body;

    try {
      const newEvent = {
        id: uuidv4(),
        ownerId: userId,
        realmId: realmId || 'personal', // Fallback de segurança
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        projectId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(events).values(newEvent);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ error: "Falha ao manifestar evento no calendário." });
    }
  },

  // 3. ATUALIZAR
  update: async (req, res) => {
    const { id , realmId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    try {
      // Garantimos que o usuário só edita o que é dele
      await db.update(events)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(events.id, id), eq(events.ownerId, userId)));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao refinar âncora temporal." });
    }
  },

  // 4. DELETAR
  delete: async (req, res) => {
    const { id , realmId } = req.params;
    const userId = req.user.id;

    try {
      await db.delete(events)
        .where(and(eq(events.id, id), eq(events.ownerId, userId)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao remover evento do fluxo." });
    }
  }
};
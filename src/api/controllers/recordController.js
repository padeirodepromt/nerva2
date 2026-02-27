/* src/api/controllers/recordController.js */
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
// [NOVO] Importamos o Motor de Automação para verificar regras após mudanças
import { automationService } from '../services/automationService.js';

export const recordController = {
  
  // 1. LISTAR (Usado na SheetView)
  listProjectRecords: async (req, res) => {
    try {
      const { projectId , realmId} = req.params;
      
      const records = await db.query.projectRecords.findMany({
        where: eq(schema.projectRecords.projectId, projectId),
        orderBy: [desc(schema.projectRecords.order)],
        with: {
            // Traz as tarefas filhas para mostrar indicador visual (chip) "Vinculado"
            tasks: true 
        }
      });

      res.json(records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
  },

  // 2. CRIAR (O "Enter" no Modo Dados)
  createRecord: async (req, res) => {
    try {
      const { projectId, title, properties , realmId} = req.body;

      const newId = createId('rec');
      const order = Date.now(); 

      const [newRecord] = await db.insert(schema.projectRecords).values({
        id: newId,
        realmId: realmId || 'personal',
        projectId,
        title: title || '',
        properties: properties || {}, // JSONB flexível
        order: order,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // [AUTOMATION] Verifica se a criação já dispara alguma regra (ex: "Se criado item X, avise Y")
      automationService.checkAndExecute(projectId, newRecord)
        .catch(err => console.error("[Auto] Erro no trigger de criação:", err));

      res.json(newRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  // 3. ATUALIZAR (Edição de Célula na Planilha)
  updateRecord: async (req, res) => {
    try {
      const { id , realmId } = req.params;
      const { title, properties, order } = req.body;

      const updateData = { updatedAt: new Date() };
      if (title !== undefined) updateData.title = title;
      if (properties !== undefined) updateData.properties = properties;
      if (order !== undefined) updateData.order = order;

      // 1. Salva a alteração no Banco
      const [updatedRecord] = await db.update(schema.projectRecords)
        .set(updateData)
        .where(and(eq(schema.projectRecords.id, id), realmId && realmId !== 'all' ? eq(schema.projectRecords.realmId, realmId) : undefined))
        .returning();

      if (updatedRecord) {
        // 2. [GATILHO V8] Dispara o Motor de Automação em background
        // "Fire and Forget": Não esperamos a automação terminar para responder ao usuário (UX rápida)
        automationService.checkAndExecute(updatedRecord.projectId, updatedRecord)
            .catch(err => console.error("[Auto] Erro no trigger de update:", err));
      }

      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. DELETAR
  deleteRecord: async (req, res) => {
    try {
        const { id , realmId } = req.params;
        await db.delete(schema.projectRecords).where(and(eq(schema.projectRecords.id, id), realmId && realmId !== 'all' ? eq(schema.projectRecords.realmId, realmId) : undefined));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
};
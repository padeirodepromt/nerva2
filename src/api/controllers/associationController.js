/* src/api/controllers/associationController.js */
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { createId } from '../../utils/id.js';

export const associationController = {
  // Cria uma tarefa e a vincula imediatamente a um Record
  // Endpoint: POST /api/associations/create-task-from-record
  createTaskFromRecord: async (req, res) => {
    try {
      const { recordId, taskTitle, dueDate, projectId , realmId } = req.body;

      if (!recordId || !taskTitle) {
          return res.status(400).json({ error: 'RecordId e Título são obrigatórios.' });
      }

      // Cria a tarefa já com o relatedRecordId preenchido
      const [newTask] = await db.insert(schema.tasks).values({
          id: createId('task'),
        realmId: realmId || 'personal',
          title: taskTitle,
          projectId: projectId, // Herda do record ou passado explícito
          relatedRecordId: recordId, // O VÍNCULO
          status: 'todo',
          dueDate: dueDate ? new Date(dueDate) : null,
          createdAt: new Date(),
          updatedAt: new Date()
      }).returning();

      res.json({ success: true, task: newTask });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar tarefa vinculada.' });
    }
  },

  // Vincula duas entidades genéricas (ex: Doc -> Task)
  // Endpoint: POST /api/associations/link
  linkEntities: async (req, res) => {
      try {
          const { sourceId, sourceType, targetId, targetType, relationType , realmId } = req.body;
          
          await db.insert(schema.entityAssociations).values({
              id: createId('assoc'),
        realmId: realmId || 'personal',
              sourceId, sourceType,
              targetId, targetType,
              relationType: relationType || 'related',
              createdAt: new Date()
          });

          res.json({ success: true });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  }
};
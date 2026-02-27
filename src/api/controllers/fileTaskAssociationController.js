/* src/api/controllers/fileTaskAssociationController.js
   desc: Controller para gerenciar associações entre Arquivos (Papyrus) e Tarefas.
   operations: Create, Read, Update, Delete associações bidirecionais.
*/

import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and, count } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const fileTaskAssociationController = {
  
  // === CRIAR ASSOCIAÇÃO ===
  async createAssociation(req, res) {
    try {
      const { fileId, taskId, relationship = 'modify', documentType = 'note' , realmId } = req.body;
      const userId = req.user?.id;

      if (!fileId || !taskId) {
        return res.status(400).json({ 
          error: 'fileId e taskId são obrigatórios' 
        });
      }

      // Verificar se ambos existem e o usuário tem acesso
      const [file, task] = await Promise.all([
        db.query.papyrusDocuments.findFirst({ where: eq(schema.papyrusDocuments.id, fileId) }),
        db.query.tasks.findFirst({ where: eq(schema.tasks.id, taskId) }),
      ]);

      if (!file || !task) {
        return res.status(404).json({ error: 'Arquivo ou tarefa não encontrados' });
      }

      // Criar associação
      const associationId = createId('fta');
      const association = {
        id: associationId,
        fileId,
        taskId,
        relationship,
        documentType,
        createdBy: userId,
        createdAt: new Date(),
        isActive: true,
      };

      await db.insert(schema.fileTaskAssociations).values(association);

      // Atualizar contadores (cache)
      await fileTaskAssociationController.updateCounters(fileId, taskId);

      res.status(201).json({
        success: true,
        data: association,
      });
    } catch (error) {
      console.error('Erro ao criar associação:', error);
      res.status(500).json({ error: 'Falha ao criar associação' });
    }
  },

  // === OBTER TAREFAS VINCULADAS A UM ARQUIVO ===
  async getTasksByFile(req, res) {
    try {
      const { fileId , realmId } = req.params;

      const associations = await db
        .select({
          id: schema.fileTaskAssociations.id,
          taskId: schema.fileTaskAssociations.taskId,
          relationship: schema.fileTaskAssociations.relationship,
          createdAt: schema.fileTaskAssociations.createdAt,
          task: {
            id: schema.tasks.id,
            title: schema.tasks.title,
            status: schema.tasks.status,
            priority: schema.tasks.priority,
            ownerId: schema.tasks.ownerId,
            dueDate: schema.tasks.dueDate,
            isDone: schema.tasks.isDone,
          },
        })
        .from(schema.fileTaskAssociations)
        .innerJoin(schema.tasks, eq(schema.fileTaskAssociations.taskId, schema.tasks.id))
        .where(
          and(
            eq(schema.fileTaskAssociations.fileId, fileId),
            eq(schema.fileTaskAssociations.isActive, true)
          )
        );

      res.json({
        success: true,
        data: associations.map(a => ({
          associationId: a.id,
          ...a.task,
          relationship: a.relationship,
          associatedAt: a.createdAt,
        })),
      });
    } catch (error) {
      console.error('Erro ao obter tarefas do arquivo:', error);
      res.status(500).json({ error: 'Falha ao obter tarefas' });
    }
  },

  // === OBTER ARQUIVOS VINCULADOS A UMA TAREFA ===
  async getFilesByTask(req, res) {
    try {
      const { taskId , realmId } = req.params;

      const associations = await db
        .select({
          id: schema.fileTaskAssociations.id,
          fileId: schema.fileTaskAssociations.fileId,
          relationship: schema.fileTaskAssociations.relationship,
          createdAt: schema.fileTaskAssociations.createdAt,
          file: {
            id: schema.papyrusDocuments.id,
            title: schema.papyrusDocuments.title,
            type: schema.papyrusDocuments.type,
            documentType: schema.papyrusDocuments.documentType,
            fileUrl: schema.papyrusDocuments.fileUrl,
            status: schema.papyrusDocuments.status,
            updatedAt: schema.papyrusDocuments.updatedAt,
          },
        })
        .from(schema.fileTaskAssociations)
        .innerJoin(schema.papyrusDocuments, eq(schema.fileTaskAssociations.fileId, schema.papyrusDocuments.id))
        .where(
          and(
            eq(schema.fileTaskAssociations.taskId, taskId),
            eq(schema.fileTaskAssociations.isActive, true)
          )
        );

      res.json({
        success: true,
        data: associations.map(a => ({
          associationId: a.id,
          ...a.file,
          relationship: a.relationship,
          associatedAt: a.createdAt,
        })),
      });
    } catch (error) {
      console.error('Erro ao obter arquivos da tarefa:', error);
      res.status(500).json({ error: 'Falha ao obter arquivos' });
    }
  },

  // === ATUALIZAR TIPO DE RELACIONAMENTO ===
  async updateAssociation(req, res) {
    try {
      const { fileId, taskId , realmId } = req.params;
      const { relationship } = req.body;

      if (!relationship) {
        return res.status(400).json({ error: 'relationship é obrigatório' });
      }

      await db.update(schema.fileTaskAssociations)
        .set({ relationship, updatedAt: new Date() })
        .where(
          and(
            eq(schema.fileTaskAssociations.fileId, fileId),
            eq(schema.fileTaskAssociations.taskId, taskId)
          )
        );

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao atualizar associação:', error);
      res.status(500).json({ error: 'Falha ao atualizar associação' });
    }
  },

  // === REMOVER ASSOCIAÇÃO ===
  async deleteAssociation(req, res) {
    try {
      const { fileId, taskId , realmId } = req.params;

      await db.delete(schema.fileTaskAssociations)
        .where(
          and(
            eq(schema.fileTaskAssociations.fileId, fileId),
            eq(schema.fileTaskAssociations.taskId, taskId)
          )
        );

      // Atualizar contadores
      await fileTaskAssociationController.updateCounters(fileId, taskId);

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar associação:', error);
      res.status(500).json({ error: 'Falha ao deletar associação' });
    }
  },

  // === HELPER: ATUALIZAR CONTADORES ===
  async updateCounters(fileId, taskId) {
    try {
      // Contar tarefas vinculadas ao arquivo
      const fileTaskCount = await db
        .select({ count: count() })
        .from(schema.fileTaskAssociations)
        .where(
          and(
            eq(schema.fileTaskAssociations.fileId, fileId),
            eq(schema.fileTaskAssociations.isActive, true)
          )
        );

      // Contar arquivos vinculados à tarefa
      const taskFileCount = await db
        .select({ count: count() })
        .from(schema.fileTaskAssociations)
        .where(
          and(
            eq(schema.fileTaskAssociations.taskId, taskId),
            eq(schema.fileTaskAssociations.isActive, true)
          )
        );

      // Atualizar cache
      await Promise.all([
        db.update(schema.papyrusDocuments)
          .set({
            relatedTasksCount: fileTaskCount[0]?.count || 0,
            isLinkedToTask: (fileTaskCount[0]?.count || 0) > 0,
          })
          .where(and(eq(schema.papyrusDocuments.id, fileId), realmId && realmId !== 'all' ? eq(schema.papyrusDocuments.realmId, realmId) : undefined)),
        
        db.update(schema.tasks)
          .set({
            relatedFilesCount: taskFileCount[0]?.count || 0,
          })
          .where(and(eq(schema.tasks.id, taskId), realmId && realmId !== 'all' ? eq(schema.tasks.realmId, realmId) : undefined)),
      ]);
    } catch (error) {
      console.error('Erro ao atualizar contadores:', error);
    }
  },

  // === LISTAR ASSOCIAÇÕES (COM FILTROS) ===
  async listAssociations(req, res) {
    try {
      const { fileId, taskId, relationship, limit = 50, offset = 0 , realmId } = req.query;

      const conditions = [eq(schema.fileTaskAssociations.isActive, true)];
      
      if (fileId) conditions.push(eq(schema.fileTaskAssociations.fileId, fileId));
      if (taskId) conditions.push(eq(schema.fileTaskAssociations.taskId, taskId));
      if (relationship) conditions.push(eq(schema.fileTaskAssociations.relationship, relationship));

      const associations = await db
        .select()
        .from(schema.fileTaskAssociations)
        .where(and(...conditions))
        .limit(parseInt(limit))
        .offset(parseInt(offset));

      const totalCount = await db
        .select({ count: count() })
        .from(schema.fileTaskAssociations)
        .where(and(...conditions));

      res.json({
        success: true,
        data: associations,
        pagination: {
          total: totalCount[0]?.count || 0,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      });
    } catch (error) {
      console.error('Erro ao listar associações:', error);
      res.status(500).json({ error: 'Falha ao listar associações' });
    }
  },
};

/* src/api/controllers/taskController.js
   desc: Controlador Mestre de Tarefas Prana (V10).
   feat: 
    - Validação Rigorosa de Esquema.
    - Integração Google Calendar (Sync Ativo).
    - Gestão de Campos Customizados (JSONB).
    - Co-responsabilidade Multi-Agentes (agentAssignee).
    - Suporte a Realms e Projetos.
   status: 100% INTEGRAL - AUDITADO E CONSOLIDADO.
*/

import { db } from '../../db/index.js';
import { tasks } from '../../db/schema/planning.js';
import { eq, desc, and, isNull } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { GoogleCalendarService } from '../../services/googleCalendarService.js';

export const taskController = {
  // =========================================================
  // 1. LISTAGEM (O MOTOR DE BUSCA DO DASHBOARD)
  // =========================================================
  async list(req, res) {
    try {
      const { projectId, realmId, status, agentAssignee, priority } = req.query;
      const ownerId = req.user?.id;

      if (!ownerId) {
        return res.status(401).json({ error: "Usuário não autenticado no Nexus" });
      }

      let query = db.select().from(tasks).orderBy(desc(tasks.createdAt));
      
      // Construção dinâmica de filtros (The Swan Logic)
      const filters = [eq(tasks.ownerId, ownerId)];

      if (projectId) {
        filters.push(eq(tasks.projectId, projectId));
      }

      if (realmId && realmId !== 'all') {
        filters.push(eq(tasks.realmId, realmId));
      }

      if (status) {
        filters.push(eq(tasks.status, status));
      }

      if (priority) {
        filters.push(eq(tasks.priority, priority));
      }

      // [V10] Filtro por Agente Responsável
      if (agentAssignee) {
        filters.push(eq(tasks.agentAssignee, agentAssignee));
      }

      const results = await query.where(and(...filters));
      res.json(results);
    } catch (error) {
      console.error('[TaskController] Erro na listagem:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // =========================================================
  // 2. CRIAÇÃO (COM SINCRONIZAÇÃO E ATRIBUIÇÃO)
  // =========================================================
  async create(req, res) {
    try {
      const { 
        title, description, status, priority, projectId, 
        dueDate, startTime, agentAssignee, realmId,
        estimatedHours, tags, energyTags, energyImpact, 
        checklist, recurrence, templateId, customData, plannerSlot
      } = req.body;

      // -------------------- VALIDAÇÃO DE NEGÓCIO --------------------
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Título é obrigatório para manter a clareza.' });
      }
      
      if (title.length > 255) {
        return res.status(400).json({ error: 'Título excede o limite de 255 caracteres.' });
      }

      const validStatuses = ['todo', 'in_progress', 'done', 'waiting', 'archived', 'inbox'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status operacional inválido.' });
      }

      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Nível de prioridade não reconhecido.' });
      }
      // --------------------------------------------------------------

      const finalOwnerId = req.user?.id;
      if (!finalOwnerId) return res.status(401).json({ error: "Contexto de usuário perdido." });

      const taskId = createId('task');

      const newTaskData = {
        id: taskId,
        ownerId: finalOwnerId,
        realmId: realmId || 'personal',
        agentAssignee: agentAssignee || null, // [V10] Atribuição de Agente
        title,
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        projectId: projectId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? Number(estimatedHours) : null,
        tags: tags || [],
        energyTags: energyTags || [],
        energyImpact: energyImpact || 'neutro',
        checklist: checklist || [],
        recurrence: recurrence || null,
        templateId: templateId || null,
        customData: customData || {},
        plannerSlot: plannerSlot || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 1. Persistência no Postgres
      const [savedTask] = await db.insert(tasks).values(newTaskData).returning();

      // 2. Sincronização Google Calendar (Metáfora do Cisne)
      if (newTaskData.dueDate) {
        try {
          const eventPayload = {
            title: `[Prana] ${newTaskData.title}`,
            description: newTaskData.description || `Gerado pelo Prana V10. Co-piloto: ${agentAssignee || 'Humano'}`,
            startTime: startTime ? new Date(startTime) : newTaskData.dueDate,
            endTime: startTime ? new Date(new Date(startTime).getTime() + 3600000) : newTaskData.dueDate,
            isAllDay: !startTime
          };

          const googleResult = await GoogleCalendarService.createEvent(finalOwnerId, eventPayload);
          
          if (googleResult?.googleId) {
            await db.update(tasks)
              .set({ googleEventId: googleResult.googleId })
              .where(eq(tasks.id, savedTask.id));
            savedTask.googleEventId = googleResult.googleId;
          }
        } catch (syncError) {
          console.warn('⚠️ Falha de sincronização externa. Tarefa mantida localmente.');
        }
      }

      res.status(201).json(savedTask);
    } catch (error) {
      console.error("Erro Crítico Task Create:", error);
      res.status(500).json({ error: "Falha na criação da tarefa no ecossistema." });
    }
  },

  // =========================================================
  // 3. ATUALIZAÇÃO (DINÂMICA E SEGURA)
  // =========================================================
  async update(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user?.id;
      const body = req.body;

      if (!ownerId) return res.status(401).json({ error: "Sessão expirada." });

      const updateData = { ...body, updatedAt: new Date() };
      
      // Normalização de Datas
      if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
      if (body.completedAt) updateData.completedAt = new Date(body.completedAt);
      
      // Proteção de Integridade
      delete updateData.id; 
      delete updateData.ownerId;
      delete updateData.createdAt;

      const [updated] = await db.update(tasks)
        .set(updateData)
        .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
        .returning();

      if(!updated) {
        return res.status(404).json({error: "Tarefa não encontrada ou sem permissão de escrita."});
      }
      
      res.json(updated);
    } catch (error) {
      console.error('[TaskUpdate Error]', error);
      res.status(500).json({ error: "Erro ao atualizar estado da tarefa." });
    }
  },

  // =========================================================
  // 4. HANDOFF (O MOTOR DO SWARM)
  // =========================================================
  async updateAgentAssignee(req, res) {
    try {
      const { id } = req.params;
      const { agentAssignee } = req.body;
      const ownerId = req.user?.id;

      const [updated] = await db.update(tasks)
        .set({ agentAssignee, updatedAt: new Date() })
        .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
        .returning();

      if(!updated) return res.status(404).json({error: "Tarefa inacessível para handoff."});
      
      res.json({ success: true, agent: agentAssignee, task: updated });
    } catch (error) {
      res.status(500).json({ error: "Falha na transmissão de responsabilidade." });
    }
  },

  // =========================================================
  // 5. CAMPOS CUSTOMIZADOS (O MOTOR DE DADOS FLEXÍVEIS)
  // =========================================================
  async setCustomFieldValue(req, res) {
    try {
      const { id: taskId } = req.params;
      const { fieldName, fieldValue, fieldType = 'text' } = req.body;
      const ownerId = req.user?.id;

      const [task] = await db.select().from(tasks).where(and(eq(tasks.id, taskId), eq(tasks.ownerId, ownerId))).limit(1);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });

      // Merge de JSONB seguro
      const currentData = task.customData || {};
      const newCustomData = {
        ...currentData,
        [fieldName]: {
          value: fieldValue,
          type: fieldType,
          updatedAt: new Date().toISOString(),
        }
      };

      const [updated] = await db.update(tasks)
        .set({ customData: newCustomData, updatedAt: new Date() })
        .where(eq(tasks.id, taskId))
        .returning();

      return res.json({ success: true, customData: updated.customData });
    } catch (error) {
      res.status(500).json({ error: "Erro ao gravar metadado customizado." });
    }
  },

  async getCustomFieldValue(req, res) {
    try {
      const { id: taskId } = req.params;
      const { fieldName } = req.query;
      const ownerId = req.user?.id;

      const [task] = await db.select().from(tasks).where(and(eq(tasks.id, taskId), eq(tasks.ownerId, ownerId))).limit(1);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });

      const data = task.customData || {};
      if (fieldName) {
        return res.json({ [fieldName]: data[fieldName] || null });
      }

      return res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao ler metadados." });
    }
  },

  // =========================================================
  // 6. DELEÇÃO (LIMPEZA DO ECOSSISTEMA)
  // =========================================================
  async delete(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user?.id;

      // TODO: Futuramente implementar soft-delete enviando para 'deletedAt'
      const [deleted] = await db.delete(tasks)
        .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
        .returning();

      if (!deleted) return res.status(404).json({ error: "Tarefa não encontrada para exclusão." });

      res.json({ message: "Tarefa removida com sucesso.", id: deleted.id });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar tarefa." });
    }
  }
};
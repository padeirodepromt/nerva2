/* src/api/agents/general/tools/planningTools.js
   desc: Adaptador de Planeamento, Base de Dados e Automação (Swarm V12).
   feat: 
    - Isola a criação/leitura de Projetos, Tarefas, Documentos, Records e Eventos.
    - Suporte a Satélites (Checklists, Subtasks, Thoughts).
    - Suporte à criação de Rotinas (Geometria Semanal).
    - Suporte nativo ao RealmId (V10) e co-responsabilidade de agentes (agentAssignee).
*/

import { db } from '../../../../db/index.js';
import * as schema from '../../../../db/schema.js';
import { eq, and, isNull } from 'drizzle-orm';
import { createId } from '../../../../utils/id.js';

// ============================================================================
// HELPERS INTERNOS DE BASE DE DADOS
// ============================================================================

async function createOrFindProjectsInPath(userId, pathStr, realmId = 'personal') {
  if (!pathStr || pathStr === 'Inbox' || pathStr === 'root') return null;
  const parts = pathStr.split('/').map((s) => s.trim()).filter(Boolean);
  let currentParentId = null;

  for (const part of parts) {
    const existing = await db.query.projects.findFirst({
      where: and(
        eq(schema.projects.ownerId, userId),
        eq(schema.projects.title, part),
        currentParentId ? eq(schema.projects.parentId, currentParentId) : isNull(schema.projects.parentId),
        isNull(schema.projects.deletedAt)
      ),
    });

    if (existing) {
      currentParentId = existing.id;
    } else {
      const newId = createId('proj');
      await db.insert(schema.projects).values({
        id: newId,
        title: part,
        parentId: currentParentId,
        ownerId: userId,
        realmId: realmId,
        status: 'active',
        color: '#3B82F6',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      currentParentId = newId;
    }
  }
  return currentParentId;
}

async function handleTags(taskId, tagList) {
  if (!tagList || !Array.isArray(tagList) || tagList.length === 0) return;
  for (const tagName of tagList) {
    const cleanName = String(tagName).toLowerCase().trim().replace('#', '');
    if (!cleanName) continue;
    let tagId;
    const existingTag = await db.query.tags.findFirst({ where: eq(schema.tags.name, cleanName) });

    if (existingTag) {
      tagId = existingTag.id;
      await db.update(schema.tags).set({ usageCount: (existingTag.usageCount || 0) + 1 }).where(eq(schema.tags.id, tagId));
    } else {
      tagId = createId('tag');
      await db.insert(schema.tags).values({ id: tagId, name: cleanName, color: '#94a3b8', usageCount: 1, createdAt: new Date() });
    }
    try { await db.insert(schema.taskTags).values({ taskId, tagId }); } catch (e) { /* ignora erro de FK dupla */ }
  }
}

// ============================================================================
// 1. MANAGE HIERARCHY (A Ferramenta Universal de Criação)
// ============================================================================
export const manage_hierarchy = {
  declaration: {
    name: 'manage_hierarchy',
    description: 'Cria e organiza itens no sistema do Herói. Suporta Projetos, Tarefas, Documentos, Pensamentos (Thoughts), Listas (Checklists) e Eventos Internos.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        realmId: { type: 'STRING', enum: ['personal', 'professional'] },
        agentKey: { type: 'STRING', description: 'O ID do agente a criar (ex: ash, flor, neo) para o agentAssignee.' },
        itemType: { 
          type: 'STRING', 
          enum: ['task', 'project', 'document', 'thought', 'checklist', 'event', 'mindmap'] 
        },
        title: { type: 'STRING' },
        path: { type: 'STRING', description: "Caminho (ex: 'Prana/Dev'). Vazio = Inbox." },
        properties: {
          type: 'OBJECT',
          properties: {
            description: { type: 'STRING' },
            priority: { type: 'STRING', enum: ['low', 'medium', 'high', 'urgent'] },
            status: { type: 'STRING' },
            tags: { type: 'ARRAY', items: { type: 'STRING' } },
            dueDate: { type: 'STRING', description: 'Data limite (ISO)' },
            content: { type: 'STRING', description: 'Para documentos, thoughts ou mindmaps.' },
            startTime: { type: 'STRING', description: 'Apenas para itemType: event (ISO)' },
            endTime: { type: 'STRING', description: 'Apenas para itemType: event (ISO)' },
            location: { type: 'STRING', description: 'Apenas para itemType: event' },
            estimatedMinutes: { type: 'NUMBER', description: 'Tempo estimado da task' }
          },
        },
      },
      required: ['userId', 'itemType', 'title', 'realmId'],
    },
  },
  handler: async ({ userId, realmId, agentKey, itemType, title, path, properties = {} }) => {
    try {
      const parentId = await createOrFindProjectsInPath(userId, path, realmId);
      const baseData = {
        title,
        description: properties.description,
        realmId: realmId || 'personal',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let createdItem;
      let message = '';
      let targetView = 'DASHBOARD';

      switch (itemType) {
        case 'project':
          createdItem = { ...baseData, id: createId('proj'), ownerId: userId, parentId, status: properties.status || 'active', color: '#3B82F6' };
          await db.insert(schema.projects).values(createdItem);
          message = `Projeto "${title}" criado.`;
          targetView = 'PROJECT_CANVAS';
          break;

        case 'task':
          const newTaskId = createId('task');
          createdItem = { 
            ...baseData, 
            id: newTaskId, 
            ownerId: userId, 
            projectId: parentId, 
            status: properties.status || 'todo', 
            priority: properties.priority || 'medium', 
            dueDate: properties.dueDate ? new Date(properties.dueDate) : null,
            estimatedTime: properties.estimatedMinutes || null,
            agentAssignee: agentKey // [V10] Co-responsabilidade da IA
          };
          await db.insert(schema.tasks).values(createdItem);
          if (properties.tags) await handleTags(newTaskId, properties.tags);
          message = `Tarefa "${title}" criada e atribuída.`;
          break;

        case 'document':
        case 'mindmap':
          createdItem = { 
            ...baseData, 
            id: createId('doc'), 
            content: properties.content || '', 
            projectId: parentId, 
            authorId: userId,
            documentType: itemType === 'mindmap' ? 'mindmap' : 'document' // Usando o docType se existir
          };
          await db.insert(schema.papyrusDocuments).values(createdItem);
          message = itemType === 'mindmap' ? `Mapa Mental "${title}" inicializado.` : `Documento "${title}" criado.`;
          break;

        case 'thought':
          createdItem = {
            ...baseData,
            id: createId('tht'),
            ownerId: userId,
            content: properties.content || '',
            status: 'seed',
            tags: properties.tags || []
          };
          await db.insert(schema.thoughts).values(createdItem);
          message = `Pensamento / Ideia registrada: "${title}".`;
          break;

        case 'checklist':
          createdItem = {
            title,
            id: createId('chk'),
            userId: userId,
            realmId: realmId || 'personal',
            projectId: parentId,
            isDone: false,
            createdAt: new Date()
          };
          await db.insert(schema.checklists).values(createdItem);
          message = `Lista de verificação "${title}" criada.`;
          break;

        case 'event':
          createdItem = {
            ...baseData,
            id: createId('evt'),
            ownerId: userId,
            projectId: parentId,
            location: properties.location,
            startTime: properties.startTime ? new Date(properties.startTime) : null,
            endTime: properties.endTime ? new Date(properties.endTime) : null,
            externalProvider: 'prana_internal'
          };
          await db.insert(schema.events).values(createdItem);
          message = `Evento Interno "${title}" agendado com sucesso.`;
          targetView = 'CALENDAR_MONTHLY';
          break;

        default:
          throw new Error('Tipo de item desconhecido.');
      }

      return {
        success: true,
        message,
        item: createdItem,
        client_action: {
          type: 'CHANGE_VIEW',
          view: targetView,
          projectId: parentId || (itemType === 'project' ? createdItem.id : null),
          data: { highlightIds: [createdItem.id] },
        },
      };
    } catch (error) {
      console.error('Erro no manage_hierarchy:', error);
      return { success: false, error: `Falha ao criar entidade: ${error.message}` };
    }
  },
};

// ============================================================================
// 1.5. CRIAÇÃO DE ROTINAS (Geometria Semanal)
// ============================================================================
export const create_routine = {
  declaration: {
    name: 'create_routine',
    description: 'Cria uma nova Rotina (Bloco de Tempo Recorrente ou Hábito) na agenda semanal do Herói.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        realmId: { type: 'STRING', enum: ['personal', 'professional'] },
        title: { type: 'STRING' },
        behavior: { type: 'STRING', enum: ['habit', 'block'], description: 'Hábito ou Bloco Fixo' },
        type: { type: 'STRING', enum: ['work', 'wellness', 'admin', 'sport', 'leisure'] },
        startHour: { type: 'NUMBER', description: 'Hora de início (0 a 24)' },
        endHour: { type: 'NUMBER', description: 'Hora de fim (0 a 24)' },
        days: { type: 'ARRAY', items: { type: 'NUMBER' }, description: 'Dias da semana [0=Dom, 6=Sab]' },
        icon: { type: 'STRING', description: 'Emoji representativo' }
      },
      required: ['userId', 'realmId', 'title', 'behavior', 'type', 'startHour', 'endHour', 'days'],
    },
  },
  handler: async (args) => {
    try {
      const newRoutine = {
        id: createId('rtn'),
        userId: args.userId,
        realmId: args.realmId || 'personal',
        title: args.title,
        behavior: args.behavior || 'habit',
        type: args.type || 'work',
        startHour: args.startHour,
        endHour: args.endHour,
        days: args.days || [],
        icon: args.icon || '📌',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(schema.routines).values(newRoutine);
      return { 
        success: true, 
        message: `Rotina "${args.title}" criada com sucesso.` 
      };
    } catch (error) {
      return { success: false, error: `Falha ao criar rotina: ${error.message}` };
    }
  }
};

// ============================================================================
// 2. TIME TRACKING & SESSÕES (Deep Work)
// ============================================================================
export const log_time_session = {
  declaration: {
    name: 'log_time_session',
    description: 'Regista uma sessão de tempo (Deep Work / Pomodoro) concluída pelo Herói no banco de dados.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        taskId: { type: 'STRING', description: 'ID da tarefa (opcional)' },
        projectId: { type: 'STRING', description: 'ID do projeto (opcional)' },
        durationMinutes: { type: 'NUMBER' },
        focusRating: { type: 'NUMBER', description: 'De 1 a 5' },
        notes: { type: 'STRING' }
      },
      required: ['userId', 'durationMinutes'],
    },
  },
  handler: async (args) => {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - args.durationMinutes * 60000);
      
      const newSession = {
        id: createId('time'),
        userId: args.userId,
        taskId: args.taskId || null,
        projectId: args.projectId || null,
        durationSeconds: args.durationMinutes * 60,
        startTime,
        endTime,
        focusRating: args.focusRating || null,
        notes: args.notes || null,
        createdAt: new Date()
      };
      
      await db.insert(schema.timeSessions).values(newSession);
      return { success: true, message: `Sessão de ${args.durationMinutes} minutos registada com sucesso.` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// 3. DATA ENGINE (Planilhas e Records)
// ============================================================================
export const create_record = {
  declaration: {
    name: 'create_record',
    description: 'Adiciona um dado estático (Record) na planilha de dados de um projeto. Ex: CRM, Financeiro.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_id: { type: 'STRING' },
        title: { type: 'STRING' },
        properties: { type: 'OBJECT', description: "JSON dinâmico das colunas da planilha." },
      },
      required: ['project_id', 'title'],
    },
  },
  handler: async ({ project_id, title, properties }) => {
    try {
      const newId = createId('rec');
      const propsData = typeof properties === 'string' ? JSON.parse(properties) : properties || {};
      const project = await db.query.projects.findFirst({ where: eq(schema.projects.id, project_id) });

      await db.insert(schema.projectRecords).values({
        id: newId, projectId: project_id, realmId: project?.realmId || 'personal',
        title, properties: propsData, order: Date.now(),
        createdAt: new Date(), updatedAt: new Date(),
      });

      return { success: true, message: `Registro '${title}' adicionado à planilha.` };
    } catch (error) { return { success: false, error: error.message }; }
  },
};

export const query_project_database = {
  declaration: {
    name: 'query_project_database',
    description: 'Consulta a base de dados (Planilha/Records) de um projeto.',
    parameters: {
      type: 'OBJECT',
      properties: { project_id: { type: 'STRING' }, realmId: { type: 'STRING' }, search_term: { type: 'STRING' } },
      required: ['project_id', 'realmId'],
    },
  },
  handler: async ({ project_id, realmId, search_term }) => {
    try {
      const records = await db.query.projectRecords.findMany({
        where: and(eq(schema.projectRecords.projectId, project_id), eq(schema.projectRecords.realmId, realmId)),
        limit: 50,
      });

      if (!search_term) return { success: true, data: JSON.stringify(records.slice(0, 10)) };

      const term = String(search_term).toLowerCase();
      const filtered = records.filter(
        (r) => r.title?.toLowerCase?.().includes(term) || JSON.stringify(r.properties || {}).toLowerCase().includes(term)
      );
      return { success: true, data: JSON.stringify(filtered) };
    } catch (error) { return { success: false, error: error.message }; }
  },
};

export const create_action_from_record = {
  declaration: {
    name: 'create_action_from_record',
    description: "Cria uma Tarefa vinculada a um Dado existente na planilha.",
    parameters: {
      type: 'OBJECT',
      properties: { record_id: { type: 'STRING' }, task_title: { type: 'STRING' }, due_date: { type: 'STRING' } },
      required: ['record_id', 'task_title'],
    },
  },
  handler: async ({ record_id, task_title, due_date }) => {
    try {
      const record = await db.query.projectRecords.findFirst({ where: eq(schema.projectRecords.id, record_id) });
      if (!record) throw new Error('Registro não encontrado.');

      await db.insert(schema.tasks).values({
        id: createId('task'), projectId: record.projectId, realmId: record.realmId || 'personal',
        relatedRecordId: record.id, title: task_title, status: 'todo',
        dueDate: due_date ? new Date(due_date) : null, automationOriginId: 'ash_agent', createdAt: new Date(),
      });
      return { success: true, message: `Tarefa criada e vinculada a '${record.title}'.` };
    } catch (error) { return { success: false, error: error.message }; }
  },
};

// ============================================================================
// 4. AUTOMAÇÕES
// ============================================================================

export const define_automation_rule = {
  declaration: {
    name: 'define_automation_rule',
    description: "Cria uma regra de automação no projeto. Ex: 'Se estoque < 5, criar tarefa'.",
    parameters: {
      type: 'OBJECT',
      properties: {
        project_id: { type: 'STRING' },
        name: { type: 'STRING', description: 'Nome da regra' },
        trigger_field: { type: 'STRING', description: 'Campo gatilho (ex: stock)' },
        condition: { type: 'STRING', enum: ['eq', 'neq', 'lt', 'gt', 'contains'] },
        value: { type: 'STRING', description: 'Valor gatilho' },
        action_type: { type: 'STRING', enum: ['create_task', 'update_record', 'notify'] },
        action_details: { type: 'OBJECT', description: "Configuração da ação. Para tasks: { title: 'Comprar {{title}}' }" },
      },
      required: ['project_id', 'trigger_field', 'condition', 'value', 'action_type'],
    },
  },
  handler: async (args) => {
    try {
      const newId = createId('auto');
      await db.insert(schema.projectAutomations).values({
        id: newId,
        projectId: args.project_id,
        name: args.name || `Regra: ${args.trigger_field} ${args.condition}`,
        triggerField: args.trigger_field,
        triggerCondition: args.condition,
        triggerValue: String(args.value),
        actionType: args.action_type,
        actionConfig: args.action_details,
        isActive: true,
        createdAt: new Date(),
      });
      return { success: true, message: 'Regra de automação criada com sucesso.' };
    } catch (error) {
      return { success: false, error: `Erro ao criar regra: ${error.message}` };
    }
  },
};

export const list_automations = {
  declaration: {
    name: 'list_automations',
    description: 'Lista as regras de automação ativas de um projeto.',
    parameters: {
      type: 'OBJECT',
      properties: { project_id: { type: 'STRING' } },
      required: ['project_id'],
    },
  },
  handler: async ({ project_id }) => {
    try {
      const rules = await db.query.projectAutomations.findMany({
        where: eq(schema.projectAutomations.projectId, project_id),
      });
      const summary = rules
        .map((r) => `- ${r.name}: Se ${r.triggerField} ${r.triggerCondition} ${r.triggerValue} -> ${r.actionType}`)
        .join('\n');
      return { success: true, message: `Regras encontradas:\n${summary || 'Nenhuma regra ativa.'}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
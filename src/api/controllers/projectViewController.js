/* src/api/controllers/projectViewController.js
   desc: Gestor de Perspectivas (Views) e Dados Híbridos.
   feat: Poda Radical (Realms) em Views e no Motor de Planilha Híbrida.
   V10 Patch: Unificação de contexto para garantir que mundos não se cruzem.
   status: 100% INTEGRAL - SEM OMISSÕES.
*/

import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and, desc, isNull } from 'drizzle-orm';
import { generateId, createId } from '../../utils/id.js';

export const projectViewController = {
  
  // ===========================================================================
  // 1. GERENCIAMENTO DE VIEWS (Configurações de Layout por Realm)
  // ===========================================================================

  // GET /api/projects/:projectId/views
  async getProjectViews(req, res) {
    try {
      const { projectId , realmId } = req.params;
      // realmId pode vir de params, query é ignorado aqui

      const filters = [eq(schema.projectViews.projectId, projectId)];
      
      // Poda Radical: Só traz as views configuradas para este Realm
      if (realmId && realmId !== 'all') {
        filters.push(eq(schema.projectViews.realmId, realmId));
      }

      const views = await db.select()
        .from(schema.projectViews)
        .where(and(...filters));

      res.json(views);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/projects/:projectId/views/:type
  async getProjectViewByType(req, res) {
    try {
      const { projectId, type , realmId } = req.params; 

      const results = await db.select()
        .from(schema.projectViews)
        .where(and(
          eq(schema.projectViews.projectId, projectId), 
          eq(schema.projectViews.type, type),
          realmId && realmId !== 'all' ? eq(schema.projectViews.realmId, realmId) : undefined
        ));
      
      if (results.length > 0) return res.json(results[0]);

      // Lazy Creation V10: Se não existir, cria a perspectiva carimbada no Realm
      const newView = {
        id: generateId('view'),
        projectId,
        realmId: realmId || 'personal', // [V10] Vínculo de mundo
        type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        config: {},
        updatedAt: new Date()
      };

      await db.insert(schema.projectViews).values(newView);
      res.json(newView);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createProjectView(req, res) {
    try {
      const { projectId, name, type, config, realmId } = req.body;
      const newView = {
        id: generateId('view'),
        projectId,
        realmId: realmId || 'personal', // [V10] Proteção de criação
        name,
        type,
        config: config || {},
        updatedAt: new Date()
      };
      await db.insert(schema.projectViews).values(newView);
      res.status(201).json(newView);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProjectView(req, res) {
    try {
      const { id , realmId } = req.params;
      const { name, config } = req.body;
      
      const [updated] = await db.update(schema.projectViews)
        .set({ 
            name, 
            config, 
            realmId, // Permite migrar views entre mundos se necessário
            updatedAt: new Date() 
        })
        .where(and(eq(schema.projectViews.id, id), realmId && realmId !== 'all' ? eq(schema.projectViews.realmId, realmId) : undefined))
        .returning();

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteProjectView(req, res) {
    try {
      const { id, realmId } = req.params;
      await db.delete(schema.projectViews).where(and(eq(schema.projectViews.id, id), realmId && realmId !== 'all' ? eq(schema.projectViews.realmId, realmId) : undefined));
      res.json({ message: 'Perspectiva dissolvida.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ===========================================================================
  // 2. MOTOR DE PLANILHA HÍBRIDA (A MÁGICA DA V10)
  // ===========================================================================

  // GET /api/projects/:projectId/sheet-data
  // Unifica Ações (Tasks) e Informações (Records) em um único stream neural.
  async getSheetData(req, res) {
    try {
      const { projectId , realmId } = req.params;
      // [V10] O filtro mestre vem de req.params

      // Filtros Base
      const taskFilters = [eq(schema.tasks.projectId, projectId), isNull(schema.tasks.deletedAt)];
      const recordFilters = [eq(schema.projectRecords.projectId, projectId), isNull(schema.projectRecords.deletedAt)];

      // Aplica Poda Radical se o Realm for especificado
      if (realmId && realmId !== 'all') {
        taskFilters.push(eq(schema.tasks.realmId, realmId));
        recordFilters.push(eq(schema.projectRecords.realmId, realmId));
      }

      // A) Busca AÇÕES (Tasks)
      const tasks = await db.query.tasks.findMany({
        where: and(...taskFilters),
      });
      
      // B) Busca INFORMAÇÕES (Records)
      const records = await db.query.projectRecords.findMany({
        where: and(...recordFilters),
        with: {
            linkedTasks: true // [V10] Nome corrigido conforme o novo Schema Planning
        }
      });
      
      // C) NORMALIZAÇÃO POLIMÓRFICA
      // Prepara os dados para que a SheetView trate tudo como "Linhas do Universo"
      const normalizedTasks = tasks.map(t => ({
          ...t,
          rowType: 'task', 
          displayTitle: t.title,
          displayDate: t.dueDate,
          displayStatus: t.status,
          properties: t.customData || {} // Tasks usam customData, Records usam properties
      }));

      const normalizedRecords = records.map(r => ({
          ...r,
          rowType: 'record', 
          displayTitle: r.title,
          displayDate: null, 
          displayStatus: null,
          // Verifica se há alguma ação pendente vinculada a este dado
          hasPendingAction: r.linkedTasks ? r.linkedTasks.some(t => t.status !== 'done') : false,
          pendingTaskId: r.linkedTasks ? r.linkedTasks.find(t => t.status !== 'done')?.id : null
      }));

      // D) UNIÃO E ORDENAÇÃO
      const combined = [...normalizedTasks, ...normalizedRecords].sort((a, b) => {
          const orderA = a.order ?? new Date(a.createdAt).getTime();
          const orderB = b.order ?? new Date(b.createdAt).getTime();
          return orderA - orderB;
      });

      res.json(combined);

    } catch (error) {
      console.error("[ProjectView] SheetData Error:", error);
      res.status(500).json({ error: 'Falha ao processar stream de dados híbridos.' });
    }
  },

  // ===========================================================================
  // 3. COMPATIBILIDADE LEGACY (Stubs V8)
  // ===========================================================================
  async updateSheetColumns(req, res) { res.json({ success: true, note: "V10 usa JSONB dinâmico" }); },
  async addSheetColumn(req, res) { res.json({ success: true }); },
  async addKanbanColumn(req, res) { res.json({ success: true }); }
};
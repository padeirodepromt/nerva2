/* src/api/controllers/projectController.js
   desc: Controlador de Projetos V3 (Hierarchical & Templated).
*/

import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { createId } from '../../utils/id.js';
import { eq, and, isNull } from 'drizzle-orm';

// ✅ NOVO: instala dept (contrato/agents) + semeia fields
import { installDepartment } from '../../modules/departments/departmentInstaller.js';

function normalizeDepartmentKey(input) {
  if (!input) return 'core';
  const k = String(input).toLowerCase().trim();
  if (k === 'dev' || k === 'narrative' || k === 'core') return k;
  return 'core';
}

async function resolveDepartmentIdByKey(departmentKey) {
  // Se não existir schema.departments (ex: schema export incompleto), não quebra
  if (!schema?.departments) return null;

  const dept = await db.query.departments?.findFirst
    ? db.query.departments.findFirst({ where: eq(schema.departments.key, departmentKey) })
    : (await db.select().from(schema.departments).where(eq(schema.departments.key, departmentKey)).limit(1))?.[0];

  return dept?.id || null;
}

export const projectController = {

  // Lista projetos (com suporte a filtros de hierarquia, tipo e compartilhamento)
  list: async (req, res) => {
    try {
      const { userId, parentId, active, type, shared, realmId } = req.query;

      const filters = [eq(schema.projects.ownerId, userId)];

      // Filtro de Hierarquia (Subprojetos vs Raiz)
      if (parentId === 'null' || !parentId) {
        filters.push(isNull(schema.projects.parentId));
      } else {
        filters.push(eq(schema.projects.parentId, parentId));
      }

      // Filtro de Status
      if (active === 'true') {
        filters.push(eq(schema.projects.status, 'active'));
      }

      // Filtro de Tipo (personal vs professional)
      if (type) {
        filters.push(eq(schema.projects.type, type));
      }

      // Filtro de Compartilhamento
      if (shared === 'true') {
        filters.push(eq(schema.projects.isShared, true));
      }

      const projects = await db.query.projects.findMany({
        where: and(...filters),
        orderBy: (projects, { desc }) => [desc(projects.createdAt)]
      });

      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Pega um projeto por ID
  get: async (req, res) => {
    try {
      const { id, realmId } = req.params;
      const project = await db.query.projects.findFirst({
        where: eq(schema.projects.id, id)
      });

      if (!project) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Criação Inteligente (Suporta Templates, Hierarquia, Tipo e Compartilhamento)
  create: async (req, res) => {
    try {
      const {
        title, name, description, ownerId, parentId,
        status, templateId, metadata, structure,
        type, isShared, visibility,
        // ✅ NOVO: departmentKey opcional
        departmentKey: departmentKeyInput,
        realmId
      } = req.body;

      // Validação: Projetos pessoais não podem ser compartilhados
      if (type === 'personal' && isShared) {
        return res.status(400).json({
          error: "Projetos pessoais não podem ser compartilhados"
        });
      }

      const departmentKey = normalizeDepartmentKey(departmentKeyInput);

      // ✅ Resolve departmentId do catálogo (se existir)
      // Regra: se não escolher, vira 'core'
      const departmentId = await resolveDepartmentIdByKey(departmentKey);

      // 1) Cria o Projeto (Pasta)
      const newProjectId = createId('proj');

      const projectData = {
        id: newProjectId,
        title: title || name,
        description,
        ownerId,
        parentId: parentId || null,
        status: status || 'active',
        templateId: templateId || null,

        // tipo e compartilhamento
        type: type || 'personal',
        isShared: isShared || false,
        visibility: visibility || (isShared ? 'shared' : 'private'),

        // settings e customData podem vir do metadata
        settings: metadata ? { archetype: metadata.archetype } : {},

        // ✅ NOVO: departamento do projeto (pode ser null se catálogo ainda não tiver core/dev/narrative)
        departmentId: departmentId || null,

        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(schema.projects).values(projectData);

      // 2) Processa Estrutura Automática (Se vier do ProjectMasterForm)
      if (structure && Array.isArray(structure) && structure.length > 0) {
        const tasksToCreate = structure
          .filter(item => item.checked)
          .map(item => ({
            id: createId('task'),
            title: item.name,
            projectId: newProjectId,
            ownerId,
            status: 'todo',
            priority: item.type === 'phase' ? 'high' : 'medium',
            createdAt: new Date()
          }));

        if (tasksToCreate.length > 0) {
          await db.insert(schema.tasks).values(tasksToCreate);
        }
      }

      // 3) ✅ Pós-criação: garantir que o departamento exista para o usuário + semear fields
      // Não bloqueia criação do projeto (fase dev-friendly). Apenas loga e segue.
      try {
        // instala dept (contratos/agents) se registry suportar
        await installDepartment(ownerId, departmentKey, { origin: 'project_create', projectId: newProjectId });

        // semeia colunas do departamento (SheetView / Kanban)
        
      } catch (e) {
        console.warn('[ProjectController] Pós-criação (dept install/field seed) falhou:', e?.message || e);
      }

      res.status(201).json({
        ...projectData,
        departmentKey
      });

    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      res.status(500).json({ error: "Falha ao criar projeto." });
    }
  },

  // Função auxiliar: Validar ciclos em hierarquia
  validateNoCycle: async (projectId, newParentId) => {
    if (!newParentId) return true;
    if (projectId === newParentId) return false;

    let current = newParentId;
    const visited = new Set();
    const MAX_DEPTH = 20;
    let depth = 0;

    while (current && depth < MAX_DEPTH) {
      if (visited.has(current)) return false;
      if (current === projectId) return false;

      visited.add(current);
      const parent = await db.query.projects.findFirst({
        where: eq(schema.projects.id, current)
      });

      current = parent?.parentId || null;
      depth++;
    }

    return true;
  },

  // Função auxiliar: Validar profundidade
  validateDepthLimit: async (projectId, newParentId, maxDepth = 7) => {
    if (!newParentId) return true;

    let depth = 0;
    let current = newParentId;

    while (current && depth < maxDepth) {
      const parent = await db.query.projects.findFirst({
        where: eq(schema.projects.id, current)
      });
      current = parent?.parentId || null;
      depth++;
    }

    return current === null;
  },

  // Atualizar projeto
  update: async (req, res) => {
    try {
      const { id, realmId } = req.params;
      const updates = req.body;

      if (updates.parentId !== undefined) {
        const hasCycle = !(await projectController.validateNoCycle(id, updates.parentId));
        if (hasCycle) {
          return res.status(400).json({
            error: "Operação criaria um ciclo na hierarquia (projeto não pode ser pai de si mesmo ou de seus ascendentes)"
          });
        }

        const depthExceeded = !(await projectController.validateDepthLimit(id, updates.parentId, 7));
        if (depthExceeded) {
          return res.status(400).json({
            error: "Limite de profundidade alcançado (máximo 7 níveis de hierarquia)"
          });
        }
      }

      if (updates.type === 'personal' && updates.isShared) {
        return res.status(400).json({
          error: "Projetos pessoais não podem ser compartilhados"
        });
      }

      if (updates.type === 'personal') {
        updates.isShared = false;
        updates.visibility = 'private';
      }

      updates.updatedAt = new Date();

      await db.update(schema.projects)
        .set(updates)
        .where(and(
          eq(schema.projects.id, id),
          realmId && realmId !== 'all' ? eq(schema.projects.realmId, realmId) : undefined
        ));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Deletar projeto
  delete: async (req, res) => {
    try {
      const { id, realmId } = req.params;
      await db.delete(schema.projects).where(and(
        eq(schema.projects.id, id),
        realmId && realmId !== 'all' ? eq(schema.projects.realmId, realmId) : undefined
      ));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
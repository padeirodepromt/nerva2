/* src/api/controllers/projectTemplatesController.js
   desc: Controller para Project Templates (salvar projetos como reutilizáveis)
   feat: CRUD de templates, aplicação de templates, seleção de fields
*/

import { db } from '../../db/index.js';
import { projectTemplates, projects } from '../../db/schema/core.js';
import { eq, and } from 'drizzle-orm';

export const projectTemplatesController = {
  
  /* GET /api/project-templates
     desc: Listar templates do usuário autenticado
     returns: Array de templates com usageCount
  */
  async list(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { realmId } = req.query;

      const templates = await db
        .select()
        .from(projectTemplates)
        .where(and(eq(projectTemplates.userId, userId), realmId && realmId !== 'all' ? eq(projectTemplates.realmId, realmId) : undefined))
        .orderBy((t) => t.createdAt);

      return res.json(templates);
    } catch (error) {
      console.error('Error listing templates:', error);
      return res.status(500).json({ error: 'Failed to list templates' });
    }
  },

  /* GET /api/project-templates/:id
     desc: Obter template específico
     params: id (template ID)
  */
  async get(req, res) {
    try {
      const { id , realmId } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const template = await db
        .select()
        .from(projectTemplates)
        .where(
          and(
            eq(projectTemplates.id, id),
            eq(projectTemplates.userId, userId)
          )
        )
        .limit(1);

      if (!template.length) {
        return res.status(404).json({ error: 'Template not found' });
      }

      return res.json(template[0]);
    } catch (error) {
      console.error('Error fetching template:', error);
      return res.status(500).json({ error: 'Failed to fetch template' });
    }
  },

  /* POST /api/project-templates
     desc: Criar novo template a partir de um projeto existente
     body: {
       projectId: string,
       templateName: string,
       templateDescription: string,
       selectedFields: {
         title: boolean,
         description: boolean,
         tags: boolean,
         customFields: boolean,
         subtasks: boolean,
         color: boolean,
         icon: boolean,
         settings: boolean
       }
     }
  */
  async create(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { projectId, templateName, templateDescription, selectedFields , realmId } = req.body;

      if (!projectId || !templateName || !selectedFields) {
        return res.status(400).json({
          error: 'Missing required fields: projectId, templateName, selectedFields'
        });
      }

      // 1. Buscar projeto original
      const originalProject = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, projectId), realmId && realmId !== 'all' ? eq(projects.realmId, realmId) : undefined))
        .limit(1);

      if (!originalProject.length) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const project = originalProject[0];

      // 2. Construir savedData com apenas os campos selecionados
      const savedData = {};
      
      if (selectedFields.title) savedData.title = project.title;
      if (selectedFields.description) savedData.description = project.description;
      if (selectedFields.color) savedData.color = project.color;
      if (selectedFields.icon) savedData.icon = project.icon;
      if (selectedFields.settings) savedData.settings = project.settings;
      if (selectedFields.customData) savedData.customData = project.customData;

      // 3. Se selecionou tags, buscar tags do projeto
      if (selectedFields.tags) {
        // Nota: Para buscar tags, precisamos de uma query mais complexa
        // Por enquanto, salvamos instruction para buscar depois
        savedData._includeTagsFromProject = projectId;
      }

      // 4. Se selecionou subtasks, buscar subtasks do projeto
      if (selectedFields.subtasks) {
        savedData._includeSubtasksFromProject = projectId;
      }

      // 5. Criar template no DB
      const newTemplate = await db
        .insert(projectTemplates)
        .values({
          id: require('../../utils/id.js').createId(),
        realmId: realmId || 'personal',
          name: templateName,
          description: templateDescription || null,
          userId,
          savedData: JSON.stringify(savedData),
          includedFields: JSON.stringify(selectedFields),
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return res.status(201).json(newTemplate[0]);
    } catch (error) {
      console.error('Error creating template:', error);
      return res.status(500).json({ error: 'Failed to create template' });
    }
  },

  /* POST /api/project-templates/:id/apply
     desc: Aplicar template ao criar novo projeto
     params: id (template ID)
     body: {
       projectName: string (obrigatório para o novo projeto),
       projectDescription?: string
     }
     returns: Novo projeto com dados do template + dados customizados
  */
  async applyTemplate(req, res) {
    try {
      const { id , realmId } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { projectName, projectDescription } = req.body;
      if (!projectName) {
        return res.status(400).json({ error: 'projectName is required' });
      }

      // 1. Buscar template
      const template = await db
        .select()
        .from(projectTemplates)
        .where(
          and(
            eq(projectTemplates.id, id),
            eq(projectTemplates.userId, userId)
          )
        )
        .limit(1);

      if (!template.length) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const tmpl = template[0];

      // 2. Construir novo projeto com dados do template
      const savedData = typeof tmpl.savedData === 'string' 
        ? JSON.parse(tmpl.savedData) 
        : tmpl.savedData;

      const newProject = {
        title: projectName,
        description: projectDescription || savedData.description || null,
        ownerId: userId,
        type: 'personal', // Default
        isShared: false,
        visibility: 'private',
        color: savedData.color || '#3B82F6',
        icon: savedData.icon || null,
        settings: savedData.settings || {},
        customData: savedData.customData || null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 3. Criar projeto no DB
      const created = await db
        .insert(projects)
        .values({
          ...newProject,
          id: require('../../utils/id.js').createId(),
        realmId: realmId || 'personal',
        })
        .returning();

      // 4. Incrementar usageCount do template
      await db
        .update(projectTemplates)
        .set({
          usageCount: (tmpl.usageCount || 0) + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(projectTemplates.id, id), realmId && realmId !== 'all' ? eq(projectTemplates.realmId, realmId) : undefined));

      return res.status(201).json({
        project: created[0],
        message: 'Project created from template',
        appliedTemplate: {
          id: tmpl.id,
          name: tmpl.name,
        },
      });
    } catch (error) {
      console.error('Error applying template:', error);
      return res.status(500).json({ error: 'Failed to apply template' });
    }
  },

  /* DELETE /api/project-templates/:id
     desc: Deletar um template
     params: id (template ID)
  */
  async update(req, res) {
    try {
      const { id , realmId } = req.params;
      const data = { ...req.body, updatedAt: new Date() };
      delete data.id;
      await db.update(projectTemplates).set(data).where(and(eq(projectTemplates.id, id), realmId && realmId !== 'all' ? eq(projectTemplates.realmId, realmId) : undefined));
      res.json({ success: true, id });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async delete(req, res) {
    try {
      const { id , realmId } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const deleted = await db
        .delete(projectTemplates)
        .where(
          and(
            eq(projectTemplates.id, id),
            eq(projectTemplates.userId, userId)
          )
        )
        .returning();

      if (!deleted.length) {
        return res.status(404).json({ error: 'Template not found' });
      }

      return res.json({
        success: true,
        message: 'Template deleted',
        deletedTemplate: deleted[0],
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      return res.status(500).json({ error: 'Failed to delete template' });
    }
  },
};

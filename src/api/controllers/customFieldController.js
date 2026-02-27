import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const customFieldController = {
  // Como migramos para JSONB em 'tasks.customData', esta rota agora lê/escreve nesse JSON
  async updateTaskCustomField(req, res) {
    try {
      const { taskId , realmId } = req.params;
      const { fieldId, value } = req.body; // fieldId aqui seria a chave do JSON (ex: 'budget')

      // Busca a tarefa atual
      const [task] = await db.select().from(schema.tasks).where(and(eq(schema.tasks.id, taskId), realmId && realmId !== 'all' ? eq(schema.tasks.realmId, realmId) : undefined));
      if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

      // Atualiza o JSON
      const newCustomData = { ...(task.customData || {}), [fieldId]: value };

      await db.update(schema.tasks)
        .set({ customData: newCustomData, updatedAt: new Date() })
        .where(and(eq(schema.tasks.id, taskId), realmId && realmId !== 'all' ? eq(schema.tasks.realmId, realmId) : undefined));

      res.json({ success: true, customData: newCustomData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Retorna campos definidos no Template do projeto (se houver)
  async getCustomFieldsByProject(req, res) {
    try {
      const { projectId , realmId } = req.params;
      const [project] = await db.select().from(schema.projects).where(and(eq(schema.projects.id, projectId), realmId && realmId !== 'all' ? eq(schema.projects.realmId, realmId) : undefined));
      
      if (project?.templateId) {
        const [template] = await db.select().from(schema.templates).where(and(eq(schema.templates.id, project.templateId), realmId && realmId !== 'all' ? eq(schema.templates.realmId, realmId) : undefined));
        return res.json(template?.structure || []);
      }
      
      res.json([]); // Sem campos customizados definidos
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Stub para criação (agora feita via Templates)
  async createCustomField(req, res) {
    res.status(501).json({ message: "Use a edição de Templates para adicionar campos." });
  }
};
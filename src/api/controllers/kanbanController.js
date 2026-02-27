import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const kanbanController = {
  async getKanbanData(req, res) {
    try {
      const { projectId , realmId } = req.params;
      
      // Busca Projeto
      const [project] = await db.select().from(schema.projects).where(and(eq(schema.projects.id, projectId), realmId && realmId !== 'all' ? eq(schema.projects.realmId, realmId) : undefined));
      if (!project) return res.status(404).json({ error: "Projeto não encontrado" });

      // Busca Tarefas
      const tasks = await db.select().from(schema.tasks).where(and(eq(schema.tasks.projectId, projectId), realmId && realmId !== 'all' ? eq(schema.tasks.realmId, realmId) : undefined));

      // Formata colunas (Mock ou via Config)
      const columns = {
        todo: tasks.filter(t => t.status === 'todo'),
        in_progress: tasks.filter(t => t.status === 'in_progress'),
        done: tasks.filter(t => t.status === 'done')
      };

      res.json({ project, tasks, columns });
    } catch (error) {
      console.error("Kanban Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
};
/**
 * src/services/olly/OllySystemIntegration.js
 * 
 * Integração profunda do Olly com o Sistema Prana
 * Olly pode acessar e modificar projetos, views, dashboard, chat, etc
 */

import { db } from '../../db/index.js'; // Drizzle ORM
import { projects, projectViews, tasks, messages, dashboards } from '../../db/schema.js';
import { eq, and, like } from 'drizzle-orm';

/**
 * API para Olly interagir com o Sistema Prana
 * Essas funções são chamadas pelo Olly quando ele precisa de dados ou quer fazer ações
 */

// ============================================================================
// PROJETOS - CRUD
// ============================================================================

export const OllyProjectAPI = {
  /**
   * Listar todos os projetos do usuário
   */
  async listProjects(userId) {
    try {
      const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.user_id, userId));
      
      return {
        success: true,
        data: userProjects,
        count: userProjects.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obter detalhes de um projeto específico
   */
  async getProject(projectId, userId) {
    try {
      const project = await db
        .select()
        .from(projects)
        .where(and(
          eq(projects.id, projectId),
          eq(projects.user_id, userId)
        ))
        .limit(1);

      if (project.length === 0) {
        return { success: false, error: 'Projeto não encontrado' };
      }

      return { success: true, data: project[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Criar novo projeto
   */
  async createProject(userId, projectData) {
    try {
      const result = await db
        .insert(projects)
        .values({
          user_id: userId,
          name: projectData.name,
          description: projectData.description || '',
          color: projectData.color || '#6366f1',
          icon: projectData.icon || 'folder',
          status: projectData.status || 'active',
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();

      return { 
        success: true, 
        data: result[0],
        message: `Projeto "${projectData.name}" criado com sucesso!`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Atualizar projeto
   */
  async updateProject(projectId, userId, updateData) {
    try {
      const result = await db
        .update(projects)
        .set({
          ...updateData,
          updated_at: new Date()
        })
        .where(and(
          eq(projects.id, projectId),
          eq(projects.user_id, userId)
        ))
        .returning();

      if (result.length === 0) {
        return { success: false, error: 'Projeto não encontrado' };
      }

      return { 
        success: true, 
        data: result[0],
        message: 'Projeto atualizado com sucesso!'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Deletar projeto
   */
  async deleteProject(projectId, userId) {
    try {
      const result = await db
        .delete(projects)
        .where(and(
          eq(projects.id, projectId),
          eq(projects.user_id, userId)
        ))
        .returning();

      if (result.length === 0) {
        return { success: false, error: 'Projeto não encontrado' };
      }

      return { 
        success: true,
        message: 'Projeto deletado com sucesso!'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Buscar projetos por nome ou descrição
   */
  async searchProjects(userId, query) {
    try {
      const results = await db
        .select()
        .from(projects)
        .where(and(
          eq(projects.user_id, userId),
          like(projects.name, `%${query}%`)
        ));

      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// VIEWS/SHEETS - CRUD
// ============================================================================

export const OllyViewAPI = {
  /**
   * Listar todas as views de um projeto
   */
  async listViews(projectId) {
    try {
      const views = await db
        .select()
        .from(projectViews)
        .where(eq(projectViews.project_id, projectId));

      return { success: true, data: views, count: views.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Criar nova view/sheet
   */
  async createView(projectId, viewData) {
    try {
      const result = await db
        .insert(projectViews)
        .values({
          project_id: projectId,
          name: viewData.name,
          type: viewData.type || 'table', // table, kanban, calendar, etc
          description: viewData.description || '',
          config: viewData.config || {},
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();

      return { 
        success: true, 
        data: result[0],
        message: `View "${viewData.name}" criada!`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Atualizar view
   */
  async updateView(viewId, updateData) {
    try {
      const result = await db
        .update(projectViews)
        .set({
          ...updateData,
          updated_at: new Date()
        })
        .where(eq(projectViews.id, viewId))
        .returning();

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Deletar view
   */
  async deleteView(viewId) {
    try {
      await db
        .delete(projectViews)
        .where(eq(projectViews.id, viewId));

      return { success: true, message: 'View deletada!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// TAREFAS - CRUD
// ============================================================================

export const OllyTaskAPI = {
  /**
   * Listar tarefas de um projeto
   */
  async listTasks(projectId, filters = {}) {
    try {
      let query = db
        .select()
        .from(tasks)
        .where(eq(tasks.project_id, projectId));

      // Filtros opcionais
      if (filters.status) {
        query = query.where(eq(tasks.status, filters.status));
      }
      if (filters.priority) {
        query = query.where(eq(tasks.priority, filters.priority));
      }
      if (filters.assignee) {
        query = query.where(eq(tasks.assigned_to, filters.assignee));
      }

      const taskList = await query;
      return { success: true, data: taskList, count: taskList.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Criar tarefa
   */
  async createTask(projectId, taskData) {
    try {
      const result = await db
        .insert(tasks)
        .values({
          project_id: projectId,
          title: taskData.title,
          description: taskData.description || '',
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          assigned_to: taskData.assigned_to || null,
          due_date: taskData.due_date || null,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();

      return { 
        success: true, 
        data: result[0],
        message: `Tarefa "${taskData.title}" criada!`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Atualizar tarefa
   */
  async updateTask(taskId, updateData) {
    try {
      const result = await db
        .update(tasks)
        .set({
          ...updateData,
          updated_at: new Date()
        })
        .where(eq(tasks.id, taskId))
        .returning();

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Completar tarefa
   */
  async completeTask(taskId) {
    return this.updateTask(taskId, { status: 'done' });
  },

  /**
   * Deletar tarefa
   */
  async deleteTask(taskId) {
    try {
      await db.delete(tasks).where(eq(tasks.id, taskId));
      return { success: true, message: 'Tarefa deletada!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// DASHBOARD - READ/UPDATE
// ============================================================================

export const OllyDashboardAPI = {
  /**
   * Obter dados do dashboard
   */
  async getDashboardData(userId) {
    try {
      // Resumo de projetos
      const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.user_id, userId));

      // Tarefas do mês
      const monthTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.user_id, userId));

      // Estatísticas
      const stats = {
        totalProjects: userProjects.length,
        totalTasks: monthTasks.length,
        completedTasks: monthTasks.filter(t => t.status === 'done').length,
        activeTasks: monthTasks.filter(t => t.status !== 'done').length,
        overdueTasks: monthTasks.filter(t => {
          return t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done';
        }).length
      };

      return {
        success: true,
        data: {
          projects: userProjects,
          tasks: monthTasks,
          stats
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obter insights do dashboard
   */
  async getInsights(userId) {
    try {
      const dashData = await this.getDashboardData(userId);
      
      if (!dashData.success) return dashData;

      const insights = [];

      // Insight 1: Tarefas atrasadas
      if (dashData.data.stats.overdueTasks > 0) {
        insights.push({
          type: 'warning',
          title: 'Tarefas Atrasadas',
          message: `Você tem ${dashData.data.stats.overdueTasks} tarefa(s) atrasada(s)`,
          priority: 'high'
        });
      }

      // Insight 2: Produtividade
      const completionRate = Math.round(
        (dashData.data.stats.completedTasks / dashData.data.stats.totalTasks) * 100
      ) || 0;
      insights.push({
        type: 'info',
        title: 'Taxa de Conclusão',
        message: `${completionRate}% das tarefas foram concluídas`,
        priority: 'medium'
      });

      return { success: true, data: insights };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// CHAT/MENSAGENS - READ/CREATE
// ============================================================================

export const OllyChatAPI = {
  /**
   * Obter histórico de chat
   */
  async getChatHistory(projectId, limit = 50) {
    try {
      const chatHistory = await db
        .select()
        .from(messages)
        .where(eq(messages.project_id, projectId))
        .orderBy(messages.created_at)
        .limit(limit);

      return { success: true, data: chatHistory };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Enviar mensagem de Olly
   */
  async sendMessage(projectId, userId, content, type = 'ai_insight') {
    try {
      const result = await db
        .insert(messages)
        .values({
          project_id: projectId,
          user_id: userId,
          content: content,
          type: type, // 'user' | 'ai_insight' | 'system'
          created_at: new Date()
        })
        .returning();

      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// ANÁLISE E RECOMENDAÇÕES
// ============================================================================

export const OllyAnalysisAPI = {
  /**
   * Analisar projeto e fornecer recomendações
   */
  async analyzeProject(projectId, userId) {
    try {
      const projectData = await OllyProjectAPI.getProject(projectId, userId);
      if (!projectData.success) return projectData;

      const viewsData = await OllyViewAPI.listViews(projectId);
      const tasksData = await OllyTaskAPI.listTasks(projectId);

      const analysis = {
        projectName: projectData.data.name,
        overview: {
          totalViews: viewsData.data.length,
          totalTasks: tasksData.data.length,
          completedTasks: tasksData.data.filter(t => t.status === 'done').length,
          pendingTasks: tasksData.data.filter(t => t.status !== 'done').length
        },
        recommendations: []
      };

      // Recomendação 1: Muitas tarefas pendentes
      if (analysis.overview.pendingTasks > 10) {
        analysis.recommendations.push({
          type: 'optimize',
          title: 'Organização de Tarefas',
          description: `Você tem muitas tarefas pendentes (${analysis.overview.pendingTasks}). Considere priorizar ou delegar.`,
          action: 'help_organize_tasks'
        });
      }

      // Recomendação 2: Sem views
      if (analysis.overview.totalViews === 0) {
        analysis.recommendations.push({
          type: 'info',
          title: 'Criar Views',
          description: 'Este projeto não tem nenhuma view. Crie uma para visualizar melhor seus dados.',
          action: 'create_view'
        });
      }

      return { success: true, data: analysis };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================================================
// FUNCTIONS PARA O OLLY CHAMAR (Function Calling)
// ============================================================================

/**
 * Lista de funções que o Olly pode chamar
 * Usada para o Olly saber quais ações ele pode executar
 */
export const OllyAvailableFunctions = [
  {
    name: 'list_projects',
    description: 'Listar todos os projetos do usuário',
    parameters: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'ID do usuário' }
      },
      required: ['user_id']
    }
  },
  {
    name: 'get_project',
    description: 'Obter detalhes de um projeto específico',
    parameters: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'ID do projeto' },
        user_id: { type: 'string', description: 'ID do usuário' }
      },
      required: ['project_id', 'user_id']
    }
  },
  {
    name: 'create_project',
    description: 'Criar um novo projeto',
    parameters: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'ID do usuário' },
        name: { type: 'string', description: 'Nome do projeto' },
        description: { type: 'string', description: 'Descrição do projeto' }
      },
      required: ['user_id', 'name']
    }
  },
  {
    name: 'list_tasks',
    description: 'Listar tarefas de um projeto',
    parameters: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'ID do projeto' },
        status: { type: 'string', description: 'Filtrar por status (todo, in_progress, done)' }
      },
      required: ['project_id']
    }
  },
  {
    name: 'create_task',
    description: 'Criar uma nova tarefa',
    parameters: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'ID do projeto' },
        title: { type: 'string', description: 'Título da tarefa' },
        description: { type: 'string', description: 'Descrição da tarefa' },
        priority: { type: 'string', description: 'Prioridade (low, medium, high)' }
      },
      required: ['project_id', 'title']
    }
  },
  {
    name: 'complete_task',
    description: 'Marcar uma tarefa como completa',
    parameters: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'ID da tarefa' }
      },
      required: ['task_id']
    }
  },
  {
    name: 'get_dashboard_data',
    description: 'Obter dados e estatísticas do dashboard',
    parameters: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'ID do usuário' }
      },
      required: ['user_id']
    }
  },
  {
    name: 'analyze_project',
    description: 'Analisar projeto e fornecer recomendações',
    parameters: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'ID do projeto' },
        user_id: { type: 'string', description: 'ID do usuário' }
      },
      required: ['project_id', 'user_id']
    }
  }
];

/**
 * Executar uma função chamada por Olly
 */
export async function executeOllyFunction(functionName, params) {
  try {
    switch (functionName) {
      case 'list_projects':
        return await OllyProjectAPI.listProjects(params.user_id);
      
      case 'get_project':
        return await OllyProjectAPI.getProject(params.project_id, params.user_id);
      
      case 'create_project':
        return await OllyProjectAPI.createProject(params.user_id, {
          name: params.name,
          description: params.description
        });
      
      case 'list_tasks':
        return await OllyTaskAPI.listTasks(params.project_id, {
          status: params.status
        });
      
      case 'create_task':
        return await OllyTaskAPI.createTask(params.project_id, {
          title: params.title,
          description: params.description,
          priority: params.priority
        });
      
      case 'complete_task':
        return await OllyTaskAPI.completeTask(params.task_id);
      
      case 'get_dashboard_data':
        return await OllyDashboardAPI.getDashboardData(params.user_id);
      
      case 'analyze_project':
        return await OllyAnalysisAPI.analyzeProject(params.project_id, params.user_id);
      
      default:
        return { success: false, error: `Função desconhecida: ${functionName}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default {
  OllyProjectAPI,
  OllyViewAPI,
  OllyTaskAPI,
  OllyDashboardAPI,
  OllyChatAPI,
  OllyAnalysisAPI,
  OllyAvailableFunctions,
  executeOllyFunction
};

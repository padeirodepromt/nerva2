/* src/ai_services/auditService.js
   desc: Serviço de Auditoria e Insights (Modo DEVELOP).
   func: Analisa padrões, detecta gargalos e sugere reestruturação.
*/

import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq, sql, and, isNotNull, desc, lt } from 'drizzle-orm';

export const auditService = {
  
  // GERA O RELATÓRIO COMPLETO (Para o Ash ler)
  async generateFullReport(userId) {
    const [tagSuggestions, bloatSuggestions, staleTasks] = await Promise.all([
        this.analyzeTagEntropy(userId),
        this.analyzeProjectBloat(userId),
        this.analyzeStaleTasks(userId)
    ]);

    return {
        status: 'success',
        timestamp: new Date(),
        suggestions: [
            ...tagSuggestions,
            ...bloatSuggestions,
            ...staleTasks
        ],
        summary: `${tagSuggestions.length} tags críticas, ${bloatSuggestions.length} projetos inchados, ${staleTasks.length} tarefas estagnadas.`
    };
  },

  /**
   * 1. Entropia de Tags:
   * Se uma tag cresceu demais (ex: #marketing tem 50 tarefas), 
   * ela provavelmente deveria ser promovida a Projeto.
   */
  async analyzeTagEntropy(userId) {
    const allTasks = await db.select({ tags: schema.tasks.tags })
        .from(schema.tasks)
        .where(eq(schema.tasks.ownerId, userId));
    
    const tagCounts = {};
    
    allTasks.forEach(t => {
      let tagsList = [];
      // Normalização robusta (seja array JSONB ou string)
      if (Array.isArray(t.tags)) tagsList = t.tags;
      else if (typeof t.tags === 'string') {
          try { tagsList = JSON.parse(t.tags); } catch { tagsList = [t.tags]; }
      }

      tagsList.forEach(tag => {
        if(!tag) return;
        const cleanTag = tag.trim().toLowerCase().replace('#', '');
        tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
      });
    });

    const suggestions = [];
    const CRITICAL_MASS = 10; // Número mágico para promoção

    for (const [tag, count] of Object.entries(tagCounts)) {
      if (count >= CRITICAL_MASS) {
        // Verifica se JÁ existe um projeto com este nome
        // (Aqui simplificado, idealmente usaria ilike no banco)
        const existing = await db.query.projects.findFirst({
            where: (projects, { sql }) => sql`lower(${projects.title}) = ${tag}`
        });
        
        if (!existing) {
          suggestions.push({
            type: 'PROMOTE_TAG',
            entity: tag,
            count: count,
            severity: 'medium',
            action: `Criar Projeto "${tag.charAt(0).toUpperCase() + tag.slice(1)}"`,
            reason: `A tag #${tag} está em ${count} tarefas. Ela ganhou peso de Projeto.`
          });
        }
      }
    }

    return suggestions;
  },

  /**
   * 2. Inchaço de Projetos:
   * Se um projeto tem muitas tarefas ativas (>30) e poucas subpastas, 
   * sugere quebrar em subprojetos.
   */
  async analyzeProjectBloat(userId) {
    // Conta tarefas ativas por projeto
    const projectCounts = await db.select({ 
      projectId: schema.tasks.projectId, 
      count: sql`count(*)` 
    })
    .from(schema.tasks)
    .where(and(
        eq(schema.tasks.ownerId, userId),
        eq(schema.tasks.status, 'todo')
    ))
    .groupBy(schema.tasks.projectId);

    const suggestions = [];
    
    for (const p of projectCounts) {
      // Ignora Inbox (projectId null)
      if (p.count > 20 && p.projectId) {
        const project = await db.query.projects.findFirst({ where: eq(schema.projects.id, p.projectId) });
        
        // Se o projeto não tem subprojetos (filhos), sugere criar
        const subProjectsCount = await db.$count(schema.projects, eq(schema.projects.parentId, p.projectId));

        if (project && subProjectsCount === 0) {
          suggestions.push({
            type: 'SPLIT_PROJECT',
            entity: project.title,
            count: p.count,
            severity: 'high',
            action: `Criar Subprojetos em "${project.title}"`,
            reason: `O projeto "${project.title}" tem ${p.count} tarefas ativas e nenhuma subpasta. Está difícil de gerenciar.`
          });
        }
      }
    }
    return suggestions;
  },

  /**
   * 3. Tarefas Estagnadas (Zumbis):
   * Tarefas criadas há mais de 30 dias que ainda estão 'todo'.
   */
  async analyzeStaleTasks(userId) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stale = await db.select({
          id: schema.tasks.id,
          title: schema.tasks.title,
          createdAt: schema.tasks.createdAt
      })
      .from(schema.tasks)
      .where(and(
          eq(schema.tasks.ownerId, userId),
          eq(schema.tasks.status, 'todo'),
          lt(schema.tasks.createdAt, thirtyDaysAgo)
      ))
      .limit(5); // Pega apenas as top 5 para não poluir

      if (stale.length > 0) {
          return [{
              type: 'STALE_TASKS',
              entity: 'Backlog',
              count: stale.length,
              severity: 'low',
              action: 'Arquivar ou Deletar',
              reason: `Existem tarefas antigas (ex: "${stale[0].title}") paradas há mais de 30 dias.`
          }];
      }
      return [];
  }
};
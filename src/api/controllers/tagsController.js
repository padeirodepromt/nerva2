/* src/api/controllers/tagsController.js
   desc: Controlador de Tags e Associações
*/

import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { createId } from '../../utils/id.js';
import { eq, and, sql } from 'drizzle-orm';

export const tagsController = {
  
  // Lista todas as tags
  list: async (req, res) => {
    try {
      const tags = await db.query.tags.findMany({
        orderBy: (tags, { desc }) => [desc(tags.usageCount)]
      });
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Pega tags sugeridas (top 10 mais usadas)
  suggested: async (req, res) => {
    try {
      const suggestedTags = await db.query.tags.findMany({
        orderBy: (tags, { desc }) => [desc(tags.usageCount)],
        limit: 10
      });
      res.json(suggestedTags);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cria uma nova tag
  create: async (req, res) => {
    try {
      const { name, color, icon , realmId } = req.body;

      // Validação
      if (!name) {
        return res.status(400).json({ error: 'Nome da tag é obrigatório' });
      }

      const normalizedName = name.toLowerCase().trim();

      // Verificar se já existe
      const existing = await db.query.tags.findFirst({
        where: eq(schema.tags.name, normalizedName)
      });

      if (existing) {
        return res.json(existing);
      }

      // Criar nova tag
      const newTagId = createId('tag');
      const newTag = {
        id: newTagId,
        name: normalizedName,
        color: color || '#94a3b8',
        icon: icon || null,
        usageCount: 0,
        createdAt: new Date()
      };

      await db.insert(schema.tags).values(newTag);
      res.status(201).json(newTag);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Associa uma tag a uma task
  addToTask: async (req, res) => {
    try {
      const { taskId, tagId , realmId } = req.body;

      if (!taskId || !tagId) {
        return res.status(400).json({ error: 'taskId e tagId são obrigatórios' });
      }

      // Verificar se a associação já existe
      const existing = await db.query.taskTags.findFirst({
        where: and(
          eq(schema.taskTags.taskId, taskId),
          eq(schema.taskTags.tagId, tagId)
        )
      });

      if (existing) {
        return res.json({ message: 'Associação já existe' });
      }

      // Criar associação
      await db.insert(schema.taskTags).values({
        realmId: realmId || 'personal',
        taskId,
        tagId
      });

      // Incrementar uso da tag
      await db.update(schema.tags)
        .set({ usageCount: sql`${schema.tags.usageCount} + 1` })
        .where(and(eq(schema.tags.id, tagId), realmId && realmId !== 'all' ? eq(schema.tags.realmId, realmId) : undefined));

      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Remove uma tag de uma task
  removeFromTask: async (req, res) => {
    try {
      const { taskId, tagId , realmId } = req.body;

      if (!taskId || !tagId) {
        return res.status(400).json({ error: 'taskId e tagId são obrigatórios' });
      }

      // Remover associação
      await db.delete(schema.taskTags)
        .where(and(
          eq(schema.taskTags.taskId, taskId),
          eq(schema.taskTags.tagId, tagId)
        ));

      // Decrementar uso da tag
      const currentCount = await db.query.tags.findFirst({
        where: eq(schema.tags.id, tagId)
      });

      await db.update(schema.tags)
        .set({ usageCount: Math.max(0, currentCount.usageCount - 1) })
        .where(and(eq(schema.tags.id, tagId), realmId && realmId !== 'all' ? eq(schema.tags.realmId, realmId) : undefined));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Pega todos os items com uma tag específica
  getItems: async (req, res) => {
    try {
      const { tagId , realmId } = req.params;

      // Buscar associações
      const items = await db.query.taskTags.findMany({
        where: eq(schema.taskTags.tagId, tagId),
        with: { task: true }
      });

      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Deleta uma tag
  delete: async (req, res) => {
    try {
      const { id , realmId } = req.params;

      // Primeiro remover todas as associações
      await db.delete(schema.taskTags)
        .where(and(eq(schema.taskTags.tagId, id), realmId && realmId !== 'all' ? eq(schema.taskTags.realmId, realmId) : undefined));

      // Depois deletar a tag
      await db.delete(schema.tags)
        .where(and(eq(schema.tags.id, id), realmId && realmId !== 'all' ? eq(schema.tags.realmId, realmId) : undefined));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

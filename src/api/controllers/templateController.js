// src/api/controllers/templateController.js

import { db } from '../../db/index.js';
import { templates } from '../../db/schema/core.js';
import { eq, desc, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const templateController = {
  // Lista todos os templates disponíveis para o SmartModal
  async list(req, res) {
    try {
      const allTemplates = await db.select().from(templates).orderBy(desc(templates.createdAt));
      res.json(allTemplates);
    } catch (error) {
      console.error('Erro ao listar templates:', error);
      res.status(500).json({ error: 'Erro interno ao buscar templates' });
    }
  },

  // Criação de novos templates (pelo Ash ou Admin)
  async create(req, res) {
    try {
      // Extrai os dados, aceitando variações de nome para o criador
      const { name, description, type, structure, created_by, createdBy, userId , realmId } = req.body;

      // Validação básica de segurança para a estrutura
      if (!Array.isArray(structure)) {
         return res.status(400).json({ error: "A estrutura do template deve ser um array JSON válido." });
      }

      const authorId = created_by || createdBy || userId;

      if (!authorId) {
          return res.status(400).json({ error: "ID do criador é obrigatório." });
      }

      const newTemplate = {
        id: createId('tmpl'),
        name,
        description,
        type, // 'project' ou 'task'
        structure, // JSON do schema
        createdBy: authorId, // Normalizado para o Schema do Drizzle
        createdAt: new Date(),
      };

      await db.insert(templates).values(newTemplate);
      res.status(201).json(newTemplate);
    } catch (error) {
      console.error('Erro ao criar template:', error);
      res.status(500).json({ error: 'Erro ao criar template' });
    }
  },

  // Atualizar um template existente
  async update(req, res) {
    try {
      const { id , realmId } = req.params;
      const body = req.body;

      // Proteção: Não permitir alterar o ID ou data de criação
      delete body.id;
      delete body.createdAt;

      const result = await db.update(templates)
        .set({ ...body })
        .where(and(eq(templates.id, id), realmId && realmId !== 'all' ? eq(templates.realmId, realmId) : undefined))
        .returning();

      if (!result.length) {
          return res.status(404).json({ error: "Template não encontrado" });
      }

      res.json(result[0]);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      res.status(500).json({ error: 'Erro ao atualizar template' });
    }
  },

  // Deletar template
  async delete(req, res) {
    try {
      const { id , realmId } = req.params;
      const result = await db.delete(templates).where(and(eq(templates.id, id), realmId && realmId !== 'all' ? eq(templates.realmId, realmId) : undefined)).returning();
      
      if (!result.length) {
        return res.status(404).json({ error: "Template não encontrado" });
      }

      res.json({ message: 'Template removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar template' });
    }
  }
};
/* src/api/controllers/sankalpaController.js
   desc: Gestor de Intenções Master (Sankalpas).
   feat: Absorção da lógica de Goals (Métricas e Progresso).
   feat: Poda Radical por realmId.
*/
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const sankalpaController = {
  
  // 1. LISTAGEM COM PODA RADICAL
  async list(req, res) {
    const { userId, realmId } = req.query; // Recebe o universo ativo da UI
    
    try {
      const filters = [];
      if (userId) filters.push(eq(schema.sankalpas.userId, userId));
      
      // [V10] Se um Realm for especificado, filtramos rigorosamente
      if (realmId && realmId !== 'all') {
        filters.push(eq(schema.sankalpas.realmId, realmId));
      }

      const items = await db.select()
        .from(schema.sankalpas)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(schema.sankalpas.createdAt));
        
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Erro ao consultar as intenções do multiverso." });
    }
  },

  // 2. CRIAÇÃO COM DNA DE GOAL
  async create(req, res) {
    try {
      const { 
        title, description, userId, realmId, 
        targetValue, currentValue, unit, deadline
      } = req.body;

      const newItem = { 
        id: createId('sank'), 
        userId,
        realmId: realmId || 'personal', // Default V10
        title,
        description,
        // Campos herdados de Goal:
        targetValue: targetValue || null,
        currentValue: currentValue || 0,
        unit: unit || '%',
        deadline: deadline ? new Date(deadline) : null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(schema.sankalpas).values(newItem);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: "Falha ao manifestar Sankalpa." });
    }
  },

  // 3. ATUALIZAÇÃO (Sincronia de Progresso)
  async update(req, res) {
    const { id , realmId } = req.params;
    
    try {
      const [updated] = await db.update(schema.sankalpas)
        .set({ 
          ...req.body, 
          updatedAt: new Date() 
        })
        .where(and(eq(schema.sankalpas.id, id), realmId && realmId !== 'all' ? eq(schema.sankalpas.realmId, realmId) : undefined))
        .returning();

      if (!updated) return res.status(404).json({ error: "Intenção não encontrada." });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erro ao refinar intenção." });
    }
  },

  // 4. REMOÇÃO
  async delete(req, res) {
    try {
      await db.delete(schema.sankalpas).where(and(eq(schema.sankalpas.id, req.params.id), realmId && realmId !== 'all' ? eq(schema.sankalpas.realmId, realmId) : undefined));
      res.json({ message: 'Sankalpa dissolvido.' });
    } catch (error) {
      res.status(500).json({ error: "Falha ao remover intenção." });
    }
  },

  // ===== ABSORÇÃO DE GOALS (V10) =====
  // Goals agora são Sankalpas com métricas (targetValue, currentValue, unit, deadline)
  // Estes métodos servem como aliases para compatibilidade com cliente (goals → sankalpas)

  // 5. LISTAR GOALS (alias para sankalpas)
  async listGoals(req, res) {
    return this.list(req, res);
  },

  // 6. CRIAR GOAL (alias para sankalpas)
  async createGoal(req, res) {
    // Valida que os campos de Goal estão presentes
    if (!req.body.title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }
    return this.create(req, res);
  },

  // 7. ATUALIZAR GOAL (alias para sankalpas)
  async updateGoal(req, res) {
    return this.update(req, res);
  },

  // 8. DELETAR GOAL (alias para sankalpas)
  async deleteGoal(req, res) {
    return this.delete(req, res);
  },

  // 9. LISTAR GOALS FILTRADO POR SANKALPA (Métricas de uma Intenção)
  async listGoalsBySankalpa(req, res) {
    const { sankalpaId, realmId } = req.query;
    
    try {
      if (!sankalpaId) {
        return res.status(400).json({ error: 'sankalpaId é obrigatório' });
      }

      const filters = [eq(schema.sankalpas.id, sankalpaId)];
      if (realmId && realmId !== 'all') {
        filters.push(eq(schema.sankalpas.realmId, realmId));
      }

      const goals = await db.select()
        .from(schema.sankalpas)
        .where(and(...filters));

      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar metas da intenção' });
    }
  },

  // 10. ATUALIZAR PROGRESSO DE GOAL (Sincronização de currentValue)
  async updateGoalProgress(req, res) {
    const { id } = req.params;
    const { currentValue } = req.body;

    try {
      if (currentValue === undefined) {
        return res.status(400).json({ error: 'currentValue é obrigatório' });
      }

      const [updated] = await db.update(schema.sankalpas)
        .set({ 
          currentValue: Number(currentValue),
          updatedAt: new Date()
        })
        .where(eq(schema.sankalpas.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Meta não encontrada' });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar progresso' });
    }
  }
};
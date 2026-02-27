/* src/api/controllers/papyrusController.js */
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const papyrusController = {
  // ... (getters mantidos) ...
  async getDocumentsByProject(req, res) {
    const { projectId , realmId } = req.params;
    const docs = await db.select().from(schema.papyrusDocuments)
      .where(and(eq(schema.papyrusDocuments.projectId, projectId), realmId && realmId !== 'all' ? eq(schema.papyrusDocuments.realmId, realmId) : undefined))
      .orderBy(desc(schema.papyrusDocuments.createdAt));
    res.json(docs);
  },
  
  async getDocumentById(req, res) {
    const { id, realmId } = req.params;
    const [doc] = await db.select().from(schema.papyrusDocuments).where(and(eq(schema.papyrusDocuments.id, id), realmId && realmId !== 'all' ? eq(schema.papyrusDocuments.realmId, realmId) : undefined));
    
    if (!doc) return res.status(404).json({ error: "Doc não encontrado" });
    
    // Opcional: Buscar versões junto se necessário, ou criar rota separada /:id/versions
    // const versions = await db.select().from(schema.papyrusVersions).where(and(eq(schema.papyrusVersions.documentId, doc.id), realmId && realmId !== 'all' ? eq(schema.papyrusVersions.realmId, realmId) : undefined));
    
    res.json(doc);
  },

  // Rota para buscar histórico
  async getDocumentVersions(req, res) {
      const { id, realmId } = req.params;
      const versions = await db.select().from(schema.papyrusVersions)
        .where(and(eq(schema.papyrusVersions.documentId, id), realmId && realmId !== 'all' ? eq(schema.papyrusVersions.realmId, realmId) : undefined))
        .orderBy(desc(schema.papyrusVersions.versionNumber));
      res.json(versions);
  },
  
  async createDocument(req, res) {
    try {
      const { title, content, projectId, authorId, documentType, energyLevel, mood, tags, insights, isPrivate, realmId } = req.body;
      
      // ==================== VALIDAÇÃO DE INPUT ====================
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Título é obrigatório e deve ser uma string' });
      }
      
      if (title.length > 255) {
        return res.status(400).json({ error: 'Título não pode exceder 255 caracteres' });
      }
      
      if (content && typeof content !== 'string') {
        return res.status(400).json({ error: 'Conteúdo deve ser uma string' });
      }
      
      if (content && content.length > 100000) {
        return res.status(400).json({ error: 'Conteúdo não pode exceder 100.000 caracteres' });
      }
      
      if (projectId && typeof projectId !== 'string') {
        return res.status(400).json({ error: 'projectId deve ser uma string' });
      }
      
      if (!authorId || typeof authorId !== 'string') {
        return res.status(400).json({ error: 'authorId é obrigatório' });
      }
      
      // ============================================================
      
      const newDoc = {
      id: createId('doc'),
      title,
      content,
      projectId,
      authorId,
      documentType: documentType || 'note',
      energyLevel: documentType === 'diary' ? energyLevel : null,
      mood: documentType === 'diary' ? mood : null,
      tags: documentType === 'diary' ? JSON.stringify(tags || []) : null,
      insights: documentType === 'diary' ? insights : null,
      isPrivate: documentType === 'diary' ? isPrivate : false,
      currentVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.insert(schema.papyrusDocuments).values(newDoc);
    
    // Cria a versão 1 (Gênese)
    await db.insert(schema.papyrusVersions).values({
        id: createId('ver'),
        realmId: realmId || 'personal',
        documentId: newDoc.id,
        content: content || '',
        versionNumber: 1,
        changeLog: 'Criação Inicial',
        modifiedBy: authorId,
        createdAt: new Date()
    });

    res.status(201).json(newDoc);
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      if (error.code === '23503') { // FK violation
        return res.status(400).json({ error: 'IDs de projeto ou autor inválidos' });
      }
      res.status(500).json({ error: 'Erro ao criar documento' });
    }
  },

  async updateDocument(req, res) {
    const { id, realmId: paramRealmId } = req.params;
    const { content, title, changeLog, userId, documentType, energyLevel, mood, tags, insights, isPrivate, realmId } = req.body;
    
    // Usa realmId do body se fornecido, senão usa do params
    const finalRealmId = realmId || paramRealmId;

    // 1. Busca estado atual
    const [currentDoc] = await db.select().from(schema.papyrusDocuments).where(and(eq(schema.papyrusDocuments.id, id), finalRealmId && finalRealmId !== 'all' ? eq(schema.papyrusDocuments.realmId, finalRealmId) : undefined));
    if (!currentDoc) return res.status(404).json({ error: "Doc não encontrado" });

    const newVersionNumber = (currentDoc.currentVersion || 1) + 1;

    // 2. Prepara dados de update
    const updateData = { 
      content, 
      title, 
      currentVersion: newVersionNumber,
      updatedAt: new Date(),
      documentType: documentType || 'note'
    };
    
    // Adiciona campos de diário se documentType === 'diary'
    if (documentType === 'diary') {
      updateData.energyLevel = energyLevel;
      updateData.mood = mood;
      updateData.tags = JSON.stringify(tags || []);
      updateData.insights = insights;
      updateData.isPrivate = isPrivate;
    } else {
      // Limpa campos de diário se não for diário
      updateData.energyLevel = null;
      updateData.mood = null;
      updateData.tags = null;
      updateData.insights = null;
      updateData.isPrivate = false;
    }

    // 3. Atualiza o Documento Principal
    const [updated] = await db.update(schema.papyrusDocuments)
      .set(updateData)
      .where(and(eq(schema.papyrusDocuments.id, id), finalRealmId && finalRealmId !== 'all' ? eq(schema.papyrusDocuments.realmId, finalRealmId) : undefined))
      .returning();

    // 4. Cria o Registro Histórico (Snapshot)
    await db.insert(schema.papyrusVersions).values({
        id: createId('ver'),
        realmId: finalRealmId || 'personal',
        documentId: id,
        content: content,
        versionNumber: newVersionNumber,
        changeLog: changeLog || 'Atualização',
        modifiedBy: userId,
        createdAt: new Date()
    });

    res.json(updated);
  },

  async deleteDocument(req, res) {
    const { id, realmId } = req.params;
    await db.delete(schema.papyrusDocuments).where(and(eq(schema.papyrusDocuments.id, id), realmId && realmId !== 'all' ? eq(schema.papyrusDocuments.realmId, realmId) : undefined));
    res.json({ message: "Deletado" });
  },

  // === NOVOS MÉTODOS PARA DASHBOARD DE DIÁRIOS ===

  async getDiariesByAuthor(authorId) {
    const diaries = await db.select()
      .from(schema.papyrusDocuments)
      .where(
        and(
          eq(schema.papyrusDocuments.authorId, authorId),
          eq(schema.papyrusDocuments.documentType, 'diary')
        )
      )
      .orderBy(desc(schema.papyrusDocuments.createdAt));

    return diaries || [];
  },

  async getDiaryStats(authorId) {
    const diaries = await this.getDiariesByAuthor(authorId);

    if (diaries.length === 0) {
      return {
        totalDiaries: 0,
        energyAverage: 0,
        moods: {},
        topTags: []
      };
    }

    // Energy stats
    const energies = diaries.filter(d => d.energyLevel).map(d => d.energyLevel);
    const energyAverage = energies.length > 0 ? energies.reduce((a, b) => a + b, 0) / energies.length : 0;

    // Mood distribution
    const moods = {};
    diaries.forEach(d => {
      if (d.mood) {
        moods[d.mood] = (moods[d.mood] || 0) + 1;
      }
    });

    // Top tags
    const tagCounts = {};
    diaries.forEach(d => {
      if (d.tags) {
        try {
          const tags = Array.isArray(d.tags) ? d.tags : JSON.parse(d.tags || '[]');
          tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        } catch (e) {
          console.error('Error parsing tags:', e);
        }
      }
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    return {
      totalDiaries: diaries.length,
      energyAverage: energyAverage.toFixed(2),
      moods,
      topTags
    };
  },

  async getEnergyTimeline(authorId) {
    const diaries = await this.getDiariesByAuthor(authorId);

    const weekData = {};
    diaries.forEach(diary => {
      if (diary.energyLevel) {
        const date = new Date(diary.createdAt);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weekData[weekKey]) {
          weekData[weekKey] = [];
        }
        weekData[weekKey].push(diary.energyLevel);
      }
    });

    return Object.entries(weekData)
      .map(([week, energies]) => ({
        week,
        average: (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1),
        min: Math.min(...energies),
        max: Math.max(...energies),
        count: energies.length
      }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));
  },

  async getMoodDistribution(authorId) {
    const diaries = await this.getDiariesByAuthor(authorId);

    const weekData = {};
    diaries.forEach(diary => {
      if (diary.mood) {
        const date = new Date(diary.createdAt);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weekData[weekKey]) {
          weekData[weekKey] = {};
          ['calm', 'joy', 'focus', 'creativity', 'anxiety', 'confusion', 'gratitude', 'sadness'].forEach(m => {
            weekData[weekKey][m] = 0;
          });
        }
        weekData[weekKey][diary.mood]++;
      }
    });

    return Object.entries(weekData)
      .map(([week, moods]) => ({
        week,
        moods,
        total: Object.values(moods).reduce((a, b) => a + b, 0)
      }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));
  },

  async getHolisticStats(req, res) {
    try {
      const authorId = req.user.id;
      const stats = await this.getDiaryStats(authorId);
      
      return res.status(200).json({
        success: true,
        data: {
          totalDiaries: stats.totalDiaries,
          energyAverage: parseFloat(stats.energyAverage) || 0,
          moods: stats.moods,
          topTags: stats.topTags,
          trend: '+0.3', // Placeholder - seria calculado vs semana anterior
          lastUpdateTime: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error getting holistic stats:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error retrieving holistic statistics' 
      });
    }
  },

  async getTopTags(req, res) {
    try {
      const authorId = req.user.id;
      const stats = await this.getDiaryStats(authorId);
      
      return res.status(200).json({
        success: true,
        data: stats.topTags
      });
    } catch (error) {
      console.error('Error getting top tags:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error retrieving top tags' 
      });
    }
  },

  async getRecentDiaries(req, res) {
    try {
      const authorId = req.user.id;
      const limit = parseInt(req.query.limit || '10');
      
      const diaries = await this.getDiariesByAuthor(authorId);
      const recent = diaries.slice(0, limit);
      
      return res.status(200).json({
        success: true,
        data: recent.map(d => ({
          id: d.id,
          title: d.title,
          energyLevel: d.energyLevel,
          mood: d.mood,
          tags: d.tags,
          createdAt: d.createdAt,
          preview: d.content?.substring(0, 100) + '...'
        }))
      });
    } catch (error) {
      console.error('Error getting recent diaries:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error retrieving recent diaries' 
      });
    }
  },

  async getAshInsights(req, res) {
    try {
      const authorId = req.user.id;
      const stats = await this.getDiaryStats(authorId);
      
      // Análise simples para gerar insights iniciais
      const insights = [];
      const energyAvg = parseFloat(stats.energyAverage) || 0;
      const moods = stats.moods || {};
      
      // Insight de energia
      if (energyAvg < 2) {
        insights.push({
          type: 'warning',
          title: 'Energia baixa detectada',
          message: 'Sua energia tem estado abaixo do normal. Considere práticas restaurativas.',
          icon: 'IconZap'
        });
      } else if (energyAvg > 4) {
        insights.push({
          type: 'success',
          title: 'Energia elevada',
          message: 'Sua energia está fluindo bem! Aproveite esse momento para projetos desafiadores.',
          icon: 'IconVision'
        });
      }
      
      // Insight de humor
      const topMood = Object.entries(moods).sort(([,a], [,b]) => b - a)[0];
      if (topMood) {
        const moodEmojis = {
          calm: '😌',
          joy: '😊',
          focus: '🎯',
          creativity: '✨',
          anxiety: '😰',
          confusion: '😕',
          gratitude: '🙏',
          sadness: '😢'
        };
        
        insights.push({
          type: 'info',
          title: `Padrão: Predominância de ${topMood[0]}`,
          message: `Você tem experimentado frequentemente ${topMood[0]} (${topMood[1]} vezes).`,
          icon: 'IconSoul',
          emoji: moodEmojis[topMood[0]] || '😊'
        });
      }
      
      // Insight de consistência
      if (stats.totalDiaries > 20) {
        insights.push({
          type: 'success',
          title: 'Prática consistente',
          message: `Você registrou ${stats.totalDiaries} diários! Essa consistência alimenta clareza.`,
          icon: 'IconFlame'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          insights,
          summary: `Você tem vivido com energia média de ${energyAvg.toFixed(1)}/5. Total de ${stats.totalDiaries} registros. Continue nutriendo a clareza.`,
          suggestions: [
            'Mantenha uma rotina de energização matinal',
            'Registre seus padrões de mood para maior clareza',
            'Use os tags para identificar padrões'
          ]
        }
      });
    } catch (error) {
      console.error('Error getting Ash insights:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error retrieving Ash insights' 
      });
    }
  }
};
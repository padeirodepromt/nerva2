/* src/api/diaryRoutes.js
   desc: Rotas API para dashboard de diários (analytics, filtering, etc)
*/
import express from 'express';
import { papyrusController } from './controllers/papyrusController.js';

export const diaryRoutes = express.Router();

// GET /api/diaries - Listar diários do usuário com filtros
diaryRoutes.get('/', async (req, res) => {
  const { authorId } = req.query;

  if (!authorId) {
    return res.status(400).json({ error: 'authorId is required' });
  }

  try {
    const diaries = await papyrusController.getDiariesByAuthor(authorId);
    res.json(diaries || []);
  } catch (e) {
    console.error('Error fetching diaries:', e);
    res.status(500).json({ error: 'Failed to fetch diaries' });
  }
});

// GET /api/diaries/stats - Estatísticas gerais
diaryRoutes.get('/stats', async (req, res) => {
  const { authorId } = req.query;

  if (!authorId) {
    return res.status(400).json({ error: 'authorId is required' });
  }

  try {
    const stats = await papyrusController.getDiaryStats(authorId);
    res.json(stats);
  } catch (e) {
    console.error('Error fetching stats:', e);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/diaries/timeline - Timeline de energia
diaryRoutes.get('/timeline', async (req, res) => {
  const { authorId } = req.query;

  if (!authorId) {
    return res.status(400).json({ error: 'authorId is required' });
  }

  try {
    const timeline = await papyrusController.getEnergyTimeline(authorId);
    res.json(timeline);
  } catch (e) {
    console.error('Error fetching timeline:', e);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// GET /api/diaries/moods - Distribuição de moods
diaryRoutes.get('/moods', async (req, res) => {
  const { authorId } = req.query;

  if (!authorId) {
    return res.status(400).json({ error: 'authorId is required' });
  }

  try {
    const moods = await papyrusController.getMoodDistribution(authorId);
    res.json(moods);
  } catch (e) {
    console.error('Error fetching moods:', e);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

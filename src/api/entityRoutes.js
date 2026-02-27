/* src/api/entityRoutes.js
   desc: Rotas da API V7. Rotas de Kanban e Nexus restauradas.
   fix: Rotas /users/me removida, e rotas faltantes para kanban/nexus adicionadas.
*/
import express from 'express';
import { userController } from './controllers/userController.js';
import { teamController } from './controllers/teamController.js';
import { projectController } from './controllers/projectController.js';
import { taskController } from './controllers/taskController.js';
import { recordController } from './controllers/recordController.js'; // <--- Importe o novo controller
import { associationController } from './controllers/associationController.js'; // <--- Importe o controller de associações
import { templateController } from './controllers/templateController.js';
import { papyrusController } from './controllers/papyrusController.js';
import { nexusController } from './controllers/nexusController.js'; // <-- Restaurado
import { sankalpaController } from './controllers/sankalpaController.js';
import { weeklyTaskController } from './controllers/weeklyTaskController.js';
import { checkInController } from './controllers/checkInController.js';
import { astralProfileController } from './controllers/astralProfileController.js';
import { mindMapController } from './controllers/mindMapController.js';
import { kanbanController } from './controllers/kanbanController.js'; // <-- Restaurado
import { customFieldController } from './controllers/customFieldController.js';
import { tagsController } from './controllers/tagsController.js'; // <-- NOVO
import { projectTemplatesController } from './controllers/projectTemplatesController.js'; // <-- NOVO
import { routineController } from './controllers/routineController.js';
import { projectViewController } from './controllers/projectViewController.js';
import { menstrualCycleController } from './controllers/menstrualCycleController.js';
import { eventController } from './controllers/eventController.js'; // <-- Events
import { thoughtController } from './controllers/thoughtController.js'; // <-- Thoughts
import astrologyService from '../ai_services/astrologyService.js';

const router = express.Router();

// --- RECURSOS PROTEGIDOS (USUÁRIOS/ENTIDADES) ---

// Rotas de Usuário (Apenas Listagem e Criação, pois /users/me é no authRoutes)
router.get('/users', (req, res) => userController.list(req, res));
router.post('/users', (req, res) => userController.create(req, res));

router.get('/teams', (req, res) => teamController.list(req, res));
router.post('/teams', (req, res) => teamController.create(req, res));

router.get('/projects', (req, res) => projectController.list(req, res));
router.get('/projects/:id', (req, res) => projectController.get(req, res));
router.post('/projects', (req, res) => projectController.create(req, res)); 
router.put('/projects/:id', (req, res) => projectController.update(req, res));
router.delete('/projects/:id', (req, res) => projectController.delete(req, res));

// PROJECT VIEWS (Sheet, Kanban, Map, etc.)
router.get('/projects/:id/views/sheet', (req, res) => projectViewController.getSheetView(req, res));
router.get('/projects/:id/views/kanban', (req, res) => projectViewController.getKanbanView(req, res));
router.get('/projects/:id/sheet-columns', (req, res) => projectViewController.getSheetColumns(req, res));
router.put('/projects/:id/sheet-columns', (req, res) => projectViewController.updateSheetColumns(req, res));

router.get('/tasks', (req, res) => taskController.list(req, res));
router.get('/tasks/:id', (req, res) => taskController.getById(req, res));
router.post('/tasks', (req, res) => taskController.create(req, res));
router.put('/tasks/:id', (req, res) => taskController.update(req, res));
router.delete('/tasks/:id', (req, res) => taskController.delete(req, res));

// CUSTOM FIELDS
router.post('/tasks/:id/custom-fields', (req, res) => taskController.setCustomFieldValue(req, res));
router.get('/tasks/:id/custom-fields', (req, res) => taskController.getCustomFieldValue(req, res));

// --- FLUXO E CONEXÕES (KANBAN e NEXUS RESTAURADOS) ---
// As rotas de Kanban e Nexus agora estão montadas para garantir que seus controladores sejam usados.

// KANBAN
router.get('/kanban/statuses', (req, res) => kanbanController.listStatuses(req, res));
router.put('/kanban/reorder', (req, res) => kanbanController.reorder(req, res));

// NEXUS
router.get('/nexus/history', (req, res) => nexusController.getHistory(req, res));
router.get('/nexus/connections', (req, res) => nexusController.getConnections(req, res));


// --- PLANNING & ROUTINES (O Tempo) ---
router.get('/routines', (req, res) => routineController.list(req, res));
router.post('/routines', (req, res) => routineController.create(req, res));
router.put('/routines/:id', (req, res) => routineController.update(req, res));
router.delete('/routines/:id', (req, res) => routineController.delete(req, res));

router.get('/sankalpas', (req, res) => sankalpaController.list(req, res));
router.post('/sankalpas', (req, res) => sankalpaController.create(req, res));
router.put('/sankalpas/:id', (req, res) => sankalpaController.update(req, res));
router.delete('/sankalpas/:id', (req, res) => sankalpaController.delete(req, res));

// [V10] GOALS (Absorvido por Sankalpas) - Rotas alias para compatibilidade
router.get('/goals', (req, res) => sankalpaController.listGoals(req, res));
router.post('/goals', (req, res) => sankalpaController.createGoal(req, res));
router.put('/goals/:id', (req, res) => sankalpaController.updateGoal(req, res));
router.delete('/goals/:id', (req, res) => sankalpaController.deleteGoal(req, res));
router.put('/goals/:id/progress', (req, res) => sankalpaController.updateGoalProgress(req, res));


router.get('/weekly-tasks', (req, res) => weeklyTaskController.list(req, res));
router.post('/weekly-tasks', (req, res) => weeklyTaskController.create(req, res));
router.put('/weekly-tasks/:id', (req, res) => weeklyTaskController.update(req, res));
router.delete('/weekly-tasks/:id', (req, res) => weeklyTaskController.delete(req, res));

// --- KNOWLEDGE & DOCS (O Conhecimento) ---
router.get('/papyrus', (req, res) => papyrusController.getDocumentsByProject(req, res)); 
router.get('/papyrus/:id', (req, res) => papyrusController.getDocumentById(req, res));
router.post('/papyrus', (req, res) => papyrusController.createDocument(req, res));
router.put('/papyrus/:id', (req, res) => papyrusController.updateDocument(req, res));
router.delete('/papyrus/:id', (req, res) => papyrusController.deleteDocument(req, res));
router.get('/papyrus/:id/versions', (req, res) => papyrusController.getDocumentVersions(req, res));

// --- [V10] EVENTS (As Âncoras do Tempo) ---
router.get('/events', (req, res) => eventController.list(req, res));
router.post('/events', (req, res) => eventController.create(req, res));
router.put('/events/:id', (req, res) => eventController.update(req, res));
router.delete('/events/:id', (req, res) => eventController.delete(req, res));

// --- [V10] THOUGHTS / SPARKS (As Sementes) ---
router.get('/thoughts', (req, res) => thoughtController.list(req, res));
router.post('/thoughts', (req, res) => thoughtController.create(req, res));
router.post('/thoughts/:id/transmute', (req, res) => thoughtController.transmute(req, res));
router.delete('/thoughts/:id', (req, res) => thoughtController.delete(req, res));

// ============================================================================
// RECORDS (DADOS ESTÁTICOS / PLANILHA V8)
// ============================================================================
router.post('/records', recordController.createRecord);
router.put('/records/:id', recordController.updateRecord);
router.delete('/records/:id', recordController.deleteRecord);
router.get('/records/project/:projectId', recordController.listProjectRecords);

// ============================================================================
// ASSOCIAÇÕES (VÍNCULOS ENTRE ENTIDADES)
// ============================================================================
// Rota mágica: Cria uma tarefa a partir de uma linha da planilha
router.post('/associations/create-task-from-record', associationController.createTaskFromRecord);
router.post('/associations/link', associationController.linkEntities);

// ...
// MIND MAPS
router.get('/mind-maps', (req, res) => mindMapController.listMaps(req, res));
router.post('/mind-maps', (req, res) => mindMapController.createMap(req, res));
router.get('/mind-maps/:id', (req, res) => mindMapController.getMap(req, res));

// NÓS
router.get('/mindmap-nodes', (req, res) => mindMapController.listNodes(req, res));
router.post('/mindmap-nodes', (req, res) => mindMapController.createNode(req, res));
router.put('/mindmap-nodes/:id', (req, res) => mindMapController.updateNode(req, res));
router.delete('/mindmap-nodes/:id', (req, res) => mindMapController.deleteNode(req, res)); 

// EDGES (Novo)
router.get('/mindmap-edges', (req, res) => mindMapController.listEdges(req, res));
router.post('/mindmap-edges', (req, res) => mindMapController.createEdge(req, res));
router.delete('/mindmap-edges/:id', (req, res) => mindMapController.deleteEdge(req, res));

// --- ENERGY & ASTRAL (O Espírito) ---
router.get('/energy-checkins', (req, res) => checkInController.list(req, res));
router.post('/energy-checkins', (req, res) => checkInController.create(req, res));

router.get('/menstrual-cycles', (req, res) => menstrualCycleController.list(req, res));
router.get('/menstrual-cycles/latest', (req, res) => menstrualCycleController.getLatest(req, res));
router.post('/menstrual-cycles', (req, res) => menstrualCycleController.create(req, res));
router.put('/menstrual-cycles/:id', (req, res) => menstrualCycleController.update(req, res));
router.delete('/menstrual-cycles/:id', (req, res) => menstrualCycleController.delete(req, res));

router.get('/astral/today', (req, res) => {
  try {
    const now = new Date();
    const chart = astrologyService.getFullAstrologicalChart(now);
    const moonPhase = astrologyService.getMoonPhase(now);
    const houses = astrologyService.getHouses(now);
    
    // Gerar leitura REAL dos transitos do dia (não genérica!)
    const reading = astrologyService.generateDailyReading(null); // Usa transitos reais
    
    const sunSign = chart.luminaries?.sun?.sign || 'Desconhecido';
    const sunElement = chart.luminaries?.sun?.element || 'Éter';
    const moonSign = chart.luminaries?.moon?.sign || 'Desconhecido';
    
    const astralData = {
      sunSign,
      sunElement,
      moonSign,
      moonPhase: {
        phase: moonPhase?.phase || 'Desconhecida',
        energy: moonPhase?.energy || ''
      },
      reading, // LEITURA REAL dos transitos analisados
      transits: chart.summary || {},
      houses: houses
    };

    res.json(astralData);
  } catch (error) {
    console.error('[Astral Today] Erro:', error.message);
    res.status(500).json({ error: 'Falha ao gerar dados astrológicos do dia' });
  }
}); 
router.get('/astral-profiles', (req, res) => astralProfileController.get(req, res));
router.post('/astral-profiles', (req, res) => astralProfileController.upsert(req, res));
router.get('/astral-profiles/chart', (req, res) => astralProfileController.getFullChart(req, res));
router.get('/astral-profiles/sky-analysis', (req, res) => astralProfileController.getSkyAnalysisToday(req, res));
router.get('/astral-profiles/document', (req, res) => astralProfileController.generateAstralDocument(req, res));

// --- UTILS ---
router.get('/templates', (req, res) => templateController.list(req, res));
router.get('/custom-fields', (req, res) => customFieldController.list(req, res));

// === NOVO: TAGS ===
router.get('/tags', (req, res) => tagsController.list(req, res));
router.get('/tags/suggested', (req, res) => tagsController.suggested(req, res));
router.post('/tags', (req, res) => tagsController.create(req, res));
router.post('/tags/add-to-task', (req, res) => tagsController.addToTask(req, res));
router.post('/tags/remove-from-task', (req, res) => tagsController.removeFromTask(req, res));
router.get('/tags/:tagId/items', (req, res) => tagsController.getItems(req, res));
router.delete('/tags/:id', (req, res) => tagsController.delete(req, res));

// === NOVO: PROJECT TEMPLATES ===
router.get('/project-templates', (req, res) => projectTemplatesController.list(req, res));
router.get('/project-templates/:id', (req, res) => projectTemplatesController.get(req, res));
router.post('/project-templates', (req, res) => projectTemplatesController.create(req, res));
router.post('/project-templates/:id/apply', (req, res) => projectTemplatesController.applyTemplate(req, res));
router.delete('/project-templates/:id', (req, res) => projectTemplatesController.delete(req, res));

export default router;
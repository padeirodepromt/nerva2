/* src/ai_services/contextEngine.js
   desc: O Filtro de Realidade do Ash V10 (Neural OS).
   feat: Injeção de activeRealmId em todas as varreduras (Poda Radical).
   feat: Consciência de Insights (Thoughts) e Calendário (Events).
   status: INTEGRAL & CORRIGIDO (Resolvido erro de snapshot.upcomingEvents).
*/
import { db } from '../db/index.js';
import { eq, and, desc, asc, gt } from 'drizzle-orm';

// Blindagem de Importação (Sincronia entre DNA Legacy e V10)
import * as CoreSchema from '../db/schema/core.js';
import * as PlanningSchema from '../db/schema/planning.js';
import * as DocsSchema from '../db/schema/docs.js';
import * as EnergySchema from '../db/schema/energy.js';

const projects = CoreSchema.projects;
const tasks = PlanningSchema.tasks;
const routines = PlanningSchema.routines;
const thoughts = PlanningSchema.thoughts; 
const events = PlanningSchema.events; 
const docs = DocsSchema.docs || DocsSchema.documents;
const energyLevels = EnergySchema.energyLevels || EnergySchema.dailyEnergy;

export const ContextEngine = {

  /**
   * Coleta o snapshot neural sintonizado com o Realm ativo
   * @param {string} userId 
   * @param {string} currentView 
   * @param {string} activeEntityId 
   * @param {string} activeRealmId - 'personal', 'professional' ou 'all'
   */
  async gatherContext(userId, currentView, activeEntityId = null, activeRealmId = 'personal') {
    try {
      // 1. Inicialização Segura do Snapshot (Prevenção de Undefined)
      const contextSnapshot = {
        activeRealm: activeRealmId,
        userState: { level: 50, sentiment: "Neutro", ai_directive: "Estável" },
        activeProject: null,
        relatedTasks: [],
        relevantDocs: [],
        activeRoutines: [],
        pendingInsights: [],
        upcomingEvents: [], 
        systemTime: new Date().toLocaleString('pt-BR'),
        viewFocus: currentView
      };

      // 2. Coletores com Poda Radical (Paralelismo para performance)
      const [userState, routinesData, insights, calendar] = await Promise.all([
        this._getUserState(userId, activeRealmId),
        this._getActiveRoutines(userId, activeRealmId),
        this._getPendingInsights(userId, activeRealmId),
        this._getUpcomingEvents(userId, activeRealmId)
      ]);

      contextSnapshot.userState = userState;
      contextSnapshot.activeRoutines = routinesData;
      contextSnapshot.pendingInsights = insights;
      contextSnapshot.upcomingEvents = calendar;

      // 3. Coleta de Contexto Geográfico (Onde o usuário está na UI)
      if (currentView === 'project' && activeEntityId) {
        contextSnapshot.activeProject = await this._getProjectDetails(activeEntityId, activeRealmId);
        contextSnapshot.relatedTasks = await this._getProjectTasks(activeEntityId, activeRealmId);
        if (docs) contextSnapshot.relevantDocs = await this._getProjectDocs(activeEntityId);
      }
      
      if (currentView === 'dashboard' || currentView === 'planner') {
        contextSnapshot.activeProject = { title: "Nexus Explorer", description: "Visão Geral do Multiverso." };
        contextSnapshot.relatedTasks = await this._getHighPriorityTasks(userId, activeRealmId);
      }

      // 4. Formatação Final para o LLM
      return this._formatContextForLLM(contextSnapshot);

    } catch (error) {
      console.error("🔥 ContextEngine Critical Error:", error);
      return "O Ash está operando em Modo de Emergência (Cego). Peça ao Arquiteto para verificar os logs do servidor.";
    }
  },

  // --- MÉTODOS PRIVADOS DE COLETA (DNA V10) ---

  async _getUserState(userId, realm) {
    try {
        if (!energyLevels) return { level: 50, sentiment: "Estável", ai_directive: "Equilibrado" };
        const lastEnergy = await db.select().from(energyLevels)
          .where(eq(energyLevels.userId, userId))
          .orderBy(desc(energyLevels.createdAt)).limit(1);

        const level = lastEnergy[0]?.level || 50;
        let directive = "Foco no presente.";

        if (realm === 'professional') {
            directive = level > 70 ? "ALTA PERFORMANCE: Deep Work." : "SOBRECARGA: Minimalismo.";
        } else {
            directive = level > 70 ? "PRESENÇA: Conexão e Lazer." : "REGENERAÇÃO: Repouso.";
        }

        return { level, sentiment: lastEnergy[0]?.mood || "Estável", ai_directive: directive };
    } catch (e) { return { level: 50, sentiment: "Estável", ai_directive: "Estável" }; }
  },

  async _getActiveRoutines(userId, realm) {
    try {
        const filters = [eq(routines.userId, userId)];
        if (realm !== 'all') filters.push(eq(routines.realmId, realm));
        return await db.select().from(routines).where(and(...filters)).limit(5);
    } catch (e) { return []; }
  },

  async _getUpcomingEvents(userId, realm) {
    try {
        const now = new Date();
        const filters = [eq(events.ownerId, userId), gt(events.endTime, now)];
        if (realm !== 'all') filters.push(eq(events.realmId, realm));

        return await db.select().from(events)
                 .where(and(...filters))
                 .orderBy(asc(events.startTime))
                 .limit(3);
    } catch (e) { return []; }
  },

  async _getPendingInsights(userId, realm) {
    try {
        const filters = [eq(thoughts.ownerId, userId), eq(thoughts.status, 'seed')];
        if (realm !== 'all') filters.push(eq(thoughts.realmId, realm));
        return await db.select({ id: thoughts.id, title: thoughts.title }).from(thoughts).where(and(...filters)).limit(5);
    } catch (e) { return []; }
  },

  async _getProjectDetails(projectId, realm) {
    try {
      const filters = [eq(projects.id, projectId)];
      if (realm !== 'all') filters.push(eq(projects.realmId, realm));
      const res = await db.select().from(projects).where(and(...filters));
      return res[0] || null;
    } catch (e) { return null; }
  },

  async _getProjectTasks(projectId, realm) {
    try {
      const filters = [eq(tasks.projectId, projectId), eq(tasks.status, 'todo')];
      if (realm !== 'all') filters.push(eq(tasks.realmId, realm));
      return await db.select({ title: tasks.title, priority: tasks.priority }).from(tasks).where(and(...filters)).limit(10);
    } catch (e) { return []; }
  },

  async _getHighPriorityTasks(userId, realm) {
    try {
      const filters = [eq(tasks.userId, userId), eq(tasks.status, 'todo')];
      if (realm !== 'all') filters.push(eq(tasks.realmId, realm));
      return await db.select({ title: tasks.title, priority: tasks.priority }).from(tasks).where(and(...filters)).orderBy(desc(tasks.priority)).limit(5);
    } catch (e) { return []; }
  },

  async _getProjectDocs(projectId) {
    try {
      if (!docs) return [];
      return await db.select({ title: docs.title }).from(docs).where(eq(docs.projectId, projectId)).limit(5);
    } catch (e) { return []; }
  },

  // --- FORMATADOR DE PROMPT V10 (WABI-SABI) ---

  _formatContextForLLM(snapshot) {
    const realmLabel = snapshot.activeRealm === 'professional' ? '💼 PROFISSIONAL' : (snapshot.activeRealm === 'personal' ? '🌿 PESSOAL' : '🌌 UNIFICADO');

    return `
--- CONTEXTO ATIVO DO ARQUITETO ---
[UNIVERSO: ${realmLabel}]
- View: ${snapshot.viewFocus} | Hora: ${snapshot.systemTime}

[ESTADO VITAL]
- Energia: ${snapshot.userState.level}% | Mood: ${snapshot.userState.sentiment}
- DIRETRIZ: ${snapshot.userState.ai_directive}

[CALENDÁRIO (ÂNCORES)]
${snapshot.upcomingEvents?.length > 0 
  ? snapshot.upcomingEvents.map(e => ` - ${e.title} (${new Date(e.startTime).getHours()}h)`).join('\n')
  : ' - (Agenda livre de compromissos fixos)'}

[GEOMETRIA TEMPORAL (RITUAIS)]
${snapshot.activeRoutines?.length > 0 
  ? snapshot.activeRoutines.map(r => ` - [${r.behavior}] ${r.title}`).join('\n')
  : ' - (Nenhum ritual ativo)'}

[INSIGHTS (SEMENTES)]
${snapshot.pendingInsights?.length > 0 
  ? snapshot.pendingInsights.map(i => ` - Spark: "${i.title}"`).join('\n') + " -> Use 'manage_thought' para transmutá-los se o usuário divagar."
  : ' - (Sem sementes pendentes)'}

[CONTEÚDO VISÍVEL]
${snapshot.activeProject ? `- Foco: ${snapshot.activeProject.title}` : '- Navegação Geral'}
- Tarefas Pendentes:
${snapshot.relatedTasks?.length > 0 
  ? snapshot.relatedTasks.map(t => `   • ${t.title} [Prio: ${t.priority}]`).join('\n') 
  : '   (Nenhuma tarefa visível)'}

DIRETRIZ DE RESPOSTA DO ASH:
1. Poda Radical: Não sugira ações Pro se o universo for Pessoal.
2. Biorritmo: Se a diretriz for REGENERAÇÃO, seja breve e protetor.
3. Alquimia: Identifique se o usuário está falando de um Insight já capturado.
---------------------------------------------------
`;
  }
};
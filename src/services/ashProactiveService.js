/**
 * src/services/ashProactiveService.js
 * DESCRIÇÃO: O "Lobo Frontal" do Ash.
 * FUNÇÃO: 
 * 1. Observa dados (Tarefas, Tempo, Energia).
 * 2. Verifica a "Resolução" do Usuário (Plano atual).
 * 3. Decide se age (Notificação/Chat) ou se fica em silêncio.
 */

// Comentado: Imports de frontend que causam erro no backend
// import { canUserAccess } from '../config/plansConfig.js'; // A chave mestra
// import { useTaskStore } from '../stores/useTaskStore.js';
// import { useAgentStore } from '../stores/useAgentStore.js';
// import notificationService from './notificationService.js';

class AshProactiveService {
  
  constructor() {
    this.checkInterval = null;
    // Cache para evitar que o Ash repita o mesmo insight a cada 15 min
    this.processedAlerts = new Set(); 
  }

  // ===========================================================================
  // 1. CICLO DE VIDA
  // ===========================================================================

  /**
   * Inicia a consciência do Ash.
   * Chamado no App.jsx quando o usuário loga.
   */
  startMonitoring(userPlan) {
    if (this.checkInterval) clearInterval(this.checkInterval);
    
    console.log(`[Ash] 👁️ Consciência Iniciada. Nível de Acesso: ${userPlan}`);

    // Inicializa o canal físico de notificações (se o device permitir)
    notificationService.initPushNotifications();

    // Inicia o Loop Cognitivo (Verificação periódica quando o app está aberto)
    this.checkInterval = setInterval(() => {
      this.runCognitiveCycle(userPlan);
    }, 15 * 60 * 1000); // Roda a cada 15 minutos

    // Executa uma análise imediata ao abrir o app
    this.runCognitiveCycle(userPlan);
  }

  stopMonitoring() {
    if (this.checkInterval) clearInterval(this.checkInterval);
    console.log('[Ash] 💤 Consciência Hibernando.');
  }

  

  // ===========================================================================
  // 2. O FILTRO DE REALIDADE (A Lógica dos Planos + Preferências)
  // ===========================================================================

  async runCognitiveCycle(userPlan) {
    // 1. Pega os dados brutos (Tarefas, Tempo)
    const state = {
      tasks: useTaskStore.getState().tasks || [],
      now: new Date()
    };

    // 2. Pega as Preferências do Usuário (Os botões que ele ligou/desligou)
    // Se não tiver preferência salva, assume 'true' (ligado) por padrão ou 'false' dependendo da sua regra
    const prefs = useAgentStore.getState().preferences || {};

    // --- NIVEL 1: SEMENTE (GRÁTIS) ---
    // Ash é mudo. O código nem passa daqui se for Semente (pois os 'canUserAccess' abaixo darão false).

    // --- NIVEL 2: NASCENTE (TEMPO) ---
    // Lógica: O Plano permite? E O Usuário quer?
    if (canUserAccess(userPlan, 'proactive_time') && prefs.notify_time) {
      // Verifica atrasos e urgências da semana
      this.checkTimeBlockers(state);
      this.checkWeeklyUrgency(state); // Aquela lógica nova de "2 projetos urgentes"
    }

    // --- NIVEL 3: FLORESTA (FLUXO) ---
    if (canUserAccess(userPlan, 'proactive_flow') && prefs.notify_flow) {
      // Verifica estagnação
      this.checkSystemStagnation(state);
      this.checkProjectStagnation(state); // Aquela lógica nova de "1 semana sem tocar"
    }

    // --- NIVEL 4: ECOSSISTEMA (ENERGIA) ---
    if (canUserAccess(userPlan, 'proactive_energy') && prefs.notify_energy) {
      // Verifica o match energético
      // Mock de energia (futuramente conectar ao useEnergyStore)
      const currentEnergy = 'low'; 
      this.checkVitalityConflicts(state, currentEnergy);
      this.checkEnergyTrend(state); // Aquela lógica nova de "Notei sua energia baixa"
    }
  }

  // ===========================================================================
  // 3. AS INTELIGÊNCIAS ESPECÍFICAS
  // ===========================================================================

  /**
   * [NASCENTE+] Verifica atrasos e sobrecarga temporal.
   */
  checkTimeBlockers({ tasks, now }) {
    // Filtra tarefas vencidas não concluídas
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done');
    
    if (overdue.length >= 3) {
      const alertId = `overdue_${now.toDateString()}`;
      
      // Só avisa se ainda não avisou hoje
      if (!this.processedAlerts.has(alertId)) {
        this.deliverInsight(
          "Dissonância Temporal",
          `Percebo ${overdue.length} ciclos abertos no passado. Isso cria ruído mental. Quer ajuda para renegociar os prazos para hoje?`,
          "time_alert"
        );
        this.processedAlerts.add(alertId);
      }
    }
  }

  /**
   * [FLORESTA+] Verifica projetos parados ou falta de movimento.
   */
  checkSystemStagnation({ tasks }) {
    // Exemplo: Muitas tarefas em "Waiting" ou sem tags
    const stagnantTasks = tasks.filter(t => t.status === 'waiting');

    if (stagnantTasks.length > 5) {
      const alertId = 'stagnation_alert';
      if (!this.processedAlerts.has(alertId)) {
        this.deliverInsight(
          "Fluxo Represado",
          "Sua energia está parada em muitas esperas. O sistema flui melhor quando tomamos decisões. Vamos destravar algo?",
          "flow_insight"
        );
        this.processedAlerts.add(alertId);
      }
    }
  }

  /**
   * [ECOSSISTEMA] O ápice. Cruza dados "Duros" (Tarefas) com "Moles" (Energia).
   */
  checkVitalityConflicts({ tasks }, userEnergy) {
    // Se energia está baixa e tem tarefa "Alta Prioridade" hoje
    const hasHeavyLifting = tasks.some(t => t.priority === 'high' && t.status === 'todo');

    if (userEnergy === 'low' && hasHeavyLifting) {
      const alertId = `energy_protect_${new Date().toDateString()}`;
      
      if (!this.processedAlerts.has(alertId)) {
        this.deliverInsight(
          "Preservação de Vitalidade",
          "Sua energia pede recolhimento (Lua Minguante), mas sua lista exige expansão. Recomendo mover a tarefa pesada para amanhã.",
          "energy_protect"
        );
        this.processedAlerts.add(alertId);
      }
    }
  }

  // ===========================================================================
  // NOVAS INTELIGÊNCIAS (Baseadas nos seus exemplos)
  // ===========================================================================

  /**
   * EXEMPLO 1: "Notei que faz 1 semana que você não toca no projeto..."
   * Lógica: Verificar tarefas concluídas vinculadas a projetos ativos.
   */
  checkProjectStagnation({ tasks }) {
    // 1. Pega projetos ativos (mock ou store)
    const activeProjects = ['Lançamento Site', 'Escrever Livro']; // Viria do ProjectStore

    activeProjects.forEach(project => {
      // Filtra tarefas desse projeto que foram feitas nos últimos 7 dias
      const recentActivity = tasks.some(t => 
        t.project === project && 
        t.status === 'done' && 
        new Date(t.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      // Se não houve atividade e o alerta ainda não foi dado
      const alertId = `stagnation_${project}`;
      if (!recentActivity && !this.processedAlerts.has(alertId)) {
        this.deliverInsight(
          "Fluxo Estagnado",
          `Notei que faz 1 semana que você não toca no projeto "${project}". Me diga se ele ainda é importante para você ou se devemos arquivá-lo.`,
          "flow_check"
        );
        this.processedAlerts.add(alertId);
      }
    });
  }

  /**
   * EXEMPLO 2: "Notei que você anda com 'tal energia' ultimamente..."
   * Lógica: Analisar o histórico das últimas 3 entradas de energia.
   */
  checkEnergyTrend({ energyHistory }) {
    // energyHistory viria do EnergyStore: ['low', 'low', 'medium', 'high']
    // Pega os últimos 3 registros
    const recent = energyHistory.slice(-3);
    
    // Se todos forem 'low' ou 'tired'
    const isLowStreak = recent.every(e => e === 'low' || e === 'tired');

    if (isLowStreak) {
      const alertId = `energy_streak_${new Date().toDateString()}`;
      if (!this.processedAlerts.has(alertId)) {
        this.deliverInsight(
          "Padrão Energético",
          "Notei que você anda com a energia baixa ultimamente. Algo que eu possa fazer para aliviar sua carga hoje?",
          "energy_care"
        );
        this.processedAlerts.add(alertId);
      }
    }
  }

  /**
   * EXEMPLO 3 (Técnica): "Você tem 2 projetos urgentes para essa semana..."
   * Lógica: Contar tarefas de alta prioridade vencendo nos próximos 7 dias.
   */
  checkWeeklyUrgency({ tasks }) {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const urgentTasks = tasks.filter(t => 
      t.priority === 'high' && 
      t.dueDate && 
      new Date(t.dueDate) <= nextWeek &&
      t.status !== 'done'
    );

    if (urgentTasks.length >= 2) {
       const alertId = `weekly_urgent_${new Date().toDateString()}`;
       if (!this.processedAlerts.has(alertId)) {
         this.deliverInsight(
           "Semana de Alta Pressão",
           `Você tem ${urgentTasks.length} ciclos urgentes para fechar esta semana. Mantemos assim ou quer ajuda para priorizar?`,
           "time_alert"
         );
         this.processedAlerts.add(alertId);
       }
    }
  }

  // ===========================================================================
  // 4. AGENDAMENTO FUTURO (Para quando o App fecha)
  // ===========================================================================

  /**
   * Chamado sempre que uma Tarefa é criada/editada.
   * Agenda a notificação nativa no celular.
   */
  async scheduleTaskReminders(task, userPlan) {
    // AQUI ESTÁ A FRICÇÃO COGNITIVA:
    // Se o plano for SEMENTE, o Ash SE RECUSA a agendar o lembrete.
    // O usuário cria a tarefa, define a data, mas o celular NÃO toca.
    if (!canUserAccess(userPlan, 'view_planner')) {
      console.log('[Ash] Plano Semente: Lembrete ignorado. Fricção ativa.');
      return; 
    }

    if (!task.dueDate) return;

    // Se passou do check, agenda no sistema nativo
    await notificationService.scheduleNotification({
      title: `Ash • ${task.title}`,
      body: "Este ciclo requer sua presença agora.",
      schedule: { at: new Date(task.dueDate) },
      data: { taskId: task.id }
    });
  }

  // ===========================================================================
  // 5. ENTREGA (OUTPUT)
  // ===========================================================================

  deliverInsight(title, body, type) {
    // 1. Registra na memória do Chat (React State)
    useAgentStore.getState().addMessage({
      role: 'assistant',
      content: body,
      type: 'proactive_insight',
      metadata: { title, type, timestamp: new Date() }
    });

    // 2. Envia Push Notification (Capacitor)
    // Para chamar a atenção se o usuário estiver em outra aba/app
    notificationService.sendPushNotification({
      title: `Ash • ${title}`,
      body: body,
      data: { type }
    });
  }
}

export const ashProactive = new AshProactiveService();
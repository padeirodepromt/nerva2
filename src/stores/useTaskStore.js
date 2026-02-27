/* canvas: src/stores/useTaskStore.js
   desc: Store de Tarefas V2.0. Conectado ao Backend (Task Entity) para persistência do Planner.
*/
import { create } from 'zustand';
import { Task, User } from '@/api/entities'; // FIO LIGADO: API Real

// Helper para fusão imutável
const upsert = (array, element) => {
  const i = array.findIndex((e) => e.id === element.id);
  if (i > -1) {
    array[i] = { ...array[i], ...element }; 
    return [...array];
  }
  return [...array, element];
};

export const useTaskStore = create((set, get) => ({
  // === Estado ===
  projects: [],
  tasks: [], // AGORA VAZIO: Será preenchido pela API
  projectHierarchy: [],
  loading: { projects: false, tasks: false },
  error: null,
  selectedTaskId: null,
  
  // Variáveis auxiliares para o Planner
  weekStartDate: '2025-11-24', // Mock da semana atual
  
  // === AÇÕES DE CARREGAMENTO E SINCRONIZAÇÃO ===
  
  /**
   * Busca tarefas reais e as associa ao Store.
   */
  loadTasks: async () => {
    const { weekStartDate } = get();
    set(state => ({ loading: { ...state.loading, tasks: true } }));
    try {
        // Filtra tarefas que têm agendamento ou são relevantes para a semana
        const allTasks = await Task.filter({ 
            _sort: 'plannerDate', // Ordena pelo campo de data do planner
            status: 'todo' // Apenas tarefas a fazer
        });

        // NOTA: Em um sistema real, faríamos um filtro por data agendada. 
        // Aqui, assumimos que 'plannerDate' é o campo que define o agendamento.

        set({ tasks: Array.isArray(allTasks) ? allTasks : [] });
    } catch (e) {
        console.error("Erro ao carregar tarefas:", e);
        set({ error: "Falha na sincronização de tarefas." });
    } finally {
        set(state => ({ loading: { ...state.loading, tasks: false } }));
    }
  },


  // === AÇÕES DE MOVIMENTO (CRONOS) ===

  /**
   * Move uma tarefa para uma nova data (Drop simples na coluna). PERSISTE.
   */
  updateTaskDate: async (taskId, newDate) => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, plannerDate: newDate } : t)
    }));

    // PERSISTÊNCIA REAL
    try {
        await Task.update(taskId, { plannerDate: newDate });
        // Chamamos loadTasks para re-sincronizar se necessário
        get().loadTasks(); 
    } catch (e) {
        console.error("Erro ao persistir movimento:", e);
        // Tentar reverter o estado local aqui se a API falhar
        get().loadTasks();
    }
  },

  /**
   * Troca as datas de duas tarefas (Drop de uma tarefa sobre a outra). PERSISTE.
   */
  swapTasksDate: async (taskAId, taskBId) => {
    const { tasks } = get();
    const taskA = tasks.find(t => t.id === taskAId);
    const taskB = tasks.find(t => t.id === taskBId);

    if (!taskA || !taskB) return;

    const dateA = taskA.plannerDate;
    const dateB = taskB.plannerDate;

    // 1. Aplica a troca no estado local (Otimista)
    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === taskAId) return { ...t, plannerDate: dateB }; 
        if (t.id === taskBId) return { ...t, plannerDate: dateA }; 
        return t;
      })
    }));
    
    // 2. PERSISTÊNCIA REAL (Transação)
    try {
        // Chama duas vezes a API (ou uma bulk update se o controller suportar)
        await Task.update(taskAId, { plannerDate: dateB });
        await Task.update(taskBId, { plannerDate: dateA });
        get().loadTasks();
    } catch (e) {
        console.error("Erro ao persistir SWAP:", e);
        // Tentar reverter o estado ou forçar o load para o estado real do banco
        get().loadTasks();
    }
  },

  // === AÇÕES CRUD PADRÃO ===
  setTasks: (tasks) => set({ tasks, error: null }),
  
  upsertTask: (task) => set((state) => ({
    tasks: upsert(state.tasks, task)
  })),

  selectTask: (taskId) => set({ selectedTaskId: taskId }),
}));
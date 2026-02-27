/**
 * ashImportProcessor.js
 * Processa tarefas importadas com Ash para otimização inteligente
 * Analisa cada task baseado em contexto holístico do usuário
 */

// import { chatService } from './chatService.js';
import { openai } from './aiClients.js';

export const ashImportProcessor = {
  /**
   * Processa tarefas importadas com Ash
   * @param {Array} tasks - Tasks originais importadas
   * @param {Object} userContext - Contexto do usuário (energia, ciclo, etc)
   * @returns {Array} Tasks otimizadas pelo Ash
   */
  async processImportedTasks(tasks, userContext) {
    try {
      const systemPrompt = this.buildSystemPrompt(userContext);
      
      // Processar em batches de 5 tasks
      const batches = [];
      for (let i = 0; i < tasks.length; i += 5) {
        batches.push(tasks.slice(i, i + 5));
      }

      const processedTasks = [];
      
      for (const batch of batches) {
        const batchJson = JSON.stringify(batch, null, 2);
        
        const message = `
Você é um assistente de otimização de tarefas. Analise as seguintes tarefas importadas e otimize-as baseado no contexto do usuário.

TAREFAS PARA ANALISAR:
${batchJson}

Para cada tarefa, retorne JSON com:
{
  "original_title": "título original",
  "optimized": {
    "title": "título expandido e claro",
    "description": "descrição melhorada",
    "priority": "low|medium|high",
    "energyRequired": 1-5,
    "tags": ["tag1", "tag2"],
    "suggestedDueDate": "YYYY-MM-DD ou null",
    "bestTimeToWork": "menstrual|folicular|ovulatory|luteal|any",
    "blockingTasks": [],
    "insight": "1-2 linhas de insight personalizado"
  },
  "changes": {
    "title_changed": boolean,
    "priority_changed": boolean,
    "dueDate_changed": boolean,
    "energyRequired_added": boolean
  }
}

Retorne um array JSON válido. Apenas JSON, sem markdown ou explicações.
`;

        const response = await chatService.runChat(
          userContext.userId,
          message,
          systemPrompt
        );

        try {
          const optimizedBatch = JSON.parse(response);
          processedTasks.push(...optimizedBatch);
        } catch (e) {
          console.error('Erro parsing Ash response:', e);
          // Se Ash falhar, retorna tasks originais
          processedTasks.push(...batch.map(t => ({
            original_title: t.title,
            optimized: { ...t, energyRequired: t.energyRequired || 3 },
            changes: { title_changed: false, priority_changed: false, dueDate_changed: false, energyRequired_added: false }
          })));
        }
      }

      return processedTasks;
    } catch (error) {
      console.error('Erro ao processar tasks com Ash:', error);
      throw error;
    }
  },

  /**
   * Retorna preview de 5 tasks (antes/depois)
   */
  getPreview(processedTasks, count = 5) {
    return processedTasks.slice(0, count).map(item => ({
      before: {
        title: item.original_title,
        priority: item.optimized?.priority || 'medium'
      },
      after: {
        title: item.optimized?.title || item.original_title,
        priority: item.optimized?.priority || 'medium',
        energyRequired: item.optimized?.energyRequired || 3,
        tags: item.optimized?.tags || [],
        insight: item.optimized?.insight || 'Tarefa importada e otimizada',
        bestTimeToWork: item.optimized?.bestTimeToWork || 'any'
      },
      changed: item.changes || {}
    }));
  },

  buildSystemPrompt(userContext) {
    const energy = userContext.energy || { physical: 3, mental: 3, emotional: 3 };
    const menstrual = userContext.menstrualCycle || { phase: 'indefinida', dayOfCycle: 0 };
    
    return `Você é o Ash, assistente de IA do Prana.

Contexto do usuário AGORA:
- Energia: Física ${energy.physical}/5 | Mental ${energy.mental}/5 | Emocional ${energy.emotional}/5
- Ciclo menstrual: Fase ${menstrual.phase} (Dia ${menstrual.dayOfCycle || '?'})
- Humor predominante: ${userContext.mood || 'não definido'}
- Projetos ativos: ${userContext.activeProjects?.length || 0}

Sua tarefa: otimizar tarefas importadas com inteligência holística.

REGRAS:
1. Ajuste prioridades baseado em energia ATUAL e ciclo menstrual
   - Se energia baixa: reduz prioridades, sugere tarefas leves
   - Se fase menstrual: prioriza tarefas autossuficientes
   - Se fase folicular/ovulatória: pode aumentar ambição
   
2. Expanda títulos genéricos com detalhes e clareza
   - "Learn React" → "Learn React - Fundamentals & Hooks"
   - "Projeto" → "Projeto X - Fase Y"

3. Sugira energyRequired (1-5) realista:
   - 1-2: tarefas leves (ler, organizar, planejar)
   - 3: moderadas (coding, reuniões, análise)
   - 4-5: intensas (debug, refactor, criação)

4. Detecte bloqueadores entre tarefas
   - "Preparar apresentação" bloqueia "Apresentar"

5. Gere insights personalizados baseado no contexto
   - Considere energia, ciclo, mood

6. Sugerir bestTimeToWork baseado em ciclo:
   - menstrual: tarefas administrativas
   - folicular: criatividade, risco
   - ovulatory: comunicação, execução
   - luteal: planejamento, análise
   - any: se não importa

Retorne APENAS JSON válido, sem markdown.`;
  }
};

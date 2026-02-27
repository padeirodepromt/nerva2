/* src/services/bioEnergyService.js
   desc: Bridge entre Ash (IA) e o Estado Biológico.
   feat: Análise de texto de Diário para extração de Deltas Energéticos.
*/
import { getAshPrompts } from '../../ai_services/ashPrompts.js';
import { Task, Document } from '../entities.js';

export const bioEnergyService = {
  /**
   * Analisa um novo registo no Diário e calcula o impacto na bateria.
   */
  analyzeDiaryImpact: async (diaryText, currentLanguage = 'pt') => {
    try {
      const prompts = getAshPrompts(currentLanguage);
      
      // Simulação de chamada à API do Ash (Gemini) usando o prompt 'diaryEnergyAnalysis'
      // Na implementação real, isto usaria o seu hook de IA
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/...', {
          method: 'POST',
          body: JSON.stringify({
              systemInstruction: prompts.systemRole,
              prompt: `${prompts.diaryEnergyAnalysis}\n\nTexto do Diário: "${diaryText}"`
          })
      });
      
      // Mock da resposta para demonstração da lógica V8
      // O Ash diria algo como: { energy_delta: -15, mood_shift: 'fatigue', insight: 'Reunião longa detectada' }
      return {
          energy_delta: diaryText.length > 100 ? -10 : 5, 
          insight: "O Ash detectou um desgaste cognitivo após este relato."
      };
    } catch (e) {
      console.error("Erro na análise bio-energética", e);
      return { energy_delta: 0, insight: null };
    }
  },

  /**
   * Filtra tarefas para o Dashboard baseando-se na disponibilidade.
   */
  getSuggestedTasks: (tasks, currentSupply) => {
      return tasks.filter(task => {
          // Regra de Ouro: Tarefas fixas (is_fixed) NUNCA são escondidas.
          if (task.is_fixed) return true;
          
          const cost = task.properties?.energy_level || 3;
          // Se a bateria estiver abaixo de 30%, esconde tarefas de custo 4 ou 5
          if (currentSupply < 30 && cost >= 4) return false;
          
          return true;
      });
  }
};
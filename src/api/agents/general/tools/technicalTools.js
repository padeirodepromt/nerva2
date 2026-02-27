/* src/api/agents/general/tools/technicalTools.js
   desc: Adaptador de Auditoria e Diagnóstico Sistémico (Geral).
   role: Fornece ferramentas de análise de integridade para o Herói.
   feat: Integração oficial com o auditService.
*/

import { auditService } from '../../../../ai_services/auditService.js';

/**
 * 🛠️ Auditoria de Sistema
 * Objetivo: Analisar a saúde dos projetos, detectar tarefas órfãs e gargalos.
 * Público: Disponível para Ash e Neo (conforme permissões de cada agente).
 */
export const perform_system_audit = {
  declaration: {
    name: 'perform_system_audit',
    description: 'Realiza uma auditoria técnica profunda na base de dados para identificar gargalos, tarefas atrasadas e saúde geral do sistema/projeto.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        projectId: { type: 'STRING', description: 'Opcional: Foca a auditoria num projeto específico.' }
      },
      required: ['userId'],
    },
  },
  handler: async (args) => {
    try {
      console.log(`[TechnicalTools] Executando auditoria via auditService para user: ${args.userId}`);
      
      // Chamada ao serviço real definido em src/ai_services/auditService.js
      const report = await auditService.generateFullReport(args.userId, args.projectId);
      
      return { 
        success: true, 
        message: 'Auditoria concluída com sucesso.',
        data: report 
      };
    } catch (error) {
      console.error('[TechnicalTools] Erro na auditoria:', error);
      return { success: false, error: `Falha técnica no serviço de auditoria: ${error.message}` };
    }
  },
};
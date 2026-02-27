/* src/api/agents/neo/neoTools.js
   desc: Definição dos objetos de ferramenta (Declaration + Handler) do Neo.
   role: Traduzir a lógica do RefactorService e Workspace para o protocolo Swarm.
*/

import { NeoRefactorService } from './neoRefactorService.js';

// --- FERRAMENTA: APPLY REFACTOR ---
export const apply_code_refactor = {
  declaration: {
    name: 'apply_code_refactor',
    description: 'Aplica alterações de código reais em ficheiros do sistema após aprovação.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        filePath: { type: 'STRING', description: 'Caminho do ficheiro a alterar.' },
        proposedCode: { type: 'STRING', description: 'O novo código completo ou diff.' },
        logId: { type: 'STRING', description: 'ID da sessão de trabalho.' }
      },
      required: ['userId', 'filePath', 'proposedCode']
    }
  },
  handler: async (args) => {
    // Chama o serviço especialista sem definir lógica aqui
    return await NeoRefactorService.apply(args.userId, args.logId, args.filePath, args.proposedCode);
  }
};

// --- FERRAMENTA: MANAGE WORKSPACE ---
export const manage_code_workspace = {
  declaration: {
    name: 'manage_code_workspace',
    description: 'Controla o TaskCodeWorkspace (Editor Monaco + Live Preview) na interface do Herói.',
    parameters: {
      type: 'OBJECT',
      properties: {
        taskId: { type: 'STRING' },
        action: { type: 'STRING', enum: ['open', 'refresh', 'sync_git'] }
      },
      required: ['taskId', 'action']
    }
  },
  handler: async (args) => {
    return {
      success: true,
      client_action: { 
        type: 'OPEN_TASK_CODE_WORKSPACE', 
        taskId: args.taskId, 
        subAction: args.action 
      }
    };
  }
};
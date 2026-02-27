/* src/api/agents/flor/florTools.js
   desc: Flor Tools V12 (Brand Code Operator & Content Creator).
   role: Ferramentas cirúrgicas para operar o Brand Code e o TaskContentWorkspace.
   architecture: As funções BrandCode passam sempre pelo BrandCodeService (Fonte Única).
*/

import BrandCodeService from '../../system/brandcode/brandcodeService.js';
import { FlorOrchestrator } from './florOrchestrator.js';

const SYSTEM_KEY = 'brand_code';

export const FLOR_FOUNDATION_PROTOCOL_V1 = BrandCodeService?.FLOR_FOUNDATION_PROTOCOL_V1 || [];

// ============================================================================
// 1. GESTÃO DO WORKSPACE DE CONTEÚDO (O Estúdio da Flor)
// ============================================================================
export const manage_content_workspace = {
  declaration: {
    name: 'manage_content_workspace',
    description: 'Abre ou atualiza o TaskContentWorkspace (Departamento de Narrativa / Editor) na tela do Herói.',
    parameters: {
      type: 'OBJECT',
      properties: {
        taskId: { type: 'STRING' },
        action: { type: 'STRING', enum: ['open', 'update_draft'] },
        content: { type: 'STRING', description: 'O texto gerado para injetar no Canvas (se action=update_draft)' }
      },
      required: ['taskId', 'action']
    }
  },
  handler: async (args) => {
    return {
      success: true,
      message: `TaskContentWorkspace ${args.action === 'open' ? 'aberto' : 'atualizado'} com sucesso.`,
      client_action: { 
        type: 'OPEN_TASK_CONTENT_WORKSPACE', 
        taskId: args.taskId, 
        subAction: args.action,
        draftContent: args.content || null
      }
    };
  }
};

export const sintonize_narrative_context = {
  declaration: {
    name: 'sintonize_narrative_context',
    description: 'Constrói as 5 camadas de contexto (BrandCode, RAG, Expertise) usando o FlorOrchestrator.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING' },
        taskId: { type: 'STRING' },
        expertise: { type: 'STRING', description: 'Ex: copywriter, médica, fotografa' },
        objective: { type: 'STRING', description: 'Ex: venda, inspiracao, engajamento' },
        geo: { type: 'STRING', description: 'Ex: brasil_sudeste, portugal' }
      },
      required: ['projectId']
    }
  },
  handler: async (args) => {
    try {
      const sintoniaPrompt = await FlorOrchestrator.buildSintonia(
        args.projectId, 
        args.taskId, 
        { expertise: args.expertise, objective: args.objective, geo: args.geo }
      );
      return { success: true, message: 'Sintonia carregada. Use as diretrizes retornadas.', data: sintoniaPrompt };
    } catch (error) { return { success: false, error: error.message }; }
  }
};

// ============================================================================
// 2. OPERAÇÕES DE BRAND CODE (Baseadas no seu objeto original)
// ============================================================================

export const brandcode_get_project_state = {
  declaration: {
    name: 'brandcode_get_project_state',
    description: 'Obtém o estado atual do Brand Code no projeto (enabled/status/dna/summary).',
    parameters: {
      type: 'OBJECT',
      properties: { projectId: { type: 'STRING' }, userId: { type: 'STRING' } },
      required: ['projectId', 'userId']
    }
  },
  handler: async (args) => {
    const state = await BrandCodeService.getProjectState(args.userId, args.projectId);
    return { success: true, data: state };
  }
};

export const brandcode_enable_for_project = {
  declaration: {
    name: 'brandcode_enable_for_project',
    description: 'Habilita o Brand Code no projeto.',
    parameters: {
      type: 'OBJECT',
      properties: { projectId: { type: 'STRING' }, userId: { type: 'STRING' } },
      required: ['projectId', 'userId']
    }
  },
  handler: async (args) => {
    const result = await BrandCodeService.enableForProject(args.userId, args.projectId);
    return { success: true, data: { projectId: args.projectId, systemKey: SYSTEM_KEY, enabled: true, ...result } };
  }
};

export const brandcode_start_for_project = {
  declaration: {
    name: 'brandcode_start_for_project',
    description: 'Inicia o protocolo (kickoff) da Flor para o Brand Code.',
    parameters: {
      type: 'OBJECT',
      properties: { projectId: { type: 'STRING' }, userId: { type: 'STRING' } },
      required: ['projectId', 'userId']
    }
  },
  handler: async (args) => {
    const payload = await BrandCodeService.startProtocol(args.userId, args.projectId);
    return { success: true, data: payload };
  }
};

export const brandcode_save_foundation_answers = {
  declaration: {
    name: 'brandcode_save_foundation_answers',
    description: 'Salva as respostas do protocolo Foundation. Gera histórico auditável.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING' },
        userId: { type: 'STRING' },
        answers: { type: 'ARRAY', items: { type: 'OBJECT' } }
      },
      required: ['projectId', 'userId', 'answers']
    }
  },
  handler: async (args) => {
    const result = await BrandCodeService.saveFoundationAnswers(args.userId, args.projectId, args.answers);
    return { success: true, data: { projectId: args.projectId, ...result } };
  }
};

export const brandcode_save_dna_draft = {
  declaration: {
    name: 'brandcode_save_dna_draft',
    description: 'Salva o DNA Draft gerado pela Flor no histórico (Não aplica no projeto).',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING' },
        userId: { type: 'STRING' },
        interviewId: { type: 'STRING' },
        dna: { type: 'OBJECT' },
        summary: { type: 'STRING' },
        confidenceScore: { type: 'NUMBER' }
      },
      required: ['projectId', 'userId', 'interviewId', 'dna']
    }
  },
  handler: async (args) => {
    const payload = { dna: args.dna, summary: args.summary, confidenceScore: args.confidenceScore };
    const result = await BrandCodeService.saveDnaDraftToInterview(args.userId, args.projectId, args.interviewId, payload);
    return { success: true, data: { projectId: args.projectId, ...result } };
  }
};

export const brandcode_update_project = {
  declaration: {
    name: 'brandcode_update_project',
    description: 'Atualiza DNA/summary/status definitivo do Brand Code. (Exige autorização do usuário).',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING' },
        userId: { type: 'STRING' },
        dna: { type: 'OBJECT' },
        summary: { type: 'STRING' },
        status: { type: 'STRING', enum: ['empty', 'building', 'active', 'review'] },
        confidenceScore: { type: 'NUMBER' },
        lastInterviewId: { type: 'STRING' }
      },
      required: ['projectId', 'userId']
    }
  },
  handler: async (args) => {
    const patch = { dna: args.dna, summary: args.summary, status: args.status, confidenceScore: args.confidenceScore, lastInterviewId: args.lastInterviewId };
    const result = await BrandCodeService.updateBrandCode(args.userId, args.projectId, patch);
    return { success: true, data: { projectId: args.projectId, ...result } };
  }
};

// Aggregated export object for toolService and other importers
export const FlorTools = {
  FLOR_FOUNDATION_PROTOCOL_V1,
  manage_content_workspace,
  sintonize_narrative_context,
  brandcode_get_project_state,
  brandcode_enable_for_project,
  brandcode_start_for_project,
  brandcode_save_foundation_answers,
  brandcode_save_dna_draft,
  brandcode_update_project
};
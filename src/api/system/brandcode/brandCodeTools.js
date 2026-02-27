/* src/api/system/brandcode/brandCodeTools.js
   desc: Tools bridge do Sistema Brand Code para o ToolService (Ash).
   role:
     - permitir que Ash/Flor iniciem protocolo
     - consultar status
     - enviar atualização de DNA (sempre como DRAFT/consent-first)
   note:
     - não acessa DB direto; usa as rotas/service layer já existentes
*/

import axios from 'axios';

const API_BASE = process.env.INTERNAL_API_BASE || 'http://localhost:3000/api/system/brandcode';

export const BrandCodeTools = {
  // Schemas que o ToolService injeta no LLM
  schemas: [
    {
      name: "brandcode_get_status",
      description: "Consulta o estado do Brand Code em um projeto.",
      parameters: {
        type: "OBJECT",
        properties: {
          userId: { type: "STRING" },
          projectId: { type: "STRING" }
        },
        required: ["userId", "projectId"]
      }
    },
    {
      name: "brandcode_start_foundation",
      description: "Inicia o protocolo da Flor (entrevista Brand Code).",
      parameters: {
        type: "OBJECT",
        properties: {
          userId: { type: "STRING" },
          projectId: { type: "STRING" }
        },
        required: ["userId", "projectId"]
      }
    },
    {
      name: "brandcode_update_dna_draft",
      description: "Envia uma proposta de atualização de DNA (não aplica sem consentimento).",
      parameters: {
        type: "OBJECT",
        properties: {
          userId: { type: "STRING" },
          projectId: { type: "STRING" },
          dna: { type: "OBJECT" },
          summary: { type: "STRING" },
          confidenceScore: { type: "NUMBER" }
        },
        required: ["userId", "projectId", "dna"]
      }
    }
  ],

  // ================================
  // EXECUTION
  // ================================

  async executeGetStatus({ userId, projectId }) {
    const res = await axios.get(`${API_BASE}/project/${projectId}`, {
      headers: { 'x-user-id': userId }
    });

    return {
      success: true,
      data: res.data?.data || null
    };
  },

  async executeStartFoundation({ userId, projectId }) {
    const res = await axios.post(
      `${API_BASE}/project/${projectId}/start`,
      {},
      { headers: { 'x-user-id': userId } }
    );

    return {
      success: true,
      message: "Protocolo da Flor iniciado.",
      data: res.data?.data || null
    };
  },

  /**
   * ⚠️ IMPORTANTE:
   * Isto NÃO aplica diretamente o BrandCode.
   * Ele apenas envia patch como proposta.
   * O SideChat deve pedir consentimento antes de chamar o endpoint real.
   */
  async executeUpdateDnaDraft({ userId, projectId, dna, summary, confidenceScore }) {
    const res = await axios.patch(
      `${API_BASE}/project/${projectId}`,
      { dna, summary, confidenceScore },
      { headers: { 'x-user-id': userId } }
    );

    return {
      success: true,
      message: "Proposta de atualização do Brand Code enviada.",
      data: res.data?.data || null
    };
  }
};

export default BrandCodeTools;

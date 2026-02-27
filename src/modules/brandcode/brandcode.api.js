// src/modules/brandcode/brandcode.api.js
import apiClient from "../../api/apiClient.js";

import { db } from "../../db/index.js";
import { brandCodes } from "../../db/schema/system.js";
import { projects } from "../../db/schema/core.js";
import { and, eq } from "drizzle-orm";

export const BrandCodeAPI = {

  async getEffectiveBrandCode(projectId) {
    // 1. Verificar se o Sistema está Habilitado neste nível (ou se deve herdar a ativação)
    // Para simplificar, assumimos que se o Pai tem, o filho herda a permissão de leitura.
    
    // 2. Tentar encontrar o BrandCode neste projeto
    const [current] = await db
      .select()
      .from(brandCodes)
      .where(
        and(
          eq(brandCodes.projectId, projectId),
          eq(brandCodes.status, 'active')
        )
      );

    if (current) {
      return current;
    }

    // 3. Se não encontrou, buscar o projeto atual para ver quem é o pai
    const [projectRecord] = await db
      .select({ parentId: projects.parentId })
      .from(projects)
      .where(eq(projects.id, projectId));

    // 4. Se houver pai, subir a escada (Recursão)
    if (projectRecord?.parentId) {
      console.log(`[BrandCode] DNA não encontrado no projeto ${projectId}. Subindo para o pai: ${projectRecord.parentId}`);
      return this.getEffectiveBrandCode(projectRecord.parentId);
    }

    // 5. Fim da linha: Nenhum DNA em toda a árvore
    return null;
  },
  
  async getState(projectId) {
    const { data } = await apiClient.get(`/system/brandcode/project/${projectId}`);
    return data?.data || data;
  },

  async enable(projectId) {
    const { data } = await apiClient.post(`/system/brandcode/project/${projectId}/enable`);
    return data?.data || data;
  },

  async start(projectId) {
    const { data } = await apiClient.post(`/system/brandcode/project/${projectId}/start`);
    return data?.data || data;
  },

  async saveFoundation(projectId, answers) {
    const { data } = await apiClient.post(`/system/brandcode/project/${projectId}/foundation`, { answers });
    return data?.data || data;
  },

  async saveDraft(projectId, interviewId, draft) {
    const payload = {
      interviewId,
      dna: draft?.dna,
      summary: draft?.summary,
      confidenceScore: draft?.confidenceScore
    };
    const { data } = await apiClient.post(`/system/brandcode/project/${projectId}/draft`, payload);
    return data?.data || data;
  },

  async applyPatch(projectId, patch) {
    const { data } = await apiClient.patch(`/system/brandcode/project/${projectId}`, patch);
    return data?.data || data;
  },

  // ✅ trocado: usa /nexus/chat (rota real)
  // precisa receber nexusId para não criar um chat paralelo quebrado
  async florChat({ nexusId, projectId, mode, messages }) {
    const promptPack = Array.isArray(messages) ? messages : [];

    // a gente empacota tudo num prompt único de user, pra funcionar com o runChat atual
    const system = promptPack.find(m => m.role === "system")?.content || "";
    const user = promptPack.find(m => m.role === "user")?.content || "";

    const merged = [
      `Você é a agente Flor.`,
      `Modo: ${mode || "brandcode_synthesis"}.`,
      `Projeto: ${projectId}.`,
      system ? `Instruções:\n${system}` : "",
      `Input:\n${user}`
    ].filter(Boolean).join("\n\n");

    const { data } = await apiClient.post(`/nexus/chat`, {
      message: merged,
      nexusId: nexusId || "new",
      history: [],
      context: {
        agentKey: "flor",
        mode: mode || "brandcode_synthesis",
        projectId
      }
    });

    return { message: data?.message };
  }
};
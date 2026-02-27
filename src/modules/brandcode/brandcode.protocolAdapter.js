/* src/modules/brandcode/brandcode.protocolAdapter.js
   desc: Adapter de Protocolo para a Agente Flor e o Sistema BrandCode.
   feat: Suporte a Herança (Pai/Filho), Modo Refinamento e Integração com Shop.
*/
import { BrandCodeAPI } from "./brandcode.api";

export function createBrandCodeFlorAdapter() {
  return {
    async start(ctx) {
      const { projectId } = ctx;
      if (!projectId) throw new Error("projectId required");

      const state = await BrandCodeAPI.getState(projectId);

      // 1. Verificação de Shop (LEGO B)
      if (!state.installed) {
        const err = new Error("SHOP_REQUIRED");
        err.code = "SHOP_REQUIRED";
        throw err;
      }

      // Ativação automática se contratado mas desligado
      if (!state.enabled) {
        await BrandCodeAPI.enable(projectId);
      }

      // 2. Busca de DNA Efetivo (Implementando a Herança)
      const effectiveDna = await BrandCodeAPI.getEffectiveBrandCode(projectId);
      
      // Identifica se o DNA é local ou herdado
      const isInherited = effectiveDna && effectiveDna.projectId !== projectId;

      // 3. Decisão de Fluxo: REFINAMENTO ou FOUNDATION
      if (effectiveDna && effectiveDna.status === 'active') {
        const session = {
          adapterKey: "brandcode_flor",
          projectId,
          nexusId: ctx.nexusId || null,
          mode: "refinement", // 🎯 Entra em modo de ajuste
          currentDna: effectiveDna.dna,
          isInherited,
          inheritedFrom: isInherited ? effectiveDna.projectId : null
        };

        const greeting = isInherited 
          ? `Flor: Estou usando o DNA herdado do projeto pai (${effectiveDna.summary || 'Identidade Geral'}). Deseja criar uma identidade específica para este sub-projeto ou apenas ajustar algo?`
          : `Flor: Já conheço a alma da sua marca. O que você gostaria de revisar ou evoluir no nosso DNA hoje?`;

        return {
          session,
          messages: [{ role: "assistant", content: greeting }]
        };
      }

      // 4. Fluxo Padrão: FOUNDATION (Entrevista do Zero)
      const kickoff = await BrandCodeAPI.start(projectId);
      const questions = kickoff?.florKickoff?.questions || kickoff?.questions || [];
      const first = questions?.[0]?.q || "Vamos começar: o que você está criando aqui?";

      const session = {
        adapterKey: "brandcode_flor",
        projectId,
        nexusId: ctx.nexusId || null,
        mode: "foundation",
        questions,
        cursor: 0,
        answers: [],
        interviewId: null,
        draft: null
      };

      return {
        session,
        messages: [{ role: "assistant", content: `Flor: ${first}`, meta: { kind: "question", i: 1 } }]
      };
    },

    async handleUserMessage({ session, text }) {
      const { projectId } = session;

      // --- MODO REFINAMENTO ---
      if (session.mode === "refinement") {
        // A Flor processa o "Delta" (a mudança solicitada)
        const florRes = await BrandCodeAPI.florChat({
          nexusId: session.nexusId,
          projectId,
          mode: "brandcode_refinement",
          messages: [
            { 
              role: "system", 
              content: "Você é a Flor. O usuário quer refinar um BrandCode existente. Analise o DNA atual e as mudanças pedidas. Gere um novo JSON completo com os ajustes." 
            },
            { role: "user", content: `DNA ATUAL: ${JSON.stringify(session.currentDna)}\n\nPEDIDO: ${text}` }
          ]
        });

        const draft = tryParseJSON(florRes?.message);

        return {
          session: { ...session, draft },
          messages: [{ role: "assistant", content: "Flor: Entendido. Analisei as mudanças e preparei um novo draft do DNA. Quer revisar e aplicar?" }],
          uiHints: {
            kind: "brandcode_consent",
            projectId,
            summary: draft?.summary || "Ajuste de DNA",
            confidenceScore: draft?.confidenceScore || 90,
            hasDraft: !!draft
          }
        };
      }

      // --- MODO FOUNDATION (Q&A Loop Original) ---
      const { questions } = session;
      const i = session.cursor;
      const q = questions?.[i]?.q || null;
      
      const updatedAnswers = [
        ...(session.answers || []),
        { q, a: text, key: questions?.[i]?.id ?? i + 1 }
      ];

      const nextCursor = i + 1;

      if (nextCursor < questions.length) {
        const nextQ = questions[nextCursor]?.q;
        const newSession = { ...session, cursor: nextCursor, answers: updatedAnswers };

        try {
          const saved = await BrandCodeAPI.saveFoundation(projectId, updatedAnswers);
          if (saved?.interviewId) newSession.interviewId = saved.interviewId;
        } catch (e) { console.warn("[BrandCodeAdapter] Save fail:", e); }

        return {
          session: newSession,
          messages: [{ role: "assistant", content: `Flor: ${nextQ}`, meta: { kind: "question", i: nextCursor + 1 } }]
        };
      }

      // Finalização de Foundation e Geração de Draft
      const florRes = await BrandCodeAPI.florChat({
        nexusId: session.nexusId,
        projectId,
        mode: "brandcode_synthesis",
        messages: [
          { role: "system", content: "Gere um DRAFT de Brand Code em JSON: { dna, summary, confidenceScore }" },
          { role: "user", content: JSON.stringify({ answers: updatedAnswers }) }
        ]
      });

      const draft = tryParseJSON(florRes?.message);
      const newSession = { ...session, cursor: questions.length, answers: updatedAnswers, draft };

      return {
        session: newSession,
        messages: [{ role: "assistant", content: "Flor: Finalizei a síntese. Tenho um draft pronto para ser aplicado." }],
        uiHints: {
          kind: "brandcode_consent",
          projectId,
          summary: draft?.summary || null,
          confidenceScore: draft?.confidenceScore || 0,
          hasDraft: !!draft
        }
      };
    },

    async onAction({ session, actionKey }) {
      const { projectId, draft, interviewId } = session;

      if (actionKey === "brandcode_keep_draft") {
        return {
          session,
          messages: [{ role: "assistant", content: "Flor: Ok. O rascunho está salvo para quando você precisar." }]
        };
      }

      if (actionKey === "brandcode_apply") {
        if (!draft?.dna) throw new Error("Draft indisponível.");

        // Ao aplicar, criamos/atualizamos o registro SEMPRE no projectId atual
        // (Isso resolve a herança: se era herdado, agora o filho tem seu próprio registro)
        await BrandCodeAPI.applyPatch(projectId, {
          dna: draft.dna,
          summary: draft.summary || null,
          confidenceScore: draft.confidenceScore || 100,
          status: "active",
          lastInterviewId: interviewId || null
        });

        return {
          session: { ...session, appliedAt: new Date().toISOString(), mode: "refinement", currentDna: draft.dna },
          messages: [{ role: "assistant", content: "Flor: DNA aplicado com sucesso! Agora estou operando com esta nova frequência." }]
        };
      }

      throw new Error(`Ação não suportada: ${actionKey}`);
    }
  };
}

function tryParseJSON(x) {
  if (!x) return null;
  if (typeof x === "object") return x;
  try {
    const fenced = x.match(/```json\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) return JSON.parse(fenced[1]);
    const start = x.indexOf("{");
    const end = x.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(x.slice(start, end + 1));
    return JSON.parse(x);
  } catch { return null; }
}
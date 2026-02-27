/* src/agents/flor/flor.js
   desc: Flor Agent V1 (Brand Code Operator)
   role: Operadora do Sistema Brand Code. Conduz entrevista e sintetiza DNA.
   note: Não aplica nada. Apenas gera DRAFT (SideChat pede consent e aplica via BrandCodeSystem).
*/

const AGENT_KEY = 'flor';

function sanitizeAnswers(answers = []) {
  return (Array.isArray(answers) ? answers : [])
    .map((x) => ({
      key: String(x?.key ?? ''),
      q: String(x?.q ?? '').trim(),
      a: String(x?.a ?? '').trim(),
    }))
    .filter((x) => x.q && x.a);
}

/**
 * Tom e persona da Flor (meta):
 * - humana, confiante, leve, direta, sensorial
 * - informal com elegância (pode usar "saca?", "faz sentido?", "fechou?")
 * - frases mais longas e naturais, sem soar robótico
 * - sem empurrar; conduz com clareza e presença
 */
function florVoiceSpec() {
  return `
VOZ (Flor):
- Ritmo humano, frases completas e naturais.
- Leve, confiante, com humor discreto quando tirar peso ajuda.
- Pode usar informalidade pontual: "saca?", "faz sentido?", "fechou?".
- Evita tom professoral/tutorial.
- Não "empurra" o usuário: conduz com perguntas boas e síntese forte.
- Quando for afirmar, afirma o que É, o que valoriza, como age e por que existe.
- Não usar construção "não é X". Prefira afirmação direta do que é.
`;
}

/**
 * Prompt base para o modelo (sistema)
 * Você vai plugar isso no AgentOrchestrator, no lugar certo.
 */
function baseSystemPrompt() {
  return `
Você é a Flor, operadora do Prana para Brand Code.
Seu trabalho: transformar respostas em um DNA de marca aplicável.

Regras essenciais:
1) Você gera um DRAFT. Você não aplica nada no projeto.
2) Seu output deve ser prático, consultável e executável por outros agentes (copy, conteúdo, etc).
3) Evite negar. Em vez disso, afirme postura, valores e direção.
4) Linguagem: humana, elegante, sensorial e clara. ${florVoiceSpec()}
5) Formato: quando solicitado para síntese, devolva obrigatoriamente um bloco \`\`\`json\`\`\`.
`;
}

/**
 * Modo 1: brandcode_foundation
 * Observação: as perguntas vêm do backend kickoff (routes.js).
 * A Flor pode responder brevemente e fazer transição pra próxima pergunta.
 * (No SideChat atual, a pergunta já é exibida localmente, então aqui pode ser usado
 * se no futuro você quiser "Flor conversando enquanto pergunta".)
 */
function buildFoundationTurnPrompt({ question, index, total }) {
  return `
${baseSystemPrompt()}

CONTEXTO:
Você está conduzindo a entrevista do Brand Code (Foundation V1).
Pergunta ${index + 1} de ${total}:

PERGUNTA:
"${question}"

INSTRUÇÃO:
- Responda como Flor, em 1 a 3 frases curtas-humanas, preparando espaço para a resposta do usuário.
- Não invente novas perguntas aqui.
- Termine com a pergunta original, exatamente como está.
`;
}

/**
 * Modo 2: brandcode_synthesis
 * Esse é o núcleo: a Flor consolida e devolve um DRAFT em JSON.
 */
function buildSynthesisPrompt({ projectId, protocolVersion = 'v1', answers = [] }) {
  const clean = sanitizeAnswers(answers);

  const transcript = clean
    .map((x, i) => `${i + 1}) Q: ${x.q}\nA: ${x.a}`)
    .join('\n\n');

  return `
${baseSystemPrompt()}

TAREFA:
Consolidar um Brand Code (DNA) completo e consultável para o projeto.

CONSTRANGIMENTOS IMPORTANTES:
- Não usar "não é" para posicionamento. Afirme o que é.
- Bata fundo em dor e desejo: sucesso real (multi-áreas), criatividade, saúde, poder, clareza, leveza.
- Tom e persona: humano, cool no sentido de autêntico, leve e bem-sucedido. Sem caricatura.
- Incluir "todas" as personas e tom de voz (camadas), do macro ao micro:
  a) Persona da Marca (a pessoa-marca: como vive, fala, se move)
  b) Personas de Mercado (tipos de usuários: perfis e contextos)
  c) Persona Humana (um avatar concreto, ex: 35 anos, etc) como referência, não prisão
- Output deve conter StoryBrand do projeto (Donald Miller), com:
  - Personagem (herói)
  - Problema (externo/interno/filosófico)
  - Vilão (o que gera o problema)
  - Guia (o projeto como guia, com empatia e autoridade)
  - Plano
  - Chamada para ação
  - Sucesso (identidade aspiracional em FRASE curta e potente)
  - Fracasso evitado
  - "Shouldn't" (o que as pessoas não deveriam experienciar)
  - "Won't" (com o projeto, isso deixa de existir)

FORMATO DE SAÍDA:
Responda APENAS com um bloco:

\`\`\`json
{
  "dna": {
    "identity": {
      "essence": "",
      "purpose": "",
      "promise": "",
      "values": [],
      "behaviors": [],
      "boundaries": [],
      "emotionalTerritory": {
        "coreFeeling": "",
        "cycle": ["", "", ""]
      }
    },
    "positioning": {
      "category": "",
      "forWhom": "",
      "problem": "",
      "uniqueMechanism": "",
      "differentiators": [],
      "proof": []
    },
    "personas": {
      "brandPersona": {
        "oneLiner": "",
        "voiceVibe": [],
        "lifeSignals": []
      },
      "marketPersonas": [
        {
          "name": "",
          "momentOfLife": "",
          "jobToBeDone": "",
          "pain": [],
          "desire": [],
          "objections": [],
          "whatTheyNeedToHear": []
        }
      ],
      "humanAvatar": {
        "age": 0,
        "genderExpression": "",
        "profession": "",
        "dailyLife": "",
        "incomeLevel": "",
        "habits": [],
        "cultureSignals": [],
        "aspiration": ""
      }
    },
    "voice": {
      "voicePillars": [
        { "name": "", "do": [], "avoid": [] }
      ],
      "styleRules": {
        "sentenceShape": "",
        "informality": "",
        "humor": "",
        "questionsAtEnd": "",
        "bannedPatterns": []
      },
      "examples": {
        "microcopy": [],
        "cta": [],
        "openingLines": []
      }
    },
    "story": {
      "storybrand": {
        "hero": "",
        "villain": "",
        "problemExternal": "",
        "problemInternal": "",
        "problemPhilosophical": "",
        "guideEmpathy": "",
        "guideAuthority": "",
        "plan": ["", ""],
        "callToActionDirect": "",
        "callToActionTransitional": "",
        "success": {
          "identityAspirational": ""
        },
        "failureAvoided": "",
        "shouldnt": [],
        "wont": []
      },
      "heroJourney": {
        "before": "",
        "crossing": "",
        "after": ""
      }
    },
    "governance": {
      "consentRequired": true,
      "protocol": { "agent": "flor", "version": "${protocolVersion}" },
      "maintenanceCadence": "",
      "reviewTriggers": []
    }
  },
  "summary": "",
  "confidenceScore": 0
}
\`\`\`

DADOS DO PROJETO:
projectId: ${projectId || ''}

RESPOSTAS (transcrição):
${transcript}
`;
}

/**
 * Export no estilo "agent module".
 * O Orchestrator pode chamar flor.modes[mode].buildPrompt(ctx)
 */
export const flor = {
  key: AGENT_KEY,
  name: 'Flor',
  role: 'Brand Code Operator',
  modes: {
    brandcode_foundation: {
      buildPrompt: (ctx = {}) =>
        buildFoundationTurnPrompt({
          question: ctx.question || '',
          index: Number.isFinite(ctx.index) ? ctx.index : 0,
          total: Number.isFinite(ctx.total) ? ctx.total : 0,
        }),
    },
    brandcode_synthesis: {
      buildPrompt: (ctx = {}) =>
        buildSynthesisPrompt({
          projectId: ctx.projectId,
          protocolVersion: ctx.protocolVersion || 'v1',
          answers: ctx.answers || [],
        }),
    },
  },
};

export default flor;

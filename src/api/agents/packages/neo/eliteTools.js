/* src/api/agents/packages/neo/eliteTools.js
   desc: Pacote de Ferramentas de Elite para o Neo (Grep, Skeleton, Diff).
   feat: Permite ao Neo fazer cirurgias precisas sem estourar o contexto.
*/

export const NeoEliteTools = {
  
  // ==========================================
  // 1. TOOL SCHEMA (O que a IA enxerga)
  // ==========================================
  schemas: [
    {
      name: "code_grep",
      description: "Busca profunda por uma string ou regex em todos os ficheiros do projeto.",
      parameters: {
        type: "object",
        properties: {
          searchTerm: { type: "string", description: "O termo ou regex para buscar (ex: authenticateUser)" },
          fileExtension: { type: "string", description: "Filtro opcional de extensão (ex: .js, .jsx)" }
        },
        required: ["searchTerm"]
      }
    },
    {
      name: "read_skeleton",
      description: "Lê apenas a estrutura de um ficheiro grande (classes, funções, exports), ignorando a lógica interna para poupar tokens.",
      parameters: {
        type: "object",
        properties: {
          filePath: { type: "string", description: "Caminho do ficheiro" }
        },
        required: ["filePath"]
      }
    },
    {
      name: "explain_code_diff",
      description: "Mostra um comparativo visual no chat de um trecho específico de código que foi alterado, com a justificativa.",
      parameters: {
        type: "object",
        properties: {
          filePath: { type: "string" },
          oldSnippet: { type: "string", description: "Como o código era antes (trecho exato, não o ficheiro todo)" },
          newSnippet: { type: "string", description: "Como o código ficou agora (trecho exato, não o ficheiro todo)" },
          reason: { type: "string", description: "Por que esta alteração cirúrgica foi feita?" }
        },
        required: ["filePath", "oldSnippet", "newSnippet", "reason"]
      }
    }
  ],

  // ==========================================
  // 2. TOOL EXECUTION (A Lógica Real)
  // ==========================================
  
  async executeGrep(projectId, searchTerm, fileExtension) {
    // Nota: Numa implementação de produção, isto varreria o VFS ou o disco.
    // Simulação do comportamento de retorno para a IA.
    return `[Resultado de Busca por: ${searchTerm}]\n- src/auth.js (Linha 12)\n- src/routes.js (Linha 45)`;
  },

  async executeSkeleton(projectId, filePath) {
    // Nota: Na prática usaria um parser AST para extrair a estrutura.
    return `[Raio-X de ${filePath}]\n- class AuthService\n- function login(user, pass)\n- function logout()`;
  },

  async executeExplainDiff(payload) {
    // Esta ferramenta NÃO faz mutação no código fonte. 
    // Ela serve APENAS para gerar o payload visual para o chat.
    return {
      visualData: payload,
      message: "Snippet diff gerado com sucesso na Interface do Utilizador."
    };
  }
};
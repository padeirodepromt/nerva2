/* src/api/agents/flor/florTacticalRegistry.js
   desc: Matriz Tática de Criação Aberta (Camada 5).
   rule: Textos livres. Estes são exemplos/presets que o Frontend pode consumir, 
         e instruções de como a IA deve processar entradas abertas.
*/

export const FLOR_TACTICAL_REGISTRY = {
  
  // 1. DOMÍNIO DE AUTORIDADE (A Persona)
  expertise: {
    medica: "Mantenha rigor científico, ética profissional e um tom acolhedor, sem promessas absolutas.",
    estrategista: "Foque em processos macro, visão de longo prazo e pragmatismo orientado a dados.",
    default: "Incorpore totalmente o jargão, o peso e a visão de mundo desta autoridade."
  },

  // 2. DOMÍNIO DE INTENÇÃO (O que queremos causar no leitor?)
  objectives: {
    inspiracao: "Eleve a energia. Mostre o que é possível. O texto deve causar uma epifania ou suspiro.",
    educacao: "Desconstrua o complexo. O leitor deve sair sentindo que ficou mais inteligente.",
    conexao: "Seja vulnerável e altamente humano. O objetivo é fazer o leitor dizer 'eu também sinto isso'.",
    venda: "Conduza uma transformação lógica, quebrando objeções de forma natural até um convite à ação.",
    default: "Cumpra esta intenção central de forma orgânica e invisível."
  },

  // 3. DOMÍNIO DE FERRAMENTA / ÂNGULO (A forma de empacotar a ideia)
  angles: {
    opiniao: "Tome um lado claro. Não seja isento. Desafie o senso comum com classe e firmeza.",
    historia_pessoal: "Use o storytelling em primeira pessoa. O aprendizado vem da experiência vivida.",
    analogia: "Crie uma comparação inusitada com algo do dia a dia para explicar o ponto central.",
    curadoria: "Aja como um filtro de ruído. Apresente os fatos ou passos de forma limpa e direta.",
    default: "Utilize esta exata forma/ângulo para estruturar o fluxo do seu texto."
  },

  // 4. DOMÍNIO DE ECOSSISTEMA (Plataforma)
  platforms: {
    instagram: "Linguagem altamente escaneável e ritmo dinâmico. Pense visualmente.",
    linkedin: "Foco no ecossistema profissional, negócios e lições valiosas, mas sem perder a humanidade.",
    newsletter: "Tom intimista, longo e relacional, como uma carta franca para um amigo no café.",
    default: "Siga rigorosamente a etiqueta e o formato de consumo natural deste ecossistema."
  },

  // 5. DOMÍNIO DE FORMATO (O físico do conteúdo)
  formats: {
    carousel: "Estruture o texto em cortes (lâminas), garantindo que cada bloco gere curiosidade para o próximo.",
    video: "Texto falado. Inclua a intenção de um gancho forte no início e evite frases difíceis de respirar.",
    artigo: "Texto denso, estruturado em subtítulos lógicos, focado em alta retenção e profundidade.",
    default: "Molde a entrega física da sua resposta para se encaixar perfeitamente neste formato."
  },

  // 6. DOMÍNIO DE SOTAQUE E CULTURA
  geo_context: {
    portugal: "Use PT-PT autêntico, vocabulário refinado e gramática europeia nativa.",
    brasil: "Use PT-BR fluido, contemporâneo e sem artificialidade robótica.",
    default: "Adapte o seu léxico e expressões para se conectar nativamente com esta cultura."
  }
};
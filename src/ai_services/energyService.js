/**
 * energyService.js
 * * Este serviço usa a IA para analisar o check-in de energia do usuário.
 * *
 * * *** ATUALIZAÇÃO (Check-in de Consciência) ***
 * * Ritual 2 e 7 (Arquitetura Fractal e Refatoração) aplicados.
 * *
 * * PROBLEMA: O arquivo estava "emaranhado" com 'gemini' e travava
 * * se a GEMINI_API_KEY estivesse faltando.
 * *
 * * CONSEQUÊNCIA: TypeError e crash do servidor.
 * *
 * * SOLUÇÃO (Arquitetura Multi-Fonte Sintonizada):
 * 1. Importamos 'openai' e 'gemini'.
 * 2. Selecionamos 'gemini' (flash) primeiro (ótimo para custo/velocidade).
 * 3. Se 'gemini' não existe, usamos 'openai' (gpt-3.5-turbo) como FALLBACK.
 * 4. Se nenhum existir, lançamos um erro (Ritual 3).
 * 5. A função 'getEnergyAnalysis' foi sintonizada para usar a sintaxe
 * * da API do cliente selecionado.
 */

import { gemini, openai } from './aiClients.js'; // Importa ambos
import { decideBiomeFromCheckIn } from './biomeEngine.js';
import { AI_MODELS } from './models.js'; // Arquivo de configuração de modelos

let client;
let clientType;
let modelName;

// Ritual 2: Guardião de Seleção de Cliente
try {
  // Configuração para Análise de Energia: Preferência por VELOCIDADE (Tier 1)
  // Pois o usuário quer feedback instantâneo no check-in.
  
  if (gemini) {
    console.log(`[Energy Service] Sintonizado com: Gemini (${AI_MODELS.FAST.GEMINI})`);
    // Nota: Se der erro de "Model not found", verifique se o modelo 3.0 já está liberado na sua API Key.
    // Caso contrário, altere em models.js para 'gemini-1.5-flash'.
    client = gemini.getGenerativeModel({ model: AI_MODELS.FAST.GEMINI });
    clientType = 'gemini';
  } else if (openai) {
    console.log(`[Energy Service] Sintonizado com: OpenAI (${AI_MODELS.FAST.OPENAI})`);
    client = openai;
    clientType = 'openai';
    modelName = AI_MODELS.FAST.OPENAI; 
  } else {
    // Ritual 3: Guardião
    throw new Error("Nenhum cliente de IA (Gemini ou OpenAI) está sintonizado.");
  }
} catch (error) {
  console.error(`[Energy Service Error] Falha ao inicializar o cliente: ${error.message}`);
}

export const getEnergyAnalysis = async (checkInData) => {
  console.log("[Energy Service] Solicitada análise de energia.");

  if (!client) {
    // Ritual 3: Guardião
    const errorMsg = "Serviço de Energia desabilitado: nenhuma IA sintonizada.";
    console.error(`[Energy Service Error] ${errorMsg}`);
    return { error: errorMsg };
  }

  const { physical, mental, emotional, spiritual, tags = [], notes = '' } = checkInData;
  
  const prompt = `
    Analise o seguinte check-in de energia de um usuário do sistema Prana.
    Em paralelo, há um "Motor de Biomas" interno que converte esse mesmo check-in
    em um Bioma ativo (Água, Floresta, Sertão, Ventos ou Cosmos) com um Animal‑Guia.
    Você NÃO precisa decidir o Bioma, apenas honrar o contexto geral na sua resposta.

    Check-in recebido:
    - Físico: ${physical}/10
    - Mental: ${mental}/10
    - Emocional: ${emotional}/10
    - Espiritual: ${spiritual}/10
    - Tags: ${tags.join(', ')}
    - Notas: ${notes || 'Nenhuma'}

    Forneça uma análise curta (2-3 frases), gentil e perspicaz. 
    Ofereça um conselho prático ou uma observação encorajadora com base nos níveis de energia e nas tags.
    Assine como "Ash".
  `;

  try {
    let analysis;

    // Sintonização Multi-Fonte (Ritual 4)
    if (clientType === 'gemini') {
      const result = await client.generateContent(prompt);
      analysis = await result.response.text();
    } else { // clientType === 'openai'
      const response = await client.chat.completions.create({
        model: modelName,
        messages: [{ role: 'system', content: prompt }],
      });
      analysis = response.choices[0].message.content;
    }
    
    console.log("[Energy Service] Análise gerada com sucesso.");

    // Aciona o Motor de Biomas de forma determinística, em cima
    // do mesmo payload recebido pelo check-in.
    const biome = decideBiomeFromCheckIn({
      physical,
      mental,
      emotional,
      spiritual,
      tags,
      notes,
    });

    return { analysis, biome };

  } catch (error) {
    console.error(`[Energy Service Error] Erro ao gerar análise: ${error.message}`);
    return { error: `Erro ao gerar análise de energia: ${error.message}` };
  }
};
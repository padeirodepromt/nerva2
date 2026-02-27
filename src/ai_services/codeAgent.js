/* src/ai_services/codeAgent.js
   desc: Serviço especializado para gerar projetos web completos (HTML/CSS/JS) via IA.
   usage: Importado no TaskCodeWorkspace para criar protótipos instantâneos.
*/

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Recupera a chave da API (Do localStorage, configurada em Settings)
 */
const getApiKey = () => {
    // Tenta pegar a chave específica de IA ou usa a do sistema se houver
    // No IntegrationsSettings.jsx, salvamos como 'apiKeys.openai' no state, 
    // mas aqui assumimos que o usuário salvou ou você tem uma variável de ambiente.
    // Para este MVP, vamos ler do localStorage que sugerimos antes.
    /* NOTA: Se você ainda não implementou o salvamento no localStorage no IntegrationsSettings,
       você pode hardcode sua chave aqui temporariamente para testar:
       return "sk-..."; 
    */
    const keys = JSON.parse(localStorage.getItem('prana_api_keys') || '{}');
    return keys.openai || localStorage.getItem('prana_openai_key');
};

/**
 * Prompt do Sistema: Define a persona de Engenheiro de Software Sênior
 */
const SYSTEM_PROMPT = `
Você é o Ash Code Architect, um especialista em criar protótipos web funcionais, bonitos e modernos.
SUA MISSÃO: Receber um pedido em linguagem natural e retornar UM ÚNICO objeto JSON contendo o código fonte.

REGRAS RÍGIDAS DE SAÍDA:
1. Retorne APENAS um JSON válido. Nada de texto antes ou depois.
2. O JSON deve ter exatamente esta estrutura:
{
  "html": "Código do index.html (apenas o conteúdo do body ou estrutura completa)",
  "css": "Código do style.css",
  "js": "Código do script.js"
}
3. HTML: Use Tailwind CSS via CDN se precisar de estilo rápido, ou escreva CSS puro no campo css.
4. JS: Deve ser JavaScript puro (Vanilla) moderno. Não use imports/requires que precisem de build.
5. Design: Faça ser visualmente impressionante. Use gradientes, sombras suaves, fontes modernas.
6. Se o usuário pedir algo complexo demais, faça um MVP funcional.
`;

export const generateWebProject = async (userPrompt) => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
        throw new Error("Chave da OpenAI não configurada. Vá em Ajustes > Conexões Neurais.");
    }

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // Ou gpt-3.5-turbo se quiser economizar
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Crie o seguinte projeto: ${userPrompt}` }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" } // Garante JSON válido (feature nova da OpenAI)
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "Erro na API da OpenAI");
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Parseia o JSON retornado pelo Ash
        const projectFiles = JSON.parse(content);
        
        return projectFiles; // { html, css, js }

    } catch (error) {
        console.error("Ash Code Error:", error);
        throw error;
    }
};
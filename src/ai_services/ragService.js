/* src/ai_services/ragService.js
   desc: Memória Contextual (RAG Leve). 
   Busca dados reais no banco para fundamentar as respostas do Ash.
*/

import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { ilike, or, desc } from 'drizzle-orm';
import { openai, gemini } from './aiClients.js';

// Recupera dados brutos do banco baseados em keywords
async function fetchContextFromDB(query) {
    if (!query) return "";
    
    const keyword = `%${query}%`;
    
    // 1. Busca em Projetos
    const projects = await db.select({ 
        type: sql`'project'`, title: schema.projects.title, desc: schema.projects.description 
    })
    .from(schema.projects)
    .where(or(ilike(schema.projects.title, keyword), ilike(schema.projects.description, keyword)))
    .limit(5);

    // 2. Busca em Tarefas
    const tasks = await db.select({ 
        type: sql`'task'`, title: schema.tasks.title, status: schema.tasks.status 
    })
    .from(schema.tasks)
    .where(or(ilike(schema.tasks.title, keyword), ilike(schema.tasks.description, keyword)))
    .limit(10);

    // 3. Busca em Docs
    const docs = await db.select({ 
        type: sql`'doc'`, title: schema.papyrusDocuments.title, content: schema.papyrusDocuments.content 
    })
    .from(schema.papyrusDocuments)
    .where(or(ilike(schema.papyrusDocuments.title, keyword), ilike(schema.papyrusDocuments.content, keyword)))
    .limit(3);

    // Formata para texto
    let contextText = "--- DADOS ENCONTRADOS NO SISTEMA ---\n";
    [...projects, ...tasks, ...docs].forEach(item => {
        contextText += `[${item.type.toUpperCase()}] ${item.title} (${item.status || item.desc || '...'}) \n`;
    });
    
    return contextText;
}

export const queryRag = async (userQuery, systemContext = "") => {
    // 1. Busca dados reais
    const dbContext = await fetchContextFromDB(userQuery);
    
    // 2. Prepara o Prompt
    const fullContext = `${systemContext}\n\n${dbContext}`;
    const prompt = `
    Use as informações abaixo para responder à pergunta do usuário.
    Se a informação não estiver no contexto, diga que não encontrou registros no sistema.
    
    CONTEXTO:
    ${fullContext}
    
    PERGUNTA: ${userQuery}
    `;

    // 3. Chama a IA (Simples, sem tools)
    try {
        if (openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }]
            });
            return { response: response.choices[0].message.content };
        } else if (gemini) {
            const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            return { response: result.response.text() };
        }
    } catch (e) {
        console.error("RAG Error:", e);
        return { response: "Não consegui acessar minha memória agora." };
    }
};
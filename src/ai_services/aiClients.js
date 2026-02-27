/**
 * aiClients.js
 * * O "Grimório" (Fonte da Magia). Conecta-se às fontes de IA.
 * *
 * * *** ATUALIZAÇÃO (Check-in de Consciência) ***
 * * Ritual 2 (Arquitetura Fractal) e 7 (Refatoração) aplicados.
 * *
 * * PROBLEMA: O arquivo estava desalinhado com a intenção. A intenção é
 * * usar OpenAI como primário, e outros (Gemini, Groq) como opções.
 * * O arquivo antigo travava o servidor se a GROQ_API_KEY estivesse faltando.
 * *
 * * CONSEQUÊNCIA: O servidor não iniciava (GroqError).
 * *
 * * SOLUÇÃO (Arquitetura Multi-Fonte Condicional):
 * 1. Importamos TODOS os SDKs (OpenAI, Gemini, Groq).
 * 2. Verificamos CADA chave de API (OPENAI_API_KEY, GEMINI_API_KEY, GROQ_API_KEY).
 * 3. Inicializamos e exportamos APENAS os clientes que possuem uma chave.
 * 4. Se uma chave estiver faltando, o cliente exportado será 'undefined',
 * * mas o servidor NÃO VAI MAIS TRAVAR.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai'; // 1. Adicionado OpenAI
import 'dotenv/config';

// Declara os clientes em escopo global
let geminiClient, openAIClient, groqClient;

// --- 1. Sintonização do OpenAI (Primário) ---
if (process.env.OPENAI_API_KEY) {
  try {
    openAIClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("[AI Grimório] Sintonizado: OpenAI (Primário)");
  } catch (e) {
    console.warn(`[AI Grimório] Falha ao inicializar OpenAI: ${e.message}`);
  }
} else {
  console.warn("[AI Grimório] OPENAI_API_KEY não encontrada. OpenAI desabilitado.");
}

// --- 2. Sintonização do Google Gemini (Fallback/Opção) ---
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("[AI Grimório] Sintonizado: Google Gemini (Opção)");
  } catch (e) {
    console.warn(`[AI Grimório] Falha ao inicializar Gemini: ${e.message}`);
  }
} else {
  console.warn("[AI Grimório] GEMINI_API_KEY não encontrada. Gemini desabilitado.");
}

// --- 3. Sintonização do Groq (Opção) ---
// (Esta sintonização resolve o erro 'GroqError' que travava o servidor)
if (process.env.GROQ_API_KEY) {
  try {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    console.log("[AI Grimório] Sintonizado: Groq (Opção)");
  } catch (e) {
    console.warn(`[AI Grimório] Falha ao inicializar Groq: ${e.message}`);
  }
} else {
  console.warn("[AI Grimório] GROQ_API_KEY não encontrada. Groq desabilitado.");
}

// Exporta os clientes sintonizados (eles podem ser 'undefined' se as chaves faltarem)
export const gemini = geminiClient;
export const openai = openAIClient;
export const groq = groqClient;
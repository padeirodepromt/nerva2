import { getExecutionCardMissingFields } from "./ExecutionCardCompiler.js";
const QUESTIONS_POLICY_VERSION = "v1";
const UNKNOWN_PLATFORM = "unknown";
const SILENCE_HOURS_OPTIONS = [6, 12, 24, 48, 72];
function text(value) {
 return String(value || "").trim();
}
function lower(value) {
 return text(value).toLowerCase();
}
function hasAny(haystack, terms = []) {
 return terms.some((term) => haystack.includes(term));
}
function buildCatalogOptions(catalog = []) {
 return catalog.map((item) => item.key).filter(Boolean).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
function shouldAskSilenceHours({ prompt, platform, inputs }) {
 if (platform !== "WhatsApp") return false;
 if (Number(inputs?.silenceHours || 0) > 0) return false;
 const t = lower(prompt);
 return hasAny(t, ["sem resposta", "parad", "silêncio", "silencio", "follow-up", "follow up"]);
}
function buildFieldQuestion(field, context) {
 if (field === "outcome") {
 return {
 key: "outcome",
 kind: "text",
 question: "Qual resultado você quer proteger ou alcançar com essa rotina?",
 placeholder: "Ex: evitar perda de vendas por demora de resposta"
 };
 }
 if (field === "trigger") {
 return {
 key: "trigger",
 kind: "text",
 question: "Qual evento deve disparar a rotina?",
 placeholder: "Ex: conversa sem resposta por 24h"
 };
 }
 if (field === "action") {
 return {
 key: "action",
 kind: "text",
 question: "O que o Nerva deve fazer quando detectar esse evento?",
 placeholder: "Ex: priorizar, rascunhar e pedir confirmação"
 };
 }
 if (field === "confirmation") {
 return {
 key: "confirmation",
 kind: "options",
 question: "Como você quer o nível de controle humano?",
 options: ["Aprovação", "Sugestões", "Automático com opt-in"]
 };
 }
 if (field === "storage") {
 return {
 key: "storage",
 kind: "options",
 question: "Onde esse histórico deve ser registrado?",
 options: ["Logs (Nerva) + histórico de aprovações", "Logs (Nerva)", "Logs + sistema conectado"]
 };
 }
 if (field === "platform") {
 return {
 key: "platform",
 kind: "options",
 question: "Em qual plataforma isso acontece?",
 options: buildCatalogOptions(context.catalog)
 };
 }
 return null;
}
export function buildQuestionsPolicy({
 prompt = "",
 mode = "prompt_short",
 platform = UNKNOWN_PLATFORM,
 card = null,
 catalog = [],
 inputs = {},
 maxQuestions = 3
} = {}) {
 const questions = [];
 const missingFields = getExecutionCardMissingFields(card || {});
 if (lower(platform) === UNKNOWN_PLATFORM || missingFields.includes("platform")) {
 const platformQuestion = buildFieldQuestion("platform", { catalog });
 if (platformQuestion?.options?.length) {
 questions.push({
 ...platformQuestion,
 reason: "O princípio da plataforma exige declarar onde a automação vai rodar."
 });
 }
 }
 if (shouldAskSilenceHours({ prompt, platform, inputs })) {
 questions.push({
 key: "silenceHours",
 kind: "options",
 question: "Depois de quantas horas uma conversa é considerada parada?",
 options: SILENCE_HOURS_OPTIONS,
 reason: "Sem esse limiar o gatilho fica amplo demais para WhatsApp."
 });
 }
 for (const field of missingFields) {
 if (field === "platform") continue;
 const fieldQuestion = buildFieldQuestion(field, { catalog, mode });
 if (fieldQuestion) questions.push(fieldQuestion);
 if (questions.length >= maxQuestions) break;
 }
 return {
 version: QUESTIONS_POLICY_VERSION,
 questions: questions.slice(0, maxQuestions),
 missingFields,
 canFinalize: questions.length === 0
 };
}
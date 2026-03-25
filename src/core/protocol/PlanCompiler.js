import { compileExecutionCard } from "./ExecutionCardCompiler.js";
const PLAN_COMPILER_VERSION = "v1";
const UNKNOWN_PLATFORM = "unknown";
function text(value) {
 return String(value || "").trim();
}
function normalizeAutonomy(confirmation) {
 if (confirmation === "Sugestões") return "Sugestões";
 if (confirmation === "Automático com opt-in") return "Automático com opt-in";
 return "Aprovação";
}
function channelFromPlatform(platform) {
 return platform && platform !== UNKNOWN_PLATFORM ? platform : "System";
}
function buildGenericTitle(platform) {
 if (platform && platform !== UNKNOWN_PLATFORM) return `Plano operacional (${platform})`;
 return "Plano a partir de pedido";
}
function buildPlanTemplate({ prompt, platform, area, inputs, card }) {
 if (platform === "WhatsApp") {
 const hours = Number(inputs.silenceHours || 0) > 0 ? Number(inputs.silenceHours) : 24;
 return {
 title: "Resgate de conversas paradas (WhatsApp)",
 intention: "Evitar perda de vendas por demora de resposta.",
 detection: `Detectar conversas sem resposta por ${hours}h e priorizar por intenção.`,
 cadence: "A cada 15 min",
 steps: [
 { code: "WA.SCAN", title: "Varredura de conversas", details: "Listar conversas paradas e ordenar por prioridade." },
 { code: "WA.CLASSIFY", title: "Classificar intenção", details: "Separar compra, suporte, curiosidade e baixo potencial." },
 { code: "WA.DRAFT", title: "Rascunhar follow-up", details: "Criar mensagem curta, humana e contextualizada." },
 { code: "WA.CONFIRM", title: "Pedir confirmação", details: "Submeter o envio quando a autonomia exigir aprovação." }
 ]
 };
 }
 if (platform === "Gmail") {
 return {
 title: "Triage de inbox (Gmail)",
 intention: "Reduzir atraso e evitar perder oportunidades por inbox caótica.",
 detection: "Detectar emails sem resposta e agrupar por urgência ou SLA.",
 cadence: "A cada 30 min",
 steps: [
 { code: "MAIL.SCAN", title: "Varredura da inbox", details: "Coletar threads recentes e não respondidas." },
 { code: "MAIL.PRIOR", title: "Priorizar", details: "Separar críticos, importantes e rotina." },
 { code: "MAIL.DRAFT", title: "Rascunhar resposta", details: "Sugerir resposta curta, clara e adequada ao contexto." },
 { code: "MAIL.CONFIRM", title: "Pedir confirmação", details: "Enviar somente após aprovação quando necessário." }
 ]
 };
 }
 if (platform === "Meta Ads" || platform === "Google Ads") {
 return {
 title: `Saúde de campanhas (${platform})`,
 intention: "Reduzir desperdício e reagir rápido a quedas de performance.",
 detection: "Detectar anomalias de CTR, CPA ou ROAS em janela de 24–48h.",
 cadence: "A cada 30 min",
 steps: [
 { code: "ADS.CHECK", title: "Checar métricas", details: "Comparar últimas 48h com baseline e meta." },
 { code: "ADS.DIAG", title: "Diagnóstico rápido", details: "Avaliar criativo, público, posicionamento e orçamento." },
 { code: "ADS.PROPOSE", title: "Propor ajuste", details: "Montar ação corretiva antes de aplicar mudanças." },
 { code: "ADS.CONFIRM", title: "Pedir confirmação", details: "Aplicar somente após aprovação quando houver impacto." }
 ]
 };
 }
 if (platform === "Sheets") {
 return {
 title: "Monitor de planilhas (Sheets)",
 intention: "Evitar que números mudem sem controle e disparar ação quando necessário.",
 detection: "Detectar variações fora do esperado e registrar evidências.",
 cadence: "A cada 1h",
 steps: [
 { code: "SHEETS.SCAN", title: "Ler ranges monitorados", details: "Varredura dos dados definidos pela rotina." },
 { code: "SHEETS.DIFF", title: "Detectar variação", details: "Comparar baseline, tolerância e mudanças recentes." },
 { code: "SHEETS.LOG", title: "Registrar e sugerir", details: "Salvar evidências e sugerir a próxima ação." }
 ]
 };
 }
 if (platform === "CRM") {
 return {
 title: "Saúde do pipeline (CRM)",
 intention: "Evitar leads esquecidos e manter o funil vivo.",
 detection: "Detectar etapas paradas por tempo acima do padrão.",
 cadence: "A cada 1h",
 steps: [
 { code: "CRM.SCAN", title: "Varredura do pipeline", details: "Ler etapas, tempos e responsáveis." },
 { code: "CRM.PRIOR", title: "Priorizar", details: "Ordenar por valor, tempo parado e intenção." },
 { code: "CRM.PREP", title: "Preparar ação", details: "Criar follow-up, tarefa ou encaminhamento." }
 ]
 };
 }
 const compactPrompt = text(prompt).replace(/\s+/g, " ");
 return {
 title: buildGenericTitle(platform),
 intention: text(card?.outcome) || "Executar uma rotina operacional a partir do pedido.",
 detection: text(card?.trigger) || `Quando ocorrer: ${compactPrompt || "sinal operacional relevante"}`,
 cadence: "A cada 1h",
 steps: [
 { code: "SYS.REVIEW", title: "Revisar contexto", details: "Consolidar sinais e identificar o que pede ação." },
 { code: "SYS.PRIOR", title: "Priorizar", details: "Ordenar impacto, urgência e dependências." },
 { code: "SYS.LOG", title: "Registrar proposta", details: text(card?.action) || "Registrar proposta executável no Nerva." }
 ]
 };
}
export function compilePlan({
 prompt = "",
 mode = "prompt_short",
 platform = UNKNOWN_PLATFORM,
 area = "Operação",
 inputs = {},
 card = null,
 catalogEntry = null
} = {}) {
 const cardResult = card
 ? { card }
 : compileExecutionCard({ prompt, mode, platform, area, inputs });
 const resolvedCard = cardResult.card;
 const resolvedPlatform = text(resolvedCard?.platform) || platform || UNKNOWN_PLATFORM;
 const template = buildPlanTemplate({ prompt, platform: resolvedPlatform, area, inputs, card: resolvedCard });
 const autonomy = normalizeAutonomy(resolvedCard.confirmation);
 const plan = {
 title: template.title,
 intention: template.intention,
 detection: template.detection,
 cadence: template.cadence,
 autonomy,
 area: area || catalogEntry?.defaultArea || "Operação",
 channel: channelFromPlatform(resolvedPlatform),
 steps: template.steps,
 needs: Array.isArray(catalogEntry?.needs) ? catalogEntry.needs : [],
 layers: Array.isArray(catalogEntry?.layers) ? catalogEntry.layers : [],
 platformRisk: catalogEntry?.risk || "medium"
 };
 return {
 version: PLAN_COMPILER_VERSION,
 plan
 };
}
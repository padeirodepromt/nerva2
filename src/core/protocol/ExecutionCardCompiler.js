const EXECUTION_CARD_VERSION = "v1";
export const EXECUTION_CARD_FIELDS = [
 "outcome",
 "platform",
 "trigger",
 "action",
 "confirmation",
 "storage"
];
const DEFAULT_STORAGE = "Logs (Nerva) + histórico de aprovações";
const DEFAULT_CONFIRMATION = "Aprovação";
const UNKNOWN_PLATFORM = "unknown";
function text(value) {
 return String(value || "").trim();
}
function hasValue(value) {
 return text(value).length > 0;
}
function lower(value) {
 return text(value).toLowerCase();
}
function hasAny(haystack, terms = []) {
 return terms.some((term) => haystack.includes(term));
}
function buildSignals(prompt) {
 const t = lower(prompt);
 return {
 stalledConversations: hasAny(t, ["sem resposta", "parad", "silêncio", "silencio", "follow-up", "follow up", "lead parado"]),
 inboxTriage: hasAny(t, ["gmail", "email", "e-mail", "inbox", "caixa de entrada", "sla"]),
 sheetsMonitoring: hasAny(t, ["planilha", "sheets", "sheet", "valor", "número", "numero", "range", "coluna"]),
 adsMonitoring: hasAny(t, ["meta ads", "google ads", "campanha", "ctr", "cpa", "roas", "anúncio", "anuncio"]),
 crmPipeline: hasAny(t, ["crm", "pipeline", "lead", "funil", "negócio", "negocio", "etapa"]),
 preventLoss: hasAny(t, ["não perder", "nao perder", "perder", "evitar perda", "resgatar", "resgate"]),
 approveBeforeActing: hasAny(t, ["aprovação", "aprovacao", "aprovar", "confirmar", "antes de enviar", "antes de aplicar"]),
 suggestOnly: hasAny(t, ["suger", "sugest", "recomendar", "propor"]) && !hasAny(t, ["enviar", "executar", "aplicar"]),
 automatic: hasAny(t, ["automatic", "sozinho", "sem perguntar", "sem aprovar"])
 };
}
function normalizePlatform(platform) {
 const normalized = text(platform);
 return normalized || UNKNOWN_PLATFORM;
}
function resolveConfirmation({ prompt, platform, inputs, overrides, signals }) {
 const explicit = text(overrides.confirmation || inputs.confirmation);
 if (explicit) return explicit;
 if (signals.suggestOnly || platform === "Sheets") return "Sugestões";
 if (signals.automatic) return "Automático com opt-in";
 if (signals.approveBeforeActing) return "Aprovação";
 return DEFAULT_CONFIRMATION;
}
function resolveOutcome({ prompt, platform, area, overrides, signals }) {
 const explicit = text(overrides.outcome);
 if (explicit) return explicit;
 if (signals.preventLoss && platform === "WhatsApp") {
 return "Evitar perda de vendas por demora de resposta no WhatsApp.";
 }
 if (signals.preventLoss && platform === "Gmail") {
 return "Evitar perda de oportunidades por inbox sem triagem.";
 }
 if (platform === "Meta Ads" || platform === "Google Ads") {
 return "Reduzir desperdício e reagir rápido a quedas de performance.";
 }
 if (platform === "CRM") {
 return "Evitar leads esquecidos e manter o pipeline vivo.";
 }
 if (platform === "Sheets") {
 return "Registrar variações importantes antes que virem problema operacional.";
 }
 if (signals.preventLoss) {
 return "Reduzir perdas operacionais com respostas e priorização mais rápidas.";
 }
 if (area === "Marketing") {
 return "Aliviar a operação de marketing com monitoramento e reação consistente.";
 }
 return "Aliviar a operação executando rotinas com consistência e rastreabilidade.";
}
function resolveTrigger({ prompt, platform, inputs, overrides, signals }) {
 const explicit = text(overrides.trigger || inputs.trigger);
 if (explicit) return explicit;
 if (platform === "WhatsApp") {
 const silenceHours = Number(inputs.silenceHours || 0);
 if (signals.stalledConversations && silenceHours > 0) {
 return `Conversas sem resposta por ${silenceHours}h.`;
 }
 return "Conversas paradas ou sem resposta acima do padrão.";
 }
 if (platform === "Gmail") return "Emails críticos sem resposta dentro do SLA.";
 if (platform === "Sheets") return "Mudanças ou valores fora do esperado em planilhas monitoradas.";
 if (platform === "Meta Ads" || platform === "Google Ads") return "Anomalias de CTR, CPA ou ROAS em janela de 24–48h.";
 if (platform === "CRM") return "Leads sem avanço por tempo acima do padrão.";
 const compactPrompt = text(prompt).replace(/\s+/g, " ");
 if (compactPrompt.length >= 12) {
 return `Sinal operacional compatível com o pedido: ${compactPrompt.slice(0, 140)}${compactPrompt.length > 140 ? "…" : ""}`;
 }
 return "Evento operacional detectado.";
}
function resolveAction({ platform, inputs, overrides }) {
 const explicit = text(overrides.action || inputs.action);
 if (explicit) return explicit;
 if (platform === "WhatsApp") return "Priorizar conversas, preparar follow-up e pedir confirmação antes do envio.";
 if (platform === "Gmail") return "Classificar urgência, sugerir respostas e pedir confirmação antes do envio.";
 if (platform === "Sheets") return "Detectar variações, registrar evidências e sugerir próxima ação.";
 if (platform === "Meta Ads" || platform === "Google Ads") {
 return "Diagnosticar a queda, propor ajustes e pedir aprovação antes de aplicar mudanças.";
 }
 if (platform === "CRM") return "Priorizar o pipeline e preparar follow-up, tarefa ou encaminhamento.";
 return "Registrar o contexto, priorizar o que importa e sugerir próximo passo executável.";
}
function resolveStorage({ overrides, inputs }) {
 return text(overrides.storage || inputs.storage) || DEFAULT_STORAGE;
}
function collectOverrides({ panel = {}, spec = {}, existingCard = {} }) {
 const panelCard = panel.card && typeof panel.card === "object" ? panel.card : {};
 const specCard = spec.card && typeof spec.card === "object" ? spec.card : {};
 return {
 ...existingCard,
 ...panelCard,
 ...specCard,
 outcome: spec.outcome ?? panel.outcome ?? specCard.outcome ?? panelCard.outcome ?? existingCard.outcome,
 trigger: spec.trigger ?? panel.trigger ?? specCard.trigger ?? panelCard.trigger ?? existingCard.trigger,
 action: spec.action ?? panel.action ?? specCard.action ?? panelCard.action ?? existingCard.action,
 confirmation:
 spec.confirmation ??
 panel.confirmation ??
 specCard.confirmation ??
 panelCard.confirmation ??
 existingCard.confirmation,
 storage: spec.storage ?? panel.storage ?? specCard.storage ?? panelCard.storage ?? existingCard.storage,
 platform: spec.platform ?? panel.platform ?? specCard.platform ?? panelCard.platform ?? existingCard.platform
 };
}
export function getExecutionCardMissingFields(card) {
 const missing = [];
 if (!hasValue(card?.outcome)) missing.push("outcome");
 if (!hasValue(card?.platform) || lower(card?.platform) === UNKNOWN_PLATFORM) missing.push("platform");
 if (!hasValue(card?.trigger)) missing.push("trigger");
 if (!hasValue(card?.action)) missing.push("action");
 if (!hasValue(card?.confirmation)) missing.push("confirmation");
 if (!hasValue(card?.storage)) missing.push("storage");
 return missing;
}
export function isExecutionCardComplete(card) {
 return getExecutionCardMissingFields(card).length === 0;
}
export function compileExecutionCard({
 prompt = "",
 mode = "prompt_short",
 platform = UNKNOWN_PLATFORM,
 area = "Operação",
 inputs = {},
 panel = {},
 spec = {},
 existingCard = null
} = {}) {
 const normalizedPlatform = normalizePlatform(spec.platform || panel.platform || platform);
 const signals = buildSignals(prompt);
 const overrides = collectOverrides({ panel, spec, existingCard: existingCard || {} });
 const resolvedPlatform = normalizePlatform(overrides.platform || normalizedPlatform);
 const card = {
 outcome: resolveOutcome({ prompt, platform: resolvedPlatform, area, overrides, signals }),
 platform: resolvedPlatform,
 trigger: resolveTrigger({ prompt, platform: resolvedPlatform, inputs, overrides, signals }),
 action: resolveAction({ platform: resolvedPlatform, inputs, overrides }),
 confirmation: resolveConfirmation({ prompt, platform: resolvedPlatform, inputs, overrides, signals }),
 storage: resolveStorage({ overrides, inputs })
 };
 const missingFields = getExecutionCardMissingFields(card);
 return {
 version: EXECUTION_CARD_VERSION,
 mode,
 card,
 missingFields,
 complete: missingFields.length === 0,
 signals
 };
}
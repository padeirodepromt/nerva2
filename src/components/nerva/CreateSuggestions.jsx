CreateSuggestions.jsx
/**
 * PATH: src/components/nerva/CreateSuggestions.jsx
 * DESCRIPTION: Lista de sugestões por área com cards de impacto, esforço, risco e plataforma sugerida para iniciar rotinas a partir de templates.
 */
import React, { useMemo, useState } from "react";
const FALLBACK_SUGGESTIONS = {
 Vendas: [
 {
 id: "vendas-whatsapp-stalled-leads",
 title: "Recuperar conversas paradas",
 summary: "Detecta leads sem resposta e prioriza quem ainda pode virar venda.",
 prompt:
 "Quero detectar conversas paradas no WhatsApp, priorizar leads quentes e me sugerir a melhor próxima ação com registro do histórico.",
 impact: "alto",
 effort: "baixo",
 risk: "médio",
 platformHint: "WhatsApp"
 },
 {
 id: "vendas-crm-next-step",
 title: "Organizar próximos passos do pipeline",
 summary: "Lê o CRM, classifica oportunidades e sugere follow-up com prazo.",
 prompt:
 "Quero revisar meu pipeline no CRM, classificar oportunidades esquecidas e sugerir o próximo passo ideal para cada uma.",
 impact: "alto",
 effort: "médio",
 risk: "baixo",
 platformHint: "CRM"
 }
 ],
 Atendimento: [
 {
 id: "atendimento-gmail-inbox-triage",
 title: "Triar caixa de entrada",
 summary: "Classifica urgência e organiza resposta de e-mails recorrentes.",
 prompt:
 "Quero observar minha caixa do Gmail, classificar urgência, separar o que precisa de resposta hoje e registrar o que foi tratado.",
 impact: "alto",
 effort: "baixo",
 risk: "baixo",
 platformHint: "Gmail"
 },
 {
 id: "atendimento-wa-escalation",
 title: "Escalar casos sensíveis",
 summary: "Detecta sinais de atrito e pede aprovação antes de responder.",
 prompt:
 "Quero detectar conversas sensíveis no WhatsApp, separar risco de atrito e me pedir aprovação antes de qualquer resposta delicada.",
 impact: "médio",
 effort: "baixo",
 risk: "médio",
 platformHint: "WhatsApp"
 }
 ],
 Marketing: [
 {
 id: "marketing-meta-weekly-watch",
 title: "Observar performance de anúncios",
 summary: "Monitora sinais de queda e avisa quando a campanha pede atenção.",
 prompt:
 "Quero observar campanhas de Meta Ads, detectar queda de desempenho e me avisar quando CTR, CPA ou ROAS fugirem do normal.",
 impact: "alto",
 effort: "médio",
 risk: "médio",
 platformHint: "Meta Ads"
 },
 {
 id: "marketing-google-weekly-watch",
 title: "Revisar Google Ads por rotina",
 summary: "Detecta anomalias simples e registra mudanças recomendadas.",
 prompt:
 "Quero revisar Google Ads toda semana, detectar anomalias de custo e registrar sugestões de ajuste sem aplicar nada sozinho.",
 impact: "alto",
 effort: "médio",
 risk: "baixo",
 platformHint: "Google Ads"
 }
 ],
 "Operação": [
 {
 id: "operacao-sheets-pulse",
 title: "Ler planilha e sinalizar desvios",
 summary: "Observa dados em planilha e aponta exceções que precisam de ação.",
 prompt:
 "Quero observar uma planilha no Google Sheets, detectar desvios importantes e registrar um resumo prático do que exige atenção.",
 impact: "médio",
 effort: "baixo",
 risk: "baixo",
 platformHint: "Sheets"
 },
 {
 id: "operacao-cross-channel-log",
 title: "Registrar evidências operacionais",
 summary: "Consolida sinais e deixa o histórico mais rastreável.",
 prompt:
 "Quero registrar evidências de tarefas executadas, organizar contexto por canal e manter um histórico fácil de auditar.",
 impact: "médio",
 effort: "baixo",
 risk: "baixo",
 platformHint: "System"
 }
 ]
};
function buildAreaOptions(catalog) {
 const base = ["Vendas", "Atendimento", "Marketing", "Operação"];
 const fromCatalog = Array.from(
 new Set(
 (catalog || [])
 .map((item) => String(item.defaultArea || "").trim())
 .filter(Boolean)
 )
 );
 return Array.from(new Set([...base, ...fromCatalog]));
}
function enrichSuggestions(area, catalog) {
 const suggestions = [...(FALLBACK_SUGGESTIONS[area] || FALLBACK_SUGGESTIONS["Operação"])];
 return suggestions.map((item) => {
 const connector = (catalog || []).find((entry) => entry.key === item.platformHint);
 return {
 ...item,
 needs: Array.isArray(connector?.needs) ? connector.needs : [],
 connectorRisk: connector?.risk || item.risk
 };
 });
}
export default function CreateSuggestions({ catalog, onUseSuggestion }) {
 const areaOptions = useMemo(() => buildAreaOptions(catalog), [catalog]);
 const [area, setArea] = useState(areaOptions[0] || "Operação");
 const cards = useMemo(() => enrichSuggestions(area, catalog), [area, catalog]);
 return (
 <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
 <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
 <div>
 <div className="text-[12px] font-semibold text-black">Sugestões por área</div>
 <div className="mt-1 text-[12px] text-black/60">
 Escolha uma área e comece por um template. O Nerva ainda compila o cartão e o plano antes de ativar.
 </div>
 </div>
 <div className="w-full md:w-[220px]">
 <div className="text-[11px] font-semibold text-black/65">Área</div>
 <select
 value={area}
 onChange={(e) => setArea(e.target.value)}
 className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
 >
 {areaOptions.map((option) => (
 <option key={option} value={option}>
 {option}
 </option>
 ))}
 </select>
 </div>
 </div>
 <div className="mt-4 grid gap-3 lg:grid-cols-2">
 {cards.map((card) => (
 <div key={card.id} className="rounded-[24px] border border-black/10 bg-white/75 p-4">
 <div className="flex items-start justify-between gap-3">
 <div>
 <div className="text-[14px] font-semibold text-black">{card.title}</div>
 <div className="mt-1 text-[12px] leading-5 text-black/60">{card.summary}</div>
 </div>
 <span className="rounded-full border border-black/10 bg-black/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-black/55">
 {card.platformHint}
 </span>
 </div>
 <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-black/55">
 <span className="rounded-full border border-black/10 px-2 py-1">impacto {card.impact}</span>
 <span className="rounded-full border border-black/10 px-2 py-1">esforço {card.effort}</span>
 <span className="rounded-full border border-black/10 px-2 py-1">risco {card.connectorRisk}</span>
 </div>
 {card.needs?.length ? (
 <div className="mt-3 flex flex-wrap gap-2">
 {card.needs.map((need) => (
 <span
 key={need}
 className="rounded-full border border-black/10 bg-black/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-black/55"
 >
 {need}
 </span>
 ))}
 </div>
 ) : null}
 <div className="mt-3 rounded-2xl border border-black/10 bg-[#f6f1e7] p-3 text-[11px] leading-5 text-black/60">
 {card.prompt}
 </div>
 <button
 type="button"
 onClick={() => onUseSuggestion(card)}
 className="mt-3 w-full rounded-2xl bg-black px-3 py-2 text-[12px] font-semibold text-white hover:opacity-95"
 >
 Usar este template
 </button>
 </div>
 ))}
 </div>
 </div>
 );
}
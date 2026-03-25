CreateChooserModal.jsx
/**
 * PATH: src/components/nerva/CreateChooserModal.jsx
 * DESCRIPTION: Modal do botão "+" que apresenta os 4 modos de criação do Nerva e devolve a escolha ao Console.
 */
import React from "react";
const MODES = [
 {
 value: "panel",
 title: "Painel",
 subtitle: "Configuração rápida para quem já sabe o básico.",
 bullets: ["objetivo curto", "plataforma definida", "ida direta ao cartão"]
 },
 {
 value: "prompt_short",
 title: "Prompt curto",
 subtitle: "Pedido simples em linguagem humana, com perguntas mínimas quando faltar algo.",
 bullets: ["onboarding fácil", "menos fricção", "compila rápido"]
 },
 {
 value: "prompt_detailed",
 title: "Prompt detalhado",
 subtitle: "Spec mais completa para quem quer mais precisão e menos inferência.",
 bullets: ["mais contexto", "mais controle", "melhor para regras e exceções"]
 },
 {
 value: "suggestions",
 title: "Sugestões",
 subtitle: "Cards por área para quando o usuário ainda sabe a dor, mas não a solução.",
 bullets: ["templates por área", "impacto / esforço / risco", "entra no plano com 1 clique"]
 }
];
export default function CreateChooserModal({ open, currentMode, onSelect, onClose }) {
 if (!open) return null;
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
 <div className="w-full max-w-4xl rounded-[28px] border border-black/10 bg-[#f3efe6] shadow-2xl shadow-black/10">
 <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4">
 <div>
 <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/45">Criar no Nerva</div>
 <div className="mt-1 text-[20px] font-semibold text-black">Escolha como você quer começar</div>
 <div className="mt-1 text-[12px] text-black/60">
 O modo só muda a porta de entrada. O destino continua igual: Cartão de Execução, Plano e needs.
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/70 transition hover:bg-white"
 >
 Fechar
 </button>
 </div>
 <div className="grid gap-3 p-5 md:grid-cols-2">
 {MODES.map((mode) => {
 const active = currentMode === mode.value;
 return (
 <button
 key={mode.value}
 type="button"
 onClick={() => onSelect(mode.value)}
 className={`rounded-[24px] border p-4 text-left transition ${
 active
 ? "border-black bg-black text-white shadow-lg shadow-black/10"
 : "border-black/10 bg-white/70 text-black hover:bg-white"
 }`}
 >
 <div className="flex items-center justify-between gap-3">
 <div className="text-[16px] font-semibold">{mode.title}</div>
 {active ? (
 <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/90">
 atual
 </span>
 ) : null}
 </div>
 <div className={`mt-2 text-[12px] leading-5 ${active ? "text-white/80" : "text-black/60"}`}>
 {mode.subtitle}
 </div>
 <div className="mt-3 flex flex-wrap gap-2">
 {mode.bullets.map((bullet) => (
 <span
 key={bullet}
 className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${
 active ? "border-white/20 bg-white/10 text-white/85" : "border-black/10 bg-black/[0.03] text-black/55"
 }`}
 >
 {bullet}
 </span>
 ))}
 </div>
 </button>
 );
 })}
 </div>
 </div>
 </div>
 );
}
CreatePromptDetailed.jsx
/**
 * PATH: src/components/nerva/CreatePromptDetailed.jsx
 * DESCRIPTION: Modo de criação por spec detalhada, pensado para pedidos com regras, exceções, mensagens e horários mais explícitos.
 */
import React from "react";
export default function CreatePromptDetailed({
 prompt,
 onPromptChange,
 compileOverrides,
 onOverridesChange,
 platformOptions,
 busy,
 err,
 onSubmit
}) {
 return (
 <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
 <div className="text-[12px] font-semibold text-black">Spec (detalhado)</div>
 <div className="mt-2 text-[12px] text-black/60">
 Para quando você quer menos adivinhação: regras, horários, exceções, mensagens e limites no mesmo pedido.
 </div>
 <textarea
 value={prompt}
 onChange={(e) => onPromptChange(e.target.value)}
 rows={8}
 placeholder="Descreva regras, exceções, mensagens, horários, plataformas, limites de autonomia e o que precisa ser registrado."
 className="mt-3 w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 placeholder:text-black/35 outline-none"
 />
 <div className="mt-3 rounded-2xl border border-black/10 bg-white/70 p-3 text-[11px] text-black/55">
 Dica: escreva como se estivesse passando um playbook para alguém do time. O Nerva transforma isso em contrato operacional.
 </div>
 <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
 <div className="rounded-2xl border border-black/10 bg-white/70 p-3">
 <div className="text-[11px] font-semibold text-black/65">Plataforma</div>
 <select
 value={compileOverrides.platform}
 onChange={(e) => onOverridesChange({ platform: e.target.value })}
 className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
 >
 <option value="">(auto)</option>
 {platformOptions.map((platform) => (
 <option key={platform} value={platform}>
 {platform}
 </option>
 ))}
 </select>
 <div className="mt-1 text-[11px] text-black/45">Use auto se houver mais de uma plataforma no pedido inicial.</div>
 </div>
 <div className="rounded-2xl border border-black/10 bg-white/70 p-3">
 <div className="text-[11px] font-semibold text-black/65">Silêncio (WhatsApp)</div>
 <input
 value={compileOverrides.silenceHours}
 onChange={(e) => onOverridesChange({ silenceHours: e.target.value })}
 placeholder="24"
 className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
 />
 <div className="mt-1 text-[11px] text-black/45">Preencha só se o fluxo depender de janela sem resposta.</div>
 </div>
 </div>
 <button
 disabled={busy || prompt.trim().length < 2}
 onClick={onSubmit}
 className={`mt-3 w-full rounded-2xl px-3 py-2 text-[12px] font-semibold ${
 busy ? "bg-black/50 text-white" : "bg-black text-white hover:opacity-95"
 }`}
 >
 {busy ? "Compilando…" : "Gerar Cartão + Plano"}
 </button>
 {err ? <div className="mt-2 text-[12px] text-black/60">erro: {err}</div> : null}
 </div>
 );
}
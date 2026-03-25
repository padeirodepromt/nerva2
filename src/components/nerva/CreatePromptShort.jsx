CreatePromptShort.jsx
/**
 * PATH: src/components/nerva/CreatePromptShort.jsx
 * DESCRIPTION: Modo de criação por prompt curto, com o mínimo de campos extras para o Nerva inferir e perguntar só o necessário.
 */
import React from "react";
export default function CreatePromptShort({
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
 <div className="text-[12px] font-semibold text-black">Pedido (curto)</div>
 <div className="mt-2 text-[12px] text-black/60">
 O Nerva compila em <b>Cartão de Execução</b> + <b>Plano</b> e só pergunta o que for essencial.
 </div>
 <textarea
 value={prompt}
 onChange={(e) => onPromptChange(e.target.value)}
 rows={3}
 placeholder="Ex: Quero evitar conversas paradas no WhatsApp e priorizar leads quentes."
 className="mt-3 w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 placeholder:text-black/35 outline-none"
 />
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
 <div className="mt-1 text-[11px] text-black/45">
 Se não souber, deixe auto. Se o Nerva não inferir, ele pergunta.
 </div>
 </div>
 <div className="rounded-2xl border border-black/10 bg-white/70 p-3">
 <div className="text-[11px] font-semibold text-black/65">Silêncio (WhatsApp)</div>
 <input
 value={compileOverrides.silenceHours}
 onChange={(e) => onOverridesChange({ silenceHours: e.target.value })}
 placeholder="24"
 className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
 />
 <div className="mt-1 text-[11px] text-black/45">
 Só usado se a plataforma for WhatsApp e o pedido envolver conversa parada ou sem resposta.
 </div>
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
CreatePanel.jsx
/**
 * PATH: src/components/nerva/CreatePanel.jsx
 * DESCRIPTION: Modo de criação por painel rápido, com objetivo e plataforma explícitos para usuários que querem velocidade.
 */
import React from "react";
export default function CreatePanel({
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
 <div className="text-[12px] font-semibold text-black">Configuração rápida (Painel)</div>
 <div className="mt-2 text-[12px] text-black/60">
 Preencha o núcleo do cartão. Ideal para quando você já conhece o objetivo e a plataforma.
 </div>
 <div className="mt-3 grid gap-2">
 <input
 value={prompt}
 onChange={(e) => onPromptChange(e.target.value)}
 placeholder="Objetivo em 1 linha (ex: proteger leads no WhatsApp)"
 className="w-full rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
 />
 <select
 value={compileOverrides.platform}
 onChange={(e) => onOverridesChange({ platform: e.target.value })}
 className="w-full rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
 >
 <option value="">Escolha plataforma</option>
 {platformOptions.map((platform) => (
 <option key={platform} value={platform}>
 {platform}
 </option>
 ))}
 </select>
 <button
 disabled={busy || prompt.trim().length < 2 || !compileOverrides.platform}
 onClick={onSubmit}
 className={`w-full rounded-2xl px-3 py-2 text-[12px] font-semibold ${
 busy ? "bg-black/50 text-white" : "bg-black text-white hover:opacity-95"
 }`}
 >
 {busy ? "Compilando…" : "Gerar Cartão + Plano (Painel)"}
 </button>
 </div>
 {err ? <div className="mt-2 text-[12px] text-black/60">erro: {err}</div> : null}
 </div>
 );
}
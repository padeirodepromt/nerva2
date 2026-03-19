// src/components/nerva/LogsTerminal.jsx
import React from "react";
import { useNervaLogs } from "../../hooks/useNervaLogs";

const cx = (...c) => c.filter(Boolean).join(" ");

function tone(level) {
  if (level === "CRIT") return "bg-black text-white border-black";
  if (level === "ALERT" || level === "WARN") return "bg-white/70 text-black border-black/20";
  return "bg-white/60 text-black/70 border-black/15";
}

function Pill({ children, level }) {
  return (
    <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]", level ? tone(level) : "border-black/15 bg-white/60 text-black/70")}>
      {children}
    </span>
  );
}

function fmtTs(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return String(ts || "");
  }
}

export default function LogsTerminal({ filters, onSelect }) {
  const { loading, error, logs } = useNervaLogs({ limit: 200, ...(filters || {}) });

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="text-[13px] font-semibold tracking-wide text-black">Log stream</div>
          <div className="text-[11px] text-black/55">Eventos operacionais (Supabase + polling)</div>
        </div>
        <div className="text-[11px] text-black/55">
          {loading ? "carregando…" : `${logs.length} linhas`}
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white/55 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
          <div className="text-[11px] font-semibold tracking-wide text-black/70">NERVA.LOG</div>
          <div className="text-[11px] text-black/55">{error ? `erro: ${error}` : "live"}</div>
        </div>

        <div className="font-mono text-[12px] leading-relaxed">
          {logs.map((e) => (
            <button
              key={e.id}
              onClick={() => onSelect?.(e)}
              className="group w-full text-left px-4 py-2 transition hover:bg-black/5"
              title="Abrir no Console"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-black/45">[{fmtTs(e.ts)}]</span>
                <Pill level={e.level}>{e.level}</Pill>
                <span className="text-black/70">[{e.area}]</span>
                <span className="text-black/45">@</span>
                <span className="text-black/70">{e.channel}</span>
                <span className="text-black/45">•</span>
                <span className="text-black/60">{e.code}</span>
                <span className="text-black/45">→</span>
                <span className="text-black/85 group-hover:text-black">{e.msg}</span>
              </div>
              {e.ctx ? (
                <div className="mt-1 text-[11px] text-black/45">
                  ctx: {e.ctx}
                </div>
              ) : null}
            </button>
          ))}

          {!loading && logs.length === 0 && (
            <div className="px-4 py-6 text-[12px] text-black/55">Sem logs ainda (ou filtros muito restritos).</div>
          )}
        </div>
      </div>

      <div className="mt-3 text-[11px] text-black/50">
        Clique numa linha para abrir o contexto no Console (próximo passo).
      </div>
    </div>
  );
}
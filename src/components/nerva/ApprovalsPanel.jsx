// src/components/nerva/ApprovalsPanel.jsx
import React, { useEffect, useMemo, useState } from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/15 bg-white/60 px-2 py-0.5 text-[11px] text-black/70">
      {children}
    </span>
  );
}

function ToneBadge({ status }) {
  const cls =
    status === "pending"
      ? "border-black/15 bg-white/60 text-black/70"
      : status === "approved"
      ? "bg-black text-white border-black"
      : "border-black/10 bg-white/50 text-black/60";

  return (
    <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]", cls)}>
      {status}
    </span>
  );
}

export default function ApprovalsPanel() {
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState({}); // { [id]: true }

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/nerva/approvals?status=pending&limit=50").then((r) => r.json());
      if (!res.ok) throw new Error(res.error || "ERROR");
      setApprovals(res.approvals || []);
    } catch (e) {
      setError(e?.message || "ERROR");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, []);

  async function decide(id, decision) {
    try {
      setBusy((m) => ({ ...m, [id]: true }));
      const res = await fetch(`/api/nerva/approvals/${id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision })
      }).then((r) => r.json());

      if (!res.ok) throw new Error(res.error || "ERROR");
      await load();
    } catch (e) {
      setError(e?.message || "ERROR");
    } finally {
      setBusy((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
    }
  }

  const count = approvals.length;

  return (
    <div className="border-t border-black/10 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[12px] font-semibold text-black">Aprovações</div>
            <Pill>{count} pendentes</Pill>
          </div>
          <div className="text-[11px] text-black/55">
            Opt-in humano: decisões explícitas antes de ações.
          </div>
        </div>

        <button
          onClick={load}
          className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 hover:bg-white"
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="text-[12px] text-black/55">carregando…</div>
      ) : error ? (
        <div className="text-[12px] text-black/55">erro: {error}</div>
      ) : approvals.length === 0 ? (
        <div className="text-[12px] text-black/55">sem aprovações pendentes</div>
      ) : (
        <div className="space-y-2">
          {approvals.map((a) => {
            const isBusy = !!busy[a.id];
            return (
              <div key={a.id} className="rounded-2xl border border-black/10 bg-white/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-semibold text-black">{a.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Pill>tipo: {a.kind}</Pill>
                      <ToneBadge status={a.status} />
                      {a.routineId ? <Pill>rotina</Pill> : null}
                      {a.operatorId ? <Pill>operador</Pill> : null}
                    </div>
                  </div>
                </div>

                {a.summary ? (
                  <div className="mt-2 text-[12px] text-black/60">{a.summary}</div>
                ) : (
                  <div className="mt-2 text-[12px] text-black/50">sem resumo</div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    disabled={isBusy}
                    onClick={() => decide(a.id, "approved")}
                    className={cx(
                      "rounded-xl px-3 py-2 text-[12px] font-semibold",
                      isBusy ? "bg-black/50 text-white" : "bg-black text-white hover:opacity-95"
                    )}
                  >
                    {isBusy ? "Processando…" : "Aprovar"}
                  </button>

                  <button
                    disabled={isBusy}
                    onClick={() => decide(a.id, "rejected")}
                    className={cx(
                      "rounded-xl border px-3 py-2 text-[12px]",
                      isBusy
                        ? "border-black/10 bg-white/50 text-black/40"
                        : "border-black/10 bg-white/70 text-black/80 hover:bg-white"
                    )}
                  >
                    Recusar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
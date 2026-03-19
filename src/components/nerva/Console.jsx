// src/components/nerva/Console.jsx
import React, { useEffect, useMemo, useState } from "react";
import { nervaClient } from "../../api/nervaClient";

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/15 bg-white/60 px-2 py-0.5 text-[11px] text-black/70">
      {children}
    </span>
  );
}

function StepRow({ step, idx, onChange, onRemove }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] font-semibold text-black/65">Step {idx + 1}</div>
        <button
          onClick={onRemove}
          className="rounded-xl border border-black/10 bg-white/70 px-2 py-1 text-[11px] text-black/70 hover:bg-white"
        >
          Remover
        </button>
      </div>

      <div className="mt-2 grid gap-2">
        <input
          value={step.title || ""}
          onChange={(e) => onChange({ ...step, title: e.target.value })}
          placeholder="Título da ação"
          className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={step.code || ""}
            onChange={(e) => onChange({ ...step, code: e.target.value })}
            placeholder="Código (ex: WA.DRAFT)"
            className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
          />
          <input
            value={step.details || ""}
            onChange={(e) => onChange({ ...step, details: e.target.value })}
            placeholder="Detalhe curto"
            className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function CardView({ card }) {
  if (!card) return null;
  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
      <div className="text-[12px] font-semibold text-black">Cartão de Execução</div>
      <div className="mt-2 grid gap-2 text-[12px] text-black/70">
        <div><span className="text-black/45">Resultado:</span> {card.outcome}</div>
        <div><span className="text-black/45">Plataforma:</span> {card.platform}</div>
        <div><span className="text-black/45">Gatilho:</span> {card.trigger}</div>
        <div><span className="text-black/45">Ação:</span> {card.action}</div>
        <div><span className="text-black/45">Confirmação:</span> {card.confirmation}</div>
        <div><span className="text-black/45">Registro:</span> {card.storage}</div>
      </div>
    </div>
  );
}

export default function Console({ selectedLog, onCreateApproval }) {
  const [tab, setTab] = useState("operate"); // operate | create
  const [createMode, setCreateMode] = useState("prompt_short"); // panel | prompt_short | prompt_detailed | suggestions

  // catalog (DB)
  const [catalog, setCatalog] = useState([]);

  // create state
  const [prompt, setPrompt] = useState("");
  const [intentId, setIntentId] = useState(null);
  const [card, setCard] = useState(null);
  const [plan, setPlan] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [platformNeeds, setPlatformNeeds] = useState([]);
  const [layers, setLayers] = useState([]);
  const [platformRisk, setPlatformRisk] = useState(null);

  const [compileOverrides, setCompileOverrides] = useState({ platform: "", silenceHours: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  // load catalog once (seed if empty)
  useEffect(() => {
    (async () => {
      try {
        await nervaClient.seedConnectorsCatalog();
        const res = await nervaClient.getConnectorsCatalog();
        setCatalog(res.catalog || []);
      } catch {
        // silent in v0
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedLog) setTab("operate");
  }, [selectedLog?.id]);

  const summary = useMemo(() => {
    if (!plan) return "";
    const s = [
      `Intenção: ${plan.intention}`,
      `Detecção: ${plan.detection}`,
      `Cadência: ${plan.cadence}`,
      `Autonomia: ${plan.autonomy}`,
      `Steps: ${plan.steps?.length || 0}`
    ].join(" | ");
    return s.slice(0, 280);
  }, [plan]);

  async function createAndCompile() {
    setBusy(true);
    setErr(null);
    try {
      const created = await nervaClient.createIntent({
        mode: createMode,
        prompt,
        platform: compileOverrides.platform || undefined
      });

      const id = created.intent.id;
      setIntentId(id);

      const compiled = await nervaClient.compileIntent(id, {
        platform: compileOverrides.platform || undefined,
        silenceHours: compileOverrides.silenceHours ? Number(compileOverrides.silenceHours) : undefined
      });

      setCard(compiled.card);
      setPlan(compiled.plan);
      setQuestions(compiled.questions || []);
      setPlatformNeeds(compiled.platformNeeds || []);
      setLayers(compiled.layers || []);
      setPlatformRisk(compiled.platformRisk || null);
    } catch (e) {
      setErr(e?.message || "ERROR");
    } finally {
      setBusy(false);
    }
  }

  async function recompileWithAnswers(next) {
    if (!intentId) return;
    setBusy(true);
    setErr(null);
    try {
      const compiled = await nervaClient.compileIntent(intentId, {
        platform: next.platform || undefined,
        silenceHours: next.silenceHours ? Number(next.silenceHours) : undefined
      });

      setCard(compiled.card);
      setPlan(compiled.plan);
      setQuestions(compiled.questions || []);
      setPlatformNeeds(compiled.platformNeeds || []);
      setLayers(compiled.layers || []);
      setPlatformRisk(compiled.platformRisk || null);
    } catch (e) {
      setErr(e?.message || "ERROR");
    } finally {
      setBusy(false);
    }
  }

  async function submitPlanForApproval() {
    if (!plan) return;

    await onCreateApproval({
      kind: "plan",
      logId: selectedLog?.id,
      routineId: selectedLog?.routineId || null,
      operatorId: null,
      title: plan.title,
      summary,
      payload: {
        area: plan.area,
        channel: plan.channel,
        cadence: plan.cadence,
        autonomy: plan.autonomy,
        intention: plan.intention,
        detection: plan.detection,
        steps: plan.steps,
        platformNeeds,
        layers,
        platformRisk
      }
    });
  }

  function ModeButton({ value, label }) {
    const active = createMode === value;
    return (
      <button
        onClick={() => setCreateMode(value)}
        className={`rounded-xl border px-3 py-2 text-[12px] transition ${
          active ? "border-black bg-black text-white" : "border-black/10 bg-white/60 text-black/70 hover:bg-white"
        }`}
      >
        {label}
      </button>
    );
  }

  const platformOptions = useMemo(() => {
    const enabled = (catalog || []).filter((c) => String(c.isEnabled) !== "false");
    return enabled.map((c) => c.key).sort();
  }, [catalog]);

  return (
    <div className="flex h-full flex-col border-l border-black/10 bg-white/45 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <div>
          <div className="text-[12px] font-semibold tracking-wide text-black">Console</div>
          <div className="text-[11px] text-black/55">
            {tab === "operate" ? "Operar evento" : "Criar rotina por linguagem humana"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("operate")}
            className={`rounded-xl border px-3 py-2 text-[12px] ${
              tab === "operate" ? "border-black bg-black text-white" : "border-black/10 bg-white/60 text-black/70 hover:bg-white"
            }`}
          >
            Operar
          </button>
          <button
            onClick={() => setTab("create")}
            className={`rounded-xl border px-3 py-2 text-[12px] ${
              tab === "create" ? "border-black bg-black text-white" : "border-black/10 bg-white/60 text-black/70 hover:bg-white"
            }`}
          >
            Criar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tab === "operate" ? (
          !selectedLog ? (
            <div className="rounded-3xl border border-black/10 bg-white/60 p-4 text-[12px] text-black/60">
              Clique em um log para operar. Ou vá em <b>Criar</b> para iniciar uma rotina do zero.
            </div>
          ) : (
            <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
              <div className="text-[11px] text-black/55">Evento selecionado</div>
              <div className="mt-1 text-[12px] font-semibold text-black">{selectedLog.msg}</div>
              <div className="mt-1 text-[12px] text-black/60">{selectedLog.ctx}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Pill>{selectedLog.area}</Pill>
                <Pill>{selectedLog.channel}</Pill>
                <Pill>{selectedLog.level}</Pill>
                <Pill>{selectedLog.code}</Pill>
              </div>

              <div className="mt-4 text-[12px] text-black/65">
                Próximo: gerar plano a partir deste evento (ligaremos isso depois). Por enquanto, use <b>Criar</b>.
              </div>
            </div>
          )
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              <ModeButton value="panel" label="Painel" />
              <ModeButton value="prompt_short" label="Prompt curto" />
              <ModeButton value="prompt_detailed" label="Prompt detalhado" />
              <ModeButton value="suggestions" label="Sugestões" />
            </div>

            <div className="grid gap-3">
              {(createMode === "prompt_short" || createMode === "prompt_detailed") && (
                <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
                  <div className="text-[12px] font-semibold text-black">
                    {createMode === "prompt_short" ? "Pedido (curto)" : "Spec (detalhado)"}
                  </div>
                  <div className="mt-2 text-[12px] text-black/60">
                    O Nerva compila em <b>Cartão de Execução</b> + <b>Plano</b> e lista APIs/permits necessários.
                  </div>

                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={createMode === "prompt_short" ? 3 : 8}
                    placeholder={
                      createMode === "prompt_short"
                        ? "Ex: Quero evitar conversas paradas no WhatsApp e priorizar leads quentes."
                        : "Descreva regras, exceções, mensagens, horários, plataformas…"
                    }
                    className="mt-3 w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 placeholder:text-black/35 outline-none"
                  />

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-3">
                      <div className="text-[11px] font-semibold text-black/65">Plataforma</div>
                      <select
                        value={compileOverrides.platform}
                        onChange={(e) => setCompileOverrides((s) => ({ ...s, platform: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                      >
                        <option value="">(auto)</option>
                        {platformOptions.map((k) => (
                          <option key={k} value={k}>{k}</option>
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
                        onChange={(e) => setCompileOverrides((s) => ({ ...s, silenceHours: e.target.value }))}
                        placeholder="24"
                        className="mt-2 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                      />
                      <div className="mt-1 text-[11px] text-black/45">
                        Só usado se a plataforma for WhatsApp e o pedido envolver “parado/sem resposta”.
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={busy || prompt.trim().length < 2}
                    onClick={createAndCompile}
                    className={`mt-3 w-full rounded-2xl px-3 py-2 text-[12px] font-semibold ${
                      busy ? "bg-black/50 text-white" : "bg-black text-white hover:opacity-95"
                    }`}
                  >
                    {busy ? "Compilando…" : "Gerar Cartão + Plano"}
                  </button>

                  {err ? <div className="mt-2 text-[12px] text-black/60">erro: {err}</div> : null}
                </div>
              )}

              {createMode === "panel" && (
                <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
                  <div className="text-[12px] font-semibold text-black">Configuração rápida (Painel)</div>
                  <div className="mt-2 text-[12px] text-black/60">
                    Preencha o núcleo do cartão. O Nerva compila em plano e lista APIs/permits.
                  </div>

                  <div className="mt-3 grid gap-2">
                    <input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Objetivo em 1 linha (ex: proteger leads no WhatsApp)"
                      className="w-full rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                    />

                    <select
                      value={compileOverrides.platform}
                      onChange={(e) => setCompileOverrides((s) => ({ ...s, platform: e.target.value }))}
                      className="w-full rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                    >
                      <option value="">Escolha plataforma</option>
                      {platformOptions.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>

                    <button
                      disabled={busy || prompt.trim().length < 2 || !compileOverrides.platform}
                      onClick={createAndCompile}
                      className={`w-full rounded-2xl px-3 py-2 text-[12px] font-semibold ${
                        busy ? "bg-black/50 text-white" : "bg-black text-white hover:opacity-95"
                      }`}
                    >
                      {busy ? "Compilando…" : "Gerar Cartão + Plano (Painel)"}
                    </button>
                  </div>

                  {err ? <div className="mt-2 text-[12px] text-black/60">erro: {err}</div> : null}
                </div>
              )}

              {createMode === "suggestions" && (
                <div className="rounded-3xl border border-black/10 bg-white/60 p-4 text-[12px] text-black/65">
                  Sugestões entra no próximo passo: gerar 3–7 cartões por área com impacto e esforço.
                </div>
              )}

              {questions?.length ? (
                <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
                  <div className="text-[12px] font-semibold text-black">Perguntas necessárias</div>
                  <div className="mt-2 space-y-2">
                    {questions.map((q) => (
                      <div key={q.key} className="rounded-2xl border border-black/10 bg-white/70 p-3">
                        <div className="text-[12px] font-semibold text-black">{q.question}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {q.options.map((opt) => (
                            <button
                              key={String(opt)}
                              onClick={() => {
                                const next = { ...compileOverrides, [q.key]: String(opt) };
                                setCompileOverrides(next);
                                recompileWithAnswers(next);
                              }}
                              className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 hover:bg-white"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {platformNeeds?.length ? (
                <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
                  <div className="text-[12px] font-semibold text-black">APIs / Acessos necessários</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {platformNeeds.map((n) => (
                      <Pill key={n}>{n}</Pill>
                    ))}
                  </div>
                  {layers?.length ? (
                    <div className="mt-3">
                      <div className="text-[11px] font-semibold text-black/65">Camadas possíveis</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {layers.map((l, idx) => (
                          <Pill key={idx}>
                            {l.layer}
                            {l.stable ? " · estável" : ""}
                            {l.fragile ? " · frágil" : ""}
                            {l.optIn ? " · opt-in" : ""}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {platformRisk ? (
                    <div className="mt-2 text-[11px] text-black/55">risco: {platformRisk}</div>
                  ) : null}
                </div>
              ) : null}

              <CardView card={card} />

              {plan ? (
                <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
                  <div className="text-[12px] font-semibold text-black">Plano</div>
                  <div className="text-[11px] text-black/55">Edite e peça aprovação</div>

                  <div className="mt-3 grid gap-2">
                    <input
                      value={plan.title || ""}
                      onChange={(e) => setPlan((p) => ({ ...p, title: e.target.value }))}
                      className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] font-semibold text-black/90 outline-none"
                      placeholder="Título do plano"
                    />

                    <textarea
                      value={plan.intention || ""}
                      onChange={(e) => setPlan((p) => ({ ...p, intention: e.target.value }))}
                      rows={2}
                      className="w-full resize-none rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                      placeholder="Intenção"
                    />

                    <textarea
                      value={plan.detection || ""}
                      onChange={(e) => setPlan((p) => ({ ...p, detection: e.target.value }))}
                      rows={2}
                      className="w-full resize-none rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                      placeholder="Detecção"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={plan.cadence || ""}
                        onChange={(e) => setPlan((p) => ({ ...p, cadence: e.target.value }))}
                        className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                        placeholder="Cadência"
                      />
                      <select
                        value={plan.autonomy || "Aprovação"}
                        onChange={(e) => setPlan((p) => ({ ...p, autonomy: e.target.value }))}
                        className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 outline-none"
                      >
                        <option value="Aprovação">Aprovação</option>
                        <option value="Sugestões">Sugestões</option>
                      </select>
                    </div>

                    <div className="mt-2">
                      <div className="text-[11px] font-semibold text-black/65">Steps</div>
                      <div className="mt-2 space-y-2">
                        {(plan.steps || []).map((s, idx) => (
                          <StepRow
                            key={idx}
                            step={s}
                            idx={idx}
                            onChange={(next) =>
                              setPlan((p) => ({
                                ...p,
                                steps: p.steps.map((x, i) => (i === idx ? next : x))
                              }))
                            }
                            onRemove={() =>
                              setPlan((p) => ({
                                ...p,
                                steps: p.steps.filter((_, i) => i !== idx)
                              }))
                            }
                          />
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setPlan((p) => ({
                            ...p,
                            steps: [...(p.steps || []), { code: "ACTION.NEW", title: "Nova ação", details: "" }]
                          }))
                        }
                        className="mt-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-[12px] text-black/80 hover:bg-white"
                      >
                        + Adicionar step
                      </button>
                    </div>

                    <div className="mt-3 rounded-2xl border border-black/10 bg-white/70 p-3 text-[11px] text-black/60">
                      Resumo: {summary}
                    </div>

                    <button
                      onClick={submitPlanForApproval}
                      className="mt-2 rounded-2xl bg-black px-3 py-2 text-[12px] font-semibold text-white"
                    >
                      Pedir aprovação deste plano
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>

      <div className="border-t border-black/10 p-3">
        <div className="text-[11px] text-black/50">
          Plataformas e APIs são parte do plano: o Nerva lista acessos necessários antes de ativar.
        </div>
      </div>
    </div>
  );
}
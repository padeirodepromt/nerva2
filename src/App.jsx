// src/App.jsx
import React, { useMemo, useState } from "react";
import LogsTerminal from "./components/nerva/LogsTerminal";
import Console from "./components/nerva/Console";
import ApprovalsPanel from "./components/nerva/ApprovalsPanel";
import { nervaClient } from "./api/nervaClient";

function GrainGrid() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(0,0,0,0.06), transparent 45%), radial-gradient(circle at 70% 35%, rgba(0,0,0,0.05), transparent 50%), radial-gradient(circle at 60% 80%, rgba(0,0,0,0.05), transparent 55%), linear-gradient(to bottom, rgba(0,0,0,0.02), transparent 35%, rgba(0,0,0,0.02))"
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px"
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 55% 35%, rgba(255,255,255,0.0), rgba(255,255,255,0.0) 55%, rgba(0,0,0,0.05) 80%, rgba(0,0,0,0.08) 100%)"
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/60 px-3 py-2">
      <span className="text-[11px] text-black/45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[12px] text-black/80 outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function App() {
  const [area, setArea] = useState("Tudo");
  const [channel, setChannel] = useState("Todos");
  const [selectedLog, setSelectedLog] = useState(null);

  const filters = useMemo(() => ({ area, channel, limit: 200 }), [area, channel]);

  async function createApproval(payload) {
    await nervaClient.createApproval(payload);
  }

  return (
    <div className="relative min-h-screen bg-[#F3F2EE] text-black">
      <GrainGrid />

      <div className="relative z-10 mx-auto max-w-[1300px] px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[12px] font-semibold tracking-wide">NERVA</div>
            <div className="text-[11px] text-black/55">Operational Intelligence · Console</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select label="Área" value={area} onChange={setArea} options={["Tudo", "Vendas", "Operação", "Marketing", "Atendimento", "Financeiro"]} />
            <Select label="Canal" value={channel} onChange={setChannel} options={["Todos", "System", "WhatsApp", "Meta Ads", "Google Ads", "Gmail", "Sheets", "CRM"]} />
          </div>
        </div>

        <div className="h-[82vh] overflow-hidden rounded-[28px] border border-black/10 bg-white/40 shadow-[0_40px_140px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <div className="flex h-full min-h-0">
            <div className="min-w-0 flex-1">
              <LogsTerminal filters={filters} onSelect={setSelectedLog} />
            </div>

            <div className="w-[520px] min-w-[420px] max-w-[560px]">
              <div className="flex h-full flex-col">
                <div className="flex-1 min-h-0">
                  <Console selectedLog={selectedLog} onCreateApproval={createApproval} />
                </div>
                <ApprovalsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
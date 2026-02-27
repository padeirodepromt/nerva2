/* src/components/packages/neo/TelemetryBadge.jsx */
import React from 'react';
import { ShieldCheck, Zap, AlertTriangle, Activity } from 'lucide-react';

export const TelemetryBadge = ({ report }) => {
  if (!report) return null;

  const { isValid, stats, error } = report;

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-md border text-xs font-mono transition-all
      ${isValid ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'}`}>
      
      <div className="flex items-center gap-1.5">
        {isValid ? <ShieldCheck size={14} className="animate-pulse" /> : <AlertTriangle size={14} />}
        <span className="uppercase tracking-widest font-bold">
          {isValid ? 'Integridade OK' : 'Falha de Integridade'}
        </span>
      </div>

      <div className="h-4 w-[1px] bg-slate-700" />

      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Linhas</span>
          <span className="flex items-center gap-1 font-bold">
            <Activity size={10} /> {stats.newLines} / {stats.oldLines}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Delta</span>
          <span className={`font-bold ${(stats.dropRatio < 0.95) ? 'text-amber-400' : ''}`}>
            {(stats.dropRatio * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {error && (
        <div className="ml-2 px-2 py-0.5 bg-rose-500 text-white rounded text-[9px] uppercase font-black">
          {error}
        </div>
      )}
    </div>
  );
};
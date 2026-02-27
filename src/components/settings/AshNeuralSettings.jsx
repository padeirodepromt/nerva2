/* src/components/settings/AshNeuralSettings.jsx */
import React from 'react';
import { useAgentStore } from '../../stores/useAgentStore'; // Store que guarda as prefs
import { Switch } from '../ui/switch'; // Seu componente de UI existente

const AshNeuralSettings = () => {
  const { preferences, updatePreference } = useAgentStore();

  return (
    <div className="p-6 glass-card rounded-xl border border-[var(--glass-border)]">
      <h3 className="serif-font text-xl mb-4 text-[var(--text-primary)]">Conexão Neural (Notificações)</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Defina como e quando o Ash pode acessar sua atenção.
      </p>

      <div className="space-y-6">
        {/* 1. Controle Temporal (Técnico) */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-[var(--text-primary)]">Guardião do Tempo</div>
            <div className="text-xs text-[var(--text-secondary)]">Avisos sobre prazos, atrasos e urgências.</div>
          </div>
          <Switch 
            checked={preferences.notify_time} 
            onCheckedChange={(v) => updatePreference('notify_time', v)} 
          />
        </div>

        {/* 2. Controle de Fluxo (Estagnação) */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-[var(--text-primary)]">Gerente de Fluxo</div>
            <div className="text-xs text-[var(--text-secondary)]">Avisos sobre projetos parados ou esquecidos.</div>
          </div>
          <Switch 
            checked={preferences.notify_flow} 
            onCheckedChange={(v) => updatePreference('notify_flow', v)} 
          />
        </div>

        {/* 3. Controle Energético (Holístico) */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-[var(--text-primary)]">Sensor de Vitalidade</div>
            <div className="text-xs text-[var(--text-secondary)]">Insights sobre seu humor, energia e ciclos.</div>
          </div>
          <Switch 
            checked={preferences.notify_energy} 
            onCheckedChange={(v) => updatePreference('notify_energy', v)} 
          />
        </div>
      </div>
    </div>
  );
};

export default AshNeuralSettings;
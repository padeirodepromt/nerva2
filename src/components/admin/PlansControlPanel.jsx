import React from 'react';
import { USER_PLAN_SETTINGS } from '../config/userPlanSettings';
import { featuresList } from '../config/featuresList';

// Obter lista de planos e nomes amigáveis
type PlanKey = keyof typeof USER_PLAN_SETTINGS;
const planKeys = Object.keys(USER_PLAN_SETTINGS);

export default function PlansControlPanel() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Painel de Controle dos Planos</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #eee', padding: 8, background: '#f8f8f8', textAlign: 'left' }}>Funcionalidade</th>
            {planKeys.map(planKey => (
              <th key={planKey} style={{ border: '1px solid #eee', padding: 8, background: '#f0f0ff', textAlign: 'center' }}>
                {USER_PLAN_SETTINGS[planKey].name || planKey}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featuresList.map(feature => (
            <tr key={feature.id}>
              <td style={{ border: '1px solid #eee', padding: 8 }}>
                <strong>{feature.name}</strong>
                <div style={{ fontSize: 12, color: '#888' }}>{feature.description}</div>
              </td>
              {planKeys.map(planKey => {
                const enabled = USER_PLAN_SETTINGS[planKey].features?.includes(feature.id);
                return (
                  <td key={planKey} style={{ border: '1px solid #eee', padding: 8, textAlign: 'center' }}>
                    <input type="checkbox" checked={enabled} disabled readOnly />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 24, color: '#888', fontSize: 14 }}>
        * Painel somente visual. Para editar, altere o arquivo <code>userPlanSettings.js</code>.
      </p>
    </div>
  );
}

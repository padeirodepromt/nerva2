/**
 * BiomeEnergyTestPanel.jsx
 * 
 * Painel de teste para simular mudanças de energia e visualizar
 * atualizações automáticas de bioma em tempo real.
 */

import React, { useState } from 'react';
import { useBiomeContext } from '@/contexts/BiomeContext';
import { triggerBiomeUpdate } from '@/ai_services/biomeIntegrator';

const ENERGY_PRESETS = [
  {
    name: 'Criatividade Baixa (Nascente)',
    values: {
      physical: 5,
      mental: 4,
      emotional: 5,
      spiritual: 5,
      tags: ['criatividade'],
      notes: 'Preciso de flow',
    },
  },
  {
    name: 'Deep Focus (Floresta)',
    values: {
      physical: 7,
      mental: 8,
      emotional: 6,
      spiritual: 6,
      tags: ['foco_deep'],
      notes: 'Pronto para trabalho profundo',
    },
  },
  {
    name: 'Urgência Alta (Sertão)',
    values: {
      physical: 9,
      mental: 8,
      emotional: 7,
      spiritual: 5,
      tags: ['urgencia'],
      notes: 'Deadline próximo',
    },
  },
  {
    name: 'Planejamento (Ventos)',
    values: {
      physical: 6,
      mental: 8,
      emotional: 6,
      spiritual: 7,
      tags: ['estrategia'],
      notes: 'Pensando estrategicamente',
    },
  },
  {
    name: 'Descanso Profundo (Cosmos)',
    values: {
      physical: 3,
      mental: 4,
      emotional: 3,
      spiritual: 2,
      tags: ['volta'],
      notes: 'Preciso realmente de um tempo para mim',
    },
  },
  {
    name: 'Oceano (Baleia)',
    values: {
      physical: 4,
      mental: 4,
      emotional: 2,
      spiritual: 6,
      tags: ['introspecção'],
      notes: 'Estou em uma jornada emocional profunda, preciso explorar os sentimentos',
    },
  },
];

export const BiomeEnergyTestPanel = () => {
  const { currentBiome, ashRecommendation, mood } = useBiomeContext();
  const [customEnergy, setCustomEnergy] = useState({
    physical: 5,
    mental: 5,
    emotional: 5,
    spiritual: 5,
  });

  const handlePreset = (preset) => {
    triggerBiomeUpdate(preset.values);
  };

  const handleCustomChange = (key, value) => {
    setCustomEnergy((prev) => ({
      ...prev,
      [key]: parseInt(value) || 0,
    }));
  };

  const triggerCustom = () => {
    triggerBiomeUpdate({
      ...customEnergy,
      tags: [],
      notes: 'Teste personalizado',
    });
  };

  const BIOME_COLORS = {
    agua: 'bg-blue-600',
    floresta: 'bg-green-600',
    sertao: 'bg-orange-600',
    ventos: 'bg-cyan-600',
    cosmos: 'bg-purple-600',
  };

  const ANIMAL_EMOJIS = {
    beija_flor: '🐦',
    baleia: '🐋',
    elefante: '🐘',
    onca: '🐆',
    sabia: '🐦',
    coruja: '🦉',
  };

  return (
    <div className="p-6 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 space-y-6">
      {/* Estado Atual */}
      <div>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider opacity-70">
          Estado Atual
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className={`${BIOME_COLORS[currentBiome.biome]} p-3 rounded-lg text-white`}>
            <div className="text-xs opacity-75 mb-1">Bioma</div>
            <div className="text-lg font-bold uppercase">
              {currentBiome.biome}
              {currentBiome.subBiome && ` (${currentBiome.subBiome})`}
            </div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg text-white">
            <div className="text-xs opacity-75 mb-1">Guia</div>
            <div className="text-2xl">
              {ANIMAL_EMOJIS[currentBiome.animal]}
            </div>
            <div className="text-xs mt-1">{currentBiome.animal}</div>
          </div>
          <div className="bg-emerald-600 p-3 rounded-lg text-white">
            <div className="text-xs opacity-75 mb-1">Mood</div>
            <div className="text-sm font-mono uppercase">{mood}</div>
          </div>
          <div className="bg-indigo-600 p-3 rounded-lg text-white">
            <div className="text-xs opacity-75 mb-1">Cue Cognitivo</div>
            <div className="text-sm font-mono uppercase">
              {currentBiome.cognitiveCue}
            </div>
          </div>
        </div>
      </div>

      {/* Recomendação do Ash */}
      {ashRecommendation.message && (
        <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-3">
          <div className="text-xs font-semibold mb-2 text-blue-300">
            🤖 Última Recomendação do Ash
          </div>
          <div className="text-sm text-blue-100 whitespace-pre-wrap">
            {ashRecommendation.message}
          </div>
        </div>
      )}

      {/* Presets Rápidos */}
      <div>
        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider opacity-70">
          Presets de Energia
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {ENERGY_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-sm border border-border/20 hover:border-border/40"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controle Personalizado */}
      <div>
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider opacity-70">
          Teste Personalizado
        </h3>
        <div className="space-y-3">
          {['physical', 'mental', 'emotional', 'spiritual'].map((key) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <label className="text-xs uppercase opacity-60">
                  {key}
                </label>
                <span className="text-sm font-mono">
                  {customEnergy[key]}/10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={customEnergy[key]}
                onChange={(e) => handleCustomChange(key, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
          <button
            onClick={triggerCustom}
            className="w-full mt-4 bg-primary hover:bg-primary/80 text-primary-foreground py-2 rounded-lg font-semibold transition-all"
          >
            Atualizar Bioma
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs opacity-50 border-t border-border/10 pt-3">
        <p>
          💡 Mudar os valores de energia dispara uma atualização automática de
          bioma e uma recomendação do Ash.
        </p>
      </div>
    </div>
  );
};

export default BiomeEnergyTestPanel;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconFlux } from '@/components/icons/PranaLandscapeIcons';

const BIOME_OPTIONS = {
  agua_beijaflor: {
    title: 'Água · Beija-flor',
    subtitle: 'Flow leve, foco macio, criatividade fresca',
    color: 'from-sky-500/40 via-cyan-400/40 to-emerald-300/30',
    icon: '🐦',
    trigger: { biome: 'agua', subBiome: 'beijaflor', animal: 'beija_flor' }
  },
  agua_nascente: {
    title: 'Água · Nascente',
    subtitle: 'Rio sereno, ancestralidade, população ribeirinha',
    color: 'from-sky-600/50 via-emerald-500/40 to-green-900/50',
    icon: '🚣',
    trigger: { biome: 'agua', subBiome: 'nascente', animal: 'beija_flor' }
  },
  agua_oceano: {
    title: 'Água · Oceano',
    subtitle: 'Profundidade emocional, mergulho lento e seguro',
    color: 'from-sky-900/60 via-indigo-800/60 to-slate-900/70',
    icon: '🐋',
    trigger: { biome: 'agua', subBiome: 'oceano', animal: 'baleia' }
  },
  floresta: {
    title: 'Floresta Frutífera',
    subtitle: 'Grounding, foco profundo, passo firme e constante',
    color: 'from-emerald-700/60 via-emerald-500/50 to-lime-400/40',
    icon: '🐘',
    trigger: { biome: 'floresta', animal: 'elefante' }
  },
  cerrado: {
    title: 'Cerrado',
    subtitle: 'Ação focada, coragem, atravessar o calor das urgências',
    color: 'from-amber-700/70 via-orange-600/60 to-rose-600/60',
    icon: '🐆',
    trigger: { biome: 'cerrado', animal: 'onca' }
  }
};

export default function BiomeSelectorCard({ 
  currentBiome = null, 
  recommendedBiome = null,
  onBiomeSelect = () => {},
  loading = false 
}) {
  const [selectedBiome, setSelectedBiome] = useState(currentBiome);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setSelectedBiome(currentBiome);
  }, [currentBiome]);

  const handleSelectBiome = (biomeKey) => {
    setSelectedBiome(biomeKey);
    onBiomeSelect(BIOME_OPTIONS[biomeKey].trigger);
  };

  const recommendedKey = recommendedBiome?.biome === 'agua' 
    ? `agua_${recommendedBiome?.subBiome || 'beijaflor'}`
    : recommendedBiome?.biome;

  const displayBiomes = showAll 
    ? Object.entries(BIOME_OPTIONS)
    : Object.entries(BIOME_OPTIONS).slice(0, 3);

  return (
    <Card className="glass-effect border border-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFlux className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Bioma Ativo
            </h3>
            <p className="text-xs text-muted-foreground/70">
              {recommendedBiome ? 'Recomendação da Ash' : 'Escolha seu ambiente'}
            </p>
          </div>
        </div>
      </div>

      {/* Recomendação do Ash (se houver) */}
      {recommendedBiome && recommendedKey && BIOME_OPTIONS[recommendedKey] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{BIOME_OPTIONS[recommendedKey].icon}</span>
              <div>
                <p className="text-sm font-semibold text-amber-300">
                  {BIOME_OPTIONS[recommendedKey].title}
                </p>
                <p className="text-xs text-amber-100/70">
                  {BIOME_OPTIONS[recommendedKey].subtitle}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/20 text-amber-200">
              Recomendado
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={() => handleSelectBiome(recommendedKey)}
            disabled={loading || selectedBiome === recommendedKey}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white"
          >
            {selectedBiome === recommendedKey ? '✓ Ativo' : 'Ativar'}
          </Button>
        </motion.div>
      )}

      {/* Grid de Opções */}
      <div className="grid gap-2">
        {displayBiomes.map(([key, biome]) => {
          const isSelected = selectedBiome === key;
          const isRecommended = recommendedKey === key;
          
          return (
            <motion.button
              key={key}
              onClick={() => handleSelectBiome(key)}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : isRecommended
                  ? 'border-amber-400/30 bg-amber-400/5 hover:border-amber-400/50'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{biome.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{biome.title}</p>
                    <p className="text-xs text-muted-foreground/70">{biome.subtitle}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Toggle para ver mais */}
      {Object.keys(BIOME_OPTIONS).length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          {showAll ? '− Menos opções' : '+ Mais biomas'}
        </button>
      )}
    </Card>
  );
}

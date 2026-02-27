/**
 * BiomeReactionSystem.js
 * 
 * Sistema que atualiza o estado do bioma baseado no progresso
 * da maturação orgânica. Gerencia animações ambientais que refletem
 * o crescimento do projeto.
 */

export const BiomeReactionSystem = {
  /**
   * Reações da Nascente ao crescimento
   * Progressão: água clara → clareza aumenta → peixes aparecem → 
   * corais brilham → bioluminescência intensa
   */
  nascente: {
    solo: {
      waterClarity: 0.3,      // Água turva
      fishDensity: 0.1,       // Poucos peixes
      coralGlow: 0,           // Sem brilho
      biolumIntensity: 0,     // Sem bioluminescência
      particleCount: 10,
      particleSpeed: 0.3,
      particleColor: '#0ea5e9'
    },
    semente: {
      waterClarity: 0.5,
      fishDensity: 0.3,
      coralGlow: 0.2,
      biolumIntensity: 0.1,
      particleCount: 20,
      particleSpeed: 0.4,
      particleColor: '#06b6d4'
    },
    broto: {
      waterClarity: 0.7,
      fishDensity: 0.5,
      coralGlow: 0.4,
      biolumIntensity: 0.3,
      particleCount: 35,
      particleSpeed: 0.5,
      particleColor: '#22d3ee'
    },
    crescimento: {
      waterClarity: 0.85,
      fishDensity: 0.75,
      coralGlow: 0.7,
      biolumIntensity: 0.6,
      particleCount: 50,
      particleSpeed: 0.6,
      particleColor: '#67e8f9'
    },
    colheita: {
      waterClarity: 0.95,
      fishDensity: 0.95,
      coralGlow: 1,
      biolumIntensity: 1,
      particleCount: 80,
      particleSpeed: 0.8,
      particleColor: '#a5f3fc'
    }
  },

  /**
   * Reações da Floresta ao crescimento
   * Progressão: musgo escasso → musgo cresce → pássaros aparecem →
   * copa se fecha → luz filtrada
   */
  floresta: {
    solo: {
      mossGrowth: 0.1,        // Musgo mínimo
      canopyOpacity: 0.3,     // Copa aberta
      birdActivity: 0,        // Sem atividade
      lightFiltering: 0.2,    // Luz forte
      leafParticles: 5,
      particleSpeed: 0.2,
      particleColor: '#16a34a'
    },
    semente: {
      mossGrowth: 0.3,
      canopyOpacity: 0.45,
      birdActivity: 0.2,
      lightFiltering: 0.4,
      leafParticles: 15,
      particleSpeed: 0.3,
      particleColor: '#22c55e'
    },
    broto: {
      mossGrowth: 0.5,
      canopyOpacity: 0.6,
      birdActivity: 0.4,
      lightFiltering: 0.55,
      leafParticles: 25,
      particleSpeed: 0.4,
      particleColor: '#4ade80'
    },
    crescimento: {
      mossGrowth: 0.75,
      canopyOpacity: 0.75,
      birdActivity: 0.7,
      lightFiltering: 0.7,
      leafParticles: 40,
      particleSpeed: 0.5,
      particleColor: '#86efac'
    },
    colheita: {
      mossGrowth: 0.95,
      canopyOpacity: 0.9,
      birdActivity: 0.95,
      lightFiltering: 0.85,
      leafParticles: 60,
      particleSpeed: 0.7,
      particleColor: '#bbf7d0'
    }
  },

  /**
   * Reações do Sertão ao crescimento
   * Progressão: areia quente → sol intenso → cactos florescem →
   * frutos dourados → ouro no horizonte
   */
  sertao: {
    solo: {
      heatHaze: 0.1,          // Pouco efeito de calor
      sunBrightness: 0.4,     // Sol moderado
      cactusBloom: 0,         // Sem floração
      fruitGlow: 0,           // Sem frutos
      dustParticles: 10,
      particleSpeed: 0.2,
      particleColor: '#dc2626',
      skyGradient: 'from-orange-200 to-yellow-100'
    },
    semente: {
      heatHaze: 0.3,
      sunBrightness: 0.6,
      cactusBloom: 0.1,
      fruitGlow: 0,
      dustParticles: 20,
      particleSpeed: 0.3,
      particleColor: '#f97316',
      skyGradient: 'from-orange-300 to-yellow-200'
    },
    broto: {
      heatHaze: 0.5,
      sunBrightness: 0.75,
      cactusBloom: 0.3,
      fruitGlow: 0.2,
      dustParticles: 35,
      particleSpeed: 0.4,
      particleColor: '#f97316',
      skyGradient: 'from-orange-400 to-yellow-300'
    },
    crescimento: {
      heatHaze: 0.7,
      sunBrightness: 0.9,
      cactusBloom: 0.65,
      fruitGlow: 0.5,
      dustParticles: 50,
      particleSpeed: 0.5,
      particleColor: '#fbbf24',
      skyGradient: 'from-orange-500 to-yellow-400'
    },
    colheita: {
      heatHaze: 0.9,
      sunBrightness: 1,
      cactusBloom: 1,
      fruitGlow: 1,
      dustParticles: 80,
      particleSpeed: 0.7,
      particleColor: '#fcd34d',
      skyGradient: 'from-orange-600 to-yellow-500'
    }
  },

  /**
   * Reações de Ventos ao crescimento
   * Progressão: brisa leve → vento cresce → nuvens movem-se →
   * MindMap flutua → sementes dispersam-se
   */
  ventos: {
    solo: {
      cloudSpeed: 0.1,        // Nuvens lentas
      mindmapFloat: 0,        // Sem flutuação
      windParticles: 5,       // Poucas partículas
      seedDispersion: 0,      // Sem dispersão
      skyDynamics: 0.2,
      particleSpeed: 0.1,
      particleColor: '#3b82f6'
    },
    semente: {
      cloudSpeed: 0.3,
      mindmapFloat: 2,        // 2px de flutuação
      windParticles: 15,
      seedDispersion: 0.1,
      skyDynamics: 0.4,
      particleSpeed: 0.3,
      particleColor: '#0284c7'
    },
    broto: {
      cloudSpeed: 0.5,
      mindmapFloat: 5,        // 5px de flutuação
      windParticles: 30,
      seedDispersion: 0.3,
      skyDynamics: 0.6,
      particleSpeed: 0.4,
      particleColor: '#0ea5e9'
    },
    crescimento: {
      cloudSpeed: 0.75,
      mindmapFloat: 10,       // 10px de flutuação
      windParticles: 50,
      seedDispersion: 0.6,
      skyDynamics: 0.8,
      particleSpeed: 0.6,
      particleColor: '#38bdf8'
    },
    colheita: {
      cloudSpeed: 1,
      mindmapFloat: 15,       // 15px de flutuação
      windParticles: 80,
      seedDispersion: 1,      // Máxima dispersão
      skyDynamics: 1,
      particleSpeed: 0.8,
      particleColor: '#7dd3fc'
    }
  },

  /**
   * Reações do Cosmos ao crescimento
   * Progressão: ponto cósmico → vórtice se forma → espiral cresce →
   * nebula brilha → mandala consciente
   */
  cosmos: {
    solo: {
      starDensity: 0.1,       // Poucas estrelas
      nebulaBrightness: 0,    // Nebula escura
      vortexIntensity: 0,     // Sem vórtice
      mandalaGlow: 0,         // Mandala obscura
      cosmicParticles: 10,
      particleSpeed: 0.2,
      particleColor: '#a855f7'
    },
    semente: {
      starDensity: 0.3,
      nebulaBrightness: 0.2,
      vortexIntensity: 0.1,
      mandalaGlow: 0.1,
      cosmicParticles: 20,
      particleSpeed: 0.3,
      particleColor: '#d946ef'
    },
    broto: {
      starDensity: 0.5,
      nebulaBrightness: 0.4,
      vortexIntensity: 0.3,
      mandalaGlow: 0.3,
      cosmicParticles: 35,
      particleSpeed: 0.4,
      particleColor: '#d946ef'
    },
    crescimento: {
      starDensity: 0.75,
      nebulaBrightness: 0.7,
      vortexIntensity: 0.65,
      mandalaGlow: 0.6,
      cosmicParticles: 55,
      particleSpeed: 0.6,
      particleColor: '#e879f9'
    },
    colheita: {
      starDensity: 0.95,
      nebulaBrightness: 1,
      vortexIntensity: 1,
      mandalaGlow: 1,
      cosmicParticles: 100,
      particleSpeed: 0.8,
      particleColor: '#f0abfc'
    }
  },

  /**
   * Obtém as reações para um bioma e estágio específicos
   */
  getReactions(biome, stage) {
    return this[biome]?.[stage] || this.floresta.solo;
  },

  /**
   * Interpola entre dois estados de reação (para transições suaves)
   */
  interpolateReactions(from, to, progress) {
    const result = {};
    
    for (const key in from) {
      if (typeof from[key] === 'number') {
        result[key] = from[key] + (to[key] - from[key]) * progress;
      } else {
        result[key] = from[key]; // Strings/enums não mudam linearmente
      }
    }
    
    return result;
  },

  /**
   * Calcula o estado de reação baseado no progresso dentro de um estágio
   * (por exemplo, 45% de progresso em "broto" interpola entre "semente" e "broto")
   */
  getInterpolatedReactions(biome, stage, stageProgress) {
    const stages = ['solo', 'semente', 'broto', 'crescimento', 'colheita'];
    const currentIndex = stages.indexOf(stage);
    
    if (currentIndex === stages.length - 1) {
      // Já está no último estágio
      return this.getReactions(biome, stage);
    }
    
    const fromStage = stages[currentIndex];
    const toStage = stages[currentIndex + 1];
    
    const from = this.getReactions(biome, fromStage);
    const to = this.getReactions(biome, toStage);
    
    return this.interpolateReactions(from, to, stageProgress / 100);
  },

  /**
   * Gera CSS classes dinâmicas baseadas nas reações
   */
  generateTailwindClasses(biome, stage) {
    const reactions = this.getReactions(biome, stage);
    const classes = [];

    // Opacidade baseada em atividade
    if (reactions.birdActivity !== undefined) {
      const opacity = Math.round(0.3 + reactions.birdActivity * 0.7 * 100) / 100;
      classes.push(`opacity-${Math.round(opacity * 10)}`);
    }

    // Gradiente de céu para sertão
    if (reactions.skyGradient) {
      classes.push(`bg-gradient-to-b ${reactions.skyGradient}`);
    }

    return classes;
  },

  /**
   * Mapeia valores de reação para CSS custom properties
   */
  generateCSSVariables(biome, stage) {
    const reactions = this.getReactions(biome, stage);
    const vars = {};

    for (const [key, value] of Object.entries(reactions)) {
      if (typeof value === 'number') {
        vars[`--${key}`] = value.toString();
      } else {
        vars[`--${key}`] = `"${value}"`;
      }
    }

    return vars;
  }
};

export default BiomeReactionSystem;

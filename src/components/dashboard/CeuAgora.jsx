/**
 * @file src/components/dashboard/CeuAgora.jsx
 * @description Exibe o céu atual: Sol, Lua e Fase Lunar como subtítulo elegante.
 */

import React from 'react';
import { IconCosmos, IconHeart } from '@/components/icons/PranaLandscapeIcons';

export default function CeuAgora({ astralData }) {
  if (!astralData) {
    return <div className="text-xs text-muted-foreground/50">Carregando céu...</div>;
  }

  const { sunSign = 'Sol', moonPhase = 'Lua' } = astralData;

  // Extrai o nome da fase se moonPhase for um objeto, senão usa o valor direto
  const phaseName = typeof moonPhase === 'object' ? moonPhase.phase || 'Lua' : moonPhase;
  const sunText = typeof sunSign === 'string' ? sunSign : 'Sol';

  return (
    <div className="flex items-center gap-3 text-muted-foreground/80 dark:text-muted-foreground/85 font-sans text-xs md:text-sm">
      <div className="flex items-center gap-1">
        <IconCosmos className="w-3.5 h-3.5 opacity-75 shrink-0" />
        <span className="tracking-wide font-medium text-foreground/75">{sunText}</span>
      </div>
      
      <div className="w-px h-3 bg-white/15 dark:bg-white/10" />
      
      <div className="flex items-center gap-1">
        <IconHeart className="w-3.5 h-3.5 opacity-75 shrink-0" />
        <span className="tracking-wide font-medium text-foreground/75">{phaseName}</span>
      </div>
    </div>
  );
}

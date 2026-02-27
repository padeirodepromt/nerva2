/**
 * ViewHeader.jsx
 * 
 * Componente padronizado para headers de Views.
 * Garante consistência visual em toda a aplicação:
 * - Ícone Arcano (100x100)
 * - Título centralizado
 * - Subtítulo opcional
 */

import React from 'react';
import { cn } from '@/lib/utils';

export function ViewHeader({ 
  icon: Icon, 
  title, 
  subtitle = null,
  className = '',
  iconClassName = 'w-24 h-24'
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 mb-8 pt-4", className)}>
      {Icon && (
        <Icon className={cn("text-[rgb(var(--accent-rgb))]", iconClassName)} ativo={true} />
      )}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default ViewHeader;

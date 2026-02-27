/* canvas: src/components/ui/PageHeader.jsx
   desc: Cabeçalho Padrão V2 (Delicate). Minimalista, sem fundos pesados.
*/
import React from 'react';
import { cn } from '@/lib/utils';

export default function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  children,
  className 
}) {
  return (
    <header className={cn(
      // MUDANÇA: Fundo muito sutil, borda fina, altura compacta
      "flex-none py-4 px-6 border-b border-white/5 bg-background/20 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20 relative",
      className
    )}>
      {/* Lado Esquerdo: Identidade Limpa */}
      <div className="flex items-center gap-3">
        {Icon && (
          // Ícone menor e com fundo mais transparente
          <div className="p-2 bg-primary/5 rounded-lg border border-primary/10 text-primary opacity-80">
            <Icon className="w-5 h-5" ativo={true} />
          </div>
        )}
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-serif font-medium text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] md:text-xs text-muted-foreground font-sans uppercase tracking-widest opacity-60">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Lado Direito: Ações e KPIs */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {children} {/* Widgets ou KPIs extras */}
        {actions && (
          <div className="flex items-center gap-2 pl-4 md:border-l border-white/10">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
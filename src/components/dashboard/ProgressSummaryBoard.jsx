import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Sparkles } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

const ProgressBar = ({ value, accent }) => {
  const safeValue = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${safeValue}%`, background: accent || 'var(--accent)' }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  accent: PropTypes.string,
};

const EmptyState = ({ message }) => (
  <div className="rounded-xl border border-dashed border-white/10 bg-background/40 p-6 text-sm text-muted-foreground/70 text-center">
    {message}
  </div>
);

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
};

const Section = ({ title, subtitle, icon: Icon, items, emptyMessage, renderMeta }) => (
  <Card className="glass-effect border-white/10">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon className="w-4 h-4 text-accent" />
          {title}
        </CardTitle>
        {subtitle && (
          <CardDescription className="text-xs text-muted-foreground/80">{subtitle}</CardDescription>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        items.map((item) => (
          <div key={item.id} className="space-y-2 p-3 rounded-lg border border-white/5 bg-white/5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground/70 truncate">{item.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{item.progress}%</p>
                <p className="text-[11px] text-muted-foreground/60">{item.completed}/{item.total} concluídas</p>
              </div>
            </div>
            <ProgressBar value={item.progress} accent={item.accent} />
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground/75">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> {item.ready} em curso
                </span>
                <span className="inline-flex items-center gap-1 text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> {item.blocked} bloqueadas
                </span>
              </div>
              {renderMeta ? renderMeta(item) : null}
            </div>
          </div>
        ))
      )}
    </CardContent>
  </Card>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  emptyMessage: PropTypes.string,
  renderMeta: PropTypes.func,
};

const metaSankalpa = (item) => (
  <Badge variant="outline" className={cn('px-2 py-0.5 text-[10px] uppercase tracking-wide border-white/10')}>
    {item.projectCount || 0} projeto{item.projectCount === 1 ? '' : 's'}
  </Badge>
);

const metaTeam = (item) => (
  <Badge variant="outline" className={cn('px-2 py-0.5 text-[10px] uppercase tracking-wide border-white/10')}>
    {item.memberCount || 0} membro{item.memberCount === 1 ? '' : 's'}
  </Badge>
);

export default function ProgressSummaryBoard({ sankalpaProgress = [], teamProgress = [] }) {
  const sankalpaItems = sankalpaProgress.slice(0, 4);
  const teamItems = teamProgress.slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section
        title="Progresso por Sankalpa"
        subtitle="Fluxos alinhados às intenções"
        icon={Sparkles}
        items={sankalpaItems}
        emptyMessage="Sem tarefas vinculadas a Sankalpas neste contexto."
        renderMeta={metaSankalpa}
      />
      <Section
        title="Progresso por Time"
        subtitle="Visão colaborativa"
        icon={Users}
        items={teamItems}
        emptyMessage="Sem tarefas atribuídas aos times selecionados."
        renderMeta={metaTeam}
      />
    </div>
  );
}

ProgressSummaryBoard.propTypes = {
  sankalpaProgress: PropTypes.arrayOf(PropTypes.object),
  teamProgress: PropTypes.arrayOf(PropTypes.object),
};

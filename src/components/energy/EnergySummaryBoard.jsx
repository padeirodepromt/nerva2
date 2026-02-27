import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ENERGY_TAGS, getEnergyTagMeta, summarizeEnergyByTeam } from '@/utils/energy';
import { cn } from '@/lib/utils';

const renderTagPill = (tagId, count) => {
  const tagMeta = getEnergyTagMeta(tagId);
  if (!tagMeta || !count) return null;
  return (
    <Badge
      key={tagId}
      variant="outline"
      className="px-2 py-1 text-[11px] font-medium border-current"
      style={{
        borderColor: `${tagMeta.color}80`,
        color: tagMeta.color,
        background: `${tagMeta.color}10`,
      }}
    >
      {tagMeta.label}
      <span className="ml-1 text-[10px] text-muted-foreground/80">{count}</span>
    </Badge>
  );
};

const emptyState = (message) => (
  <div className="rounded-xl border border-dashed border-white/10 bg-background/40 p-4 text-xs text-muted-foreground text-center">
    {message}
  </div>
);

export default function EnergySummaryBoard({
  tasks = [],
  teams = [],
  resolveAssignment,
  className,
  title = 'Pulso de Energia',
  subtitle,
  emptyMessage = 'Nenhuma tarefa com energia registrada neste contexto.',
  showPerTeam = true,
}) {
  const summary = useMemo(
    () => summarizeEnergyByTeam(tasks, teams, resolveAssignment),
    [tasks, teams, resolveAssignment]
  );

  if (!summary.totalTasks) {
    return emptyState(emptyMessage);
  }

  const anyEnergy = Object.keys(summary.overall || {}).length > 0;

  return (
    <Card className={cn('glass-effect border border-white/10 p-4 space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground/80">
            {subtitle || `${summary.totalTasks} tarefas analisadas`}
          </p>
          {summary.withoutTag > 0 && (
            <p className="mt-1 text-[11px] text-muted-foreground/60">
              {summary.withoutTag} tarefa{summary.withoutTag > 1 ? 's' : ''} sem tag de energia definida.
            </p>
          )}
        </div>
        {anyEnergy && (
          <div className="flex flex-wrap justify-end gap-2">
            {ENERGY_TAGS.map((tag) => renderTagPill(tag.id, summary.overall[tag.id]))}
          </div>
        )}
      </div>

      {showPerTeam && summary.perTeam.length > 0 && (
        <>
          <Separator className="bg-white/5" />
          <div className="grid gap-2">
            {summary.perTeam.map((team) => {
              const topTags = Object.entries(team.distribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
              return (
                <div
                  key={team.teamId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white/90">{team.label}</span>
                    <span className="text-[11px] text-muted-foreground/70">
                      {team.total} tarefa{team.total > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {topTags.length > 0
                      ? topTags.map(([tagId, count]) => renderTagPill(tagId, count))
                      : (
                        <span className="text-[11px] italic text-muted-foreground/70">
                          sem energia registrada
                        </span>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}

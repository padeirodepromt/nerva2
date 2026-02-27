import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, AlertTriangle, Activity, Clock } from '@/components/icons/PranaLandscapeIcons';

const renderProjectRow = (entry, onOpenProject, renderMetrics) => {
  if (!entry) return null;
  return (
    <div
      key={entry.project.id}
      className="glass-effect border border-white/10 rounded-lg px-3 py-2 flex flex-col gap-1"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">{entry.project.name}</p>
          <p className="text-[11px] text-muted-foreground/70">
            {entry.progress}% concluído • {entry.completed}/{entry.total} entregues
          </p>
        </div>
        {onOpenProject && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => onOpenProject(entry.project.id)}
            title="Abrir projeto no hub"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        )}
      </div>
      {renderMetrics && (
        <div className="text-[11px] text-muted-foreground/80 flex flex-wrap gap-2">
          {renderMetrics(entry)}
        </div>
      )}
    </div>
  );
};

function ProjectComparativeBoard({ summaries, onOpenProject, className }) {
  const entries = Array.isArray(summaries) ? summaries : [];
  if (entries.length === 0) {
    return null;
  }

  const topProgress = [...entries]
    .sort((a, b) => {
      if (b.progress !== a.progress) return b.progress - a.progress;
      return b.total - a.total;
    })
    .slice(0, 3);

  const mostBlocked = [...entries]
    .sort((a, b) => {
      if (b.blockedRatio !== a.blockedRatio) return b.blockedRatio - a.blockedRatio;
      if (b.blocked !== a.blocked) return b.blocked - a.blocked;
      return b.total - a.total;
    })
    .slice(0, 3);

  const overdueFocus = [...entries]
    .sort((a, b) => {
      if (b.overdue !== a.overdue) return b.overdue - a.overdue;
      return b.dueSoon - a.dueSoon;
    })
    .slice(0, 3);

  const sections = [
    {
      key: 'progress',
      title: 'Maior avanço',
      description: 'Projetos liderando em percentual concluído.',
      Icon: Activity,
      items: topProgress,
      emptyMessage: 'Nenhum projeto com progresso registrado.',
      renderMetrics: (entry) => (
        <>
          <span>{entry.completed} concluídas</span>
          {entry.overdue > 0 && (
            <Badge variant="outline" className="text-[10px] border-amber-400/40 bg-amber-400/10 text-amber-200">
              {entry.overdue} atrasada{entry.overdue === 1 ? '' : 's'}
            </Badge>
          )}
        </>
      ),
    },
    {
      key: 'blocked',
      title: 'Maior bloqueio',
      description: 'Trabalhos com maior proporção de impedimentos.',
      Icon: AlertTriangle,
      items: mostBlocked,
      emptyMessage: 'Nenhum bloqueio significativo encontrado.',
      renderMetrics: (entry) => (
        <>
          <span>
            {entry.blocked} bloqueada{entry.blocked === 1 ? '' : 's'} • {(entry.blockedRatio * 100).toFixed(0)}% do fluxo
          </span>
        </>
      ),
    },
    {
      key: 'deadlines',
      title: 'Atenção prazos',
      description: 'Projetos com entregas em atraso ou próximas.',
      Icon: Clock,
      items: overdueFocus,
      emptyMessage: 'Nenhuma entrega em atraso ou próxima de vencer.',
      renderMetrics: (entry) => (
        <>
          <span>{entry.overdue} em atraso</span>
          <span>{entry.dueSoon} para os próximos 7 dias</span>
        </>
      ),
    },
  ];

  return (
    <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${className || ''}`}>
      {sections.map((section) => (
        <Card key={section.key} className="glass-effect border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <section.Icon className="w-4 h-4" />
              <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground/70">
              {section.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.length === 0 ? (
              <p className="text-xs text-muted-foreground/60">{section.emptyMessage}</p>
            ) : (
              section.items.map((entry) => renderProjectRow(entry, onOpenProject, section.renderMetrics))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

ProjectComparativeBoard.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.shape({
    project: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    total: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
    blocked: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    overdue: PropTypes.number,
    dueSoon: PropTypes.number,
    blockedRatio: PropTypes.number,
  })),
  onOpenProject: PropTypes.func,
  className: PropTypes.string,
};

ProjectComparativeBoard.defaultProps = {
  summaries: [],
  onOpenProject: undefined,
  className: '',
};

export default ProjectComparativeBoard;

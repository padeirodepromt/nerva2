import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Clock3, Activity } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

const formatTimestamp = (value) => {
    if (!value) return 'Sem data';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sem data';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const energyBadgeClass = {
    positivo: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
    neutro: 'bg-slate-500/10 text-slate-200 border-slate-400/40',
    negativo: 'bg-rose-500/10 text-rose-300 border-rose-400/40',
};

export default function NexusHistoryTimeline({ history = [], pageSize = 5, className }) {
    const entries = useMemo(() => Array.isArray(history) ? history : [], [history]);
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));

    const paginatedEntries = useMemo(() => {
        const start = (page - 1) * pageSize;
        return entries.slice(start, start + pageSize);
    }, [entries, page, pageSize]);

    if (entries.length === 0) {
        return (
            <Card className={cn('bg-background/40 border-dashed border-border/40', className)}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        Histórico do Nexus
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Aguardando as primeiras automações para preencher a linha do tempo.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const handlePageChange = (newPage) => {
        setPage(Math.min(Math.max(newPage, 1), totalPages));
    };

    return (
        <Card className={cn('bg-background/60 border-border/60 backdrop-blur-sm', className)}>
            <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    Histórico do Nexus
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Últimas ações e automações registradas para o projeto.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ul className="space-y-3">
                    {paginatedEntries.map((entry) => (
                        <li key={entry.id} className="flex items-start gap-3 border border-border/40 rounded-lg p-3 bg-background/50">
                            <span className="mt-1">
                                <Clock3 className="w-4 h-4 text-muted-foreground" />
                            </span>
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-sm text-glow truncate">
                                        {entry.summary || entry.action || 'Evento do Nexus'}
                                    </p>
                                    {entry.status && (
                                        <Badge variant="outline" className="uppercase tracking-wide text-[11px]">
                                            {entry.status.replaceAll('_', ' ')}
                                        </Badge>
                                    )}
                                    {entry.energyImpact && (
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'uppercase tracking-wide text-[11px] border',
                                                energyBadgeClass[entry.energyImpact] || energyBadgeClass.neutro,
                                            )}
                                        >
                                            Energia: {entry.energyImpact}
                                        </Badge>
                                    )}
                                </div>
                                {entry.action && (
                                    <p className="text-xs text-muted-foreground/80">
                                        Ação: {entry.action}
                                    </p>
                                )}
                                {entry.assignedTo && (
                                    <p className="text-xs text-muted-foreground/80">
                                        Responsável: {entry.assignedTo}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    {formatTimestamp(entry.timestamp)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>

                {totalPages > 1 && (
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(event) => { event.preventDefault(); handlePageChange(page - 1); }}
                                    aria-disabled={page === 1}
                                    className={page === 1 ? 'pointer-events-none opacity-60' : ''}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            isActive={pageNumber === page}
                                            onClick={(event) => { event.preventDefault(); handlePageChange(pageNumber); }}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(event) => { event.preventDefault(); handlePageChange(page + 1); }}
                                    aria-disabled={page === totalPages}
                                    className={page === totalPages ? 'pointer-events-none opacity-60' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </CardContent>
        </Card>
    );
}

NexusHistoryTimeline.propTypes = {
    history: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        action: PropTypes.string,
        summary: PropTypes.string,
        status: PropTypes.string,
        timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        energyImpact: PropTypes.string,
        assignedTo: PropTypes.string,
    })),
    pageSize: PropTypes.number,
    className: PropTypes.string,
};

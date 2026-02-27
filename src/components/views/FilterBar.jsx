/* src/components/views/FilterBar.jsx
   desc: Barra de Filtros Padronizada para todas as Views
   feat: Status, Prioridade, Busca, Responsável, Intervalo de Datas
*/

import React from 'react';
import { 
    IconSearch, IconFilter, IconX, IconChevronDown
} from '@/components/icons/PranaLandscapeIcons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
    { value: 'all', label: 'Todos', color: 'bg-gray-500/10 text-gray-400' },
    { value: 'todo', label: 'A Fazer', color: 'bg-gray-500/10 text-gray-400' },
    { value: 'in_progress', label: 'Em Andamento', color: 'bg-blue-500/10 text-blue-400' },
    { value: 'blocked', label: 'Bloqueado', color: 'bg-red-500/10 text-red-400' },
    { value: 'done', label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400' },
];

const PRIORITY_OPTIONS = [
    { value: 'all', label: 'Todas', color: 'bg-gray-500/10 text-gray-400' },
    { value: 'critical', label: 'Crítica', color: 'bg-red-500/10 text-red-400' },
    { value: 'high', label: 'Alta', color: 'bg-orange-500/10 text-orange-400' },
    { value: 'medium', label: 'Média', color: 'bg-amber-500/10 text-amber-400' },
    { value: 'low', label: 'Baixa', color: 'bg-blue-500/10 text-blue-400' },
];

/**
 * FilterBar - Barra de filtros padronizada
 * @param {string} searchText - Valor da busca
 * @param {function} onSearchChange - Callback ao alterar busca
 * @param {string} statusFilter - Status selecionado
 * @param {function} onStatusChange - Callback ao alterar status
 * @param {string} priorityFilter - Prioridade selecionada
 * @param {function} onPriorityChange - Callback ao alterar prioridade
 * @param {function} onClearAll - Callback para limpar todos os filtros
 * @param {boolean} showPriority - Mostrar filtro de prioridade (default: true)
 * @param {boolean} showStatus - Mostrar filtro de status (default: true)
 */
export default function FilterBar({
    searchText = '',
    onSearchChange,
    statusFilter = 'all',
    onStatusChange,
    priorityFilter = 'all',
    onPriorityChange,
    onClearAll,
    showPriority = true,
    showStatus = true,
}) {
    const hasActiveFilters = searchText || statusFilter !== 'all' || priorityFilter !== 'all';

    const getStatusLabel = (status) => STATUS_OPTIONS.find(s => s.value === status)?.label || status;
    const getPriorityLabel = (priority) => PRIORITY_OPTIONS.find(p => p.value === priority)?.label || priority;
    const getStatusColor = (status) => STATUS_OPTIONS.find(s => s.value === status)?.color || '';
    const getPriorityColor = (priority) => PRIORITY_OPTIONS.find(p => p.value === priority)?.color || '';

    return (
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-muted/5 shrink-0 gap-4">
            {/* LADO ESQUERDO: Busca */}
            <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={searchText}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="Buscar por título..."
                        className="pl-9 h-9 bg-card/50 border-white/10 text-xs focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/40"
                    />
                </div>
            </div>

            {/* LADO DIREITO: Filtros Dropdowns */}
            <div className="flex items-center gap-2">
                
                {/* Filtro de Status */}
                {showStatus && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-9 px-3 text-xs gap-1 bg-card/50 border border-white/10 hover:bg-card/70"
                            >
                                <IconFilter className="w-3 h-3" />
                                <span className="hidden sm:inline">Status</span>
                                {statusFilter !== 'all' && (
                                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-white/10">
                                        {getStatusLabel(statusFilter)}
                                    </Badge>
                                )}
                                <IconChevronDown className="w-3 h-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-white/10 w-[180px]">
                            <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            {STATUS_OPTIONS.map(option => (
                                <DropdownMenuCheckboxItem
                                    key={option.value}
                                    checked={statusFilter === option.value}
                                    onCheckedChange={() => onStatusChange?.(option.value)}
                                    className="text-xs cursor-pointer flex items-center gap-2 hover:bg-white/10"
                                >
                                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', option.color)}>
                                        {option.label}
                                    </span>
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Filtro de Prioridade */}
                {showPriority && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-9 px-3 text-xs gap-1 bg-card/50 border border-white/10 hover:bg-card/70"
                            >
                                <IconFilter className="w-3 h-3" />
                                <span className="hidden sm:inline">Prioridade</span>
                                {priorityFilter !== 'all' && (
                                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-white/10">
                                        {getPriorityLabel(priorityFilter)}
                                    </Badge>
                                )}
                                <IconChevronDown className="w-3 h-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-white/10 w-[180px]">
                            <DropdownMenuLabel className="text-xs">Prioridade</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            {PRIORITY_OPTIONS.map(option => (
                                <DropdownMenuCheckboxItem
                                    key={option.value}
                                    checked={priorityFilter === option.value}
                                    onCheckedChange={() => onPriorityChange?.(option.value)}
                                    className="text-xs cursor-pointer flex items-center gap-2 hover:bg-white/10"
                                >
                                    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', option.color)}>
                                        {option.label}
                                    </span>
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Botão Limpar Filtros */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/10"
                        onClick={onClearAll}
                        title="Limpar filtros"
                    >
                        <IconX className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

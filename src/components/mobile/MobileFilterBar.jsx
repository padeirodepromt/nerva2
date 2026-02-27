/* src/components/mobile/MobileFilterBar.jsx
   desc: FilterBar colapsível para mobile.
   feat: Filtros em sheet modal com suporte a status, prioridade e busca.
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IconFilter, IconSearch, IconX 
} from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/components/LanguageProvider';

export default function MobileFilterBar({
    searchText,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
    onClearAll
}) {
    const { t } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions = [
        { value: 'all', label: t('filter_all') || 'Todos' },
        { value: 'todo', label: t('list_view_status_todo') || 'A Fazer' },
        { value: 'doing', label: t('list_view_status_doing') || 'Fazendo' },
        { value: 'done', label: t('list_view_status_done') || 'Pronto' }
    ];

    const priorityOptions = [
        { value: 'all', label: t('filter_all') || 'Todos' },
        { value: 'low', label: 'Baixa' },
        { value: 'medium', label: 'Média' },
        { value: 'high', label: 'Alta' },
        { value: 'critical', label: 'Crítica' }
    ];

    const hasActiveFilters = searchText || statusFilter !== 'all' || priorityFilter !== 'all';

    return (
        <>
            {/* Header com botão de filtro */}
            <div className="flex items-center gap-2 px-4 py-2 bg-background/80 border-b border-white/10">
                <div className="flex-1 relative group">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-[rgb(var(--accent-rgb))] transition-colors" />
                    <Input
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('button_search') || 'Filtrar...'}
                        className="pl-8 h-8 text-xs bg-white/5 border-white/10"
                    />
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 relative"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <IconFilter className="w-4 h-4" />
                    {hasActiveFilters && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                </Button>
            </div>

            {/* Modal de Filtros */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[45] bg-black/40"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[50] bg-background border-t border-white/10 rounded-t-3xl max-h-[70vh] overflow-y-auto p-6 flex flex-col gap-6"
                        >
                            {/* Header do modal */}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-bold uppercase tracking-widest">Filtros</h3>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                onStatusChange(opt.value);
                                            }}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                                                statusFilter === opt.value
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Prioridade</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {priorityOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                onPriorityChange(opt.value);
                                            }}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                                                priorityFilter === opt.value
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Button */}
                            {hasActiveFilters && (
                                <Button
                                    onClick={() => {
                                        onSearchChange('');
                                        onStatusChange('all');
                                        onPriorityChange('all');
                                        onClearAll?.();
                                        setIsOpen(false);
                                    }}
                                    variant="outline"
                                    className="border-white/20 text-muted-foreground hover:text-foreground w-full mt-4"
                                >
                                    Limpar Filtros
                                </Button>
                            )}

                            {/* Close Button */}
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="w-full glow-effect"
                            >
                                Aplicar
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

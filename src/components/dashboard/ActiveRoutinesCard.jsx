/* src/components/dashboard/ActiveRoutinesCard.jsx
   desc: Card de Ciclos Ativos V10 (Neural OS).
   feat: Integração com useRoutines, Poda de Realm e distinção Âncora vs Território.
*/

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    IconClock, IconFlux, IconZap, IconLayers, IconChevronRight 
} from '@/components/icons/PranaLandscapeIcons';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useRoutines } from '@/hooks/useRoutines';
import { cn } from '@/lib/utils';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export default function ActiveRoutinesCard() {
    // [V10] Consumindo a inteligência centralizada
    const { activeRealmId } = useWorkspaceStore();
    const { routines, loading } = useRoutines();

    // Filtragem de Tempo Real (Hoje)
    const today = new Date().getDay();
    const nowHour = new Date().getHours();

    const todayRoutines = useMemo(() => {
        return routines
            .filter(r => r.days?.includes(today))
            .sort((a, b) => a.startHour - b.startHour);
    }, [routines, today]);

    const isRoutineActive = (start, end) => nowHour >= start && nowHour < end;

    // Definição de Cores baseada no Realm Ativo
    const realmColor = activeRealmId === 'professional' ? 'text-indigo-400' : 'text-emerald-400';
    const realmBg = activeRealmId === 'professional' ? 'bg-indigo-500/10' : 'bg-emerald-500/10';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect p-8 rounded-[32px] border border-white/5 bg-white/[0.01] relative overflow-hidden group"
        >
            {/* Textura de Consciência (Noise) */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} 
            />

            {/* Header V10 */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="space-y-1">
                    <h3 className={cn("text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2", realmColor)}>
                        <IconFlux className="w-3.5 h-3.5" /> Ritmo de Hoje
                    </h3>
                    <p className="text-lg font-serif italic text-zinc-200">
                        {DAYS[today]}, <span className="opacity-40 not-italic font-sans text-sm">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                    </p>
                </div>
                
                {/* Badge de Contexto Ativo */}
                <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5", realmBg, realmColor)}>
                    {activeRealmId === 'all' ? 'Unificado' : activeRealmId}
                </div>
            </div>

            {/* Listagem de Ciclos */}
            <div className="space-y-4 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-20">
                        <IconClock className="w-8 h-8 animate-spin-slow" />
                        <span className="text-[9px] uppercase font-black tracking-widest">Sincronizando Ciclos...</span>
                    </div>
                ) : todayRoutines.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl opacity-30">
                        <IconZap className="w-8 h-8 mb-2" />
                        <p className="text-[10px] uppercase font-bold tracking-widest text-center px-6">
                            Espaço livre neste Universo para hoje.
                        </p>
                    </div>
                ) : (
                    todayRoutines.map((routine, idx) => {
                        const active = isRoutineActive(routine.startHour, routine.endHour);
                        const isBlock = routine.behavior === 'block';

                        return (
                            <motion.div
                                key={routine.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={cn(
                                    "group/item flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border relative",
                                    active 
                                        ? "bg-white/[0.05] border-white/10 shadow-2xl shadow-black/20 translate-x-1" 
                                        : "bg-transparent border-transparent hover:border-white/5 hover:bg-white/[0.02]"
                                )}
                            >
                                {/* Active Glow Line */}
                                {active && (
                                    <div className={cn(
                                        "absolute left-0 top-3 bottom-3 w-1 rounded-full blur-[2px] animate-pulse",
                                        activeRealmId === 'professional' ? "bg-indigo-400" : "bg-emerald-400"
                                    )} />
                                )}

                                {/* Icon / Behavior Indicator */}
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 transition-all border",
                                    active ? "bg-white/10 border-white/10" : "bg-white/[0.02] border-white/5 group-hover/item:border-white/10"
                                )}>
                                    {isBlock ? (
                                        <IconLayers className={cn("w-4 h-4", active ? realmColor : "opacity-30")} />
                                    ) : (
                                        <IconZap className={cn("w-4 h-4", active ? realmColor : "opacity-30")} />
                                    )}
                                    <span className="text-[8px] font-black mt-1 opacity-40 uppercase">
                                        {routine.startHour}h
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className={cn(
                                            "font-serif italic text-base transition-colors",
                                            active ? "text-white" : "text-zinc-500 group-hover/item:text-zinc-300"
                                        )}>
                                            {routine.title}
                                        </h4>
                                        <span className={cn(
                                            "text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-40 transition-opacity",
                                            active && "opacity-40"
                                        )}>
                                            {isBlock ? 'Território' : 'Âncora'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            {active && (
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '100%' }}
                                                    transition={{ duration: (routine.endHour - routine.startHour) * 3600, ease: "linear" }}
                                                    className={cn("h-full", activeRealmId === 'professional' ? "bg-indigo-500" : "bg-emerald-500")}
                                                />
                                            )}
                                        </div>
                                        <span className="text-[9px] font-bold opacity-30 tabular-nums">
                                            {routine.endHour - routine.startHour}h
                                        </span>
                                    </div>
                                </div>

                                {active && (
                                    <IconChevronRight className="w-3 h-3 opacity-20" />
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Footer / Meta */}
            {!loading && todayRoutines.length > 0 && (
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-20">
                    <span className="text-[8px] font-black uppercase tracking-widest">Ritmo Circadiano v10</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <div className="w-1 h-1 rounded-full bg-white opacity-50" />
                        <div className="w-1 h-1 rounded-full bg-white opacity-20" />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
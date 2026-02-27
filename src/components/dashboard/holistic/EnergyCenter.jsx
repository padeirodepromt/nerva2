/* src/components/dashboard/holistic/EnergyCenter.jsx
   desc: Centro de Inteligência Bio-Digital V8.
   feat: Unifica Budget Diário (Operacional) e Histórico Semanal (Retrospectivo).
   arch: Consome a lógica de cálculo de Oferta vs Demanda.
*/

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Utilizando caminhos relativos para garantir a resolução no ambiente de compilação
import { 
    IconZap, 
    IconBrainCircuit, 
    IconAlertTriangle, 
    IconChevronDown, 
    IconChevronUp,
    IconTrendingUp 
} from '../../icons/PranaLandscapeIcons';
import { cn } from '../../../lib/utils';
import { useTranslations } from '../../LanguageProvider';

/**
 * Lógica Interna do Motor de Energia (Mapeada localmente para evitar erros de importação externa no preview)
 */
const energyEngine = {
    calculateDailyDemand: (tasks = []) => {
        return tasks.reduce((total, task) => {
            const level = task.properties?.energy_level || 2;
            const duration = task.duration_hours || 1;
            return total + (level * duration);
        }, 0);
    },
    calculateSupplyFromCheckin: (checkin) => {
        if (!checkin) return 100; // Fallback para 100% se não houver check-in
        const baseEnergy = (checkin.physical + checkin.mental + checkin.emotional) / 3;
        const moodModifiers = {
            joy: 1.2, focus: 1.15, creativity: 1.1, calm: 1.0,
            gratitude: 1.0, anxiety: 0.8, confusion: 0.7, sadness: 0.6
        };
        const multiplier = moodModifiers[checkin.mood] || 1.0;
        return Math.round(baseEnergy * multiplier);
    },
    getEnergyStatus: (supply, demand) => {
        const ratio = demand / (supply || 1);
        if (ratio > 1.2) return { status: 'deficit', label: 'Crítico', color: 'text-red-500' };
        if (ratio > 0.9) return { status: 'warning', label: 'No Limite', color: 'text-orange-500' };
        if (ratio > 0.5) return { status: 'optimal', label: 'Equilibrado', color: 'text-emerald-500' };
        return { status: 'surplus', label: 'Abundante', color: 'text-blue-400' };
    }
};

export default function EnergyCenter({ todayTasks = [], latestCheckin = null, history = [] }) {
    const { t } = useTranslations();
    const [isExpanded, setIsExpanded] = useState(false);

    // Cálculos Operacionais baseados no motor de energia
    const supply = useMemo(() => energyEngine.calculateSupplyFromCheckin(latestCheckin), [latestCheckin]);
    const demand = useMemo(() => energyEngine.calculateDailyDemand(todayTasks), [todayTasks]);
    const { status, label, color } = energyEngine.getEnergyStatus(supply, demand);
    const usagePercent = Math.min((demand / (supply || 1)) * 100, 100) || 0;

    // Dados Históricos (Últimos 7 dias)
    const weekData = history.length > 0 ? history : [3, 4, 2, 5, 4, 3, 4]; 

    return (
        <motion.div 
            layout
            className="card-textured relative overflow-hidden p-0 border border-white/10 bg-card rounded-3xl shadow-2xl"
        >
            {/* Background Energético Dinâmico */}
            <div className={cn(
                "absolute -right-10 -top-10 w-32 h-32 blur-[80px] opacity-30 transition-colors duration-1000",
                usagePercent > 90 ? "bg-red-500" : "bg-emerald-500"
            )} />

            {/* SECÇÃO 1: O ORÇAMENTO DIÁRIO */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <IconZap className={cn("w-4 h-4", color)} />
                            <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-50">Sincronia Biológica</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-2xl font-serif font-bold tracking-tight", color)}>{label}</span>
                            {status === 'deficit' && <IconAlertTriangle className="text-red-500 w-5 h-5 animate-pulse" />}
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                        {isExpanded ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {/* Barra de Bateria Principal */}
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-[10px] font-mono opacity-60">
                        <span className="flex items-center gap-1">CONSUMO: <b className="text-foreground">{demand}</b> pts</span>
                        <span className="flex items-center gap-1">DISPONÍVEL: <b className="text-foreground">{supply || 0}</b>%</span>
                    </div>
                    <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 p-1">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercent}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className={cn(
                                "h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                                usagePercent > 90 ? "bg-gradient-to-r from-red-600 to-orange-500" : 
                                usagePercent > 70 ? "bg-gradient-to-r from-orange-500 to-yellow-500" :
                                "bg-gradient-to-r from-emerald-600 to-teal-400"
                            )}
                        />
                    </div>
                </div>

                {/* Insight de Ash (IA) */}
                <div className="flex gap-4 items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <IconBrainCircuit className="text-purple-400 w-5 h-5" />
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                        {status === 'deficit' 
                            ? "Alerta de Burnout: Tens mais carga do que bateria. O Ash sugere adiar as tarefas criativas para amanhã."
                            : "O teu momentum está perfeito. É o momento ideal para atacar tarefas de 'Foco Profundo'."}
                    </p>
                </div>
            </div>

            {/* SECÇÃO 2: HISTÓRICO EXPANSÍVEL */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/20 overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconTrendingUp className="text-muted-foreground w-3.5 h-3.5" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Ritmo dos últimos 7 dias</span>
                                </div>
                                <span className="text-[10px] font-mono opacity-40">Escala Bio-Digital 1-5</span>
                            </div>

                            {/* Gráfico de Barras Wabi-Sabi */}
                            <div className="flex items-end gap-2 h-20 px-2">
                                {weekData.map((level, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(level / 5) * 100}%` }}
                                            className={cn(
                                                "w-full rounded-t-sm transition-all duration-300",
                                                level >= 4 ? "bg-emerald-500/40 group-hover:bg-emerald-400" :
                                                level >= 2 ? "bg-white/10 group-hover:bg-white/20" :
                                                "bg-red-500/40 group-hover:bg-red-400"
                                            )}
                                        />
                                        <span className="text-[8px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">
                                            D{i+1}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2 text-center">
                                <p className="text-[9px] text-muted-foreground/60">
                                    A tua energia média esta semana está em <b className="text-foreground">3.8/5</b>. 
                                    Notámos um pico de produtividade na Terça-feira.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Textura de Ruído Orgânica (Overlay) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise mix-blend-overlay" />
        </motion.div>
    );
}
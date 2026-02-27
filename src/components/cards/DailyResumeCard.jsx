/* src/components/cards/DailyResumeCard.jsx
   desc: Resumo do Dia - Aliança entre Processos e Estado Emocional
   feat: Mini métricas, visual limpo, compartilhável
   identity: Papel, cartografia, branco-gelo, preto, laranja-cobre
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconLink, IconX } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

/**
 * DailyResumeCard - Resumo do dia com métricas e aliança processos/emoção
 * @param {Date} date - Data do resumo
 * @param {object} metrics - { tasksCompleted, energyLevel, emotionalState, focusTime, breaks, highlights }
 * @param {function} onClose - Callback ao fechar
 * @param {function} onShare - Callback ao compartilhar
 */
export default function DailyResumeCard({
    date = new Date(),
    metrics = {
        tasksCompleted: 0,
        energyLevel: 0, // 0-100
        emotionalState: 'balanced', // balanced, energized, tired, overwhelmed
        focusTime: 0, // em minutos
        breaks: 0,
        highlights: 'Dia produtivo'
    },
    onClose,
    onShare,
}) {
    // Identidade Prana: papel, cartografia, branco-gelo, preto, laranja-cobre
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('pt-BR');

    // Emoji por estado emocional
    const emotionalIcons = {
        balanced: '⚖️',
        energized: '⚡',
        tired: '🌙',
        overwhelmed: '🌊'
    };

    const emotionalLabels = {
        balanced: 'Equilibrado',
        energized: 'Energizado',
        tired: 'Cansado',
        overwhelmed: 'Sobrecarregado'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md mx-auto"
        >
            {/* CARD - Papel com cartografia */}
            <div
                className={cn(
                    'relative bg-gradient-to-br from-stone-50 to-slate-100 dark:from-slate-900 dark:to-stone-900',
                    'border border-stone-300/40 dark:border-stone-700/40',
                    'rounded-lg overflow-hidden shadow-lg'
                )}
                style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(120, 113, 108, 0.03) 1px, transparent 1px), linear-gradient(45deg, rgba(120, 113, 108, 0.03) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            >
                {/* Textura papel */}
                <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" style={{
                    backgroundImage: `
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(0,0,0,.01) 2px,
                            rgba(0,0,0,.01) 4px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 2px,
                            rgba(0,0,0,.01) 2px,
                            rgba(0,0,0,.01) 4px
                        )
                    `
                }} />

                {/* HEADER */}
                <div className="relative px-6 py-4 border-b border-stone-300/30 dark:border-stone-700/30 bg-black/3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={cn(
                                'text-xs font-serif font-semibold uppercase tracking-widest opacity-70',
                                'text-stone-700 dark:text-stone-300'
                            )}>
                                Resumo do Dia
                            </h3>
                            <p className={cn(
                                'text-xs mt-1.5 opacity-50 font-light',
                                'text-stone-600 dark:text-stone-400'
                            )}>
                                {dayName.charAt(0).toUpperCase() + dayName.slice(1)} • {formattedDate}
                            </p>
                        </div>
                        <div className="text-3xl drop-shadow-lg">{emotionalIcons[metrics.emotionalState] || '✨'}</div>
                    </div>
                </div>

                {/* CONTEÚDO */}
                <div className="relative p-6 space-y-4">

                    {/* GRID DE MÉTRICAS */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Tarefas Completadas */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={cn(
                                'p-3 rounded border',
                                'bg-orange-500/3 border-orange-600/20 dark:border-orange-400/20'
                            )}
                        >
                            <p className={cn(
                                'text-xs opacity-60 mb-1 font-serif uppercase tracking-wider',
                                'text-stone-600 dark:text-stone-400'
                            )}>
                                Tarefas
                            </p>
                            <p className={cn(
                                'text-2xl font-bold',
                                'text-orange-700 dark:text-orange-300'
                            )}>
                                {metrics.tasksCompleted}
                            </p>
                        </motion.div>

                        {/* Energia */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className={cn(
                                'p-3 rounded border',
                                'bg-orange-500/3 border-orange-600/20 dark:border-orange-400/20'
                            )}
                        >
                            <p className={cn(
                                'text-xs opacity-60 mb-1.5 font-serif uppercase tracking-wider',
                                'text-stone-600 dark:text-stone-400'
                            )}>
                                Energia
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-stone-300/40 dark:bg-stone-600/40 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metrics.energyLevel}%` }}
                                        transition={{ delay: 0.3, duration: 1 }}
                                        className="h-full bg-orange-600 dark:bg-orange-400"
                                    />
                                </div>
                                <span className={cn(
                                    'text-xs font-semibold',
                                    'text-orange-700 dark:text-orange-300'
                                )}>
                                    {metrics.energyLevel}%
                                </span>
                            </div>
                        </motion.div>

                        {/* Tempo de Foco */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={cn(
                                'p-3 rounded border',
                                'bg-orange-500/3 border-orange-600/20 dark:border-orange-400/20'
                            )}
                        >
                            <p className={cn(
                                'text-xs opacity-60 mb-1 font-serif uppercase tracking-wider',
                                'text-stone-600 dark:text-stone-400'
                            )}>
                                Foco
                            </p>
                            <p className={cn(
                                'text-lg font-bold',
                                'text-orange-700 dark:text-orange-300'
                            )}>
                                {Math.floor(metrics.focusTime / 60)}h {metrics.focusTime % 60}m
                            </p>
                        </motion.div>

                        {/* Pausas */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className={cn(
                                'p-3 rounded border',
                                'bg-orange-500/3 border-orange-600/20 dark:border-orange-400/20'
                            )}
                        >
                            <p className={cn(
                                'text-xs opacity-60 mb-1 font-serif uppercase tracking-wider',
                                'text-stone-600 dark:text-stone-400'
                            )}>
                                Pausas
                            </p>
                            <p className={cn(
                                'text-2xl font-bold',
                                'text-orange-700 dark:text-orange-300'
                            )}>
                                {metrics.breaks}
                            </p>
                        </motion.div>
                    </div>

                    {/* ALIANÇA PROCESSOS × EMOÇÃO */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={cn(
                            'p-4 rounded border',
                            'bg-orange-500/3 border-orange-600/20 dark:border-orange-400/20'
                        )}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🤝</span>
                                <p className={cn(
                                    'text-xs font-serif font-semibold uppercase tracking-wider opacity-70',
                                    'text-stone-700 dark:text-stone-300'
                                )}>
                                    Aliança Processos × Emoção
                                </p>
                            </div>
                            <p className={cn(
                                'text-sm leading-relaxed font-light',
                                'text-stone-700 dark:text-stone-300'
                            )}>
                                {emotionalLabels[metrics.emotionalState]} — Seu estado emocional {metrics.emotionalState === 'balanced' ? 'harmonizou' : 'se conectou'} bem com suas ações hoje.
                            </p>
                        </div>
                    </motion.div>

                    {/* DESTAQUE DO DIA */}
                    {metrics.highlights && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className={cn(
                                'p-3 rounded border',
                                'bg-stone-100/60 dark:bg-stone-800/40',
                                'border-stone-300/30 dark:border-stone-600/30'
                            )}
                        >
                            <p className={cn(
                                'text-sm leading-relaxed font-light',
                                'text-stone-700 dark:text-stone-300'
                            )}>
                                ✨ {metrics.highlights}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* RODAPÉ - Botões */}
                <div className={cn(
                    'relative px-6 py-4 flex items-center justify-between gap-2',
                    'bg-black/3 border-t border-stone-300/30 dark:border-stone-700/30'
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'h-8 w-8 hover:bg-black/10',
                            'text-orange-600 dark:text-orange-400'
                        )}
                        onClick={onShare}
                        title="Compartilhar"
                    >
                        <IconLink className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'h-8 w-8 hover:bg-black/10',
                            'text-orange-600 dark:text-orange-400'
                        )}
                        onClick={onClose}
                        title="Fechar"
                    >
                        <IconX className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Instrução */}
            <div className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400 opacity-70">
                Resumo compartilhável • Aliança Processos × Emoção
            </div>
        </motion.div>
    );
}

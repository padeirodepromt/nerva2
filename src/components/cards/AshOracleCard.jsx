/* src/components/cards/AshOracleCard.jsx
   desc: Cartinha Holística do Ash - Estética de Tarot
   feat: 3 estilos visuais (Contemplativo, Expansivo, Intuitivo), compartilhável
   identity: Papel, cartografia, branco-gelo, preto, laranja-cobre
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconLink, IconX } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

/**
 * AshOracleCard - Cartinha holística criada dinamicamente pelo Ash
 * @param {string} style - 'contemplative' | 'expansive' | 'intuitive'
 * @param {string} title - Título da cartinha
 * @param {string} message - Mensagem principal (contexto do usuário)
 * @param {string} symbol - Emoji/símbolo destacado
 * @param {string} date - Data/hora
 * @param {function} onClose - Callback ao fechar
 * @param {function} onShare - Callback ao compartilhar
 */
export default function AshOracleCard({
    style = 'contemplative',
    title = 'Sua Cartinha do Dia',
    message = 'Mensagem inspiradora...',
    symbol = '✨',
    date = new Date().toLocaleDateString('pt-BR'),
    onClose,
    onShare,
}) {
    // Identidade Prana: papel, cartografia, branco-gelo, preto, laranja-cobre
    const styles = {
        contemplative: {
            // Contemplativo - branco-gelo com linhas cartográficas sutis
            bgColor: 'bg-gradient-to-br from-stone-50 to-slate-100 dark:from-slate-900 dark:to-stone-900',
            borderColor: 'border-stone-300/40 dark:border-stone-700/40',
            textColor: 'text-stone-800 dark:text-stone-200',
            accentColor: 'text-amber-900 dark:text-amber-100',
            accentBg: 'bg-amber-900/5 dark:bg-amber-100/5',
            mapPattern: 'linear-gradient(135deg, rgba(120, 113, 108, 0.03) 1px, transparent 1px), linear-gradient(45deg, rgba(120, 113, 108, 0.03) 1px, transparent 1px)',
        },
        expansive: {
            // Expansivo - laranja-cobre em acentos, papel
            bgColor: 'bg-gradient-to-br from-orange-50/50 to-stone-50 dark:from-stone-900 dark:to-stone-950',
            borderColor: 'border-stone-300/40 dark:border-stone-700/40',
            textColor: 'text-stone-800 dark:text-stone-200',
            accentColor: 'text-orange-600 dark:text-orange-400',
            accentBg: 'bg-orange-500/5 dark:bg-orange-400/5',
            mapPattern: 'radial-gradient(circle at 1px 1px, rgba(180, 83, 9, 0.05), transparent 1px)',
        },
        intuitive: {
            // Intuitivo - preto profundo e papel
            bgColor: 'bg-gradient-to-br from-slate-100 to-stone-100 dark:from-neutral-800 dark:to-stone-900',
            borderColor: 'border-stone-400/30 dark:border-stone-600/40',
            textColor: 'text-slate-900 dark:text-slate-100',
            accentColor: 'text-neutral-700 dark:text-neutral-300',
            accentBg: 'bg-neutral-900/5 dark:bg-neutral-200/5',
            mapPattern: 'repeating-linear-gradient(90deg, rgba(51, 51, 51, 0.02) 0, rgba(51, 51, 51, 0.02) 2px, transparent 2px, transparent 4px)',
        }
    };

    const currentStyle = styles[style] || styles.contemplative;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-sm mx-auto"
        >
            {/* CARD - Papel com textura cartográfica */}
            <div
                className={cn(
                    currentStyle.bgColor,
                    currentStyle.borderColor,
                    'border rounded-lg overflow-hidden shadow-lg'
                )}
                style={{
                    backgroundImage: currentStyle.mapPattern,
                    backgroundSize: '20px 20px'
                }}
            >
                {/* Textura papel sutil */}
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

                {/* CONTEÚDO */}
                <div className="relative p-8 flex flex-col items-center justify-center min-h-96 space-y-6">

                    {/* Logo Prana - Top */}
                    <div className={cn('text-base font-serif tracking-widest opacity-40 select-none', currentStyle.textColor)}>
                        ✦ PRANA ✦
                    </div>

                    {/* Divisor cartográfico */}
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-stone-400 to-transparent dark:via-stone-500 opacity-40" />

                    {/* Símbolo Destacado */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                        className="text-5xl drop-shadow-lg"
                    >
                        {symbol}
                    </motion.div>

                    {/* Título */}
                    <div className="text-center space-y-2">
                        <h2 className={cn(
                            'text-xl font-serif font-semibold tracking-tight',
                            currentStyle.textColor
                        )}>
                            {title}
                        </h2>
                    </div>

                    {/* Divisor decorativo */}
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent dark:via-stone-600 opacity-60" />

                    {/* Mensagem Principal */}
                    <div className={cn(
                        'text-center space-y-3 max-w-xs',
                        currentStyle.textColor
                    )}>
                        <p className="text-sm leading-relaxed font-light">
                            {message}
                        </p>
                    </div>

                    {/* Divisor decorativo */}
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent dark:via-stone-600 opacity-60" />

                    {/* Data/Hora */}
                    <div className={cn(
                        'text-xs tracking-wider opacity-50 font-serif',
                        currentStyle.textColor
                    )}>
                        {date}
                    </div>
                </div>

                {/* RODAPÉ - Botões */}
                <div className={cn(
                    'px-6 py-4 flex items-center justify-between gap-2',
                    'bg-black/3 border-t',
                    currentStyle.borderColor
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'h-8 w-8 hover:bg-black/10',
                            currentStyle.accentColor
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
                            currentStyle.accentColor
                        )}
                        onClick={onClose}
                        title="Fechar"
                    >
                        <IconX className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Instrução */}
            <div className="mt-4 text-center text-xs text-stone-500 dark:text-stone-400 opacity-70">
                Cartinha inspiradora • Compartilhável
            </div>
        </motion.div>
    );
}

/* src/components/dashboard/holistic/MoodStatsCard.jsx
   desc: Card com distribuição de estados de ânimo V8.8.
   feat: Sincronia total com MoodSelector (8 estados + Emojis).
   fix: Ajuste de caminhos de importação usando aliases padrão (@/) para garantir resolução.
*/

import React from 'react';
import { motion } from 'framer-motion';
import { IconSoul, IconFogo } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/components/LanguageProvider';

// Mapeamento de Cores e Emojis (Sincronizado rigorosamente com MoodSelector e Schema)
const MOOD_CONFIG = {
    calm:      { color: 'bg-emerald-500/40', emoji: '😌', key: 'diary_mood_calm' },
    joy:       { color: 'bg-yellow-400/40',  emoji: '😊', key: 'diary_mood_joy' },
    focus:     { color: 'bg-blue-500/40',    emoji: '🎯', key: 'diary_mood_focus' },
    creativity:{ color: 'bg-purple-500/40',  emoji: '✨', key: 'diary_mood_creativity' },
    anxiety:   { color: 'bg-orange-500/40',  emoji: '😰', key: 'diary_mood_anxiety' },
    confusion: { color: 'bg-amber-600/40',   emoji: '🤔', key: 'diary_mood_confusion' },
    gratitude: { color: 'bg-pink-500/40',    emoji: '🙏', key: 'diary_mood_gratitude' },
    sadness:   { color: 'bg-slate-500/40',   emoji: '😢', key: 'diary_mood_sadness' }
};

export default function MoodStatsCard({ moods = {} }) {
    const { t } = useTranslations();
    
    // Distribuição real vinda do banco ou fallback zerado para os 8 estados oficiais
    const moodDistribution = moods.distribution || {
        calm: 0, joy: 0, focus: 0, creativity: 0, 
        anxiety: 0, confusion: 0, gratitude: 0, sadness: 0
    };

    const entries = Object.entries(moodDistribution);
    const total = Object.values(moodDistribution).reduce((a, b) => a + b, 0);
    
    // Identifica o humor predominante para a mensagem de destaque
    const topMoodEntry = entries.sort(([, a], [, b]) => b - a)[0];
    const topMoodKey = topMoodEntry?.[1] > 0 ? topMoodEntry[0] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-textured p-6 rounded-3xl border border-white/10 bg-card relative overflow-hidden"
        >
            {/* Cabeçalho do Card */}
            <div className="space-y-1.5 mb-6">
                <div className="flex items-center gap-2">
                    <IconSoul className="w-4 h-4 text-purple-400" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        Campo Emocional Recente
                    </h3>
                </div>
                <div className="min-h-[40px] flex items-center">
                    <p className="text-sm font-serif text-foreground/90 leading-tight">
                        {topMoodKey ? (
                            <>
                                <span className="text-white font-bold">{MOOD_CONFIG[topMoodKey].emoji} {t(MOOD_CONFIG[topMoodKey].key)}</span>
                                <span className="opacity-70 ml-1.5">é a cor predominante do teu campo.</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground/50 italic">Utiliza o diário para mapear o teu estado emocional.</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Gráfico de Distribuição Emocional (8 Estados) */}
            <div className="space-y-3.5">
                {Object.keys(MOOD_CONFIG).map((mood) => {
                    const count = moodDistribution[mood] || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    const config = MOOD_CONFIG[mood];
                    
                    return (
                        <div key={mood} className="space-y-1 group">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-tighter">
                                <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                                    <span className="grayscale group-hover:grayscale-0 transition-all">{config.emoji}</span>
                                    <span>{t(config.key)}</span>
                                </div>
                                <span className="font-mono text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">
                                    {count}
                                </span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={cn("h-full rounded-full transition-all", config.color)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rodapé com Métricas */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-[9px] text-muted-foreground/40 uppercase tracking-widest font-medium">
                    {total} entradas de diário analisadas
                </div>
                {total > 0 && <IconFogo className="w-3 h-3 text-emerald-500/40" />}
            </div>
            
            {/* Camada de Textura Orgânica */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-noise" />
        </motion.div>
    );
}
/* src/components/diaries/MoodHeatmap.jsx
   desc: Heatmap de distribuição de moods por semana
*/
import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const MOODS = [
  { value: 'calm', emoji: '😌' },
  { value: 'joy', emoji: '😊' },
  { value: 'focus', emoji: '🎯' },
  { value: 'creativity', emoji: '✨' },
  { value: 'anxiety', emoji: '😰' },
  { value: 'confusion', emoji: '🤔' },
  { value: 'gratitude', emoji: '🙏' },
  { value: 'sadness', emoji: '😢' }
];

const getMoodColor = (percentage) => {
  if (percentage === 0) return 'bg-black/20';
  if (percentage < 25) return 'bg-blue-900/30';
  if (percentage < 50) return 'bg-blue-700/50';
  if (percentage < 75) return 'bg-purple-600/70';
  return 'bg-purple-500/90';
};

export const MoodHeatmap = ({ diaries = [] }) => {
  const { t } = useTranslations();

  const heatmapData = useMemo(() => {
    if (diaries.length === 0) return {};

    const sorted = [...diaries]
      .filter(d => d.mood)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Agrupar por semana
    const weekData = {};
    sorted.forEach(diary => {
      const date = new Date(diary.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weekData[weekKey]) {
        weekData[weekKey] = {};
        MOODS.forEach(m => {
          weekData[weekKey][m.value] = 0;
        });
      }
      weekData[weekKey][diary.mood]++;
    });

    return Object.entries(weekData)
      .map(([week, moods]) => ({
        week: new Date(week).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        moods,
        total: Object.values(moods).reduce((a, b) => a + b, 0)
      }))
      .slice(-12); // Últimas 12 semanas
  }, [diaries]);

  if (heatmapData.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-purple-500/20 bg-black/30 text-center text-purple-200/60">
        {t('no_data') || 'Sem dados suficientes'}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-purple-500/20 bg-black/30 space-y-4 overflow-x-auto"
    >
      {/* Heatmap Grid */}
      <div className="inline-block min-w-full">
        {/* Header - Week Labels */}
        <div className="flex gap-1">
          <div className="w-24" /> {/* Mood label space */}
          {heatmapData.map((week, idx) => (
            <div
              key={idx}
              className="flex-1 text-xs text-purple-200/60 text-center font-medium h-6 flex items-center justify-center"
            >
              {week.week}
            </div>
          ))}
        </div>

        {/* Mood Rows */}
        {MOODS.map((mood) => (
          <div key={mood.value} className="flex gap-1 mb-1">
            {/* Mood Label */}
            <div className="w-24 flex items-center gap-2 pr-2 font-medium">
              <span className="text-lg">{mood.emoji}</span>
              <span className="text-xs text-purple-200/70 capitalize">{mood.value}</span>
            </div>

            {/* Heatmap Cells */}
            {heatmapData.map((week, idx) => {
              const count = week.moods[mood.value] || 0;
              const percentage = week.total > 0 ? (count / week.total) * 100 : 0;

              return (
                <motion.div
                  key={`${mood.value}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`
                    flex-1 h-12 rounded border border-purple-500/20
                    ${getMoodColor(percentage)}
                    flex items-center justify-center text-center text-xs
                    hover:border-purple-500/60 transition-colors
                    group relative cursor-pointer
                  `}
                  title={count > 0 ? `${count} ocorrência${count !== 1 ? 's' : ''}` : 'Sem dados'}
                >
                  {count > 0 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white font-semibold"
                    >
                      {count}
                    </motion.span>
                  )}

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black/90 border border-purple-500/30 text-xs text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {count > 0 ? `${count} ${count === 1 ? 'dia' : 'dias'}` : 'Sem dados'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-purple-500/20 space-y-2">
        <p className="text-xs text-purple-200/60">{t('legend') || 'Legenda'}</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-black/20" />
            <span className="text-purple-200/60">0</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-blue-900/30" />
            <span className="text-purple-200/60">1-25%</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-blue-700/50" />
            <span className="text-purple-200/60">25-50%</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-purple-600/70" />
            <span className="text-purple-200/60">50-75%</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded bg-purple-500/90" />
            <span className="text-purple-200/60">75-100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

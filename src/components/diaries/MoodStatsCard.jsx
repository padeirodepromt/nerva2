/* src/components/diaries/MoodStatsCard.jsx
   desc: Card que exibe distribuição de humores com emojis
*/
import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { IconSoul } from '@/components/icons/PranaLandscapeIcons';

const MOODS = [
  { value: 'calm', key: 'diary_mood_calm', emoji: '😌', color: 'text-blue-400' },
  { value: 'joy', key: 'diary_mood_joy', emoji: '😊', color: 'text-yellow-400' },
  { value: 'focus', key: 'diary_mood_focus', emoji: '🎯', color: 'text-purple-400' },
  { value: 'creativity', key: 'diary_mood_creativity', emoji: '✨', color: 'text-pink-400' },
  { value: 'anxiety', key: 'diary_mood_anxiety', emoji: '😰', color: 'text-orange-400' },
  { value: 'confusion', key: 'diary_mood_confusion', emoji: '🤔', color: 'text-gray-400' },
  { value: 'gratitude', key: 'diary_mood_gratitude', emoji: '🙏', color: 'text-green-400' },
  { value: 'sadness', key: 'diary_mood_sadness', emoji: '😢', color: 'text-indigo-400' }
];

export const MoodStatsCard = ({ diaries = [] }) => {
  const { t } = useTranslations();

  if (diaries.length === 0) return null;

  // Contar moods
  const moodCounts = {};
  MOODS.forEach(mood => {
    moodCounts[mood.value] = diaries.filter(d => d.mood === mood.value).length;
  });

  const totalMoods = diaries.filter(d => d.mood).length;
  const maxCount = Math.max(...Object.values(moodCounts), 1);
  const topMood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-purple-500/20 bg-black/30 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
          <IconSoul className="w-5 h-5 text-yellow-300" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-100">{t('mood') || 'Estado de Ânimo'}</h3>
          <p className="text-xs text-purple-200/60">{totalMoods} registros</p>
        </div>
      </div>

      {/* Most Common Mood */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <span className="text-3xl">
          {MOODS.find(m => m.value === topMood)?.emoji}
        </span>
        <div>
          <p className="text-xs text-yellow-200/60">{t('most_common') || 'Mais frequente'}</p>
          <p className="font-semibold text-yellow-200">
            {t(MOODS.find(m => m.value === topMood)?.key)} ({moodCounts[topMood]})
          </p>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="space-y-2">
        <p className="text-xs text-purple-200/60">{t('distribution') || 'Distribuição'}</p>
        <div className="grid grid-cols-2 gap-2">
          {MOODS.map((mood) => {
            const count = moodCounts[mood.value];
            const percentage = totalMoods > 0 ? (count / totalMoods) * 100 : 0;
            
            return (
              <motion.div
                key={mood.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-2 rounded bg-black/30 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
              >
                <span className="text-lg">{mood.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-200/70">{t(mood.key)}</span>
                    <span className="text-xs text-purple-200/50">{count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insight */}
      <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-xs text-yellow-200">
          💡 {topMood === 'joy' ? '😊 Você tem tido dias alegres! Ótimo sinal de bem-estar.' :
               topMood === 'focus' ? '🎯 Foco em alta! Produtividade acima da média.' :
               topMood === 'calm' ? '😌 Tranquilidade prevalece. Mantenha essa paz.' :
               '✨ Variedade emocional observada. Isso é saudável!'}
        </p>
      </div>
    </motion.div>
  );
};

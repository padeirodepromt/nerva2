/* src/components/diaries/TagsCloudCard.jsx
   desc: Card que exibe nuvem de tags com tamanho proporcional à frequência
*/
import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { IconTag } from '@/components/icons/PranaLandscapeIcons';

export const TagsCloudCard = ({ diaries = [] }) => {
  const { t } = useTranslations();

  if (diaries.length === 0) return null;

  // Contar tags
  const tagCounts = {};
  diaries.forEach(diary => {
    if (diary.tags) {
      try {
        const tags = Array.isArray(diary.tags) ? diary.tags : JSON.parse(diary.tags || '[]');
        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    }
  });

  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15); // Top 15 tags

  const maxCount = Math.max(...sortedTags.map(([, count]) => count), 1);
  const totalTags = sortedTags.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-purple-500/20 bg-black/30 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/30">
          <IconTag className="w-5 h-5 text-pink-300" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-100">{t('tags') || 'Tags'}</h3>
          <p className="text-xs text-purple-200/60">{totalTags} tags únicas</p>
        </div>
      </div>

      {/* Tag Cloud */}
      {sortedTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tag, count], idx) => {
            const scale = 0.8 + (count / maxCount) * 0.6;
            const percentage = (count / maxCount) * 100;
            
            return (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <button
                  style={{ fontSize: `${scale * 1}rem` }}
                  className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-200 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all font-medium"
                >
                  #{tag}
                </button>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black/90 border border-pink-500/30 text-xs text-pink-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {count} ocorrência{count !== 1 ? 's' : ''}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-purple-200/60 text-center py-4">
          {t('no_tags') || 'Nenhuma tag registrada'}
        </p>
      )}

      {/* Top Tags List */}
      {sortedTags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-purple-500/20">
          <p className="text-xs text-purple-200/60">{t('most_used') || 'Mais usadas'}</p>
          <div className="space-y-1">
            {sortedTags.slice(0, 5).map(([tag, count]) => (
              <div key={tag} className="flex items-center justify-between px-2 py-1 rounded bg-black/30">
                <span className="text-sm text-purple-200">#{tag}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full bg-black/50 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                    />
                  </div>
                  <span className="text-xs text-purple-200/60 w-6">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insight */}
      <div className="p-2 rounded bg-pink-500/10 border border-pink-500/20">
        <p className="text-xs text-pink-200">
          💡 {sortedTags.length > 10 ? '🏷️ Você é muito organizado com tags!' :
               sortedTags.length > 5 ? '✓ Bom uso de tags para categorizar.' :
               '💭 Considere usar mais tags para melhor organização.'}
        </p>
      </div>
    </motion.div>
  );
};

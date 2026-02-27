/* src/components/diaries/DiaryCard.jsx
   desc: Card compacto exibindo um diário com meta dados de energia/humor
*/
import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { IconChevronRight, IconLock, IconEye } from '@/components/icons/PranaLandscapeIcons';

const ENERGY_COLORS = {
  1: 'bg-red-600/20 border-red-500/30 text-red-300',
  2: 'bg-orange-600/20 border-orange-500/30 text-orange-300',
  3: 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300',
  4: 'bg-lime-600/20 border-lime-500/30 text-lime-300',
  5: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-300'
};

const MOOD_EMOJIS = {
  calm: '😌', joy: '😊', focus: '🎯', creativity: '✨',
  anxiety: '😰', confusion: '🤔', gratitude: '🙏', sadness: '😢'
};

export const DiaryCard = ({ diary }) => {
  const { t } = useTranslations();

  const timeAgo = formatDistanceToNow(new Date(diary.createdAt), {
    addSuffix: true,
    locale: ptBR
  });

  // Extract first 100 chars of content
  const preview = diary.content
    ?.replace(/<[^>]*>/g, '') // Remove HTML
    .substring(0, 100)
    .trim() + (diary.content?.length > 100 ? '...' : '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ translateY: -2 }}
      className="group"
    >
      <Link to={`/doc/${diary.id}`}>
        <div className="relative p-4 rounded-lg border border-purple-500/20 bg-black/30 hover:bg-black/50 hover:border-purple-500/40 transition-all space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-purple-100 line-clamp-1 group-hover:text-purple-50">
                {diary.title || t('untitled') || 'Sem título'}
              </h3>
              <p className="text-xs text-purple-200/50 mt-1">{timeAgo}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {diary.isPrivate && (
                <IconLock className="w-4 h-4 text-yellow-400" title="Privado" />
              )}
              <IconChevronRight className="w-4 h-4 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Preview Text */}
          {preview && (
            <p className="text-sm text-purple-200/70 line-clamp-2">
              {preview}
            </p>
          )}

          {/* Meta Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Energy */}
            {diary.energyLevel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${ENERGY_COLORS[diary.energyLevel]}`}
              >
                <span>⚡</span>
                <span>{diary.energyLevel}/5</span>
              </motion.div>
            )}

            {/* Mood */}
            {diary.mood && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-purple-600/20 border border-purple-500/30 text-purple-300"
              >
                <span>{MOOD_EMOJIS[diary.mood]}</span>
                <span className="capitalize">{diary.mood}</span>
              </motion.div>
            )}

            {/* Tags Count */}
            {diary.tags && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-pink-500/10 border border-pink-500/30 text-pink-300"
              >
                <span>#</span>
                <span>
                  {(() => {
                    try {
                      const tags = Array.isArray(diary.tags) ? diary.tags : JSON.parse(diary.tags || '[]');
                      return tags.length;
                    } catch {
                      return 0;
                    }
                  })()}
                </span>
              </motion.div>
            )}
          </div>

          {/* Insights (if available) */}
          {diary.insights && (
            <div className="text-xs text-purple-200/60 p-2 rounded bg-purple-500/5 border border-purple-500/10 italic">
              💡 {diary.insights.substring(0, 80)}...
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-purple-500/10">
            <div className="text-xs text-purple-200/40">
              v.{diary.currentVersion || 1}
            </div>
            <div className="text-xs text-purple-200/40">
              {diary.isPrivate ? '🔒 Privado' : '🌐 Público'}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

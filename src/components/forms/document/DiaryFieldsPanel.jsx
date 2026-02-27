/* src/components/forms/document/DiaryFieldsPanel.jsx
   desc: Painel condicional que mostra campos de diário
         quando documentType === 'diary'.
         Integra: Energy, Mood, Tags, e Insights.
*/

import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { DocumentTypeSelector, EnergySelector, MoodSelector, TagsInput } from './index';

export const DiaryFieldsPanel = ({
  documentType,
  onDocumentTypeChange,
  energyLevel,
  onEnergyChange,
  mood,
  onMoodChange,
  tags,
  onTagsChange,
  insights,
  onInsightsChange,
  isPrivate,
  onPrivateChange,
}) => {
  const { t } = useTranslations();
  const isDiary = documentType === 'diary';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-4 rounded-lg border border-purple-500/20 bg-black/20"
    >
      {/* Document Type Selector - Always Visible */}
      <DocumentTypeSelector
        value={documentType}
        onChange={onDocumentTypeChange}
      />

      {/* Diary-Specific Fields - Conditional */}
      {isDiary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 pt-4 border-t border-purple-500/20"
        >
          {/* Energy Level */}
          <EnergySelector
            value={energyLevel}
            onChange={onEnergyChange}
          />

          {/* Mood */}
          <MoodSelector
            value={mood}
            onChange={onMoodChange}
          />

          {/* Tags */}
          <TagsInput
            value={tags}
            onChange={onTagsChange}
          />

          {/* Insights / Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-100">
              {t('diary_insights_label')}
            </label>
            <textarea
              value={insights || ''}
              onChange={(e) => onInsightsChange(e.target.value)}
              placeholder={t('diary_insights_placeholder')}
              rows="3"
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-purple-500/20">
            <input
              type="checkbox"
              id="is-private"
              checked={isPrivate || false}
              onChange={(e) => onPrivateChange(e.target.checked)}
              className="w-4 h-4 rounded bg-purple-600/40 border-purple-500/40 checked:bg-purple-600 checked:border-purple-500 cursor-pointer"
            />
            <label htmlFor="is-private" className="flex-1 text-sm text-purple-100 cursor-pointer">
              {t('diary_private')}
            </label>
          </div>
        </motion.div>
      )}

      {/* Type Description Hint */}
      <p className="text-xs text-purple-200/60 italic">
        {isDiary
          ? '💫 Este é um documento de diário com campos adicionais para rastrear sua jornada.'
          : '📄 Documento padrão. Selecione "Diário" para adicionar campos de energia, humor e tags.'}
      </p>
    </motion.div>
  );
};

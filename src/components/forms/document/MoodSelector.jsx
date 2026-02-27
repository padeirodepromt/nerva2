/* src/components/forms/document/MoodSelector.jsx
   desc: Seletor de estado de ânimo com 8 opções
         (Calm, Joy, Focus, Creativity, Anxiety, Confusion, Gratitude, Sadness)
         para documentos do tipo 'diary'.
*/

import { useTranslations } from '@/components/LanguageProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MOODS = [
  { value: 'calm', key: 'diary_mood_calm', emoji: '😌' },
  { value: 'joy', key: 'diary_mood_joy', emoji: '😊' },
  { value: 'focus', key: 'diary_mood_focus', emoji: '🎯' },
  { value: 'creativity', key: 'diary_mood_creativity', emoji: '✨' },
  { value: 'anxiety', key: 'diary_mood_anxiety', emoji: '😰' },
  { value: 'confusion', key: 'diary_mood_confusion', emoji: '🤔' },
  { value: 'gratitude', key: 'diary_mood_gratitude', emoji: '🙏' },
  { value: 'sadness', key: 'diary_mood_sadness', emoji: '😢' },
];

export const MoodSelector = ({ value, onChange }) => {
  const { t } = useTranslations();
  const selectedMood = MOODS.find(m => m.value === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-purple-100">
        {t('diary_mood_label')}
      </label>
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
          <SelectValue 
            placeholder={`${selectedMood?.emoji || '😐'} ${selectedMood ? t(selectedMood.key) : 'Selecione um estado'}`}
          />
        </SelectTrigger>
        <SelectContent className="bg-purple-950 border-purple-500/30">
          {MOODS.map((mood) => (
            <SelectItem key={mood.value} value={mood.value}>
              <span className="flex items-center gap-2">
                <span>{mood.emoji}</span>
                <span>{t(mood.key)}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

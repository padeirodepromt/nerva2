/* src/components/forms/document/TagsInput.jsx
   desc: Componente para adicionar e gerenciar tags em diários
         com suporte a remoção de tags individuais.
*/

import { useTranslations } from '@/components/LanguageProvider';
import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TagsInput = ({ value = [], onChange }) => {
  const { t } = useTranslations();
  const [inputValue, setInputValue] = useState('');
  const tags = Array.isArray(value) ? value : [];

  const addTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-purple-100">
        {t('diary_tags_label')}
      </label>

      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-sm text-purple-100"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="text-purple-300 hover:text-purple-100 transition-colors"
                  title={`Remover ${tag}`}
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Input Field */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('diary_tags_placeholder')}
          className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
        <button
          onClick={addTag}
          disabled={!inputValue.trim()}
          className="px-4 py-2 rounded-lg bg-purple-600/40 border border-purple-500/40 text-purple-100 hover:bg-purple-600/60 hover:border-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
        >
          +
        </button>
      </div>

      {tags.length > 0 && (
        <p className="text-xs text-purple-200">
          {tags.length} tag{tags.length !== 1 ? 's' : ''} adicionada{tags.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

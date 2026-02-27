/* src/components/forms/TagPicker.jsx
   desc: Componente para seleção de tags em modais de criação
   feat: Input busca, criar tags, sugestões, animações
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconX, IconPlus } from '@/components/icons/PranaLandscapeIcons';
import { useTranslations } from '@/components/LanguageProvider';

export default function TagPicker({ 
  selectedTags = [], 
  onChange = () => {}, 
  onCreateTag = () => {},
  suggestedTags = []
}) {
  const t = useTranslations();
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestedTags);
  const [isCreating, setIsCreating] = useState(false);

  // Filtrar sugestões baseado no input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestedTags
        .filter(tag => 
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.find(st => st.id === tag.id)
        );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestedTags.filter(
        tag => !selectedTags.find(st => st.id === tag.id)
      ));
    }
  }, [inputValue, suggestedTags, selectedTags]);

  const handleAddTag = async (tag) => {
    if (!selectedTags.find(st => st.id === tag.id)) {
      onChange([...selectedTags, tag]);
      setInputValue('');
    }
  };

  const handleCreateNewTag = async () => {
    if (!inputValue.trim()) return;

    setIsCreating(true);
    try {
      const newTag = await onCreateTag({
        name: inputValue.trim(),
        color: '#94a3b8'
      });

      if (newTag) {
        onChange([...selectedTags, newTag]);
        setInputValue('');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Se houver sugestão selecionada, usar ela
      if (filteredSuggestions.length > 0) {
        handleAddTag(filteredSuggestions[0]);
      } else {
        // Senão, criar nova tag
        handleCreateNewTag();
      }
    }
  };

  const handleRemoveTag = (tagId) => {
    onChange(selectedTags.filter(t => t.id !== tagId));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <label className="block text-xs font-bold uppercase tracking-widest opacity-60">
        Tags
      </label>

      {/* Input */}
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar ou criar tag..."
          className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-purple-400"
          disabled={isCreating}
        />

        {/* Botão criar tag (se houver input e não exista sugestão) */}
        {inputValue.trim() && filteredSuggestions.length === 0 && (
          <button
            type="button"
            onClick={handleCreateNewTag}
            disabled={isCreating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded transition-all"
          >
            <IconPlus className="w-4 h-4 text-purple-400" />
          </button>
        )}
      </div>

      {/* Tags Selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {selectedTags.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border`}
                style={{
                  backgroundColor: `${tag.color}20`,
                  borderColor: tag.color || '#94a3b8'
                }}
              >
                <span className="text-white">{tag.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Sugestões de Tags */}
      {inputValue && filteredSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 border border-white/10 rounded-lg p-2 space-y-1"
        >
          <div className="text-xs text-muted-foreground/70 px-2">
            {t('suggestions') || 'Sugestões'}
          </div>
          {filteredSuggestions.slice(0, 5).map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="w-full text-left px-3 py-2 hover:bg-white/10 rounded transition-colors text-sm text-white"
            >
              {tag.name}
              {tag.usageCount > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({tag.usageCount})
                </span>
              )}
            </button>
          ))}
        </motion.div>
      )}

      {/* Mensagem de ajuda */}
      {selectedTags.length === 0 && (
        <p className="text-xs text-muted-foreground/70 italic">
          Digite uma tag ou pressione Enter para criar uma nova
        </p>
      )}
    </div>
  );
}

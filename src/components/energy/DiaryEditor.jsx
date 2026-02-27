/* src/components/energy/DiaryEditor.jsx
   Evening Reflection: Rich text + Emotional states selection
   Connected to morning/afternoon energy check-ins
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconFeather } from '@/components/icons/PranaLandscapeIcons';

const EMOTIONAL_STATES = [
  { id: 'alegre', label: 'Alegre', emoji: '✨', color: 'from-yellow-400 to-yellow-500' },
  { id: 'confiante', label: 'Confiante', emoji: '💪', color: 'from-blue-400 to-blue-500' },
  { id: 'entusiasmado', label: 'Entusiasmado', emoji: '⚡', color: 'from-red-400 to-red-500' },
  { id: 'esperancoso', label: 'Esperançoso', emoji: '🌅', color: 'from-orange-400 to-orange-500' },
  { id: 'grato', label: 'Grato', emoji: '🙏', color: 'from-green-400 to-green-500' },
  { id: 'calmo', label: 'Calmo', emoji: '🧘', color: 'from-indigo-400 to-indigo-500' },
  { id: 'vulneravel', label: 'Vulnerável', emoji: '💙', color: 'from-cyan-400 to-cyan-500' },
  { id: 'ansioso', label: 'Ansioso', emoji: '⚠️', color: 'from-amber-400 to-amber-500' },
  { id: 'estressado', label: 'Estressado', emoji: '🔥', color: 'from-rose-400 to-rose-500' },
  { id: 'triste', label: 'Triste', emoji: '💙', color: 'from-slate-400 to-slate-500' }
];

export default function DiaryEditor({ 
  initialContent = '', 
  initialStates = [], 
  onSave,
  todayEnergy = null,
  isLoading = false 
}) {
  const [content, setContent] = useState(initialContent);
  const [selectedStates, setSelectedStates] = useState(initialStates);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const toggleState = (stateId) => {
    if (selectedStates.includes(stateId)) {
      setSelectedStates(selectedStates.filter(s => s !== stateId));
    } else if (selectedStates.length < 3) {
      setSelectedStates([...selectedStates, stateId]);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setSaveMessage('Escreva algo para salvar seu diário');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        content,
        emotionalStates: selectedStates,
        linkedMorningEnergyId: todayEnergy?.morning?.id,
        linkedAfternoonEnergyId: todayEnergy?.afternoon?.id
      });
      setSaveMessage('✅ Diário salvo com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Error saving diary:', err);
      setSaveMessage('❌ Erro ao salvar diário');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <IconFeather className="w-6 h-6 text-[rgb(var(--accent-rgb))]" />
          <h2 className="text-2xl font-bold text-white">📔 Meu Diário</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Reflita sobre seu dia. Como se sentiu com as energias de hoje?
        </p>
      </div>

      {/* Energy Context */}
      {todayEnergy && (todayEnergy.morning || todayEnergy.afternoon) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Suas energias hoje:
          </p>
          <div className="flex flex-wrap gap-3">
            {todayEnergy.morning && (
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-foreground">
                  🌅 {todayEnergy.morning.energyType}
                </span>
                <span className="text-xs text-muted-foreground">
                  {todayEnergy.morning.energyIntensity}/5
                </span>
              </div>
            )}
            {todayEnergy.afternoon && (
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <span className="text-sm font-medium text-foreground">
                  🌤️ {todayEnergy.afternoon.energyType}
                </span>
                <span className="text-xs text-muted-foreground">
                  {todayEnergy.afternoon.energyIntensity}/5
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Text Editor */}
      <div className="space-y-3">
        <label className="text-sm font-semibold uppercase tracking-wider text-foreground block">
          Sua Reflexão
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Como foi seu dia? Como se sentiu durante essas energias? O que aprendeu?"
          className="w-full h-48 bg-white/[0.02] border border-white/10 rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-[rgb(var(--accent-rgb))] focus:ring-1 focus:ring-[rgb(var(--accent-rgb))]"
        />
        <p className="text-xs text-muted-foreground">
          {content.length} caracteres
        </p>
      </div>

      {/* Emotional States Selection */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold uppercase tracking-wider text-foreground block mb-3">
            Como você se sentiu? (até 3)
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Selecionados: {selectedStates.length}/3
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {EMOTIONAL_STATES.map((state) => (
            <motion.button
              key={state.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleState(state.id)}
              disabled={
                selectedStates.length >= 3 && !selectedStates.includes(state.id)
              }
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedStates.includes(state.id)
                  ? 'border-[rgb(var(--accent-rgb))] bg-white/10'
                  : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
              } ${
                selectedStates.length >= 3 && !selectedStates.includes(state.id)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="text-2xl mb-1">{state.emoji}</div>
              <div className="text-xs font-medium text-foreground line-clamp-2">
                {state.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Save Status Message */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 rounded-lg bg-white/5 border border-white/10 text-center text-sm text-foreground"
        >
          {saveMessage}
        </motion.div>
      )}

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving || !content.trim() || isLoading}
        className="w-full px-6 py-3 rounded-lg bg-[rgb(var(--accent-rgb))] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? '💾 Salvando...' : '💾 Salvar Diário'}
      </motion.button>
    </div>
  );
}

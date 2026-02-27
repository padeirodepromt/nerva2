/* src/components/energy/EnergyCheckInModal.jsx
   Triple Check-in System: Morning + Afternoon + Diary
   - Quick energy selection with intensity 1-5
   - Optional secondary energy tracking
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ENERGY_TYPES = [
  { id: 'foco_profundo', label: 'Foco Profundo', emoji: '🎯', color: 'from-blue-500 to-cyan-500' },
  { id: 'criativo', label: 'Criativo', emoji: '🎨', color: 'from-purple-500 to-pink-500' },
  { id: 'administrativo', label: 'Administrativo', emoji: '📋', color: 'from-gray-500 to-slate-500' },
  { id: 'estrategico', label: 'Estratégico', emoji: '🏛️', color: 'from-amber-500 to-orange-500' },
  { id: 'colaborativo', label: 'Colaborativo', emoji: '👥', color: 'from-green-500 to-emerald-500' },
  { id: 'social', label: 'Social', emoji: '🌐', color: 'from-rose-500 to-pink-500' },
  { id: 'restaurador', label: 'Restaurador', emoji: '🧘', color: 'from-indigo-500 to-purple-500' },
  { id: 'introspectivo', label: 'Introspectivo', emoji: '🔮', color: 'from-teal-500 to-cyan-500' },
  { id: 'fisico', label: 'Físico', emoji: '💪', color: 'from-red-500 to-orange-500' }
];

const INTENSITY_LEVELS = [
  { value: 1, label: 'Mínima', description: 'Apenas tocando' },
  { value: 2, label: 'Baixa', description: 'Cansado' },
  { value: 3, label: 'Normal', description: 'Equilibrado' },
  { value: 4, label: 'Alta', description: 'No flow!' },
  { value: 5, label: 'Pico!', description: 'Máximo poder' }
];

export default function EnergyCheckInModal({ isOpen, onClose, timeOfDay = 'morning', onSubmit }) {
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [hasSecondary, setHasSecondary] = useState(false);
  const [secondaryEnergy, setSecondaryEnergy] = useState(null);
  const [secondaryIntensity, setSecondaryIntensity] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEnergy) {
      alert('Selecione um tipo de energia');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        timeOfDay,
        energyType: selectedEnergy,
        energyIntensity: intensity,
        secondaryType: hasSecondary ? secondaryEnergy : null,
        secondaryIntensity: hasSecondary ? secondaryIntensity : null
      });
      
      // Reset e fecha
      setSelectedEnergy(null);
      setIntensity(3);
      setHasSecondary(false);
      setSecondaryEnergy(null);
      onClose();
    } catch (err) {
      console.error('Error submitting energy check-in:', err);
      alert('Erro ao salvar energia');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const timeLabel = timeOfDay === 'morning' ? '🌅 Manhã' : '🌤️ Tarde';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10"
        >
          {/* Header */}
          <div className="space-y-2 mb-8 border-b border-white/10 pb-6">
            <h2 className="text-2xl font-bold text-white">
              ⚡ Check-in de Energia
            </h2>
            <p className="text-sm text-muted-foreground">
              {timeLabel} - Como está sua energia agora?
            </p>
          </div>

          {/* Energy Type Selection */}
          <div className="space-y-4 mb-8">
            <label className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Tipo Principal de Energia
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ENERGY_TYPES.map((energy) => (
                <motion.button
                  key={energy.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEnergy(energy.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedEnergy === energy.id
                      ? 'border-[rgb(var(--accent-rgb))] bg-white/10'
                      : 'border-white/5 hover:border-white/20 bg-white/[0.02]'
                  }`}
                >
                  <div className="text-2xl mb-2">{energy.emoji}</div>
                  <div className="text-xs font-medium text-foreground">
                    {energy.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Intensity Selector */}
          <div className="space-y-4 mb-8">
            <label className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Intensidade: {intensity}/5
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[rgb(var(--accent-rgb))]"
              />
              <div className="grid grid-cols-5 gap-2 text-center">
                {INTENSITY_LEVELS.map((level) => (
                  <div
                    key={level.value}
                    className={`p-2 rounded text-xs transition-all ${
                      intensity === level.value
                        ? 'bg-[rgb(var(--accent-rgb))] text-white'
                        : 'bg-white/5 text-muted-foreground'
                    }`}
                  >
                    <div className="font-bold">{level.label}</div>
                    <div className="text-[10px]">{level.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Energy Toggle */}
          {timeOfDay === 'morning' && (
            <div className="space-y-4 mb-8 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasSecondary"
                  checked={hasSecondary}
                  onChange={(e) => setHasSecondary(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="hasSecondary" className="text-sm font-medium text-foreground cursor-pointer">
                  Houve mudança de energia durante a manhã?
                </label>
              </div>

              {hasSecondary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 ml-7 pt-4 border-l-2 border-white/10 pl-4"
                >
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">
                      Tipo Secundário
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {ENERGY_TYPES.map((energy) => (
                        <button
                          key={energy.id}
                          onClick={() => setSecondaryEnergy(energy.id)}
                          className={`p-3 rounded-lg border text-center text-xs transition-all ${
                            secondaryEnergy === energy.id
                              ? 'border-[rgb(var(--accent-rgb))] bg-white/10'
                              : 'border-white/5 hover:border-white/20 bg-white/[0.02]'
                          }`}
                        >
                          {energy.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">
                      Intensidade Secundária: {secondaryIntensity}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={secondaryIntensity}
                      onChange={(e) => setSecondaryIntensity(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[rgb(var(--accent-rgb))]"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-foreground hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedEnergy || loading}
              className="flex-1 px-4 py-3 rounded-lg bg-[rgb(var(--accent-rgb))] text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar Check-in'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * BiomeRecommendationNotification.jsx
 * 
 * Exibe a recomendação do Ash quando bioma muda.
 * Com animação suave e auto-dismiss.
 */

import React from 'react';
import { useBiomeContext } from '@/contexts/BiomeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX } from '@/components/icons/PranaLandscapeIcons';

export const BiomeRecommendationNotification = () => {
  const { ashRecommendation, dismissRecommendation } = useBiomeContext();

  if (!ashRecommendation.message) {
    return null;
  }

  return (
    <AnimatePresence>
      {ashRecommendation.showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-50 max-w-md"
        >
          <div className="bg-gradient-to-br from-blue-600/90 to-cyan-600/90 backdrop-blur-xl border border-blue-400/30 rounded-lg shadow-2xl p-4 text-white">
            {/* Header com Ash */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-xl">🤖</div>
                <span className="font-semibold text-sm uppercase tracking-wide">
                  Ash - Recomendação
                </span>
              </div>
              <button
                onClick={dismissRecommendation}
                className="p-1 hover:bg-white/10 rounded transition-all"
                title="Fechar"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {/* Mensagem */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap opacity-95">
              {ashRecommendation.message}
            </div>

            {/* Indicador de animação */}
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/10">
              <span className="text-xs opacity-60">Bioma ativado</span>
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                    className="w-1 h-1 rounded-full bg-cyan-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BiomeRecommendationNotification;

/* src/components/cards/CardModal.jsx
   desc: Modal/Overlay para exibir cartas em fullscreen
   feat: Renderiza AshOracleCard ou DailyResumeCard em modal
*/

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AshOracleCard from './AshOracleCard';
import DailyResumeCard from './DailyResumeCard';

/**
 * CardModal - Exibe cartas em overlay fullscreen
 * @param {boolean} isOpen - Se modal está aberto
 * @param {object} card - { type: 'oracle'|'resume', ...cardProps }
 * @param {function} onClose - Callback ao fechar
 * @param {function} onShare - Callback ao compartilhar
 */
export default function CardModal({ isOpen, card, onClose, onShare }) {
    if (!card) return null;

    const handleShare = () => {
        onShare?.(card);
    };

    const handleClose = () => {
        onClose?.();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    {/* Container da Carta */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[90vh] overflow-y-auto prana-scrollbar"
                    >
                        {card.type === 'oracle' && (
                            <AshOracleCard
                                style={card.style || 'contemplative'}
                                title={card.title}
                                message={card.message}
                                symbol={card.symbol}
                                date={card.date}
                                onShare={handleShare}
                                onClose={handleClose}
                            />
                        )}

                        {card.type === 'resume' && (
                            <DailyResumeCard
                                date={card.date}
                                metrics={card.metrics}
                                onShare={handleShare}
                                onClose={handleClose}
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

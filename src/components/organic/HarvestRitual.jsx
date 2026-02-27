/**
 * HarvestRitual.jsx
 * 
 * Celebração ao completar um projeto (atingir Colheita 100%)
 * Explosão de partículas, retroalimentação positiva, e geração
 * opcional de certificado/PDF como ritual de conclusão.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Partícula individual que explode e desaparece
 */
const HarvestParticle = ({ id, delay = 0 }) => {
  // Direção aleatória em 360 graus
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 150;
  const finalX = Math.cos(angle) * distance;
  const finalY = Math.sin(angle) * distance;

  const colors = [
    '#fbbf24', // Ouro
    '#fcd34d', // Amarelo
    '#fde047', // Amarelo brilhante
    '#22c55e', // Verde
    '#10b981', // Verde escuro
    '#06b6d4', // Azul ciano
    '#a855f7', // Roxo
    '#f97316'  // Laranja
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const duration = 0.8 + Math.random() * 0.4;

  return (
    <motion.div
      key={id}
      initial={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1
      }}
      animate={{
        x: finalX,
        y: finalY,
        opacity: 0,
        scale: 0
      }}
      transition={{
        delay,
        duration,
        ease: 'easeOut'
      }}
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        backgroundColor: randomColor,
        left: '50%',
        top: '50%',
        marginLeft: '-4px',
        marginTop: '-4px'
      }}
    />
  );
};

/**
 * Explosão de frutos dourados (tipo special particle)
 */
const FruitExplosion = ({ position = 'center' }) => {
  const particleCount = 24;
  const particles = Array.from({ length: particleCount }, (_, i) => i);

  return (
    <div
      className={`fixed w-96 h-96 pointer-events-none ${
        position === 'center'
          ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          : 'bottom-10 right-10'
      }`}
      style={{ zIndex: 50 }}
    >
      {particles.map((id) => (
        <HarvestParticle
          key={id}
          id={id}
          delay={id * 0.02}
        />
      ))}
    </div>
  );
};

/**
 * Texto de feedback animado
 */
const FeedbackText = ({
  message = 'Colheita Completa!',
  subtitle = 'Projeto floresceu com sucesso',
  icon = '🌟'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-center space-y-3"
    >
      <div className="text-6xl mb-4 animate-bounce">{icon}</div>
      <h2 className="text-3xl font-bold text-yellow-600">{message}</h2>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </motion.div>
  );
};

/**
 * Painel de informações de conclusão
 */
const CompletionInfo = ({
  projectName = 'Projeto',
  duration = '2 weeks',
  tasksCompleted = 42,
  pranaCredits = 150,
  biome = 'floresta'
}) => {
  const biomeEmojis = {
    nascente: '💧',
    floresta: '🌲',
    sertao: '🌵',
    ventos: '🪁',
    cosmos: '🌌'
  };

  const biomeColors = {
    nascente: 'from-blue-400 to-cyan-300',
    floresta: 'from-green-400 to-emerald-300',
    sertao: 'from-red-400 to-orange-300',
    ventos: 'from-blue-400 to-sky-300',
    cosmos: 'from-purple-400 to-pink-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={`bg-gradient-to-r ${biomeColors[biome]} p-8 rounded-2xl shadow-2xl max-w-md mx-auto`}
    >
      <div className="bg-white rounded-xl p-6 space-y-4">
        {/* Cabeçalho */}
        <div className="text-center border-b-2 border-gray-200 pb-4">
          <div className="text-5xl mb-2">{biomeEmojis[biome]}</div>
          <h3 className="text-xl font-bold text-gray-800">{projectName}</h3>
        </div>

        {/* Estatísticas */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">⏱️ Duração</span>
            <span className="text-lg font-bold text-gray-800">{duration}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">✅ Tarefas</span>
            <span className="text-lg font-bold text-green-600">{tasksCompleted}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">💎 Prana Credits</span>
            <span className="text-lg font-bold text-yellow-500">{pranaCredits}</span>
          </div>

          {/* Barra de progresso festiva */}
          <div className="pt-2">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-3 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-full"
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </div>

        {/* Mensagem motivacional */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <p className="text-sm text-yellow-800 italic">
            "Cada colheita é um novo começo. Continue cultivando! 🌱"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Botões de ação pós-conclusão
 */
const ActionButtons = ({
  onCertificate = () => {},
  onShare = () => {},
  onContinue = () => {},
  showCertificate = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      className="flex gap-4 justify-center mt-8 flex-wrap"
    >
      {showCertificate && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCertificate}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
        >
          📜 Gerar Certificado
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onShare}
        className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
      >
        📤 Compartilhar
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all"
      >
        🌱 Novo Projeto
      </motion.button>
    </motion.div>
  );
};

/**
 * Componente principal: Ritual de Colheita
 */
export const HarvestRitual = ({
  isVisible = false,
  projectName = 'Projeto',
  duration = '2 weeks',
  tasksCompleted = 42,
  pranaCredits = 150,
  biome = 'floresta',
  onCertificate = () => {},
  onShare = () => {},
  onContinue = () => {},
  onClose = () => {},
  autoClose = true,
  autoCloseDelay = 8000
}) => {
  const [showFruit, setShowFruit] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Sequência de animações
      const timers = [
        setTimeout(() => setShowFruit(true), 100),
        setTimeout(() => setShowInfo(true), 400),
        autoClose && setTimeout(onClose, autoCloseDelay)
      ];

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          {/* Explosão de partículas */}
          {showFruit && (
            <>
              <FruitExplosion position="center" />
              <FruitExplosion position="corner" />
            </>
          )}

          {/* Conteúdo principal */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative z-10 w-full max-w-2xl px-4"
          >
            {/* Feedback textual */}
            <FeedbackText
              message="Colheita Completa! 🎉"
              subtitle={`Seu ${projectName} floresceu com sucesso`}
              icon="🌟"
            />

            {/* Informações de conclusão */}
            {showInfo && (
              <>
                <div className="mt-8">
                  <CompletionInfo
                    projectName={projectName}
                    duration={duration}
                    tasksCompleted={tasksCompleted}
                    pranaCredits={pranaCredits}
                    biome={biome}
                  />
                </div>

                {/* Botões de ação */}
                <ActionButtons
                  onCertificate={onCertificate}
                  onShare={onShare}
                  onContinue={onContinue}
                  showCertificate={true}
                />
              </>
            )}

            {/* Dica de fechar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2 }}
              className="text-center mt-6 text-sm text-gray-500"
            >
              Clique para fechar ou aguarde {autoCloseDelay / 1000}s
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Hook para gerenciar estado do ritual
 */
export const useHarvestRitual = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const celebrate = (projectData) => {
    setIsOpen(true);
    return () => setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    celebrate,
    close: () => setIsOpen(false)
  };
};

export default HarvestRitual;

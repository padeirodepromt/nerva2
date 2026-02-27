import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import { checkForTestInjection } from '@/ai_services/chatServiceTestInjector';

/**
 * MobileChat - Versão mobile-otimizada do chat
 * Full-screen com header + input fixo na base
 * Scrollável no meio, messages sempre no viewport
 */
export default function MobileChat({ onSwipeMenu }) {
  const { messages, sendMessage, isLoading, addMessage } = useChatStore();
  const { user } = useAuth();
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handler para test injection (se palavra-chave detectada)
  const handleSendMessage = async (message) => {
    // Verificar se é um teste
    const { shouldInject, testMessage } = checkForTestInjection(message);
    
    if (shouldInject && testMessage) {
      // Enviar mensagem do usuário
      await sendMessage(message);
      // Injetar teste após um delay
      setTimeout(() => {
        addMessage(testMessage);
      }, 500);
      return;
    }

    // Fluxo normal
    await sendMessage(message);
  };

  // Listener para quando ToolCallBubble executa
  useEffect(() => {
    const handleToolCallExecuted = (event) => {
      const { toolCallId, result } = event.detail || {};
      console.log('✅ Tool call executado:', { toolCallId, result });
      
      // Opcional: adicionar mensagem de confirmação ao chat
      if (result?.success) {
        addMessage({
          role: 'system',
          content: `✅ Ação executada com sucesso!`,
          type: 'system',
          created_date: new Date().toISOString()
        });
      }
    };

    window.addEventListener('prana:tool-call-executed', handleToolCallExecuted);
    return () => window.removeEventListener('prana:tool-call-executed', handleToolCallExecuted);
  }, [addMessage]);

  // Swipe para abrir menu (mobile UX)
  useEffect(() => {
    let touchStartX = null;
    let touchEndX = null;
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX !== null && touchEndX !== null && touchEndX - touchStartX > 80) {
        onSwipeMenu?.();
      }
      touchStartX = null;
      touchEndX = null;
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeMenu]);

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full',
        'relative',
        'select-none',
        // Temas: light/dark
        'bg-background',
        // Textura: paper ou cartography
        'bg-paper-texture dark:bg-cartography-texture',
        // Gradiente opcional para profundidade
        'bg-gradient-to-b from-background/90 to-background/80'
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      data-theme="prana"
    >
      {/* Marca d'água do logo do Prana */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0 opacity-10"
        style={{ userSelect: 'none' }}
      >
        <div className="w-48 h-48 sm:w-64 sm:h-64">
          {/* Substitua pelo componente do logo se necessário */}
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" className="text-[rgb(var(--accent-rgb))]" />
            <text x="50%" y="54%" textAnchor="middle" fontSize="32" fill="currentColor" className="text-[rgb(var(--accent-rgb))]" fontFamily="sans-serif">Prana</text>
          </svg>
        </div>
      </div>

      {/* Área de mensagens - Scrollável */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto',
          'px-3 py-4 space-y-3',
          'scroll-smooth',
          'overscroll-y-contain',
          '[&::-webkit-scrollbar]:w-1',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-white/10',
          '[&::-webkit-scrollbar-thumb]:rounded',
          'relative z-10'
        )}
        tabIndex={0}
        aria-label="Mensagens do chat"
      >
        {/* Empty State */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex flex-col items-center justify-center',
              'h-[60vh] text-center'
            )}
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <span className="text-xl">✨</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">Bem-vindo ao Ash</h2>
            <p className="text-xs text-muted-foreground max-w-xs">
              Descreva suas tarefas, projetos e objetivos. Ash ajudará você a organizar tudo.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            isUser={message.role === 'user'}
            isMobile
            style={{ minHeight: 48, padding: '12px 16px', fontSize: 16 }}
          />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 p-3 bg-white/5 rounded-lg max-w-xs"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                  className="w-1.5 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input - Fixo na base */}
      <div className={cn(
        'border-t border-white/10',
        'bg-gradient-to-t from-background to-transparent',
        'p-3',
        'backdrop-blur-sm',
        'fixed bottom-0 left-0 right-0 z-50',
      )}
        aria-label="Campo de mensagem"
      >
        <ChatInput
          onSendMessage={async (msg) => {
            try {
              await handleSendMessage(msg);
            } catch (e) {
              toast.error('Erro ao enviar mensagem. Tente novamente.');
            }
          }}
          isLoading={isLoading}
          isMobile
          placeholder="Descreva uma tarefa..."
          style={{ fontSize: 18, minHeight: 48 }}
        />
      </div>
    </div>
  );
}

/**
 * src/components/olly/OllyChatPanel.jsx
 * 
 * Painel de chat com Olly para análise e otimização de campanhas
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOlly } from '@/contexts/OllyContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Loader, 
  AlertCircle,
  MessageCircle,
  Upload,
  Zap
} from '@/components/icons/PranaLandscapeIcons';

export const OllyChatPanel = ({ campaignId = null }) => {
  const { 
    startSession, 
    chat, 
    analyzeFile, 
    getOptimizations,
    isLoading, 
    error, 
    messages, 
    currentSession 
  } = useOlly();

  const [messageInput, setMessageInput] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [optimizations, setOptimizations] = useState([]);
  const messagesEndRef = useRef(null);

  // Inicializar sessão ao montar
  useEffect(() => {
    const initSession = async () => {
      try {
        await startSession({
          campaignId,
          type: 'analysis'
        });
        setIsSessionActive(true);
      } catch (err) {
        console.error('Erro ao iniciar sessão:', err);
      }
    };

    if (!isSessionActive) {
      initSession();
    }
  }, [startSession, isSessionActive, campaignId]);

  // Scroll automático para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Carregar otimizações se houver campanha
  useEffect(() => {
    const loadOptimizations = async () => {
      if (campaignId) {
        try {
          const opts = await getOptimizations(campaignId);
          setOptimizations(opts);
        } catch (err) {
          console.error('Erro ao carregar otimizações:', err);
        }
      }
    };

    loadOptimizations();
  }, [campaignId, getOptimizations]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !isSessionActive) return;

    const message = messageInput;
    setMessageInput('');

    try {
      await chat(message);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const platform = file.name.includes('meta') ? 'meta_ads' : 'google_ads';
      const analysis = await analyzeFile(file, platform);
      
      // Adicionar resultado como mensagem do sistema
      await chat(`Analisei o arquivo ${file.name}. Os resultados mostram: ${JSON.stringify(analysis)}`);
    } catch (err) {
      console.error('Erro ao analisar arquivo:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[600px] bg-white/5 rounded-xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold text-white">Olly - Assistente de Campanhas</h3>
            <p className="text-xs text-white/70">
              {isSessionActive ? '🟢 Sessão ativa' : '⚪ Iniciando...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/90'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 items-center text-white/70"
            >
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Olly está pensando...</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center text-red-400 bg-red-500/10 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Otimizações sugeridas */}
      {optimizations.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/5">
          <div className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Otimizações Sugeridas ({optimizations.length})
          </div>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {optimizations.slice(0, 3).map((opt) => (
              <div key={opt.id} className="text-xs text-white/60 bg-white/5 p-2 rounded">
                {opt.suggestions?.title || 'Otimização sem título'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-white/10 bg-white/5 p-4 space-y-3">
        {/* File Upload */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70 hover:text-white/100 transition">
          <Upload className="w-4 h-4" />
          <span>Enviar arquivo de campanha</span>
          <input
            type="file"
            accept=".csv,.json,.xlsx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={!isSessionActive || isLoading}
          />
        </label>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Pergunte algo a Olly..."
            className="flex-1 text-sm"
            disabled={!isSessionActive || isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!isSessionActive || isLoading || !messageInput.trim()}
            className="gap-2"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default OllyChatPanel;

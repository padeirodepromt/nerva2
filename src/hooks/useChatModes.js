/**
 * src/hooks/useChatModes.js
 * Hook para gerenciar modos do chat
 */

import { useState, useCallback } from 'react';

const CHAT_MODES = {
  chat: {
    id: 'chat',
    label: 'Chat',
    icon: '💬',
    description: 'Conversa livre com Ash',
    color: 'blue'
  },
  plan: {
    id: 'plan',
    label: 'Planejar',
    icon: '🎯',
    description: 'Organizar tarefas e tempo',
    color: 'yellow'
  },
  create: {
    id: 'create',
    label: 'Criar',
    icon: '✨',
    description: 'Brainstorm e estruturação',
    color: 'purple'
  },
  reflect: {
    id: 'reflect',
    label: 'Reflexão',
    icon: '📖',
    description: 'Análise e insights',
    color: 'pink'
  },
  ask: {
    id: 'ask',
    label: 'Perguntar',
    icon: '❓',
    description: 'Perguntas rápidas',
    color: 'green'
  }
};

export function useChatModes(initialMode = 'chat') {
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const mode = CHAT_MODES[currentMode];

  const addFile = useCallback((file) => {
    setAttachedFiles(prev => [...prev, file]);
  }, []);

  const removeFile = useCallback((fileName) => {
    setAttachedFiles(prev => prev.filter(f => f.name !== fileName));
  }, []);

  const clearFiles = useCallback(() => {
    setAttachedFiles([]);
  }, []);

  // Diferentes prompts por modo
  const getSystemPrompt = useCallback(() => {
    const basePrompt = `Você é Ash, o assistente neural do Prana. 
Sistema operacional pessoal focado em produtividade, bem-estar e crescimento.
Responda em português brasileiro de forma empática, criativa e insightful.`;

    const modePrompts = {
      chat: `${basePrompt}\nModo: Conversa livre. Responda conversacionalmente, oferecendo ajuda quando apropriado.`,
      
      plan: `${basePrompt}\nModo: PLANEJAMENTO. 
      Você é um planejador estratégico. Quando o usuário pede ajuda com planejamento:
      1. Analise tarefas atuais, energia disponível e tempo
      2. Sugira reorganização e priorização
      3. Crie um plano estruturado com timeline
      4. Retorne sugestões de tarefas para criar
      Sempre estruture seu response em seções claras.`,
      
      create: `${basePrompt}\nModo: CRIAÇÃO. 
      Você é um criativo e estrategista. Quando o usuário quer brainstormar ou criar:
      1. Gere ideias inovadoras e estruturadas
      2. Crie outlines e hierarquias
      3. Sugira mind map nodes e conexões
      4. Ofereça diferentes perspectivas
      Sempre estruture suas ideias de forma clara e escalável.`,
      
      reflect: `${basePrompt}\nModo: REFLEXÃO. 
      Você é um coach holístico. Quando o usuário pede análise:
      1. Analise padrões de mood, energia, produtividade
      2. Identifique correlações e insights
      3. Celebre progressos
      4. Sugira ações baseado nos dados
      Seja compassivo, validador e construtor de confiança.`,
      
      ask: `${basePrompt}\nModo: PERGUNTAS. 
      Responda diretamente e de forma concisa.
      Se a pergunta está relacionada ao contexto do usuário, use seus dados (tarefas, projetos, etc).
      Seja útil, prático e direto.`
    };

    return modePrompts[currentMode] || basePrompt;
  }, [currentMode]);

  return {
    currentMode,
    mode,
    modes: CHAT_MODES,
    setCurrentMode,
    attachedFiles,
    addFile,
    removeFile,
    clearFiles,
    getSystemPrompt,
    hasFiles: attachedFiles.length > 0
  };
}

export const MODES = CHAT_MODES;

/**
 * src/hooks/usePranaChat.jsx
 * (V12 - Guardian Aware, NexusId Stateful + ActivePacks Integration)
 *
 * Mantém:
 * - Integração com useChatStore
 * - Detecção de contexto via rota (useLocation/useParams)
 * - Rota /nexus/chat
 *
 * Adiciona:
 * - Injeção de activePacks no contexto para o Orquestrador V12
 * - Tratamento de client_action.CHANGE_VIEW via useNavigate
 */

import { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { generateId } from '../utils/id';
import { useChatStore } from '@/stores/useChatStore';
import { useAuth } from '@/hooks/useAuth';

export const usePranaChat = (initialNexusId = null) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ===== 1) STORE =====
  const messages = useChatStore((state) => state.messages);
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);

  const {
    addMessage,
    setLoading,
    setError: setStoreError,
    clearMessages: clearStoreMessages
  } = useChatStore();

  // ===== 2) NEXUS ID (STATEFUL) =====
  // SideChat espera receber isso no return
  const [nexusId, setNexusId] = useState(initialNexusId || 'new');

  // Se o caller passar initialNexusId depois, sincroniza (sem derrubar o fluxo)
  useEffect(() => {
    if (initialNexusId && initialNexusId !== nexusId) {
      setNexusId(initialNexusId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNexusId]);

  // ===== 3) CONTEXTO (OS “OLHOS”) =====
  const [activeContext, setActiveContext] = useState(null);
  const location = useLocation();
  const params = useParams();

  const determineContext = useCallback(() => {
    const path = location.pathname;

    // Contexto: Projeto
    if (path.includes('/projects/') || params.projectId) {
      return {
        currentView: 'project',
        activeEntityId: params.projectId || path.split('/projects/')[1]?.split('/')[0],
        label: 'Projeto Ativo',
        icon: 'folder',
        mode: 'work'
      };
    }

    // Contexto: Editor/Documento
    if (path.includes('/docs/') || path.includes('/editor/')) {
      return {
        currentView: 'editor',
        activeEntityId: params.docId,
        label: 'Editando Documento',
        icon: 'file-text',
        mode: 'create'
      };
    }

    // Contexto: Planejamento
    if (path.includes('/planner')) {
      return {
        currentView: 'planner',
        label: 'Planejamento',
        icon: 'calendar',
        mode: 'plan'
      };
    }

    // Contexto: Geral
    return {
      currentView: 'dashboard',
      label: 'Visão Geral',
      icon: 'layout-grid',
      mode: 'chat'
    };
  }, [location, params]);

  useEffect(() => {
    setActiveContext(determineContext());
  }, [determineContext]);

  // ===== 4) HISTÓRICO =====
  // Mantém compatibilidade: loadHistory() usa o nexusId atual
  const loadHistory = useCallback(async (explicitNexusId = null) => {
    const target = explicitNexusId || nexusId;
    if (!target || target === 'new') return;

    setLoading(true);
    setStoreError(null);

    try {
      const nexusData = await apiClient.get(`/nexus/${target}`);

      const rawMessages = nexusData.data?.messages || nexusData.data || [];
      // Se quiser popular o store apenas quando estiver vazio:
      if (Array.isArray(rawMessages) && rawMessages.length > 0 && messages.length === 0) {
        rawMessages.forEach((msg) =>
          addMessage({
            id: msg.id || generateId('msg'),
            role: msg.role,
            content: msg.content,
            tool_calls: msg.toolResponse ? [msg.toolResponse] : [],
            created_date: msg.created_date || msg.timestamp || new Date().toISOString()
          })
        );
      }
    } catch (err) {
      console.error('[usePranaChat] Erro histórico:', err);
      // não bloqueia o uso
    } finally {
      setLoading(false);
    }
  }, [nexusId, messages.length, addMessage, setLoading, setStoreError]);

  // ===== 5) SEND MESSAGE (agora com extraContext e V12) =====
  const sendMessage = useCallback(async (userMessage, attachments = [], extraContext = {}) => {
    const hasText = typeof userMessage === 'string' && userMessage.trim().length > 0;
    const hasFiles = Array.isArray(attachments) && attachments.length > 0;
    if (!hasText && !hasFiles) return;

    try {
      setLoading(true);
      setStoreError(null);

      // A) feedback otimista
      const userMsgObject = {
        id: generateId('msg'),
        role: 'user',
        content: userMessage,
        created_date: new Date().toISOString(),
        files: hasFiles
          ? attachments.map((f) => ({
              name: f.name,
              type: f.type,
              size: f.size,
              preview: f.preview
            }))
          : []
      };
      addMessage(userMsgObject);

      // 👉 [V12] Garantir que os Packs viajam para a IA autorizar ferramentas e motores
      const activePacksArray = user?.activePacks 
          ? (user.activePacks instanceof Set ? Array.from(user.activePacks) : user.activePacks) 
          : [];

      // B) payload com contexto (default + extraContext)
      const payload = {
        nexusId: nexusId || 'new',
        message: userMessage,
        userId: user?.id,
        context: {
          ...activeContext,
          files: attachments,
          activePacks: activePacksArray, // Crucial para V12
          ...extraContext
        }
      };

      const response = await apiClient.post('/nexus/chat', payload);

      // C) resposta
      const data = response.data || {};

      // 👉 [V12] AÇÃO DE CLIENTE (Ex: Tutorial do Ash pede para mudar de ecrã)
      if (data.client_action.type === 'START_INTERACTIVE_TOUR') {
    window.dispatchEvent(new CustomEvent('prana:start-tour', { detail: data.client_action }));
}

      const assistantText = data.data || data.response || data.message || '...';

      const aiMsgObject = {
        id: generateId('msg'),
        role: 'assistant',
        content: assistantText,
        tool_calls: data.toolResponse ? [data.toolResponse] : [],
        created_date: new Date().toISOString(),
        toolResponse: data.toolResponse,
        collaborationSuggestion: data.collaborationSuggestion
      };

      addMessage(aiMsgObject);

      // D) se backend retornou novo nexusId
      const newId =
        data.newNexusId ||
        data.nexusId ||
        data?.data?.nexusId; // fallback se alguém encapsulou

      if (newId && newId !== 'new' && newId !== nexusId) {
        setNexusId(newId);
      }

      return data;
    } catch (err) {
      console.error('[usePranaChat] Erro no envio:', err);
      const msg = err?.response?.data?.error || err?.message || 'Erro de conexão.';
      setStoreError(msg);

      const errorMsgObject = {
        id: generateId('msg'),
        role: 'assistant',
        content: `⚠️ *Falha na conexão neural:* ${msg}`,
        isError: true,
        created_date: new Date().toISOString()
      };
      addMessage(errorMsgObject);

      throw err;
    } finally {
      setLoading(false);
    }
  }, [nexusId, user, activeContext, addMessage, setLoading, setStoreError, navigate]);

  // ===== 6) CLEAR =====
  const clearMessages = useCallback(() => {
    clearStoreMessages();
    setNexusId('new');
  }, [clearStoreMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,     // (msg, attachments, extraContext)
    loadHistory,     // (optional explicit nexusId)
    activeContext,
    clearMessages,
    nexusId,         // ✅ SideChat precisa disso
    setNexusId       // opcional: útil se você quiser controlar fora
  };
};
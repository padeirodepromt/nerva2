/* src/hooks/useAgentEvents.js */
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient'; // Usa sua config base se necessário

export const useAgentEvents = () => {
  const [stream, setStream] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    // IMPORTANTE: Ajuste a rota base de acordo com o seu backend
    const eventSource = new EventSource('/api/agents/events', { 
      withCredentials: true 
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.event) {
        case 'pipeline_status':
          setStatus(data.payload.status);
          // Se finalizou, esperamos 5s e limpamos os pensamentos
          if (data.payload.status === 'idle') {
            setTimeout(() => setStream([]), 5000); 
          }
          break;
        case 'thought_stream':
          setStream((prev) => [...prev, data.payload]);
          break;
        case 'pipeline_error':
          setStatus('idle');
          setStream((prev) => [...prev, { type: 'critique', content: `ERRO: ${data.payload}` }]);
          break;
        default:
          break;
      }
    };

    eventSource.onerror = (err) => {
      console.log("[SSE] Reconectando Neural Link...");
      // EventSource tenta reconectar sozinho, mas você pode tratar erro fatal aqui
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const clearStream = useCallback(() => {
    setStream([]);
  }, []);

  return { stream, status, clearStream };
};
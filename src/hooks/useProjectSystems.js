/* src/hooks/useProjectSystems.js
   desc: Hook para verificar quais sistemas estão ativados no projeto.
*/

import { useState, useCallback } from 'react';

/**
 * Hook que fornece os sistemas ativos para um projeto específico.
 * @param {string} projectId - ID do projeto
 * @returns {Object} Object com systems array e isLoading state
 */
export function useProjectSystems(projectId) {
  // Mock: Por enquanto, consideramos todos os sistemas como ativos
  const [systems] = useState([
    { id: 'ash', name: 'Ash', enabled: true },
    { id: 'neo', name: 'Neo', enabled: true },
    { id: 'flor', name: 'Flor', enabled: true },
    { id: 'olly', name: 'Olly', enabled: true },
  ]);

  const isLoading = false;
  const error = null;

  const getSystemByKey = useCallback((key) => {
    return systems.find(sys => sys.id === key);
  }, [systems]);

  const isSystemEnabled = useCallback((key) => {
    const system = getSystemByKey(key);
    return system?.enabled ?? false;
  }, [getSystemByKey]);

  return {
    systems,
    isLoading,
    error,
    getSystemByKey,
    isSystemEnabled,
  };
}

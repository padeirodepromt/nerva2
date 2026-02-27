/**
 * biomeIntegrator.js
 * 
 * Integra o fluxo de check-in de energia com o sistema de biomas.
 * Dispara eventos globais que o useBiomeMonitor escuta.
 */

/**
 * Dispara atualização de bioma baseada em novo check-in de energia
 * 
 * @param {Object} energyState - Estado de energia { physical, mental, emotional, spiritual, tags, notes }
 */
export const triggerBiomeUpdate = (energyState) => {
  if (!energyState) return;

  // Dispara evento global que o monitor escuta
  window.dispatchEvent(
    new CustomEvent('prana:energy-update', {
      detail: { energyState },
    })
  );

  console.log('[Biome Integrator] Bioma update triggered:', energyState);
};

/**
 * Notifica quando uma tarefa é completada (pode afetar mood)
 */
export const notifyTaskCompletion = (taskData) => {
  window.dispatchEvent(
    new CustomEvent('prana:task-completed', {
      detail: { ...taskData, completed: true },
    })
  );
};

/**
 * Notifica quando uma tarefa é iniciada
 */
export const notifyTaskStart = (taskData) => {
  window.dispatchEvent(
    new CustomEvent('prana:task-started', {
      detail: { ...taskData, started: true },
    })
  );
};

/**
 * Força uma atualização de bioma inicial baseada em estado atual
 * Útil para sincronizar quando usuário volta ao app
 */
export const syncBiomeState = async () => {
  try {
    // Aqui você poderia buscar o último estado de energia do usuário
    // Por enquanto, usamos um padrão inicial
    const lastEnergyState = {
      physical: 6,
      mental: 7,
      emotional: 5,
      spiritual: 6,
      tags: ['reconnecting'],
      notes: 'Sincronizando estado...',
    };

    triggerBiomeUpdate(lastEnergyState);
  } catch (error) {
    console.error('[Biome Integrator] Erro ao sincronizar bioma:', error);
  }
};

export default {
  triggerBiomeUpdate,
  notifyTaskCompletion,
  notifyTaskStart,
  syncBiomeState,
};

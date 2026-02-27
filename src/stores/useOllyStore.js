import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @file src/stores/useOllyStore.js
 * @description Store para controlar se Olly está habilitado no sistema
 * Permite ativar/desativar Olly de forma global
 */
export const useOllyStore = create(
  persist(
    (set, get) => ({
      // Estado do Olly (desabilitado por padrão até o backend estar pronto)
      isOllyEnabled: false,

      // Ativar Olly
      enableOlly: () => set({ isOllyEnabled: true }),

      // Desativar Olly
      disableOlly: () => set({ isOllyEnabled: false }),

      // Toggle Olly on/off
      toggleOlly: () => set((state) => ({ isOllyEnabled: !state.isOllyEnabled })),
    }),
    {
      name: 'olly-store', // Persistir no localStorage
    }
  )
);

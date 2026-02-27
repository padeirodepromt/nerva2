import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AGENTS } from '@/config/agentPersonas';

export const useAgentStore = create(
  persist(
    (set, get) => ({
      activeAgentId: 'ash',
      setActiveAgent: (agentId) => { if (AGENTS[agentId.toUpperCase()]) set({ activeAgentId: agentId }); },
      getActiveAgent: () => { const { activeAgentId } = get(); return AGENTS[activeAgentId.toUpperCase()] || AGENTS.ASH; }
    }),
    { name: 'prana-agent-storage' }
  )
);
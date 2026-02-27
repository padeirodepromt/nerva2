/* src/stores/useWorkspaceStore.js
   desc: Gerenciador de Estado Global V10 (Neural OS).
   feat: Integração de DNA de Planos e Consciência de Realms.
*/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { canUserAccess } from '@/config/plansConfig'; // Conexão estabelecida

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      // --- GEOMETRIA DO ESPAÇO ---
      layout: {
        sidebar: { open: true }, 
        explorer: { open: true }, 
        rightPanel: { open: true, size: 30 }, 
        sideChatPosition: 'right', 
      },

      // --- [V10] ESTADOS DE CONSCIÊNCIA (Realms) ---
      activeRealmId: 'all', 
      isUnifiedView: true,  
      userPlan: 'BETA',     // Sincronizado com PLANS.BETA

      // --- [V10] LÓGICA DE DNA (Planos) ---
      // Função central que os componentes usam para checar permissão sem importar o config
      canUseRealms: () => {
        return canUserAccess(get().userPlan, 'context_separation');
      },

      // --- ESTADOS EPHEMEROS ---
      isSmartModalOpen: false,
      smartModalContext: null,
      activeSidePanel: 'files', 
      isPranaFormOpen: false,
      pranaFormConfig: {
        itemType: null,
        defaultValues: {},
      },
      isRoutineManagerOpen: false,

      // --- GRUPOS DE ABAS ---
      tabGroups: {
        main: { tabs: [], activeId: null },
        right: {
          tabs: [
            { id: 'ash-chat-main', type: 'ASH_CHAT', title: 'Ash', data: {} }
          ],
          activeId: 'ash-chat-main'
        }
      },

      // --- [V10] AÇÕES DE REALMS ---
      setActiveRealm: (realmId) => {
        // Validação dinâmica via Config
        if (realmId !== 'all' && !get().canUseRealms()) {
          console.warn("Bloqueio de Plano: context_separation não permitido.");
          return;
        }
        set({ activeRealmId: realmId });
      },

      toggleUnifiedView: () => set(state => ({ isUnifiedView: !state.isUnifiedView })),

      // --- AÇÕES DE LAYOUT ---
      toggleSidebar: () => set(state => ({
        layout: { ...state.layout, sidebar: { ...state.layout.sidebar, open: !state.layout.sidebar.open } }
      })),
      
      toggleExplorer: () => set(state => ({
        layout: { ...state.layout, explorer: { ...state.layout.explorer, open: !state.layout.explorer.open } }
      })),
      
      toggleRightPanel: () => set(state => ({
        layout: { ...state.layout, rightPanel: { ...state.layout.rightPanel, open: !state.layout.rightPanel.open } }
      })),

      toggleSideChatPosition: () => set(state => ({
        layout: { ...state.layout, sideChatPosition: state.layout.sideChatPosition === 'right' ? 'left' : 'right' }
      })),

      setActiveSidePanel: (panelId) => set(() => ({ activeSidePanel: panelId })),

      // --- AÇÕES: MODAL DE CRIAÇÃO RÁPIDA ---
      openSmartModal: (context = null) => set(() => ({ isSmartModalOpen: true, smartModalContext: context })),
      closeSmartModal: () => set(() => ({ isSmartModalOpen: false, smartModalContext: null })),

      // --- AÇÕES: MODAL PRANA FORM ---
      openPranaForm: (config = {}) => set(() => ({ 
        isPranaFormOpen: true, 
        pranaFormConfig: {
          itemType: config.itemType || 'task',
          defaultValues: config.defaultValues || {}
        }
      })),
      closePranaForm: () => set(() => ({ 
        isPranaFormOpen: false, 
        pranaFormConfig: { itemType: null, defaultValues: {} }
      })),

      // --- AÇÕES: ROUTINE MANAGER MODAL ---
      openRoutineManager: () => set(() => ({ isRoutineManagerOpen: true })),
      closeRoutineManager: () => set(() => ({ isRoutineManagerOpen: false })),

      // --- AÇÕES DE ABAS ---
      openTab: (payload, groupPreference = null) => {
        const { tabGroups } = get();
        let targetGroupKey = groupPreference;
        if (!targetGroupKey) {
           targetGroupKey = payload.type === 'ASH_CHAT' ? 'right' : 'main';
        }
        const targetGroup = tabGroups[targetGroupKey];
        const existingTab = targetGroup.tabs.find(t => 
          (t.type === payload.type && payload.type !== 'doc_editor') && 
          (t.data?.id === payload.data?.id)
        );

        if (existingTab) {
          set(state => ({
            tabGroups: {
              ...state.tabGroups,
              [targetGroupKey]: { ...state.tabGroups[targetGroupKey], activeId: existingTab.id }
            },
            layout: targetGroupKey === 'right' 
              ? { ...state.layout, rightPanel: { ...state.layout.rightPanel, open: true } } 
              : state.layout
          }));
          return;
        }

        const newTab = {
          id: uuidv4(),
          type: payload.type,
          title: payload.title || 'Nova Aba',
          data: payload.data || {},
        };

        set(state => ({
          tabGroups: {
            ...state.tabGroups,
            [targetGroupKey]: {
              tabs: [...state.tabGroups[targetGroupKey].tabs, newTab],
              activeId: newTab.id
            }
          },
          layout: targetGroupKey === 'right' 
            ? { ...state.layout, rightPanel: { ...state.layout.rightPanel, open: true } } 
            : state.layout
        }));
      },

      closeTab: (tabId, groupKey) => {
        const { tabGroups } = get();
        const group = tabGroups[groupKey];
        const newTabs = group.tabs.filter(t => t.id !== tabId);
        let newActiveId = group.activeId;
        if (group.activeId === tabId) {
           newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }

        set(state => ({
          tabGroups: {
            ...state.tabGroups,
            [groupKey]: { tabs: newTabs, activeId: newActiveId }
          },
          layout: (groupKey === 'right' && newTabs.length === 0)
            ? { ...state.layout, rightPanel: { ...state.layout.rightPanel, open: false } }
            : state.layout
        }));
      },

      setActiveTab: (tabId, groupKey) => {
        set(state => ({
          tabGroups: {
            ...state.tabGroups,
            [groupKey]: { ...state.tabGroups[groupKey], activeId: tabId }
          }
        }));
      },

      moveTab: (tabId, fromGroup, toGroup) => {
        if (fromGroup === toGroup) return;
        const { tabGroups } = get();
        const tabToMove = tabGroups[fromGroup].tabs.find(t => t.id === tabId);
        if (!tabToMove) return;
        const newTabsOrigin = tabGroups[fromGroup].tabs.filter(t => t.id !== tabId);
        let newActiveIdOrigin = tabGroups[fromGroup].activeId;
        if (tabGroups[fromGroup].activeId === tabId) {
           newActiveIdOrigin = newTabsOrigin.length > 0 ? newTabsOrigin[newTabsOrigin.length - 1].id : null;
        }
        const newTabsDest = [...tabGroups[toGroup].tabs, tabToMove];

        set(state => ({
          tabGroups: {
            ...state.tabGroups,
            [fromGroup]: { tabs: newTabsOrigin, activeId: newActiveIdOrigin },
            [toGroup]: { tabs: newTabsDest, activeId: tabToMove.id }
          },
          layout: toGroup === 'right' 
            ? { ...state.layout, rightPanel: { ...state.layout.rightPanel, open: true } } 
            : state.layout
        }));
      },
      
      resetWorkspace: () => {
          set({
            tabGroups: {
                main: { tabs: [], activeId: null },
                right: { tabs: [{ id: 'ash-chat-main', type: 'ASH_CHAT', title: 'Ash', data: {} }], activeId: 'ash-chat-main' }
            }
          });
      }
    }),
    {
      name: 'prana-workspace-storage',
      partialize: (state) => ({ 
        tabGroups: state.tabGroups, 
        layout: state.layout,
        activeRealmId: state.activeRealmId,
        isUnifiedView: state.isUnifiedView,
        userPlan: state.userPlan
      }),
    }
  )
);
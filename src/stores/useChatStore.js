/* canvas: src/stores/useChatStore.js
   desc: Store do Chat V8.0 (Neural Link + Context Aware).
   feat: Suporta 'activeContext' para o Layout Tríptico e integrações com o Ash.
*/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '@/api/apiClient'; // FIO LIGADO: Cliente API Real
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'; // FIO LIGADO: Controle do IDE

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [
        { 
          id: 'init-1', 
          role: 'assistant', 
          content: 'Conectado ao Nexus. Como posso ajudar na sua criação hoje?', 
          timestamp: new Date().toISOString() 
        }
      ],
      isLoading: false,
      error: null,
      
      // --- CONTEXTO (Evoluído da V7) ---
      // Antes: chatContext: { projectId, projectName }
      // Agora: activeContext: { type: 'project'|'task', id: '123', title: '...', data: {} }
      activeContext: null,

      // Actions de Contexto
      setContext: (context) => {
          console.log(`[Ash] Contexto focado: ${context.type} - ${context.title}`);
          set({ activeContext: context });
      },
      clearContext: () => set({ activeContext: null }),

      // Helpers de Legado (Para compatibilidade se precisar)
      openProject: (id, title) => set({ activeContext: { type: 'project', id, title } }),
      closeProject: () => set({ activeContext: null }),

      addMessage: (message) => set((state) => ({ 
          messages: [...state.messages, { id: uuidv4(), timestamp: new Date().toISOString(), ...message }] 
      })),

      clearMessages: () => set({ messages: [] }),

      // AÇÃO MESTRA: ENVIA E PROCESSA
      sendMessage: async (content, options = {}) => {
        const { messages, activeContext } = get();
        const workspaceStore = useWorkspaceStore.getState();

        const { mode = 'chat', files = [] } = options;

        const userMsg = { 
          id: uuidv4(), 
          role: 'user', 
          content, 
          mode,
          files: files.map(f => ({ name: f.name, type: f.type, size: f.size })),
          timestamp: new Date().toISOString() 
        };
        set({ messages: [...messages, userMsg], isLoading: true, error: null });

        try {
            // 🔋 Buscar contexto holístico (energia, astrologia, diários)
            let holisticContext = null;
            try {
                const holisticRes = await apiClient.get('/ai/holistic-analysis');
                if (holisticRes.data.success) {
                    holisticContext = holisticRes.data;
                }
            } catch (e) {
                console.warn('[useChatStore] Contexto holístico indisponível:', e.message);
            }

            // 2. Chama o Backend (chatService)
            const response = await apiClient.post('/ai/chat', {
                message: content,
                mode, // Novo: modo do chat
                files, // Novo: arquivos anexados
                userId: workspaceStore.userId,
                nexusId: activeContext?.id || 'default',
                // Envia o contexto rico (Tarefa, Código, Projeto, Holístico)
                context: activeContext ? {
                    type: activeContext.type,
                    id: activeContext.id,
                    data: activeContext.data // Ex: conteúdo do arquivo aberto
                } : null,
                holisticContext, // Novo: energia, mood, diários, astrologia
                history: messages.slice(-6) 
            });

            const data = response.data;
            
            // 3. Resposta do Ash
            const ashMsg = { 
                id: uuidv4(), role: 'assistant', 
                content: data.response || "Comando processado.", 
                timestamp: new Date().toISOString() 
            };
            
            set(state => ({ messages: [...state.messages, ashMsg], isLoading: false }));

            // 4. EXECUÇÃO DE ORDEM (FIO LIGADO AO LAYOUT)
            if (data.client_action) {
                const action = data.client_action;
                console.log("⚡ [Ash Action]:", action);

                if (action.type === 'CHANGE_VIEW') {
                    if (action.projectId) {
                        workspaceStore.openTab({ type: 'PROJECT_CANVAS', title: action.projectName || 'Projeto', data: { id: action.projectId } }, 'main');
                        // Atualiza o contexto também
                        set({ activeContext: { type: 'project', id: action.projectId, title: action.projectName } });
                    } else if (action.view === 'dashboard') {
                        workspaceStore.openTab({ type: 'DASHBOARD', title: 'Central' }, 'main');
                        set({ activeContext: null });
                    }
                }
                // Ex: Ash sugere código
                if (action.type === 'SHOW_CODE_DIFF') {
                    // Aqui poderíamos disparar um evento para o TaskCodeWorkspace abrir o diff
                    window.dispatchEvent(new CustomEvent('prana:show-diff', { detail: action.payload }));
                }
            }

        } catch (error) {
            console.error("Erro neural:", error);
            set(state => ({ messages: [...state.messages, { id: uuidv4(), role: 'assistant', content: "Minha conexão com o Nexus falhou.", isError: true }], isLoading: false }));
        }
      },

      // ═══════════════════════════════════════════════════════════════════════════
      // PROACTIVE PROMPTS - Ash inicia conversa em horários específicos
      // ═══════════════════════════════════════════════════════════════════════════

      /**
       * Morning (6am): Pergunta sobre energia
       * Triggers: EnergyCheckInModal
       */
      askMorningEnergy: () => {
        const messages = get().messages;
        // Evitar duplicar se já perguntou hoje
        const hasAskedToday = messages.some(m => 
          m.content.includes('Como está sua energia') && 
          new Date(m.timestamp).toDateString() === new Date().toDateString()
        );

        if (!hasAskedToday) {
          set(state => ({ 
            messages: [...state.messages, {
              id: uuidv4(),
              role: 'assistant',
              content: '☀️ Bom dia! Como está sua energia agora? Vamos registrar para acompanhar seu padrão.',
              timestamp: new Date().toISOString(),
              action: { type: 'OPEN_ENERGY_MODAL', timeOfDay: 'morning' }
            }]
          }));
        }
      },

      /**
       * Afternoon (2pm): Pergunta se energia mudou
       * Triggers: EnergyCheckInModal
       */
      askAfternoonEnergy: () => {
        const messages = get().messages;
        const hasAskedToday = messages.some(m => 
          m.content.includes('Sua energia mudou') && 
          new Date(m.timestamp).toDateString() === new Date().toDateString()
        );

        if (!hasAskedToday) {
          set(state => ({ 
            messages: [...state.messages, {
              id: uuidv4(),
              role: 'assistant',
              content: '🌤️ Sua energia mudou desde a manhã? Vamos registrar a transformação do dia.',
              timestamp: new Date().toISOString(),
              action: { type: 'OPEN_ENERGY_MODAL', timeOfDay: 'afternoon' }
            }]
          }));
        }
      },

      /**
       * Evening (8pm): Convida reflexão no diário
       * Triggers: DiaryEditor (integrado no Dashboard)
       */
      askEveningReflection: () => {
        const messages = get().messages;
        const hasAskedToday = messages.some(m => 
          m.content.includes('Quer refletir') && 
          new Date(m.timestamp).toDateString() === new Date().toDateString()
        );

        if (!hasAskedToday) {
          set(state => ({ 
            messages: [...state.messages, {
              id: uuidv4(),
              role: 'assistant',
              content: '🌙 Como foi o seu dia? Quer documentar seus sentimentos e reflexões no diário? Isso nos ajuda a detectar seus rituais pessoais.',
              timestamp: new Date().toISOString(),
              action: { type: 'OPEN_DIARY_EDITOR' }
            }]
          }));
        }
      },

      /**
       * Propõe novo ritual detectado
       */
      proposeNewRitual: (ritual) => {
        const ritualText = `
Detectei um padrão em você! 🎯

**${ritual.name}**
${ritual.description}

Você gostaria de criar um ritual para consolidar esse padrão?
        `.trim();

        set(state => ({ 
          messages: [...state.messages, {
            id: uuidv4(),
            role: 'assistant',
            content: ritualText,
            timestamp: new Date().toISOString(),
            action: { type: 'CREATE_RITUAL', ritualId: ritual.id }
          }]
        }));
      }
    }),
    { 
        name: 'prana-chat-storage', 
        partialize: (state) => ({ messages: state.messages }) // Não persistir contexto (ele é efêmero de navegação)
    }
  )
);
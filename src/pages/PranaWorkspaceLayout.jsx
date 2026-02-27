/* src/pages/PranaWorkspaceLayout.jsx
   desc: Layout Mestre V16.0 (Sidebar Embutida).
   feat: Código do componente Sidebar.jsx foi movido (embutido) diretamente para o Layout, eliminando o componente separado.
*/
import React, { Suspense, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useTranslations } from '@/components/LanguageProvider';
import { cn } from '@/lib/utils';
import { ProjectViewSyncProvider } from '@/hooks/useProjectViewSync'; 
import { useTheme } from '@/components/ThemeProvider'; 
import { PranaLogo } from '@/components/ui/PranaLogo';
import { VIEW_TYPES } from '@/config/viewTypes';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth'; // <-- ADICIONADO PARA A LÓGICA DE LOGOUT E ESTADO
import MobileWorkspaceLayout from '@/components/mobile/MobileWorkspaceLayout';
import { useSystemInit } from '@/hooks/useSystemInit'; // Gatilho V10
import NexusExplorer from '@/components/nexus/NexusExplorer'; // Novo GPS lateral

// Bioma System v2.0
import { BiomeProvider } from '@/contexts/BiomeContext';
import { DynamicBiomeBackground } from '@/components/biome/DynamicBiomeBackground';
import { BiomeRecommendationNotification } from '@/components/biome/BiomeRecommendationNotification';
import { useBiomeMonitor } from '@/hooks/useBiomeMonitor';

// Entidades
import { Project, Task, Document, MindMap } from '@/api/entities';

// Ícones (Usando o pacote corrigido)
import { 
  IconLoader2, IconChat, IconX,
  // Ícones da Sidebar (Movidos de sidebar.jsx)
  IconSankalpa, IconNeural, IconList, IconLayers, IconFlux, IconSearch,
  IconDashboard, IconCronos, IconPapyrus, IconSettings, IconLogOut, IconBox
} from '@/components/icons/PranaLandscapeIcons';

// Componentes
import Sidebar from '@/components/ui/sidebar';
import OllyToggleButton from '@/components/olly/OllyToggleButton';
import TagExplorer from '@/components/dashboard/TagExplorer';
import TagCanvasView from '@/views/TagCanvasView';
import { PranaCommandPalette } from '@/components/ui/PranaCommandPalette';
import SmartCreationModal from '@/components/smart/SmartCreationModal';
import PranaFormModal from '@/components/forms/PranaFormModal';
import TaskWorkspaceOverlay from '@/components/tasks/TaskWorkspaceOverlay';
import RoutineManagerModal from '@/components/modals/RoutineManagerModal'; 

// Views
// Views importadas diretamente de /src/views
import DashboardView from '@/views/DashboardView';
import PlannerView from '@/views/PlannerView';
import CalendarView from '@/views/CalendarView';
import ProjectCanvasView from '@/views/ProjectCanvasView';
import ChainView from '@/views/ChainView';
import MindMapBoardView from '@/views/MindMapBoardView';
import DocEditorView from '@/views/DocEditorView';

// Views que ainda vivem em /src/pages
import ProjectHub from '@/pages/ProjectHub';
import SettingsView from '@/pages/Settings';

const SideChat = React.lazy(() => import('@/components/chat/SideChat'));
const SankalpaView = React.lazy(() => import('@/views/SankalpaView')); 
const ListView = React.lazy(() => import('@/views/ListView'));
const InboxView = React.lazy(() => import('@/views/InboxView'));
const SheetView = React.lazy(() => import('@/views/SheetView'));

//Views de Sistemas
import BrandCodeView from "@/views/BrandCodeView";

const TabLoader = () => (
  <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
    <IconLoader2 className="w-6 h-6 animate-spin" />
  </div>
);

// Auxiliares (precisam existir antes do uso)
function QuickButton({ icon: Icon, color, onClick, title }) {
  return (
    <button 
      onClick={onClick} 
      className={`${color}/70 hover:${color} p-2.5 rounded-xl transition-all duration-300 hover:bg-white/5 active:scale-90`} 
      title={title}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

function NavButton({ icon: Icon, label, isActive, onClick, ...rest }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl transition-all duration-300 relative group w-11 h-11 flex items-center justify-center active:scale-95",
        isActive 
          ? "text-[rgb(var(--accent-rgb))] bg-[rgb(var(--accent-rgb))]/10" 
          : "text-foreground hover:bg-white/5"
      )}
      title={label}
      {...rest}
    >
      <Icon 
        className={cn(
          "w-6 h-6",
          isActive ? "text-[rgb(var(--accent-rgb))]" : "text-foreground"
        )} 
        ativo={isActive} 
      />
    </button>
  );
}

// Cabeçalho simples para grupos de abas (fallback)
function TabGroupHeader({ groupKey, tabs = [], activeId, onActivate, onClose }) {
  return (
    <div className="h-9 border-b border-border/30 bg-background/30 backdrop-blur-sm flex items-center px-2 gap-2 text-xs">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onActivate?.(t.id)}
          className={cn(
            "px-2 py-1 rounded-md transition-all",
            t.id === activeId ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
          )}
          title={t.title}
        >
          <span className="mr-2">{t.title}</span>
          <span
            className="ml-1 opacity-60 hover:opacity-100"
            onClick={(e) => { e.stopPropagation(); onClose?.(t.id); }}
          >
            ×
          </span>
        </button>
      ))}
    </div>
  );
}

// Componente interno que ativa o monitor de biomas
function PranaWorkspaceContent() {
  // Ativa o monitor de biomas
  useBiomeMonitor();
  useSystemInit();

// Renderizador Dinâmico de Views
const ViewRenderer = ({ tab }) => {
  if (!tab || !tab.type) return null;
  switch (tab.type) {
    case VIEW_TYPES.ASH_CHAT:
      return (
        <Suspense fallback={<TabLoader />}>
          <SideChat />
        </Suspense>
      );
    case VIEW_TYPES.DASHBOARD:
      return <DashboardView />;
    case VIEW_TYPES.PLANNER_WEEKLY:
      return <PlannerView />;
    case VIEW_TYPES.CALENDAR_MONTHLY:
      return <CalendarView />;
    case VIEW_TYPES.PROJECT_HUB:
      return <ProjectHub />;
    case VIEW_TYPES.PROJECT_CANVAS:
      return <ProjectCanvasView projectId={tab.data?.id} />;
    case VIEW_TYPES.SHEET_VIEW:
      return <SheetView />;
    case VIEW_TYPES.CHAIN_VIEW:
      return <ChainView />;
    case VIEW_TYPES.MINDMAP_VIEW:
      return <MindMapBoardView />;
    case VIEW_TYPES.INBOX_VIEW:
      return (
        <Suspense fallback={<TabLoader />}>
          <InboxView />
        </Suspense>
      );
    case VIEW_TYPES.DOC_EDITOR:
      return <DocEditorView />;
    case VIEW_TYPES.LIST_VIEW:
      return (
        <Suspense fallback={<TabLoader />}>
          <ListView />
        </Suspense>
      );
    case VIEW_TYPES.SETTINGS:
      return <SettingsView />;
    case 'TAG_CANVAS':
      return (
        <Suspense fallback={<TabLoader />}>
          <TagCanvasView tag={tab.data?.tag} />
        </Suspense>
      );
    case 'BRANDCODE':
      return (
        <BrandCodeView
          projectId={tab.data?.projectId}
          onOpenProtocol={() => {
            // Emite um evento customizado para ligar ao fluxo de protocolo/chat
            window.dispatchEvent(new CustomEvent('prana:open-protocol', { detail: { projectId: tab.data?.projectId } }));
          }}
        />
      );
    default:
      return <div />;
  }
  
};
// FIM DO RENDERIZADOR DE VIEWS

  // Estado e hooks necessários
  const { t } = useTranslations();
  const {
    // Geometria e Consciência
    layout, 
    activeRealmId, 
    
    // Painéis Laterais
    activeSidePanel,
    setActiveSidePanel,
    // Nota: Se quiser saber se o explorer está aberto, use layout.explorer.open
    
    // Gestão de Abas (O Palco)
    tabGroups,
    setActiveTab,
    closeTab,
    openTab,
    
    // Ações de Layout
    toggleRightPanel,
    toggleSidebar,
    toggleSideChatPosition,
    
    // Modais e Overlays (Ajustado para os nomes reais do Store)
    isPranaFormOpen, 
    closePranaForm,
    isRoutineManagerOpen,
    closeRoutineManager,
    isSmartModalOpen,
    closeSmartModal
  } = useWorkspaceStore();
  const { theme, animationsEnabled } = useTheme();
  const { logout } = useAuth();
  const [explorerData, setExplorerData] = useState({ projects: [], tasks: [], documents: [], maps: [] });
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

  const handleLogout = () => { try { logout?.(); } catch (e) { console.warn('logout failed', e); } };
  const handleCreate = (type) => { window.dispatchEvent(new CustomEvent('prana:open-smart-modal', { detail: { type } })); };
  const handlePanelClick = (panel) => { /* store controla painel; manter como no-op aqui */ };
  const handleSearch = () => { window.dispatchEvent(new CustomEvent('prana:open-command-palette')); };

  // Diagnóstico: garantir que os ícones importados não estão undefined
  useEffect(() => {
    console.log('🧩 Ícones carregados:', {
      IconSankalpa: typeof IconSankalpa,
      IconNeural: typeof IconNeural,
      IconList: typeof IconList,
      IconLayers: typeof IconLayers,
      IconFlux: typeof IconFlux,
      IconSearch: typeof IconSearch,
      IconDashboard: typeof IconDashboard,
      IconCronos: typeof IconCronos,
      IconPapyrus: typeof IconPapyrus,
      IconSettings: typeof IconSettings,
      IconLogOut: typeof IconLogOut,
      IconBox: typeof IconBox,
    });
    console.log('🧭 Layout flags:', {
      sidebarOpen: layout?.sidebar?.open,
      explorerOpen: layout?.explorer?.open,
      rightOpen: layout?.rightPanel?.open,
    });
    // Teste: inserir um SVG simples para validar visibilidade
    console.log('🔬 Diagnóstico: sidebar container deve herdar text-foreground');
  }, []);

  const loadExplorer = async () => {
      try {
          // Timeout de segurança de 5 segundos
          const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout carregando Explorer')), 5000)
          );

          const [projects, tasks, documents, maps] = await Promise.race([
              Promise.all([
                  Project.filter({ deleted_at: null }),
                  Task.filter({ deleted_at: null }), 
                  Document.filter({ deleted_at: null }),
                  MindMap.list()
              ]),
              timeoutPromise
          ]);

          const loadExplorer = async () => {
    try {
        const [projects, tasks, documents, checklists] = await Promise.all([
            Project.list({ deleted_at: null }),
            Task.filter({ status: 'todo', deleted_at: null }),
            Document.list(),
            Checklist.list()
        ]);

        // --- LÓGICA DE FILTRAGEM V10 (O FILTRO DE CONSCIÊNCIA) ---
        // Se o Realm for 'all', não filtramos. Se for específico, filtramos por realmId.
        const filterByRealm = (item) => {
            if (activeRealmId === 'all') return true;
            return item.realmId === activeRealmId;
        };

        const filteredProjects = projects.filter(filterByRealm);
        
        // Tarefas são filtradas pelo seu próprio Realm ou pelo Realm do Projeto pai
        const filteredTasks = tasks.filter(task => {
            if (activeRealmId === 'all') return true;
            return task.realmId === activeRealmId || task.project?.realmId === activeRealmId;
        });

        const filteredChecklists = checklists.filter(filterByRealm);

        // Atualiza o Explorer apenas com o que pertence ao Universo ativo
        setExplorerData({
            projects: filteredProjects,
            tasks: filteredTasks,
            documents: documents.filter(filterByRealm),
            checklists: filteredChecklists
        });

    } catch (error) {
        console.error("Erro na sincronização neural:", error);
    }
};

         // 3. A PONTE (Alimentação do Estado)
          // Aqui os dados brutos são guardados na variável 'explorerData'
          setExplorerData({ projects, tasks, documents, maps });

          console.log("Ash: Nexus sincronizado com sucesso.");

      } catch (e) { 
          // 4. PROTEÇÃO CONTRA CRASH
          // Se o banco falhar ou demorar, limpamos o estado para não quebrar a UI
          console.warn("Explorer sync failed (usando fallback):", e.message);
          setExplorerData({ projects: [], tasks: [], documents: [], maps: [] });
      }
  };

  // [LOGIC] Carregamento seguro
  useEffect(() => {
      if (layout?.explorer?.open && activeSidePanel === 'files') {
          loadExplorer();
      }
  }, [layout?.explorer?.open, activeSidePanel]); 

  const handleChatToggle = () => {
    if (!layout?.rightPanel?.open || !tabGroups.right.activeId) {
        openTab({ type: VIEW_TYPES.ASH_CHAT, title: 'Ash Terminal' }, 'right');
    } else {
        toggleRightPanel();
    }
  };

  const handleToggleChatPosition = () => {
    toggleSideChatPosition();
  };

  const handleOpenTag = (tagName) => {
      openTab({
          type: 'TAG_CANVAS',
          title: `#${tagName}`,
          data: { tag: tagName }
      }, 'main');
  };

  const handleViewClick = (type, title) => {
    openTab({ type, title }, 'main');
  };

  // Listener global para abrir o BrandCode (ou abrir chat/protocolo)
  useEffect(() => {
    const onOpenProtocol = (e) => {
      const projectId = e?.detail?.projectId;
      if (!projectId) return;

      // Abre BrandCode na área principal
      openTab({
        type: 'BRANDCODE',
        title: `Brand ${projectId}`,
        data: { projectId }
      }, 'main');

      // Abrir também o SideChat com a agente "Flor" no painel direito
      openTab({
        type: VIEW_TYPES.ASH_CHAT,
        title: 'Flor',
        data: { projectId, agent: 'Flor' }
      }, 'right');

      if (!layout?.rightPanel?.open) toggleRightPanel();
    };

    window.addEventListener('prana:open-protocol', onOpenProtocol);
    return () => window.removeEventListener('prana:open-protocol', onOpenProtocol);
  }, [openTab, toggleRightPanel, layout?.rightPanel?.open]);


  // Renderizador de conteúdo desktop
  const desktopLayout = (
    <ProjectViewSyncProvider>
      <div className="workspace-wabi h-screen w-screen bg-transparent text-foreground flex flex-col overflow-hidden font-sans transition-colors duration-500" data-theme={theme} data-animations-enabled={String(animationsEnabled)}>
        
        {/* Modais Globais */}
        <SmartCreationModal />
        <PranaFormModal />
        <RoutineManagerModal isOpen={isRoutineManagerOpen} onClose={closeRoutineManager} />
        
        <TaskWorkspaceOverlay 
            isOpen={activeOverlay?.type === 'TASK_DETAIL'}
            onClose={closeOverlay}
            taskData={activeOverlay?.data}
        />

        {/* HEADER RESTAURADO (V10 Style - Metallic & Gradient) */}
        <header className="h-16 border-b border-border/40 flex items-center px-6 justify-between backdrop-blur-md z-50 shrink-0 bg-background/20 gap-8">
          
          {/* 1. IDENTIDADE (LOGO + NOME) */}
          <div className="flex items-center gap-3 min-w-fit cursor-pointer group" onClick={toggleSidebar}>
            <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                <PranaLogo className="w-9 h-9 text-primary drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" ativo={true} />
            </div>
            
            <div className="flex flex-col justify-center space-y-0.5">
                <span className="font-serif font-bold text-xl tracking-tight bg-gradient-to-br from-white via-gray-300 to-gray-500 bg-clip-text text-transparent drop-shadow-sm select-none">
                    Prana
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 select-none">
                    Neural OS
                </span>
            </div>
          </div>

          {/* 2. CÉREBRO (BUSCA) */}
          <div className="flex-1 max-w-xl">
              <PranaCommandPalette className="w-full" />
          </div>

          {/* 3. AÇÕES DIREITA */}
          <div className="flex items-center gap-2 min-w-fit">
              {/* Olly Toggle */}
              <OllyToggleButton />

              <button 
                type="button"
                onClick={handleToggleChatPosition} 
                className={cn(
                  "h-10 w-10 p-2 rounded-xl hover:bg-white/5 transition-all active:scale-95 border text-muted-foreground border-transparent hover:border-white/10"
                )} 
                title={`Move chat to ${layout?.sideChatPosition === 'right' ? 'left' : 'right'}`}
              >
                  <span className="text-xs font-bold">{layout?.sideChatPosition === 'right' ? '←' : '→'}</span>
              </button>

              <button 
                type="button"
                onClick={handleChatToggle} 
                className={cn(
                  "h-10 w-10 p-2 rounded-xl hover:bg-white/5 transition-all active:scale-95 border",
                  layout?.rightPanel?.open 
                    ? "text-primary bg-primary/10 border-primary/20" 
                    : "text-muted-foreground border-transparent hover:border-white/10"
                )} 
                title="Ash Terminal"
              >
                  <IconChat className="w-5 h-5" />
              </button>
          </div>
        </header>

{/* CORPO DO LAYOUT */}
        <div className="flex-1 overflow-hidden relative min-h-0 flex">
          
          {/* 1. ACTIVITY BAR (Sidebar) */}
<div className={cn(
  "flex-shrink-0 transition-all duration-300 z-40 prana-sidebar-glass", 
  layout?.sidebar?.open ? "w-20 md:w-24" : "w-0 overflow-hidden"
)}>
  
  {/* Passando a função para que os botões da Sidebar possam usá-la */}
  <Sidebar 
    activePanel={activeSidePanel} 
    onPanelChange={setActiveSidePanel} 
  />

</div>

          {/* 2. CAMADA DE MODAIS (Fora da Sidebar para não serem cortados) 
             Ao colocar aqui, as variáveis isSmartModalOpen, isPranaFormOpen, etc., 
             finalmente "acenderão" no seu código.
          */}
          <SmartCreationModal 
            isOpen={isSmartModalOpen} 
            onClose={closeSmartModal} 
          />

          <PranaFormModal 
            isOpen={isPranaFormOpen} 
            onClose={closePranaForm} 
          />

          {isRoutineManagerOpen && (
            <RoutineManagerModal 
              isOpen={isRoutineManagerOpen} 
              onClose={closeRoutineManager} 
            />
          )}

          {/* 2. PAINÉIS RESIZÁVEIS */}
          <div className="flex-1 min-w-0 flex flex-col">
            <PanelGroup direction="horizontal" autoSaveId="prana-layout-v10">
              
              {/* 2a. SIDE PANEL (Explorer/Tags) */}
              {layout?.explorer?.open && (
                  <>
                    <Panel defaultSize={15} minSize={10} maxSize={25} className="flex flex-col border-r border-border/20 bg-background/60 backdrop-blur-md">
                        <div className="p-3 text-xs font-bold uppercase tracking-widest opacity-50 border-b border-border/10 bg-white/5 flex justify-between items-center">
                            <span>{activeSidePanel === 'files' ? t('sidebar_explorer') : t('sidebar_tags')}</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto prana-scrollbar p-2">
                            {activeSidePanel === 'files' ? (
                                <NexusExplorer 
                                    projects={explorerData.projects}
                                    tasks={explorerData.tasks}
                                    documents={explorerData.documents}
                                    maps={explorerData.maps}
                                    onRefresh={loadExplorer} 
                                />
                            ) : (
                                <TagExplorer 
                                    onSelectTag={handleOpenTag}
                                    activeTag={tabGroups.main.tabs.find(t => t.id === tabGroups.main.activeId)?.data?.tag}
                                />
                            )}
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-[1px] bg-border/40 hover:bg-primary hover:w-[3px] transition-all z-50 cursor-col-resize" />
                  </>
              )}

              {/* 2b. RIGHT PANEL (Chat - Left Position) */}
              {layout?.rightPanel?.open && layout?.sideChatPosition === 'left' && (
                <>
                  <Panel defaultSize={30} minSize={20} maxSize={50} className="flex flex-col border-r border-border/20 bg-background/80 backdrop-blur-xl relative z-40 shadow-xl">
                      <div className="flex-1 overflow-hidden relative">
                        <ViewRenderer tab={{ type: VIEW_TYPES.ASH_CHAT }} />
                      </div>
                  </Panel>
                  <PanelResizeHandle className="w-[1px] bg-border/40 hover:bg-primary hover:w-[3px] transition-all z-50 cursor-col-resize" />
                </>
              )}

              {/* 2c. MAIN CONTENT */}
              <Panel minSize={30} className="relative flex flex-col min-h-0">
                  <TabGroupHeader groupKey="main" tabs={tabGroups.main.tabs} activeId={tabGroups.main.activeId} onActivate={(id) => setActiveTab(id, 'main')} onClose={(id) => closeTab(id, 'main')} />
                  <div className="flex-1 overflow-auto relative shadow-inner bg-background/40 backdrop-blur-sm min-h-0 w-full">
                    {tabGroups.main.activeId ? (
                        <ViewRenderer tab={tabGroups.main.tabs.find(t => t.id === tabGroups.main.activeId)} />
                    ) : (
                      <SankalpaView />
                    )}
                  </div>
              </Panel>
              
              {/* 2d. RIGHT PANEL (Chat - Right Position) */}
              {layout?.rightPanel?.open && layout?.sideChatPosition === 'right' && (
                <>
                  <PanelResizeHandle className="w-[1px] bg-border/40 hover:bg-primary hover:w-[3px] transition-all z-50 cursor-col-resize" />
                  <Panel defaultSize={30} minSize={20} maxSize={50} className="flex flex-col border-l border-border/20 bg-background/80 backdrop-blur-xl relative z-40 shadow-xl">
                      <div className="flex-1 overflow-hidden relative">
                        <ViewRenderer tab={{ type: VIEW_TYPES.ASH_CHAT }} />
                      </div>
                  </Panel>
                </>
              )}
            </PanelGroup>
          </div>
        </div>
        
        <footer className="h-6 border-t border-border/40 flex items-center px-4 text-[10px] text-muted-foreground justify-between select-none shrink-0 font-mono uppercase tracking-widest z-50 bg-background/30 backdrop-blur-sm">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> <span>{t('sidebar_system_active')}</span></div>
          <div className="opacity-50">{t('sidebar_version')}</div>
        </footer>
      </div>
    </ProjectViewSyncProvider>
  );

  // Return com wrapper mobile
  return (
    <MobileWorkspaceLayout>
      {desktopLayout}
    </MobileWorkspaceLayout>
  );
}

/**
 * Componente principal exportado com BiomeProvider
 * Fornece contexto de biomas para toda a aplicação
 */
export default function PranaWorkspaceLayout() {
  return (
    <BiomeProvider>
      {/* Background dinâmico dos biomas (z-0, atrás de tudo) */}
      <DynamicBiomeBackground asOverlay={true} />
      
      {/* Conteúdo principal do workspace */}
      <PranaWorkspaceContent />
      
      {/* Notificação de recomendação do Ash */}
      <BiomeRecommendationNotification />
    </BiomeProvider>
  );
}
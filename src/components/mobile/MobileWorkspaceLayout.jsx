/* src/components/mobile/MobileWorkspaceLayout.jsx
   desc: Orquestrador Chat-First. O Ash é o background e o sistema operacional.
   feat: Camadas dinâmicas, texturas Wabi-Sabi e suporte a contexto de projeto.
*/
import React, { Suspense, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Mobile e Ícones do Desktop
import MobileHeaderBar from './MobileHeaderBar';
import MobileDrawer from './MobileDrawer';
import WeekStrip from './WeekStrip';
import { IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { PranaLogo } from '@/components/ui/PranaLogo';
import SmartCreationModal from '@/components/smart/SmartCreationModal';

// Lazy loading das ferramentas
const SideChat = React.lazy(() => import('@/components/chat/SideChat'));
const KanbanView = React.lazy(() => import('@/views/KanbanView'));
const SheetView = React.lazy(() => import('@/views/SheetView'));
const PlannerView = React.lazy(() => import('@/views/PlannerView'));
const InboxView = React.lazy(() => import('@/views/InboxView'));
const SettingsPage = React.lazy(() => import('@/pages/Settings.jsx'));
const ProjectCanvasView = React.lazy(() => import('@/views/ProjectCanvasView'));
const ListView = React.lazy(() => import('@/views/ListView'));

const TabLoader = () => (
  <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
    <IconLoader2 className="w-6 h-6 animate-spin" />
  </div>
);

export default function MobileWorkspaceLayout() {
  const { theme } = useTheme();
  const { openSmartModal } = useWorkspaceStore();
  const { user } = useAuth();

  // Estados de Navegação Neural
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlayView, setOverlayView] = useState(null); // 'planner', 'calendar', 'inbox', 'tasks'
  const [activeProject, setActiveProject] = useState(null); // Contexto de projeto aberto
  const [projectTool, setProjectTool] = useState(null); // 'kanban', 'sheet'
  const [openProjectId, setOpenProjectId] = useState(null); // Para ProjectCanvasView mobile
  const [notificationCount, setNotificationCount] = useState(0); // Contagem de notificações

  const resetToChat = () => {
    setOverlayView(null);
    setActiveProject(null);
    setProjectTool(null);
  };

  const handleNavigate = (dest) => {
    setDrawerOpen(false);
    if (dest === 'settings') setOverlayView('settings');
    else if (dest === 'ash') resetToChat();
    else setOverlayView(dest);
  };

  // Listener para abrir ProjectCanvasView ao clicar no nome do projeto na ListView
  React.useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.projectId) {
        setOpenProjectId(e.detail.projectId);
        setOverlayView('project-canvas');
      }
    };
    window.addEventListener('prana:open-project-canvas', handler);
    return () => window.removeEventListener('prana:open-project-canvas', handler);
  }, []);

  // Listener para contar notificações (Inbox)
  React.useEffect(() => {
    const handler = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setNotificationCount(e.detail.count);
      }
    };
    window.addEventListener('prana:update-notification-count', handler);
    return () => window.removeEventListener('prana:update-notification-count', handler);
  }, []);

  // Título dinâmico para o Header
  const currentTitle = activeProject ? activeProject.title : 
                       overlayView ? overlayView.charAt(0).toUpperCase() + overlayView.slice(1) : 
                       "Prana OS";

  return (
    <div className="h-screen w-screen bg-[#050505] flex justify-center overflow-hidden font-sans">
      {/* Modal de Criação Inteligente (Cmd+K / +) */}
      <SmartCreationModal />
      
      {/* FRAME MOBILE (Limitador de largura para Desktop) */}
      <div 
        className={cn(
          "h-full w-full max-w-[460px] relative overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x border-white/5 transition-all duration-500",
          theme === 'wabi-sabi-light' ? "bg-[#f4f1ea] text-[#2a2a2a]" : "bg-[#0d0d0f] text-[#e0e0e0]"
        )}
        style={{
          backgroundImage: theme === 'wabi-sabi-light' 
            ? 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")' 
            : 'url("https://www.transparenttextures.com/patterns/cartographer.png")',
        }}
      >
        {/* 0. MARCA D'ÁGUA NO FUNDO - PranaLogo */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          style={{
            transform: 'scale(0.92) translateY(3%)',
            opacity: 0.22,
            filter: 'blur(0.5px) drop-shadow(0 0 32px rgba(217,119,6,0.25))',
            zIndex: 0,
          }}
        >
          <PranaLogo 
            className="w-[220px] h-[220px]"
            ativo={true}
            style={{
              filter: 'drop-shadow(0 0 32px rgba(217,119,6,0.45)) drop-shadow(0 0 64px rgba(217,119,6,0.18)) blur(1.5px)',
              opacity: 0.32,
            }}
          />
          <style>{`
            .prana-logo-watermark * {
              fill: rgba(217,119,6,0.85) !important;
              stroke: rgba(217,119,6,0.55) !important;
            }
          `}</style>
        </div>

        {/* 1. CAMADA BASE: O CHAT ASH (Fundo Ativo) */}
        <div className={cn(
          "absolute inset-0 z-10 transition-all duration-700 ease-out",
          (overlayView || activeProject) ? "scale-[0.97] opacity-10 blur-xl grayscale pointer-events-none" : "scale-100 opacity-100 blur-0"
        )}>
          <Suspense fallback={<TabLoader />}>
            {/* O SideChat aqui atua como o chat mobile principal */}
            <SideChat hideHeader={true} isMobile={true} />
          </Suspense>
        </div>

        {/* 2. HEADER FIXO */}
        <MobileHeaderBar 
          title={currentTitle}
          onMenuToggle={() => setDrawerOpen(true)}
          onBack={(overlayView || activeProject) ? resetToChat : null}
        />

        {/* 3. CAMADA DE CONTEÚDO: OVERLAYS (SHEETS) */}
        <div className="flex-1 relative z-30 pointer-events-none">
          <AnimatePresence mode="wait">
            {(overlayView || activeProject) && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 280 }}
                className="absolute inset-0 z-40 pointer-events-auto bg-background/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[40px] flex flex-col shadow-2xl overflow-hidden"
              >
                {/* Drag Handle Estilo iOS */}
                <div className="w-full flex justify-center py-4 cursor-pointer shrink-0" onClick={resetToChat}>
                  <div className="w-12 h-1.5 bg-foreground/20 rounded-full hover:bg-foreground/40 transition-colors" />
                </div>


                <div className="flex-1 overflow-hidden relative flex flex-col">
                  {/* View: Calendário/Agenda (Precisa de Padding e Scroll Próprio) */}
                  {overlayView === 'calendar' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="h-full overflow-y-auto px-6 pb-20"
                    >
                      <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-40 mb-4">Fluxo Temporal</h2>
                      <WeekStrip />
                      <div className="mt-12 p-8 border border-dashed border-white/10 rounded-3xl text-center opacity-30 italic text-sm">
                        Espaço para agenda diária...
                      </div>
                    </motion.div>
                  )}

                  {/* View: Tarefas & Projetos (ListView Mobile já tem layout próprio) */}
                  {overlayView === 'tasks' && !openProjectId && (
                    <Suspense fallback={<TabLoader />}>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                        <React.Suspense fallback={<TabLoader />}>
                          {/** ProjectHub com ListView mobile **/}
                          <ListView isMobile={true} />
                        </React.Suspense>
                      </motion.div>
                    </Suspense>
                  )}

                  {/* View: ProjectCanvasView mobile (já tem layout próprio) */}
                  {overlayView === 'project-canvas' && openProjectId && (
                    <Suspense fallback={<TabLoader />}>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                        <ProjectCanvasView projectId={openProjectId} isMobile={true} allowedViews={['board','sheet','list','calendar']} onBack={() => { setOpenProjectId(null); setOverlayView('tasks'); }} />
                      </motion.div>
                    </Suspense>
                  )}

                  {/* View: Planner (já tem layout próprio) */}
                  {overlayView === 'planner' && (
                    <Suspense fallback={<TabLoader />}>
                      <div className="h-full">
                         <PlannerView isMobile={true} />
                      </div>
                    </Suspense>
                  )}

                  {/* View: Inbox (já tem layout próprio) */}
                  {overlayView === 'inbox' && (
                    <Suspense fallback={<TabLoader />}>
                      <div className="h-full">
                        <InboxView isMobile={true} />
                      </div>
                    </Suspense>
                  )}

                  {/* View: Settings (precisa de scroll mas Inbox/SettingsPage geralmente cuidam disso, vou assumir padding aqui) */}
                  {overlayView === 'settings' && (
                    <Suspense fallback={<TabLoader />}>
                       <div className="h-full overflow-y-auto custom-scrollbar">
                          <SettingsPage isMobile={true} />
                       </div>
                    </Suspense>
                  )}

                  {/* Contexto de Projeto Aberto: Kanban/Sheet */}
                  {activeProject && (
                    <div className="h-full flex flex-col px-6 pb-20 overflow-y-auto">
                       <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-2xl self-start">
                          <button 
                            className={`px-4 py-1 rounded-xl text-xs font-bold transition-colors ${projectTool === 'kanban' ? 'bg-primary text-white' : 'bg-transparent text-foreground/60'}`}
                            onClick={() => setProjectTool('kanban')}
                          >KANBAN</button>
                          <button 
                            className={`px-4 py-1 rounded-xl text-xs font-bold transition-colors ${projectTool === 'sheet' ? 'bg-primary text-white' : 'bg-transparent text-foreground/60'}`}
                            onClick={() => setProjectTool('sheet')}
                          >SHEET</button>
                       </div>
                       <Suspense fallback={<TabLoader />}> 
                          <div className="flex-1 min-h-0">
                            {/* Notas: KanbanView e SheetView mobile gerenciam seu scroll horizontal, mas precisam de altura definida */}
                            {projectTool === 'kanban' && <KanbanView projectId={activeProject.id} isMobile={true} />}
                            {projectTool === 'sheet' && <SheetView projectId={activeProject.id} isMobile={true} />}
                            {!projectTool && (
                                <div className="mt-10 text-center space-y-4">
                                    <p className="text-lg font-serif italic">"{activeProject.title}"</p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-40">Selecione uma lente de visualização acima</p>
                                </div>
                            )}
                          </div>
                       </Suspense>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. DRAWER LATERAL (Menu) */}
        <MobileDrawer 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)} 
          onNavigate={handleNavigate}
          user={user}
          notificationCount={notificationCount}
        />
      </div>
    </div>
  );
}
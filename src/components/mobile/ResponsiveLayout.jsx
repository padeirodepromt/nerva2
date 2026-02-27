import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import MobileBottomNav from './MobileBottomNav';
import MobileHeaderBar from './MobileHeaderBar';
import MobileDrawer from './MobileDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { cn } from '@/lib/utils';

/**
 * ResponsiveLayout - Layout que se adapta automaticamente para mobile
 * Em mobile: Bottom nav + Header + Drawer lateral
 * Em desktop: Mantém layout original
 */
export default function ResponsiveLayout({ children }) {
  const { isMobile, isTablet, isDesktop } = useMobileDetect();
  const { user } = useAuth();
  const { openSmartModal } = useWorkspaceStore();
  
  const [activeTab, setActiveTab] = useState('chat');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Se é desktop, renderiza layout original
  if (isDesktop) {
    return children;
  }

  // MOBILE/TABLET LAYOUT
  const handleNavigate = (destination) => {
    switch (destination) {
      case 'settings':
        window.location.href = '/settings';
        break;
      case 'favorites':
        setActiveTab('favorites');
        break;
      case 'recent':
        setActiveTab('recent');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        // Renderiza SideChat em full-screen
        return (
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        );

      case 'tasks':
        // Renderize a view principal de tarefas responsiva aqui
        return null;

      case 'calendar':
        // Renderize a view principal de calendário responsiva aqui
        return null;

      case 'dashboard':
        // Renderiza versão compacta do dashboard
        return (
          <div className="flex-1 overflow-hidden p-3">
            <div className="text-xs text-muted-foreground text-center py-8">
              Dashboard Mobile (em desenvolvimento)
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'h-screen w-screen overflow-hidden',
      'flex flex-col'
    )}>
      {/* Header */}
      <MobileHeaderBar
        title={activeTab === 'chat' ? 'Ash' : activeTab === 'tasks' ? 'Tarefas' : 'Prana'}
        onMenuToggle={() => setDrawerOpen(!drawerOpen)}
        menuOpen={drawerOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </div>

      {/* Drawer Lateral */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      {/* Task Details (Bottom Sheet quando selecionado) */}
      {selectedTask && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-30',
            'bg-background rounded-t-2xl',
            'border-t border-white/10',
            'max-h-[90vh] overflow-y-auto',
            'p-4'
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold truncate">
              {selectedTask.title}
            </h2>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {selectedTask.description && (
              <div>
                <p className="text-xs opacity-60 mb-1">Descrição</p>
                <p className="opacity-80">{selectedTask.description}</p>
              </div>
            )}

            {selectedTask.due_date && (
              <div>
                <p className="text-xs opacity-60 mb-1">Data</p>
                <p className="opacity-80">
                  {new Date(selectedTask.due_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            {selectedTask.priority && (
              <div>
                <p className="text-xs opacity-60 mb-1">Prioridade</p>
                <p className="opacity-80 capitalize">{selectedTask.priority}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button className="flex-1 h-10 bg-white/10 hover:bg-white/20 rounded text-sm">
              Editar
            </button>
            <button className="flex-1 h-10 bg-green-500/20 hover:bg-green-500/30 rounded text-sm text-green-400">
              Concluir
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

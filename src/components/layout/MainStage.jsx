import React from "react";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { VIEW_TYPES } from "@/config/viewTypes";
import { PranaLoader } from "@/components/PranaLoader";
import { IconVoid } from "@/components/icons/PranaLandscapeIcons";

// Lazy Imports para manter a leveza Fractal
const DashboardView = React.lazy(() => import("@/views/DashboardView"));
// const ProjectCanvasView = React.lazy(() => import("@/views/ProjectCanvasView"));

// TabBar mockado - será implementado conforme necessário
const TabBar = ({ activeTabId, tabs, onCloseTab, onTabChange }) => (
  <div className="flex gap-2 border-b px-4 py-2 bg-background/50">
    {tabs.map(tab => (
      <button 
        key={tab.id}
        onClick={() => onTabChange?.(tab.id)}
        className={`px-3 py-1 text-sm rounded ${activeTabId === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
      >
        {tab.label || tab.title}
      </button>
    ))}
  </div>
); 

export function MainStage() {
  const { tabs, activeTabId, closeTab } = useWorkspaceStore();
  
  // Recupera a aba ativa baseada no ID armazenado na Store
  const activeTab = tabs.find(t => t.id === activeTabId);

  const renderContent = () => {
    // 1. Estado Vazio (Zero State) - O Vazio Wabi-Sabi
    if (!activeTab) {
      return (
        <div className="h-full w-full flex items-center justify-center text-muted-foreground/30 flex-col gap-4">
            <div className="w-20 h-20 text-primary/20 animate-pulse">
                <IconVoid className="w-full h-full" /> {/* IconVoid [cite: 1352] */}
            </div>
            <p className="font-mono text-sm">O Vazio Fértil.</p>
            <p className="text-xs opacity-50">Cmd+K para iniciar.</p>
        </div>
      );
    }

    // 2. Switch de Vistas (A alma do IDE)
    switch (activeTab.type) {
      case VIEW_TYPES.DASHBOARD:
        return <DashboardView />;
      
      case VIEW_TYPES.PROJECT_CANVAS:
        // Exemplo: return <ProjectCanvasView projectId={activeTab.data.projectId} />;
        return <div className="p-10">Project Canvas Placeholder</div>;
      
      case VIEW_TYPES.CHAT_GENERAL:
         // Caso o usuário queira o chat maximizado
        return <div className="p-10">Chat General View Placeholder</div>;
        
      default:
        return (
          <div className="flex items-center justify-center h-full text-red-500 font-mono">
            [ERRO: Tipo de Vista Desconhecido: {activeTab.type}]
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      {/* Navegação de Abas (Topo) */}
      <TabBar 
        tabs={tabs} 
        activeId={activeTabId} 
        onClose={closeTab} 
      />
      
      {/* Área de Conteúdo (Corpo) */}
      <div className="flex-1 overflow-hidden relative">
        <React.Suspense fallback={<PranaLoader />}>
            {renderContent()}
        </React.Suspense>
      </div>
    </div>
  );
}
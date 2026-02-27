import React from "react";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";

/**
 * TabBar Component
 * Renderiza as abas abertas no workspace
 */
export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useWorkspaceStore();

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 bg-muted/30 border-b px-2 py-1 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            flex items-center gap-2 px-3 py-2 text-sm rounded-t
            cursor-pointer transition-colors
            ${activeTabId === tab.id
              ? 'bg-background border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="truncate">{tab.label || tab.name || "Sem título"}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="ml-1 hover:text-destructive transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

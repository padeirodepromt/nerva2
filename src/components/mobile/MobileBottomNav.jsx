/* src/components/mobile/MobileBottomNav.jsx
   desc: Barra de navegação inferior estilo Floating Dock.
*/
import React from 'react';
import { cn } from '@/lib/utils';
import { IconChat, IconCosmos, IconCheck, IconPlus } from '@/components/icons/PranaLandscapeIcons';

export default function MobileBottomNav({ activeTab, onTabChange, onQuickCreate }) {
  const tabs = [
    { id: 'ash', icon: IconChat, label: 'Ash' },
    { id: 'tasks', icon: IconCheck, label: 'Tarefas' },
    { id: 'spacer', isSpacer: true }, // Espaço para o FAB
    { id: 'calendar', icon: IconCosmos, label: 'Agenda' },
    { id: 'focus', icon: IconChat, label: 'Foco' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto relative h-16 bg-background/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-around px-2 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        {tabs.map((tab, idx) => {
          if (tab.isSpacer) return <div key="spacer" className="w-12" />;

          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground opacity-50"
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] uppercase tracking-tighter font-bold">{tab.label}</span>
            </button>
          );
        })}

        {/* FAB CENTRAL: Smart Create */}
        <button
          onClick={onQuickCreate}
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform border-4 border-background"
        >
          <IconPlus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
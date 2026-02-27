/* src/components/mobile/MobileDrawer.jsx
   desc: Menu lateral completo utilizando os ícones oficiais do Prana Desktop.
*/
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconChat, IconCheck, IconSettings, IconCronos, IconCosmos, IconPapyrus 
} from '@/components/icons/PranaLandscapeIcons';
import { PlanUsageIndicator } from '@/components/ui/PlanUsageIndicator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MobileDrawer({ open, onClose, onNavigate, user, notificationCount = 0 }) {
  const menuItems = [
    { id: 'ash', label: 'Ash Terminal', icon: IconChat, desc: 'Interface de Diálogo', badge: null },
    { id: 'tasks', label: 'Ações & Projetos', icon: IconCheck, desc: 'Foco e Gestão', badge: null },
    { id: 'planner', label: 'Planner Semanal', icon: IconCronos, desc: 'Estratégia', badge: null },
    { id: 'calendar', label: 'Calendário', icon: IconCosmos, desc: 'Agenda Temporal', badge: null },
    { id: 'inbox', label: 'Inbox', icon: IconPapyrus, desc: 'Captura de Ideias', badge: notificationCount > 0 ? notificationCount : null },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-[70] w-[85%] max-w-[360px] bg-background border-r border-white/5 shadow-2xl flex flex-col p-8"
          >
            {/* Header do Menu */}
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-white/5">
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-primary/20 p-0.5">
                  <AvatarImage src={user?.image} className="rounded-full" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight">{user?.name || "Operador"}</span>
                <span className="text-[9px] opacity-40 uppercase tracking-[0.2em] font-bold">Status: Ativo</span>
              </div>
            </div>

            {/* Itens de Navegação */}
            <div className="flex-1 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="w-full flex items-center gap-5 p-5 rounded-[28px] hover:bg-white/5 active:bg-white/10 transition-all text-left group border border-transparent hover:border-white/5 shadow-sm relative"
                >
                  <div className="p-3 rounded-2xl bg-primary/5 group-hover:bg-primary/20 transition-colors relative">
                    <item.icon className="w-6 h-6 text-primary" />
                    {item.badge && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-[9px] font-bold rounded-full">{item.badge}</span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-sm tracking-tight text-foreground/90">{item.label}</span>
                    <span className="text-[10px] opacity-30 font-medium">{item.desc}</span>
                  </div>
                </button>
              ))}
              
              {/* Indicador de Plano SaaS */}
              <div className="mt-4 pt-2">
                 <PlanUsageIndicator />
              </div>
            </div>

            {/* Rodapé do Menu removido: Configurações */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
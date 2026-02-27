/* src/components/layout/RealmSwitcher.jsx
   desc: Alternador de Universos (Realms) V10.
   feat: Implementação de Filtro Global com DNA de Planos do Config.
*/
import React from 'react';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Ícones Oficiais do Prana V10
import { 
    IconLayers, 
    IconTarget, 
    IconZap, 
    IconLock,
    IconChevronDown
} from '@/components/icons/PranaLandscapeIcons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const REALMS = [
    { 
        id: 'all', 
        label: 'Unificado', 
        desc: 'Consciência Integrada', 
        icon: IconLayers, 
        color: 'text-primary' 
    },
    { 
        id: 'professional', 
        label: 'Profissional', 
        desc: 'Foco e Carreira', 
        icon: IconTarget, 
        color: 'text-indigo-400' 
    },
    { 
        id: 'personal', 
        label: 'Pessoal', 
        desc: 'Vida e Hábitos', 
        icon: IconZap, 
        color: 'text-emerald-400' 
    },
];

export default function RealmSwitcher() {
    // [V10] Extraindo a função de checagem do cérebro
    const { activeRealmId, setActiveRealm, canUseRealms } = useWorkspaceStore();
    
    // Agora o componente não decide quem é premium, ele pergunta ao Store
    const isEnabled = canUseRealms();

    // Se o usuário não tem acesso à separação de Universos, não mostramos nada.
    // (Mantém a experiência unificada e silenciosa, sem vazamento de feature.)
    if (!isEnabled) return null;
    const activeRealm = REALMS.find(r => r.id === activeRealmId) || REALMS[0];

    const handleSwitch = (realmId) => {
        // Bloqueio dinâmico baseado no DNA do sistema
        if (!isEnabled && realmId !== 'all') {
            toast.info("Expanda sua Consciência", {
                description: "A separação de Universos (Realms) é uma exclusividade do plano ativo.",
                action: {
                    label: "Upgrade",
                    onClick: () => console.log("Navegar para upgrade")
                },
            });
            return;
        }
        
        setActiveRealm(realmId);
        toast.success(`Contexto: ${REALMS.find(r => r.id === realmId).label}`);
    };

    return (
        <div className="px-3 py-4 border-b border-white/5 bg-background/50">
            <DropdownMenu>
                <DropdownMenuTrigger className="w-full outline-none group">
                    <div className={cn(
                        "flex items-center justify-between p-2 rounded-2xl transition-all duration-300 border border-transparent",
                        "hover:bg-white/[0.04] hover:border-white/5 active:scale-[0.98]"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10 transition-colors",
                                isEnabled ? activeRealm.color : "text-zinc-500"
                            )}>
                                {isEnabled ? (
                                    <activeRealm.icon className="w-5 h-5" />
                                ) : (
                                    <IconLayers className="w-5 h-5" />
                                )}
                            </div>

                            <div className="text-left">
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-30 leading-none mb-1">
                                    {isEnabled ? "Universo Ativo" : "Consciência"}
                                </p>
                                <p className="text-xs font-bold text-zinc-200">
                                    {isEnabled ? activeRealm.label : "Unificada"}
                                </p>
                            </div>
                        </div>

                        <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                            {isEnabled ? (
                                <IconChevronDown className="w-3 h-3" />
                            ) : (
                                <IconLock className="w-3 h-3 text-zinc-600" />
                            )}
                        </div>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent 
                    className="w-64 bg-zinc-950/95 backdrop-blur-2xl border-white/10 rounded-[24px] shadow-2xl p-2 z-[110]"
                    align="start"
                >
                    <div className="px-3 py-2 mb-1">
                        <span className="text-[9px] uppercase font-black tracking-[0.2em] opacity-40">
                            Selecionar Contexto
                        </span>
                    </div>

                    {REALMS.map((realm) => (
                        <DropdownMenuItem
                            key={realm.id}
                            onClick={() => handleSwitch(realm.id)}
                            className={cn(
                                "flex items-center justify-between p-2 rounded-xl cursor-pointer mb-1 transition-all",
                                activeRealmId === realm.id ? "bg-primary/10 text-primary" : "hover:bg-white/5",
                                (!isEnabled && realm.id !== 'all') && "opacity-50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5",
                                    activeRealmId === realm.id ? realm.color : "text-zinc-500"
                                )}>
                                    <realm.icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">{realm.label}</span>
                                    <span className="text-[9px] opacity-40 leading-none">{realm.desc}</span>
                                </div>
                            </div>
                            
                            {!isEnabled && realm.id !== 'all' && (
                                <IconLock className="w-3 h-3 opacity-40" />
                            )}
                            
                            {activeRealmId === realm.id && isEnabled && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgb(var(--primary))]" />
                            )}
                        </DropdownMenuItem>
                    ))}

                    {!isEnabled && (
                        <>
                            <DropdownMenuSeparator className="bg-white/5 mx-2 my-2" />
                            <div className="px-2 pb-2">
                                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-3">
                                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-tight">
                                        Modo Multiverso
                                    </p>
                                    <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed">
                                        Desbloqueie a habilidade de separar mundos e manter o foco cirúrgico.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

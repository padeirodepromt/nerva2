/* src/components/smart/SmartCreationModal.jsx
   desc: Orquestrador de Criação Inteligente V10 (Neural OS).
   feat: Herança de Realm (Contexto Ativo), Detecção de Projeto e Transmutação de Tipo.
   design: Wabi-Sabi (Sutileza absoluta, foco no input, identificação por contexto).
*/
import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Entidades e Config
import { Project, Task, Checklist } from '@/api/entities';
import { detectTaskTemplate } from '@/components/forms/templates/templateConfig';

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Ícones Oficiais
import { 
    IconZap, IconCheck, IconTarget, IconX, 
    IconLoader2, IconCalendar, IconFileText, IconLayers 
} from '@/components/icons/PranaLandscapeIcons';

const ITEM_TYPES = [
    { value: 'task', label: 'Tarefa', icon: IconCheck, color: 'text-primary' },
    { value: 'thought', label: 'Pensamento', icon: IconZap, color: 'text-amber-400' },
    { value: 'project', label: 'Projeto', icon: IconTarget, color: 'text-rose-400' },
    { value: 'event', label: 'Evento', icon: IconCalendar, color: 'text-blue-400' },
    { value: 'document', label: 'Documento', icon: IconFileText, color: 'text-cyan-400' },
    { value: 'checklist', label: 'Checklist', icon: IconLayers, color: 'text-emerald-400' },
];

export default function SmartCreationModal() {
    const isMobile = useIsMobile();
    const {
        isSmartModalOpen,
        smartModalContext,
        closeSmartModal,
        openSmartModal,
        openPranaForm,
        activeRealmId // [V10] Puxando a consciência ativa
    } = useWorkspaceStore();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedType, setSelectedType] = useState('task');

    // 1. CARREGAMENTO E SINCRONIA DE ESTADO
    useEffect(() => {
        if (isSmartModalOpen) {
            setInput('');
            setSelectedType(determineItemType(smartModalContext));
            Project.list({ status: 'active' }).then(setProjects).catch(() => {});
        }
    }, [isSmartModalOpen, smartModalContext]);

    // 2. OUVINTE GLOBAL (Cmd+K)
    useEffect(() => {
        const handleOpen = (e) => {
            const ctx = e?.detail?.context ?? 'general';
            openSmartModal(ctx);
        };
        window.addEventListener('prana:open-smart-modal', handleOpen);
        return () => window.removeEventListener('prana:open-smart-modal', handleOpen);
    }, [openSmartModal]);

    // 3. LÓGICA DE CRIAÇÃO (O Core do Sankalpa)
    const handleCreate = async () => {
        if (!input.trim()) return;
        setIsLoading(true);

        try {
            const itemType = selectedType || 'task';
            
            // Detecção Inteligente de Projeto (#)
            let projectId = null;
            const normalizedInput = input.toLowerCase();
            const projectMatch = projects.find(p => normalizedInput.includes(`#${p.title.toLowerCase()}`) || normalizedInput.includes(p.title.toLowerCase()));
            
            if (projectMatch) {
                projectId = projectMatch.id;
            }

            // [V10] Lógica de Destino: 
            // Se o usuário está em um Realm específico, o item nasce lá.
            // Se está no 'all' (Unificado), o item nasce por padrão no 'personal'.
            const targetRealm = activeRealmId === 'all' ? 'personal' : activeRealmId;

            // Encaminha para o PranaFormModal com a herança de Realm
            openPranaForm({
                itemType: itemType,
                defaultValues: {
                    title: input.replace(/#[^\s]+/g, '').trim(),
                    project_id: projectId,
                    realmId: targetRealm // Injeção de Consciência
                }
            });

            closeSmartModal();
        } catch (error) {
            console.error("[SmartCreation] Erro:", error);
            toast.error("Erro ao processar captura.");
        } finally {
            setIsLoading(false);
        }
    };

    const determineItemType = (ctx) => {
        const map = { spark: 'thought', thought: 'thought', project: 'project', doc: 'document', checklist: 'checklist' };
        return map[ctx] || 'task';
    };

    const placeholders = {
        task: "O que fazer? ex: 'Ligar para João #Vendas'",
        project: "Nome do novo ciclo estratégico...",
        thought: "Capture um insight volátil...",
        event: "Título do evento temporal...",
        document: "Nome do novo arquivo neural...",
        checklist: "Algo simples para ticar?"
    };

    const renderContent = () => (
        <div className={cn("flex flex-col", isMobile ? "p-6 pb-12" : "p-4 space-y-4")}>
            
            {/* Seletor de Tipo */}
            {isMobile ? (
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mb-4 border-b border-white/5">
                    {ITEM_TYPES.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setSelectedType(t.value)}
                            className={cn(
                                "flex flex-col items-center gap-2 transition-all min-w-[70px]",
                                selectedType === t.value ? "scale-110" : "opacity-30"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                                selectedType === t.value ? "bg-primary/10 border-primary/40 shadow-glow" : "bg-white/5 border-transparent"
                            )}>
                                <t.icon className={cn("w-5 h-5", selectedType === t.value ? t.color : "text-foreground")} />
                            </div>
                            <span className="text-[9px] uppercase font-bold tracking-widest">{t.label}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-40 text-zinc-500">Manifestar:</span>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-[160px] h-8 bg-white/5 border-white/10 text-xs rounded-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl">
                                {ITEM_TYPES.map(t => (
                                    <SelectItem key={t.value} value={t.value} className="text-xs rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <t.icon className="w-3.5 h-3.5 opacity-60" />
                                            {t.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* [V10] Indicador Sutil de Destino */}
                    <div className="flex items-center gap-1.5 opacity-30">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            activeRealmId === 'professional' ? "bg-indigo-500" : "bg-emerald-500"
                        )} />
                        <span className="text-[9px] uppercase font-bold tracking-widest">
                            {activeRealmId === 'professional' ? 'Foco Profissional' : 'Fluxo Pessoal'}
                        </span>
                    </div>
                </div>
            )}

            {/* Input de Captura Principal */}
            <div className="flex items-center gap-4 relative px-2">
                {!isMobile && (
                    <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl">
                        <IconZap className={cn(
                            "w-6 h-6 transition-colors duration-500",
                            activeRealmId === 'professional' ? "text-indigo-400" : "text-emerald-400"
                        )} />
                    </div>
                )}
                <div className="flex-1 relative">
                    <Input 
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        placeholder={placeholders[selectedType] || placeholders.task}
                        className={cn(
                            "bg-transparent border-none focus-visible:ring-0 p-0 placeholder:text-zinc-700",
                            isMobile ? "text-xl font-serif" : "text-2xl font-serif italic text-zinc-200"
                        )}
                    />
                    {isLoading && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <IconLoader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            </div>

            {/* Hint bar */}
            <div className="mt-8 flex justify-between items-center opacity-30 px-2 border-t border-white/5 pt-4">
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-500">
                    {isMobile ? "Arraste para baixo para cancelar" : "ESC para sair • ENTER para manifestar"}
                </span>
                {!isMobile && (
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="px-1.5 py-0.5 rounded border border-white/10 text-[8px] font-mono">#</div>
                            <span className="text-[8px] uppercase font-bold tracking-tighter">Vincular Projeto</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <button type="button" onClick={(e) => e.stopPropagation()}>
                <Drawer open={isSmartModalOpen} onOpenChange={(open) => !open && closeSmartModal()}>
                    <DrawerContent 
                        className="bg-zinc-950/95 backdrop-blur-3xl border-t border-white/10 rounded-t-[40px] z-[100] outline-none shadow-2xl"
                        style={{ maxWidth: '460px', width: '100%', margin: '0 auto' }}
                    >
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mt-4 mb-2" />
                        <DrawerHeader className="sr-only">
                            <DrawerTitle>Smart Capture</DrawerTitle>
                        </DrawerHeader>
                        <div className="max-h-[80vh] overflow-y-auto">
                            {renderContent()}
                        </div>
                    </DrawerContent>
                </Drawer>
            </button>
        );
    }

    return (
        <Dialog open={isSmartModalOpen} onOpenChange={closeSmartModal}>
            <DialogContent className="max-w-2xl bg-zinc-950/90 backdrop-blur-3xl border-white/5 shadow-2xl p-2 overflow-hidden rounded-[32px] z-[120]">
                <DialogHeader className="sr-only">
                    <DialogTitle>Prana Sankalpa</DialogTitle>
                </DialogHeader>
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
}
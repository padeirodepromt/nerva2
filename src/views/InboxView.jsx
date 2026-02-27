/* src/views/InboxView.jsx
   desc: Inbox Zero Hub V10.
   feat: Triagem de Faíscas, Pensamentos e Checklists com Poda Radical.
   mechanic: Exibição de progresso de listas e transmutação para o Core.
   status: INTEGRAL - SEM CORTES.
*/

import React, { useState, useEffect } from 'react';
import { 
    IconList, IconCheckCircle, IconTrash, IconZap, IconMessageSquare, 
    IconChevronRight, IconCircle, IconCheck, IconSparkles
} from '@/components/icons/PranaLandscapeIcons';
import { Task, Checklist, Thought } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import PranaLoader from '@/components/PranaLoader';
import PageHeader from '@/components/ui/PageHeader';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/components/LanguageProvider';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'; // [V10] Consciência de Realm

export default function InboxView({ isMobile = false }) {
    const { t } = useTranslations();
    const { activeRealmId } = useWorkspaceStore(); // Puxa o Realm ativo (Personal/Professional)
    const [items, setItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [swipedId, setSwipedId] = useState(null);
    const [touchStart, setTouchStart] = useState(0);

    // 1. CARREGAMENTO UNIFICADO COM PODA RADICAL
    const loadInbox = async () => {
        setLoading(true);
        try {
            // Filtramos todas as fontes pelo Realm Ativo para evitar ruído cognitivo
            const [inboxTasks, inboxChecklists, thoughts] = await Promise.all([
                Task.filter({ status: 'inbox', realmId: activeRealmId, deleted_at: null }),
                Checklist.list({ realmId: activeRealmId }), 
                Thought.list({ realmId: activeRealmId, status: 'seed' })
            ]);

            const combined = [
                ...inboxTasks.map(i => ({ ...i, entityType: 'task' })),
                ...inboxChecklists.map(i => ({ ...i, entityType: 'checklist' })),
                ...thoughts.map(i => ({ 
                    ...i, 
                    entityType: 'thought', 
                    title: i.title || i.content?.substring(0, 40) + "..." 
                }))
            ].sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));

            setItems(combined);
        } catch (e) {
            console.error("Inbox Critical Sync Error:", e);
            toast.error("Falha ao sincronizar o limbo neural.");
        } finally {
            setLoading(false);
        }
    };

    // Recarregar quando o Realm mudar ou houver refresh global
    useEffect(() => { 
        loadInbox();
        window.addEventListener('prana:refresh-explorer', loadInbox);
        return () => window.removeEventListener('prana:refresh-explorer', loadInbox);
    }, [activeRealmId]);

    // 2. LÓGICA DE PROMOÇÃO (Alquimia Transmutativa)
    const handlePromote = async (item) => {
        try {
            if (item.entityType === 'checklist') {
                await Checklist.promoteToTask(item.id);
                toast.success("Lista promovida a Tarefa Estruturada!");
            } else if (item.entityType === 'task') {
                await Task.update(item.id, { status: 'todo' });
                toast.success("Faísca agora é uma Ação.");
            } else if (item.entityType === 'thought') {
                // [V10] Transmutação direta via Controller
                await Thought.transmute(item.id, 'task');
                toast.success("Pensamento materializado.");
            }
            setItems(prev => prev.filter(i => i.id !== item.id));
        } catch (e) {
            toast.error("Erro na transmutação neural.");
        }
    };

    const handleDelete = async (item) => {
        try {
            const entity = item.entityType === 'task' ? Task : (item.entityType === 'checklist' ? Checklist : Thought);
            await entity.delete(item.id);
            setItems(prev => prev.filter(i => i.id !== item.id));
            toast.success("Item removido do fluxo.");
        } catch (e) { toast.error("Erro ao deletar."); }
    };

    // 3. COMPONENTES DE INTERFACE INTERNOS
    
    const ChecklistProgress = ({ items = [] }) => {
        if (!items || items.length === 0) return null;
        const total = items.length;
        const done = items.filter(i => i.done).length;
        const percent = (done / total) * 100;

        return (
            <div className="mt-2 space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter opacity-40">
                    <span>{done} / {total} itens concluídos</span>
                    <span>{Math.round(percent)}%</span>
                </div>
                <Progress value={percent} className="h-1 bg-white/5" />
            </div>
        );
    };

    const ItemCard = ({ item }) => {
        const isChecklist = item.entityType === 'checklist';
        const isThought = item.entityType === 'thought';

        return (
            <div className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-primary/30 transition-all hover:bg-white/[0.04] shadow-lg">
                <div className="flex items-start gap-4">
                    {/* Ícone de Identidade V10 */}
                    <div className="mt-1">
                        {isChecklist ? (
                            <IconList className="w-5 h-5 text-emerald-400" />
                        ) : isThought ? (
                            <IconMessageSquare className="w-5 h-5 text-amber-400" />
                        ) : (
                            <IconZap className="w-5 h-5 text-indigo-400 animate-pulse" />
                        )}
                    </div>

                    {/* Conteúdo do Item */}
                    <div className="flex-1 min-w-0">
                        <h3 className={cn(
                            "text-sm font-medium leading-tight transition-colors",
                            isThought ? "italic font-serif text-zinc-400" : "text-zinc-100 group-hover:text-white"
                        )}>
                            {item.title || item.content}
                        </h3>
                        
                        {/* Progresso Dinâmico para Checklists */}
                        {isChecklist && <ChecklistProgress items={item.items} />}

                        <div className="flex items-center gap-3 mt-3">
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5",
                                isThought ? "text-amber-500/50" : "text-zinc-500"
                            )}>
                                {item.entityType}
                            </span>
                            {item.projectId && (
                                <span className="text-[8px] font-bold text-primary/60 flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-current" /> {item.projectTitle || "PROJETO VINCULADO"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ações de Triagem */}
                    <div className="flex flex-col gap-2">
                        <Button 
                            variant="ghost" size="icon"
                            onClick={() => handlePromote(item)}
                            className="h-9 w-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-glow-sm"
                            title="Promover / Transmutar"
                        >
                            <IconZap className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" size="icon"
                            onClick={() => handleDelete(item)}
                            className="h-9 w-9 rounded-xl hover:bg-red-500/20 text-zinc-600 hover:text-red-400 transition-colors"
                            title="Descartar"
                        >
                            <IconTrash className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // 4. RENDERIZAÇÃO DA PÁGINA
    if (loading) return <PranaLoader text="Sincronizando o limbo neural..." />;

    return (
        <div className="flex flex-col h-full bg-background text-foreground overflow-y-auto no-scrollbar">
            {!isMobile ? (
                <PageHeader
                    icon={IconZap}
                    title="Inbox Zero"
                    subtitle={`Processando fluxo no universo ${activeRealmId.toUpperCase()}. Triagem e transmutação.`}
                />
            ) : (
                <div className="px-6 py-6 border-b border-white/5 flex justify-between items-end">
                    <div>
                        <h1 className="font-serif text-2xl font-bold italic tracking-tighter">Inbox</h1>
                        <p className="text-[10px] uppercase font-black tracking-widest text-primary mt-1">{activeRealmId}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-serif italic text-white/80">{items.length}</span>
                        <span className="text-[9px] block font-black opacity-20 uppercase">Capturas</span>
                    </div>
                </div>
            )}

            <div className={cn("flex-1", isMobile ? "p-4" : "p-10")}>
                {items.length === 0 ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center opacity-20 text-center gap-4">
                        <IconCheckCircle className="w-20 h-20 text-emerald-500" />
                        <div>
                            <h2 className="text-xl font-serif italic">Espaço Mental Livre</h2>
                            <p className="text-xs uppercase font-bold tracking-widest mt-1">Nenhuma pendência no limbo</p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(item => (
                            <ItemCard key={`${item.entityType}-${item.id}`} item={item} />
                        ))}
                    </div>
                )}
            </div>

            {/* Rodapé Protocolo V10 */}
            <div className="p-8 text-center opacity-10">
                <p className="text-[8px] uppercase font-black tracking-[0.5em]">Prana Neural Protocol • Inbox Triange • Realm: {activeRealmId}</p>
            </div>
        </div>
    );
}
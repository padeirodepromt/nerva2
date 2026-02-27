/* src/components/tasks/TaskWorkspaceOverlay.jsx
   desc: Modal Mestre V2.3 (Neural OS Aware).
   feat: Renderiza campos dinâmicos do projeto (incluindo Sankalpas) e Módulos.
   V10: Injeção de Switch de Realm desacoplado via canUseRealms.
   Integridade: 100% mantida.
*/
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { IconFogo, IconX, IconSettings } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/useChatStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'; 
import { Papyrus } from '@/api/papyrus';
import { FileTaskAssociationAPI } from '@/api/fileTaskAssociationAPI';
import { Task } from '@/api/entities'; 
import { cn } from '@/lib/utils';

// Componentes Internos
import StandardTaskForm from '@/components/forms/templates/StandardTaskForm';
import { detectTaskTemplate } from '@/components/forms/templates/templateConfig';
import { getModuleComponent } from '@/config/moduleRegistry';

// [V8/V10] Componentes Dinâmicos (Agora suporta o tipo 'sankalpa')
import { DynamicFieldCell } from '@/components/sheet/DynamicFieldCell';

export default function TaskWorkspaceOverlay({ isOpen, onClose, taskData, customSchema = [] }) {
    const { setContext, clearContext } = useChatStore();
    
    // [V10] - Consumindo permissão desacoplada do Store
    const { canUseRealms } = useWorkspaceStore(); 
    
    // 1. Detecta o Template de Fluxo (Craft vs Action)
    const template = useMemo(() => detectTaskTemplate(taskData), [taskData]);

    // 2. Estados de Layout e Dados
    const [layoutMode, setLayoutMode] = useState('split');
    const [linkedFile, setLinkedFile] = useState(null);
    const [currentRealm, setCurrentRealm] = useState(taskData?.realmId || 'personal');
    const [dynamicProperties, setDynamicProperties] = useState(taskData?.properties || {});

    // Sincronização de dados externos
    useEffect(() => {
        if (taskData?.properties) setDynamicProperties(taskData.properties);
        if (taskData?.realmId) setCurrentRealm(taskData.realmId);
    }, [taskData]);

    useEffect(() => {
        if (isOpen && template) {
            setLayoutMode(template.viewMode === 'focus' ? 'single' : 'split');
        }
    }, [isOpen, template]);

    // Carregar arquivo vinculado (Papyrus Integration)
    useEffect(() => {
        if (isOpen && taskData?.fileId) {
            Papyrus.get(taskData.fileId)
                .then(file => setLinkedFile(file))
                .catch(err => console.error('Erro ao carregar arquivo:', err));
        } else {
            setLinkedFile(null);
        }
    }, [isOpen, taskData?.fileId]);

    // 3. Renderização de Módulo Especializado (ex: Editor, Canvas, Financeiro)
    const ActiveModule = getModuleComponent(template?.workspace_module);

    // [V10] Injeção de Contexto no Ash (O Ash passa a ver o Realm e o Sankalpa)
    useEffect(() => {
        if (isOpen && taskData) {
            setContext({
                type: 'task',
                id: taskData.id,
                title: taskData.title,
                content: taskData.description,
                data: { 
                    files: taskData.linkedFiles || [], 
                    template: template?.id, 
                    realmId: currentRealm,
                    // Passa o Sankalpa vinculado se ele existir nas propriedades dinâmicas
                    sankalpaId: dynamicProperties?.sankalpa_id || null 
                }
            });
        } else {
            clearContext();
        }
        return () => clearContext();
    }, [isOpen, taskData, setContext, clearContext, template, currentRealm, dynamicProperties]);

    // [V10] Handler de Transmutação de Universo (Protegido por canUseRealms)
    const handleRealmChange = async (newRealm) => {
        if (!canUseRealms()) {
            toast.error("Seu plano atual não permite transmutação de universos.");
            return;
        }
        try {
            setCurrentRealm(newRealm);
            await Task.update(taskData.id, { realmId: newRealm });
            window.dispatchEvent(new CustomEvent('taskUpdated', { detail: { id: taskData.id, realmId: newRealm } }));
            toast.success(`Tarefa transmutada para o Universo ${newRealm === 'professional' ? 'Profissional' : 'Pessoal'}.`);
        } catch (e) {
            toast.error("Falha na sintonização dimensional.");
        }
    };

    // [V8/V10] Salvamento de Propriedades Dinâmicas (Incluindo o novo Seletor de Sankalpa)
    const handleDynamicUpdate = async (id, payload) => {
        try {
            await Task.update(id, payload);
            
            if (payload.properties) {
                setDynamicProperties(prev => ({ ...prev, ...payload.properties }));
            }
            
            // Notifica o Grid/Kanban/Planner para refletir a mudança
            const event = new CustomEvent('taskUpdated', { detail: { id, ...payload } });
            window.dispatchEvent(event);
            
            toast.success('Propriedade sincronizada.');
        } catch (e) {
            toast.error('Erro ao salvar propriedade.');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
            >
                {/* Lâmina do Workspace (Wabi-Sabi Design) */}
                <div className="w-full max-w-[85vw] h-full bg-background border-l border-white/5 shadow-2xl flex flex-col relative overflow-hidden">
                    
                    {/* Header: O Leme da Tarefa */}
                    <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] backdrop-blur-md z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Workspace</span>
                            <span className="text-white/10">/</span>
                            <span className="text-sm font-serif italic text-white/80 max-w-[250px] truncate">{taskData?.title || 'Nova Tarefa'}</span>

                            {/* [V10] Realm Switcher (Aparece apenas se permitido) */}
                            {canUseRealms() && (
                                <div className="ml-6 flex items-center gap-4 border-l border-white/5 pl-6">
                                    <button 
                                        onClick={() => handleRealmChange('professional')}
                                        className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                                            currentRealm === 'professional' ? "text-indigo-400" : "text-zinc-600 hover:text-zinc-400"
                                        )}
                                    >
                                        Profissional
                                    </button>
                                    <button 
                                        onClick={() => handleRealmChange('personal')}
                                        className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                                            currentRealm === 'personal' ? "text-emerald-400" : "text-zinc-600 hover:text-zinc-400"
                                        )}
                                    >
                                        Pessoal
                                    </button>
                                </div>
                            )}
                            
                            <div className="ml-4 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] text-zinc-500 flex items-center gap-1.5 uppercase font-bold tracking-tighter">
                                {template?.icon && <template.icon className="w-3 h-3 opacity-40" />}
                                {template?.label}
                                <span className="text-white/10">|</span>
                                <span className={template?.viewMode === 'focus' ? "text-purple-400/70" : "text-blue-400/70"}>
                                    {template?.viewMode === 'focus' ? 'Craft' : 'Action'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setLayoutMode(prev => prev === 'single' ? 'split' : 'single')} 
                                className={cn("h-8 w-8 p-0 hover:bg-white/5", layoutMode === 'single' && "bg-white/10 text-indigo-400")}
                            >
                                <IconFogo className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400">
                                <IconX className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Área de Trabalho */}
                    <div className="flex-1 flex overflow-hidden">
                        
                        {/* LADO ESQUERDO: Metadados e Campos Dinâmicos (Sankalpa aqui) */}
                        <div 
                            className={cn(
                                "flex-1 overflow-y-auto border-r border-white/5 custom-scrollbar transition-all duration-500 ease-in-out bg-black/10",
                                layoutMode === 'split' ? 'max-w-[45%] opacity-100' : 'max-w-[0%] opacity-0 border-none'
                            )}
                        >
                            <div className="p-8 pb-24 space-y-8">
                                <StandardTaskForm 
                                    initialData={taskData} 
                                    onSave={(updatedData) => {
                                        window.dispatchEvent(new CustomEvent('taskUpdated', { detail: updatedData }));
                                        toast.success('Núcleo da tarefa atualizado');
                                    }}
                                    onCancel={onClose}
                                />

                                {/* [V8/V10] Seção de Atributos do Projeto (Poda Radical Ativa) */}
                                {customSchema && customSchema.length > 0 && (
                                    <div className="pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                        <div className="flex items-center gap-2 mb-6 opacity-30">
                                            <IconSettings className="w-3.5 h-3.5" />
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Atributos Dimensionais</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-white/[0.01] p-6 rounded-3xl border border-white/5">
                                            {customSchema.map(field => {
                                                // Proteção contra duplicação de campos core
                                                if (['title', 'status', 'priority', 'dueDate', 'assignee'].includes(field.key)) return null;

                                                const currentValue = dynamicProperties[field.key];

                                                return (
                                                    <div key={field.key} className={field.type === 'text' || field.type === 'url' ? 'col-span-2' : 'col-span-1'}>
                                                        <label className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2 block font-bold ml-1">
                                                            {field.label}
                                                        </label>
                                                        <div className="h-10 px-1 bg-white/[0.02] border border-white/5 rounded-xl flex items-center hover:border-white/10 transition-colors">
                                                            <DynamicFieldCell 
                                                                item={{ id: taskData.id, properties: dynamicProperties }}
                                                                field={field}
                                                                value={currentValue}
                                                                onUpdate={handleDynamicUpdate}
                                                                placeholder="Definir..."
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* LADO DIREITO: O Módulo de Foco (Canvas, Doc, Financeiro) */}
                        <div className="flex-1 bg-zinc-950/20 flex flex-col overflow-hidden relative">
                             {layoutMode === 'single' && (
                                <div className="absolute top-4 left-4 z-20">
                                     <Button 
                                         size="xs" variant="outline" 
                                         onClick={() => setLayoutMode('split')}
                                         className="bg-black/60 backdrop-blur text-[9px] h-7 border-white/10 rounded-full px-4 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all font-black uppercase tracking-widest"
                                     >
                                         Sair do Foco
                                     </Button>
                                </div>
                             )}

                            <div className="flex-1 overflow-hidden flex flex-col">
                                {/* Barra de Associação de Arquivos */}
                                {linkedFile && (
                                    <div className="border-b border-white/5 bg-indigo-500/[0.02] p-4 shrink-0 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                <IconSettings className="w-4 h-4 text-indigo-400 opacity-60" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black tracking-tighter text-zinc-500">Arquivo Vinculado</p>
                                                <p className="text-sm font-medium text-white/80">{linkedFile.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => window.open(`/doc/${linkedFile.id}`, '_blank')} className="text-[10px] h-8 rounded-lg bg-white/5 border border-white/5">
                                                Abrir
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={async () => {
                                                try {
                                                    await FileTaskAssociationAPI.dissociateFileFromTask(taskData.id, linkedFile.id);
                                                    setLinkedFile(null);
                                                    toast.success('Conexão removida');
                                                } catch (e) { toast.error('Erro ao desvincular'); }
                                            }} className="text-[10px] h-8 rounded-lg text-zinc-500 hover:text-red-400">
                                                Desvincular
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Renderização Dinâmica do Módulo */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                    {ActiveModule ? (
                                        <ActiveModule task={taskData} onSave={(data) => console.log("Module saved:", data)} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-700 gap-4">
                                            <div className="p-4 rounded-full bg-white/5 border border-white/5">
                                                <IconBox className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p className="text-[10px] uppercase font-black tracking-[0.3em]">Pure Action Mode</p>
                                            <Button variant="ghost" onClick={() => setLayoutMode('split')} className="text-xs text-indigo-400/60">Ver Metadados</Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// IconBox fallback
const IconBox = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zM9 12h6M12 9v6" />
    </svg>
);
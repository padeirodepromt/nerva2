/* src/components/forms/templates/StandardTaskForm.jsx
   desc: Formulário Inteligente V7.
   updates: Renderização dinâmica de campos baseada no Template Schema (customData).
*/
import React, { useState, useEffect } from 'react';
import { 
    IconZap, IconList, IconLink, IconCalendar, IconClock, IconFlux, IconTarget, IconSoul, IconAlert, IconHash, IconRefreshCcw,
} from '@/components/icons/PranaLandscapeIcons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; 
import { toast } from "sonner";

// Componentes Internos
import ChecklistEditor from '../ChecklistEditor';
import AttachmentUploader from '../AttachmentUploader';
import TaskConnectionManager from '../TaskConnectionManager';
import HierarchicalProjectSelector from '../HierarchicalProjectSelector';
import TaskTimer from '@/components/tools/TaskTimer'; 
import { Task, Project, Collab } from '@/api/entities';
import { useAuth } from '@/hooks/useAuth';

// Configuração Segura
import { detectTaskTemplate } from './templateConfig'; 

export default function StandardTaskForm({ initialData = {}, onSave, onCancel }) {
    const { user } = useAuth();
    const [projectContext, setProjectContext] = useState(null); 
    
    // Estado Principal
    const [formData, setFormData] = useState({
        title: '', description: '', 
        status: 'todo', priority: 'medium', 
        dueDate: '', estimatedHours: '', 
        recurrence: 'none',
        tags: [],
        energyTags: [], energy_level: 'medium',
        assignee_id: user?.id || '',
        checklist: [], attachments: [], links: [], connections: [], 
        customData: {}, // Onde moram as variáveis dinâmicas (Branch, Version, etc)
        project_id: null,
        plannerDay: '', plannerTime: ''
    });
    
    const [tagInput, setTagInput] = useState('');
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);

    // Detecta o Template Atual para saber quais campos desenhar
    const currentTemplate = detectTaskTemplate(formData);

    // Carrega Membros do Time quando Projeto muda
    useEffect(() => {
        const loadMembers = async () => {
            if (formData.project_id) {
               try {
                   // Tenta buscar membros do projeto/time
                   const members = await Collab.getTeamMembers({ projectId: formData.project_id });
                   setTeamMembers(members);
               } catch (e) {
                   console.error("Erro ao carregar time:", e);
                   setTeamMembers([]);
               }
            } else {
                setTeamMembers([]);
            }
        };
        loadMembers();
    }, [formData.project_id]);

    // Hidratação Inicial
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                dueDate: initialData.due_date || initialData.dueDate || '',
                project_id: initialData.project_id || initialData.projectId || null,
                tags: initialData.tags || [],
                recurrence: initialData.recurrence || 'none',
                energy_level: initialData.energy_level || 'medium',
                assignee_id: initialData.assignee_id || user?.id || '',
                plannerDay: initialData.plannerSlot?.day || '',
                plannerTime: initialData.plannerSlot?.time || '',
                customData: initialData.customData || {}
            }));

            if (initialData.project_id) {
                Project.get(initialData.project_id).then(proj => {
                    setProjectContext(proj); 
                });
            }
        }
    }, [initialData, user]);

    // Helpers de Atualização
    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
    
    const updateCustomData = (key, value) => {
        setFormData(prev => ({
            ...prev,
            customData: {
                ...prev.customData,
                [key]: value
            }
        }));
    };

    // Gestão de Tags
    const handleAddTag = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().replace('#', '');
            if (!formData.tags.includes(newTag)) updateField('tags', [...formData.tags, newTag]);
            setTagInput('');
        }
    };
    const removeTag = (tag) => updateField('tags', formData.tags.filter(t => t !== tag));

    // Salvar
    const handleSubmit = async () => {
        if (!formData.title.trim()) return toast.error("Título é obrigatório");
        setIsLoading(true);
        try {
            let plannerSlot = null;
            if (formData.plannerDay && formData.plannerTime) {
                plannerSlot = { day: formData.plannerDay, time: formData.plannerTime };
            }

            const payload = {
                ...formData,
                due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
                plannerSlot: plannerSlot,
                templateId: currentTemplate.id, // Persiste o ID do template
                customData: formData.customData 
            };
            
            // Limpeza de campos auxiliares
            delete payload.plannerDay;
            delete payload.plannerTime;

            if (initialData.id) {
                await Task.update(initialData.id, payload);
                toast.success("Tarefa atualizada.");
            } else {
                await Task.create(payload);
                toast.success("Tarefa criada.");
            }
            if (onSave) onSave();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar tarefa.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* 1. CABEÇALHO DA TAREFA */}
            <div className="mb-4 flex items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <label className="text-xs uppercase tracking-wider opacity-50 block text-foreground">O que deve ser feito?</label>
                        {/* Badge do Template */}
                        <Badge variant="outline" className="text-[9px] h-4 px-1 border-white/10 text-[rgb(var(--accent-rgb))] flex items-center gap-1">
                            {currentTemplate.icon && <currentTemplate.icon className="w-3 h-3" />}
                            {currentTemplate.label}
                        </Badge>
                    </div>
                    <Input 
                        value={formData.title} 
                        onChange={e => updateField('title', e.target.value)}
                        className="w-full bg-background/20 border-border/20 rounded-xl p-4 text-lg focus-visible:ring-primary font-serif" 
                        placeholder="Nome da tarefa..." 
                        autoFocus={!initialData.id}
                    />
                </div>
                {initialData.id && (
                    <div className="mt-6">
                        <TaskTimer taskId={initialData.id} taskTitle={formData.title} />
                    </div>
                )}
            </div>

            {/* 2. CONTEXTO DO PROJETO (Somente Leitura) */}
            {projectContext && (
                <div className="mb-6 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-2">
                        <IconTarget className="w-3 h-3" /> Contexto: {projectContext.title || projectContext.name}
                    </div>
                    {/* Renderiza variáveis do projeto se existirem */}
                    {projectContext.customData && Object.keys(projectContext.customData).length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(projectContext.customData).map(([key, val]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="text-[9px] uppercase text-muted-foreground">{key}</span>
                                    <span className="text-xs text-white font-mono">{val}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-muted-foreground italic">Sem variáveis de ambiente definidas.</div>
                    )}
                </div>
            )}

            {/* 3. CAMPOS ESPECÍFICOS DO TEMPLATE (DYNAMIC SCHEMA) */}
            {currentTemplate.schema && currentTemplate.schema.length > 0 && (
                <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--accent-rgb))] mb-3 block flex items-center gap-2">
                        <IconFlux className="w-3 h-3" /> Dados Específicos ({currentTemplate.label})
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentTemplate.schema.map((field) => (
                            <div key={field.key}>
                                <label className="text-[10px] uppercase opacity-70 mb-1 block flex items-center gap-1">
                                    {field.icon && <field.icon className="w-3 h-3 text-muted-foreground" />}
                                    {field.label}
                                </label>
                                
                                {field.type === 'select' ? (
                                    <Select 
                                        value={formData.customData?.[field.key] || ''} 
                                        onValueChange={(v) => updateCustomData(field.key, v)}
                                    >
                                        <SelectTrigger className="h-9 text-xs bg-black/40 border-white/10">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-white/10">
                                            {field.options.map(opt => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="relative">
                                        <Input 
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            value={formData.customData?.[field.key] || ''} 
                                            onChange={e => updateCustomData(field.key, e.target.value)}
                                            className="h-9 text-xs bg-black/40 border-white/10 pr-8"
                                            placeholder={field.placeholder || ''}
                                        />
                                        {field.suffix && (
                                            <span className="absolute right-3 top-2.5 text-[10px] text-muted-foreground">
                                                {field.suffix}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. METADADOS PADRÃO */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                    <label className="text-[10px] uppercase opacity-50 mb-1 block">Status</label>
                    <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                        <SelectTrigger className="h-8 text-xs bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value="todo">A Fazer</SelectItem>
                            <SelectItem value="doing">Em Progresso</SelectItem>
                            <SelectItem value="done" className="text-emerald-400">Concluído</SelectItem>
                            <SelectItem value="blocked" className="text-red-400">Bloqueado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-[10px] uppercase opacity-50 mb-1 block">Prioridade</label>
                    <Select value={formData.priority} onValueChange={(v) => updateField('priority', v)}>
                        <SelectTrigger className="h-8 text-xs bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value="high" className="text-red-400">Alta</SelectItem>
                            <SelectItem value="medium" className="text-amber-400">Média</SelectItem>
                            <SelectItem value="low" className="text-blue-400">Baixa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-[10px] uppercase opacity-50 mb-1 block flex items-center gap-1"><IconSoul className="w-3 h-3"/> Responsável</label>
                    <Select value={formData.assignee_id} onValueChange={(v) => updateField('assignee_id', v)}>
                        <SelectTrigger className="h-8 text-xs bg-black/20 border-white/10"><SelectValue placeholder="Eu" /></SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value={user?.id || 'me'}>Eu (Admin)</SelectItem>
                            <SelectItem value="ash">Ash (IA)</SelectItem>
                            {teamMembers
                                .filter(m => m.id !== user?.id) // Evita duplicar "Eu"
                                .map(member => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-[10px] uppercase opacity-50 mb-1 block flex items-center gap-1"><IconRefreshCcw className="w-3 h-3"/> Repetir</label>
                    <Select value={formData.recurrence} onValueChange={(v) => updateField('recurrence', v)}>
                        <SelectTrigger className="h-8 text-xs bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value="none">Nunca</SelectItem>
                            <SelectItem value="daily">Diariamente</SelectItem>
                            <SelectItem value="weekly">Semanalmente</SelectItem>
                            <SelectItem value="monthly">Mensalmente</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 5. ABAS */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                <TabsList className="w-full bg-muted/20 p-1 rounded-xl grid grid-cols-5 mb-4 border border-white/5">
                    <TabsTrigger value="general" className="text-xs">Geral</TabsTrigger>
                    <TabsTrigger value="energy" className="text-xs">Energia</TabsTrigger>
                    <TabsTrigger value="resources" className="text-xs">Recursos</TabsTrigger>
                    <TabsTrigger value="planning" className="text-xs">Plan</TabsTrigger>
                    <TabsTrigger value="connections" className="text-xs"><IconFlux className="w-3 h-3 mr-1"/>Fluxo</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
                    <TabsContent value="general" className="space-y-4 mt-0">
                        <div>
                             <label className="text-xs uppercase opacity-50 mb-1 block flex items-center gap-2">
                                <IconTarget className="w-3 h-3"/> Projeto / Contexto
                             </label>
                             <HierarchicalProjectSelector 
                                value={formData.project_id} 
                                onChange={(val) => updateField('project_id', val)}
                                placeholder="Selecione o Projeto..."
                             />
                        </div>
                        <div>
                            <label className="text-xs uppercase opacity-50 mb-1 block flex items-center gap-2"><IconHash className="w-3 h-3"/> Tags Gerais</label>
                            <div className="flex flex-wrap gap-2 p-2 bg-black/20 border border-white/10 rounded-lg min-h-[42px]">
                                {formData.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] bg-white/10 hover:bg-white/20 gap-1 pr-1">
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-red-400 ml-1"><IconAlert className="w-3 h-3 rotate-45" /></button>
                                    </Badge>
                                ))}
                                <input 
                                    className="bg-transparent outline-none text-xs flex-1 min-w-[80px] placeholder:text-muted-foreground/30"
                                    placeholder="Add tag (Enter)..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs uppercase opacity-50 mb-1 block">Descrição</label>
                            <Textarea 
                                value={formData.description || ''} 
                                onChange={e => updateField('description', e.target.value)}
                                rows={5}
                                className="w-full bg-background/20 border-border/20 rounded-lg p-3 text-sm resize-none focus-visible:ring-primary"
                                placeholder="Detalhes..."
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="energy" className="space-y-6 mt-0">
                        <div>
                            <label className="text-xs opacity-50 mb-2 block flex items-center gap-2">
                                <IconZap className="w-3 h-3 text-yellow-400"/> Nível de Energia
                            </label>
                            <Select value={formData.energy_level} onValueChange={(v) => updateField('energy_level', v)}>
                                <SelectTrigger className="bg-black/20 border-white/10"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-card border-white/10">
                                    <SelectItem value="high">Intensa (Foco)</SelectItem>
                                    <SelectItem value="medium">Normal</SelectItem>
                                    <SelectItem value="low">Leve (Automático)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs opacity-50 mb-2 block">Vibe</label>
                            <div className="flex flex-wrap gap-2">
                                {['Criativo', 'Admin', 'Social', 'Analítico'].map(tag => (
                                    <button 
                                        key={tag} type="button"
                                        onClick={() => {
                                            const current = formData.energyTags || [];
                                            updateField('energyTags', current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]);
                                        }} 
                                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${formData.energyTags?.includes(tag) ? 'bg-primary/20 border-primary text-primary' : 'border-border/20 text-muted-foreground hover:bg-white/5'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="resources" className="space-y-6 mt-0">
                        <div>
                            <label className="text-xs opacity-50 mb-2 block flex items-center gap-2"><IconList className="w-3 h-3"/> Checklist</label>
                            <ChecklistEditor items={formData.checklist} onChange={i => updateField('checklist', i)} />
                        </div>
                        <div className="pt-4 border-t border-border/10">
                            <label className="text-xs opacity-50 mb-2 block flex items-center gap-2"><IconLink className="w-3 h-3"/> Anexos</label>
                            <AttachmentUploader 
                                attachments={formData.attachments} links={formData.links} 
                                onAttachmentsChange={a => updateField('attachments', a)} onLinksChange={l => updateField('links', l)} 
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="planning" className="space-y-4 mt-0">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs opacity-50 mb-1 block flex items-center gap-2"><IconCalendar className="w-3 h-3"/> Data Limite</label>
                                <Input type="date" value={formData.dueDate} onChange={e => updateField('dueDate', e.target.value)} className="bg-background/20 border-border/20" />
                            </div>
                            <div>
                                <label className="text-xs opacity-50 mb-1 block flex items-center gap-2"><IconClock className="w-3 h-3"/> Estimativa (h)</label>
                                <Input type="number" step="0.5" value={formData.estimatedHours} onChange={e => updateField('estimatedHours', e.target.value)} className="bg-background/20 border-border/20" />
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block flex items-center gap-2">
                                <IconCalendar className="w-3 h-3 text-[rgb(var(--accent-rgb))]" /> Agendar na Semana
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase opacity-50 mb-1 block">Dia da Semana</label>
                                    <Select value={formData.plannerDay} onValueChange={(v) => updateField('plannerDay', v)}>
                                        <SelectTrigger className="bg-black/20 border-white/10 text-xs">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-white/10">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase opacity-50 mb-1 block">Horário</label>
                                    <Select value={formData.plannerTime} onValueChange={(v) => updateField('plannerTime', v)}>
                                        <SelectTrigger className="bg-black/20 border-white/10 text-xs">
                                            <SelectValue placeholder="--" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-white/10 max-h-[200px]">
                                            {Array.from({ length: 16 }, (_, i) => i + 6).map(h => (
                                                <SelectItem key={h} value={`${String(h).padStart(2,'0')}:00`}>
                                                    {String(h).padStart(2,'0')}:00
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="connections" className="space-y-4 mt-0">
                        <div className="p-4 bg-background/20 rounded-xl border border-border/10">
                            <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-primary">
                                <IconFlux className="w-4 h-4" /> Dependências
                            </h3>
                            <TaskConnectionManager 
                                currentTaskId={initialData.id}
                                connections={formData.connections}
                                onConnectionsChange={newConns => updateField('connections', newConns)}
                            />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
            
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border/10">
                <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]">
                    {isLoading ? "Salvando..." : "Salvar"}
                </Button>
            </div>
        </div>
    );
}
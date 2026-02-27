/* src/components/forms/templates/ProjectMasterForm.jsx
   desc: Formulário Mestre de Projetos V7.
   feat: Conectado ao templateConfig.js para renderizar variáveis de contexto (customData).
*/
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
    IconTarget, IconLayers, IconCheck, IconFlux, IconAlert, IconCode
} from '@/components/icons/PranaLandscapeIcons';
import { Project, User } from '@/api/entities';
import HierarchicalProjectSelector from '../HierarchicalProjectSelector';

// [IMPORTANTE] A Fonte de Verdade agora vem do Config Global
import { PROJECT_TEMPLATES } from './templateConfig';

export default function ProjectMasterForm({ initialData = {}, onSave, onCancel }) {
    // Estado do Formulário
    const [formData, setFormData] = useState({
        name: '', 
        description: '', 
        status: 'active', 
        parentId: null,
        templateId: 'software_dev', // Default seguro
        structure: [], // Mantido para compatibilidade futura com Fases
        customData: {} // [NOVO] Onde as variáveis (Stack, Repo) serão salvas
    });
    
    const [isLoading, setIsLoading] = useState(false);

    // Template Ativo (Calculado)
    const currentTemplate = PROJECT_TEMPLATES[formData.templateId] || Object.values(PROJECT_TEMPLATES)[0];

    // Hidratação (Carregar dados ao editar)
    useEffect(() => {
        if (initialData) {
            // Tenta detectar template pelo nome se não tiver metadados
            let detectedTemplate = 'software_dev';
            const title = (initialData.title || initialData.name || '').toLowerCase();
            
            // Lógica de inferência simples
            if (title.includes('conteúdo') || title.includes('instagram')) detectedTemplate = 'content_production';
            else if (title.includes('video') || title.includes('youtube')) detectedTemplate = 'video_production';

            setFormData(prev => ({
                ...prev,
                name: initialData.title || initialData.name || '',
                description: initialData.description || '',
                parentId: initialData.parentId || initialData.parent_id || null,
                status: initialData.status || 'active',
                // Carrega do banco ou usa a detecção
                templateId: initialData.metadata?.templateId || initialData.metadata?.archetype || detectedTemplate,
                // Carrega as variáveis salvas
                customData: initialData.customData || {},
                structure: initialData.structure || []
            }));
        }
    }, [initialData]);

    // Handlers
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

    const handleSubmit = async () => {
        if (!formData.name.trim()) return toast.error("Nome do projeto é obrigatório");
        
        setIsLoading(true);
        try {
            const user = await User.me().catch(() => ({ id: 'unknown', email: 'system' }));
            
            const payload = {
                title: formData.name,
                description: formData.description,
                status: formData.status,
                parentId: formData.parentId,
                created_by: user.id || user.email,
                
                // [CRÍTICO] Salvando os metadados do Template
                metadata: { 
                    templateId: formData.templateId,
                    archetype: formData.templateId // Retrocompatibilidade
                },
                
                // [CRÍTICO] Salvando as variáveis que o TaskCode vai ler depois
                customData: formData.customData,
                
                structure: formData.structure
            };

            let result;
            if (initialData.id) {
                result = await Project.update(initialData.id, payload);
                toast.success("Projeto atualizado e contextualizado.");
            } else {
                result = await Project.create(payload);
                toast.success("Projeto criado com sucesso.");
                // Dispara evento para atualizar listas
                window.dispatchEvent(new CustomEvent('prana:refresh-explorer', { 
                  detail: { itemType: 'project', projectId: result.id } 
                }));
            }

            if (onSave) onSave({ type: 'project', data: result }); 

        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar projeto.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="space-y-4">
                {/* 1. Nome do Projeto */}
                <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider opacity-50">Nome do Projeto</label>
                    <Input 
                        value={formData.name} onChange={e => updateField('name', e.target.value)}
                        className="text-2xl font-serif h-14 bg-white/5 border-white/10 focus-visible:ring-primary" 
                        autoFocus 
                        placeholder="Ex: Prana V4 ou Campanha Black Friday"
                    />
                </div>

                {/* 2. Hierarquia (Pai) */}
                <div className="space-y-1">
                    <label className="text-xs uppercase opacity-50 flex items-center gap-2">
                        <IconLayers className="w-3 h-3"/> Pertence a (Projeto Pai)
                    </label>
                    <HierarchicalProjectSelector 
                        value={formData.parentId} 
                        onChange={(val) => updateField('parentId', val)}
                        placeholder="Selecione se for um Subprojeto..."
                        excludeId={initialData.id}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 3. Seleção de Template (O Contexto) */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase opacity-50 flex items-center gap-2">
                            <IconTarget className="w-3 h-3"/> Tipo de Projeto (Contexto)
                        </label>
                        <Select 
                            value={formData.templateId} 
                            onValueChange={(v) => updateField('templateId', v)}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10 h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10">
                                {Object.values(PROJECT_TEMPLATES).map((tmpl) => (
                                    <SelectItem key={tmpl.id} value={tmpl.id}>
                                        <div className="flex items-center gap-2">
                                            {tmpl.icon && <tmpl.icon className="w-4 h-4 text-[rgb(var(--accent-rgb))]" />}
                                            <div className="flex flex-col text-left">
                                                <span className="font-medium">{tmpl.label}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {/* Info sobre o template */}
                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                            <IconCode className="w-3 h-3" />
                            Tarefas criadas aqui usarão por padrão: <span className="text-primary">{currentTemplate?.defaultTaskTemplate}</span>
                        </div>
                    </div>

                    {/* Descrição Simples */}
                    <div className="space-y-1">
                        <label className="text-xs uppercase opacity-50">Descrição</label>
                        <Input 
                            value={formData.description} 
                            onChange={e => updateField('description', e.target.value)} 
                            className="bg-white/5 border-white/10 h-10" 
                        />
                    </div>
                </div>
            </div>

            {/* 4. VARIÁVEIS DE CONTEXTO (DYNAMIC SCHEMA) */}
            {/* Aqui a mágica acontece: Lemos o schema do templateConfig e geramos os campos */}
            {currentTemplate?.variablesSchema && currentTemplate.variablesSchema.length > 0 ? (
                <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-[rgb(var(--accent-rgb))] flex items-center gap-2">
                            <IconFlux className="w-3 h-3" /> Variáveis de Ambiente
                        </span>
                        <span className="text-[10px] opacity-50">Defina os parâmetros globais deste projeto</span>
                    </div>
                    
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentTemplate.variablesSchema.map((field) => (
                            <div key={field.key} className="space-y-1">
                                <label className="text-[10px] uppercase opacity-70 block">
                                    {field.label}
                                </label>
                                
                                {field.type === 'select' ? (
                                    <Select 
                                        value={formData.customData?.[field.key] || ''} 
                                        onValueChange={(v) => updateCustomData(field.key, v)}
                                    >
                                        <SelectTrigger className="h-9 text-xs bg-white/5 border-white/10">
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-white/10">
                                            {field.options.map(opt => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input 
                                        value={formData.customData?.[field.key] || ''}
                                        onChange={(e) => updateCustomData(field.key, e.target.value)}
                                        className="h-9 text-xs bg-white/5 border-white/10 font-mono text-blue-300"
                                        placeholder={field.placeholder || ''}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-muted-foreground text-xs bg-white/[0.02]">
                    <IconAlert className="w-3 h-3 mr-2" />
                    Este template de projeto não requer variáveis globais.
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:brightness-110 text-white shadow-lg shadow-primary/20">
                    {isLoading ? "Salvando..." : (initialData.id ? "Salvar Alterações" : "Criar Projeto")}
                </Button>
            </div>
        </div>
    );
}
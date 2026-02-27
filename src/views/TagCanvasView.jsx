/* canvas: src/views/TagCanvasView.jsx */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    IconNexus, IconLayout, IconFolder, IconFileText
} from '@/components/icons/PranaLandscapeIcons';
import { useTranslations } from '@/components/LanguageProvider';
import { Project, Task, Document } from '@/api/entities';
import { Button } from '@/components/ui/button';
import PranaLoader from '@/components/PranaLoader';
import TaskNode from '@/components/dashboard/TaskNode';

export default function TagCanvasView({ tag }) {
    // Se a tag não vier via prop (uso em rota direta), tenta pegar da URL
    const params = useParams();
    const activeTag = tag || params.tag;
    const navigate = useNavigate();
    const { t } = useTranslations();

    const [items, setItems] = useState({ projects: [], tasks: [], docs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTagContext = async () => {
            if (!activeTag) return;
            setLoading(true);
            try {
                // Timeout de segurança de 5 segundos
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout carregando Tag Context')), 5000)
                );

                // Em um backend real, fariamos api.get(`/tags/${activeTag}/items`)
                // Aqui simulamos filtrando tudo (MVP)
                const [allProjects, allTasks, allDocs] = await Promise.race([
                    Promise.all([
                        Project.list({ status: 'active' }),
                        Task.list({ status: 'todo' }),
                        Document.list()
                    ]),
                    timeoutPromise
                ]);

                // Filtra localmente (Backend deve otimizar isso)
                const hasTag = (item) => {
                    if (!item.tags) return false;
                    // Suporta array de strings ou string JSON
                    const tags = Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || '[]');
                    return tags.some(t => t.toLowerCase() === activeTag.toLowerCase());
                };

                setItems({
                    projects: allProjects.filter(hasTag),
                    tasks: allTasks.filter(hasTag),
                    docs: allDocs.filter(hasTag)
                });

            } catch (e) {
                console.error("Erro ao carregar contexto da tag", e);
            } finally {
                setLoading(false);
            }
        };

        loadTagContext();
    }, [activeTag]);

    if (!activeTag) return <div className="flex items-center justify-center h-full opacity-30">{t('tag_canvas_no_tag')}</div>;
    if (loading) return <PranaLoader text={`${t('tag_canvas_loading')}${activeTag}...`} />;

    const totalItems = items.projects.length + items.tasks.length + items.docs.length;

    return (
        <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
            
            {/* --- HEADER DO CANVAS --- */}
            <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
                        <IconNexus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif text-white tracking-tight flex items-center gap-2">
                            {activeTag}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
                            {t('tag_canvas_virtual_context')} • {totalItems} {t('tag_canvas_items')}
                        </p>
                    </div>
                </div>
            </header>

            {/* --- ÁREA DE CONTEÚDO (GRID) --- */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                
                {/* 1. PROJETOS COM A TAG */}
                {items.projects.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                            <IconFolder className="w-4 h-4" /> {t('tag_canvas_related_projects')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {items.projects.map(proj => (
                                <div 
                                    key={proj.id}
                                    onClick={() => navigate(`/projects/${proj.id}`)}
                                    className="group p-4 bg-card/50 border border-white/10 rounded-lg hover:border-primary/50 cursor-pointer transition-all hover:translate-x-1"
                                >
                                    <div className="flex items-center gap-3">
                                        <IconFolder className="w-5 h-5 text-blue-400 group-hover:text-primary transition-colors" />
                                        <span className="font-medium truncate text-sm text-gray-300 group-hover:text-white">
                                            {proj.title}
                                        </span>
                                    </div>
                                    {proj.description && <p className="text-xs text-gray-600 mt-2 line-clamp-2">{proj.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. TAREFAS COM A TAG */}
                {items.tasks.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                            <IconLayout className="w-4 h-4" /> {t('tag_canvas_tasks_actions')}
                        </h3>
                        <div className="flex flex-col gap-2">
                            {items.tasks.map(task => (
                                <TaskNode key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. DOCUMENTOS COM A TAG */}
                {items.docs.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                            <IconFileText className="w-4 h-4" /> {t('tag_canvas_knowledge_docs')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {items.docs.map(doc => (
                                <div key={doc.id} className="p-3 bg-card/50 border border-white/10 rounded flex items-center gap-3 hover:bg-white/5 cursor-pointer">
                                    <IconFileText className="w-4 h-4 text-amber-400" />
                                    <span className="text-sm truncate">{doc.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {totalItems === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <IconHash className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-lg">{t('tag_canvas_no_items')} #{activeTag}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
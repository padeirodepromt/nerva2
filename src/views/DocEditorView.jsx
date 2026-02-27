/* canvas: src/views/DocEditorView.jsx
   desc: Editor de Documentos Imersivo (Google Docs Killer).
   feat: Integração Real com Papyrus Controller, Autosave, UI Wabi-Sabi.
*/
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';
// Importação Real
import { Papyrus } from '@/api/papyrus'; 

import PapyrusEditor from '@/components/editor/PapyrusEditor';
import PranaLoader from '@/components/PranaLoader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiaryFieldsPanel } from '@/components/forms/document/DiaryFieldsPanel';
import FileTaskStatusPanel from '@/components/fileTask/FileTaskStatusPanel';
import { 
    IconFileText, IconSave, IconClock, IconMoreVertical, IconCheckCircle, IconCloud, IconAlertTriangle, IconChevronDown, IconChevronUp
} from '@/components/icons/PranaLandscapeIcons';

export default function DocEditorView({ docId }) {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    
    // Diary Fields State
    const [documentType, setDocumentType] = useState('note');
    const [energyLevel, setEnergyLevel] = useState(null);
    const [mood, setMood] = useState('');
    const [tags, setTags] = useState([]);
    const [insights, setInsights] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [showDiaryPanel, setShowDiaryPanel] = useState(false);
    const [fileTaskModalOpen, setFileTaskModalOpen] = useState(false);
    // Debounce Ref para evitar salvar a cada tecla
    const timeoutRef = useRef(null);

    // Carga Inicial
    useEffect(() => {
        const loadDoc = async () => {
            if (!docId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await Papyrus.get(docId);
                setDoc(data);
                setTitle(data.title || 'Sem Título');
                setLastSaved(new Date(data.updatedAt));
                
                // Load diary fields if they exist
                setDocumentType(data.documentType || 'note');
                setEnergyLevel(data.energyLevel || null);
                setMood(data.mood || '');
                setTags(data.tags ? (Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || '[]')) : []);
                setInsights(data.insights || '');
                setIsPrivate(data.isPrivate || false);
                
                // Auto-show diary panel if document is diary
                if (data.documentType === 'diary') {
                    setShowDiaryPanel(true);
                }
            } catch (e) {
                console.error(e);
                setError(t('doc_editor_error_not_found'));
                toast.error(t('doc_editor_error_loading'));
            } finally {
                setLoading(false);
            }
        };
        loadDoc();
    }, [docId]);

    // Função de Salvamento Real
    const saveDocument = async (currentContent, currentTitle) => {
        if (!docId || !user) return;
        setSaving(true);
        try {
            const updateData = {
                content: currentContent,
                title: currentTitle,
                userId: user.uid || user.id,
                changeLog: 'Autosave',
                documentType: documentType,
            };
            
            // Add diary fields if documentType is 'diary'
            if (documentType === 'diary') {
                updateData.energyLevel = energyLevel;
                updateData.mood = mood;
                updateData.tags = JSON.stringify(tags);
                updateData.insights = insights;
                updateData.isPrivate = isPrivate;
            }
            
            await Papyrus.update(docId, updateData);
            setLastSaved(new Date());
        } catch (e) {
            console.error("Autosave failed", e);
            toast.error(t('doc_editor_save_error'));
        } finally {
            // Delay cosmético para mostrar o ícone de "nuvem"
            setTimeout(() => setSaving(false), 500);
        }
    };

    // Handler de update do Editor (com Debounce de 2s)
    const handleContentUpdate = useCallback((newContent) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
            // Usa o título do estado atual no momento do save
            saveDocument(newContent, title); 
        }, 2000);
    }, [docId, user, title, documentType, energyLevel, mood, tags, insights, isPrivate]); // Depende de todos os campos

    // Handler de Título (Salva ao perder o foco ou Enter)
    const handleTitleBlur = () => {
        if(doc && (title !== doc.title)) {
            toast.info(t('doc_editor_title_updated'));
        }
    };

    if (loading) return <PranaLoader text={t('doc_editor_loading')} />;
    
    if (error) return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
            <IconAlertTriangle className="w-12 h-12 opacity-50" />
            <p>{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>{t('doc_editor_retry')}</Button>
        </div>
    );

    if (!doc) return null;

    return (
        <div className="flex flex-col h-full bg-background relative overflow-hidden">
            
            {/* 1. TOP BAR (Minimalista & Funcional) */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md shrink-0 z-20">
                <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground">
                        <IconFileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col flex-1 max-w-2xl">
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            className="bg-transparent border-none text-lg font-serif font-bold text-foreground focus:outline-none focus:ring-0 p-0 placeholder:text-muted-foreground/30 w-full truncate"
                            placeholder={t('doc_editor_no_title')}
                        />
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                            {saving ? (
                                <span className="flex items-center gap-1 text-[rgb(var(--accent-rgb))] animate-pulse">
                                    <IconCloud className="w-3 h-3" /> {t('doc_editor_saving')}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 opacity-50">
                                    <IconCheckCircle className="w-3 h-3" /> {t('doc_editor_saved_at')} {lastSaved?.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                                </span>
                            )}
                            <span className="opacity-30 mx-1">|</span>
                            <span className="opacity-50">v.{doc.currentVersion}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-muted-foreground hidden sm:flex">
                        {doc.status || t('doc_editor_draft')}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                        <IconMoreVertical className="w-4 h-4" />
                    </Button>
                     <Button className="glow-effect gap-2 px-4 h-9 text-xs uppercase tracking-widest font-bold">
                        {t('doc_editor_share')}
                    </Button>
                </div>
            </div>

            {/* 2. DIARY FIELDS PANEL (Collapsible) */}
            {(documentType === 'diary' || showDiaryPanel) && (
                <div className="border-b border-white/5 bg-black/30 p-4">
                    <button
                        onClick={() => setShowDiaryPanel(!showDiaryPanel)}
                        className="flex items-center gap-2 text-sm font-semibold text-purple-200 hover:text-purple-100 w-full p-2 rounded mb-2 hover:bg-white/5 transition-colors"
                    >
                        {showDiaryPanel ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                        📖 Campos do Diário
                    </button>
                    {showDiaryPanel && (
                        <DiaryFieldsPanel
                            documentType={documentType}
                            onDocumentTypeChange={(type) => {
                                setDocumentType(type);
                                if (type !== 'diary') {
                                    setShowDiaryPanel(false);
                                }
                            }}
                            energyLevel={energyLevel}
                            onEnergyChange={setEnergyLevel}
                            mood={mood}
                            onMoodChange={setMood}
                            tags={tags}
                            onTagsChange={setTags}
                            insights={insights}
                            onInsightsChange={setInsights}
                            isPrivate={isPrivate}
                            onPrivateChange={setIsPrivate}
                        />
                    )}
                </div>
            )}

            {/* 3. ÁREA DO EDITOR + SIDEBAR (Papel Digital + Tarefas) */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor (Main Area) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center bg-background cursor-text">
                    <div className="w-full max-w-4xl px-8 py-12 md:py-16 min-h-full bg-transparent">
                        {/* O Motor Tiptap */}
                        <PapyrusEditor 
                            initialContent={doc.content} 
                            onUpdate={handleContentUpdate} 
                        />
                    </div>
                </div>

                {/* Sidebar Direita - Tarefas do Arquivo */}
                <div className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-sm overflow-y-auto custom-scrollbar">
                    <div className="p-4 space-y-6">
                        <FileTaskStatusPanel 
                            docId={docId}
                            onTaskCreated={() => {
                                toast.success('Tarefa criada com sucesso!');
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
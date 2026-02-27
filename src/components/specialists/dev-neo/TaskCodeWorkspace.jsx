/* src/components/specialists/dev-neo/TaskCodeWorkspace.jsx
   desc: Módulo de Trabalho para Devs V10 (Code + Metadata).
   feat: Monaco Editor, Live Preview, GitHub Deploy, Propriedades Dinâmicas V8 e Integração Neo Diff (V10).
*/
import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { 
    IconCode, IconPlus, IconX, IconDiff, IconCheckCircle, IconPlay,
    IconSettings, IconLayout 
} from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { ensureRepoExists, pushToGitHub } from '@/api/services/githubService';
import { Task } from '@/api/entities'; 

// Componente de Campos Dinâmicos
import { DynamicFieldCell } from '@/components/sheet/DynamicFieldCell';

// [V10] Importação do visualizador de Diff e Revisão do Neo
import CodeDiffViewer from './CodeDiffViewer';

// --- COMPONENTE DE PREVIEW ---
const LivePreview = ({ files }) => {
    const iframeRef = useRef(null);

    const updatePreview = () => {
        const htmlFile = files.find(f => f.name.endsWith('.html'))?.content || '<div style="font-family: sans-serif; color: #666; text-align: center; margin-top: 20%;"><h1>Sem index.html</h1><p>Crie um arquivo HTML para começar.</p></div>';
        const cssFile = files.find(f => f.name.endsWith('.css'))?.content || '';
        const jsFile = files.find(f => f.name.endsWith('.js'))?.content || '';

        const srcDoc = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { margin: 0; padding: 0; box-sizing: border-box; }
                        ${cssFile}
                    </style>
                </head>
                <body>
                    ${htmlFile}
                    <script>
                        window.onerror = function(message, source, lineno, colno, error) {
                            const errorDiv = document.createElement('div');
                            errorDiv.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: #ffe0e0; color: #d32f2f; padding: 10px; font-family: monospace; font-size: 12px; border-top: 1px solid #ffcdd2; z-index: 9999;';
                            errorDiv.textContent = 'JS Error: ' + message;
                            document.body.appendChild(errorDiv);
                        };
                        try { ${jsFile} } catch (err) { console.error(err); }
                    </script>
                </body>
            </html>
        `;

        if (iframeRef.current) {
            iframeRef.current.srcdoc = srcDoc;
        }
    };

    useEffect(() => {
        const timer = setTimeout(updatePreview, 500);
        return () => clearTimeout(timer);
    }, [files]);

    return (
        <div className="flex-1 bg-white h-full relative flex flex-col">
            <div className="h-8 bg-gray-100 border-b flex items-center px-3 text-xs text-gray-500 shrink-0">
                <span className="flex items-center gap-1.5 mr-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500/20"/> 
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500/20"/> 
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-green-500/20"/>
                </span>
                <div className="flex-1 bg-white px-3 py-0.5 rounded border border-gray-200 shadow-sm text-center font-mono text-[10px] text-gray-400 select-all">
                    localhost:prana/preview/sandbox
                </div>
            </div>
            <iframe 
                ref={iframeRef}
                title="Prana Preview"
                className="flex-1 w-full border-none bg-white"
                sandbox="allow-scripts allow-modals"
            />
        </div>
    );
};

export default function TaskCodeWorkspace({ task, onSave, customSchema = [] }) {
    // Estado inicial dos arquivos
    const [files, setFiles] = useState(() => {
        if (task?.linkedFiles && task.linkedFiles.length > 0) return task.linkedFiles;
        return [
            { id: '1', name: 'index.html', language: 'html', content: '\n<div class="hero">\n  <h1>Prana V10</h1>\n  <p>Aguardando Neo...</p>\n</div>', isNew: false },
            { id: '2', name: 'style.css', language: 'css', content: '.hero {\n  text-align: center;\n  padding: 50px;\n  font-family: sans-serif;\n  color: #333;\n}', isNew: false },
            { id: '3', name: 'script.js', language: 'javascript', content: 'console.log("Prana Ready");', isNew: false }
        ];
    });
    
    const [activeTabId, setActiveTabId] = useState(files[0]?.id);
    const [viewMode, setViewMode] = useState('edit'); 
    
    // Controle do Painel de Propriedades
    const [showProperties, setShowProperties] = useState(false);
    const [dynamicProperties, setDynamicProperties] = useState(task?.properties || {});

    // Configurações do Deploy
    const [deployConfig, setDeployConfig] = useState({ 
        repoName: `prana-project-${Date.now().toString().slice(-4)}`, 
        commitMsg: 'Initial commit from Prana' 
    });
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStatus, setDeployStatus] = useState(null); 

    // --- MONACO CONFIG ---
    const monaco = useMonaco();
    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme('prana-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: { 'editor.background': '#1e1e1e' },
            });
        }
    }, [monaco]);

    // [V10] Auto-switch para o modo diff se houver código proposto pela IA
    const activeFile = files.find(f => f.id === activeTabId);
    useEffect(() => {
        if (activeFile?.proposedContent && viewMode === 'edit') {
            setViewMode('diff');
        }
    }, [activeFile?.proposedContent, viewMode]);

    // --- AÇÕES V10 (NEO REVIEW) ---
    const handleAcceptChanges = () => {
        setFiles(files.map(f => f.id === activeTabId ? { 
            ...f, 
            content: f.proposedContent, // O código novo substitui o velho
            proposedContent: null,
            telemetry: null 
        } : f));
        setViewMode('edit');
        toast.success("Cirurgia aplicada com sucesso.", { icon: <IconCheckCircle className="text-emerald-500" /> });
    };

    const handleRejectChanges = () => {
        setFiles(files.map(f => f.id === activeTabId ? { 
            ...f, 
            proposedContent: null,
            telemetry: null 
        } : f));
        setViewMode('edit');
        toast.info("Refatoração do Neo descartada.");
    };

    // --- AÇÕES DE ARQUIVO ---
    const handleAddFile = () => {
        const newFile = { id: `temp-${Date.now()}`, name: 'untitled.js', language: 'javascript', content: '// Code', isNew: true };
        setFiles([...files, newFile]);
        setActiveTabId(newFile.id);
        setViewMode('edit');
    };

    const handleCloseFile = (e, fileId) => {
        e.stopPropagation();
        const newFiles = files.filter(f => f.id !== fileId);
        setFiles(newFiles);
        if (activeTabId === fileId && newFiles.length > 0) setActiveTabId(newFiles[newFiles.length - 1].id);
    };

    const updateFileContent = (value) => {
        setFiles(files.map(f => f.id === activeTabId ? { ...f, content: value } : f));
    };

    const updateFileName = (newName) => {
        let language = 'javascript';
        if (newName.endsWith('.html')) language = 'html';
        else if (newName.endsWith('.css')) language = 'css';
        else if (newName.endsWith('.json')) language = 'json';
        setFiles(files.map(f => f.id === activeTabId ? { ...f, name: newName, language } : f));
    };

    const handleSaveFile = () => {
        if (activeFile) {
            if (onSave) onSave({ currentFile: activeFile, allFiles: files });
            toast.success(`Alterações salvas localmente.`);
            setFiles(files.map(f => f.id === activeTabId ? { ...f, isNew: false } : f));
        }
    };

    // Handler de Update Dinâmico
    const handleDynamicUpdate = async (id, payload) => {
        try {
            await Task.update(id, payload);
            if (payload.properties) {
                setDynamicProperties(prev => ({ ...prev, ...payload.properties }));
            }
            toast.success('Propriedade salva.');
        } catch (e) {
            toast.error('Erro ao salvar propriedade.');
        }
    };

    // --- DEPLOY REAL ---
    const handleDeploy = async () => {
        setIsDeploying(true);
        setDeployStatus(null);
        try {
            toast.loading("Verificando repositório...", { id: 'deploy-toast' });
            const { owner } = await ensureRepoExists(deployConfig.repoName, `Projeto Prana: ${task?.title || 'Sem título'}`);
            toast.loading("Enviando arquivos...", { id: 'deploy-toast' });
            await pushToGitHub(deployConfig.repoName, files, deployConfig.commitMsg);
            
            toast.success("Deploy Concluído!", { id: 'deploy-toast', description: `Enviado para ${owner}/${deployConfig.repoName}` });
            setDeployStatus('success');
        } catch (error) {
            console.error(error);
            toast.error("Falha no Deploy", { id: 'deploy-toast', description: error.message });
            setDeployStatus('error');
        } finally {
            setIsDeploying(false);
        }
    };

    const getFileIcon = (fileName) => {
        if (fileName.endsWith('.html')) return <IconCode className="w-3 h-3 text-orange-500" />;
        if (fileName.endsWith('.css')) return <IconCode className="w-3 h-3 text-blue-400" />;
        if (fileName.endsWith('.js')) return <IconCode className="w-3 h-3 text-yellow-400" />;
        return <IconCode className="w-3 h-3 text-gray-400" />;
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-black/50 select-none overflow-hidden relative">
            
            {/* 1. TAB BAR */}
            <div className="flex items-center bg-[#252526] border-b border-black/50 overflow-x-auto no-scrollbar h-9 shrink-0">
                {files.map(f => (
                    <div 
                        key={f.id}
                        onClick={() => { setActiveTabId(f.id); if(viewMode === 'preview') setViewMode('edit'); }}
                        className={`
                            h-full px-3 text-xs flex items-center gap-2 cursor-pointer border-r border-white/5 min-w-[120px] max-w-[200px] group transition-colors relative
                            ${activeTabId === f.id && viewMode !== 'preview' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[rgb(var(--accent-rgb))]' : 'text-gray-500 hover:bg-[#2a2d2e]'}
                        `}
                    >
                        {getFileIcon(f.name)}
                        <span className="truncate font-mono text-[11px]">{f.name}</span>
                        {(f.isNew || f.proposedContent) && <div className={`w-1.5 h-1.5 rounded-full ml-1 shrink-0 ${f.proposedContent ? 'bg-indigo-400 animate-pulse' : 'bg-green-500'}`} />}
                        <button onClick={(e) => handleCloseFile(e, f.id)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded ml-auto transition-opacity text-muted-foreground hover:text-red-400">
                            <IconX className="w-2.5 h-2.5" />
                        </button>
                    </div>
                ))}
                <button onClick={handleAddFile} className="px-3 h-full text-gray-500 hover:text-white hover:bg-white/5 transition-colors border-r border-white/5">
                    <IconPlus className="w-3.5 h-3.5"/>
                </button>
            </div>

            {/* 2. TOOLBAR */}
            <div className="h-12 px-3 border-b border-white/5 flex justify-between items-center bg-[#1e1e1e] shrink-0">
                
                {/* Nome do Arquivo / Status */}
                {viewMode !== 'preview' && activeFile ? (
                    <div className="flex items-center gap-2">
                        {getFileIcon(activeFile.name)}
                        <input 
                            className="bg-transparent text-xs text-gray-300 focus:text-white outline-none border-b border-transparent focus:border-white/20 w-48 font-mono transition-colors focus:bg-white/5 px-1 rounded-sm"
                            value={activeFile.name}
                            onChange={(e) => updateFileName(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-green-400 text-xs font-medium">
                        <IconPlay className="w-3.5 h-3.5" /> Running Preview...
                    </div>
                )}

                {/* Controles Centrais */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-black/40 rounded p-0.5 border border-white/5">
                        <button onClick={() => setViewMode('edit')} className={`px-3 py-1 text-[10px] rounded transition-all flex items-center gap-1.5 ${viewMode === 'edit' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            <IconCode className="w-3 h-3" /> Code
                        </button>
                        <button onClick={() => setViewMode('diff')} className={`px-3 py-1 text-[10px] rounded transition-all flex items-center gap-1.5 ${viewMode === 'diff' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'} ${activeFile?.proposedContent ? 'text-indigo-400' : ''}`}>
                            <IconDiff className="w-3 h-3" /> Diff
                            {activeFile?.proposedContent && <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                        </button>
                        <button onClick={() => setViewMode('preview')} className={`px-3 py-1 text-[10px] rounded transition-all flex items-center gap-1.5 ${viewMode === 'preview' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-emerald-400'}`}>
                            <IconPlay className="w-3 h-3" /> Preview
                        </button>
                    </div>
                    
                    <div className="w-px h-4 bg-white/10" />
                    
                    {/* Botão de Propriedades */}
                    <Button 
                        size="sm" variant="ghost" 
                        className={`h-7 w-7 p-0 ${showProperties ? 'text-[rgb(var(--accent-rgb))] bg-[rgba(var(--accent-rgb),0.1)]' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setShowProperties(!showProperties)} 
                        title="Propriedades do Projeto"
                    >
                        <IconSettings className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400" onClick={handleSaveFile} title="Salvar Local">
                        <IconCheckCircle className="w-4 h-4" />
                    </Button>

                    {/* DEPLOY POPOVER */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="sm" className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-[10px] gap-2 border border-indigo-500/50 shadow-lg shadow-indigo-900/20 text-white font-medium">
                                Deploy <span className="opacity-50">Git</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 bg-[#252526] border-white/10 text-gray-200" align="end">
                            <div className="p-3 border-b border-white/10 bg-[#2d2d2e]">
                                <h4 className="font-medium text-xs text-white">Publicar no GitHub</h4>
                            </div>
                            <div className="p-3 space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Repositório</label>
                                    <Input className="h-7 bg-[#1e1e1e] border-white/10 text-xs text-gray-300 font-mono" value={deployConfig.repoName} onChange={(e) => setDeployConfig({...deployConfig, repoName: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold">Mensagem</label>
                                    <Input className="h-7 bg-[#1e1e1e] border-white/10 text-xs text-gray-300" value={deployConfig.commitMsg} onChange={(e) => setDeployConfig({...deployConfig, commitMsg: e.target.value})} />
                                </div>
                                <Button className={`w-full h-8 mt-2 text-xs gap-2 ${deployStatus === 'success' ? 'bg-emerald-600' : 'bg-indigo-600'}`} onClick={handleDeploy} disabled={isDeploying}>
                                    {isDeploying ? 'Enviando...' : 'Confirmar Push'}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* 3. ÁREA PRINCIPAL (SPLIT VIEW) */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* EDITOR / DIFF / PREVIEW */}
                <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
                    {viewMode === 'preview' ? (
                        <LivePreview files={files} />
                    ) : viewMode === 'diff' ? (
                        <CodeDiffViewer 
                            originalContent={activeFile?.content}
                            proposedContent={activeFile?.proposedContent}
                            language={activeFile?.language}
                            telemetry={activeFile?.telemetry}
                            onAccept={handleAcceptChanges}
                            onReject={handleRejectChanges}
                        />
                    ) : activeFile ? (
                        <Editor
                            height="100%"
                            theme="prana-dark"
                            language={activeFile.language || 'javascript'}
                            value={activeFile.content}
                            onChange={updateFileContent}
                            options={{
                                minimap: { enabled: true, scale: 0.75 },
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', monospace",
                                wordWrap: 'on',
                                padding: { top: 16 }
                            }}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-3 h-full">
                            <IconCode className="w-12 h-12 opacity-20"/>
                            <p className="text-xs uppercase tracking-widest opacity-50">Nenhum arquivo aberto</p>
                            <Button variant="outline" size="sm" onClick={handleAddFile} className="border-white/10 hover:bg-white/5 text-gray-400">Criar Arquivo</Button>
                        </div>
                    )}
                </div>

                {/* PAINEL DE PROPRIEDADES (SIDEBAR) */}
                {showProperties && (
                    <div className="w-64 border-l border-white/5 bg-[#252526] flex flex-col animate-in slide-in-from-right-10 duration-200">
                        <div className="h-9 border-b border-white/5 flex items-center px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-[#2d2d2e]">
                            Propriedades do Item
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            
                            {/* Campos Padrão */}
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500">Status</label>
                                <div className="h-8 px-2 bg-black/20 border border-white/5 rounded flex items-center">
                                    <DynamicFieldCell 
                                        item={{ id: task.id, properties: dynamicProperties }} 
                                        field={{ key: 'status', type: 'status' }} 
                                        value={task.status} 
                                        onUpdate={handleDynamicUpdate} 
                                    />
                                </div>
                            </div>

                            {/* Campos Dinâmicos (Schema) */}
                            {customSchema.map(field => {
                                if (['title', 'status', 'check'].includes(field.key)) return null;
                                return (
                                    <div key={field.key} className="space-y-1">
                                        <label className="text-[10px] text-gray-500">{field.label}</label>
                                        <div className="h-8 px-2 bg-black/20 border border-white/5 rounded flex items-center hover:border-white/10 transition-colors">
                                            <DynamicFieldCell 
                                                item={{ id: task.id, properties: dynamicProperties }} 
                                                field={field} 
                                                value={dynamicProperties[field.key]} 
                                                onUpdate={handleDynamicUpdate} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {customSchema.length === 0 && (
                                <div className="text-center py-4 text-xs text-gray-600 italic">
                                    Sem campos personalizados neste projeto.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
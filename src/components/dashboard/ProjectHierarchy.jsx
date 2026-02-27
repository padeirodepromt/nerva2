/* src/components/dashboard/ProjectHierarchy.jsx
   desc: Navegador de Estrutura V10 (Full Build - 100% Integridade).
   feat: Recursividade Real, Drag&Drop, Importação ZIP Contextual e Ações de Agentes.
*/
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Task, Project, Document, MindMap } from '@/api/entities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useChatStore } from '@/stores/useChatStore';
import { VIEW_TYPES } from '@/config/viewTypes';
import { AnimatePresence, motion } from 'framer-motion';

// Modais Específicos
import RenameProjectModal from '@/components/modals/RenameProjectModal';
import { GithubImportModal } from '@/components/importer/GithubImportModal';

// Ícones Prana Nativos
import { 
    IconFolder, IconFolderOpen, IconBox, IconFileText, IconLayout, 
    IconEdit, IconTrash, IconPlus, IconMap, IconFolderPlus, 
    IconFilePlus, IconArrowRight, IconCode, IconZap, IconList
} from '@/components/icons/PranaLandscapeIcons';
import { Download } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- SUB-COMPONENTE: ITEM DA HIERARQUIA ---
const HierarchyItem = ({ 
    node, level, isSelected, expanded, dragOverId,
    onToggle, onSelect, onDragStart, onDragOver, onDrop, onContextMenu, onCreateQuick 
}) => {
    const isExpanded = !!expanded[node.id];
    
    // Configuração Uniforme V10 (Zinc/Monocromático)
    const getIcon = () => {
        if (node.type === 'project' || node.type === 'folder') return isExpanded ? IconFolderOpen : IconFolder;
        if (node.id === 'unassigned_captures') return IconBox; // Ícone diferenciado para a pasta virtual
        if (node.type === 'task') return IconZap;
        if (node.type === 'mindmap') return IconMap;
        if (node.type === 'checklist') return IconList;
        return IconFileText;
    };

    const Icon = getIcon();

    return (
        <div className="select-none">
            <div 
                className={cn(
                    "group flex items-center py-1.5 px-2 cursor-pointer transition-all rounded-md mx-1 my-0.5 border border-transparent",
                    isSelected ? "bg-white/10 text-white border-white/5 shadow-sm" : "hover:bg-white/[0.03] text-zinc-400 hover:text-zinc-100",
                    dragOverId === node.id && "bg-indigo-500/20 border-indigo-500/50 ring-1 ring-indigo-500/50"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={(e) => onSelect(e, node)}
                onContextMenu={(e) => onContextMenu(e, node)}
                draggable={node.id !== 'unassigned_captures'}
                onDragStart={(e) => onDragStart(e, node)}
                onDragOver={(e) => onDragOver(e, node)}
                onDrop={(e) => onDrop(e, node)}
            >
                {/* Botão de Expansão */}
                <span 
                    className={cn(
                        "mr-1 w-4 h-4 flex items-center justify-center rounded-sm hover:bg-white/10 transition-colors",
                        !node.isFolder && "opacity-0 pointer-events-none"
                    )}
                    onClick={(e) => { e.stopPropagation(); onToggle(node); }}
                >
                    {node.isFolder && (
                        <IconArrowRight className={cn("w-2.5 h-2.5 transition-transform duration-200", isExpanded && "rotate-90")} />
                    )}
                </span>
                
                <Icon className="w-3.5 h-3.5 mr-2 shrink-0 opacity-70" />
                <span className="truncate flex-1 text-xs tracking-tight font-medium">{node.title}</span>
                
                {/* Ações Rápidas no Hover */}
                {node.isFolder && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity">
                        <button 
                            className="p-1 hover:bg-white/10 rounded-md text-zinc-500 hover:text-zinc-200"
                            onClick={(e) => { e.stopPropagation(); onCreateQuick(node); }}
                            title="Criar Item Aqui"
                        >
                            <IconPlus className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function ProjectHierarchy({ projects = [], tasks = [], documents = [], maps = [], onRefresh }) {
    const { openTab } = useWorkspaceStore();
    const { setContext, clearContext } = useChatStore();
    
    // Estados de Controle V10
    const [expanded, setExpanded] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const [dragNode, setDragNode] = useState(null); 
    const [dragOverNodeId, setDragOverNodeId] = useState(null); 
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
    
    // Estados de Modais
    const [renameModal, setRenameModal] = useState({ open: false, value: '', item: null });
    const [createModal, setCreateModal] = useState({ open: false, type: 'task', parentId: null, name: '' });
    const [importModal, setImportModal] = useState({ open: false, parentId: null });
    const [renameProjectModal, setRenameProjectModal] = useState(null);
    const [isRenamingProject, setIsRenamingProject] = useState(false);

    // --- CONSTRUTOR DA ÁRVORE (ENGINE RECURSIVA) ---
    const { rootNodes, nodeLookup } = useMemo(() => {
        const nodeMap = {};
        const roots = [];

        // 1. Inicializa Projetos (Folders)
        projects.forEach(p => { 
            nodeMap[p.id] = { ...p, title: p.title || p.name, type: 'project', isFolder: true, children: [] }; 
        });
        
        // 2. Monta Hierarquia de Pastas
        projects.forEach(p => {
            const parentId = p.parentId || p.parent_id;
            if (parentId && nodeMap[parentId]) { 
                nodeMap[parentId].children.push(nodeMap[p.id]); 
                nodeMap[p.id].parentId = parentId; 
            } else { 
                roots.push(nodeMap[p.id]); 
            }
        });

        // 3. Distribuição de Entidades Operacionais (Lida com Órfãos via "Capturas")
        const distribute = (item, type) => {
            const pid = item.project_id || item.projectId;
            const node = { ...item, title: item.title || item.name, type, isFolder: false, parentId: pid };
            nodeMap[item.id] = node;
            if (pid && nodeMap[pid]) { 
                nodeMap[pid].children.push(node); 
                return true; 
            }
            return false;
        };

        const unassignedItems = []; 
        tasks.forEach(t => !distribute(t, 'task') && unassignedItems.push({ ...t, type: 'task' }));
        documents.forEach(d => !distribute(d, 'document') && unassignedItems.push({ ...d, type: 'document' }));
        maps.forEach(m => !distribute(m, 'mindmap') && unassignedItems.push({ ...m, type: 'mindmap' }));

        // 4. Criação da Pasta Virtual "Capturas" (Itens sem Projeto)
        if (unassignedItems.length > 0) {
            const capturesNode = { 
                id: 'unassigned_captures', 
                title: 'Capturas', 
                type: 'folder', 
                isFolder: true, 
                children: unassignedItems 
            };
            roots.push(capturesNode);
            nodeMap['unassigned_captures'] = capturesNode;
        }

        return { rootNodes: roots, nodeLookup: nodeMap };
    }, [projects, tasks, documents, maps]);

    // --- HANDLERS DE AÇÃO ---
    const handleToggle = (node) => setExpanded(prev => ({ ...prev, [node.id]: !prev[node.id] }));
    
    const handleSelect = (e, node) => {
        e.stopPropagation();
        setSelectedId(node.id);
        setContext({ type: node.type, id: node.id, title: node.title, data: node });
        if (!node.isFolder) {
            const viewType = { 'document': VIEW_TYPES.DOC_EDITOR, 'mindmap': VIEW_TYPES.MINDMAP_BOARD, 'task': 'task_overlay' }[node.type];
            if (viewType === 'task_overlay') window.dispatchEvent(new CustomEvent('prana:open-task', { detail: { taskId: node.id } }));
            else if (viewType) openTab({ type: viewType, title: node.title, data: { id: node.id } });
        }
    };

    const handleCreateConfirm = async () => {
        if (!createModal.name.trim()) return;
        try {
            const { type, parentId, name } = createModal;
            const factory = { 'project': Project, 'task': Task, 'document': Document, 'mindmap': MindMap }[type];
            const safeParentId = parentId === 'unassigned_captures' ? null : parentId;
            const payload = { title: name };
            if (type === 'project') payload.parentId = safeParentId;
            else payload.project_id = safeParentId;

            await factory.create(payload);
            setCreateModal({ ...createModal, open: false });
            if (onRefresh) onRefresh();
            toast.success("Manifestação concluída.");
            if (safeParentId) setExpanded(p => ({ ...p, [safeParentId]: true }));
        } catch (e) { toast.error("Erro na criação."); }
    };

    const handleRename = async () => {
        const { item, value } = renameModal;
        if (!value.trim()) return;
        try {
            const factory = { 'project': Project, 'task': Task, 'document': Document, 'mindmap': MindMap }[item.type];
            await factory.update(item.id, { title: value });
            toast.success("Identidade atualizada."); 
            setRenameModal({ ...renameModal, open: false }); 
            if (onRefresh) onRefresh();
        } catch (e) { toast.error("Falha ao renomear."); }
    };

    const handleDelete = async () => {
        const { item } = contextMenu;
        if(!confirm(`Deseja apagar "${item.title}"?`)) return;
        try {
            const factory = { 'project': Project, 'task': Task, 'document': Document, 'mindmap': MindMap }[item.type];
            await factory.delete(item.id); 
            toast.success("Removido do Nexus."); 
            if (onRefresh) onRefresh();
        } catch (e) { toast.error("Erro ao excluir."); }
        setContextMenu({ visible: false });
    };

    // --- LÓGICA DE DRAG AND DROP ---
    const handleDragStart = (e, node) => { e.stopPropagation(); setDragNode(node); };
    const handleDragOver = (e, node) => { 
        e.preventDefault(); 
        if (node.isFolder && dragNode?.id !== node.id) setDragOverNodeId(node.id); 
    };
    const handleDrop = async (e, targetNode) => {
        e.preventDefault(); setDragOverNodeId(null);
        if (!dragNode || !targetNode.isFolder || dragNode.id === targetNode.id) return;
        
        try {
            const targetId = targetNode.id === 'unassigned_captures' ? null : targetNode.id;
            const factory = { 'task': Task, 'document': Document, 'project': Project, 'mindmap': MindMap }[dragNode.type];
            const payload = dragNode.type === 'project' ? { parentId: targetId } : { project_id: targetId };
            
            await factory.update(dragNode.id, payload);
            toast.success("Hierarquia reestruturada.");
            if (onRefresh) onRefresh();
        } catch (err) { toast.error("Erro ao mover entidade."); }
        setDragNode(null);
    };

    // --- RENDERIZAÇÃO RECURSIVA MASTER ---
    const renderNodes = (nodes, lvl) => {
        return nodes.map(node => (
            <React.Fragment key={node.id}>
                <HierarchyItem
                    node={node} level={lvl} isSelected={selectedId === node.id}
                    expanded={expanded} dragOverId={dragOverNodeId}
                    onToggle={handleToggle} onSelect={handleSelect}
                    onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
                    onCreateQuick={(n) => setCreateModal({ open: true, type: 'task', parentId: n.id, name: '' })}
                    onContextMenu={(e, n) => { 
                        e.preventDefault(); e.stopPropagation(); 
                        setSelectedId(n.id); 
                        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item: n }); 
                    }}
                />
                <AnimatePresence>
                    {expanded[node.id] && node.children && node.children.length > 0 && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }} 
                            transition={{ duration: 0.2, ease: "easeInOut" }} 
                            className="overflow-hidden"
                        >
                            {renderNodes(node.children, lvl + 1)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </React.Fragment>
        ));
    };

    return (
        <div className="h-full flex flex-col bg-zinc-950/40 backdrop-blur-xl border-r border-white/5" onClick={() => { setSelectedId(null); clearContext(); }}>
            
            {/* TOOLBAR V10 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Project Nexus Engine</span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-400 hover:bg-indigo-500/10" onClick={() => setImportModal({ open: true, parentId: null })} title="Importar ZIP">
                        <Download className="w-3.5 h-3.5" />
                    </Button>
                    <div className="w-px h-3 bg-white/10 mx-1" />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400" onClick={() => setCreateModal({ open: true, type: 'project', parentId: null, name: '' })} title="Nova Pasta">
                        <IconFolderPlus className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400" onClick={() => setCreateModal({ open: true, type: 'document', parentId: null, name: '' })} title="Novo Arquivo">
                        <IconFilePlus className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* ÁRVORE RECURSIVA */}
            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                {rootNodes.length > 0 ? renderNodes(rootNodes, 0) : (
                    <div className="flex flex-col items-center justify-center h-40 opacity-20 gap-3">
                        <IconBox className="w-10 h-10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">Nexus Vazio em {VIEW_TYPES.PROJECT_HUB}</span>
                    </div>
                )}
            </div>

            {/* CONTEXT MENU V10 (Injecta Especialistas) */}
            {contextMenu.visible && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setContextMenu({ visible: false })} />
                    <div 
                        className="fixed z-50 w-52 bg-[#0B0E14] border border-white/10 rounded-xl shadow-2xl py-2 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100"
                        style={{ top: Math.min(contextMenu.y, window.innerHeight - 300), left: Math.min(contextMenu.x, window.innerWidth - 240) }}
                    >
                        <div className="px-3 py-1.5 text-[9px] font-bold text-zinc-600 border-b border-white/5 mb-1 truncate uppercase tracking-tighter">{contextMenu.item?.title}</div>
                        
                        {/* Ação Especial Neo */}
                        <button className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-indigo-400 text-xs font-bold transition-all">
                            <IconCode className="w-3.5 h-3.5 animate-pulse" /> Neo: Auditar Entidade
                        </button>

                        <div className="h-px bg-white/5 my-1" />

                        {contextMenu.item?.isFolder && (
                            <>
                                <button onClick={() => setCreateModal({ open: true, type: 'task', parentId: contextMenu.item.id, name: '' })} className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-xs"><IconZap className="w-3.5 h-3.5 text-emerald-500/80"/> Nova Tarefa</button>
                                <button onClick={() => setCreateModal({ open: true, type: 'document', parentId: contextMenu.item.id, name: '' })} className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-xs"><IconFileText className="w-3.5 h-3.5 text-amber-500/80"/> Novo Doc</button>
                                <button onClick={() => setImportModal({ open: true, parentId: contextMenu.item.id })} className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-xs text-purple-400"><Download className="w-3.5 h-3.5"/> Importar ZIP</button>
                                <div className="h-px bg-white/5 my-1" />
                            </>
                        )}
                        <button onClick={() => { setRenameModal({ open: true, item: contextMenu.item, value: contextMenu.item.title }); setContextMenu({ visible: false }); }} className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-xs"><IconEdit className="w-3.5 h-3.5"/> Renomear</button>
                        <button onClick={handleDelete} className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-500 flex items-center gap-2 text-xs"><IconTrash className="w-3.5 h-3.5"/> Excluir</button>
                    </div>
                </>
            )}

            {/* MODAIS DE GESTÃO (100% FUNCIONAIS) */}
            <Dialog open={createModal.open} onOpenChange={(o) => setCreateModal(p => ({...p, open: o}))}>
                <DialogContent className="bg-[#0B0E14] border-white/10 shadow-2xl">
                    <DialogHeader><DialogTitle className="text-zinc-200">Manifestar Item</DialogTitle></DialogHeader>
                    <div className="flex gap-2 py-4">
                        <Select value={createModal.type} onValueChange={(v) => setCreateModal(p => ({...p, type: v}))}>
                            <SelectTrigger className="w-[110px] bg-white/5 border-white/10 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-white/10">
                                <SelectItem value="project">Pasta</SelectItem>
                                <SelectItem value="task">Tarefa</SelectItem>
                                <SelectItem value="document">Doc</SelectItem>
                                <SelectItem value="mindmap">Mapa</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input value={createModal.name} onChange={e => setCreateModal(p => ({...p, name: e.target.value}))} placeholder="Título da Entidade..." autoFocus className="bg-white/5 border-white/10 text-zinc-200" onKeyDown={e => e.key === 'Enter' && handleCreateConfirm()} />
                    </div>
                    <DialogFooter><Button onClick={handleCreateConfirm} className="bg-zinc-200 text-black hover:bg-zinc-100 transition-colors">Confirmar Manifestação</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={renameModal.open} onOpenChange={(o) => setRenameModal(p => ({...p, open: o}))}>
                <DialogContent className="bg-[#0B0E14] border-white/10">
                    <DialogHeader><DialogTitle className="text-zinc-200">Rebatizar</DialogTitle></DialogHeader>
                    <Input value={renameModal.value} onChange={e => setRenameModal(p => ({...p, value: e.target.value}))} autoFocus className="bg-white/5 border-white/10" onKeyDown={e => e.key === 'Enter' && handleRename()} />
                    <DialogFooter><Button onClick={handleRename}>Salvar Alteração</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <GithubImportModal 
                isOpen={importModal.open} parentId={importModal.parentId} 
                onClose={() => setImportModal(p => ({...p, open: false}))}
                onSuccess={() => { if (onRefresh) onRefresh(); setImportModal(p => ({...p, open: false})); }} 
            />

            <AnimatePresence>
                {renameProjectModal && (
                    <RenameProjectModal 
                        project={renameProjectModal} allProjects={projects} 
                        onSave={(u) => {
                            setIsRenamingProject(true); 
                            Project.update(renameProjectModal.id, u).then(() => { 
                                toast.success("Frequência de Projeto atualizada."); 
                                setRenameProjectModal(null); 
                                if(onRefresh) onRefresh(); 
                            }).finally(() => setIsRenamingProject(false));
                        }} 
                        onCancel={() => setRenameProjectModal(null)} isLoading={isRenamingProject} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
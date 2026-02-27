/* src/views/MindMapBoardView.jsx
   desc: O Jardim Neural V8.1 (Unified Brain & Prana UI).
   feat: Visualização Híbrida (Tasks/Records + Ideias), Transmutação e Estética Orgânica.
*/
import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, { 
    useNodesState, useEdgesState, Controls, addEdge, 
    useReactFlow, ReactFlowProvider, Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';

// [V8 ENGINE]
import { useProjectEntities } from '@/hooks/useProjectEntities';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';
import { apiClient } from '@/api/apiClient';

// Entidades Legadas (para Nodes puramente visuais)
import { MindMapNode, MindMap } from '@/api/entities'; 

// Ícones
import { 
    IconNeural, IconPlus, IconEdit, IconTrash, IconZoomIn, IconZoomOut,
    IconSave, IconCheck, IconDatabase
} from '@/components/icons/PranaLandscapeIcons';

// Componentes Visuais (Custom)
import MindMapCustomNode from '@/components/mindmap/MindMapCustomNode';
import MindMapEdge from '@/components/mindmap/MindMapEdge'; 
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PranaFormModal from '@/components/forms/PranaFormModal';
import PranaLoader from '@/components/PranaLoader';

const nodeTypes = { customNode: MindMapCustomNode };
const edgeTypes = { customEdge: MindMapEdge }; 

function MindMapCanvasContent({ mapId, projectId, title }) {
    const { user } = useAuth();
    const { t } = useTranslations();
    const flowWrapper = useRef(null);
    
    // [V8 HOOK] Carrega Entidades do Projeto (Tasks e Records)
    // Passamos null no mode para trazer TUDO
    const { items: projectItems, loading: itemsLoading, actions } = useProjectEntities(projectId, null);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loadingMap, setLoadingMap] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentMapId, setCurrentMapId] = useState(mapId);
    
    // UI State
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [transmuteModal, setTransmuteModal] = useState({ open: false, type: 'task', nodeId: null, initialData: {} });
    const [renameModal, setRenameModal] = useState({ open: false, nodeId: null, label: '' });
    
    const reactFlowInstance = useReactFlow(); 

    // 1. INICIALIZAÇÃO E MERGE DE DADOS
    useEffect(() => {
        const initMap = async () => {
            if (!user) return;
            setLoadingMap(true);
            try {
                let activeId = mapId;

                // A. Descoberta/Criação do Mapa (Container)
                if (!activeId) {
                    const maps = projectId ? await MindMap.list({ projectId }) : await MindMap.list();
                    const targetMap = projectId ? maps[0] : maps.find(m => !m.projectId); 

                    if (targetMap) {
                        activeId = targetMap.id;
                    } else {
                        const newMap = await MindMap.create({ 
                            title: projectId ? (title || 'Mapa do Projeto') : t('mindmap_global_consciousness'), 
                            projectId: projectId || null, 
                            createdBy: user.id 
                        });
                        activeId = newMap.id;
                    }
                    setCurrentMapId(activeId);
                }

                if (activeId) {
                    // B. Carrega Nós Visuais (Ideias Soltas) e Edges
                    const visualNodes = await MindMapNode.list({ mapId: activeId });
                    let mapEdges = [];
                    try {
                        const res = await apiClient.get(`/mindmap-edges?mapId=${activeId}`);
                        mapEdges = res.data || [];
                    } catch (err) {}

                    // C. Merge: Entidades Reais + Ideias Visuais
                    const entityNodes = (projectItems || []).map(item => ({
                        id: item.id,
                        type: 'customNode',
                        // Se não tiver posição salva, espalha aleatoriamente
                        position: item.mindMapPosition || { x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 },
                        data: { 
                            label: item.title, 
                            type: item.dueDate ? 'task' : 'record',
                            node_type: item.dueDate ? 'task' : 'record', // Para o ícone
                            isEntity: true,
                            status: item.status,
                            onTransmute: openTransmuteModal, 
                            onDelete: handleDeleteNode 
                        }
                    }));

                    const ideaNodes = visualNodes.map(n => ({
                        id: n.id, 
                        type: 'customNode', 
                        position: n.position || { x: 0, y: 0 }, 
                        data: { 
                            ...n.data, 
                            label: n.label, 
                            type: 'idea', 
                            node_type: 'idea',
                            isEntity: false,
                            onTransmute: openTransmuteModal, 
                            onDelete: handleDeleteNode 
                        }
                    }));

                    // Seed Inicial se vazio
                    if (entityNodes.length === 0 && ideaNodes.length === 0) {
                        const rootNode = { 
                            id: 'root', mapId: activeId, label: projectId ? t('mindmap_project_nucleus') : t('mindmap_global_consciousness'), 
                            type: 'root', position: { x: 0, y: 0 } 
                        };
                        await MindMapNode.create(rootNode);
                        ideaNodes.push({ ...rootNode, type: 'customNode', data: { label: rootNode.label, type: 'root', node_type: 'root' } });
                    }

                    setNodes([...entityNodes, ...ideaNodes]);
                    setEdges(mapEdges.map(e => ({
                        id: e.id, source: e.sourceId, target: e.targetId, 
                        type: 'customEdge', animated: true
                    })));
                }
            } catch(e) { 
                console.error(e); 
                toast.error("Erro ao carregar o Jardim."); 
            } finally { 
                setLoadingMap(false); 
            }
        };
        
        if (!itemsLoading) {
            initMap();
        }
    }, [mapId, projectId, user, projectItems, itemsLoading]); 

    // 2. AÇÕES DE NÓS
    const addNewNode = async () => {
        if (!currentMapId) return;
        setSaving(true);
        const viewport = reactFlowInstance.getViewport();
        const position = { 
            x: -viewport.x / viewport.zoom + window.innerWidth / 2 / viewport.zoom + (Math.random() * 50), 
            y: -viewport.y / viewport.zoom + window.innerHeight / 2 / viewport.zoom + (Math.random() * 50)
        };

        const tempId = `temp_${Date.now()}`;
        const newNodeVisual = { 
            id: tempId, type: 'customNode', position, 
            data: { label: 'Nova Ideia', type: 'idea', node_type: 'idea', onTransmute: openTransmuteModal, onDelete: handleDeleteNode } 
        };
        setNodes((nds) => nds.concat(newNodeVisual));

        try {
            const created = await MindMapNode.create({ mapId: currentMapId, label: 'Nova Ideia', type: 'idea', position });
            setNodes(nds => nds.map(n => n.id === tempId ? { ...n, id: created.id } : n));
        } catch(e) { 
            setNodes(nds => nds.filter(n => n.id !== tempId)); 
            toast.error("Falha ao plantar ideia.");
        } finally { setSaving(false); }
    };

    const handleDeleteNode = async (nodeId) => {
        if(!confirm("Desintegrar esta ideia?")) return;
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        try {
            if (node.data.isEntity) {
                await actions.delete(nodeId);
            } else {
                await MindMapNode.delete(nodeId);
            }
            
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));
            setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
            toast.success("Ideia desintegrada.");
            setSelectedNodeId(null);
        } catch (e) { toast.error("Erro ao deletar."); }
    };

    // 3. RENOMEAÇÃO
    const handleRenameSave = async () => {
        const { nodeId, label } = renameModal;
        if (!nodeId || !label.trim()) return;
        
        const node = nodes.find(n => n.id === nodeId);
        if (node.data.isEntity) {
            await actions.update(nodeId, { title: label });
        } else {
            await MindMapNode.update(nodeId, { label });
        }
        
        setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, label } } : n));
        setRenameModal({ open: false, nodeId: null, label: '' });
        toast.success("Renomeado.");
    };

    // 4. TRANSMUTAÇÃO
    const openTransmuteModal = (nodeId, label, targetType) => {
        setTransmuteModal({
            open: true, type: targetType, nodeId: nodeId,
            initialData: { title: label, project_id: projectId || null }
        });
    };

    const handleTransmuteSave = async (formData) => {
        const { nodeId, type } = transmuteModal;
        const node = nodes.find(n => n.id === nodeId);
        
        try {
            const payload = { ...formData, mindMapPosition: node.position };
            const newEntity = await actions.create(payload); 
            
            if (!node.data.isEntity) {
                await MindMapNode.delete(nodeId);
            }

            // Atualiza localmente para feedback instantâneo
            setNodes(nds => nds.map(n => n.id === nodeId ? { 
                ...n, 
                id: newEntity.id || 'temp_new', 
                data: { ...n.data, type: type, isEntity: true, node_type: type } 
            } : n));

            setTransmuteModal({ ...transmuteModal, open: false });
            toast.success(`Transmutado com sucesso.`);
        } catch (e) {
            toast.error("Erro na transmutação.");
        }
    };

    // 5. MANIPULAÇÃO DE CONEXÕES
    const onNodeDragStop = useCallback(async (event, node) => {
        if (node.id.startsWith('temp_')) return; 
        
        if (node.data.isEntity) {
            try { await actions.update(node.id, { mindMapPosition: node.position }); } catch(e){}
        } else {
            try { await MindMapNode.update(node.id, { position: node.position }); } catch (e) {}
        }
    }, [actions]);
    
    const onConnect = useCallback(async (params) => {
        if (!currentMapId) return;
        setEdges((eds) => addEdge({ ...params, type: 'customEdge', animated: true }, eds));
        try {
            await apiClient.post('/mindmap-edges', { mapId: currentMapId, source: params.source, target: params.target });
        } catch(e) { console.error("Erro ao salvar conexão", e); }
    }, [setEdges, currentMapId]);

    const onEdgesDelete = useCallback(async (deleted) => {
        try {
            await Promise.all(deleted.map(edge => apiClient.delete(`/mindmap-edges/${edge.id}`)));
        } catch (e) {}
    }, []);

    // 6. EXPORTAÇÃO
    const handleExport = useCallback(() => {
        if (flowWrapper.current === null) return;
        toPng(flowWrapper.current, { cacheBust: true, backgroundColor: '#0c0a09', quality: 1 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `prana-mindmap-${currentMapId}.png`;
                link.href = dataUrl;
                link.click();
                toast.success("Snapshot salvo.");
            })
            .catch(() => toast.error("Erro ao gerar imagem."));
    }, [flowWrapper, currentMapId]);

    const containerStyle = isFullScreen 
        ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: '#0c0a09' } 
        : { height: '100%', width: '100%', position: 'relative' };

    if(loadingMap || itemsLoading) return <PranaLoader text={t('mindmap_tuning')} />;

    return (
        <div style={containerStyle} className="prana-bg-base overflow-hidden transition-all duration-300 relative group">
            
            {/* Header Flutuante */}
            <div className="absolute top-4 left-0 right-0 z-50 pointer-events-none flex justify-center">
                <div className="pointer-events-auto min-w-[320px]"> 
                    <PageHeader 
                        title={title || t('mindmap_title')}
                        subtitle={saving ? <span className="flex items-center gap-2 animate-pulse text-[rgb(var(--accent-rgb))]">{t('mindmap_saving')}</span> : t('mindmap_synced')}
                        icon={IconNeural}
                        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl py-2 px-6"
                        actions={
                            <div className="flex items-center gap-2">
                                <Button onClick={addNewNode} size="sm" className="gap-2 bg-[rgb(var(--accent-rgb))] hover:opacity-90 text-white rounded-full h-8">
                                    <IconPlus className="w-4 h-4" /> <span className="hidden sm:inline">{t('mindmap_add_node')}</span>
                                </Button>
                                <Button variant="secondary" size="icon" onClick={() => setIsFullScreen(!isFullScreen)} className="rounded-full w-8 h-8 bg-white/5 border border-white/10 text-white hover:bg-white/10">
                                    {isFullScreen ? <IconZoomOut className="w-4 h-4" /> : <IconZoomIn className="w-4 h-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleExport} className="rounded-full w-8 h-8 text-white/70 hover:text-white">
                                    <IconSave className="w-4 h-4" />
                                </Button>
                            </div>
                        }
                    />
                </div>
            </div>

            <div className="absolute inset-0 z-0" ref={flowWrapper}>
                <ReactFlow
                    nodes={nodes} edges={edges} 
                    onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                    onNodeDragStop={onNodeDragStop} onConnect={onConnect} onEdgesDelete={onEdgesDelete} 
                    onNodeClick={(_, n) => setSelectedNodeId(n.id)} onPaneClick={() => setSelectedNodeId(null)}
                    nodeTypes={nodeTypes} edgeTypes={edgeTypes}
                    fitView className="bg-transparent" minZoom={0.1}
                    proOptions={{ hideAttribution: true }}
                    defaultEdgeOptions={{ type: 'customEdge', animated: true }} 
                    deleteKeyCode={['Backspace', 'Delete']}
                >
                    {/* Background V8 (Noise + Gradient) */}
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)]"></div>
                    </div>

                    <Controls position="bottom-left" className="!bg-black/40 !backdrop-blur-md !border-white/10 !rounded-lg !fill-white" showInteractive={false} />
                    
                    {/* Menu de Contexto */}
                    {selectedNodeId && (
                        <Panel position="top-right" className="bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-xl flex flex-col gap-2 mr-16 mt-4">
                            <Button variant="ghost" size="sm" onClick={() => setRenameModal({ open: true, nodeId: selectedNodeId, label: nodes.find(n=>n.id===selectedNodeId)?.data.label })} className="justify-start text-xs h-7">
                                <IconEdit className="w-3 h-3 mr-2" /> Renomear
                            </Button>
                            
                            {!nodes.find(n => n.id === selectedNodeId)?.data.isEntity && (
                                <>
                                    <Button variant="ghost" size="sm" onClick={() => openTransmuteModal(selectedNodeId, nodes.find(n=>n.id===selectedNodeId)?.data.label, 'task')} className="justify-start text-xs h-7 text-blue-400 hover:text-blue-300">
                                        <IconCheck className="w-3 h-3 mr-2" /> Virar Tarefa
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openTransmuteModal(selectedNodeId, nodes.find(n=>n.id===selectedNodeId)?.data.label, 'record')} className="justify-start text-xs h-7 text-purple-400 hover:text-purple-300">
                                        <IconDatabase className="w-3 h-3 mr-2" /> Virar Registro
                                    </Button>
                                </>
                            )}

                            <Button variant="ghost" size="sm" onClick={() => handleDeleteNode(selectedNodeId)} className="justify-start text-xs h-7 text-red-400 hover:text-red-300">
                                <IconTrash className="w-3 h-3 mr-2" /> Desintegrar
                            </Button>
                        </Panel>
                    )}
                </ReactFlow>
            </div>

            {/* Modais */}
            <PranaFormModal 
                isOpen={transmuteModal.open} 
                onClose={() => setTransmuteModal({...transmuteModal, open: false})} 
                itemType={transmuteModal.type} 
                initialData={transmuteModal.initialData} 
                onSave={handleTransmuteSave} 
            />
            
            <Dialog open={renameModal.open} onOpenChange={(o) => !o && setRenameModal({...renameModal, open: false})}>
                <DialogContent className="bg-card border-white/10 text-white">
                    <DialogHeader><DialogTitle>Renomear Ideia</DialogTitle></DialogHeader>
                    <Input value={renameModal.label} onChange={(e) => setRenameModal({...renameModal, label: e.target.value})} className="bg-black/30 border-white/10" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleRenameSave()}/>
                    <DialogFooter><Button onClick={handleRenameSave} className="bg-[rgb(var(--accent-rgb))]">Salvar</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function MindMapBoardView(props) {
    return (
        <ReactFlowProvider>
            <MindMapCanvasContent {...props} />
        </ReactFlowProvider>
    );
}
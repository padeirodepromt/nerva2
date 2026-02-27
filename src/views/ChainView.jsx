/* src/views/ChainView.jsx
   desc: Chain View V8.1 (Organic Roots).
   ui: Estética Wabi-Sabi para visualizar dependências (Micélio/Raízes).
*/

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
    useNodesState, useEdgesState, Background, Controls, addEdge, MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';

// [V8 ENGINE]
import { useProjectEntities } from '@/hooks/useProjectEntities';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';
import { apiClient } from '@/api/apiClient';

import PranaLoader from '@/components/PranaLoader';
import PageHeader from '@/components/ui/PageHeader';
import FilterBar from '@/components/views/FilterBar';
import { 
    IconFlux, IconAlertTriangle, IconCheckCircle, IconClock, IconLink, IconDatabase
} from '@/components/icons/PranaLandscapeIcons';

// --- NÓ ORGÂNICO (Wabi-Sabi) ---
const OrganicNode = ({ data }) => {
    const isBlocked = data.blockedByCount > 0;
    const isBlocking = data.blockingCount > 0;
    const isDone = data.status === 'done';
    const isRecord = data.type === 'record';

    // Estilos Orgânicos (Pedras/Seixos)
    let bgClass = "bg-card/40 backdrop-blur-md";
    let borderClass = "border-white/10";
    let iconColor = "text-muted-foreground";
    let glowClass = "";

    if (isDone) {
        // Musgo / Concluído
        bgClass = "bg-emerald-900/10";
        borderClass = "border-emerald-500/20";
        iconColor = "text-emerald-500/60";
    } else if (isBlocked) {
        // Argila Seca / Bloqueado
        bgClass = "bg-red-900/10";
        borderClass = "border-red-500/30";
        iconColor = "text-red-400";
        glowClass = "shadow-[0_0_20px_-5px_rgba(248,113,113,0.3)]"; // Glow suave avermelhado
    } else if (isBlocking) {
        // Âmbar / Bloqueando
        bgClass = "bg-amber-900/10";
        borderClass = "border-amber-500/30";
        iconColor = "text-amber-400";
    }

    // Records são mais quadrados (pedras lapidadas), Tasks são redondas (seixos)
    const shapeClass = isRecord ? "rounded-2xl" : "rounded-full";

    return (
        <div className={`
            relative group flex flex-col items-center justify-center
            w-16 h-16 ${shapeClass} border transition-all duration-700
            ${bgClass} ${borderClass} ${glowClass}
            hover:bg-card/60 hover:border-white/20 hover:scale-105
        `}>
            {/* Ícone Central */}
            <div className={`transition-all duration-500 group-hover:scale-110 ${iconColor}`}>
                {isRecord ? <IconDatabase className="w-5 h-5 opacity-80" /> : (
                    isDone ? <IconCheckCircle className="w-5 h-5 opacity-60" /> : 
                    isBlocked ? <IconAlertTriangle className="w-5 h-5" /> : 
                    <IconClock className="w-5 h-5 opacity-80" />
                )}
            </div>

            {/* Label Flutuante (Estilo Glass) */}
            <div className={`
                absolute top-full mt-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xl border border-white/5 
                text-[10px] font-medium text-white/90 whitespace-nowrap z-10 pointer-events-none
                transition-all duration-500
                ${isBlocked ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
            `}>
                {data.label}
                {isBlocking && <span className="block text-amber-400/80 text-[9px] mt-0.5">Raiz de {data.blockingCount} itens</span>}
            </div>
        </div>
    );
};

const nodeTypes = { taskNode: OrganicNode };

export default function ChainView({ projectId, mode = 'tasks' }) {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    // [V8 ENGINE]
    const { items, loading, actions } = useProjectEntities(projectId, mode);
    
    // Filtros
    const [filterText, setFilterText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (!items) return;

        // 1. Filtragem Local
        const filteredItems = items.filter(item => {
            const matchText = (item.title || '').toLowerCase().includes(filterText.toLowerCase());
            const matchStatus = filterStatus === 'all' || item.status === filterStatus;
            return matchText && matchStatus;
        });

        // 2. Construção dos Nós (Layout Natural)
        const layoutNodes = filteredItems.map((item, i) => {
            // Layout Espiral Aurea (Fibonacci) para parecer mais natural que uma grade
            const angle = i * 137.5; // Ângulo áureo
            const radius = 30 * Math.sqrt(i);
            // Converter polar para cartesiano
            const x = radius * Math.cos(angle * Math.PI / 180) + 400;
            const y = radius * Math.sin(angle * Math.PI / 180) + 300;

            const blockedByCount = item.blockedBy?.length || 0;
            const blockingCount = item.blocking?.length || 0;

            return {
                id: item.id,
                type: 'taskNode',
                position: { x, y }, 
                data: {
                    label: item.title, 
                    status: item.status, 
                    type: mode === 'records' ? 'record' : 'task',
                    blockedByCount, 
                    blockingCount 
                }
            };
        });

        setNodes(layoutNodes);

        // 3. Edges (Raízes)
        const layoutEdges = [];
        filteredItems.forEach(item => {
            if (item.blockedBy) {
                item.blockedBy.forEach(sourceId => {
                    if (filteredItems.find(fi => fi.id === sourceId)) {
                        layoutEdges.push({
                            id: `e${sourceId}-${item.id}`,
                            source: sourceId,
                            target: item.id,
                            type: 'default',
                            animated: true,
                            // Estilo de Raíz: linha fina, cor de terra/cinza
                            style: { stroke: 'rgba(255, 255, 255, 0.15)', strokeWidth: 1.5 }
                        });
                    }
                });
            }
        });
        setEdges(layoutEdges);

    }, [items, filterText, filterStatus, setNodes, setEdges, mode]);

    const onConnect = useCallback(async (params) => {
        setEdges((eds) => addEdge({ 
            ...params, 
            type: 'default', 
            animated: true, 
            style: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1.5 },
        }, eds));

        try {
            await apiClient.post('/tasks/dependencies', {
                sourceTaskId: params.source, targetTaskId: params.target
            });
            toast.success("Conexão criada.");
        } catch (e) { toast.error(t('chain_error_connection')); }
    }, [setEdges, t]);

    if (loading && !items) return <PranaLoader text="Mapeando raízes..." />;

    return (
        <div className="h-full w-full bg-background relative overflow-hidden flex flex-col">
            
            <PageHeader 
                title={mode === 'records' ? "Conexões de Dados" : "Cadeia de Fluxo"}
                subtitle={t('chain_subtitle')}
                icon={IconFlux} // Usando Fluxo em vez de Nexus/Cosmos
            />

            <FilterBar
                searchText={filterText}
                onSearchChange={setFilterText}
                statusFilter={filterStatus}
                onStatusChange={setFilterStatus}
                priorityFilter="all"
                onPriorityChange={() => {}}
                onClearAll={() => {
                    setFilterText('');
                    setFilterStatus('all');
                }}
                showPriority={false}
                showStatus={true}
            />

            <div className="absolute inset-0 top-0 z-0">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-transparent"
                    minZoom={0.5}
                    proOptions={{ hideAttribution: true }}
                >
                    {/* Background Orgânico (Noise + Gradient) - Igual ao MindMap */}
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)]"></div>
                    </div>
                    
                    <Controls className="!bg-black/40 !backdrop-blur-md !border-white/10 !rounded-lg !fill-white" showInteractive={false} />
                </ReactFlow>
            </div>
            
            {/* HUD */}
            <div className="absolute bottom-6 right-6 p-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl text-xs text-muted-foreground pointer-events-none">
                <span className="flex items-center gap-2"><IconLink className="w-3 h-3" /> Arraste para conectar</span>
            </div>
        </div>
    );
}
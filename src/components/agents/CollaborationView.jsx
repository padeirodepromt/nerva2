/* src/components/chat/CollaborationView.jsx
   desc: Cockpit de Telemetria e Governança Multi-Agentes (Swarm).
   feat: 
    - Integração de Auditoria do Neo e Criatividade da Flor.
    - Gestão de Handoffs com persistência de Co-responsabilidade.
    - Dashboard de Integridade do Sistema (V10 Standard).
*/
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { apiClient } from '@/api/apiClient';

// Components & Services
import CodeDiffViewer from '../specialists/dev-neo/CodeDiffViewer';
import { forwardToAgent } from '@/agents/agentCollaboration';

// Icons nativos Prana
import { 
    IconZap, 
    IconAlertTriangle, 
    IconCode, 
    IconCheck, 
    IconUsers, 
    IconTarget,
    IconTerminal,
    IconSparkles, // Para a Flor
    IconBox // Para representação de Sistemas/Lego
} from '@/components/icons/PranaLandscapeIcons';
import { RefreshCcw as IconRefresh } from 'lucide-react';

export default function CollaborationView({ taskId, userId, projectId }) {
    const [logs, setLogs] = useState([]);
    const [auditScore, setAuditScore] = useState(100);
    const [activeSwarm, setActiveSwarm] = useState(['ash']);
    const scrollRef = useRef(null);

    // 1. SINCRONIZAÇÃO DE TELEMETRIA
    const fetchTelemetry = async () => {
        try {
            // Buscamos logs específicos desta tarefa e contexto global do usuário
            const res = await apiClient.get(`/agents/logs?taskId=${taskId}&userId=${userId}&limit=50`);
            if (res.data?.success) {
                const fetchedLogs = res.data.logs;
                setLogs(fetchedLogs);

                // Cálculo Dinâmico de Integridade e Swarm Ativo
                const agents = new Set(['ash']);
                fetchedLogs.forEach(l => {
                    agents.add(l.agentId);
                    if (l.targetAgentId) agents.add(l.targetAgentId);
                });
                setActiveSwarm(Array.from(agents));

                const lastAudit = fetchedLogs.find(l => l.type === 'NEO_AUDIT' || l.type === 'SYSTEM_INTEGRITY');
                if (lastAudit) setAuditScore(lastAudit.impactScore || 100);
            }
        } catch (error) {
            console.error('[CollabView] Falha na telemetria:', error);
        }
    };

    useEffect(() => {
        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 5000); 
        return () => clearInterval(interval);
    }, [taskId, userId]);

    // 2. HANDLERS DE GOVERNANÇA
    const handleApproveRefactor = async (log) => {
        const tid = toast.loading("Neo está aplicando a cirurgia no código...");
        try {
            await apiClient.post('/agents/neo/apply-refactor', {
                logId: log.id,
                filePath: log.content.filePath,
                proposedCode: log.content.proposedCode
            });
            toast.success("Arquitetura V10 Consolidada!", { id: tid });
            fetchTelemetry();
        } catch (error) {
            toast.error("Falha na refatoração.", { id: tid });
        }
    };

    const handleHandoff = async (suggestion) => {
        const tid = toast.loading(`Transferindo co-responsabilidade para ${suggestion.targetAgentKey}...`);
        try {
            // O forwardToAgent agora atualiza o agentAssignee no banco (planning.js)
            const res = await forwardToAgent(suggestion.targetAgentKey, suggestion.context, userId);
            if (res.success) {
                toast.success(`${res.assignedAgent} assumiu a tarefa!`, { id: tid });
                fetchTelemetry();
            }
        } catch (error) {
            toast.error("Erro na migração de responsabilidade.", { id: tid });
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* --- HEADER: DASHBOARD DE SAÚDE --- */}
            <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500",
                            auditScore >= 80 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                        )}>
                            <IconZap className={cn("w-5 h-5", auditScore < 80 && "animate-pulse")} />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-0.5">Integridade do Sistema</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-mono font-bold text-white tracking-tighter">{auditScore}%</span>
                                <span className="text-[9px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                    Lego V10 Standard
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Swarm Active</span>
                        </div>
                        <div className="flex gap-1 justify-end">
                            {activeSwarm.map(agent => (
                                <div key={agent} className="w-4 h-4 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[7px] font-bold text-white/40 uppercase" title={agent}>
                                    {agent[0]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEED DE EVENTOS --- */}
            <ScrollArea className="flex-1 px-6">
                <div className="py-8 space-y-8">
                    {logs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
                            <IconTerminal className="w-10 h-10 mb-4" />
                            <p className="text-[10px] uppercase font-mono tracking-[0.3em]">Aguardando atividade neural...</p>
                        </div>
                    )}

                    {logs.map((log) => (
                        <div key={log.id} className="group relative pl-8 border-l border-white/5 animate-in fade-in slide-in-from-left-2 duration-500">
                            {/* Marcador na Timeline */}
                            <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-white/10 border border-white/5 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0)] group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            
                            {/* Identidade do Agente */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border",
                                        log.agentId === 'neo_dev' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : 
                                        log.agentId === 'flor' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                        "bg-white/5 text-slate-400 border-white/10"
                                    )}>
                                        {log.agentId.replace('_', ' ')}
                                    </span>
                                    {log.targetAgentId && (
                                        <>
                                            <IconTarget className="w-3 h-3 text-slate-600" />
                                            <span className="text-[9px] text-slate-500 font-medium">{log.targetAgentId}</span>
                                        </>
                                    )}
                                </div>
                                <span className="text-[8px] font-mono text-slate-600">
                                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {/* Cartão de Evento Contextual */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.04] hover:border-white/10 hover:translate-x-1 duration-300">
                                
                                {/* 1. AUDITORIA DO NEO */}
                                {log.type === 'NEO_AUDIT' && (
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-amber-500/10 rounded-xl h-fit">
                                            <IconAlertTriangle className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-1">Análise de Código</h4>
                                            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{log.content.message}</p>
                                        </div>
                                    </div>
                                )}

                                {/* 2. PROPOSTA DE REFATORAÇÃO */}
                                {log.type === 'REFACTOR_PROPOSAL' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <IconCode className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Upgrade Estrutural Sugerido</span>
                                        </div>
                                        <CodeDiffViewer 
                                            original={log.content.originalCode}
                                            proposed={log.content.proposedCode}
                                            filename={log.content.filePath}
                                            onApprove={() => handleApproveRefactor(log)}
                                            onReject={() => toast.info("Neo: Proposta descartada.")}
                                        />
                                    </div>
                                )}

                                {/* 3. SINCRONIZAÇÃO DA FLOR (BRAND DNA) */}
                                {log.type === 'BRAND_DNA_SYNC' && (
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-rose-500/10 rounded-xl h-fit">
                                            <IconSparkles className="w-4 h-4 text-rose-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-rose-400/80 uppercase tracking-widest mb-1">Sincronização de DNA</h4>
                                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                                A Flor injetou o tom de voz <strong>{log.content.tone}</strong> nesta tarefa.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 4. SUGESTÃO DE HANDOFF */}
                                {log.type === 'COLLAB_SUGGESTION' && (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <IconTarget className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Otimização de Equipe</span>
                                        </div>
                                        <p className="text-[11px] text-slate-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 italic leading-relaxed">
                                            "{log.content.taskContext?.reason}"
                                        </p>
                                        <Button 
                                            onClick={() => handleHandoff(log.content.taskContext)}
                                            className="w-full h-9 text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all"
                                        >
                                            Autorizar Passagem para {log.targetAgentId}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} className="h-4" />
                </div>
            </ScrollArea>

            {/* --- FOOTER: AÇÕES GLOBAIS --- */}
            <div className="p-4 bg-slate-900/40 border-t border-white/5 flex gap-3">
                <Button variant="ghost" className="flex-1 h-10 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl">
                    <IconRefresh className="w-3 h-3 mr-2" /> Telemetria
                </Button>
                <Button variant="ghost" className="flex-1 h-10 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 rounded-xl">
                    <IconBox className="w-3 h-3 mr-2" /> Ver Lego Core
                </Button>
            </div>
        </div>
    );
}
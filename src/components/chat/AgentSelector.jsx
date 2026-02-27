/* src/components/chat/AgentSelector.jsx
   desc: Seletor de Agentes e Gestor de Atribuição V10.
   feat: 
    - Renderização Dinâmica baseada em Sistemas Ativos.
    - Indicador de Co-responsabilidade (agentAssignee).
    - Estética Zen com feedback visual de "presença".
*/
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  IconChat, 
  IconBot, 
  IconCode, 
  IconSparkles 
} from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';
import { useProjectSystems } from '@/hooks/useProjectSystems'; // Hook que verifica o que está pago/ativo

export default function AgentSelector({ 
  activeAgent = 'ash', 
  onAgentChange, 
  projectId,
  currentAssignee, // Novo: ID do agente que "manda" na tarefa agora
  isTaskContext = false 
}) {
    // 🛡️ Buscamos quais sistemas o usuário ativou no Prana Shop para este projeto
    const { systems } = useProjectSystems(projectId);

    // Configuração base de todos os Agentes do Ecossistema
    const allAgents = [
        {
            id: 'ash',
            name: 'Ash',
            icon: IconChat,
            description: 'General IA',
            color: 'from-purple-500 to-pink-500',
            bgClass: 'bg-purple-500/10 border-purple-500/20',
            textClass: 'text-purple-600 dark:text-purple-400',
            systemKey: 'core', // Sempre disponível
        },
        {
            id: 'flor', // Integrando a nossa especialista de BrandCode
            name: 'Flor',
            icon: IconSparkles,
            description: 'Brand & DNA',
            color: 'from-rose-400 to-pink-600',
            bgClass: 'bg-rose-500/10 border-rose-500/20',
            textClass: 'text-rose-600 dark:text-rose-400',
            systemKey: 'brand_code', 
        },
        {
            id: 'neo_dev',
            name: 'Neo',
            icon: IconCode,
            description: 'Dev Specialist',
            color: 'from-indigo-500 to-violet-600',
            bgClass: 'bg-indigo-500/10 border-indigo-500/20',
            textClass: 'text-indigo-600 dark:text-indigo-400',
            systemKey: 'dev_suite',
        },
        {
            id: 'olly',
            name: 'Olly',
            icon: IconBot,
            description: 'Marketing IA',
            color: 'from-blue-500 to-cyan-500',
            bgClass: 'bg-blue-500/10 border-blue-500/20',
            textClass: 'text-blue-600 dark:text-blue-400',
            systemKey: 'marketing_olly',
        }
    ];

    // 🔍 Filtro Lego: Só mostramos agentes cujo sistema esteja 'enabled' ou sejam 'core'
    const availableAgents = allAgents.filter(agent => 
        agent.systemKey === 'core' || systems?.[agent.systemKey]?.status === 'enabled'
    );

    return (
        <div className="flex items-center gap-1.5 bg-background/40 backdrop-blur-md rounded-xl p-1 border border-white/5 shadow-inner">
            {availableAgents.map((agent) => {
                const Icon = agent.icon;
                const isActive = activeAgent === agent.id;
                const isAssignee = currentAssignee === agent.id;

                return (
                    <Button
                        key={agent.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => onAgentChange(agent.id)}
                        className={cn(
                            'relative h-9 px-3 text-xs font-semibold transition-all duration-300 rounded-lg',
                            isActive 
                                ? `${agent.bgClass} border-white/10 shadow-lg scale-105 z-10` 
                                : 'hover:bg-white/5 opacity-40 hover:opacity-80 grayscale hover:grayscale-0',
                            isAssignee && !isActive && "ring-1 ring-white/20" // Destaque sutil para o dono da tarefa
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Icon className={cn(
                                "w-4 h-4 transition-transform duration-500", 
                                isActive ? "scale-110 rotate-0" : "scale-100 opacity-70"
                            )} />
                            
                            {isActive && (
                                <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-2">
                                    <span className={cn("text-[11px] leading-none mb-0.5", agent.textClass)}>
                                        {agent.name}
                                    </span>
                                    <span className="text-[7px] opacity-40 leading-none uppercase tracking-widest font-bold">
                                        {agent.description}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Indicador de "Responsável Atualmente" (O Cisne batendo as patas) */}
                        {isAssignee && (
                            <div className="absolute -top-1 -right-1 flex items-center justify-center">
                                <div className={cn("w-2 h-2 rounded-full animate-ping absolute", `bg-gradient-to-r ${agent.color}`)} />
                                <div className={cn("w-2 h-2 rounded-full relative shadow-sm border border-white/20", `bg-gradient-to-r ${agent.color}`)} />
                            </div>
                        )}
                        
                        {/* Tooltip de Handoff se estivermos em contexto de Task */}
                        {isTaskContext && isActive && !isAssignee && (
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-[8px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Transferir Responsabilidade
                            </div>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
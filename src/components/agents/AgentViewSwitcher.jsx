/* src/components/chat/AgentViewSwitcher.jsx
   desc: Switcher Dinâmico de Interfaces Especializadas (Lego Registry)
   feat: 
    - Injeção da Flor (Narrative Canvas) e Neo (Code Workspace).
    - Suporte a Fluid UI: transição automática baseada no metadata do Agente.
    - Suspense Integrado para Performance (Metáfora do Cisne).
*/
import React, { lazy, Suspense } from 'react';
import { useAgentView } from '@/hooks/useAgentView';
import { PranaLoader } from '../PranaLoader';

// =========================================================
// REGISTRO LEGO: Onde os componentes especializados "nascem"
// =========================================================
const SpecializedComponents = {
    // 🤖 NEO: Especialista em Código e Arquitetura
    'TaskCodeWorkspace': lazy(() => import('../specialists/dev-neo/TaskCodeWorkspace')),
    
    // 🌸 FLOR: Especialista em Conteúdo e Brand DNA (Nosso novo Narrative Canvas)
    'TaskContentWorkspace': lazy(() => import('../specialists/flor-creator/TaskContentWorkspace')),
    
    // 🚀 OLLY: Especialista em Marketing e Growth (Futuro)
    // 'MarketingCampaignStudio': lazy(() => import('../specialists/olly/MarketingStudio')),
};

export function AgentViewSwitcher({ dataType, data, children }) {
    // 🛡️ O hook useAgentView consulta o backend para saber:
    // 1. Quem é o agentAssignee desta tarefa?
    // 2. O usuário tem o sistema habilitado no Prana Shop?
    // 3. Existe um componente de UI registrado para este contexto?
    const { agentView, isLoading } = useAgentView(dataType, data);

    // Estado de Carregamento Silencioso (O Cisne batendo as patas)
    if (isLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <PranaLoader text="Sincronizando ambiente especializado..." />
        </div>
      );
    }

    // =========================================================
    // LÓGICA DE ATIVAÇÃO DA FLUID UI
    // =========================================================
    
    // Se um Agente assumiu a tarefa e enviou metadados de UI:
    if (agentView && agentView.uiMetadata?.component) {
        const componentKey = agentView.uiMetadata.component;
        const Component = SpecializedComponents[componentKey];

        if (Component) {
            return (
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <PranaLoader text={`Invocando mesa de trabalho de ${agentView.name || 'Especialista'}...`} />
                  </div>
                }>
                    {/* ✨ A MÁGICA: O componente especializado substitui a View Padrão.
                       Passamos o 'data' (task) e o 'agent' (metadata + DNA)
                    */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 h-full w-full">
                      <Component 
                        data={data} 
                        task={data} // Garantindo compatibilidade com nomes de props
                        agent={agentView} 
                        brandDna={agentView.brandDna} // Injeção direta da "Alma" no Workspace
                      />
                    </div>
                </Suspense>
            );
        }
    }

    // =========================================================
    // FALLBACK: Mente Zen (O Padrão Prana)
    // =========================================================
    // Se o usuário não tem o agente, se o dado é genérico ou se o 
    // sistema não está pago, renderizamos o 'children' (A View Padrão de Tarefas).
    return (
      <div className="h-full w-full animate-in fade-in duration-500">
        {children}
      </div>
    );
}
/**
 * ExampleFeatureGateUsage.jsx
 * 
 * Exemplos práticos de como usar o sistema de planos
 * em componentes reais
 */

import React from 'react';
import { usePlanValidation } from '@/hooks/usePlanValidation';
import { 
  FeatureGate, 
  FeatureLock, 
  FeatureLockedFallback 
} from '@/components/FeatureGate';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * EXEMPLO 1: Feature Guard Simples
 * Mostrar componente apenas se tem acesso
 */
export function ChatExample() {
  return (
    <FeatureGate 
      feature="chat-ash"
      fallback={<UpgradePrompt feature="Chat com IA" />}
    >
      <ChatWithAsh />
    </FeatureGate>
  );
}

/**
 * EXEMPLO 2: Feature Lock com Overlay
 * Bloqueia visualmente quando não tem acesso
 */
export function AnalyticsExample() {
  return (
    <FeatureLock 
      feature="advanced-analytics"
      title="Analytics Avançado"
      planRequired="Plano Pro ou superior"
    >
      <AdvancedAnalyticsPanel />
    </FeatureLock>
  );
}

/**
 * EXEMPLO 3: Múltiplas Features com AND logic
 * Precisa de TODAS as features
 */
export function TeamCollaborationExample() {
  return (
    <FeatureGate 
      feature={['teams', 'permissions', 'shared-projects']}
      mode="all"
      fallback={<UpgradePrompt feature="Colaboração em Equipe" />}
    >
      <TeamWorkspace />
    </FeatureGate>
  );
}

/**
 * EXEMPLO 4: Múltiplas Features com OR logic
 * Precisa de PELO MENOS UMA feature
 */
export function ChatAgentsExample() {
  return (
    <FeatureGate 
      feature={['chat-ash', 'chat-olly', 'chat-caelum']}
      mode="any"
      fallback={<UpgradePrompt feature="Chat com Agentes" />}
    >
      <AgentSelector />
    </FeatureGate>
  );
}

/**
 * EXEMPLO 5: Validação com Hook
 * Usar hook diretamente para lógica condicional
 */
export function ProjectCreationExample() {
  const { 
    canCreateProject, 
    getMaxProjects, 
    hasAccess,
    getPlanInfo 
  } = usePlanValidation();

  const [projectCount, setProjectCount] = React.useState(0);

  const handleCreateProject = async () => {
    if (!canCreateProject(projectCount)) {
      const max = getMaxProjects();
      toast.error(`Você atingiu o limite de ${max} projetos no seu plano`);
      return;
    }

    // Criar projeto...
    setProjectCount(prev => prev + 1);
    toast.success('Projeto criado!');
  };

  const planInfo = getPlanInfo();

  return (
    <div>
      <Button 
        onClick={handleCreateProject}
        disabled={!canCreateProject(projectCount)}
      >
        Novo Projeto
      </Button>
      <p className="text-sm text-muted-foreground mt-2">
        {projectCount} de {planInfo.limits.maxProjects || '∞'} projetos usados
      </p>
    </div>
  );
}

/**
 * EXEMPLO 6: Feature condicional na UI
 * Mostrar/ocultar opções baseado no plano
 */
export function ViewSelectionExample() {
  const { hasAccess } = usePlanValidation();

  const availableViews = [
    { id: 'planner', label: 'Planner', icon: '📅', available: true },
    { id: 'kanban', label: 'Kanban', icon: '🎯', available: hasAccess('kanban-view') },
    { id: 'calendar', label: 'Calendário', icon: '📆', available: hasAccess('calendar-view') },
    { id: 'mind-map', label: 'Mapa Mental', icon: '🧠', available: hasAccess('mind-map') },
    { id: 'chain', label: 'Chain', icon: '⛓️', available: hasAccess('chain-view') },
  ];

  return (
    <div className="space-y-2">
      {availableViews.map(view => (
        <button
          key={view.id}
          disabled={!view.available}
          className={`w-full p-3 rounded text-left transition-colors ${
            view.available
              ? 'hover:bg-white/10'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <span className="mr-2">{view.icon}</span>
          <span>{view.label}</span>
          {!view.available && (
            <span className="text-xs text-amber-500 ml-2">(Pro+)</span>
          )}
        </button>
      ))}
    </div>
  );
}

/**
 * EXEMPLO 7: Agentes disponíveis
 * Mostrar apenas agentes que o plano tem acesso
 */
export function AgentSelectorExample() {
  const { hasAgent, getAvailableAgents } = usePlanValidation();

  const allAgents = [
    { id: 'ash', name: 'Ash', emoji: '🤖', color: 'cyan' },
    { id: 'olly', name: 'Olly', emoji: '🎯', color: 'orange' },
    { id: 'caelum', name: 'Caelum', emoji: '🌙', color: 'purple' },
    { id: 'sophia', name: 'Sophia', emoji: '💡', color: 'pink' },
  ];

  const availableAgents = allAgents.filter(a => hasAgent(a.id));

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold">
        Agentes disponíveis ({availableAgents.length})
      </div>
      <div className="grid grid-cols-2 gap-2">
        {allAgents.map(agent => (
          <button
            key={agent.id}
            disabled={!hasAgent(agent.id)}
            className={`p-3 rounded border transition-colors ${
              hasAgent(agent.id)
                ? `border-${agent.color}-500/50 hover:bg-${agent.color}-500/10`
                : 'border-white/10 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="text-lg">{agent.emoji}</div>
            <div className="text-sm font-medium">{agent.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * EXEMPLO 8: Upgrade Prompt Customizado
 */
function UpgradePrompt({ feature }) {
  return (
    <FeatureLockedFallback
      title={`${feature} Bloqueado`}
      description={`Atualize seu plano para acessar ${feature.toLowerCase()}`}
      onUpgrade={() => window.location.href = '/pricing'}
    />
  );
}

/**
 * EXEMPLO 9: Feature com validação de limite
 * Tarefa + arquivo = mais restrições
 */
export function TaskWithFilesExample() {
  const { hasAllFeatures, canCreateTask } = usePlanValidation();

  if (!hasAllFeatures(['tasks', 'file-upload'])) {
    return (
      <UpgradePrompt feature="Tarefas com Arquivos" />
    );
  }

  return (
    <div>
      <TaskForm allowFiles={true} />
    </div>
  );
}

/**
 * EXEMPLO 10: Silent mode - ocultar feature completamente
 */
export function EnterpriseFeaturesExample() {
  return (
    <>
      {/* Mostra normalmente */}
      <FeatureGate feature="dashboard" silent>
        <Dashboard />
      </FeatureGate>

      {/* Hidden se não tem acesso (sem fallback) */}
      <FeatureGate feature="webhooks" silent>
        <WebhooksConfig />
      </FeatureGate>

      <FeatureGate feature="api-access" silent>
        <APIConsole />
      </FeatureGate>
    </>
  );
}

// ============================================
// COMPONENTES AUXILIARES (apenas para exemplo)
// ============================================

function ChatWithAsh() {
  return <div>Chat com Ash</div>;
}

function AdvancedAnalyticsPanel() {
  return <div>Analytics Avançado</div>;
}

function TeamWorkspace() {
  return <div>Workspace de Equipe</div>;
}

function AgentSelector() {
  return <div>Seletor de Agentes</div>;
}

function Dashboard() {
  return <div>Dashboard</div>;
}

function TaskForm() {
  return <div>Formulário de Tarefas</div>;
}

function WebhooksConfig() {
  return <div>Configuração de Webhooks</div>;
}

function APIConsole() {
  return <div>Console API</div>;
}

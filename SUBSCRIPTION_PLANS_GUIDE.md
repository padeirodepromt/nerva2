# Sistema de Planos de Assinatura - Guia de Uso

## 📋 Visão Geral

O novo sistema de planos foi estruturado em 3 camadas:

1. **Definição dos Planos** (`plansConfig.js`) - O que cada plano contém
2. **Validação de Acesso** (`usePlanValidation.js`) - Como verificar se usuário tem acesso
3. **UI/UX** (`FeatureGate.jsx` + `AdminPlansPanel.jsx`) - Bloquear/permitir na interface

---

## 🏗️ Arquitetura

### 1. Definição dos Planos (`src/config/plansConfig.js`)

Arquivo central que define:
- **ALL_FEATURES**: Todas as features disponíveis no sistema
- **SUBSCRIPTION_PLANS**: Estrutura de cada plano (free, pro, marketing, enterprise)

Cada plano contém:
```javascript
{
  id: 'pro',
  name: 'Pro',
  description: 'Para produtividade avançada',
  price: 29,
  cycle: 'mensal',
  color: 'blue',
  
  limits: {
    maxProjects: 20,
    maxTasks: 500,
    maxTeamMembers: 3,
    storageGB: 10,
  },
  
  features: [
    'tasks',
    'dashboard',
    'ai-tasks',
    // ... mais features
  ],
  
  agents: ['ash', 'caelum', 'sophia'],
  maxConcurrentChats: 3,
}
```

---

## 🔐 Validação de Acesso (`src/hooks/usePlanValidation.js`)

Hook que fornece métodos para validar acesso do usuário:

### Usar em um componente:

```javascript
import { usePlanValidation } from '@/hooks/usePlanValidation';

function MyComponent() {
  const { 
    hasAccess, 
    getPlanInfo, 
    canCreateProject,
    hasAgent 
  } = usePlanValidation();

  // Checar se tem acesso a uma feature
  if (!hasAccess('ai-tasks')) {
    return <UpgradePrompt />;
  }

  // Checar se pode criar novo projeto (respeita limite)
  if (!canCreateProject(currentProjectCount)) {
    return <LimitReachedPrompt />;
  }

  // Obter agentes disponíveis
  const agents = getAvailableAgents(); // ['ash', 'caelum', 'sophia']

  return <YourComponent />;
}
```

### Métodos disponíveis:

| Método | O que faz |
|--------|----------|
| `hasAccess(feature)` | Verifica se tem acesso a uma feature |
| `hasAllFeatures([...])` | Verifica se tem acesso a TODAS as features (AND) |
| `hasAnyFeature([...])` | Verifica se tem acesso a QUALQUER feature (OR) |
| `getPlanInfo()` | Retorna objeto completo do plano atual |
| `canCreateProject(count)` | Valida limite de projetos |
| `canCreateTask(count)` | Valida limite de tarefas |
| `getMaxProjects()` | Retorna máximo de projetos (ou null se ilimitado) |
| `getMaxTasks()` | Retorna máximo de tarefas (ou null se ilimitado) |
| `getAvailableAgents()` | Retorna lista de agentes disponíveis |
| `hasAgent(agentId)` | Valida se agente está disponível |

---

## 🚪 Bloquear Features na UI (`src/components/FeatureGate.jsx`)

### FeatureGate - Renderização condicional

```javascript
import { FeatureGate } from '@/components/FeatureGate';

// Mostrar conteúdo apenas se tem acesso
<FeatureGate feature="ai-tasks">
  <AITasksComponent />
</FeatureGate>

// Com fallback customizado
<FeatureGate 
  feature="advanced-analytics"
  fallback={<UpgradePrompt />}
>
  <AdvancedAnalytics />
</FeatureGate>

// Múltiplas features (AND - precisa de TODAS)
<FeatureGate 
  feature={['ai-tasks', 'file-upload']}
  mode="all"
>
  <AIWithFiles />
</FeatureGate>

// Múltiplas features (OR - precisa de QUALQUER uma)
<FeatureGate 
  feature={['chat-ash', 'chat-olly']}
  mode="any"
>
  <ChatComponent />
</FeatureGate>

// Silent mode - retorna null se não tem acesso
<FeatureGate feature="enterprise-only" silent>
  <EnterpriseFeature />
</FeatureGate>
```

### FeatureLock - Bloqueio visual

```javascript
import { FeatureLock } from '@/components/FeatureGate';

// Bloqueia visualmente se não tem acesso
<FeatureLock 
  feature="advanced-analytics"
  title="Analytics Avançado"
  planRequired="Plano Pro ou superior"
>
  <AdvancedAnalyticsComponent />
</FeatureLock>
```

### FeatureLockedFallback - Modal de upgrade

```javascript
import { FeatureLockedFallback } from '@/components/FeatureGate';

<FeatureGate 
  feature="biomes"
  fallback={
    <FeatureLockedFallback 
      title="Sistema de Biomas"
      description="Acesse biomas cinematográficos em tempo real"
      onUpgrade={() => navigateToPricing()}
    />
  }
>
  <BiomesComponent />
</FeatureGate>
```

### withFeatureGate - HOC

```javascript
import { withFeatureGate } from '@/components/FeatureGate';

const ProtectedComponent = withFeatureGate(
  MyComponent, 
  'ai-insights'
);

// Agora MyComponent está protegida
<ProtectedComponent {...props} />
```

---

## ⚙️ Admin Panel (`src/components/admin/AdminPlansPanel.jsx`)

Painel para gerenciar os planos:

### Funcionalidades:
- ✅ Visualizar todos os planos
- ✅ Editar features de cada plano
- ✅ Mudar limites (projetos, tarefas, storage, membros)
- ✅ Ajustar preços
- ✅ Selecionar/desselecionar features em massa

### Integração:

1. **Adicionar rota:**
```javascript
// src/routes/AdminRoutes.js ou similar
import AdminPlansPanel from '@/components/admin/AdminPlansPanel';

<Route path="/admin/plans" element={<AdminPlansPanel />} />
```

2. **Adicionar ao menu admin:**
```javascript
// src/components/admin/AdminMenu.jsx
<MenuItem 
  label="Gerenciar Planos" 
  icon={IconSettings}
  onClick={() => navigate('/admin/plans')}
/>
```

---

## 📊 Fluxo Completo de Exemplo

### Cenário: Usuário tenta acessar Chat com IA

```javascript
// 1. Em ChatComponent.jsx
import { usePlanValidation } from '@/hooks/usePlanValidation';
import { FeatureGate, FeatureLockedFallback } from '@/components/FeatureGate';

function ChatUI() {
  const { hasAccess, hasAgent } = usePlanValidation();
  
  return (
    <FeatureGate
      feature="chat-ash"
      fallback={
        <FeatureLockedFallback 
          title="Chat com IA"
          description="Converse com Ash e outros agentes"
          onUpgrade={handleUpgrade}
        />
      }
    >
      <ChatContainer>
        {hasAgent('ash') && <AshChat />}
        {hasAgent('olly') && <OllyChat />}
        {hasAgent('caelum') && <CaelumChat />}
      </ChatContainer>
    </FeatureGate>
  );
}

// 2. Em useAuth.js (ou similar)
// Carregar plano do usuário do Supabase
const user = {
  id: 'user-123',
  subscription_plan: 'pro', // ← Plano do usuário
  // ...
};

// 3. usePlanValidation verifica:
// - Plano do usuário é 'pro'
// - getPlan('pro').features inclui 'chat-ash'?
// - SIM → Renderiza ChatContainer
// - NÃO → Renderiza FeatureLockedFallback
```

---

## 🔄 Fluxo de Admin

```
Admin acessa /admin/plans
    ↓
AdminPlansPanel carrega todos os planos
    ↓
Admin clica em "Editar Plano"
    ↓
Modal abre com opciones:
  - Preço
  - Limites (projetos, tarefas, storage, membros)
  - Features (checkbox de seleção)
    ↓
Admin faz mudanças
    ↓
Admin clica "Salvar Mudanças"
    ↓
plansConfig.js é atualizado
    ↓
Todos os usePlanValidation().hasAccess() 
refletem as mudanças automaticamente
```

---

## 🔄 Integração com Backend (Próximas etapas)

Atualmente tudo está em `plansConfig.js`, mas quando for integrar com banco:

```javascript
// supabase/plans.js
export async function savePlanToDatabase(plan) {
  const { data, error } = await supabase
    .from('subscription_plans')
    .upsert(plan)
    .select();
  
  if (error) throw error;
  return data;
}

export async function loadPlansFromDatabase() {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

E atualizar `usePlanValidation.js` para carregar de lá.

---

## 📝 Checklist de Uso

- [ ] Feature adicionada em `ALL_FEATURES`
- [ ] Feature adicionada aos planos desejados em `SUBSCRIPTION_PLANS`
- [ ] Componente protegido com `<FeatureGate />`
- [ ] Mensagem de upgrade customizada para o usuário
- [ ] Admin pode editar features no painel
- [ ] Mudanças refletem automaticamente na aplicação

---

## 💡 Dicas

1. **Sempre use nomes descritivos para features**
   ```javascript
   // ✅ BOM
   'advanced-analytics'
   'custom-branding'
   'api-access'
   
   // ❌ RUIM
   'feature-1'
   'prem'
   'adv-feat'
   ```

2. **Agrupar features logicamente**
   ```javascript
   // Core
   TASKS: 'tasks',
   DASHBOARD: 'dashboard',
   
   // AI & Agents
   CHAT_ASH: 'chat-ash',
   CHAT_OLLY: 'chat-olly',
   
   // Advanced
   WEBHOOKS: 'webhooks',
   API_ACCESS: 'api-access',
   ```

3. **Sempre validate no backend também** (quando tiver API)
   ```javascript
   // backend/middleware/checkPlan.js
   async function checkPlan(req, res, next) {
     const user = await getUser(req);
     const plan = await getPlan(user.subscription_plan);
     req.userPlan = plan;
     next();
   }
   ```

---

## 📞 Suporte

Se tiver dúvidas sobre alguma feature ou limite, edite `plansConfig.js` e o sistema refletirá automaticamente em toda a aplicação! 🚀

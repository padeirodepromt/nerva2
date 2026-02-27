# 📝 Plano de Integração: Dashboard + LogbookView + DiarioDeBordo

## 📊 Estrutura Atual (Descoberta)

### 1. **Dashboard** (PranaWorkspaceLayout → Dashboard.jsx)
- Mostra WelcomeScreen quando não há projeto
- Renderiza ChatKanbanView, ChatSheetView, ChatMapView, ChatChainView
- Estado controlado por useChatStore

### 2. **DiarioDeBordo** (Página separada em /pages/)
- Tem Sankalpas (intenções)
- Tem CosmicProfile (perfil cósmico)
- Tem MenstrualCycle info
- **Problema:** Não está integrado ao Dashboard

### 3. **LogbookView** (Componente de View em /views/)
- Tem EnergyChart (histórico de energia)
- Rastreamento diário
- Notas/Journaling
- **Problema:** Não está integrado ao Dashboard

---

## 🎯 Estratégia de Integração

### Opção A: Adicionar LogbookView como 5ª View ao Dashboard
```jsx
const viewOptions = [
    { id: 'kanban', icon: IconKanbanSquare, label: 'Kanban' },
    { id: 'sheet', icon: IconTableProperties, label: 'Tabela' },
    { id: 'map', icon: IconNetwork, label: 'Mapa' },
    { id: 'chain', icon: IconWorkflow, label: 'Nexus' },
    { id: 'logbook', icon: IconDiario, label: 'Diário' },  // ← NOVO
];

// No render:
{currentView === 'logbook' && <LogbookView />}
```
**Benefícios:**
- Simples
- Mantém LogbookView independente
- Ativa quando não há projeto selecionado

**Problema:**
- LogbookView é global (não por projeto)

### Opção B: Integrar Sankalpas e Perfil Cósmico como "Dashboard Global"
- Converter WelcomeScreen em uma visão de "Bem-vindo com Contexto"
- Mostrar Sankalpas, Perfil Cósmico, Energia do dia
- **Quando:** Sem projeto selecionado
- **Alternativa:** Primeira aba do Dashboard

**Benefícios:**
- Mantém usuário contextualizado
- Acesso rápido a intenções diárias
- Visualiza estado energético

### ❌ Opção C: Mesclar DiarioDeBordo + Dashboard (NÃO RECOMENDADO)
- Muito complexo
- DiarioDeBordo tem estrutura diferente
- Confundiria propósitos

---

## ✅ RECOMENDAÇÃO FINAL

### Implementação em 2 Fases:

#### **Fase 1: LogbookView no Dashboard (Imediato)**
1. Adicionar LogbookView como 5ª view option
2. Renderizar quando sem projeto OU como view sempre disponível
3. Tempo: ~30 min

#### **Fase 2: Dashboard Global melhorado (Futuro)**
1. Converter WelcomeScreen em ComprehensiveDashboard
2. Incluir Sankalpas, Perfil, Energia
3. Tempo: ~1-2h

---

## 🔧 Implementação - Fase 1

### 1. Importar LogbookView em Dashboard.jsx
```jsx
const LogbookView = React.lazy(() => import('@/views/LogbookView'));
```

### 2. Adicionar ao viewOptions
```jsx
const viewOptions = [
    // ... existing ...
    { id: 'logbook', icon: IconDiario, label: 'Diário' }
];
```

### 3. Adicionar no render
```jsx
{currentView === 'logbook' && (
    <Suspense fallback={<PranaLoader />}>
        <LogbookView />
    </Suspense>
)}
```

### 4. Remover estado local de SmartModal
- ✅ Já feito! (usando store agora)

---

## 📋 Checklist de Dados Reais

```
Dashboard:
- [ ] loadData() carrega Projects, Tasks (dados reais?)
- [ ] TaskNode renderiza dados reais ou mock?
- [ ] ProjectNode renderiza dados reais ou mock?

LogbookView:
- [ ] EnergyState.list() retorna dados reais?
- [ ] Astral data é carregada?
- [ ] Task history funciona?

DiarioDeBordo:
- [ ] UserProfile carrega dados reais?
- [ ] SankalpaEntity carrega dados reais?
- [ ] MenstrualCycle carrega dados reais?
```

---

## 🚨 Problemas Identificados

1. **WelcomeScreen é sempre mostrada?**
   - Verificar condition: `(!currentProject)`
   - Deveria ser: `(!activeProjectId)`

2. **Dados carregados são mocks?**
   - Dashboard.loadData() chama API real?
   - Ou apenas mostra dados do projeto selecionado?

3. **LogbookView data**
   - Carrega do usuário logado ou do projeto?
   - Deve ser global (usuário)

---

## 📊 Próximas Etapas

1. Implementar Fase 1 (adicionar LogbookView ao Dashboard)
2. Verificar dados reais em loadData()
3. Remover mocks de TaskNode/ProjectNode (se houver)
4. Testar integração end-to-end

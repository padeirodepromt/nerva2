# DashboardFiltersDropdown - Integração Completa V8.0

## 🎯 O Problema Anterior

O Dashboard V7.0 mostrava **TUDO**, sempre. Não havia:
- ❌ Minimalismo (muita informação de uma vez)
- ❌ Controle do usuário (mostrar/esconder seções)
- ❌ Experiência progressiva (começar simples, evoluir)

## ✅ A Solução: DashboardFiltersDropdown

Integração completa do dropdown de filtros que permite ao usuário:
- ✅ Mostrar/esconder **grupos inteiros** (Produtividade, Contexto Cósmico, Holístico)
- ✅ Filtrar **seções específicas** dentro de cada grupo
- ✅ "Mostrar Tudo" com um clique

---

## 📊 Estrutura de Filtros

### Grupos Principais (3)
```
1️⃣ PRODUTIVIDADE
   └─ Intenção do Dia (sankalpa)
   └─ Projetos (projects)
   └─ Tarefas Prioritárias (tasks)
   └─ Velocidade / Ações (velocity)

2️⃣ CONTEXTO CÓSMICO
   └─ Contexto Astral (astral)
   └─ Rituais (rituals)

3️⃣ ANALÍTICAS HOLÍSTICAS
   └─ Energia (Stats) (energy)
   └─ Humor (Stats) (mood)
   └─ Nuvem de Tags (tags)
   └─ Insights Ash (ash)
   └─ Ciclo Menstrual (menstrualCycle)
```

---

## 🔄 Fluxo de Integração

### 1️⃣ O Dropdown no Header
```jsx
<DashboardFiltersDropdown 
    filters={filters}              // Estado atual dos filtros
    onFiltersChange={setFilters}   // Callback para atualizar
/>
```

### 2️⃣ Renderização Condicional de KPIs
```jsx
{/* KPIs renderizam apenas se seus filtros estão ativos */}
{(filters?.sankalpa || filters?.velocity || filters?.astral) && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filters?.velocity && <KpiVelocidade />}
        {filters?.projects && <KpiProjetos />}
        {filters?.astral && <KpiAstrologia />}
    </div>
)}
```

### 3️⃣ Renderização Condicional de Projetos
```jsx
{/* Seção de projetos inteira desaparece se projects filter está off */}
{filters?.projects && (
    <DragDropContext onDragEnd={handleDragEnd}>
        {/* ProjectNode + TaskNode */}
    </DragDropContext>
)}
```

### 4️⃣ Renderização Condicional de Tarefas
```jsx
{/* Tarefas aparecem apenas se tasks filter está on E há tarefas soltas */}
{filters?.tasks && looseTasks.length > 0 && (
    <Droppable>
        {/* TaskNode */}
    </Droppable>
)}
```

### 5️⃣ Renderização Condicional de Análises Holísticas
```jsx
{/* Cards holísticos renderizam apenas se temos dados E filtros ativos */}
{holisticStats && (filters?.energy || filters?.mood || filters?.tags || filters?.ash || filters?.menstrualCycle) && (
    <div>
        {filters?.energy && <EnergyStatsCard />}
        {filters?.mood && <MoodStatsCard />}
        {filters?.tags && <TagsCloudCard />}
        {filters?.ash && <AshHolisticInsights />}
        {filters?.menstrualCycle && <MenstrualCycleCard />}
    </div>
)}
```

---

## 🎨 Resultado Visual

### Dashboard Minimalista (Apenas Produtividade)
```
┌─────────────────────────────────────────┐
│ Bom dia, User              [Filtrar ▼]  │
│ Conselho astrológico                    │
│                                         │
│ [Projetos Ativos: 5]                   │
│ [Projetos + Tarefas]                   │
│ [Sem seção Holística, Sem Astrologia]  │
└─────────────────────────────────────────┘
```

### Dashboard Completo (Tudo Ligado)
```
┌─────────────────────────────────────────┐
│ Bom dia, User              [Filtrar ▼]  │
│ Conselho astrológico                    │
│                                         │
│ ⏰ Foco Hoje │ 📊 Projetos │ 🌙 Astrologia
│ [Projetos + Tarefas]                   │
│ [Energia Stats] [Humor] [Tags] [Ash]   │
└─────────────────────────────────────────┘
```

### Dashboard Holístico (Apenas Análises)
```
┌─────────────────────────────────────────┐
│ Bom dia, User              [Filtrar ▼]  │
│ Conselho astrológico                    │
│                                         │
│ [Energia] [Humor] [Tags] [Ash] [Ciclo] │
│ [Sem seção de Projetos]                │
└─────────────────────────────────────────┘
```

---

## 💾 Persistência dos Filtros

Os filtros são **persistidos em localStorage** via `useDashboardPreferences`:

```javascript
// Hook que cuida de salvar/restaurar filtros
const { filters, setFilters, loading } = useDashboardPreferences();

// Quando user muda um filtro:
onFiltersChange = (newFilters) => {
    setFilters(newFilters); // Salva em localStorage automaticamente
}
```

### Dados Salvos
```javascript
localStorage['prana:dashboard-preferences'] = {
    sankalpa: true,
    projects: true,
    tasks: false,           // User desligou tarefas
    velocity: true,
    astral: true,
    rituals: false,         // User desligou rituais
    energy: true,
    mood: true,
    tags: false,            // User desligou nuvem de tags
    ash: true,
    menstrualCycle: false   // User não tem ciclo registrado
}
```

---

## 🔍 Comportamento do Dropdown

### Toggle de Grupo
Quando user clica em **"📊 Produtividade"**, todas as seções do grupo (sankalpa, projects, tasks, velocity) **ligam/desligam juntas**.

### Toggle de Seção Individual
User pode clicar em **"Tarefas Prioritárias"** para desligar apenas aquela seção, mantendo as outras.

### "Mostrar Tudo" / "Esconder Tudo"
Um último item no dropdown que liga/desliga **todas as 11 seções** de uma vez.

---

## 📋 Checklist de Integração

### ✅ DashboardView V8.0
- [x] Importa `DashboardFiltersDropdown`
- [x] Usa `useDashboardPreferences` hook
- [x] KPIs renderizam condicionalmente
- [x] Projetos renderizam condicionalmente
- [x] Tarefas renderizam condicionalmente
- [x] Cards holísticos renderizam condicionalmente
- [x] Sem seções vazias (nunca renderiza vazio)

### ✅ Minimalismo Garantido
- [x] Dashboard começa limpo (usuário escolhe o que ver)
- [x] Controle total do usuário
- [x] Sem "poluição visual"
- [x] Cada seção tem propósito claro

### ✅ Progressive Disclosure
- [x] Novo usuário vê apenas "Projetos"
- [x] Conforme explora, habilita seções
- [x] Dados holísticos carregam apenas se habilitados
- [x] Performance não sofre

---

## 🚀 Casos de Uso

### Caso 1: Usuário GTD (Getting Things Done)
**Ativa apenas**: Projetos, Tarefas, Velocidade
**Vê**: KPIs de produtividade, projetos, tarefas
**Não vê**: Astrologia, energia, humor

### Caso 2: Usuário Holístico
**Ativa apenas**: Energy, Mood, Tags, Ciclo Menstrual
**Vê**: Análises de energia e diários
**Não vê**: Projetos técnicos

### Caso 3: Usuário Equilibrado
**Ativa tudo**
**Vê**: Dashboard completo com tudo integrado

### Caso 4: Usuário Minimalista
**Ativa apenas**: Projetos, Contexto Cósmico
**Vê**: Projetos + Astrologia
**Não vê**: Análises técnicas

---

## 🎯 Prós & Contras

### Prós ✅
- Minimalismo: Usuário controla o que vê
- Performance: Carrega menos dados
- Progressivo: Começar simples, evoluir
- Intuitivo: Dropdown com grupos organiza tudo
- Persistente: Lembra preferências do user

### Contras ❌
- Novo usuário pode não descobrir "Filtrar" no início
- Poderia haver tour/onboarding para apresentar recurso

### Solução
**Adicionar tooltip no Filtrar Dashboard** ou **onboarding light** quando user acessa pela primeira vez.

---

## 🔗 Arquivos Envolvidos

1. **[/src/views/DashboardView.jsx](../src/views/DashboardView.jsx)**
   - Renderização condicional baseada em filtros
   - Integração de `useDashboardPreferences`

2. **[/src/components/dashboard/DashboardFiltersDropdown.jsx](../src/components/dashboard/DashboardFiltersDropdown.jsx)**
   - Dropdown com 3 grupos + 11 seções
   - Toggle de grupo e seção individual
   - "Mostrar Tudo" / "Esconder Tudo"

3. **[/src/hooks/useDashboardPreferences.js](../src/hooks/useDashboardPreferences.js)**
   - Hook que gerencia estado + localStorage
   - Salva/restaura preferências automaticamente

---

## 📖 Próximos Passos

### V8.1 (Curto Prazo)
- [ ] Adicionar tooltip ao botão "Filtrar"
- [ ] Onboarding light (primeira vez)
- [ ] Ícones visuais para cada grupo

### V9.0 (Médio Prazo)
- [ ] Presets de filtros (Produtividade, Holístico, etc)
- [ ] Salvar múltiplos presets
- [ ] Compartilhar presets entre dispositivos

---

## ✨ Conclusão

O **DashboardFiltersDropdown** transforma o Dashboard de "mostra tudo sempre" para "mostra o que você quer, quando você quer".

**Resultado**: Prana não é poluído, é minimalista, e cada usuário customiza sua experiência.

🎉 **Minimalismo + Controle = UX Vencedora**

# 🧠 Visão Corrigida: SmartModal + Inbox como Hub Central

## 🎯 As 3 Dúvidas Esclarecidas

### 1️⃣ SmartModal "INTELIGENTE" (Análise de Intenção)

**Conceito:**
O SmartModal deveria funcionar como um **analisador de intenção**. Quando usuário digita "Manifestar com Ctrl+K", o sistema:

```
Input do usuário: "Preciso criar uma landing page para o novo produto"
    ↓
[ANÁLISE INTELIGENTE - Ash]
├─ Detecta verbs: "criar"
├─ Detecta keywords: "landing page", "produto" → PROJECT
├─ Resultado: itemType = 'project'
├─ Score: Muito confiante (95%)
└─ Campos pré-preenchidos: title = "landing page para o novo produto"
    ↓
[RESULTADO]
PranaFormModal abre com itemType='project'
└─ Usuário só refina os detalhes
```

**Exemplos de Detecção:**
```
"Devo lembrar de fazer TPS" 
  → THOUGHT (low priority, lembrança)
  
"Criar documento sobre workflow"
  → DOCUMENT (explicit: criar documento)
  
"Fazer lista de compras"
  → TASK (ação executável)
  
"Novo projeto de redesign"
  → PROJECT (explicit: novo projeto)
```

**Stack:**
- 🟢 **Verbo Analysis:** criar, fazer, lembrar, notar...
- 🟢 **Keyword Detection:** projeto, documento, tarefa, ideia...
- 🟢 **Context:** projeto atual, situação...
- 🟢 **Confidence Score:** quão certo o Ash está

---

### 2️⃣ SmartModal "GERA" Dois Fluxos

**Fluxo A: SmartModal → PranaFormModal (Inteligente)**
```
User digita "Ctrl+K"
    ↓
SmartCreationModal abre (input simples)
    ↓
[User digita]: "Preciso fazer uma apresentação para segunda"
    ↓
Ash analisa intenção
    ├─ Detecta: TASK + urgência "segunda" 
    ├─ Confiança: 95%
    └─ Resultado: itemType='task', dueDate='next-monday'
    ↓
SmartModal FECHA
    ↓
PranaFormModal ABRE com:
├─ itemType='task'
├─ defaultValues={
│   title: "Fazer apresentação para segunda",
│   dueDate: "2025-12-15",
│   priority: 'high'  ← Inferido do "segunda"
│ }
└─ User pode refinar e salvar
    ↓
Task criada com todos os detalhes
```

**Fluxo B: Quick Create Buttons (Rápido e Direto)**
```
User clica em:
├─ Faísca → cria Thought rapidinho (status='inbox')
├─ Tarefa → abre PranaFormModal direto (itemType='task')
├─ Projeto → abre PranaFormModal direto (itemType='project')
└─ Documento → abre PranaFormModal direto (itemType='doc')

Sem análise inteligente, sem delay.
```

**Diferença:**
```
INTELIGENTE (Ctrl+K)     RÁPIDO (Botões)
─────────────────────────────────────────
Análise Ash             Nenhuma análise
Detecção de tipo        Tipo pré-determinado
Pré-preenchimento       Formulário vazio
Mais lento              Muito rápido
Mais completo           Sem frills
```

---

### 3️⃣ Dois Caminhos de Criação

```
┌─────────────────────────────────────────────────────────────┐
│                    CRIAR ALGO NOVO                          │
└────────────┬───────────────────────────────┬────────────────┘
             │                               │
             │                               │
    ┌────────▼────────┐          ┌──────────▼──────────┐
    │  MANIFESTAR     │          │  CRIAÇÃO RÁPIDA    │
    │  (Ctrl+K)       │          │  (Sidebar Buttons) │
    │                 │          │                    │
    │ SmartModal +    │          │ Direto para        │
    │ Ash Intelligence│          │ PranaFormModal     │
    │                 │          │                    │
    │ Fluxo:          │          │ Fluxo:             │
    │ 1. Input        │          │ 1. Button click    │
    │ 2. Análise      │          │ 2. Tipo fixo       │
    │ 3. Detecção     │          │ 3. Form vazio      │
    │ 4. FormModal    │          │ 4. User preenche   │
    │ 5. Salva        │          │ 5. Salva           │
    │                 │          │                    │
    │ Resultado:      │          │ Resultado:         │
    │ Completo        │          │ Rápido             │
    └─────────────────┘          └────────────────────┘
    
    Uso: Quando não sabe     Uso: Sabe exatamente
    o que criar exatamente   o que e como quer
```

---

### 4️⃣ INBOX como Hub Central (Não só Thoughts!)

**Conceito Revolucionário:**
Inbox não é só para Thoughts/Sparks. É um **collector universal** de "coisas incompletas":

```
┌──────────────────────────────────────────────────────┐
│                    INBOX ZERO                        │
│         (Lugar onde "jogamos" coisas)               │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─ THOUGHTS (Ideias Soltas)                       │
│  │  └─ "Criar newsletter design"                   │
│  │                                                  │
│  ├─ TASKS (Sem Contexto/Projeto)                   │
│  │  └─ "Responder emails" (project_id = null)      │
│  │                                                  │
│  ├─ DOCUMENTS (Incompletos/Drafts)                 │
│  │  └─ "Especificação da API v2" (draft status)    │
│  │                                                  │
│  ├─ PROJECTS (Ideias de Projeto)                   │
│  │  └─ "Novo sistema de recomendações" (pending)   │
│  │                                                  │
│  └─ [FUTURE] OUTROS TIPOS                          │
│     └─ Eventos soltos, Acordos, etc.               │
│                                                      │
└──────────────────────────────────────────────────────┘
        │
        └─→ PROCESSAMENTO
            ├─ Ash analisa tudo
            ├─ User decide o que fazer
            ├─ Promove/Descarta/Arquiva
            └─ Organiza no sistema
```

**Exemplo Real:**
```
User "joga" na Inbox:
1. "Ideias para o blog"           → THOUGHT
2. "Chamar cliente sobre proposta" → TASK (sem projeto)
3. "Draft do contrato"            → DOCUMENT (incompleto)
4. "Novo CMS para o site"         → PROJECT (idea)

Depois, em uma revisão semanal:
├─ Thought 1 → Promove para TASK: "Escrever post blog"
├─ Task 2 → Move para PROJETO: "Sales" 
├─ Document 3 → Completa e publica
└─ Project 4 → Descarta (não prioritário)
```

---

## 🏗️ Arquitetura Revisada

### SmartCreationModal (Novo Design)

**Props:**
```javascript
isOpen: boolean
onClose: function
smartModalContext: null  // Sempre null para manifestar
```

**Responsabilidades:**
```
1. [INPUT] Recebe texto do usuário
2. [ANALYSIS] Envia para Ash (ou parser local)
3. [DETECTION] Recebe itemType + confidence + suggestions
4. [ROTEAMENTO] Abre PranaFormModal com itemType correto
5. [FECHAMENTO] Se usuário cancela em PranaFormModal, volta
```

**Código conceitual:**
```javascript
const handleManifest = async (userInput) => {
    // 1. Análise inteligente
    const analysis = await Ash.analyze(userInput);
    // {
    //   itemType: 'task' | 'project' | 'thought' | 'document',
    //   confidence: 0.95,
    //   defaultValues: { title, dueDate, priority, ... }
    // }
    
    // 2. Roteamento
    if (analysis.confidence > 0.7) {
        // Muito confiante, abre form direto
        openPranaFormModal({
            itemType: analysis.itemType,
            defaultValues: analysis.defaultValues
        });
    } else if (analysis.confidence > 0.4) {
        // Moderadamente confiante, oferece opções
        showSuggestions(analysis.suggestions);
    } else {
        // Não entendeu, pede confirmação
        askUser("O que você quer criar?", options);
    }
    
    closeSmartModal();
};
```

---

### PranaFormModal (Dispatcher)

**Responsabilidades:**
```javascript
Recebe: itemType + defaultValues
    ↓
if (itemType === 'task') 
    → Abre TaskWorkspaceOverlay
else if (itemType === 'thought')
    → Abre formulário simples para Thought
else if (itemType === 'project')
    → Abre formulário de Projeto
else if (itemType === 'document')
    → Abre editor de Documento
    
Salva com tipo correto
```

---

### InboxView (Novo Conceito)

**Responsabilidades:**
```javascript
Carrega de MÚLTIPLAS FONTES:
    ├─ Tasks com status='inbox'
    ├─ Documents com status='draft'
    ├─ Thoughts (se separadas de Tasks)
    ├─ Projects com status='pending'
    └─ [Future] Outros tipos

Renderiza em CATEGORIAS:
    ├─ 🔥 Thoughts (Ideias)
    ├─ ✅ Tasks (Ações)
    ├─ 📄 Documents (Documentos)
    └─ 📦 Projects (Projetos)

Oferece AÇÕES:
    ├─ Editar / Refinar
    ├─ Categorizar / Mover
    ├─ Promover / Downgrade
    ├─ Arquivar / Descartar
    └─ Analisar com Ash
```

**Exemplo de renderização:**
```jsx
<div className="inbox-container">
    {/* Seção de Thoughts */}
    <InboxCategory
        title="Ideias"
        icon={IconNeural}
        items={sparks}
        actions={['edit', 'promoteToTask', 'promoteToProject', 'delete']}
    />
    
    {/* Seção de Tasks */}
    <InboxCategory
        title="Tarefas Sem Contexto"
        icon={IconCheckCircle}
        items={orphanTasks}
        actions={['edit', 'moveToProject', 'setDueDate', 'archive']}
    />
    
    {/* Seção de Documents */}
    <InboxCategory
        title="Documentos Incompletos"
        icon={IconFileText}
        items={draftDocs}
        actions={['edit', 'publish', 'moveToProject', 'delete']}
    />
    
    {/* Seção de Projects */}
    <InboxCategory
        title="Ideias de Projeto"
        icon={IconLayers}
        items={pendingProjects}
        actions={['edit', 'launch', 'archive', 'delete']}
    />
</div>
```

---

## 📊 Fluxos Completos

### Fluxo 1: Manifestar Inteligente (Com Ash)
```
User: Ctrl+K
SmartModal: "O que você quer criar?"
User: "Preciso fazer uma apresentação para a reunião de segunda"
    ↓
[ASH ANALISA]
Detecta:
├─ Verbo: "fazer" → ACTION
├─ Tipo: "apresentação" → TASK
├─ Data: "segunda" → dueDate
├─ Urgência: "reunião" → HIGH PRIORITY
└─ Confiança: 95%
    ↓
SmartModal FECHA
    ↓
PranaFormModal ABRE com:
{
  itemType: 'task',
  defaultValues: {
    title: "Fazer apresentação para a reunião de segunda",
    dueDate: "2025-12-15",
    priority: 'high',
    description: ""
  }
}
    ↓
User refina (ou aceita defaults)
    ↓
Task criada corretamente em "Tarefas"
```

### Fluxo 2: Criação Rápida de Thought
```
User: Clica botão "Faísca"
    ↓
SmartModal ABRE (sem análise)
    ↓
User: "Design da nova landing"
    ↓
SmartModal.handleCreate():
Task.create({
  title: "Design da nova landing",
  status: 'inbox',
  itemType: 'thought',
  project_id: null
})
    ↓
Thought aparece em InboxView
    ↓
User vê em "Caixa de Entrada" e depois processa
```

### Fluxo 3: Organizar Inbox (Com Ash)
```
User: Abre InboxView
    ↓
Vê tudo misturado:
├─ "Design da landing" (thought)
├─ "Responder emails" (task orfã)
├─ "API spec v2" (document draft)
└─ "Sistema de recomendações" (project idea)
    ↓
User: Clica em "Analisar com Ash"
    ↓
Ash sugere:
1. "Design da landing" → Promote to Task: "Fazer design da landing"
2. "Responder emails" → Move para Project: "Sales"
3. "API spec v2" → Edit & Publish
4. "Sistema..." → Archive ou Delete
    ↓
User confirma sugestões
    ↓
Tudo reorganizado
```

---

## ✅ Checklist de Implementação

### Fase 1: Estrutura Base (Já feita)
- [x] SmartCreationModal existe
- [x] PranaFormModal existe
- [x] TaskWorkspaceOverlay existe
- [x] InboxView existe

### Fase 2: Integração (Precisa fazer)
- [ ] SmartCreationModal → PranaFormModal (roteamento)
- [ ] PranaFormModal discrimina por itemType
- [ ] InboxView suporta múltiplos tipos
- [ ] Endpoints para carregar de múltiplas sources

### Fase 3: Inteligência (Ash)
- [ ] Parser local simples (regex, keywords)
- [ ] Integração com Ash backend
- [ ] Análise de intenção
- [ ] Sugestões inteligentes

### Fase 4: Polish
- [ ] UX/UI de InboxView
- [ ] Transições entre modais
- [ ] Feedback visual
- [ ] Testes

---

## 💡 Resumo da Visão

| Aspecto | Antes | Agora |
|---------|-------|-------|
| SmartModal | Cria direto | Analisa + roteia |
| PranaFormModal | Ignorado | Centro do fluxo |
| Inbox | Só Thoughts | Hub universal |
| Criação | Confusa | 2 caminhos claros |
| Inteligência | Não existe | Ash analisa intenção |
| Tipos | Task only | Task, Thought, Project, Doc |

**Visão:** Um **Prana IQ** que entende o que você quer criar e te guia para o fluxo certo!

# 🏗️ CAPÍTULO 11C: ENTIDADES DO PRANA - MAPA COMPLETO

**Versão:** 1.0 | **Capítulo:** 11C | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo descreve **cada entidade do Prana** - o que é, quando usar, como se relaciona com as outras:

- 🏢 **Projeto** (Umbrella contêiner)
- 📅 **Fase** (Etapas dentro de um projeto)
- ✅ **Task** (Ação a fazer)
- 🎪 **Spark** (Ideia rápida capturada)
- 📅 **Evento** (Momento marcado)
- ✓ **Checklist** (Processo repetível)
- 📄 **Documento** (Conhecimento capturado + 8 subtipos)
- 🔗 **Relacionamentos** (Como se conectam)

**Público:** Todos (especialmente novos usuários)  
**Tempo de leitura:** 25 minutos  
**Pré-requisito:** [Capítulo 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md)

---

## 🎯 VISÃO GERAL HIERÁRQUICA

```
┌─────────────────────────────────────────────────┐
│ WORKSPACE (Você, seu sistema)                   │
│                                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ PROJECT (RAIZ): "UI Redesign"              │ │
│  │ (parent_project_id = NULL)                 │ │
│  │ (Umbrella que contém tudo)                 │ │
│  │                                            │ │
│  │ ┌─────────────────────────────────────┐   │ │
│  │ │ SUBPROJECT (Fase): "Planning"       │   │ │
│  │ │ (parent_project_id = UI Redesign)   │   │ │
│  │ │ ├─ TASK: Create requirements       │   │ │
│  │ │ ├─ TASK: Define scope              │   │ │
│  │ │ ├─ DOCUMENT: Project Charter       │   │ │
│  │ │ ├─ SPARK: New feature idea         │   │ │
│  │ │ └─ CHECKLIST: Planning checklist   │   │ │
│  │ └─────────────────────────────────────┘   │ │
│  │                                            │ │
│  │ ┌─────────────────────────────────────┐   │ │
│  │ │ SUBPROJECT (Fase): "Design"         │   │ │
│  │ │ (parent_project_id = UI Redesign)   │   │ │
│  │ │ ├─ TASK: Design dashboard          │   │ │
│  │ │ ├─ EVENT: Design review (Jan 20)   │   │ │
│  │ │ ├─ DOCUMENT: Design system         │   │ │
│  │ │ ├─ CHECKLIST: Design QA            │   │ │
│  │ │ └─ TASK: Accessibility audit       │   │ │
│  │ └─────────────────────────────────────┘   │ │
│  │                                            │ │
│  │ ┌─────────────────────────────────────┐   │ │
│  │ │ SUBPROJECT (Fase): "Implementation" │   │ │
│  │ │ (parent_project_id = UI Redesign)   │   │ │
│  │ │ ├─ TASK: Code backend              │   │ │
│  │ │ ├─ TASK: Code frontend             │   │ │
│  │ │ ├─ EVENT: Standup (recurring)      │   │ │
│  │ │ ├─ DOCUMENT: API docs              │   │ │
│  │ │ └─ CHECKLIST: Code review          │   │ │
│  │ └─────────────────────────────────────┘   │ │
│  │                                            │ │
│  │ Arquivo permanente de TUDO                │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  + Outros projetos raiz (múltiplos)           │
│  + Sparks não conectados (inbox)               │
│  + Diários (Papyrus - separado)                │
└─────────────────────────────────────────────────┘
```

**Clarificação Crítica:**
- **Projeto Raiz** = Tem `parent_project_id = NULL`
- **Subprojeto (Fase)** = Tem `parent_project_id = ID do projeto raiz`
- **Tudo é da tabela `projects`** - Fases não existem como entidade, são projetos aninhados

---

## 🏢 PROJETO

### O que é?

**Projeto é o CONTÊINER PRINCIPAL** de tudo em Prana. É uma "umbrella" que agrupa trabalho relacionado em contexto único.

### Características

| Propriedade | O que é | Exemplo |
|-------------|---------|---------|
| **Nome** | Identificação | "UI Redesign", "Q1 2025 Goals", "Write a Book" |
| **Descrição** | Contexto | "Redesign the dashboard to improve UX" |
| **Status** | Estado | Planning, In Progress, Completed, Archived |
| **Ícone** | Visual rápido | 🎨, 🚀, 📚, 💼, etc |
| **Cor** | Identidade visual | Azul, Verde, Vermelho, etc |
| **Data Início** | Quando começou | 2025-01-15 |
| **Data Fim** | Deadline | 2025-03-31 |
| **Fases** | Estrutura interna | Planning → Design → Dev → QA → Launch |

### Quando usar Projeto?

✅ **Crie um projeto para:**
- Projeto de trabalho grande (redesign, feature, produto novo)
- Objetivo de longo prazo (meta, livro, curso)
- Escopo claro de começo, meio e fim
- Trabalho que se estende por semanas/meses
- Contexto que agrupa múltiplas tarefas relacionadas

❌ **NÃO crie projeto para:**
- Uma tarefa única (use Task direto)
- Coisa pequena que faz hoje (use Task)
- Ideias soltas (use Spark)
- Eventos pontuais (use Evento)

### Exemplo Real

```
Projeto: "Lançar Newsletter"
├─ Fase: Planning (1 semana)
│  ├─ Task: Define audience
│  ├─ Task: Choose platform
│  └─ Document: Newsletter style guide
├─ Fase: Content (2 semanas)
│  ├─ Task: Write issue 1
│  ├─ Event: Deadline (Jan 25)
│  └─ Checklist: Content QA
└─ Fase: Launch (1 dia)
   ├─ Task: Schedule send
   ├─ Task: Monitor engagement
   └─ Event: Launch day
```

---

## 📅 FASE (Subprojeto)

### O que é?

**Fase é um SUBPROJETO aninhado dentro de um Projeto**. Não é uma entidade separada, é um Projeto que tem um `parent_project_id` apontando para outro Projeto.

**Estrutura Real no Banco de Dados:**
```
Tabela: projects
├─ id: "proj_123" | name: "UI Redesign"
│  └─ parent_project_id: NULL (é o projeto raiz)
│
├─ id: "proj_124" | name: "Planning"
│  └─ parent_project_id: "proj_123" (logo, é FASE 1)
│
├─ id: "proj_125" | name: "Design"
│  └─ parent_project_id: "proj_123" (logo, é FASE 2)
│
└─ id: "proj_126" | name: "Implementation"
   └─ parent_project_id: "proj_123" (logo, é FASE 3)
```

**Tudo é `projects`. Fases são apenas projetos com parent.**

### Características (Subprojeto)

| Propriedade | O que é | Exemplo |
|-------------|---------|---------|
| **Nome** | Identificação | "Planning", "Design", "Development" |
| **Parent Project ID** | Qual projeto contém | "proj_123" (aponta para projeto raiz) |
| **Status** | Estado | Not started, In Progress, Completed |
| **Artefatos** | Tarefas dentro | Tasks, Events, Documents, Checklists |
| **Sort Order** | Posição entre irmãs | 1, 2, 3 (ordena as fases) |

### Quando usar Fase (Subprojeto)?

✅ Quebra projeto em **etapas lógicas**:
- Planning → Design → Development → Testing → Launch
- Discovery → Ideation → Prototyping → Validation
- Research → Writing → Editing → Publishing

Cada fase/subprojeto agrupa artefatos similares e passa por estado de "not started" → "in progress" → "done"

### Exemplo Real (Hierarquia Correta)

```
PROJECT RAIZ: "Write Blog Post"
├─ SUBPROJETO (Fase 1): "Research"
│  ├─ Task: Find 10 sources
│  ├─ Task: Read and annotate
│  └─ Document: Research notes
├─ SUBPROJETO (Fase 2): "Writing"
│  ├─ Task: Outline structure
│  ├─ Task: Write draft
│  └─ Document: First draft
├─ SUBPROJETO (Fase 3): "Editing"
│  ├─ Task: Self-review
│  ├─ Task: Grammar check
│  └─ Checklist: Editing checklist
└─ SUBPROJETO (Fase 4): "Publishing"
   ├─ Task: Format for blog
   ├─ Event: Publish date (Jan 30)
   └─ Document: Published version
```

**Nota:** Cada "Fase" é na verdade um Projeto com `parent_project_id` = projeto raiz

---

## ✅ TASK

### O que é?

**Task é uma AÇÃO com deliverable**. Algo que você faz e completa.

### Características

| Propriedade | O que é | Exemplo |
|-------------|---------|---------|
| **Título** | O que fazer | "Design dashboard mockup" |
| **Descrição** | Contexto/detalhes | "Create low-fidelity wireframes" |
| **Status** | Progresso | To-do → In Progress → Done |
| **Prioridade** | Importância | 1 (baixa) a 5 (crítica) |
| **Energia** | Quanto exige | Baixa, Média, Alta |
| **Tempo estimado** | Quantas horas | 2h, 4h, 8h, 1 dia, etc |
| **Data vencimento** | Prazo | 2025-01-20 |
| **Tags** | Categorias | "design", "frontend", "urgent" |
| **Arquivo** | Permanece após completo | ✅ Sim (para aprender) |

### Quando usar Task?

✅ **Crie uma task para:**
- Ação que precisa fazer
- Deliverable claro ("completar algo")
- Algo que pode ser marcado como "Done"
- Trabalho que leva horas/dias
- Item que você quer rastrear

❌ **NÃO use Task para:**
- Mero lembrete (use Note/Diário)
- Momento específico no tempo (use Evento)
- Processo repetível (use Checklist)
- Conhecimento/aprendizado (use Document)

### Exemplo Real

```
Task: "Design mobile mockup"
├─ Descrição: Create low-fidelity wireframes for mobile version
├─ Status: In Progress (50% done)
├─ Prioridade: 4 (High)
├─ Energia: Alta (requer foco profundo)
├─ Tempo estimado: 4 horas
├─ Prazo: 2025-01-22
├─ Tags: design, mobile, ui
├─ Fase: Phase 2 - Design
├─ Projeto: UI Redesign
└─ Arquivo: ✅ Sim (fica registrado quando completo)
```

---

## 🎪 SPARK

### O que é?

**Spark é uma IDEIA RÁPIDA capturada**. Não é organized yet, é just a thought to preserve.

### Características

| Propriedade | O que é | Exemplo |
|-------------|---------|---------|
| **Conteúdo** | A ideia | "Feature: drag-and-drop for views" |
| **Formato** | Como expressou | Texto, nota de voz, sketch |
| **Categoria** | Tipo de ideia | Feature, Bug, Improvement, Design |
| **Status** | Estado | Inbox, Reviewed, Converted to Project |
| **Convertido em** | Se virou task/project | Task "Implement drag-drop", Project "Redesign" |

### Quando usar Spark?

✅ **Crie um Spark para:**
- Ideia que vem na sua cabeça (qualquer hora, qualquer lugar)
- Pensamento rápido que não quer perder
- Sugestão de feature
- Bug encontrado (captura rápida)
- Melhoria pensada
- Insight durante reunião

✅ **Spark é pensado para ser CONVERTIDO em:**
- Task (se é ação concreta)
- Projeto (se é grande escopo)
- Document (se é conhecimento)
- Descartado (se decidir não fazer)

### Fluxo do Spark

```
1. CAPTURAR
   └─ Usuário tem ideia
   └─ Expressa em qualquer formato (fala, texto, sketch)

2. INBOX (não revisado ainda)
   └─ Spark fica em inbox de ideias

3. REVISAR
   └─ Mais tarde, usuário/Ash revisa
   └─ Valida se vale a pena

4. CONVERTER OU DESCARTAR
   └─ Opção A: Vira Task/Project (entra em Project Hierarchy)
   └─ Opção B: Descarta (remove do inbox)

5. ARQUIVO PERMANENTE
   └─ Se convertido: fica registrado na history
   └─ Se descartado: fica marcado como "rejected"
```

### Exemplo Real

```
Spark: "New idea during shower"
├─ Conteúdo: "Create color palette templates - users spent 20min choosing colors"
├─ Categoria: Feature
├─ Status: Inbox (pending review)

DEPOIS:
  Ash analisa: "Essa feature economiza 20min/user. Vale!"
  
  Converte em Projeto: "Color Palette Templates"
  └─ Fase 1: Design templates
  └─ Fase 2: Implement in code
  └─ Fase 3: Launch

  Original Spark fica arquivado com referência ao projeto
```

---

## 📅 EVENTO

### O que é?

**Evento é um MOMENTO MARCADO** no tempo. Quando algo acontece (meeting, deadline, festa, aniversário).

### Características

| Propriedade | O que é | Exemplo |
|-------------|---------|---------|
| **Título** | O que é | "Design Review Meeting", "Project Deadline" |
| **Data/Hora** | Quando | 2025-01-20 14:00 |
| **Duração** | Quanto tempo | 1 hora, 30 minutos |
| **Recorrência** | Se repete | Uma vez, Diário, Semanal, Mensal |
| **Participantes** | Quem está | João, Maria, Dev team |
| **Localização** | Onde | Zoom link, Sala A, Virtual |
| **Descrição** | Contexto | "Weekly sync to review progress" |
| **Arquivo** | Permanece após passar | ✅ Sim (para retrospectiva) |

### Quando usar Evento?

✅ **Crie um Evento para:**
- Reunião agendada
- Deadline fixo (data que não muda)
- Momento marcado na agenda
- Evento recorrente (daily standup, weekly review)
- Aniversário, festas, blocos de tempo
- Apresentação, conferência, webinar

❌ **NÃO use Evento para:**
- Tarefa que vira algo (use Task)
- Processo repetível (use Checklist)
- Conhecimento (use Document)

### Exemplo Real

```
Evento: "Design Review Meeting"
├─ Data: 2025-01-20
├─ Hora: 14:00-15:00
├─ Recorrência: Weekly (every Monday)
├─ Participantes: Design team, Product Manager
├─ Localização: Zoom - zoom.us/designreview
├─ Descrição: Weekly sync to review design progress
├─ Tags: design, review, meeting
└─ Fase: Design Phase (Project "UI Redesign")

HISTÓRICO:
├─ 2025-01-13: Happened (noted: 2 blockers found)
├─ 2025-01-20: Upcoming
├─ 2025-01-27: Upcoming
└─ ...
```

---

## ✓ CHECKLIST

### O que é?

**Checklist é um PROCESSO REPETÍVEL**. Uma série de passos que você faz frequentemente (sempre na mesma ordem).

### Características

| Propriedade | O que é | Exemplo |
|-------------|---------|---------|
| **Título** | Nome do processo | "Code Review Checklist", "Weekly Planning" |
| **Items** | Passos | [ ] Step 1, [ ] Step 2, ... |
| **Status** | Quão longe | 0/10, 5/10, 10/10 |
| **Frequência** | Quanto usa | Uma vez, Diário, Semanal, Mensal, Conforme necessário |
| **Tempo** | Quanto leva | 30 minutos, 1 hora, etc |
| **Template** | Pode repetir | ✅ Sim (cada uso cria nova instância) |
| **Arquivo** | Permanece | ✅ Sim (registra cada execução) |

### Quando usar Checklist?

✅ **Crie um Checklist para:**
- Processo repetível (semanal planning, code review, onboarding)
- Série de passos na ordem
- Qualidade control / QA
- Procedimento standard
- Template que reutiliza

❌ **NÃO use Checklist para:**
- Tarefa única (use Task)
- Ideia (use Spark)
- Conhecimento (use Document)
- Momento no tempo (use Evento)

### Exemplo Real

```
Checklist: "Weekly Planning"
├─ Frequência: Weekly (every Sunday)
├─ Tempo: 45 minutes
├─ Steps:
│  ├─ [ ] Review completed tasks from last week
│  ├─ [ ] Capture new ideas from week
│  ├─ [ ] Prioritize top 5 for next week
│  ├─ [ ] Check energy patterns and adjust
│  ├─ [ ] Schedule blockers/events
│  ├─ [ ] Set sankalpa (intention) for week
│  └─ [ ] Archive old notes
│
└─ HISTÓRICO (cada uso):
   ├─ 2025-01-12 (last Sunday): 8/8 completed
   ├─ 2025-01-19 (this Sunday): 6/8 (skipped 2 steps)
   └─ 2025-01-26 (next Sunday): pending
```

---

## 📄 DOCUMENTO

### O que é?

**Documento é CONHECIMENTO CAPTURADO**. Aprendizado, referência, ideia elaborada, resultado que quer preservar.

### Características

| Propriedade | O que é | Exemplo |
|-------------|---------|---------|
| **Título** | Nome | "Design System", "Research Notes", "API Docs" |
| **Conteúdo** | Texto/rich | Markdown, notas, imagens, links |
| **Tipo** | Subtipo | Guia, Tutorial, Reference, Spec, Notes, etc |
| **Status** | Estado | Draft, Reviewing, Published, Archived |
| **Tags** | Categorias | "design", "api", "learning", etc |
| **Relacionado a** | Ligações | Task "Design dashboard", Projeto "UI Redesign" |
| **Data Criado** | Quando | 2025-01-15 |
| **Data Atualizado** | Última edit | 2025-01-19 |
| **Arquivo** | Permanece | ✅ Sim (forever) |

### 6 Tipos de Documento (Reais)

Cada documento tem um TIPO específico. Estes são os tipos realmente presentes em Prana:

| Tipo | O que é | Exemplo | Campos Especiais |
|------|---------|---------|------------------|
| **note** | Anotação simples | "Research findings", "Quick thoughts" | Nenhum (padrão) |
| **diary** | Entrada de diário (Papyrus) | "Today's reflection", "Weekly review" | energyLevel, mood, tags, insights |
| **agreement** | Acordo/contrato | "Project contract", "Team guidelines" | Nenhum (apenas texto) |
| **manifest** | Manifesto/declaração | "Team values", "Project vision" | Nenhum (apenas texto) |
| **guide** | Guia/tutorial | "How to use ListView", "Onboarding" | Nenhum (apenas texto) |
| **other** | Tipo genérico | Qualquer outra coisa | Nenhum |

### Quando usar cada tipo?

✅ **use `note`** para:
- Anotações rápidas
- Pesquisa/research
- Ideias soltas
- Referências

✅ **use `diary`** para:
- Reflexão pessoal (com energia/mood)
- Planejamento semanal
- Retros e aprendizados
- Histórico pessoal (Papyrus)

✅ **use `agreement`** para:
- Contratos e acordos
- Regras de equipe
- Decisões formais
- Documentos legais

✅ **use `manifest`** para:
- Valores e princípios
- Visão de projeto
- Declarações públicas
- Manifestos de intento

✅ **use `guide`** para:
- Tutoriais passo-a-passo
- Onboarding
- How-tos
- Documentação processual

✅ **use `other`** para:
- Tudo que não encaixa nos 5 acima

### Exemplo Real

```
Documento: "Design System v1.0"
├─ Tipo: guide
├─ Status: Published
├─ Conteúdo:
│  ├─ Colors: Brand palette + usage
│  ├─ Typography: Font sizes, weights
│  ├─ Components: Button, Card, Modal specs
│  ├─ Spacing: 8px grid system
│  └─ Icons: Library + conventions
│
├─ Relacionado a:
│  ├─ Projeto: "UI Redesign"
│  ├─ Task: "Design system v1"
│  └─ Task: "Code design tokens"
│
└─ Arquivo: ✅ Sim (versioned, pode consultar sempre)
```

---

## 🔗 RELACIONAMENTOS (Como se conectam)

### Hierarquia é a conexão principal:

```
Projeto → Fase → Artefatos (Tasks, Events, Checklists, Documents)
```

### Outros tipos de conexão:

| Tipo | O que é | Exemplo |
|------|---------|---------|
| **Parent-Child** | Tarefa contém subtarefas | Task "Design dashboard" → Subtask "Design energy card" |
| **Dependency** | Uma depende da outra | Task "Code backend" depende de "API design" |
| **Related** | Conectadas mas não dependentes | Task "Design" relacionada a Task "User testing" |
| **Blocks** | Uma bloqueia a outra | Task "Waitng approval" bloqueia "Start dev" |
| **References** | Aponta para outra | Document aponta para 3 Tasks |

### Spark → Project (conversão):

```
Spark: "New feature idea"
  ↓ (Ash suggests, user approves)
Project: "New Feature"
  ├─ Phase: Planning
  ├─ Phase: Design
  └─ Phase: Implementation
     └─ Tasks criadas automaticamente
     └─ Original Spark fica como Document "Feature Inspiration"
```

---

## 📊 TABELA COMPARATIVA

| Entidade | Tipo | Propósito | Parent | Arquivo |
|----------|------|-----------|--------|---------|
| **Projeto** | Project (raiz) | Contêiner grande | NULL | ✅ |
| **Fase/Subprojeto** | Project (child) | Etapa do projeto | project_id | ✅ |
| **Task** | Task | Ação a fazer | project_id | ✅ |
| **Spark** | Spark | Ideia capturada | NULL (inbox) | ✅ |
| **Evento** | Event | Momento marcado | project_id | ✅ |
| **Checklist** | Checklist | Processo repetível | project_id | ✅ |
| **Documento** | Document | Conhecimento | project_id | ✅ |

**Nota Técnica:** 
- Projetos e Subprojetos = **mesma tabela `projects`**, diferenciados por `parent_project_id`
- Tasks, Events, Checklists, Documents = tabelas próprias linkadas a projects via `project_id`

---

## 🎯 FLUXO: COMO TUDO SE CRIA

### Cenário: Projeto novo (estrutura real)

```
1️⃣ IDEIA (Spark)
   └─ Usuário tem ideia: "Fazer newsletter"
   └─ Captura como Spark: "Newsletter project"
   
2️⃣ PLANEJAMENTO
   └─ Ash propõe: "Quer que organize isso em projeto?"
   └─ Usuário aprova
   
3️⃣ CRIAÇÃO DO PROJETO RAIZ
   └─ INSERT projects: "Launch Newsletter" (parent_project_id = NULL)
   └─ Estrutura proposta por Ash:
      └─ Fase 1: Planning
      └─ Fase 2: Content
      └─ Fase 3: Launch
   
4️⃣ CRIAÇÃO DOS SUBPROJETOS (Fases)
   └─ INSERT projects (3x):
      ├─ "Planning" (parent_project_id = Launch Newsletter)
      ├─ "Content" (parent_project_id = Launch Newsletter)
      └─ "Launch" (parent_project_id = Launch Newsletter)
   
5️⃣ CRIAÇÃO DE ARTEFATOS (Tasks, Events, Documents)
   └─ Ash cria automaticamente (linkados aos subprojetos):
      ├─ INSERT tasks: "Choose platform", "Set up email list", etc
      ├─ INSERT events: "Newsletter deadline (Feb 1)"
      ├─ INSERT checklists: "Content QA process"
      └─ INSERT documents: "Newsletter style guide"
   
6️⃣ EXECUÇÃO
   └─ Usuário trabalha nas Tasks dos subprojetos
   └─ Marca Tasks como "Done"
   └─ Cada Task completada deixa registro permanente
   
7️⃣ FECHAMENTO
   └─ Projeto completo
   └─ INSERT document: "Lessons learned from newsletter launch"
   └─ Original Spark referencia o projeto: "This became [Project]"
   
8️⃣ ARQUIVO PERMANENTE (Project Hierarchy)
   └─ Tudo fica organizado:
      Projeto "Launch Newsletter" (parent=NULL)
      ├─ Subprojeto "Planning" (parent=Launch Newsletter)
      ├─ Subprojeto "Content" (parent=Launch Newsletter)
      └─ Subprojeto "Launch" (parent=Launch Newsletter)
      
   └─ Pode revisar SEMPRE
   └─ Conhecimento permanece no sistema

**Conceito-chave:** Fases não são "subentidades", são SUBPROJETOS na mesma tabela!
```

---

## 💡 DICAS

### "Quando usar X vs Y?"

**Task vs Evento:**
- Task: "Complete design" (ação, você faz)
- Evento: "Design deadline Jan 20" (momento, acontece)

**Document vs Sparks:**
- Spark: Ideia bruta ("Feature idea")
- Document: Ideia elaborada ("Feature spec v1.0")

**Task vs Checklist:**
- Task: "Do weekly planning" (uma vez)
- Checklist: "Weekly planning process" (template que repete toda semana)

**Spark vs Projeto:**
- Spark: Ideazinha ("sidebar redesign")
- Projeto: Ideazinha que virou ESCOPO ("Redesign full UI" = 10 tasks, 3 fases, 6 weeks)

**Projeto vs Subprojeto:**
- Projeto: Tem `parentId = NULL` (é raiz)
- Subprojeto/Fase: Tem `parentId = outro projeto` (é filho)
- AMBOS são da tabela `projects` - a hierarquia vem do parentId

---

## 🏗️ PROJECT HIERARCHY - ESTRUTURA REAL

**Project Hierarchy é RECURSIVA** - cada projeto pode ter múltiplos subprojetos, infinitamente:

```
Tabela: projects (com self-referential parentId)
├─ Projeto Raiz (parentId = NULL)
│  ├─ Subprojeto Nível 1 (parentId = Projeto Raiz)
│  │  ├─ Subprojeto Nível 2 (parentId = Nível 1)
│  │  │  ├─ Documentos (tipo: note, diary, guide, agreement, manifest, other)
│  │  │  ├─ Tasks com Subtasks
│  │  │  └─ Checklists (inline nas tasks)
│  │  └─ Mais Subprojetos...
│  ├─ Documentos vinculados
│  └─ Tasks com Checklists inline
│
└─ Outro Projeto Raiz (parentId = NULL)
   └─ Seus próprios subprojetos

VÍNCULOS (Relacionamentos):
├─ Project ↔ Project (via parentId, recursivo e ilimitado)
├─ Project → Documents (1→N, documentType = note|diary|guide|agreement|manifest|other)
├─ Project → Tasks (1→N)
│  ├─ Task → Subtask (via parentId em tasks)
│  ├─ Task → Checklist (jsonb inline na task)
│  └─ Task ↔ Document (M→M via fileTaskAssociations)
│     └─ Tipos: modify, review, create, reference, depends_on
│
└─ Spark → Project (conversão: Spark vira Projeto Raiz)

PRINCÍPIO CRÍTICO:
NADA é deletado. TUDO fica registrado permanentemente na Project Hierarchy.
Cada ação (task feita, documento criado, subprojeto adicionado) fica no arquivo.
```

---

## 🔗 LEITURA RELACIONADA

- [📋 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md) - Tipos de artefatos (mesmo conteúdo, referência)
- [📊 11A - Cada View em Detalhes](MANUAL_PRANA_11A_VIEWS_DETALHADAS.md) - Como VER essas entidades
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - Como Ash CRIA essas entidades
- [📔 09 - Diários & Papyrus](MANUAL_PRANA_09_DIARIOS.md) - Documentos especiais (Diário)

---

**Próximo:** Volta a [Cap. 11A - Views](MANUAL_PRANA_11A_VIEWS_DETALHADAS.md) ou [Cap. 11B - Como criar](MANUAL_PRANA_11B_ANATOMIA_CRIACAO.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*

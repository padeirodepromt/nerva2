# 🏗️ CAPÍTULO 12: PROJECT HIERARCHY - ESTRUTURA ORGANIZACIONAL

**Versão:** 1.0 | **Capítulo:** 12 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo explica **tudo sobre Project Hierarchy** - a estrutura fundamental de como Prana organiza seu trabalho:

- O que é Project Hierarchy (não é apenas um campo no banco)
- Como funciona a hierarquia de projetos
- Qual é a relação com tarefas, documentos e checklists
- Como visualizar e navegar pela hierarquia
- Quando e por que usar subprojetos
- Casos de uso reais

**Público:** Todos (especialmente usuários que querem dominar organização)  
**Tempo de leitura:** 30 minutos  
**Pré-requisitos:** [Capítulo 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md), [Capítulo 11C - Entidades](MANUAL_PRANA_11C_ENTIDADES_HIERARCHY.md)

---

## 🎯 DEFINIÇÃO: O QUE É PROJECT HIERARCHY?

### Explicação Simples

**Project Hierarchy é uma estrutura de pastas para organizar seu trabalho** - exatamente como Windows Explorer ou Finder no seu computador.

Você pode ter:
- Pastas (projetos)
- Pastas dentro de pastas (subprojetos)
- Pastas dentro de pastas dentro de pastas (sub-subprojetos)
- Indefinidamente

Mas não é *apenas* técnica. É um **conceito organizacional completo** que afeta:
- Como você navega pelo seu trabalho
- Como estrutura suas tarefas
- Como compartilha com outras pessoas
- Como visualiza o progresso

### Por Que Project Hierarchy?

Sem hierarchy, você teria:
```
❌ Lista Plana (ruim):
- Task: User research
- Task: Competitive analysis
- Task: Wireframes
- Task: Design system
- Task: Frontend code
- Task: Backend code
- Task: Integration
- Task: Final testing
- Task: Deploy
- ... 50 tasks em ordem aleatória
```

Com hierarchy, você tem:
```
✅ Estrutura Clara (bom):
Projeto: Product Launch
├─ Fase: Discovery
│  ├─ Task: User research
│  └─ Task: Competitive analysis
├─ Fase: Design
│  ├─ Task: Wireframes
│  └─ Task: Design system
├─ Fase: Development
│  ├─ Task: Frontend code
│  └─ Task: Backend code
├─ Fase: Integration
│  └─ Task: Integration
├─ Fase: Testing
│  └─ Task: Final testing
└─ Fase: Launch
   └─ Task: Deploy
```

**Diferença:**
- ✅ Entendo a estrutura do trabalho
- ✅ Vejo progresso por fase
- ✅ Fases ficam claras (separadas)
- ✅ Fácil encontrar coisas
- ✅ Fácil visualizar "onde estou?"

---

## 🏛️ ESTRUTURA FÍSICA: COMO FUNCIONA

### A Árvore de Projetos

**Prana organiza projetos em uma árvore** com as seguintes características:

```
┌─────────────────────────────────────┐
│ RAIZ 1: "Product Launch"            │ ← parent = NULL
├─────────────────────────────────────┤
│                                     │
│ ├─ Planning (Nível 1)               │ ← parent = "Product Launch"
│ │  └─ Requirements (Nível 2)        │ ← parent = "Planning"
│ │     └─ User Research (Nível 3)    │ ← parent = "Requirements"
│ │                                   │
│ ├─ Design (Nível 1)                 │
│ │  ├─ Wireframes (Nível 2)          │
│ │  └─ Design System (Nível 2)       │
│ │                                   │
│ ├─ Development (Nível 1)            │
│ │  ├─ Frontend (Nível 2)            │
│ │  └─ Backend (Nível 2)             │
│ │                                   │
│ └─ Testing (Nível 1)                │
│                                     │
├─────────────────────────────────────┤
│ RAIZ 2: "Learning Plan"             │ ← parent = NULL
│                                     │
│ ├─ Math (Nível 1)                   │
│ ├─ Physics (Nível 1)                │
│ └─ Programming (Nível 1)            │
└─────────────────────────────────────┘
```

### Como Funciona Internamente?

Cada projeto tem um campo especial chamado **parentId**:

- **Se `parentId = NULL`** → É um projeto raiz (não tem pai)
- **Se `parentId = ID de outro projeto`** → É um subprojeto (tem pai)

Exemplo:

| Projeto | parentId | Tipo | Significa |
|---------|----------|------|----------|
| "Product Launch" | NULL | Raiz | Não tem pai, é um projeto principal |
| "Planning" | "product_launch_id" | Subprojeto | Filho de "Product Launch" |
| "Requirements" | "planning_id" | Sub-subprojeto | Filho de "Planning" |
| "User Research" | "requirements_id" | Sub-sub-subprojeto | Filho de "Requirements" |

### Há Limite de Profundidade?

**Programado (Banco de Dados):** Nenhum limite
- Prana aceita qualquer nível de profundidade
- A relação é recursiva (um projeto pode apontar para qualquer outro como pai)

**Recomendado (Interface):** 5-7 níveis
- Além disso, a navegação fica confusa
- Você provavelmente não usará mais de 3-4 na prática

**Advertência:** Se você criar muito profundo, o sistema avisa no console (para developers).

---

## 🔗 RELACIONAMENTO: COMO ARTEFATOS ENCAIXAM

### Projetos Contêm Artefatos

Cada projeto pode conter:
- ✅ **Tarefas** (tasks)
- ✅ **Documentos** (documents)
- ✅ **Checklists** (checklists)
- ✅ **Eventos** (events)
- ✅ **Subprojetos** (projetos filhos)

### Visualização

```
PROJETO RAIZ: "Redesign Produto"
│
├─ SUBPROJETO: "Planning" (nível 1)
│  ├─ TASK: "Definir escopo"
│  ├─ TASK: "Entrevistar usuários"
│  ├─ DOCUMENT: "Research findings"
│  ├─ CHECKLIST: "Discovery checklist"
│  └─ EVENT: "Kickoff meeting (Jan 10)"
│
├─ SUBPROJETO: "Design" (nível 1)
│  ├─ TASK: "Criar wireframes"
│  ├─ TASK: "Design mockup alta fidelidade"
│  ├─ DOCUMENT: "Design system v1.0"
│  ├─ CHECKLIST: "Design QA"
│  └─ EVENT: "Design review (Jan 20)"
│
├─ SUBPROJETO: "Development" (nível 1)
│  ├─ TASK: "Code backend"
│  ├─ TASK: "Code frontend"
│  ├─ DOCUMENT: "API docs"
│  └─ CHECKLIST: "Code review checklist"
│
└─ SUBPROJETO: "Testing" (nível 1)
   ├─ TASK: "Regression testing"
   ├─ CHECKLIST: "Testing checklist"
   └─ EVENT: "QA sign-off (Feb 15)"
```

### Regra Crítica

**Uma tarefa/documento pode estar em QUALQUER nível da hierarquia:**

```
✅ VÁLIDO:
Projeto "Product Launch"
├─ Fase "Planning" ← Tarefas AQUI
│  └─ Sub-fase "Requirements" ← Tarefas AQUI TAMBÉM
│     └─ Documento AQUI
└─ Documento AQUI (no nível raiz)

Significa: A tarefa aponta para o projeto
e o projeto pode ser qualquer nível da árvore.
```

---

## 🛠️ OPERAÇÕES: CRIAR, MOVER, ORGANIZAR

### Criar um Subprojeto

**Na Interface:**
1. Selecione um projeto
2. Clique no botão **"+"** ou **"Nova Pasta"**
3. Digite o nome (ex: "Planning Phase")
4. Pressione Enter
5. ✅ Subprojeto criado com `parentId = seu_projeto`

**Visualmente no Explorer (Sidebar):**
```
▼ Product Launch
  ├─ ▼ Planning        ← novo subprojeto aqui
  └─ Design
```

### Mover um Projeto Para Outro Pai

**Drag-and-Drop:**
1. Selecione o projeto que quer mover
2. Arraste para o novo pai
3. Solte (drop-zone fica destacada)
4. ✅ Projeto movido (parentId atualizado)

**Exemplo:**
```
ANTES:
Projeto A
├─ Fase 1
└─ Fase 2

Arrasto "Fase 2" para Projeto B...

DEPOIS:
Projeto A
├─ Fase 1

Projeto B
├─ Fase 2 (agora aqui!)
```

### Renomear, Editar Propriedades

**Para mudar cor, ícone, status:**
1. Clique direito no projeto
2. Selecione "Editar"
3. Modifique nome, cor, ícone, descrição
4. Salve

**Importante:** Filhos NÃO herdam essas propriedades (cada um tem suas próprias)

### Agrupar Tarefas em Fases

**Padrão recomendado:**

```
Quando você tem muitas tarefas (>10) em um projeto,
crie subprojetos/fases para agrupá-las.

❌ Errado:
Projeto "Marketing 2025"
├─ Task: Social media posts (50 tasks)
├─ Task: Blog articles (30 tasks)
├─ Task: Email campaigns (20 tasks)
└─ Task: Events (10 tasks)
[total: 110 tasks em uma lista!]

✅ Certo:
Projeto "Marketing 2025"
├─ Fase: "Social Media" (50 tasks)
├─ Fase: "Blog" (30 tasks)
├─ Fase: "Email" (20 tasks)
└─ Fase: "Events" (10 tasks)
[Organizado, fácil de navegar]
```

---

## 👁️ VISUALIZAÇÃO: VENDO PROJECT HIERARCHY

### Onde Você Vê a Hierarquia?

#### **1. Explorer (Sidebar Esquerdo)**

```
┌──────────────────────┐
│ 📁 EXPLORADOR        │
├──────────────────────┤
│                      │
│ ▼ Product Launch     │ ← Clique ▼ para expandir/colapsar
│  ├─ Planning         │
│  ├─ Design           │
│  ├─ Development      │
│  └─ Testing          │
│                      │
│ ▼ Learning Plan      │
│  ├─ Math             │
│  ├─ Physics          │
│  └─ Programming      │
│                      │
│ 📋 Inbox (sem proj)  │
│                      │
└──────────────────────┘
```

**Como usar:**
- Clique ▼/► para expandir/colapsar
- Clique no projeto para selecioná-lo
- Drag-drop para mover
- Hover: mostra botões de ação (+, ✏️, 🗑️)

#### **2. Breadcrumb (Caminho)**

Quando você está em uma task, vê o caminho completo:

```
Produto Launch > Planning > Requirements > User Research

Clique em qualquer parte para voltar
```

#### **3. ProjectNode (Cards)**

Visualização de cards mostrando subprojetos:

```
┌─────────────────────┐
│ Product Launch      │
│ 3 subprojetos      │
│ 15 tarefas         │
│ Em progresso       │
├─────────────────────┤
│ ► Planning (5)     │
│ ► Design (4)       │
│ ► Development (6)  │
└─────────────────────┘
```

#### **4. Dropdown Hierárquico**

Quando cria uma nova tarefa, vê a hierarquia com indentação:

```
- Product Launch
  - Planning
    - Requirements
  - Design
  - Development
```

### Qual View é Melhor Para Quê?

| View | Melhor Para |
|------|----------|
| **Explorer** | Navegação rápida, overview geral, reorganização |
| **Breadcrumb** | Entender "onde estou agora?" |
| **ProjectNode** | Visualizar filhos de um projeto |
| **Dropdown** | Criar/mover items (seleção rápida) |

---

## 💡 CONCEITOS IMPORTANTES

### Herança de Propriedades?

**❌ NÃO, não há herança:**

```
Projeto Pai: "Product Launch"
├─ color: vermelho (#FF0000)
├─ icon: 🚀
├─ visibility: private
├─ status: in_progress

Subprojeto Filho: "Planning"
├─ color: azul (#3B82F6)         ← PRÓPRIO, não herdado
├─ icon: 📁                       ← PRÓPRIO
├─ visibility: private            ← PRÓPRIO (coincidentemente igual)
└─ status: planning               ← PRÓPRIO
```

**O que significa?**
Cada projeto tem identidade visual e propriedades **independentes** do pai.

### Compartilhamento?

**Visibilidade vs Compartilhamento:**

Se você compartilha um projeto pai **com um time**:
- ✅ Filhos ficam **visíveis** para o time (porque ao ver o pai, veem filhos)
- ❌ Filhos não são **compartilhados explicitamente** (cada um tem suas permissões)

```
Projeto "SaaS MVP" (shared with Team A)
├─ Planning (não é explicitamente "compartilhado", 
│            mas Team A vê porque o pai é)
├─ Design (mesma coisa)
└─ Development (mesma coisa)

Regra: Se você vê o pai, você vê os filhos
       (Mas permissões específicas são independentes)
```

### Exclusão e Arquivamento

| Ação | O Que Acontece | Filhos | Tarefas |
|------|----------------|--------|--------|
| **Soft Delete** (padrão) | Marca como deletado, não remove | Ficam órfãos | Continuam visíveis |
| **Arquivar** | Status muda para "archived" | Continuam acessíveis | Continuam acessíveis |
| **Hard Delete** (raro) | Remove da DB | **Deletam em cascata** | **Deletam em cascata** |

**Na prática em Prana:**
- Prana usa **soft delete** (nunca remove dados)
- Se arquiva um projeto pai, filhos continuam normalmente
- Você pode restaurar um projeto deletado

### Cross-Linking Entre Projetos?

**✅ SIM, é possível:**

Uma tarefa em Projeto A pode **depender** de uma tarefa em Projeto B:

```
Projeto "Frontend"
└─ Task: "Design Button Component"

Projeto "Backend"
└─ Task: "Implement API endpoint"
   └─ Depende de: "Design Button Component"

Significa: API endpoint não pode ser iniciada até
que o design do botão esteja pronto.
```

---

## 📚 CASOS DE USO REAIS

### Padrão 1: Projeto com Fases

**Melhor para:** Projetos com timeline clara (começo, meio, fim)

```
Projeto: "Website Redesign"
├─ Fase: "Discovery" (semana 1-2)
│  ├─ Task: User research
│  ├─ Task: Competitive analysis
│  └─ Document: Discovery report
├─ Fase: "Design" (semana 3-5)
│  ├─ Task: Wireframes
│  ├─ Task: Design system
│  └─ Checklist: Design QA
├─ Fase: "Development" (semana 6-12)
│  ├─ Task: Frontend
│  ├─ Task: Backend
│  └─ Task: Integration
└─ Fase: "Launch" (semana 13)
   ├─ Task: Final testing
   ├─ Event: Launch date
   └─ Document: Launch notes
```

**Vantagens:**
- ✅ Estrutura clara
- ✅ Mostra progresso por fase
- ✅ Fácil entender onde estamos
- ✅ Fácil arquivar fase completa

### Padrão 2: Estrutura de Livro

**Melhor para:** Criação de conteúdo longo (livro, curso, tese)

```
Livro: "Machine Learning Basics"
├─ Capítulo 1: Introduction
│  ├─ Seção 1.1: What is ML?
│  ├─ Seção 1.2: Why it matters
│  ├─ Task: Write draft
│  └─ Document: Chapter outline
├─ Capítulo 2: Math Foundations
│  ├─ Seção 2.1: Algebra
│  ├─ Seção 2.2: Calculus
│  └─ Task: Write draft
├─ Capítulo 3: Algorithms
│  └─ [similar structure]
└─ Appendix
   ├─ Code examples
   └─ Reference guide
```

### Padrão 3: Metas Anuais

**Melhor para:** OKR (Objectives & Key Results)

```
Objetivo: "Saúde & Fitness 2025"
├─ Meta: "Build Exercise Habit"
│  ├─ Task: Gym 3x/semana
│  ├─ Task: Yoga 2x/semana
│  └─ Document: Workout plan
├─ Meta: "Nutrition"
│  ├─ Task: Meal prep domingos
│  └─ Checklist: Healthy eating
├─ Meta: "Mental Health"
│  ├─ Task: Meditação diária
│  └─ Task: Journaling
└─ Meta: "Sleep & Recovery"
   ├─ Task: 8h sleep
   └─ Document: Sleep tracking
```

### Padrão 4: Times e Departamentos

**Melhor para:** Equipes grandes com múltiplos times

```
Empresa: "Startup XYZ"
├─ Time: "Product"
│  ├─ Epic: "Mobile App"
│  │  ├─ Feature: "Auth"
│  │  ├─ Feature: "Dashboard"
│  │  └─ Feature: "Settings"
│  └─ Epic: "Web Platform"
├─ Time: "Design"
│  ├─ Design System
│  └─ Brand Guidelines
└─ Time: "Operations"
   ├─ HR
   └─ Finance
```

---

## 🎓 QUANDO USAR SUBPROJETOS vs TASKS

### Decisão: Subprojeto ou Task?

| Critério | Subprojeto | Task |
|----------|-----------|------|
| **Duração** | Semanas/meses | Horas/dias |
| **Quantidade de filhos** | Múltiplas tasks (5+) | Subtasks (0-3) |
| **Escopo** | Grande, bem definido | Pequeno, executável |
| **Necessidade de status próprio** | Sim (phase 1 done, phase 2 in progress) | Task é individual |
| **Reutilização** | Não (fase única) | Pode virar template |

### Exemplo Prático

**Cenário: Lançar Newsletter**

```
❌ ERRADO (tudo como task):
Projeto "Newsletter"
├─ Task: Definir público
├─ Task: Escolher plataforma
├─ Task: Escrever edição 1
├─ Task: Escrever edição 2
├─ Task: Design template
├─ Task: Setup email list
├─ Task: Agendar envios
├─ Task: Testar entrega
├─ Task: Monitorar engagement
└─ Task: Fazer improvements

Problema: 10 tarefas em lista plana, difícil entender estrutura

✅ CORRETO (com fases):
Projeto "Newsletter Launch"
├─ Fase: Planning
│  ├─ Task: Definir público
│  ├─ Task: Escolher plataforma
│  └─ Document: Newsletter brief
├─ Fase: Content Creation
│  ├─ Task: Escrever edição 1
│  ├─ Task: Escrever edição 2
│  └─ Task: Design template
├─ Fase: Setup
│  ├─ Task: Setup email list
│  └─ Task: Configure automations
├─ Fase: Launch
│  ├─ Task: Agendar envios
│  └─ Task: Testar entrega
└─ Fase: Measurement
   ├─ Task: Monitorar engagement
   └─ Document: Analytics report

Vantagem: Estrutura clara, fases bem definidas,
fácil ver progresso por fase.
```

### Teste Rápido

Faça essas perguntas:

1. **Posso quebrar isso em múltiplas fases/etapas?**
   - Sim → Subprojeto
   - Não → Task

2. **Preciso rastrear progresso de cada etapa?**
   - Sim → Subprojeto
   - Não → Task

3. **Vai ter mais de 3 subtasks?**
   - Sim → Subprojeto
   - Não → Task

4. **Vai durar mais de uma semana?**
   - Sim → Provavelmente subprojeto
   - Não → Task

---

## 🚀 BOAS PRÁTICAS

### ✅ O Que Fazer

1. **Use profundidade para organização semântica**
   ```
   Certo: Livro > Capítulo > Seção > Task
   Errado: Projeto > Phase 1 > Phase 1.1 > Phase 1.1.1 > Phase 1.1.1.1
   ```

2. **Limite a profundidade a 3-4 níveis na prática**
   ```
   Ideal: Project > Epic > Task (3 níveis)
   Ok: Project > Epic > Feature > Task (4 níveis)
   Difícil: Mais de 4 níveis
   ```

3. **Use nomes descritivos e únicos**
   ```
   Certo: "Discovery Phase", "Wireframe Design", "API Integration"
   Errado: "Phase 1", "Tasks", "To-Do"
   ```

4. **Agrupe tarefas relacionadas**
   ```
   Certo: Planning > Task, Task, Task
   Errado: Planning > Task A, Design > Task B, Design > Task C
   (Tasks de mesma fase em fases diferentes)
   ```

### ❌ O Que Evitar

1. **Não crie hierarquia arbitrária**
   ```
   Errado:
   Project > Folder > Subfolder > Sub-subfolder > Task
   (Sem motivo lógico)
   ```

2. **Não use para documentação**
   ```
   Errado:
   Project > Docs > Files > Documentation > Reference
   (Use Documents/Papyrus para isso)
   ```

3. **Não crie subprojeto para 1-2 tasks**
   ```
   Errado:
   Project > Phase: Design (contém apenas 1 task)
   Certo:
   Project > 2 Tasks diretas
   ```

4. **Não deixe projetos órfãos**
   ```
   Ruim: Projeto sem pai, sem filhos, sem tasks
   Bom: Qualquer coisa de valor ou exclua
   ```

---

## 🔍 DEBUGGING: PROBLEMAS COMUNS

### "Não vejo meu subprojeto"

**Causas:**
1. Projeto pai está arquivado (filhos existem mas podem não aparecer)
2. Está em outro workspace/team
3. Falta permissão

**Solução:**
- Clique em "Mostrar arquivados"
- Verifique em qual team está
- Verifique permissões

### "Arrastei projeto para lugar errado"

**Solução:**
- Desfaça (Ctrl+Z)
- Ou arraste novamente para o local correto

### "Tenho muitos níveis e fica confuso"

**Solução:**
- Limite a 3-4 níveis máximo
- Considere usar diferentes tipos (Epic, Feature ao invés de Fase 1.1.1)
- Reorganize para estrutura mais plana

---

## 📊 RESUMO VISUAL

```
PROJECT HIERARCHY EM UMA IMAGEM

                    ┌─────────────────┐
                    │  Projeto Raiz   │
                    │ (parentId=NULL) │
                    └────────┬────────┘
                             │
                 ┌───────────┼───────────┐
                 │           │           │
          ┌──────▼──────┐  ┌─▼──────┐  ┌─▼────────┐
          │Subprojeto 1 │  │Subpro 2│  │Subpro 3  │
          │(parentId=R) │  │        │  │          │
          └──────┬──────┘  └─┬──────┘  └──────────┘
                 │           │
            ┌────▼────┐  ┌───▼────┐
            │Sub-sub  │  │Sub-sub │
            │(parent=1)   │(parent=2)
            └─────────┘  └────────┘
            
CONTÉM:
├─ Tarefas (projectId = qualquer nível)
├─ Documentos (projectId = qualquer nível)
├─ Checklists (projectId = qualquer nível)
├─ Eventos (projectId = qualquer nível)
└─ Subprojetos (parentId = pai)
```

---

## 🔗 LEITURA RELACIONADA

- [📋 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md) - Como tarefas funcionam
- [🏢 11C - Entidades & Relacionamentos](MANUAL_PRANA_11C_ENTIDADES_HIERARCHY.md) - Detalhes de cada entidade
- [📊 07 - Dashboard & Views](MANUAL_PRANA_07_DASHBOARD.md) - Como visualizar hierarchy
- [🏗️ 11B - Anatomia da Criação](MANUAL_PRANA_11B_ANATOMIA_CRIACAO.md) - Como criar estruturas

---

**Próximo:** [Cap. 13 - API Reference](MANUAL_PRANA_13_API_REFERENCE.md) (desenvolvimento) ou volta para [Cap. 11A - Views](MANUAL_PRANA_11A_VIEWS_DETALHADAS.md) (uso)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*

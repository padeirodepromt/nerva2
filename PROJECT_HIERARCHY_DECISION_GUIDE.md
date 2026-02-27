# 🔍 PROJECT HIERARCHY - DIAGRAMA COMPARATIVO & CASOS DE USO

**Visual Decision Guide** | **Quando usar o quê** | **Comparações lado-a-lado**

---

## 📊 COMPARAÇÃO: PROJETO vs SUBPROJETO vs TASK

```
┌──────────────────────────────────────────────────────────────────┐
│                        PROJECT vs SUBPROJECT vs TASK             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PROJETO (parentId = NULL)                                       │
│  ├─ O que é? Contêiner umbrella                                  │
│  ├─ Duração: Semanas/Meses/Anos                                  │
│  ├─ Escopo: Grande (múltiplas fases)                            │
│  ├─ Ícone: 🏢                                                    │
│  ├─ Exemplo: "SaaS MVP", "Write Book", "Redesign Website"       │
│  ├─ Deletar deleta? Subprojetos + tasks (cascata)               │
│  └─ Profundidade: Pode ter filhos infinitos                      │
│                                                                   │
│  SUBPROJETO/FASE (parentId = project_id)                         │
│  ├─ O que é? Quebra do projeto em fases                         │
│  ├─ Duração: Dias/Semanas                                        │
│  ├─ Escopo: Médio (múltiplas tasks)                             │
│  ├─ Ícone: 📁                                                    │
│  ├─ Exemplo: "Planning", "Design", "Development"                │
│  ├─ Deletar deleta? Tasks dentro dele (cascata)                 │
│  └─ Profundidade: Pode ter subprojetos (multi-nível)            │
│                                                                   │
│  TASK (projectId = projeto_id, parentId = NULL)                 │
│  ├─ O que é? Ação com deliverable                               │
│  ├─ Duração: Horas/Dias                                          │
│  ├─ Escopo: Pequeno (um item)                                    │
│  ├─ Ícone: ✅                                                    │
│  ├─ Exemplo: "Write intro", "Create wireframes", "Deploy"       │
│  ├─ Deletar deleta? Subtasks (cascata)                          │
│  └─ Profundidade: Pode ter subtasks                              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 ÁRVORE DE DECISÃO: QUANDO CRIAR O QUÊ?

```
                        ┌─ Tenho algo para organizar?
                        │
            ┌───────────┴───────────┐
            │                       │
          NÃO                      SIM
            │                       │
            ▼                       ▼
        (Guardar em                Vai levar dias/semanas?
         diário ou                  │
         notas)                  ┌──┴──┐
                                 │     │
                                SIM   NÃO
                                 │     │
                        ┌────────┘     ├──► É uma ação?
                        │              │
                        ▼              ▼
                   É projeto raiz?   (Spark/Ideia)
                        │
                    ┌───┴────┐
                    │        │
                   SIM      NÃO
                    │        │
                    ▼        ▼
                  PROJETO  SUBPROJETO
                  (root)    (Fase)
```

---

## 📋 MATRIZ: CARACTERÍSTICAS COMPARADAS

```
                    PROJETO     SUBPROJETO    TASK        SUBTASK
┌──────────────────┬────────────┬──────────────┬──────────┬────────────┐
│ Campo            │ Projeto    │ Subprojeto   │ Task     │ Subtask    │
├──────────────────┼────────────┼──────────────┼──────────┼────────────┤
│ parentId         │ NULL       │ projeto_id   │ NULL     │ task_id    │
│ Tabela           │ projects   │ projects     │ tasks    │ tasks      │
│ Status           │ active     │ active       │ todo     │ pendente   │
│ Duração Típica   │ 1-12 meses │ 1-4 semanas  │ 1-5 dias │ <1 dia     │
│ Tem filhos?      │ ✅ Sim     │ ✅ Sim       │ ✅ Sim   │ ❌ Não     │
│ Pode ser movido? │ ✅ Sim     │ ✅ Sim       │ ✅ Sim   │ ❌ Não     │
│ Soft delete?     │ ✅ Sim     │ ✅ Sim       │ ✅ Sim   │ ✅ Sim     │
│ Tags?            │ ❌ Não     │ ❌ Não       │ ✅ Sim   │ ❌ Não     │
│ Documentos?      │ ✅ Sim     │ ✅ Sim       │ ✅ Sim   │ ❌ Não     │
│ Eventos?         │ ✅ Sim     │ ✅ Sim       │ ✅ Sim   │ ❌ Não     │
│ Compartilhar?    │ ✅ Sim     │ via projeto  │ via proj │ via proj   │
└──────────────────┴────────────┴──────────────┴──────────┴────────────┘
```

---

## 🎪 SPARK vs TASK vs PROJECT

```
IDEIA/SPARK (não organizada)
├─ O que? Pensamento solto
├─ Exemplo: "Feature: drag-and-drop"
├─ Duração? Instantânea (captura rápida)
├─ Conversão?
│  ├─ Se ação concreta → TASK
│  ├─ Se trabalho grande → PROJECT
│  └─ Se conhecimento → DOCUMENT
└─ Arquivo? Fica em "Inbox" até converter

TASK (ação organizada)
├─ O que? Coisa que você FAZ
├─ Exemplo: "Implement drag-and-drop"
├─ Duração? Horas/dias
├─ Delivery? Sim (código, documento, etc)
├─ Arquiva? ✅ Sim (histórico permanente)
└─ Conversão? Pode virar Project se crescer

PROJECT (escopo grande)
├─ O que? Contêiner de trabalho relacionado
├─ Exemplo: "Platform Refactor"
├─ Duração? Semanas/meses
├─ Fases? Planning → Design → Dev → Launch
├─ Arquiva? ✅ Sim (permanente)
└─ Conversão? Pode ter subprojetos infinitos
```

---

## 🎬 EXEMPLOS: QUANDO CRIAR CADA COISA

### Cenário 1: Startup Lançando SaaS

```
IDEIA (vindo de reunião)
  ↓
"Preciso de um dashboard com analytics"
  ↓
  └─► SPARK: "Feature: Analytics dashboard"
      (Inbox, aguardando review)
  
APÓS REVISAR
  ↓
"Vale a pena, mas é grande"
  ↓
  └─► PROJECT: "Analytics Dashboard Feature"
      (root project, parentId = NULL)
      ├─ SUBPROJECT: "Planning Phase"
      │  └─ TASK: "Define metrics"
      │  └─ TASK: "Competitive analysis"
      │  └─ DOCUMENT: "Requirements"
      ├─ SUBPROJECT: "Design Phase"
      │  └─ TASK: "Create wireframes"
      │  └─ TASK: "Visual design"
      └─ SUBPROJECT: "Development"
         ├─ TASK: "Setup backend"
         ├─ TASK: "Implement API"
         └─ TASK: "Build frontend"
```

### Cenário 2: Escrever um Livro

```
IDEIA
  ↓
"Escrever livro sobre AI Ethics"
  ↓
  └─► PROJECT: "Write: AI Ethics Book"
      (root, no parentId)
      ├─ SUBPROJECT: "Chapter 1: Introduction"
      │  ├─ SUBPROJECT: "Section 1.1: The Problem"
      │  │  ├─ TASK: "Research AI bias cases"
      │  │  ├─ TASK: "Write 2000 words"
      │  │  └─ DOCUMENT: "Draft section 1.1"
      │  └─ SUBPROJECT: "Section 1.2: Motivation"
      │     └─ TASK: "Why AI Ethics matters"
      ├─ SUBPROJECT: "Chapter 2: History"
      │  └─ ...
      └─ SUBPROJECT: "Appendix"
         └─ TASK: "Compile references"
```

### Cenário 3: Gestão Pessoal (Goals)

```
OBJETIVO
  ↓
"Crescer profissionalmente em 2025"
  ↓
  └─► PROJECT: "2025 Personal Growth"
      ├─ SUBPROJECT: "Learning"
      │  ├─ TASK: "Complete ML course"
      │  │  └─ Recurrence: 10h/week
      │  ├─ TASK: "Learn Spanish"
      │  │  └─ Recurrence: 30min/day
      │  └─ TASK: "Write technical blog"
      │     └─ Recurrence: 1 post/week
      ├─ SUBPROJECT: "Health"
      │  ├─ TASK: "Run 3x/week"
      │  │  └─ Recurrence: 3x weekly
      │  └─ TASK: "Meal prep Sunday"
      │     └─ Recurrence: weekly
      └─ SUBPROJECT: "Community"
         ├─ TASK: "Mentor 2 juniors"
         └─ TASK: "Speak at 1 conference"
```

### Cenário 4: Freelance Project

```
CONTRATO FECHADO
  ↓
"Redesign website for client ABC"
  ↓
  └─► PROJECT: "ABC Website Redesign" (professional, shared)
      Owner: freelancer | Team: clientABC
      ├─ SUBPROJECT: "Discovery Phase"
      │  ├─ TASK: "Kickoff meeting" (status: done)
      │  ├─ TASK: "Audit current site" (status: done)
      │  └─ DOCUMENT: "Strategy Report" (deliverable)
      │
      ├─ SUBPROJECT: "Design Phase" (in progress)
      │  ├─ TASK: "Create wireframes"
      │  │  └─ 🔗 File: wireframes.fig
      │  │  └─ Approved by: client
      │  ├─ TASK: "Hi-fi mockups"
      │  │  └─ Status: revision 1 pending
      │  └─ DOCUMENT: "Design System"
      │
      ├─ SUBPROJECT: "Development Phase"
      │  ├─ TASK: "Setup frontend"
      │  ├─ TASK: "Build pages"
      │  └─ TASK: "Integrate backend API"
      │
      └─ SUBPROJECT: "Launch Phase"
         ├─ TASK: "Final testing"
         ├─ TASK: "Deploy to production"
         └─ EVENT: "Go live!" (2025-03-15)
```

---

## 🔄 CONVERSÃO: Como Coisas Evoluem

```
SPARK (Inbox)
  │
  ├─► ✅ TASK (ação simples, <1 semana)
  │   └─ Depois completa e arquiva
  │
  ├─► 📁 PROJECT (escopo grande, >1 semana)
  │   ├─ Quebra em fases (subprojetos)
  │   ├─ Cada fase tem tasks
  │   └─ Depois arquiva como histórico
  │
  └─► 📄 DOCUMENT (conhecimento capturado)
      └─ Fica permanente para referência

TASK (pequena)
  │
  ├─► ✅ Completa e pronto
  │
  └─► 🏢 PROJECT (cresceu mais que esperado)
      "Ops, isso é maior que um task"
      └─ Move para project, quebra em fases
```

---

## ⚖️ TRADE-OFFS: QUE ESTRUTURA ESCOLHER?

```
┌──────────────────────────────────────────────────────────────────┐
│ FLAT STRUCTURE (Tudo é task/documento)                           │
├──────────────────────────────────────────────────────────────────┤
│ Vantagens:                                                        │
│ ✅ Simples de entender                                           │
│ ✅ Rápido para coisas pequenas                                   │
│ ✅ Menos navegação                                               │
│                                                                  │
│ Desvantagens:                                                     │
│ ❌ Difícil encontrar coisas (tudo em 1 lista)                    │
│ ❌ Sem contexto (qual task é parte de qual projeto?)             │
│ ❌ Não escala bem (100+ tasks = caos)                            │
│                                                                  │
│ Quando usar: Coisas pequenas (<20 tasks)                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ HIERARCHICAL STRUCTURE (Projetos → Fases → Tasks)               │
├──────────────────────────────────────────────────────────────────┤
│ Vantagens:                                                        │
│ ✅ Contexto claro (qual task é parte de qual fase)              │
│ ✅ Escala bem (1000+ tasks = organizado)                        │
│ ✅ Fácil navegar (tree expansível)                              │
│ ✅ Histórico permanente (soft delete)                           │
│                                                                  │
│ Desvantagens:                                                     │
│ ❌ Mais clicks para acessar                                      │
│ ❌ Requer pensamento estrutural                                  │
│ ❌ Pode ser over-engineered para coisas simples                  │
│                                                                  │
│ Quando usar: Tudo em Prana! (Recomendado)                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 WORKFLOW RECOMENDADO EM PRANA

```
1. IDEIA CHEGA
   └─► Captura em Spark/Inbox

2. REVISAR (Ash ou você)
   ├─ Pequeno (<1 semana)? → TASK no projeto existente
   └─ Grande (>1 semana)? → Novo PROJECT

3. SE PROJETO
   └─► Quebrar em FASES (subprojetos)
       ├─ Planning (entender)
       ├─ Design (visualizar)
       ├─ Development (fazer)
       └─ Launch (entregar)

4. SE FASE
   └─► Quebrar em TASKS
       └─ Cada task = deliverable concreto

5. EXECUÇÃO
   └─► Cada task avança em status: todo → in-progress → done

6. APÓS COMPLETO
   └─► Arquiva (soft delete) = histórico permanente
       └─ Aprender de completado para melhorar próximo
```

---

## 🎓 REGRAS DE OURO

| Regra | Por quê? |
|------|---------|
| **Sempre use projetos para organizar** | Melhor que flat. Escala. Contexto. |
| **Quebra em 3-5 fases** | Não mais que isso, fica confuso. |
| **Cada task é <1 semana** | Se >1 semana, vira fase ou projeto. |
| **Soft delete, nunca hard** | Histórico permanente é valor. |
| **Mova com confiança** | Validações impedem erros. |
| **Documente no projeto** | Docs + Tasks + Eventos = contexto. |

---

**✅ Você agora tem guia visual completo para estruturar QUALQUER coisa em Prana!**

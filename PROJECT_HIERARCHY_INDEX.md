# 📚 PROJECT HIERARCHY - DOCUMENTAÇÃO COMPLETA (ÍNDICE)

**Data:** Dezembro 2025 | **Status:** ✅ Completo  
**Documentação criada especificamente para entender COMPLETAMENTE como Project Hierarchy funciona em Prana**

---

## 🎯 POR ONDE COMEÇAR?

### ⏱️ Tenho 5 minutos
👉 Leia: [PROJECT_HIERARCHY_QUICK_REF.md](PROJECT_HIERARCHY_QUICK_REF.md)
- Resumo em 1 página
- Operações mais comuns
- Dicas rápidas

### ⏱️ Tenho 30 minutos
👉 Leia: [PROJECT_HIERARCHY_COMPLETE_GUIDE.md](PROJECT_HIERARCHY_COMPLETE_GUIDE.md)
- ✅ **RECOMENDADO PARA ENTENDIMENTO PROFUNDO**
- Estrutura completa da tabela
- Relacionamentos detalhados
- Exemplos práticos
- Operações comuns com código
- UI components

### ⏱️ Tenho 1 hora
👉 Leia TODOS os documentos:
1. Quick Ref
2. Complete Guide
3. Visual Examples
4. Queries & Operations

### 🔧 Preciso de Código Pronto
👉 Leia: [PROJECT_HIERARCHY_QUERIES.md](PROJECT_HIERARCHY_QUERIES.md)
- Consultas SQL/Drizzle prontas
- Operações recursivas
- Validações
- Helper functions

### 📊 Quero Exemplos Visuais
👉 Leia: [PROJECT_HIERARCHY_VISUAL_EXAMPLES.md](PROJECT_HIERARCHY_VISUAL_EXAMPLES.md)
- 4 casos de uso reais
- Diagramas completos
- Padrões de migração
- Recomendações de design

---

## 📄 LISTA COMPLETA DE DOCUMENTOS CRIADOS

### 1. **PROJECT_HIERARCHY_QUICK_REF.md** ⚡
**Tamanho:** 1 página | **Tempo:** 5 min | **Público:** Todos

Contém:
- O que é Project Hierarchy
- Schema da tabela projects
- Quando usar
- Operações básicas
- Regras e restrições
- Exemplos rápidos

**Quando ler:** Primeira vez, visão geral rápida

---

### 2. **PROJECT_HIERARCHY_COMPLETE_GUIDE.md** 📖 ⭐ PRINCIPAL
**Tamanho:** 7 seções | **Tempo:** 30 min | **Público:** Developers

Contém:
- Índice completo
- Estrutura da tabela `projects` (todos os campos explicados)
- Como `parentId` funciona (recursão, múltiplos níveis)
- Relacionamentos (Drizzle relations)
- 4 exemplos práticos reais
- Operações comuns (criar, buscar, mover, deletar, recursivo)
- Visualização na UI (componentes)
- Regras e restrições (validações)
- Resumo rápido final
- Referências aos arquivos do código

**Quando ler:** Para ENTENDIMENTO COMPLETO

**Tópicos principais:**
- ✅ Estrutura da tabela projects
- ✅ O que é parentId e como funciona
- ✅ Pode haver múltiplos níveis? SIM, ilimitados
- ✅ Há limite de profundidade? Não programático, mas UI recomenda ≤5
- ✅ Relacionamentos entre projeto-pai, projeto-filho, tasks
- ✅ Como documents se conectam
- ✅ Como subtasks funcionam
- ✅ 4 exemplos práticos reais
- ✅ Como criar subprojeto
- ✅ Como mover task entre projetos
- ✅ Como deletar projeto (cascata)
- ✅ Como buscar todas as tasks (incluindo subprojetos)
- ✅ UI: ProjectHierarchy, ProjectNode, etc

---

### 3. **PROJECT_HIERARCHY_VISUAL_EXAMPLES.md** 📊
**Tamanho:** 4 casos de uso | **Tempo:** 20 min | **Público:** Designers + Developers

Contém:
- **Caso 1: Projeto de Software (Startup)**
  - SaaS MVP com 6 fases (Planning → Design → Frontend → Backend → QA → Launch)
  - Subprojetos: Auth Module, Dashboard Module
  - Métricas completas
  
- **Caso 2: Escrita de Livro (3+ níveis)**
  - 12 capítulos + Appendix
  - Cada capítulo tem seções
  - Cada seção tem tópicos
  - Tarefas em cada nível
  
- **Caso 3: Gestão Pessoal (Goals)**
  - Health & Fitness
  - Learning (ML, Spanish, Writing)
  - Community
  - Creative
  
- **Caso 4: Freelance Agência (Multi-Cliente)**
  - 3 clientes com projetos diferentes
  - Phases: Discovery, Design, Dev, Launch
  - Billing e invoicing
  - Team allocation

- **Padrões de Migração:** Flat → Hierarchical

- **Recomendações de Design:** Profundidade, limites, cores, ícones

**Quando ler:** Para ver "como fica" em produção

---

### 4. **PROJECT_HIERARCHY_QUERIES.md** 🛠️
**Tamanho:** 7 seções | **Tempo:** 40 min | **Público:** Developers

Contém:
- **Seção 1: Consultas Básicas**
  - Buscar projeto com relações
  - Buscar projetos raiz
  - Buscar subprojetos diretos
  - Buscar caminho completo (breadcrumb)
  
- **Seção 2: Operações Recursivas**
  - Buscar TODOS os subprojetos (deep)
  - Coletar todos os IDs
  - Buscar todas as tasks (em qualquer subprojeto)
  - Buscar profundidade
  - Buscar projeto raiz (ancestral)
  
- **Seção 3: Filtros e Buscas**
  - Filtrar por tipo, compartilhamento, status
  - Search por nome
  - Projetos recentes
  - Projetos com deadline próxima
  
- **Seção 4: Movimentação**
  - Mover projeto (com validação de ciclo)
  - Reordenar subprojetos
  - Mover tasks entre projetos
  
- **Seção 5: Deleção**
  - Soft delete (recomendado)
  - Hard delete (⚠️)
  - Restaurar
  - Limpeza de antigos
  
- **Seção 6: Análise e Métricas**
  - Contar por tipo
  - Calcular conclusão
  - Analisar hierarquia (profundidade, complexidade)
  
- **Seção 7: Validações**
  - Validar ciclos
  - Validar profundidade
  - Validar permissões

**Quando ler:** Quando precisa de código pronto para usar

---

## 🔄 FLUXO DE ESTUDO RECOMENDADO

```
┌─────────────────────────────────────────────────────────┐
│ PASSO 1: Quick Reference (5 min)                        │
│ → Entender o conceito básico                            │
│ → Ler: PROJECT_HIERARCHY_QUICK_REF.md                   │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ PASSO 2: Complete Guide (30 min)                        │
│ → Entender TUDO em profundidade                         │
│ → Ler: PROJECT_HIERARCHY_COMPLETE_GUIDE.md              │
│ → Focar em:                                             │
│   - Schema da tabela                                    │
│   - Como parentId funciona                              │
│   - Relacionamentos                                     │
│   - 4 exemplos práticos                                 │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ PASSO 3: Visual Examples (20 min)                       │
│ → Ver como funciona "na vida real"                      │
│ → Ler: PROJECT_HIERARCHY_VISUAL_EXAMPLES.md             │
│ → Escolher 1-2 casos relevantes para seu contexto       │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ PASSO 4: Queries & Code (40 min)                        │
│ → Aprender a FAZER operações                            │
│ → Ler: PROJECT_HIERARCHY_QUERIES.md                     │
│ → Copiar funções relevantes para seu código             │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│ PASSO 5: Implementação                                  │
│ → Agora você está pronto para:                          │
│   - Criar projetos e subprojetos                        │
│   - Buscar dados com recursão                           │
│   - Mover items entre projetos                          │
│   - Validar operações                                   │
│   - Entender a UI                                       │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST: "ENTENDI COMPLETAMENTE PROJECT HIERARCHY"

Depois de ler todos os documentos, você deve ser capaz de:

### Conhecimento Conceitual
- [ ] Explicar o que é Project Hierarchy
- [ ] Explicar como parentId funciona
- [ ] Explicar a diferença entre "projeto raiz" e "subprojeto"
- [ ] Descrever como Tasks se conectam a Projetos
- [ ] Explicar soft delete vs hard delete
- [ ] Listar as regras de validação (ciclos, permissões, etc)

### Conhecimento do Código
- [ ] Localizar a tabela `projects` no schema
- [ ] Entender as relations em Drizzle
- [ ] Explicar o que cada campo da tabela significa
- [ ] Identificar onde está o Project Hierarchy na UI
- [ ] Entender como ProjectHierarchy.jsx renderiza a árvore
- [ ] Explicar como drag & drop funciona

### Habilidade Prática
- [ ] Escrever uma query para buscar projeto + filhos
- [ ] Escrever uma query recursiva para todos os subprojetos
- [ ] Escrever uma função para mover projeto
- [ ] Escrever uma função para buscar todas as tasks
- [ ] Validar ciclos antes de mover
- [ ] Implementar soft delete corretamente

### Exemplos
- [ ] Descrever 1 caso de uso (startup, livro, goals, agência)
- [ ] Desenhar a hierarquia de um projeto real
- [ ] Listar todos os níveis de profundidade de um caso
- [ ] Contar tasks em uma hierarquia complexa

---

## 🔗 REFERÊNCIAS NO CÓDIGO

### Arquivos Mencionados

| Arquivo | Localização | Função |
|---------|------------|--------|
| Schema | `src/db/schema/core.js` | Tabela `projects` + relations |
| Controller | `src/api/controllers/projectController.js` | Operações CRUD |
| TaskController | `src/api/controllers/taskController.js` | Operações em tasks |
| UI Tree | `src/components/dashboard/ProjectHierarchy.jsx` | Renderização da árvore |
| UI Node | `src/components/dashboard/ProjectNode.jsx` | Node recursivo |
| UI Selector | `src/components/forms/HierarchicalProjectSelector.jsx` | Seletor com indentação |
| UI Breadcrumb | `src/components/dashboard/BreadcrumbDropper.jsx` | Navegação |
| Pages | `src/pages/ProjectView.jsx` | Visão de projeto |
| Docs Originais | `MANUAL_PRANA_11C_ENTIDADES_HIERARCHY.md` | Documentação original |

---

## 🎓 RESUMO: PERGUNTAS RESPONDIDAS

### 1. **Estrutura da Tabela projects**
✅ Respondido em: COMPLETE_GUIDE → Seção 1  
✅ Todos os 20+ campos explicados  
✅ O que cada um significa

### 2. **Como parentId funciona**
✅ Respondido em: COMPLETE_GUIDE → Seção 2  
✅ Recursão explicada  
✅ Múltiplos níveis (SIM, ilimitados)  
✅ Limite de profundidade (Não programático, UI ~5-7)

### 3. **Relacionamentos**
✅ Respondido em: COMPLETE_GUIDE → Seção 3  
✅ Parent → Child relationship  
✅ Project ↔ Task relationship  
✅ Task ↔ Subtask relationship  
✅ Document connections  
✅ Grafo completo de relações

### 4. **Exemplos Práticos**
✅ Respondido em: COMPLETE_GUIDE → Seção 4 + VISUAL_EXAMPLES  
✅ 4 exemplos reais completos  
✅ SaaS, Livro, Goals Pessoais, Agência

### 5. **Operações Comuns**
✅ Respondido em: COMPLETE_GUIDE → Seção 5 + QUERIES  
✅ Criar subprojeto  
✅ Buscar hierarquia completa  
✅ Mover task entre projetos  
✅ Deletar projeto  
✅ Buscar todas as tasks (recursivo)  
✅ 20+ operações específicas

### 6. **Visualização na UI**
✅ Respondido em: COMPLETE_GUIDE → Seção 6  
✅ ProjectHierarchy.jsx (tree expansível)  
✅ ProjectNode.jsx (renderização recursiva)  
✅ Componentes auxiliares  
✅ Drag & drop

---

## 💡 DICAS IMPORTANTES

### Para Developers

1. **Sempre use soft delete** (`deletedAt`) para não perder dados
2. **Valide ciclos** antes de mover projeto para subprojeto
3. **Cache a hierarquia** em estado para melhor performance
4. **Use `with` do Drizzle** para incluir relações eficientemente
5. **Pagine tasks** se houver >100 em um projeto

### Para Entendimento

1. **Project Hierarchy É TUDO** em Prana - organize tudo por projetos
2. **Soft delete = arquivo permanente** - nada desaparece, só marca como deletado
3. **parentId é recursivo** - um projeto pode ter N filhos, que têm N filhos, etc
4. **UI é tree expansível** - como VS Code Explorer, pode expandir/colapsar
5. **Valide SEMPRE antes de mover** - evite ciclos e validar permissões

### Performance

1. Não busque todos os subprojetos sem limite
2. Use filtros com `parentId` específico
3. Pagine results grandes
4. Index em: parentId, ownerId, status
5. Cache da breadcrumb/árvore no frontend

---

## 🚀 PRÓXIMOS PASSOS

Após entender Project Hierarchy:

1. ✅ Entender Task Hierarchy (parentId em tasks para subtasks)
2. ✅ Entender Permissions (quem pode editar qual projeto)
3. ✅ Entender Dashboard Filters (filtrar por tipo, status, etc)
4. ✅ Entender File-Task Association (vincular documentos)
5. ✅ Explorar Views (Kanban, Sheet, etc)

---

## 📞 PERGUNTAS FREQUENTES

**P: Can I have more than 5 levels of nesting?**  
A: Sim, teoricamente ilimitado. Mas UI começa a ficar confusa >5 níveis.

**P: O que acontece se deletar um projeto com subprojetos?**  
A: Soft delete marca como deletado. Hard delete é cascata. Use soft delete.

**P: Como evitar ciclos (A → B → C → A)?**  
A: Validar antes de mover - ver função `hasCycle()` em QUERIES.

**P: Tasks podem estar em qualquer nível?**  
A: Sim, cada task tem `projectId` que aponta para qualquer nível.

**P: Posso mover projeto entre pais?**  
A: Sim, via drag & drop ou API - atualiza `parentId`.

---

**✅ DOCUMENTAÇÃO COMPLETA E PRONTA PARA USAR!**

Agora você entende **COMPLETAMENTE** como Project Hierarchy funciona em Prana. 🎉

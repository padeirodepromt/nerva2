# 📊 CAPÍTULO 11A: CADA VIEW EM DETALHES

**Versão:** 1.0 | **Capítulo:** 11A | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Prana oferece **4 visualizações diferentes** do mesmo conjunto de dados. Cada view é otimizada para um tipo de trabalho diferente. Este capítulo explica:

- **Quando usar cada view**
- **O que cada view revela**
- **Como interagir com ela**
- **Casos de uso reais**

**Público:** Todos os usuários  
**Tempo de leitura:** 20 minutos  
**Pré-requisito:** [Capítulo 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md)

---

## 🎯 AS 4 VIEWS DE PRANA

Cada view oferece uma perspectiva única sobre seus artefatos:

| View | Melhor para | Visualização | Interação |
|------|-----------|---|---|
| **ListView** | Visão unificada | Flat, unified | Rápida, completa |
| **SheetView** | Análise tabular | Tabela estruturada | Edição célula-a-célula |
| **KanbanView** | Fluxo de trabalho | Cards por status | Drag-and-drop intuitivo |
| **MindmapView** | Relações & contexto | Nós conectados | Exploração visual |

---

## 📋 LISTVIEW: A VISÃO UNIFICADA

### O que é?

ListView é a visualização **mais completa**. Mostra TODOS os seus artefatos em uma lista única, independente de qual projeto pertencem. É como um "dashboard flat" de tudo que você tem.

### Quando usar?

- 🔍 **Procurando algo específico**: ListView permite filtrar, buscar, sortear
- 📊 **Visão geral holística**: Ver tudo que existe no sistema
- 🏃 **Trabalho rápido**: Pegar a próxima tarefa sem navegar projetos
- 🎯 **Priorização**: Decidir QUAL tarefa fazer agora (energy matching)
- 📈 **Análise**: Quantas tarefas em cada status? Distribuição de energia?

### Como funciona?

Você vê uma lista com colunas:

```
| Título | Projeto | Tipo | Status | Energia | Prazo | Tags |
```

Você pode:

**Filtrar por:**
- Status (To-do, In Progress, Done)
- Projeto
- Tipo de artefato (Task, Event, Checklist, Document)
- Energia requerida
- Tags customizadas
- Data (hoje, esta semana, vencidas)

**Sortear por:**
- Prioridade (alta → baixa)
- Data de vencimento
- Energia (fácil → difícil)
- Data de criação (mais novo/antigo)
- Projeto (A-Z)

**Editar rápido:**
- Clique em uma coluna para editar inline
- Shift-click para múltiplas seleções
- Drag para reordenar (com drag-handle)

### Exemplo de Uso Real

**Cenário:** Você acordou com energia MÉDIA (5/10). Quer saber que tarefas são apropriadas.

1. Abre ListView
2. Filtra: Status = "To-do" + Energy = "Baixa/Média"
3. Sorteia por: Prioridade (alta primeiro)
4. Vê: 3 tarefas de prioridade alta que combinam sua energia
5. Pega a primeira e começa

**Resultado:** Trabalho eficiente, sem deixar tarefas pesadas para depois.

---

## 📑 SHEETVIEW: A VISÃO TABULAR

### O que é?

SheetView é como uma **planilha**. Mesmos dados que ListView, mas em formato de tabela tipo Excel/Google Sheets, com células editáveis e cálculos.

### Quando usar?

- 💼 **Trabalho em lote**: Editar múltiplas tarefas rapidamente
- 📊 **Análise de dados**: Cálculos, agregações, resumos
- 🔢 **Campos numéricos**: Priority, estimated_hours, completion_%
- 📈 **Dashboards pessoais**: Mostrar relatórios consolidados
- 🎯 **Planejamento**: Layout side-by-side de grande volume

### Como funciona?

Você vê uma tabela clássica:

```
┌────┬──────────┬─────────┬────────┬────────┬────────┐
│ ID │ Título   │ Projeto │ Status │ Energy │ Prazo  │
├────┼──────────┼─────────┼────────┼────────┼────────┤
│ 1  │ Task A   │ Project │ Done   │ High   │ 15/01  │
│ 2  │ Task B   │ Project │ To-do  │ Medium │ 20/01  │
└────┴──────────┴─────────┴────────┴────────┴────────┘
```

**Interações:**
- Clique em célula → edita (se permitido)
- Tab/Enter → navega entre células
- Drag coluna → reordena
- Clique header → sorteia
- Selecione múltiplas linhas → ações em batch

### Exemplo de Uso Real

**Cenário:** Você quer revisar TODAS as tarefas de um projeto, ajustar prazos e prioridades.

1. Abre SheetView de Project X
2. Vê tabela com todas as tarefas
3. Clica em célula de Prazo → edita
4. Clica em célula de Priority → edita
5. Salva (auto-save) e pronto

**Resultado:** Planejamento rápido sem entrar em cada tarefa individualmente.

---

## 🎯 KANBANVIEW: O FLUXO DE TRABALHO

### O que é?

KanbanView é a **visualização de workflow**. Mostra tarefas como cards organizados em **colunas por status** (To-do, In Progress, Review, Done). Muito usado em metodologias ágeis.

### Quando usar?

- 🔄 **Fluxo visual**: Ver progresso do projeto
- 🏃 **Work-in-progress**: Quantas tarefas estão em andamento?
- 👥 **Equipes**: Coordenar tarefas entre pessoas (mesmo sendo single-user, útil para cena mental)
- 🎬 **Sprints**: Organizar tarefas por ciclos de trabalho
- 📊 **Bottlenecks**: Identificar gargalos (coluna com muitos cards)

### Como funciona?

Você vê colunas organizadas por status:

```
┌─────────┬─────────────┬──────────┬────────┐
│ To-do   │ In Progress │ Review   │ Done   │
├─────────┼─────────────┼──────────┼────────┤
│ Card A  │ Card D      │ Card F   │ Card H │
│ Card B  │ Card E      │          │ Card I │
│ Card C  │             │          │        │
└─────────┴─────────────┴──────────┴────────┘
```

**Interações:**
- **Drag-and-drop**: Arrasta card de uma coluna para outra → muda status
- **Clique em card**: Abre detalhes
- **Adiciona coluna customizada**: Pode criar status custom (Waiting, Blocked, etc)
- **Agrupa por campo**: Em vez de status, agrupa por Projeto, Energia, Atribuído para...

### Exemplo de Uso Real

**Cenário:** Você tem um projeto com fluxo de trabalho: Planejamento → Design → Dev → QA → Done

1. Abre KanbanView do projeto
2. Vê 5 colunas: uma para cada status
3. Puxa card de "Design" para "Dev" → marcada como iniciada
4. Vê que "QA" tem 10 cards (gargalo!)
5. Avalia: pode começar novo card em Dev ou ajudar em QA?

**Resultado:** Visibilidade clara do pipeline, fácil identificar blockers.

---

## 🧠 MINDMAPVIEW: AS RELAÇÕES

### O que é?

MindmapView é a visualização **relacional**. Mostra seus artefatos como **nós em um gráfico**, conectados por relacionamentos (dependências, referências, tópicos).

### Quando usar?

- 🗺️ **Pensamento visual**: Ver a "floresta" não só "árvores"
- 🔗 **Dependências**: Entender qual tarefa bloqueia qual
- 💡 **Brainstorming**: Capturar ideias conectadas
- 🏗️ **Arquitetura**: Visualizar estrutura de um projeto grande
- 📚 **Knowledge mapping**: Ver como conhecimentos se conectam (útil com Documents)

### Como funciona?

Você vê um mapa com nós e arestas (linhas conectando):

```
           Projeto X
             /   \
          Task A   Task B
           / \      |
      Sub1  Sub2  Task C
                    |
                (depende de A)
```

**Interações:**
- **Pan & Zoom**: Explore o mapa (mouse wheel ou trackpad)
- **Clique nó**: Abre detalhes do artefato
- **Arrasta nó**: Reorganiza visualmente (não muda dados)
- **Hover**: Mostra tooltip com informações
- **Filtros**: Mostra/esconde certos tipos de relacionamentos

### Exemplo de Uso Real

**Cenário:** Você tem um projeto complexo com 30 tarefas. Quer entender a estrutura completa.

1. Abre MindmapView do projeto
2. Vê mapa com todas as tarefas conectadas
3. Identifica: "Tarefa X bloqueia 5 outras tarefas" (nó central)
4. Clica em Tarefa X para aprender mais
5. Decide: "Preciso prioritizar isso para desbloquear outros"

**Resultado:** Compreensão holística de complexidade, melhor priorização.

---

## 🎨 COLORPALETTE: PERSONALIZAÇÃO VISUAL

### O que é?

ColorPalette não é uma "view" tradicional, mas um **painel de personalização visual**. Você define:

- Cores para projetos
- Cores para tags
- Cores para status customizados
- Ícones para tipos de artefatos
- Temas (claro, escuro, custom)

### Quando usar?

- 👁️ **Organização visual**: Cores ajudam memória visual
- 🎨 **Estética pessoal**: Tornar a interface atraente
- 🏗️ **Hierarquia visual**: Cores indicam importância/categoria
- ♿ **Acessibilidade**: Escolher cores que você consegue diferenciar bem

### Como funciona?

Você acessa Settings → Colors & Icons e:

1. Seleciona elemento (projeto, tag, status)
2. Escolhe cor (color picker)
3. Seleciona ícone (da biblioteca ou faz upload)
4. Salva (reflete imediatamente em todas as views)

### Exemplo de Uso Real

**Cenário:** Você tem 3 grandes áreas de vida: Work, Personal, Health

1. Vai em Settings → Colors
2. Atribui: Work = Azul, Personal = Verde, Health = Vermelho
3. Volta a ListVi

ew/KanbanView
4. Imediatamente vê todos os cards coloridos por área
5. Sua mente consegue processar visualmente muito mais rápido

**Resultado:** Organização visual intuitiva, melhor navegação mental.

---

## ⚙️ SETTINGS: CONFIGURAÇÃO DAS VIEWS

### O que é?

Settings é onde você **configura como as views funcionam**. Inclui:

- **Preferências padrão**: Qual view abre quando você entra em um projeto?
- **Colunas visíveis**: Em SheetView, quais colunas mostrar?
- **Filtros salvos**: Salvar combinações de filtros que você usa frequentemente
- **Ordenação padrão**: Como sortear por padrão (por prioridade? por prazo?)
- **Grupos padrão**: KanbanView agrupa por status ou por outra coisa?
- **Comportamentos**: Double-click abre card ou edita inline?

### Quando usar?

- ⚡ **Produtividade**: Configurar as views do jeito que você trabalha
- 🎯 **Workflow**: Salvar "espaços de trabalho" diferentes
- 👁️ **Foco**: Ocultar colunas/informações que distraem

### Como funciona?

1. Abre projeto
2. Clica em "⚙️ View Settings"
3. Escolhe qual view (ListView, Sheet, Kanban, Mindmap)
4. Configura opções (colunas, filtros, ordenação)
5. Clica "Save as Default" ou "Save Preset"
6. Próxima vez que entrar, já está configurado

### Exemplo de Uso Real

**Cenário:** Você tem 2 workflows: "Design" e "Dev"

1. Cria preset para Design:
   - View: Kanban
   - Filtros: Type = Design Tasks
   - Agrupa por: Designer (atribuído para)
   - Salva como "Design Workflow"

2. Cria preset para Dev:
   - View: SheetView
   - Filtros: Type = Dev Tasks
   - Colunas: Title, Status, Developer, Days Until Deadline
   - Salva como "Dev Workflow"

3. Agora rápido alterna entre os dois
4. Cada um tem sua configuração otimizada

**Resultado:** Contextos de trabalho separados, mentalmente mais organizado.

---

## 🔄 FLUXO: QUAL VIEW USAR QUANDO?

### Meu Dia Típico com Views

**08:00 - Morning Check-in**
- Abre **ListView**
- Filtra: Status = "To-do" + Energy = minha energia atual
- Escolhe primeira tarefa

**10:00 - Projeto em Desenvolvimento**
- Abre **KanbanView** do projeto
- Arrasta seu card para "In Progress"
- Vê se algo está bloqueado

**14:00 - Reunião de Planejamento**
- Abre **MindmapView**
- Mostra para alguém: "Essa é a estrutura do projeto"
- Explica dependências

**16:00 - Revisão de Prazos**
- Abre **SheetView**
- Sorteia por "Due Date"
- Ajusta prazos que ficaram para trás

**18:00 - Retrospectiva**
- Volta a **ListView**
- Filtra: Status = "Done" + Date = "Hoje"
- Sente conquista vendo tudo que completou

---

## 📊 TABELA COMPARATIVA

| Aspecto | ListView | SheetView | KanbanView | MindmapView |
|---------|----------|-----------|-----------|-------------|
| **Melhor para** | Busca, filtros | Edição em lote | Workflow | Visualizar relações |
| **Volume** | 100+ itens | 50+ itens | 20-50 itens | Qualquer |
| **Visualização** | Compacta | Tabular | Cards | Nós-arestas |
| **Interação** | Click, filtro | Célula-a-célula | Drag-drop | Pan, zoom |
| **Velocidade** | Muito rápida | Rápida | Média | Média |
| **Curva aprendizado** | Fácil | Muito fácil | Fácil | Média |
| **Ideal para novatos** | ✅ | ✅ | ✅ | ❌ |
| **Ideal para power users** | ✅ | ✅ | ✅ | ✅ |

---

## 💡 DICAS & TRUQUES

### Atalhos Úteis

- **Ctrl/Cmd + F** em ListView: Abre busca rápida
- **Ctrl/Cmd + Shift + F** em SheetView: Filtro avançado
- **Duplo-clique** em card KanbanView: Abre detalhes
- **Arrasta card** entre colunas Kanban: Muda status sem abrir

### Performance

- Se tem 500+ tarefas: use **ListView com filtros** (mais rápido)
- Se tem 20 tarefas: **MindmapView** revela estrutura melhor
- Se edita muitos dados: **SheetView** é mais ágil
- Se quer visão operacional: **KanbanView** é ideal

### Combinando Views

O poder de Prana é que **você não escolhe uma view**. Você usa TODAS:

- **Planejamento** (semana): SheetView + MindmapView
- **Execução** (dia): ListView + KanbanView
- **Análise** (mês): ListView (filtrada por mês)
- **Criatividade** (brainstorm): MindmapView

---

## 🔗 LEITURA RELACIONADA

- [📋 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md) - Sankalpa e visão diária
- [📑 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md) - Tipos de artefatos e estrutura
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - Ash criando estruturas automaticamente
- [📊 11B - Anatomia da Criação](MANUAL_PRANA_11B_ANATOMIA_CRIACAO.md) - Como criar artefatos

---

**Próximo capítulo:** [🏗️ 11B - Anatomia da Criação](MANUAL_PRANA_11B_ANATOMIA_CRIACAO.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*

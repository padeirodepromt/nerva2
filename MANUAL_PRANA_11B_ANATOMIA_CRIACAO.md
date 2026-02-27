# 🏗️ CAPÍTULO 11B: ANATOMIA DA CRIAÇÃO

**Versão:** 1.0 | **Capítulo:** 11B | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo explora **como artefatos são criados em Prana**. Não é sobre usar a interface, é sobre entender os **caminhos, processos e filosofia** por trás da criação.

Você aprenderá:

- ✅ **3 caminhos de criação**: Manual, Ash automático, Templates, Importação
- ✅ **Anatomia de cada processo**: O que acontece passo-a-passo
- ✅ **Templates**: O que são, por que usá-los, como criar próprios
- ✅ **Fluxos de aprovação**: Como Ash pede autorização antes de criar
- ✅ **Permanência de dados**: Nada é deletado, tudo permanece

**Público:** Todos os usuários, especialmente PMs e Designers  
**Tempo de leitura:** 30 minutos  
**Pré-requisito:** [Capítulo 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md)

---

## 🎯 AS 4 FORMAS DE CRIAR ARTEFATOS

| Forma | Iniciativa | Estrutura | Flexibilidade | Velocidade |
|-------|-----------|-----------|---------------|-----------|
| **Manual** | Você | Do zero | Total | Lenta |
| **Ash** | Sistema | Ash propõe | Você aprova | Rápida |
| **Template** | Você | Pré-pronto | Alta | Muito rápida |
| **Importação** | Você | De fora | Automática | Instantânea |

---

## 1️⃣ CRIAÇÃO MANUAL: VOCÊ CONTROLA TUDO

### O Que é?

Criação manual é quando **você preenchche um formulário** com detalhes de um novo artefato. Você escolhe TUDO: título, tipo, estrutura, metadata.

### Anatomia do Processo Manual

```
┌─────────────┐
│ Você clica  │
│ "New Task" │
└──────┬──────┘
       │
┌──────▼────────────────────┐
│ Modal de Criação Abre      │
│ (formulário em branco)     │
└──────┬────────────────────┘
       │
┌──────▼────────────────────┐
│ Você preenche:             │
│ - Título                   │
│ - Descrição                │
│ - Tipo (Task/Event/...)    │
│ - Projeto                  │
│ - Energia requerida        │
│ - Prioridade               │
│ - Prazo                    │
│ - Tags                     │
└──────┬────────────────────┘
       │
┌──────▼────────────────────┐
│ Você clica "Create"        │
└──────┬────────────────────┘
       │
┌──────▼────────────────────┐
│ Sistema valida dados       │
│ (campos obrigatórios ok?)  │
└──────┬────────────────────┘
       │
       ├─ Erro? → Mostra mensagem, volta ao form
       │
       └─ Ok? → Cria artefato
              │
        ┌─────▼────────────────────┐
        │ Artefato criado!          │
        │ ID gerado                 │
        │ created_at = agora        │
        │ status = "todo"           │
        │ is_archived = false       │
        └──────────────────────────┘
```

### Quando Usar Criação Manual?

✅ **Use quando:**
- Você tem ideia clara e completa
- Quer estruturar desde zero
- Artefato é único/especial
- Quer máximo controle

❌ **Evite quando:**
- Criação é repetitiva (use Template!)
- Tem muitos campos (use Ash!)
- Sabe pouco sobre estrutura (use Template!)

### Exemplo: Criar Task Manualmente

**Cenário:** Você quer criar uma task para "Redesenhar Logo"

1. Abre novo projeto "Branding"
2. Clica "New Task" no dashboard ou na view
3. Preenchche:
   - Title: "Redesenhar Logo - Versão Final"
   - Description: "Refinar versão anterior, incorporar feedback"
   - Type: Task
   - Project: Branding
   - Energy: High (porque design criativo requer energia)
   - Priority: 5 (máxima)
   - Due Date: 2025-02-15
   - Tags: #design #criativo #marca

4. Clica "Create Task"
5. Sistema gera ID único, salva timestamp
6. Task aparece em ListView, KanbanView, etc

### Campos Customizáveis

Dependendo do **tipo de artefato**, você pode adicionar campos extras:

**Para TASK:**
- Estimated hours
- Checklist (sub-tasks)
- Dependencies (qual tarefa precisa ser feita antes)
- Assigned to (você ou alguém, em versão multi-user)

**Para EVENT:**
- Time (que hora)
- Location (onde)
- Attendees (quem participa)
- Reminder (aviso antes)

**Para CHECKLIST:**
- Items (lista de checks)
- Repeat rule (diariamente, semanalmente?)
- Completion percent (progresso)

**Para DOCUMENT:**
- Content type (text, code, design, research, etc)
- Access level (private, shared, public)
- Linked artifacts (referências a outras tarefas)

---

## 2️⃣ CRIAÇÃO COM ASH: INTELIGÊNCIA AUTOMÁTICA

### O Que é?

Criação com Ash é quando você **expressa uma ideia (qualquer formato)** e **Ash propõe estrutura completa**.

Exemplo:
- Você: "Preciso redesenhar o landing page"
- Ash: "Ótimo! Posso criar um projeto com fases e tarefas pré-estruturadas?"
- Você: "Sim" ✅ → Projeto criado
- Você: "Não, deixa comigo" ❌ → Nada é criado

### Anatomia do Processo Ash

```
┌──────────────────┐
│ Você expressa    │
│ uma ideia        │
│ (qualquer forma) │
└────────┬─────────┘
         │
    Pode ser:
    - Chat com Ash
    - Spark capture
    - Diary entry
    - Voice note
         │
┌────────▼──────────────────┐
│ Ash processa contexto:     │
│ - Seu histórico            │
│ - Padrões anteriores       │
│ - Energia atual            │
│ - Projetos similares       │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Ash analisa a ideia:       │
│ - Qual tipo de artefato?   │
│ - Qual complexidade?       │
│ - Qual estrutura faz       │
│   sentido?                 │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Ash prepara proposta:      │
│ - Título do projeto        │
│ - 3-5 fases                │
│ - 10-15 tasks iniciais     │
│ - Estimativas              │
│ - Priorização              │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Ash PEDE APROVAÇÃO         │
│ "Posso criar isso?"        │
│ [Sim] [Não] [Customizar]   │
└────────┬──────────────────┘
         │
    Seu voto:
    │
    ├─ Sim → Cria imediatamente
    │         └─ Projeto + Fases + Tasks criadas
    │
    ├─ Não → Nada criado
    │        └─ Ash: "Sem problema, quer tentar algo diferente?"
    │
    └─ Customizar → Abre para edição
               └─ Você ajusta, depois aprova

┌────────▼──────────────────┐
│ ✅ Tudo criado!           │
│ Artefatos prontos         │
│ Estrutura automática      │
│ Você começa a trabalhar   │
└───────────────────────────┘
```

### Quando Usar Ash?

✅ **Use quando:**
- Ideia ainda está vaga/caótica
- Quer estrutura completa rápido
- Projeto é complexo
- Quer acelerar planejamento

❌ **Não use quando:**
- Projeto é muito simples (1 ou 2 tasks)
- Já tem estrutura clara
- Quer máximo detalhe

### Exemplo: Criar Projeto com Ash

**Cenário:** Você tem ideia: "Quero fazer um curso online sobre meu produto"

**Você para Ash:**
"Tenho ideia de criar um curso online sobre meu produto. Seria tipo um programa de 6 semanas com vídeos, exercícios, comunidade. Quer ajudar?"

**Ash responde:**
"Ótimo! Posso estruturar assim:

📚 **Projeto:** Curso Online - Produto X

**Fases:**
1. Planning (pesquisa, structure, scripts) - 2 semanas
2. Production (gravação, edição, design) - 4 semanas
3. Launch (plataforma, marketing, comunidade) - 1 semana

**Tarefas iniciais:**
- Phase 1: Pesquisa de concorrentes, Outline estrutura, Escrever scripts, etc
- Phase 2: Montar estúdio, Gravar módulo 1, Editar vídeos, etc
- Phase 3: Setup LMS, Criar landing page, Configure emails, etc

**Total:** ~30 tarefas distribuídas

**Estimativa de energia:** Média-alta (criatividade + execução)

Quer que eu crie isso? [Sim] [Não] [Ajustar]"

**Você:**
Clica [Sim]

**Resultado:**
Projeto inteiro criado com estrutura pronta para começar amanhã.

### Autorização: A Chave

**Ponto crítico:** Ash **NUNCA cria sem sua aprovação explícita**.

Por quê? Para **não poluir o sistema** com criações que você não quer. Sua permissão mantém tudo intencional.

Fluxo sempre é:

```
Ash propõe → Você aprova ✅ → Cria
             Você nega ❌ → Nada
             Você customiza → Você aprova → Cria
```

Isso diferencia Ash de AIs proativas que "sabem o que é bom pra você".

---

## 3️⃣ CRIAÇÃO COM TEMPLATES: REUTILIZAÇÃO INTELIGENTE

### O Que é?

Templates são **estruturas pré-pronta** que você pode usar para criar artefatos rapidamente. Tipo um "clone com botão".

Exemplo de templates:

- **Task Template:** "Code Review" (com checklist: look at diff, test locally, comment, etc)
- **Project Template:** "Product Launch" (com fases, tarefas, timeline)
- **Document Template:** "Meeting Notes" (com sections: agenda, decisions, action items)

### Tipos de Templates

#### 1. Templates de Sistema (Pré-construídos)

Prana vem com templates prontos para uso comum:

**Para Tasks:**
- Daily Standup (checklist)
- Code Review (checklist + assuntos)
- Team Sync (com tempo alocado)
- Bug Fix (com steps)
- Feature Development (com fases)

**Para Projects:**
- Product Launch
- Marketing Campaign
- Design Sprint
- Research Project
- Learning Journey

**Para Documents:**
- Meeting Notes
- Retrospective
- Project Plan
- Research Findings
- Brainstorm Session

#### 2. Templates Customizados (Seus próprios)

Você pode criar templates a partir de artefatos existentes:

**Como criar:**
1. Cria um artefato "modelo"
2. Preenche com estrutura, campos, checklist
3. Clica "Save as Template"
4. Nomeai (ex: "Weekly Review Template")
5. Salva

**Próxima vez:**
1. Clica "New Task" (ou Project, Document)
2. Seleciona "From Template"
3. Escolhe seu template
4. Valores aparecem preenchidos
5. Customiza se necessário
6. Cria

### Anatomia do Processo Template

```
┌──────────────────┐
│ Você clica       │
│ "New Task"       │
└────────┬─────────┘
         │
┌────────▼──────────────────┐
│ Menu de criação abre:      │
│ [From Scratch]             │
│ [From Template] ← escolhe  │
│ [From Ash]                 │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Lista de templates:        │
│ - Daily Standup            │
│ - Code Review              │
│ - My Custom Template       │
│ ... (clica no desejado)    │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Template carrega:          │
│ - Título (com prefixo)     │
│ - Descrição padrão         │
│ - Checklist pré-pronto     │
│ - Tags                     │
│ - Estimativa               │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Você customiza se quiser:  │
│ - Muda título              │
│ - Ajusta descrição         │
│ - Edita checklist          │
│ - Adiciona tags            │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Você clica "Create"        │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ ✅ Task criada!           │
│ Baseada em template       │
│ Customizada por você      │
└───────────────────────────┘
```

### Quando Usar Templates?

✅ **Use quando:**
- Criação é repetitiva (ex: daily standup toda semana)
- Tem padrão consistente (ex: todo code review segue mesmo fluxo)
- Quer garantir completude (não esquecer steps)
- Quer economizar tempo

❌ **Não use quando:**
- Artefato é único
- Estrutura muda cada vez
- Simples demais para template

### Exemplo 1: Template de Daily Standup

**Você cria uma vez:**
```
Title: Daily Standup - [DATE]
Description: Reflexão diária sobre progresso
Checklist:
  ☐ O que completei ontem?
  ☐ O que vou fazer hoje?
  ☐ Algum blocker?
  ☐ Energy level? Mood?
  ☐ Insights/aprendizados?
Tags: #standup #daily #reflection
Energy: Low
Estimated time: 10 min
```

**Clica "Save as Template" → "Daily Standup"**

**Próxima vez:**
1. Clica "New" no Diário
2. Seleciona Template "Daily Standup"
3. Muda [DATE] para hoje
4. Cria
5. Preenchche checklist
6. Pronto!

**Resultado:** Processo sistemático, garantido não esquece nada, 30 seg para criar vs 2 min do zero.

### Exemplo 2: Template de Projeto

**Você já fez 5 "product launches" e sabe o padrão:**

```
Project: Product Launch Template
Fases:
1. Planning (1 week)
   - Research market
   - Define positioning
   - Create brief
   - Plan timeline
   
2. Pre-Launch (2 weeks)
   - Create marketing assets
   - Setup landing page
   - Write announcement
   - Organize influencers
   
3. Launch Day (1 day)
   - Go live
   - Share across channels
   - Monitor metrics
   - Engage with community
   
4. Post-Launch (1 week)
   - Analyze metrics
   - Respond to feedback
   - Plan improvements
   - Document learnings
```

**Salva como template "Product Launch"**

**Próxima vez que tem novo produto:**
1. Cria novo projeto a partir do template
2. Muda nome ("Product Launch - Feature X")
3. Todas as fases, tarefas, prazos já estão lá
4. Personaliza se necessário
5. Começa a executar

**Resultado:** 30 min setup vs 2 horas do zero. Padrão consistente em todos os launches.

### Compartilhando Templates

Em versão multi-user (futura), você pode:
- Compartilhar templates com equipe
- Usar templates que outrem criou
- Sugerir templates para biblioteca coletiva

Por enquanto (single-user), seus templates são pessoais.

---

## 4️⃣ IMPORTAÇÃO: DADOS DE FORA

### O Que é?

Importação traz dados de **sistemas externos** para Prana:

- CSV (Excel, Google Sheets)
- JSON (APIs, exports)
- Markdown (notas formatadas)
- Slack (messages)
- Email (forward tasks)

### Quando Usar?

✅ **Use quando:**
- Tem tarefas em sistema antigo (Todoist, Notion, Asana)
- Recebe tarefas por email/Slack
- Tem dados estruturados em CSV

❌ **Raro usar:**
- Novo usuário (comece do zero)
- Poucos itens (crie manual)

### Anatomia da Importação

```
┌────────────────────┐
│ Você seleciona     │
│ arquivo/dados      │
│ para importar      │
└────────┬───────────┘
         │
┌────────▼────────────────┐
│ Prana analisa formato:   │
│ - CSV? JSON? Markdown?   │
│ - Valida estrutura       │
│ - Tenta mapear campos    │
└────────┬────────────────┘
         │
    Detecta estrutura
    │
    └─ Título, descrição, data, status?
    
┌────────▼──────────────────────┐
│ Pede mapeamento de campos:    │
│ "Qual coluna é o título?"     │
│ "Qual é a data?"              │
│ "Qual coluna é prioridade?"   │
│ ... (você confirma)           │
└────────┬──────────────────────┘
         │
┌────────▼──────────────────────┐
│ Mostra preview:               │
│ "Vou importar 47 tarefas"     │
│ [Cancelar] [Importar]         │
└────────┬──────────────────────┘
         │
    Você clica [Importar]
    │
┌────────▼──────────────────────┐
│ Cria artefatos em batch       │
│ - Gera IDs                    │
│ - Mapeia dados                │
│ - Salva timestamps            │
│ - Cria relacionamentos        │
└────────┬──────────────────────┘
         │
┌────────▼──────────────────────┐
│ ✅ Importação completa!       │
│ 47 tarefas agora em Prana     │
│ Status: To-do (default)       │
│ is_archived: false            │
└───────────────────────────────┘
```

### Exemplo: Migrar de Todoist

**Você em Todoist:**
1. Exporta tarefas como CSV
2. Download: "todoist_export.csv"

**Você em Prana:**
1. Abre menu "Import"
2. Seleciona arquivo CSV
3. Prana detecta: "Parece Todoist!"
4. Mapeamento automático:
   - "task_name" → Título
   - "due_date" → Due Date
   - "priority" → Priority
   - "project" → Project
5. Preview: "147 tasks para importar"
6. Clica [Importar]
7. Aguarda (alguns segundos)
8. Pronto! Todas as 147 tasks agora em Prana

**Resultado:** Zero retrabalho, dados históricos preservados.

---

## 📊 COMPARAÇÃO: 4 FORMAS LADO-A-LADO

| Aspecto | Manual | Ash | Template | Importação |
|---------|--------|-----|----------|-----------|
| **Tempo** | Lento | Rápido | Muito rápido | Instantâneo |
| **Estrutura** | Sua | Inteligente | Pré-pronta | Mapeada |
| **Flexibilidade** | Total | Alta | Média | Baixa |
| **Aprovação** | N/A | Precisa ✅ | N/A | N/A |
| **Ideal para** | Único | Complexo | Repetitivo | Migração |
| **Aprendizado** | Nenhum | Sistema aprende | Você aprende | N/A |
| **Começar** | Zero | Ideia vaga | Já usou | Dados externos |

---

## 🔄 FLUXO REAL: SUA SEMANA

### Segunda-feira
- **Ash:** "Semana chegou, posso estruturar os projetos?" → Você aprova → Projetos criados

### Terça-feira
- **Manual:** Cria tarefa específica de design

### Quarta-feira
- **Template:** Usa "Daily Standup" para reflexão
- **Template:** Usa "Code Review Checklist" para revisar PR

### Quinta-feira
- **Ash:** Você fala "Preciso fazer uma research sobre mercado" → Ash propõe estrutura → Você aprova

### Sexta-feira
- **Nada novo:** Só executa e completa tarefas criadas nos dias anteriores

### Fim de semana
- **Importação:** Importa tarefas pessoais de app antigo (uma vez)

---

## 🛡️ PERMANÊNCIA: NADA DESAPARECE

Conceito crítico: **Quando você cria algo, fica para sempre**.

### O que acontece quando você "completa" ou "deleta"?

**Marcar como Done:**
- Status muda para "done"
- Completion date é registrada
- Permanece visível em ListView (com filtro "Done")

**Arquivar (ao invés de deletar):**
- is_archived = true
- Não aparece em views normais (a menos que filtre)
- Ainda pesquisável em Papyrus
- Pode "desarquivar" se mudar de ideia

**Deletar (raramente):**
- Você pede para deletar
- Ash pede confirmação: "Tem certeza? Isso é permanente"
- Se confirma, move para "trash" (pode recuperar por 30 dias)
- Depois 30 dias, deletado de verdade

### Por que permanência importa?

1. **Memória:** Você pode revisar o que fez, aprender padrões
2. **Rastreabilidade:** Historicamente, quando foi concluído?
3. **Reuso:** Conhecimento capturado permanece acessível
4. **Confiança:** Não perdem dados acidentalmente

---

## 💡 BOAS PRÁTICAS

### Quando Usar Cada Forma

**Manual:**
- Projeto novo, complexo, sem padrão anterior
- Quer estruturar do zero
- Tem tempo

**Ash:**
- Ideia vaga, precisa organizar rápido
- Projeto similar a passados
- Quer sugestão estruturada

**Template:**
- Processo repetitivo
- Já sabe exatamente qual estrutura
- Quer garantir consistência

**Importação:**
- Migração do sistema antigo
- Dados em CSV/arquivo
- Uma única vez

### Anti-padrões

❌ **Não fazer:**
- Criar tudo manualmente quando templates existem
- Usar Ash para coisas simples (overkill)
- Ignorar estruturas de templates que templates oferecem
- Ter 10 templates quando 3 cobrem 80% dos casos

---

## 🔗 LEITURA RELACIONADA

- [📋 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md) - Visão diária dos artefatos
- [📑 08 - Tasks & Artefatos](MANUAL_PRANA_08_TAREFAS.md) - Tipos e estrutura de artefatos
- [📊 11A - Cada View em Detalhes](MANUAL_PRANA_11A_VIEWS_DETALHADAS.md) - Como visualizar o que você criou
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - Como Ash propõe estruturas

---

**Próximo capítulo:** [📚 12 - Guia para Desenvolvedores](MANUAL_PRANA_12_GUIA_DEV.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*

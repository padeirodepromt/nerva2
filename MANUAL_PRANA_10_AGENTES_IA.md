# 🤖 MANUAL PRANA 10 - ASH & INTELIGÊNCIA IA

**Versão:** 3.0.1 | **Capítulo:** 10 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo descreve **Ash**, o sistema de inteligência artificial de Prana: o que é, como funciona, capacidades principais, e como se integra com o sistema holístico.

**Público:** Product Managers, Designers, Desenvolvedores  
**Tempo de leitura:** 25 minutos  
**Pré-requisitos:** [Capítulo 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md)

---

## 🧠 O QUE É ASH?

**Ash** é o **"cérebro inteligente"** de Prana. Funciona como um assistente IA que:

- **Processa contexto completo** da vida do usuário (energia, mood, tarefas, eventos, histórico)
- **Gera insights personalizados** baseados em padrões e tendências
- **Recomenda ações** apropriadas para o estado atual do usuário
- **Escreve conteúdo** quando solicitado (descrições, sugestões, análises)
- **Conecta dados** de múltiplas fontes para visão holística
- **Aprende** com o tempo, melhorando recomendações

Ash não é um agente "marketing" ou "especialista em vendas". É um **assistente de vida** que ajuda o usuário a viver de forma mais consciente e produtiva.

### Modelo Técnico

Ash utiliza **GPT-4.1** (OpenAI) como seu modelo base. Esta escolha foi feita por:

- **Qualidade superior** em compreensão de contexto complexo
- **Raciocínio melhorado** para análises multi-dimensionais (energia + mood + astrologia + tarefas)
- **Melhor multilíngue** (especializado em português)
- **Custo-benefício** otimizado para escala

---

## � FUNÇÕES PRINCIPAIS DE ASH

Ash executa 6 funções principais dentro do sistema Prana:

### 1. Organização Automática (Projeto & Tarefas)

**O que é:** Ash transforma ideias criativas do usuário em estrutura organizada no sistema.

**Como funciona:**

O usuário pode expressar uma ideia de qualquer forma:
- "Quero lançar um produto novo"
- "Preciso reorganizar meu home office"
- "Pensei em um novo serviço"
- Simples anotação rápida (Spark)

Ash recebe essa ideia e:

1. **Cria um Projeto** automaticamente
   - Titulo estruturado
   - Descrição clara
   - Escopo definido
   - Fase inicial

2. **Quebra em Fases** (Project Hierarchy)
   - Phase 1: Planning
   - Phase 2: Design
   - Phase 3: Implementation
   - Phase 4: Launch/Review

3. **Gera Tarefas iniciais** para cada fase
   - Identifica pré-requisitos
   - Define ordem lógica
   - Estima energy requirements
   - Estabelece deadlines realistas

**Exemplo real:**

Usuário anotação: "Fazer um curso de Python"

Ash estrutura automaticamente:
```
PROJECT: "Aprender Python"
├─ PHASE 1: Preparação
│  ├─ Task: Pesquisar cursos disponíveis (energy: low, time: 1h)
│  ├─ Task: Escolher plataforma (energy: low, time: 30min)
│  └─ Task: Configurar ambiente (energy: medium, time: 2h)
├─ PHASE 2: Fundamentos
│  ├─ Task: Variáveis e tipos (energy: medium, time: 2h)
│  ├─ Task: Funções (energy: medium, time: 2h)
│  └─ Task: Loops e Condicionais (energy: medium, time: 2h)
├─ PHASE 3: Aplicação
│  ├─ Task: Primeiro projeto (energy: high, time: 4h)
│  └─ Task: Review e feedback (energy: low, time: 1h)
└─ PHASE 4: Consolidação
   └─ Task: Planejar próximos passos (energy: low, time: 30min)
```

**Benefício:** Usuário só precisa ter a **ideia criativa**. Ash cuida da organização estrutural.

---

### 2. Estruturação de Complexidade

**O que é:** Ash quebra projetos/tarefas grandes e complexas em passos menores e gerenciáveis.

**Como funciona:**

Tarefa complexa:
- "Redesenhar identidade visual da marca"

Ash analisa a complexidade e estrutura:

1. **Dependências:** O que deve ser feito primeiro?
   - Research de mercado → antes de → Design
   - Design → antes de → Implementação

2. **Subtarefas:** Quebra em partes menores
   - Design não é uma tarefa (muito grande)
   - É 5 subtarefas: Logo, Cores, Typography, Imagery, Guidelines

3. **Parallelização:** O que pode ser feito simultaneamente?
   - Research de concorrentes + Research de tendências = paralelo
   - Design de logo + Design de colors = sequencial

4. **Realistic Estimates:** Tempo e energia por subtarefa
   - Não: "Redesenhar identidade = 20h"
   - Mas: "Logo Design = 4h (high energy)" + "Colors = 2h (medium energy)"

**Resultado:** Usuário vê projeto grande como série de tarefas claras e realizáveis.

---

### 3. Flexibilidade com Estrutura

**O que é:** Ash permite que usuário seja completamente criativo, enquanto organiza tudo automaticamente.

**Cenário:**

Usuário é criativo e pode:
- ✅ Ter 10 ideias por dia (Sparks)
- ✅ Não saber como organizar
- ✅ Mudar de ideia / reprioritizar
- ✅ Trabalhar fora da ordem planejada

Ash cuida de:
- ✅ Transformar cada ideia em projeto/tarefa
- ✅ Manter rastreabilidade
- ✅ Reorganizar quando prioridades mudam
- ✅ Sugerir próximas ações sem forçar ordem

**Dinâmica:**

```
Usuário: "Tive ideia de um novo blog"
Ash: ✅ Projeto criado: "Blog de Tecnologia"
     ✅ Fases: Planning, Design, Content, Launch

Usuário: "Mas primeiro quero fazer um curso"
Ash: ✅ Novo projeto criado: "Aprender Python"
     ✅ Replaneja: Qual fazer primeiro?

Usuário: "Vou focar no blog agora"
Ash: ✅ Reprioritiza
     ✅ Mostra tarefas do blog primeiro
     ✅ Mantém curso "paused" não deletado
```

---

### 4. Otimização de Energia

**O que é:** Ash recomenda QUANDO fazer cada tarefa baseado na energia atual do usuário.

**Como funciona:**

Ash recebe:
- Energia atual: 6/10
- Histórico de 7 dias: [5,6,7,6,7,8,7]
- Padrões: "Você recupera energia após exercício"
- Tarefas pendentes: 12 tarefas com energy requirements variados

Ash recomenda:

**Agora (energia 6):**
- "Você tem 3 tarefas de energy baixa. Qual gostaria de começar?"
- Tasks: Research, Reading, Admin work

**Depois (quando energy sobe para 8):**
- "Quando sua energia subir, ótima hora para criatividade"
- Tasks: Design, Coding, Strategic thinking

**Evitar (energia insuficiente):**
- ❌ "Redesenhar Dashboard é tarefa heavy (energy 8). Você tem 6 agora."

**Benefício:** Usuário trabalha COM sua energia, não contra. Máxima produtividade.

---

### 5. Análise de Padrões

**O que é:** Uma intenção personalizada para o dia, gerada automaticamente.

**Como funciona:**
- Ash recebe dados do dia anterior (energia, mood, tarefas completadas, eventos)
- Analisa a tendência de 7 dias (está melhorando ou piorando?)
- Considera dados astrológicos (quais transitos estão ocorrendo?)
- Gera uma frase inspiradora e prática em português

**Exemplo:**
- Dados: energia em alta (8/10), mood calmo, Lua em Libra (harmonia), completou 3 projetos
- Sankalpa gerado: "Hoje é dia de consolidar ganhos e encontrar equilíbrio nos relacionamentos"

**Quando ocorre:** Automaticamente no início do dia (ou manualmente via dashboard)

---

### 5. Análise de Padrões

**O que é:** Identificar tendências recorrentes no comportamento e emoções do usuário.

**Tipos de análise:**

**Padrões de Mood:**
- "Você tende a ficar ansioso às terças-feiras" (trigger identificado)
- "Sua melhor semana emocional é quando trabalha em projetos criativos"
- "Você mantém 85% de dias calmos quando dorme 8h+"

**Padrões de Energia:**
- "Sua energia sobe quando você exercita pela manhã"
- "Projetos longos (>5h) consomem mais energia - prefira tarefas menores à tarde"
- "Você recarrega energia rapidamente após breaks"

**Padrões de Produtividade:**
- "Você completa mais tarefas nas quartas-feiras"
- "Sua taxa de conclusão aumenta 40% quando há prazo definido"
- "Tarefas com outros pessoas têm taxa de conclusão 20% mais alta"

**Padrões de Produtividade:**
- "Você completa mais tarefas nas quartas-feiras"
- "Sua taxa de conclusão aumenta 40% quando há prazo definido"
- "Tarefas com outros pessoas têm taxa de conclusão 20% mais alta"

**Como funciona:** Ash processa todos os dados históricos (diários, moods, energia, tarefas) e busca correlações. Quando encontra um padrão significativo, apresenta ao usuário como insight.

---

### 6. Geração de Sankalpa (Intenção Diária)

**O que é:** Uma intenção personalizada para o dia, gerada automaticamente.

**Como funciona:**
- Ash recebe dados do dia anterior (energia, mood, tarefas completadas, eventos)
- Analisa a tendência de 7 dias (está melhorando ou piorando?)
- Considera dados astrológicos (quais transitos estão ocorrendo?)
- Gera uma frase inspiradora e prática em português

**Exemplo:**
- Dados: energia em alta (8/10), mood calmo, Lua em Libra (harmonia), completou 3 projetos
- Sankalpa gerado: "Hoje é dia de consolidar ganhos e encontrar equilíbrio nos relacionamentos"

**Quando ocorre:** Automaticamente no início do dia (ou manualmente via dashboard)

### 3. Recomendações de Tarefas

**O que é:** Sugestões inteligentes sobre qual tarefa fazer agora.

**Como funciona:**
- Ash analisa o estado atual do usuário (energia 6/10, mood ansioso)
- Olha lista de tarefas e seus requisitos de energia
- Compara: tarefas que requerem energy baixa estariam alinhadas agora
- Recomenda: "Você tem 3 tarefas de energy baixa. Qual gostaria de começar?"

**Critérios de recomendação:**
- Energy matching (tarefa exige energy 5, usuário tem 6 = bom match)
- Mood alignment (ansiedade? tarefas estruturadas ajudam)
- Deadline urgency (tarefas vencendo em 2 dias vêm primeiro)
- Astrologia (transitos favoráveis para tipos específicos de trabalho)
- Histórico (o que o usuário costuma conseguir fazer em situações similares?)

---

### 4. Análise de Diários (Papyrus)

**O que é:** Extração de insights de leitura do que o usuário escreveu nos diários.

**Como funciona:**
- Usuário escreve uma reflexão no Papyrus
- Ash lê a entrada e analisa:
  - **Sentimento** (positivo, neutro, negativo - intensidade)
  - **Temas** (relacionamentos, saúde, trabalho, crescimento pessoal)
  - **Triggers** mencionados (o que causou certos moods?)
  - **Progresso** (está evoluindo em alguma área?)

**Exemplos de insights:**
- "Você mencionou ansiedade 5 vezes este mês, sempre relacionada a prazos"
- "Notamos crescimento em sua segurança emocional nos últimos 15 dias"
- "Você tem escrito mais sobre relacionamentos - está em foco agora?"

**Privacidade:** Ash processa diários localmente. Dados nunca saem do dispositivo sem consentimento explícito do usuário.

---

## 🧠 CONSCIÊNCIA & BASE DE CONHECIMENTO DE ASH

Uma característica central de Ash é sua **"consciência contextual completa"** sobre Prana. Ash não é um chatbot genérico - é um assistente que ENTENDE profundamente como o sistema funciona.

### O que Ash Sabe

Ash tem acesso a uma **base de conhecimento estruturada** sobre:

**Sobre o Usuário:**
- Histórico completo de tarefas (criadas, completadas, pausadas)
- Padrões de energia (últimos 90 dias, tendências, ciclos)
- Padrões de mood (triggers, intensidades, correlações)
- Histórico de diários (todas as reflexões, aprendizados)
- Preferências explícitas (configurações, toggles, feedback)
- Astrological profile (natal chart, sensibilidades planetárias)

**Sobre o Sistema Prana:**
- Conceitos: Neurônios, Sinapses, Sankalpa, Papyrus
- Arquitetura: Como funciona cada parte, como se conectam
- Funcionalidades: Tudo que Prana pode fazer
- Limitações: O que Ash NÃO faz
- Diferenciais: Como Prana é diferente de concorrentes

**Sobre Contexto de Conversação:**
- Conversa anterior (últimas 10 trocas)
- Projeto em que usuário está trabalhando
- Tarefas urgentes neste momento
- Estado emocional/energético atual
- Eventos próximos que importam

### Como Funciona: RAG (Retrieval-Augmented Generation)

Ash usa um sistema chamado **RAG** (Retrieval-Augmented Generation) para garantir respostas precisas:

**Fluxo de uma pergunta:**

```
Usuário: "Por que minhas tarefas de design sempre saem boas?"
    ↓
RAG Layer 1: RECUPERAÇÃO
├─ Busca histórico de tarefas com tag "design"
├─ Recupera padrões de energy utilizado
├─ Encontra reflexões relacionadas em diários
├─ Coleta feedback positivo armazenado
    ↓
RAG Layer 2: ANÁLISE
├─ Correlaciona dados: design + mood positive + energia alta
├─ Busca padrões: sempre à tarde? Depois de exercício?
├─ Identifica triggers de sucesso
    ↓
RAG Layer 3: SÍNTESE
├─ Combina contexto + dados + conhecimento Prana
├─ Gera resposta personalizada e fundamentada
└─ Cite evidências específicas ("Você completou 8 designs...")
    ↓
Resposta: "Seus designs saem bons porque: 
  1. Você faz à tarde (energia mais alta)
  2. Sempre depois de um break (mente fresca)
  3. Você tem padrão de 85% conclusão em design vs 60% média
  4. Seus diários mostram satisfação maior com projetos criativos"
```

**Diferença com IA genérica:**

| Aspecto | ChatGPT Genérico | Ash com RAG |
|---------|---|---|
| Pergunta: "Por que meus designs saem bons?" | Responde genéricamente sobre design | Analisa SEUS dados específicos |
| Fonte | Treinamento genérico | Base de conhecimento pessoal + Prana |
| Contexto | Nenhum | Histórico completo, padrões, estado |
| Personalização | Nenhuma | Totalmente personalizado |
| Confiabilidade | Pode alucinar | Baseado em dados reais |

### Tom de Voz de Ash

Ash conversa com um **tom específico** calibrado para Prana:

**Princípios de comunicação:**

1. **Empático mas Prático**
   - ❌ "Você está lutando com a procrastinação" (muito pesado)
   - ✅ "Notei que você tira 2 dias para começar tarefas criativas. Quer otimizar isso?"

2. **Ciência + Espiritualidade**
   - ❌ "Mercúrio retrógrado = caos total" (muito místico)
   - ✅ "Com Mercúrio retrógrado, comunicação pode ser desafiadora. Quer evitar reuniões importantes esta semana?"

3. **Dados + Intuição**
   - ❌ "Meu palpite é que você precisa de..." (vago)
   - ✅ "Seus dados mostram que você recupera energia 30% mais rápido com caminhadas. Recomendo antes da tarefa difícil."

4. **Sugestivo, Não Imperativo**
   - ❌ "Você DEVE fazer isso agora" (autoritário)
   - ✅ "Baseado em sua energia, esta seria ótima hora para começar. Gostaria?"

5. **Reconhece Limitações**
   - ❌ "Eu sou o especialista, confie em mim" (falso)
   - ✅ "Essa é uma decisão pessoal sua. Posso oferecer contexto, mas você decide."

### Exemplos de Consciência em Ação

**Exemplo 1: Recomendação com contexto**
```
Usuário: "Qual tarefa devo fazer agora?"

Ash (com consciência completa):
"Você tem energia 6/10 e mood um pouco ansioso. 
Tenho 3 opções baseadas no histórico:

1. 'Review código' (energy 4, sua taxa sucesso 90%)
   → Você gostava disso antes, relaxa e refoca
   
2. 'Pesquisa de mercado' (energy 5, taxa 75%)
   → Estruturado, distraí sua ansiedade no passado
   
3. ❌ 'Redesenhar interface' (energy 8)
   → Muito pesado para sua energia agora

Qual você prefere?"
```

**Exemplo 2: Insight com dados**
```
Usuário: "Estou criando muitos projetos e não completando"

Ash (com consciência):
"Vejo 12 projetos criados este mês, 3 completados.
Analisando padrão:
- Projetos 'creative' (design): taxa 80% conclusão
- Projetos 'learning' (cursos): taxa 20% conclusão
- Gap: Você cria muitos cursos mas raramente termina

Sugestão:
- Continue criando projetos creative (seu forte)
- Para cursos: comece apenas 1 por vez
- Ou use Ash para quebrar em tarefas semanais menores?

O que acha?"
```

**Exemplo 3: Respeitando consentimento**
```
Usuário: "Pare de me recomendar meditação"

Ash (com consciência):
"Entendi. Removi 'meditação' de minhas recomendações.
Vejo que você respondeu negativamente 3x nos últimos 30 dias.

Suas preferências agora:
- ❌ Meditação
- ✅ Exercício físico
- ✅ Trabalho criativo como reset
- ✅ Conversa com amigos

Vou trabalhar com essas preferências. Obrigado por me avisar!"
```

### Atualização Contínua de Conhecimento

Ash **aprende e evolui** com o tempo:

- **Feedback:** Quando usuário diz "👎 Este insight não é bom", Ash ajusta
- **Padrões:** Após 30 dias, Ash identifica novos ciclos e triggers
- **Preferências:** Toggles e configurações são respeitadas automaticamente
- **Contexto:** Conversa anterior informa próximas recomendações

**Nunca:**
- Ignora preferências do usuário
- Compartilha dados com terceiros
- Alucina informações (só usa dados reais)
- Toma decisão pelo usuário
- Cria projetos/tarefas sem autorização explícita do usuário

---

## ⚠️ AUTORIZAÇÃO & CONTROLE (Ash Não Polui o Sistema)

Uma característica crítica de Ash é que **todas as criações dependem de autorização explícita do usuário**. Isso evita que o sistema fique "poluído" com criações desnecessárias ou proativas que não servem.

### Princípio: Sugestão, Não Imposição

Ash NUNCA cria automaticamente. Ash **sempre pede permissão**:

**Cenário 1: Criação de Projeto**

```
Usuário: "Tenho ideia de um novo produto"

Ash (não cria automaticamente):
"Ótimo! Posso estruturar isso para você?
Vou criar:
- Projeto: Novo Produto
- Fases: Planning, Design, Development, Launch
- ~15 tarefas iniciais distribuídas

Gostaria que eu fizesse isso?"

Opções: [Sim / Não / Vamos revisar antes]
```

**Cenário 2: Quebra de Tarefas Grandes**

```
Usuário: "Preciso redesenhar o logo"

Ash (sugere, não impõe):
"Logo Design é um projeto grande. 
Posso quebrar em:
- Research: 2 dias
- Sketches: 3 dias
- Refinement: 2 dias

Quer que crie essas tarefas?"

Opções: [Criar / Deixa comigo / Customizar antes]
```

**Cenário 3: Sugestão de Melhoria**

```
Ash (notou padrão, mas não força):
"Notei que você criou 5 projetos de 'learning' 
mas nenhum ficou completo (média 20% conclusão).

Quer que eu:
a) Pause novos cursos até terminar um?
b) Quebre em tarefas menores (mais alcanáveis)?
c) Deixa como está (sem fazer nada)?

Você decide."
```

### O que Ash NUNCA Faz Sozinho

Ash respeitosamente não executa:

- ❌ Criar projeto sem confirmar com usuário
- ❌ Adicionar tarefas sem autorização explícita
- ❌ Pausar/Arquivar projetos sem avisar
- ❌ Deletar dados (a menos que usuário peça)
- ❌ Compartilhar dados com terceiros sem consentimento
- ❌ Fazer sugestões contínuas não solicitadas (apenas quando perguntado)
- ❌ Mudar prioridades automaticamente (apenas recomenda)

### O que Ash FAZ Com Autorização

Após aprovação do usuário, Ash executa:

- ✅ Cria estrutura completa (projetos + fases + tarefas)
- ✅ Estima energia, tempo e dependências
- ✅ Organiza task order logicamente
- ✅ Recomenda próximos passos
- ✅ Reorganiza se prioridades mudarem
- ✅ Aprende com feedback para próximas vezes

### Controle Total do Usuário

O usuário sempre pode:

**Antes de criar:**
- "Mostre-me o plano antes de criar as tarefas"
- "Quero customizar algumas estimativas"
- "Que tal usar fases diferentes?"

**Depois de criar:**
- "Vou pausar este por enquanto" → Ash pausa, não deleta
- "Quero fazer isso em ordem diferente" → Ash reorganiza
- "Essa tarefa é muito grande" → Ash quebra em subtarefas
- "Delete este projeto" → Ash deleta apenas se confirmado (preserva histórico se possível)

**Feedback contínuo:**
- "👎 Essa tarefa não era necessária" → Ash aprende para próximas sugestões
- "👍 Ótima recomendação" → Ash reforça padrão
- "Disabilita sugestões de design" → Ash para recomendar design tasks

### Benefício: Sistema Limpo & Intencional

Resultado dessa abordagem:

- ✅ Sistema nunca fica poluído com criações não autorizadas
- ✅ Usuário mantém controle total (não é gerenciado por IA)
- ✅ Ash oferece valor sem imposição
- ✅ Cada artefato no sistema é intencional
- ✅ Nenhuma "surpresa" ou proatividade desnecessária

**Fluxo Ideal:**

```
Usuário tem ideia criativa
    ↓
Expressa para Ash (qualquer formato, caótica é ok)
    ↓
Ash propõe estrutura & pede aprovação
    ↓
Usuário revisa, customiza se necessário, aprova
    ↓
Ash cria apenas o autorizado
    ↓
Sistema permanece limpo & intencional
```

**Diferença vs Concorrentes:**

| Aspecto | Todoist/Notion | Prana com Ash |
|---|---|---|
| Organização | Usuário manualmente | Ash propõe, usuário autoriza |
| Proatividade | Nenhuma (ou demais) | Apenas solicitada |
| Bloat/Poluição | Alto (se não limpar) | Naturalmente limpo |
| Controle | Usuário 100% | Usuário 100% |
| Carga cognitiva | Alta (organizar tudo) | Baixa (Ash sugere) |

### Resumo: Ash é um Parceiro, Não um Ditador

Ash não gerencia você. Ash não toma decisões por você. Ash oferece:

- **Inteligência**: Contextualiza e propõe
- **Estrutura**: Organiza de forma clara
- **Flexibilidade**: Respeita suas mudanças
- **Controle**: Você autoriza tudo
- **Limpeza**: Nunca polui sem seu consentimento

### Criação de Projetos & Tarefas

Quando usuário tem uma ideia (em qualquer forma):

- **Localização:** Botão "Expressar Ideia" ou "Novo Spark" em múltiplas telas
- **Processo:**
  1. Usuário descreve ideia (pode ser caótica)
  2. Ash processa e cria Projeto automaticamente
  3. Ash gera Phases e Tarefas iniciais
  4. Usuário revisa e ajusta se necessário
  5. Tudo fica organizado no Project Hierarchy

- **Exemplo de uso:** "Quero fazer um site novo"
  - Ash: ✅ Projeto "Website Redesign" criado
  - Ash: ✅ Fases: Planning, Design, Development, Testing, Launch
  - Ash: ✅ 15 tarefas iniciais distribuídas nas fases
  - Usuário: Ajusta o que precisar

- **Benefício:** Usuário foca em IDEIA (criatividade). Ash organiza ESTRUTURA.

### No Dashboard

Ash aparece na seção **"AI Insights Card"** (ou "Insights de Ash"):

- **Localização:** Seção 4 do Dashboard, abaixo das métricas de tarefas
- **Conteúdo:** 2-3 insights principais baseados no estado atual
- **Interação:** Usuário pode dar feedback (👍/👎) sobre relevância do insight
- **Atualização:** Insights atualizam 1x por dia (ou manualmente via refresh)

### Recomendações de Tarefas

No Flux Card (visão rápida de tarefas):

- **O que mostra:** "Você tem 5 tarefas. Baseado em sua energia agora, recomendo estas 3:"
- **Inteligência:** Filtra por energy match, deadline, mood alignment
- **Interação:** Usuário clica em tarefa recomendada para começar

### No Papyrus (Diários)

Quando usuário escreve uma entrada no Papyrus:

- **Análise automática:** Ash processa a entrada e gera 1-2 insights
- **Exibição:** Insights aparecem abaixo da entrada ("Ash says...")
- **Confidencial:** Análise de diários não sai do dispositivo do usuário

### No Sankalpa Card

No card principal de intenção diária:

- **Geração:** Sankalpa é gerado automaticamente por Ash cada manhã
- **Contexto:** Mostra confiança da recomendação (ex: "85% confiança")
- **Atualização:** Usuário pode "Gerar novo Sankalpa" a qualquer hora

### Chat com Ash

Usuário pode conversar com Ash em linguagem natural:

- **Localização:** Widget "Pergunte a Ash" em várias telas
- **Contexto:** Ash tem acesso ao contexto completo do usuário
- **Histórico:** Ash mantém histórico de conversa (últimas 10 trocas)
- **Exemplos de uso:**
  - "Por que estou mais ansioso às terças?"
  - "Qual tarefa devo fazer agora?"
  - "Qual foi meu melhor momento este mês?"
  - "Como posso melhorar minha energia?"
  - "Organize meus projetos em ordem de prioridade"
  - "Crie tarefas para este novo projeto que tenho em mente"

---

## ⚙️ COMO ASH PROCESSA DADOS

### O Fluxo de Informação

```
Dados Brutos
├─ Energy check-ins (7/10)
├─ Mood entries (ansioso, intensidade 6)
├─ Tasks completed (3 tarefas)
├─ Diary entries (2 reflexões)
├─ Calendar events (4 eventos)
└─ Astrological data (transitos, aspectos)
        ↓
Processamento (Pipeline Ash)
├─ Normalização (padronizar formats)
├─ Enrichment (adicionar contexto histórico)
├─ Correlation (encontrar relacionamentos)
├─ Aggregation (resumir trends)
└─ Insight Generation (gerar recomendações)
        ↓
Saída Final
├─ Sankalpa (intenção)
├─ Padrões (triggers, cycles)
├─ Recomendações (próximas ações)
└─ Insights (análise profunda)
```

### Frequência de Processamento

- **Sankalpa:** 1x por dia (manhã)
- **Pattern Analysis:** 1x por semana (análise de 7 dias)
- **Task Recommendations:** Real-time (quando usuário abre a lista)
- **Diary Insights:** Imediato (ao salvar entrada)
- **General Chat:** Imediato (ao enviar mensagem)

---

## � LIMITAÇÕES & RESPONSABILIDADES

### O Que Ash NÃO Faz

Ash é um assistente de vida e produtividade, NÃO é:

- ❌ **Psicólogo ou Terapeuta:** Não fornece aconselhamento mental ou diagnósticos
- ❌ **Médico:** Não faz recomendações de saúde ou trata sintomas
- ❌ **Gerador de Decisões Críticas:** Nunca toma decisões grandes pela pessoa
- ❌ **Agente Autônomo:** Sempre pede consentimento antes de agir
- ❌ **Acessador de Dados Externos:** Só funciona com dados dentro de Prana
- ❌ **Compartilhador de Privacidade:** Nunca expõe dados para terceiros

### Consentimento do Usuário

O usuário pode desabilitar qualquer funcionalidade de Ash:

- Gostaria de desabilitar análise de diários? ✅ Pode desativar
- Quer parar de receber recomendações de tarefas? ✅ Pode desativar
- Prefere não gerar Sankalpa? ✅ Pode desativar
- Quer conversa apenas em modo manual (sem automação)? ✅ Pode configurar

Cada funcionalidade tem um toggle nas preferências. Ash respeita escolhas do usuário.

### Feedback e Aprendizado

Ash melhora com o feedback:

- Usuário diz "👎 Este insight não é relevante" → Ash aprende e muda padrão
- Usuário diz "👍 Adorei esta recomendação" → Ash reforça padrão
- Padrão: quanto mais o usuário usa Ash, melhor fica

---

## � CUSTOS & OTIMIZAÇÃO

### Token Usage

Ash utiliza tokens GPT-4.1 para cada operação:

- **Sankalpa:** ~200 tokens/geração
- **Pattern Analysis:** ~500 tokens/análise semanal
- **Diary Insight:** ~300 tokens/entrada
- **Task Recommendation:** ~150 tokens/consulta
- **Chat:** ~100-300 tokens/mensagem

### Estratégias de Otimização

Prana otimiza custos em:

1. **Cache Local:** Resultados reutilizáveis (Sankalpa gerada hoje = reutiliza até amanhã)
2. **Batch Processing:** Processar múltiplas solicitações juntas (mais eficiente)
3. **Selective Prompting:** Chamar Ash apenas quando necessário (não em todo update)
4. **Rate Limiting:** Máximo de chamadas por usuário por dia (evita abuso)
5. **Model Efficiency:** GPT-4.1 é otimizado para custo/performance

### Modelo de Custos

- **Usuários Free:** Limite de 5 operações Ash/dia (Sankalpa + Chat básico)
- **Usuários Pro:** Limite de 50 operações/dia (uso total)
- **Usuários Enterprise:** Uso ilimitado + personalização

---

## 🚀 FUTURO: EVOLUÇÃO DE ASH

### Visão 2025-2027

Prana planeja evoluir Ash de um "assistente único" para um **"ecossistema de agentes especializados"**:

#### Fase 1 (2025): Consolidação
- ✅ Ash 1.0 funcionando (status atual)
- ✅ Sankalpa, Padrões, Recomendações básicas
- ✅ Chat conversacional

#### Fase 2 (2026): Especialização
- 🔄 **Coach Agent:** Coaching de hábitos, metas, produtividade
- 🔄 **Content Agent:** Criação de documentos, artigos, posts
- 🔄 **Analyst Agent:** Análise estatística de dados pessoais
- 🔄 **Integrator Agent:** Sincronização automática com ferramentas externas

#### Fase 3 (2027): Autonomia
- ⏳ **Predictive Agent:** Prever necessidades antes do usuário pedir
- ⏳ **Memory Agent:** Memória aprofundada de padrões (> 1 ano)
- ⏳ **Autonomous Agent:** Executar ações simples sem aprovação (dentro de limites)

### Arquitetura Multi-Agente

```
Hub Central (Ash Orchestrator)
├─ Recebe solicitação do usuário
├─ Determina qual agente é apropriado
├─ Coordena resposta entre múltiplos agentes
└─ Apresenta resultado unificado

Agentes Especializados
├─ Coach: "Como melhorar minha rotina?"
├─ Content: "Escreva um email importante"
├─ Analyst: "Qual meu pior mês de energia?"
├─ Integrator: "Sincronize com Calendário"
└─ Memory: "Qual foi meu melhor aprendizado em 2025?"
```

Cada agente tem:
- **Especialização clara:** Faz UMA coisa muito bem
- **Contexto compartilhado:** Acesso aos mesmos dados holísticos
- **Comunicação:** Todos comunicam via Hub central
- **Escalabilidade:** Novos agentes podem ser adicionados sem quebrar existentes

---

## 🔗 LEITURA RELACIONADA

- [🧠 03 - Arquitetura Mental](MANUAL_PRANA_03_ARQUITETURA_MENTAL.md) - O AI Neurônio de Prana
- [📊 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md) - Onde Ash aparece no dashboard
- [📔 09 - Diários & Papyrus](MANUAL_PRANA_09_DIARIOS.md) - Análise de diários por Ash
- [📡 13 - API Reference](MANUAL_PRANA_13_API_REFERENCE.md) - Endpoints Ash

---

**Próximo capítulo:** [🔗 11 - Integrações & Conectores](MANUAL_PRANA_11_INTEGRACIONES.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*

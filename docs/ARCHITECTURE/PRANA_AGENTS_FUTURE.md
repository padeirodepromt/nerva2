# Prana Future Architecture: The Agent Ecosystem (V10+)

> "O Prana é o escritório digital. Os Agentes são a força de trabalho especializada."

Esta arquitetura define como transformaremos funcionalidades isoladas em **Entidades Autônomas** que podem ser acopladas ao sistema.

## 1. Estrutura Padrão de um Agente (The Agent Bundle)
Cada agente deve ser um módulo independente contendo:
1.  **Cérebro:** Prompt de Sistema e Base de Conhecimento (RAG).
2.  **Mãos:** Ferramentas/APIs (ex: Postar no Instagram, Compilar Código).
3.  **Rosto:** Interfaces React específicas que substituem as views padrão do Prana.

---

## 2. O Roadmap de Agentes (O "Dream Team")

### 🟢 Fase 1: Agentes de Produtividade (Extensão do Ash)
*Estes agentes são "tímidos", vivem dentro do chat principal do Ash.*

#### **1. Agente Secretário (Ash Core)**
* **Função:** Organizar agenda, responder emails, criar tarefas rápidas.
* **Ferramentas:** Google Calendar API, Gmail API (Leitura), NLP de extração de dados.
* **Interface:** Chat Padrão + Bubbles de Confirmação.

#### **2. Agente Monja (Sourdough & Lifestyle)**
* **Função:** Cálculos de hidratação, timers de fermentação, filosofia zen.
* **Ferramentas:** Calculadora de % de Padeiro, Timer Nativo.
* **Interface:** `RecipeView` (Template visual de receitas e passos).

---

### 🟡 Fase 2: Agentes Especialistas (Add-ons Pagos)
*Estes agentes trazem interfaces próprias e mudam a cara do Prana.*

#### **3. Agente Neo (Dev Fullstack)**
* **Função:** Gerenciar código, deploys e reviews.
* **Ferramentas:** GitHub API, Vercel/Render API.
* **Interface:** `TaskCodeWorkspace` (Já existente). Transforma a tarefa numa IDE mini.

#### **4. Agente Maya (Content Creator)**
* **Função:** Criar roteiros, carrosséis e agendar posts.
* **Ferramentas:** Templates de Copywriting (AIDA, PAS), Integração Instagram/YouTube (via Olly).
* **Interface:** `ScriptEditor`, `CarouselBoard` (Substitui o editor de texto comum).

---

### 🔴 Fase 3: Agentes de Negócio (Enterprise)
*Agentes que geram dinheiro ou gerem o negócio.*

#### **5. Agente Olly (Ads & Growth Manager)**
* **Função:** Criar campanhas, otimizar budget, analisar métricas.
* **Ferramentas:** Facebook Ads API, Google Analytics.
* **Interface:** `AdsDashboard` (Gráficos de ROAS, CPA).

#### **6. Agente CFO (Diretor Financeiro)**
* **Função:** Controlar fluxo de caixa, emitir notas, cobrar clientes.
* **Ferramentas:** Stripe/Asaas API, Leitura de OFX.
* **Interface:** `FinanceSheet` (Planilha inteligente).

#### **7. Agente Designer (Web Gen)**
* **Função:** Gerar wireframes e sites completos.
* **Ferramentas:** Integração com Relume/Tailwind, geração de componentes React.
* **Interface:** `CanvasBuilder` (Arrastar e soltar visual).

---

## 3. Modelo de Integração (Lego System)

O Prana Core usará um `AgentRegistry` para decidir o que mostrar:

```javascript
// Exemplo Conceitual
const userAgents = user.subscription.activeAgents; // ['neo', 'monja']

if (task.type === 'code' && userAgents.includes('neo')) {
    return <NeoWorkspace task={task} />;
} else if (task.type === 'recipe' && userAgents.includes('monja')) {
    return <SourdoughCalculator task={task} />;
} else {
    return <StandardTaskView task={task} />;
}
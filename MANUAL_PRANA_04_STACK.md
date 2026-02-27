# ⚙️ CAPÍTULO 4: STACK TECNOLÓGICO

**Versão:** 1.0 | **Data:** Dezembro 2025

---

## 🎯 VISÃO GERAL DO STACK

Prana é construído em uma arquitetura **moderna, escalável e performática**:

```
FRONTEND                 BACKEND                DATABASE
React 18+           Express.js 4+          PostgreSQL
Vite                Node.js 18+            (Supabase)
Zustand             REST API               
Tailwind CSS        JWT Auth               INTEGRATIONS
Radix UI            Drizzle ORM            Claude AI
Framer Motion       LibSQL                 Google Gemini
ReactFlow           OpenAI API             Meta Ads API
TipTap              Real-time sync         Stripe
Lucide Icons                               etc...
```

---

## 🎨 FRONTEND STACK

### Core Framework
- **React 18.x**: Biblioteca UI moderna, component-based
- **Vite 5.x**: Build tool ultra-rápido (12s build time)
- **TypeScript**: Type safety (opcional mas recomendado)

### State Management
- **Zustand**: Store leve e intuitivo
  - Stores principais: `useChatStore`, `useTaskStore`, `useWorkspaceStore`, `useTimeStore`, `useAgentStore`
  - Pattern: Ações imperativas + estado reativo
  - Sync com localStorage para persistência

### Styling & Design
- **Tailwind CSS 3.x**: Utility-first CSS framework
- **Radix UI**: Componentes acessíveis sem opinião estética
- **Lucide React**: 400+ ícones SVG customizáveis
- **Framer Motion**: Animações suaves e performáticas

### Componentes & UI

#### Tabelas e Listas
- **TanStack Table (React Table)**: Tabelas complexas, sorting, filtering
- **@hello-pangea/dnd**: Drag-and-drop avançado

#### Editores
- **TipTap + ProseMirror**: Editor de rich text completo
  - Suporte a markdown, código, highlights
  - Extensível com plugins customizados

#### Visualizações
- **ReactFlow**: Diagramas, mindmaps, flowcharts
- **Recharts**: Gráficos e charts interativos

#### Formas
- **React Hook Form**: Gestão de formulários eficiente
- **Zod**: Validação de schemas TypeScript-first

### Mobile
- **Capacitor**: Wraper nativo para iOS/Android
  - Camera, Geolocation, LocalNotifications, SplashScreen
  - Plugins: App, Device, Keyboard, StatusBar

### Utilitários
- **date-fns**: Manipulação de datas (leve vs. moment.js)
- **axios**: HTTP client robusto
- **sonner**: Toast notifications elegantes
- **cmdk**: Command palette (Cmd+K)

### Estrutura de Pastas

```
src/
├── components/           # Componentes React
│   ├── chat/            # Chat e AgentSelector
│   ├── dashboard/       # Dashboard Views
│   ├── cards/           # Card components
│   ├── forms/           # Formulários
│   ├── icons/           # Sistema de ícones
│   ├── layout/          # Layout estrutural
│   ├── ui/              # Componentes Radix/primitivos
│   └── ...
├── stores/              # Zustand stores
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── views/               # View components
├── utils/               # Utilitários
├── services/            # Serviços (API calls)
├── ai_services/         # Integração com LLMs
└── styles/              # Estilos globais
```

---

## 🔙 BACKEND STACK

### Runtime & Framework
- **Node.js 18.x+**: Runtime JavaScript server-side
- **Express.js 4.x**: Framework web minimalista e robusto
- **Nodemon**: Hot reload durante desenvolvimento

### Banco de Dados & ORM
- **PostgreSQL**: Database relacional poderoso
  - Hosting: Supabase (PostgreSQL gerenciado)
  - Conexão via pooler (6543 porta)
  
- **Drizzle ORM**: Type-safe query builder
  - Migrations automáticas (`drizzle-kit`)
  - Type inference direto do schema
  - Leve e performático

- **LibSQL**: SQL query builder (suporte a triggers, CTEs)

### Autenticação & Segurança
- **JWT (JSON Web Tokens)**: Autenticação stateless
- **bcryptjs**: Hash de senhas (bcrypt)
- **CORS**: Cross-Origin Resource Sharing configurável
- **Middleware de Auth**: Proteção de rotas

### API & Integrações

#### APIs Externas
- **Claude AI (@anthropic-ai/sdk)**: LLM para Ash
- **Google Gemini (@google/generative-ai)**: LLM alternativo
- **OpenAI API**: ChatGPT para contextos específicos
- **Meta Ads API**: Integração com campanhas (Olly)
- **Stripe API**: Pagamentos e checkout

#### Agentes IA
- **@agentolly/prana-integration**: Pacote Olly para marketing
  - Hooks: `useOllyToggle`, `useOllyIntegration`
  - Components: `OllyToggle`, `OllyCampaignsWidget`, `OllyROIWidget`
  - API endpoints: `/api/campaigns`, `/api/chat`, `/api/campaigns/metrics`

### Validação & Parsing
- **Zod**: Schema validation
- **body-parser**: Parsing de JSON requests

### Utilitários
- **dotenv**: Variáveis de ambiente
- **cors**: CORS middleware
- **cuid2**: IDs único estocásticos
- **date-fns**: Datas server-side

### Estrutura de Pastas

O código está organizado em camadas:
- **API**: Rotas e endpoints
- **Services**: Lógica de negócio (incluindo tools que Ash executa)
- **Database**: Schema e conexões
- **Middleware**: Validações, autenticação
- **Utils**: Funções auxiliares

---

## 🗄️ DATABASE SCHEMA (Visão Geral)

O banco de dados armazena:

- **Users**: Perfil, email, autenticação
- **Projects**: Contextos de trabalho
- **Tasks/Artifacts**: Unidades de ação (com tipo, energia requerida, prioridade, status)
- **Diaries**: Anotações e reflexões (Papyrus)
- **Energy Check-ins**: Registros de energia com mood e contexto
- **Custom Fields**: Campos customizáveis por tipo de tarefa
- **Task Relations**: Dependências e relacionamentos entre tarefas
- **Views Settings**: Configurações de Kanban, Mindmap, etc

### Conceitos-chave no Schema:

- **Hierarquia**: Projetos contêm fases, fases contêm artefatos
- **Tipos de Artefatos**: Cada um com estrutura específica (Task, Event, Checklist, Document)
- **Energia**: Cada tarefa especifica quanto de energia requer
- **Status + Archive**: Tarefas não são deletadas, apenas arquivadas (is_archived = true)
- **Relacionamentos**: Tarefas podem ter dependências, referências cruzadas, parentesco

---

## 🔌 INTEGRAÇÕES EXTERNAS

### IA & LLMs
- **GPT-4.1 (OpenAI)**: Motor principal do Ash
- **Google Gemini**: Fallback e análises específicas

### Serviços
- **Stripe**: Processamento de pagamentos e subscrições
- **Supabase**: Banco de dados PostgreSQL gerenciado

---

## 🚀 PERFORMANCE & OTIMIZAÇÕES

### Frontend
- Code splitting automático (Vite)
- Lazy loading de componentes
- Memoization para renderizações
- Virtual scrolling para listas grandes

### Backend
- Connection pooling no banco
- Caching estratégico
- Índices otimizados
- Queries eficientes

---

## 🌐 DEPLOYMENT

### Frontend
- Build: gera arquivos otimizados
- Hosting: Vercel, Netlify, ou servidor próprio
- CDN: CloudFlare para assets

### Backend
- Runtime: Node.js 18+
- Process manager: PM2, Docker, ou systemd

### Database
- Supabase (managed PostgreSQL) ou auto-hospedado

---

## 🎓 FILOSOFIA TÉCNICA

### Princípios Guia

1. **Simplicidade**: Código legível > code golf
2. **Type-safety**: TypeScript para evitar erros
3. **Testabilidade**: Componentes isolados
4. **Performance**: Medir antes de otimizar
5. **Manutenibilidade**: Fácil entender e modificar

### Padrões de Design

- MVC para rotas backend
- Container/Presentational para componentes
- Custom hooks para lógica reutilizável
- Stores (Zustand) para estado global
- Services para integração com API

---

**Próximo capítulo:** [🗄️ 05 - Schema & Banco de Dados](MANUAL_PRANA_05_DATABASE.md)


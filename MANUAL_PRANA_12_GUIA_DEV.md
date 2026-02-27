# 👨‍💻 CAPÍTULO 12: GUIA DO DESENVOLVEDOR

**Versão:** 1.0 | **Data:** Dezembro 2025

---

## 🚀 SETUP INICIAL

### Pré-requisitos

- **Node.js 18+**: https://nodejs.org
- **Git**: https://git-scm.com
- **PostgreSQL 14+** (ou usar Supabase)
- **Editor**: VS Code recomendado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/padeirodepromt/prana3.0.git
cd prana3.0

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie dev server
npm run dev

# Em outro terminal, inicie backend
npm run dev
```

O app estará em: **http://localhost:5173**

### Configuração de Ambiente

Arquivo: `.env`

```dotenv
# Autenticação
JWT_SECRET=seu_secret_aqui_min_32_chars

# APIs
OPENAI_API_KEY=sk-proj-...
VITE_API_URL=http://localhost:3001
VITE_OLLY_API_URL=http://localhost:8000

# Database
DATABASE_URL=postgresql://...

# Variáveis Opcionais
VITE_META_PIXEL_ID=
VITE_FACEBOOK_APP_ID=
```

---

## 📁 ESTRUTURA DE ARQUIVOS

### Root Level

```
prana3.0/
├── src/                 # Código-fonte (client + server)
├── public/              # Assets estáticos
├── node_modules/        # Dependências
├── drizzle/             # Migrations do banco
├── .env                 # Variáveis de ambiente
├── vite.config.js       # Config do Vite
├── server.js            # Servidor Express
├── drizzle.config.js    # Config do Drizzle
├── package.json         # Dependências
├── eslint.config.js     # Linting rules
└── index.html           # Entry point HTML
```

### src/ - Estrutura de Código

```
src/
│
├── main.jsx             # Entry point React
├── App.jsx              # Root component
├── index.css            # Estilos globais
│
├── pages/               # Page components (rotas)
│   ├── PranaWorkspaceLayout.jsx
│   ├── LoginPage.jsx
│   └── ...
│
├── views/               # View components
│   ├── DashboardView.jsx
│   ├── TaskView.jsx
│   └── ...
│
├── components/          # Componentes reutilizáveis
│   ├── layout/
│   │   ├── MainLayout.jsx
│   │   └── Sidebar.jsx
│   ├── chat/            # Chat e IA
│   │   ├── SideChat.jsx
│   │   ├── AgentSelector.jsx
│   │   └── ...
│   ├── cards/           # Cards componentes
│   │   ├── TaskCard.jsx
│   │   └── ...
│   ├── forms/           # Formulários
│   ├── ui/              # Componentes Radix/primitivos
│   ├── icons/           # Sistema de ícones customizado
│   ├── dashboard/       # Dashboard específico
│   ├── tasks/           # Componentes de tarefas
│   ├── diaries/         # Componentes de diários
│   └── ...
│
├── stores/              # Zustand state management
│   ├── useChatStore.js
│   ├── useTaskStore.js
│   ├── useWorkspaceStore.js
│   ├── useTimeStore.js
│   ├── useAgentStore.js
│   └── index.js         # Exporta todos
│
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   ├── useNotifications.js
│   ├── useChatModes.js
│   └── ...
│
├── services/            # Serviços de API
│   ├── api.js           # Chamadas HTTP
│   ├── authService.js
│   ├── taskService.js
│   └── ...
│
├── ai_services/         # Integração com LLMs
│   ├── claudeService.js
│   ├── googleService.js
│   └── openaiService.js
│
├── utils/               # Utilitários puros
│   ├── energy.js        # Constantes de energia
│   ├── moods.js         # Estados emocionais
│   ├── fileProcessing.js
│   └── ...
│
├── styles/              # Estilos globais
│   └── globals.css
│
├── lib/                 # Bibliotecas customizadas
│   ├── cn.js            # classnames helper
│   └── ...
│
├── config/              # Configurações
│   ├── agentPersonas.js # Persona do Ash e Olly
│   └── ...
│
└── db/                  # Database
    ├── schema.js        # Drizzle schema
    ├── index.js         # Conexão DB
    └── migrations/      # Migrations automáticas
```

---

## 💻 FLUXO DE DESENVOLVIMENTO

### 1. Feature Branch Workflow

```bash
# Crie uma branch
git checkout -b feature/seu-feature

# Desenvolva
# Commit frequente
git add .
git commit -m "feat: descrição clara"

# Push
git push origin feature/seu-feature

# Crie PR no GitHub
# Review + merge
```

### 2. Convenções de Commit

Siga **Conventional Commits**:

```
feat:     Adiciona nova feature
fix:      Corrige bug
refactor: Refatora código (sem lógica nova)
style:    Formata código, `;`, etc
docs:     Adiciona documentação
test:     Adiciona testes
chore:    Atualizações de dependências
```

Exemplos:

```bash
git commit -m "feat: adiciona AgentSelector component"
git commit -m "fix: corrige bug em handleSend"
git commit -m "docs: atualiza README"
git commit -m "refactor: simplifica useTaskStore"
```

### 3. Padrão de Code Review

**O que revisor procura:**

- ✅ Código segue convenções
- ✅ Sem código comentado
- ✅ Testes inclusos
- ✅ Documentação atualizada
- ✅ Performance considerada
- ✅ Security review (inputs validados, etc)

---

## 🏗️ ARQUITETURA DE COMPONENTES

### Padrão: Container + Presentational

```javascript
// ✅ BOM: Container (lógica) + Presentational (UI)

// TaskListContainer.jsx
export default function TaskListContainer() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);
  
  return <TaskListView tasks={tasks} onUpdate={setTasks} />;
}

// TaskListView.jsx
export default function TaskListView({ tasks, onUpdate }) {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### Padrão: Custom Hooks

```javascript
// ✅ BOM: Lógica isolada em hook

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { tasks, loading, fetchTasks };
}

// Uso em componente
export default function TaskList() {
  const { tasks, loading, fetchTasks } = useTasks();
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  // render...
}
```

### Padrão: Props Validation

```javascript
// ✅ BOM: PropTypes ou TypeScript

import PropTypes from 'prop-types';

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['todo', 'in_progress', 'done']).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

// Ou com TypeScript:
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  // ...
}
```

---

## 🧪 TESTING

### Setup

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Padrão de Testes

```javascript
// TaskCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskCard from './TaskCard';

describe('TaskCard', () => {
  it('renders task title', () => {
    const task = { id: '1', title: 'Test Task', status: 'todo' };
    render(<TaskCard task={task} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
  
  it('calls onUpdate when clicked', () => {
    const task = { id: '1', title: 'Test', status: 'todo' };
    const onUpdate = vi.fn();
    
    render(<TaskCard task={task} onUpdate={onUpdate} />);
    screen.getByRole('button').click();
    
    expect(onUpdate).toHaveBeenCalled();
  });
});
```

### Rodar Testes

```bash
npm run test          # Rodar uma vez
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## 🔌 CRIANDO NOVAS FEATURES

### Checklist: Nova Feature

- [ ] Feature branch criada
- [ ] Componentes criados em `src/components/`
- [ ] Stores atualizadas se necessário (Zustand)
- [ ] Hooks criados se lógica reutilizável
- [ ] API integrada via `src/services/`
- [ ] Testes escritos
- [ ] Styles adicionados (Tailwind)
- [ ] Documentação comentada
- [ ] PR criado com description clara

### Exemplo: Feature "Tarefas por Energia"

```bash
# 1. Branch
git checkout -b feature/filter-tasks-by-energy

# 2. Criar componentes
# src/components/tasks/EnergyFilter.jsx
# src/components/tasks/TaskListFiltered.jsx

# 3. Criar store action
# src/stores/useTaskStore.js → addFilter()

# 4. Criar hook
# src/hooks/useTasksFiltered.js

# 5. Integrar na UI
# src/components/tasks/TaskView.jsx

# 6. Escrever testes
# src/components/tasks/TaskListFiltered.test.jsx

# 7. Commit
git add .
git commit -m "feat: add energy filter for tasks"

# 8. Push e PR
git push origin feature/filter-tasks-by-energy
```

---

## 🐛 DEBUGGING

### Browser DevTools

```javascript
// 1. Inspecionar estado Zustand
import { useTaskStore } from '@/stores/useTaskStore';

function DebugComponent() {
  const state = useTaskStore();
  console.log('Task Store State:', state);
  return null;
}
```

### React DevTools

```bash
npm install --save-dev @react-devtools/extensions
```

Inspecione componentes, props, state, hooks.

### Network Tab

Verifique requests/responses API:
- Status codes
- Payloads
- Timing

### Sentry (Error Tracking)

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.Replay()],
});

// Em componentes:
Sentry.captureException(error);
```

---

## 📦 DEPLOY

### Build para Produção

```bash
npm run build
# Cria /dist pronto para deploy
```

### Deploy em Vercel (Recomendado)

```bash
npm install -g vercel

vercel
# Segue as instruções interativas
```

### Deploy Manual em VPS

```bash
# Build
npm run build

# Copie /dist para servidor
scp -r dist/* user@server:/var/www/prana/

# Reinicie app (PM2 ou systemd)
pm2 restart prana
```

---

## 📚 PADRÕES E BOAS PRÁTICAS

### ✅ DO's

```javascript
// ✅ Use const para imutabilidade
const tasks = [...oldTasks, newTask];

// ✅ Use arrow functions
const handleClick = () => { };

// ✅ Desestruture props
const TaskCard = ({ task, onUpdate }) => { };

// ✅ Use async/await
async function loadTasks() {
  const tasks = await api.getTasks();
}

// ✅ Use optional chaining
const name = user?.profile?.name;

// ✅ Use nullish coalescing
const status = task.status ?? 'todo';
```

### ❌ DON'Ts

```javascript
// ❌ Avoid var
var oldVar = 'bad';

// ❌ Avoid function declarations at module level
function oldStyle() { }

// ❌ Avoid inline objects
<Component config={{ foo: 'bar' }} /> // renderiza toda vez

// ❌ Avoid console.log em produção
console.log('debug'); // remova antes de push

// ❌ Avoid mutation
tasks[0].title = 'new'; // muta array original

// ❌ Avoid deeply nested code
if (a) { if (b) { if (c) { } } } // use guards
```

---

## 🎓 RECURSOS

### Documentação
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)

### Comunidades
- Slack do Prana (interno)
- GitHub Discussions
- Discord para devs

### Videos úteis
- React Tutorial (Scrimba)
- Vite Setup Guide
- Zustand Beginner's Guide

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot find module '@/stores/useTaskStore'"

**Solução:**
```javascript
// Certifique que @/ está configurado em vite.config.js
import path from 'path';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

### Erro: "Window is not defined"

**Solução:**
```javascript
// Evite usar window no servidor
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### Banco de dados fora de sinc

**Solução:**
```bash
npm run db:generate  # Gera migration
npm run db:push      # Aplica migration
```

### Node modules quebrados

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Próximo capítulo:** [📡 13 - API Reference](MANUAL_PRANA_13_API_REFERENCE.md)


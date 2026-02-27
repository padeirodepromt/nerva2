# 🚀 CHECKLIST PRÉ-DEPLOY E GUIA DE IMPLEMENTAÇÃO

**Data:** Dezembro 19, 2025 | **Status:** ⚠️ 4 ITENS CRÍTICOS

---

## 🎯 4 ITENS CRÍTICOS IDENTIFICADOS

### 1️⃣ PROJETOS PESSOAIS vs PROFISSIONAIS

**Status:** ❌ NÃO IMPLEMENTADO

**O que falta:**
- Campo `projectType` na tabela `projects` (tipo: "personal" | "professional")
- UI para selecionar tipo ao criar projeto
- Filtros no dashboard por tipo
- Permissões diferenciadas (pessoais são privados, profissionais podem ser compartilhados)

**Implementação:**

```javascript
// 1. Adicionar ao schema
// src/db/schema/core.js

export const projects = pgTable('projects', {
  // ... campos existentes ...
  
  // [NOVO] Tipo de projeto
  type: text('type', { enum: ['personal', 'professional'] }).default('personal').notNull(),
  
  // [NOVO] Se profissional, pode ser compartilhado
  isShared: boolean('is_shared').default(false),
  
  // ... resto ...
});
```

**Impacto:** 
- ⚠️ **MIGRATION necessária** (drizzle-kit)
- UI: Adicionar seletor ao modal de criação
- Backend: Filtros e permissões

---

### 2️⃣ SISTEMA DE TAGS NOS MODAIS

**Status:** ⏳ PARCIALMENTE IMPLEMENTADO

**Atual:**
- ✅ Tabela `tags` existe
- ✅ Tabela `taskTags` (many-to-many) existe
- ❌ UI para adicionar tags no modal não existe
- ❌ Tag picker/selector não implementado

**Implementação Necessária:**

```javascript
// 1. Criar componente TagPicker.jsx
// src/components/forms/TagPicker.jsx

export default function TagPicker({ selectedTags, onChange, onCreateTag }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags</label>
      
      {/* Input para buscar/criar tag */}
      <input
        type="text"
        placeholder="Buscar ou criar tag..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onCreateTag(e.target.value);
            e.target.value = '';
          }
        }}
      />
      
      {/* Tags selecionadas */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <div key={tag.id} className="flex items-center gap-1 bg-slate-200 px-2 py-1 rounded">
            <span className="text-sm">{tag.name}</span>
            <button onClick={() => onChange(selectedTags.filter(t => t.id !== tag.id))}>
              ×
            </button>
          </div>
        ))}
      </div>
      
      {/* Sugestões de tags */}
      {/* lista de tags existentes */}
    </div>
  );
}

// 2. Integrar no PranaFormModal
// src/components/modals/PranaFormModal.jsx

import TagPicker from '@/components/forms/TagPicker';

export default function PranaFormModal({ ... }) {
  const [tags, setTags] = useState([]);
  
  return (
    <form>
      {/* ... campos existentes ... */}
      
      <TagPicker
        selectedTags={tags}
        onChange={setTags}
        onCreateTag={handleCreateTag}
      />
      
      {/* ... resto ... */}
    </form>
  );
}

// 3. API para listar/criar tags
// src/api/tagsRoutes.js

export async function getTags(req, res) {
  const tags = await db.query.tags.findMany();
  res.json(tags);
}

export async function createTag(req, res) {
  const { name, color } = req.body;
  const tag = await db.insert(tags).values({ name, color }).returning();
  res.json(tag);
}
```

**Impacto:**
- ✅ Sem migration (schema já existe)
- UI: TagPicker component novo + integração nos modais
- Backend: Rotas simples para CRUD de tags

---

### 3️⃣ TRADUÇÃO: TUDO TRADUZIDO

**Status:** ⏳ 60% IMPLEMENTADO

**Atual:**
- ✅ LanguageProvider existe (pt, en, es)
- ✅ Muitos labels já traduzidos
- ❌ Alguns textos hardcoded ainda existem

**O que verificar:**

```bash
# 1. Procurar por hardcoded strings
grep -r "TODO\|FIXME\|translate\|i18n" /workspaces/prana3.0/src --include="*.jsx" | wc -l

# 2. Procurar por strings em português direto no código
grep -r "Criar\|Editar\|Excluir\|Cancelar" /workspaces/prana3.0/src/components --include="*.jsx" | grep -v "useTranslations"
```

**Implementação:**

```javascript
// 1. Usar useTranslations em TODOS os componentes
import { useTranslations } from '@/components/LanguageProvider';

export default function MyComponent() {
  const t = useTranslations(); // Pega as traduções
  
  return (
    <button>{t('button_create')}</button>  // Usar chaves
  );
}

// 2. Adicionar ao LanguageProvider.jsx se faltarem
const translations = {
  pt: {
    button_create: "Criar",
    button_edit: "Editar",
    button_delete: "Excluir",
    button_cancel: "Cancelar",
    button_save: "Salvar",
    // ... etc
  },
  en: {
    button_create: "Create",
    button_edit: "Edit",
    button_delete: "Delete",
    button_cancel: "Cancel",
    button_save: "Save",
  },
  es: {
    button_create: "Crear",
    button_edit: "Editar",
    button_delete: "Eliminar",
    button_cancel: "Cancelar",
    button_save: "Guardar",
  }
};
```

**Checklist de Tradução:**
- [ ] Todos labels de botões
- [ ] Todos placeholders de input
- [ ] Todas mensagens de erro
- [ ] Todos títulos de seções
- [ ] Todos tooltips
- [ ] Todos placeholders de textarea
- [ ] Confirmações de ações (delete, etc)

---

### 4️⃣ VIEWS EM COMMAND PALETTE + AJUSTE LAYOUT MODAL

**Status:** ⏳ PARCIALMENTE IMPLEMENTADO

**Atual:**
- ✅ Command Palette existe em VSCodeSettingsLayout
- ❌ Views (Dashboard, Diário, Projetos, etc) não estão listadas
- ❌ Modal tem "sobra para a direita" (layout issue)

**Implementação:**

```javascript
// 1. Expandir Command Palette para incluir navegação
// src/components/settings/VSCodeSettingsLayout.jsx

const COMMAND_PALETTE_SECTIONS = [
  {
    name: 'Navegação - Views',
    items: [
      { label: 'Ir para Dashboard', icon: IconHome, command: () => navigate('/') },
      { label: 'Ir para Chat (Prana AI)', icon: IconRobot, command: () => navigate('/chat') },
      { label: 'Ir para Sankalpa', icon: IconTarget, command: () => navigate('/sankalpa') },
      { label: 'Ir para Cronos', icon: IconClock, command: () => navigate('/cronos') },
      { label: 'Ir para Cosmos', icon: IconMoon, command: () => navigate('/cosmos') },
      { label: 'Ir para Diário', icon: IconBook, command: () => navigate('/diary') },
      { label: 'Ir para Papyrus', icon: IconPapyrus, command: () => navigate('/papyrus') },
      { label: 'Ir para Neural', icon: IconBrain, command: () => navigate('/mindmap') },
      { label: 'Ir para Coletivo', icon: IconUsers, command: () => navigate('/team') },
      { label: 'Ir para Matrix', icon: IconGrid, command: () => navigate('/matrix') },
      { label: 'Ir para Flux', icon: IconFlow, command: () => navigate('/flux') },
    ]
  },
  {
    name: 'Ações Rápidas',
    items: [
      { label: 'Nova Tarefa', icon: IconPlus, command: () => openNewTaskModal() },
      { label: 'Novo Projeto', icon: IconFolderPlus, command: () => openNewProjectModal() },
      { label: 'Novo Check-in de Energia', icon: IconZap, command: () => openEnergyCheckIn() },
    ]
  },
  {
    name: 'Configurações',
    items: [
      { label: 'Idioma', icon: IconGlobe, command: () => openLanguageSettings() },
      { label: 'Tema', icon: IconPalette, command: () => openThemeSettings() },
      { label: 'Preferências', icon: IconSettings, command: () => openSettingsModal() },
    ]
  },
];

// 2. Ao pressionar Cmd+K, abrir command palette
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsPaletteOpen(true);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);

// 3. Componente CommandPalette com layout correto
<CommandPalette
  isOpen={isPaletteOpen}
  onClose={() => setIsPaletteOpen(false)}
  sections={COMMAND_PALETTE_SECTIONS}
/>
```

**Ajuste do Layout Modal:**

```jsx
// PranaFormModal.jsx - Remover sobra para a direita

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  {/* Modal com max-width correto */}
  <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
    {/* Conteúdo do modal */}
    <div className="p-6">
      {/* Formulário */}
    </div>
    
    {/* Footer com botões */}
    <div className="border-t p-4 flex gap-2 justify-end">
      <button onClick={onClose}>Cancelar</button>
      <button onClick={handleSubmit}>Salvar</button>
    </div>
  </div>
</div>
```

---

## 📋 CHECKLIST PRÉ-DEPLOY

### Fase 1: Preparação (Hoje)

- [ ] **1.1 - Projetos Pessoais/Profissionais**
  - [ ] Adicionar campo `type` e `isShared` ao schema
  - [ ] Rodar migration: `npm run db:push`
  - [ ] Criar UI para seletor no modal
  - [ ] Testar criação de projeto com ambos tipos

- [ ] **1.2 - Sistema de Tags**
  - [ ] Criar `TagPicker.jsx` component
  - [ ] Integrar em `PranaFormModal.jsx`
  - [ ] Criar API routes para CRUD tags
  - [ ] Testar criar/remover tags

- [ ] **1.3 - Tradução Completa**
  - [ ] Auditoria de hardcoded strings
  - [ ] Adicionar faltantes ao `LanguageProvider.jsx`
  - [ ] Testar alteração de idioma
  - [ ] Verificar 3 idiomas (pt, en, es)

- [ ] **1.4 - Command Palette + Modal Layout**
  - [ ] Expandir command palette com todas views
  - [ ] Adicionar atalho Cmd+K para abrir
  - [ ] Testar navegação via command palette
  - [ ] Corrigir layout modal (max-width, padding)
  - [ ] Remover scrollbar desnecessária

### Fase 2: Testes (Tomorrow)

- [ ] Testar todas 4 funcionalidades em conjunto
- [ ] Testar em 3 idiomas
- [ ] Testar em desktop e mobile (responsivo)
- [ ] Verificar performance (bundle size)
- [ ] Verificar erros no console

### Fase 3: Deploy

- [ ] Build: `npm run build`
- [ ] Verificar `/dist` foi gerado
- [ ] Deploy em staging
- [ ] Testes finais em staging
- [ ] Deploy em produção
- [ ] Monitor de erros (Sentry)

---

## 📊 ESTIMATIVA DE TRABALHO

| Tarefa | Tempo | Prioridade |
|--------|-------|-----------|
| Projetos Pessoais/Profissionais | 2h | 🔴 CRÍTICA |
| Sistema de Tags | 1.5h | 🔴 CRÍTICA |
| Tradução Completa | 1h | 🟡 ALTA |
| Command Palette + Modal Layout | 1.5h | 🟡 ALTA |
| Testes | 2h | 🔴 CRÍTICA |
| **TOTAL** | **8h** | |

---

## 🚀 PASSO A PASSO DO DEPLOY

### 1. Preparação Local

```bash
# Crie uma branch para deploy
git checkout -b deploy/v1-production

# Atualize dependências
npm install

# Verifique linting
npm run lint
```

### 2. Implementar Mudanças

Siga a ordem:
1. Projetos pessoais/profissionais
2. Tags UI
3. Tradução
4. Command palette

```bash
# Depois de cada mudança
git add .
git commit -m "feat: [funcionalidade]"
```

### 3. Testar Localmente

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend (se separado)
npm run dev:frontend

# Teste em http://localhost:5173
# Teste todos os 4 itens
# Teste nos 3 idiomas
```

### 4. Build para Produção

```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build

# Verifique tamanho
ls -lh dist/
# Espera: < 500KB gzipped
```

### 5. Deploy em Staging

```bash
# Opção A: Vercel
vercel --prod --scope=seu-scope

# Opção B: VPS Manual
scp -r dist/* user@server:/var/www/prana/
ssh user@server "systemctl restart prana"

# Opção C: Docker
docker build -t prana:v1 .
docker push seu-registry/prana:v1
```

### 6. Testar em Produção

- [ ] Acessar seu site
- [ ] Testar criar projeto pessoal
- [ ] Testar criar projeto profissional
- [ ] Testar adicionar tags
- [ ] Mudar idioma
- [ ] Usar Cmd+K (command palette)
- [ ] Testar em mobile
- [ ] Verificar console (0 errors)

### 7. Monitor Pós-Deploy

```bash
# Abra Sentry
# Monitore erros por 1 hora
# Se erro crítico → rollback imediato

# Rollback
git revert HEAD
npm run build
# Redeploy versão anterior
```

---

## ⚠️ RISCOS E CONTINGÊNCIA

| Risco | Probabilidade | Impacto | Ação |
|-------|---------------|--------|------|
| Migration quebra | 🟡 Média | 🔴 Crítica | Teste em staging primeiro |
| Performance degradada | 🟢 Baixa | 🟡 Alta | Monitor bundle size |
| UX confusa com pessoal/prof | 🟡 Média | 🟡 Alta | Teste com usuários reais |
| Tags não aparecem | 🟢 Baixa | 🟡 Alta | Testar API mock antes |

---

## 📞 SUPORTE PÓS-DEPLOY

Se algo deu errado:

1. **Erro de banco de dados?**
   ```bash
   # Rollback migration
   npm run db:reset
   git revert HEAD~1
   npm run build
   ```

2. **Interface quebrada?**
   ```bash
   # Limpar cache do navegador
   # Chrome: Ctrl+Shift+Delete
   # Ou hard refresh: Ctrl+Shift+R
   ```

3. **Tradução faltando?**
   ```bash
   # Verificar console para chaves faltantes
   # Adicionar ao LanguageProvider
   # Rodar rebuild
   ```

4. **Command palette não funciona?**
   ```bash
   # Verificar atalho Cmd+K no navegador
   # Pode conflitar com browser shortcuts
   # Usar Ctrl+K alternativamente
   ```

---

## 🎯 PRÓXIMO PASSO

👉 **Qual desses 4 itens você quer que eu implemente PRIMEIRO?**

1. Projetos Pessoais/Profissionais (mais crítico)
2. Tags (depende de pouco)
3. Tradução (mais fácil)
4. Command Palette (mais visual)

Posso começar agora mesmo! Qual você quer?


# File-Task Association - Quick Integration Checklist

## ✅ Backend Completo

- [x] Schema com `fileTaskAssociations` table
- [x] Colunas de cache em `papyrusDocuments` e `tasks`
- [x] Migration gerada e pronta
- [x] Controller com todos os métodos CRUD
- [x] Rotas REST implementadas (12 endpoints)
- [x] Integração no `server.js`
- [x] Build passa sem erros

## ⏳ Frontend - Próximas Ações

### Fase 1: Integração Básica (30 min)

- [ ] **1.1** Integrar `FileTaskPanel` em `DocEditorView.jsx`
  - Local: Painel lateral direito
  - Props: `type="file"`, `id={fileId}`
  - Referência: `/FILE_TASK_ASSOCIATION_IMPLEMENTATION.md` linha ~150

- [ ] **1.2** Integrar `FileTaskLinkModal` em `DocEditorView.jsx`
  - Local: Mesmo componente
  - Props: trigger no botão do panel

- [ ] **1.3** Integrar `FileTaskPanel` em `TaskDetailsView.jsx` (ou `TaskWorkspaceOverlay`)
  - Local: Seção "Relacionados" ou nova seção
  - Props: `type="task"`, `id={taskId}`

- [ ] **1.4** Integrar `FileTaskLinkModal` em `TaskDetailsView.jsx`

### Fase 2: Melhorias de UX (30 min)

- [ ] **2.1** Implementar busca dinâmica em `FileTaskLinkModal`
  - Buscar arquivos/tarefas do projeto ao digitar
  - Usar endpoint próprio de search ou filtro simples

- [ ] **2.2** Adicionar badges de contadores
  - Mostrar `relatedFilesCount` em cards de tarefas
  - Mostrar `relatedTasksCount` em cards de arquivos

- [ ] **2.3** Adicionar notificações (toast)
  - Success ao vincular
  - Error ao remover
  - Use sua library existente (Toaster, Sonner, etc)

### Fase 3: Criação Rápida de Tarefas (15 min)

- [ ] **3.1** Botão "Criar Tarefa" em `DocEditorView`
  - Abre modal com título pré-preenchido
  - Seleciona tipo de relacionamento
  - Cria task + association automaticamente

- [ ] **3.2** Integrar em `PranaFormModal` (se aplicável)
  - Adicionar opção de vincular arquivo ao criar tarefa

### Fase 4: Testes (20 min)

- [ ] **4.1** Teste E2E: Criar arquivo → Criar tarefa → Vincular → Visualizar
- [ ] **4.2** Teste E2E: Remover associação
- [ ] **4.3** Teste E2E: Mudar tipo de relacionamento
- [ ] **4.4** Teste E2E: Deletar arquivo (verifica cascade)

---

## 🚀 Como Começar

### Passo 1: Ter o Backend Rodando
```bash
npm run db:migrate  # Se ainda não foi rodado
npm run dev         # Servidor rodando
```

### Passo 2: Começar pela Integração Simples
```jsx
// Em DocEditorView.jsx
import { FileTaskPanel } from '@/components/fileTask/FileTaskPanel';
import { FileTaskLinkModal } from '@/components/fileTask/FileTaskLinkModal';

export function DocEditorView({ fileId }) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  return (
    <div className="flex">
      {/* Editor à esquerda */}
      <main className="flex-1">{/* seu editor */}</main>

      {/* Painel lateral direito */}
      <aside className="w-80 border-l border-white/10 p-4 space-y-4">
        <FileTaskPanel 
          type="file" 
          id={fileId}
          onAssociate={() => setLinkModalOpen(true)}
        />

        <FileTaskLinkModal
          open={linkModalOpen}
          onOpenChange={setLinkModalOpen}
          type="file"
          id={fileId}
          onLink={() => setLinkModalOpen(false)}
        />
      </aside>
    </div>
  );
}
```

### Passo 3: Testar
```bash
# 1. Abrir arquivo no editor
# 2. Clicar em "+ Adicionar" no painel
# 3. Buscar tarefa
# 4. Vincular
# 5. Ver aparecer na lista
```

---

## 📝 Código de Referência

### Componente Mínimo (Copy-Paste Ready)

```jsx
import { useState } from 'react';
import { FileTaskPanel } from '@/components/fileTask/FileTaskPanel';
import { FileTaskLinkModal } from '@/components/fileTask/FileTaskLinkModal';

export function MyFileEditor({ fileId }) {
  const [linkOpen, setLinkOpen] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-4 h-screen">
      {/* Editor (2 colunas) */}
      <div className="col-span-2 border-r border-white/10 p-4">
        {/* seu editor aqui */}
      </div>

      {/* Sidebar (1 coluna) */}
      <aside className="border-l border-white/10 p-4 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-sm font-bold mb-4 uppercase opacity-70">
            Gerenciar
          </h2>

          <FileTaskPanel 
            type="file" 
            id={fileId}
            onAssociate={() => setLinkOpen(true)}
          />
        </div>

        <FileTaskLinkModal
          open={linkOpen}
          onOpenChange={setLinkOpen}
          type="file"
          id={fileId}
          onLink={() => console.log('Vinculado!')}
        />
      </aside>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### "Module not found: fileTaskAssociationAPI"
**Solução**: Verificar caminho de importação
```javascript
// ✓ Correto
import { FileTaskAssociationAPI } from '@/api/fileTaskAssociationAPI';

// ✗ Errado
import { FileTaskAssociationAPI } from '@/api/fileTaskAssociationAPI.js';
```

### "POST /api/file-task-associations 401 Unauthorized"
**Solução**: Token de autenticação ausente. Verificar:
```javascript
// Deve estar autenticado
// Na integração, se usar apiClient, deve passar token automaticamente
```

### Modal não aparece/não fecha
**Solução**: Verificar state
```javascript
const [open, setOpen] = useState(false);
// ... 
<FileTaskLinkModal 
  open={open}
  onOpenChange={setOpen}  // ← Importante
  // ...
/>
```

---

## 📚 Documentação de Referência

- [Design Document](FILE_TASK_ASSOCIATION_DESIGN.md) - Visão geral arquitetural
- [Visual Guide](FILE_TASK_ASSOCIATION_VISUAL.md) - Diagramas e fluxos
- [Implementation Guide](FILE_TASK_ASSOCIATION_IMPLEMENTATION.md) - Detalhes técnicos completos

---

## 🎯 Objetivo Final

```
┌─────────────────────────────────────────────┐
│ Usuário abre arquivo                        │
├─────────────────────────────────────────────┤
│ ✓ Vê tarefas relacionadas no painel lateral │
│ ✓ Pode vincular/desvincular tarefas         │
│ ✓ Pode criar nova tarefa do arquivo         │
│ ✓ Contador mostra quantas tarefas tem       │
├─────────────────────────────────────────────┤
│ Usuário abre tarefa                         │
├─────────────────────────────────────────────┤
│ ✓ Vê arquivos relacionados no painel        │
│ ✓ Pode vincular/desvincular arquivos        │
│ ✓ Pode clicar para abrir arquivo            │
│ ✓ Contador mostra quantos arquivos tem      │
└─────────────────────────────────────────────┘
```

---

**Tempo estimado**: 90 min (4 fases)
**Dificuldade**: Média (apenas integração, lógica já pronta)
**Prioridade**: Alta (core feature para workflow arquivo↔tarefa)

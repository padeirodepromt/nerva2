# 🔥 Sistema de Spark/Thought - Análise Detalhada

## O que é um Spark? (aka Thought)

Um **Spark** é um pensamento/ideia rápida capturada pelo usuário. O backend chama de **Thought**.

### Ciclo de Vida:
```
1. CAPTURA (Criação)
   ├─ Via Sidebar "Faísca" button
   ├─ Via SmartCreationModal com context='spark'
   └─ Input: Um texto curto da ideia
   
2. INBOX (Espera)
   ├─ Armazenado como Task com status='inbox'
   ├─ Visível em InboxView
   ├─ Aguarda processamento do usuário
   └─ Conceito: "Capturei a ideia, vou processar depois"
   
3. PROCESSAMENTO (Transmutação)
   ├─ Promover para Tarefa: Task.update(status='todo')
   ├─ Expandir para Projeto: Project.create(title)
   ├─ Descartar: Task.delete()
   └─ Interface: Botões em cada item de Spark no InboxView
   
4. RESOLUÇÃO
   ├─ Se virou Tarefa: segue fluxo de Task normal
   ├─ Se virou Projeto: segue fluxo de Project normal
   └─ Se descartada: removida do sistema
```

---

## 📁 Arquitetura Atual

### 1. **CRIAÇÃO de Spark**
```
Sidebar (Button)
    ↓
handleCreate('spark')
    ↓
window.dispatchEvent('prana:open-smart-modal', { detail: { context: 'spark' } })
    ↓
SmartCreationModal abre (isSmartModalOpen=true, smartModalContext='spark')
    ↓
User digita input (ex: "Ideia para newsletter")
    ↓
SmartCreationModal.handleCreate()
    ├─ Validação
    ├─ Task.create({
    │   title: input,
    │   status: 'inbox',  ← SPARK MARKER!
    │   project_id: null,
    │   customData: { taskType: 'spark' }  ← Metadado
    │ })
    └─ Toast "Spark capturado!"
    ↓
Modal fecha
```

**Arquivo:** `src/components/smart/SmartCreationModal.jsx` (linhas 65+)

### 2. **ARMAZENAMENTO**
```
2 Locais:
─────────
a) tasks table (atual - como fallback)
   └─ Coluna: status='inbox'
   └─ É a implementação atual

b) thoughts table (novo - futuro)
   └─ Arquivo: src/db/schema/docs.js (linhas 45-53)
   └─ Colunas:
      ├─ id (tht_xxx)
      ├─ content (texto da ideia)
      ├─ isProcessed (bool)
      ├─ userId
      └─ createdAt
```

**Status:** Usando tasks table por enquanto, schema thoughts existe para futuro.

### 3. **VISUALIZAÇÃO E PROCESSAMENTO**
```
InboxView
├─ Localização: src/views/InboxView.jsx (148 linhas)
├─ Props: Nenhuma (carrega direto do estado)
├─ Carregamento:
│  └─ Task.list({ status: 'inbox' })
├─ Renderização:
│  ├─ Header com ícone Neural (pensamentos)
│  ├─ Grid de Sparks
│  └─ Empty state "Inbox Zero" com sugestão Ctrl+K
├─ Ações em cada Spark:
│  ├─ "Promover para Tarefa" → Task.update(status='todo')
│  ├─ "Expandir para Projeto" → Project.create(title) + Task.delete()
│  └─ "Descartar" → Task.delete()
└─ UX:
   ├─ Ícone: IconNeural (amarelo)
   ├─ Cada item: card com título + botões de ação
   └─ Animações: hover effects, smooth transitions
```

### 4. **ENTITIES/MODELS**
```
Arquivo: src/api/entities.js (linha 180)

export class Thought extends BaseEntity { 
    static resource = 'thoughts'; 
}
```

**Status:** Classe existe, mas não há routes backend específicas para Thought. O sistema usa Task com status='inbox'.

---

## 🔄 Fluxos Atuais

### Fluxo 1: Criar Spark via SmartModal
```javascript
// src/components/smart/SmartCreationModal.jsx (linhas 65-84)
if (!taskType && smartModalContext === 'task') {
    taskType = 'task';
}
// Cria Task com status='inbox'
await Task.create({
    title: input,
    project_id: projectId,
    status: 'todo',  // ← AQUI! Deveria ser 'inbox' para spark
    customData: { taskType: taskType }
});
toast.success(`Tarefa criada${typeLabel} em ...`);
```

**PROBLEMA:** Mesmo com context='spark', cria Task com status='todo', não 'inbox'!

### Fluxo 2: Processar Spark em InboxView
```javascript
// src/views/InboxView.jsx (linhas 38-44)
const handlePromoteToTask = async (spark) => {
    // Muda status de 'inbox' para 'todo'
    await Task.update(spark.id, { status: 'todo' });
    toast.success("Promovido para Tarefa!");
    setSparks(prev => prev.filter(s => s.id !== spark.id));
};

// src/views/InboxView.jsx (linhas 48-58)
const handlePromoteToProject = async (spark) => {
    // 1. Cria Project com o título do Spark
    await Project.create({ title: spark.title, status: 'active' });
    // 2. Remove o Spark
    await Task.delete(spark.id);
    toast.success("Expandido para Projeto!");
    setSparks(prev => prev.filter(s => s.id !== spark.id));
};
```

---

## ⚠️ Problemas Identificados

### 1. **SmartCreationModal não respeita context='spark'**
```javascript
// Atual (ERRADO):
if (!taskType && smartModalContext === 'task') {
    taskType = 'task';
}
// Não há check para smartModalContext === 'spark'!
await Task.create({ status: 'todo' });  // ← Sempre 'todo', nunca 'inbox'
```

### 2. **SmartCreationModal cria Task, não Thought**
- Não usa `Thought.create()`
- Não distingue entre Task e Thought em armazenamento
- Usa Task com status='inbox' como proxy

### 3. **InboxView está correto, mas SmartModal quebra o fluxo**
- SmartModal deveria criar Task com status='inbox'
- Atualmente cria status='todo'
- InboxView nunca vê os Sparks do SmartModal!

---

## ✅ O que Está Certo

### InboxView (Implementação)
```javascript
// Tudo funciona bem aqui:
✅ Carrega Tasks com status='inbox'
✅ Renderiza em grid bonito
✅ Botões de ação funcionam
✅ Promove para Task (status='todo')
✅ Expande para Project (create + delete)
✅ Descarta (delete)
✅ Empty state com sugestão
```

### Modelos de Dados
```javascript
✅ Thought entity existe
✅ thoughts table schema existe
✅ Task pode ter status='inbox'
```

---

## 🔧 Correções Necessárias

### 1. **Corrigir SmartCreationModal** (5 min)
```javascript
// Antes:
const handleCreate = async () => {
    // ...
    await Task.create({
        title: input,
        project_id: projectId,
        status: 'todo',  // ❌
        customData: { taskType: taskType }
    });
};

// Depois:
const handleCreate = async () => {
    // ...
    const status = smartModalContext === 'spark' ? 'inbox' : 'todo';
    await Task.create({
        title: input,
        project_id: projectId,
        status: status,  // ✅ 'inbox' para spark, 'todo' para task
        customData: { taskType: smartModalContext }
    });
};
```

### 2. **Adicionar feedback visual** (10 min)
```javascript
// Em SmartCreationModal:
const placeholderByContext = {
    null: "O que você quer criar? (ex: 'Blog post idea #Marketing')",
    spark: "Capture sua ideia rapidamente...",
    task: "Qual tarefa precisa fazer?",
    project: "Nome do projeto (ex: 'Website v3')",
    doc: "Título do documento..."
}[smartModalContext];
```

### 3. **Adicionar rota para Manifestar inteligente** (future)
```javascript
// Quando smartModalContext === null:
// 1. Enviar para Ash analisar
// 2. Ash retorna tipo detectado (spark, task, project, doc)
// 3. Criar com tipo correto
```

---

## 📊 Status Atual

| Feature | Implementado | Funciona | Notas |
|---------|--------------|----------|-------|
| Criar Spark via SmartModal | ✅ | ❌ | Bug: cria Task não Spark |
| Processar Spark em InboxView | ✅ | ✅ | Se chegar em 'inbox' |
| Promover para Task | ✅ | ✅ | Fluxo correto |
| Expandir para Project | ✅ | ✅ | Fluxo correto |
| Descartar Spark | ✅ | ✅ | Fluxo correto |
| Thought entity | ✅ | ❌ | Existe mas não usado |
| thoughts table | ✅ | ❌ | Schema existe, não migrado |

---

## 🎯 Próximos Passos

### Quick Fix (5 min)
- [ ] Corrigir SmartCreationModal para respeitar context='spark'
- Resultado: Sparks começam a aparecer em InboxView

### Enhancement (30 min)
- [ ] Melhorar feedback visual/placeholder
- [ ] Adicionar status badge em cada Spark
- [ ] Melhorar UX de InboxView

### Long-term (future)
- [ ] Migrar para `Thought.create()` ao invés de Task
- [ ] Implementar thoughts table
- [ ] Adicionar inteligência Ash para Manifestar
- [ ] Criar `ThoughtWorkspaceOverlay` se necessário

---

## 📝 Conclusão

**O sistema de Spark/Thought é 90% pronto!**

- ✅ InboxView implementado e funcional
- ✅ Modelos de dados existem
- ❌ SmartCreationModal tem um bug simples (status='todo' deveria ser 'inbox')
- ❌ Falta integração com PranaFormModal para outros tipos

**Fix imediato:** 1 linha de código em SmartCreationModal.
**Benefício:** Spark/Faísca funciona como esperado.

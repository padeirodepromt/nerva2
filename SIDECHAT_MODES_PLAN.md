# 🎯 SideChat Modes + Upload - Plano de Implementação

## 1️⃣ Modos do SideChat (5 Modos)

### **Mode 1: 💬 CHAT** (Padrão)
**Tipo:** Conversa Livre  
**Quando usar:** Conversa geral com Ash  
**Contexto enviado:** activeContext (project/task)  
**Response:** Resposta conversacional  
**Ações possíveis:** Qualquer um

---

### **Mode 2: 🎯 PLANEJAR** (Planning)
**Tipo:** Planejamento Estruturado  
**Quando usar:** "Ajuda a planejar minha semana", "Organize minhas tarefas"  
**Contexto enviado:**
- Tarefas atuais (status, priority)
- Tempo disponível (time sessions)
- Energy levels (últimos dias)
- Calendar events

**Processing:**
1. Ash analisa carga atual
2. Sugere reorganização/novas tarefas
3. Prioriza por energy + urgência
4. Cria timeline

**Response:**
```javascript
{
  type: 'PLAN',
  plan: {
    tasksToCreate: [...],
    tasksToReorder: [...],
    suggestions: '...',
    timeline: { week: [...], day: [...] }
  },
  client_action: {
    type: 'CREATE_TASKS',
    tasks: [...]
  }
}
```

---

### **Mode 3: ✨ CRIAR** (Brainstorm)
**Tipo:** Criação + Brainstorming  
**Quando usar:** "Vou criar um novo projeto", "Brainstorm de ideias", "Help me outline this"  
**Contexto enviado:**
- Projetos existentes (para inspiração)
- Templates (se disponível)
- Preferências do usuário

**Processing:**
1. Ash gera ideias/outline
2. Estrutura em hierarquia
3. Cria mind map nodes
4. Sugere template

**Response:**
```javascript
{
  type: 'CREATE',
  outline: '...',
  structure: {
    title: '...',
    sections: [...],
    mindmap: {
      nodes: [{ label, children, color }],
      connections: [...]
    }
  },
  client_action: {
    type: 'CREATE_MINDMAP' || 'CREATE_PROJECT',
    data: {...}
  }
}
```

---

### **Mode 4: 📖 REFLEXÃO** (Reflection/Insight)
**Tipo:** Análise + Insights  
**Quando usar:** "How was my day?", "Analyze my week", "What patterns do you see?"  
**Contexto enviado:**
- Diários dos últimos dias
- Mood distribution
- Energy levels
- Tasks completed
- Astrological profile
- Menstrual cycle (if applicable)
- Tags frequency

**Processing:**
1. Ash analisa tudo holisticamente
2. Detecta padrões
3. Gera insights
4. Sugere ações

**Response:**
```javascript
{
  type: 'REFLECTION',
  analysis: {
    moodPattern: '...',
    energyTrend: '...',
    productivityIndex: 0.8,
    discoveries: ['...', '...'],
    correlations: { energy: {}, mood: {}, tasks: {} }
  },
  insights: '...',
  suggestions: ['...', '...'],
  nextSteps: ['...']
}
```

---

### **Mode 5: ❓ PERGUNTAR** (Q&A)
**Tipo:** Consulta Rápida  
**Quando usar:** Perguntas gerais, rápidas  
**Contexto enviado:** Contexto mínimo (só se ask)  
**Processing:** Search + Context + LLM  
**Response:** Resposta direta

---

## 2️⃣ Upload de Arquivo

### **Tipos Suportados:**
- 📄 **Documentos:** PDF, DOCX, MD, TXT
- 📊 **Dados:** CSV, JSON
- 🖼️ **Imagens:** JPG, PNG, GIF
- 📎 **Geral:** DOCX, XLSX, PPT

### **Flows:**

#### **Flow 1: Upload → Chat**
```
[Upload Icon] → File Input
             ↓
      Process File (PDF extract, OCR, etc)
             ↓
      Preview in Chat
             ↓
  "Ash, analyze this" ou "Crie uma tarefa baseado nisto"
             ↓
      Ash processa + contexto + arquivo
```

#### **Flow 2: Upload → Papyrus**
```
[Upload Icon] → File Input
             ↓
      "Save as Document?"
             ↓
  Create Papyrus Note + File Reference
```

#### **Flow 3: Upload → Task**
```
[Upload Icon] → File Input
             ↓
      "Attach to task?"
             ↓
  Create Task + File Attachment
```

### **Implementation Details:**

```javascript
// src/components/chat/SideChat.jsx (updated)

<div className="flex items-center gap-2">
  {/* File Upload */}
  <input
    ref={fileInputRef}
    type="file"
    hidden
    onChange={handleFileUpload}
    accept=".pdf,.docx,.md,.txt,.csv,.json,.jpg,.png,.gif,.xlsx,.ppt"
  />
  
  <Button
    size="icon"
    variant="ghost"
    onClick={() => fileInputRef.current?.click()}
    title="Attach file"
  >
    <IconPaperclip className="w-4 h-4" />
  </Button>

  {/* Mode Selector */}
  <Select value={chatMode} onValueChange={setChatMode}>
    <SelectTrigger className="w-32 h-10 text-xs">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="chat">💬 Chat</SelectItem>
      <SelectItem value="plan">🎯 Planejar</SelectItem>
      <SelectItem value="create">✨ Criar</SelectItem>
      <SelectItem value="reflect">📖 Reflexão</SelectItem>
      <SelectItem value="ask">❓ Perguntar</SelectItem>
    </SelectContent>
  </Select>

  {/* Send Button */}
  <Button onClick={handleSend}>
    <IconSend className="w-4 h-4" />
  </Button>
</div>

// Handler
const handleFileUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // 1. Validate size (< 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('File too large (max 10MB)');
    return;
  }
  
  // 2. Process file (extract text, OCR for images, etc)
  const processed = await processFile(file);
  
  // 3. Store in state
  setAttachedFiles([...attachedFiles, {
    name: file.name,
    type: file.type,
    content: processed,
    preview: generatePreview(file)
  }]);
  
  // 4. Show preview in chat area
};

const handleSend = async () => {
  if (!input.trim() && attachedFiles.length === 0) return;
  
  const msg = input;
  setInput('');
  
  // Include files in context
  await sendMessage(msg, {
    mode: chatMode,
    files: attachedFiles,
    fileContext: attachedFiles.map(f => ({
      name: f.name,
      summary: f.content.slice(0, 500) // First 500 chars
    }))
  });
  
  setAttachedFiles([]); // Clear after sending
};
```

---

## 3️⃣ UI Layout

### **Before (Current):**
```
┌─────────────────────────┐
│ Ash | 🧠 Neural Link   │ [🗑️]
├─────────────────────────┤
│ [Status indicators]     │
├─────────────────────────┤
│ [Messages]              │
│                         │
├─────────────────────────┤
│ [Input] [Send]          │
└─────────────────────────┘
```

### **After (With Modes + Upload):**
```
┌─────────────────────────────────┐
│ Ash | 🧠 Neural Link       [🗑️] │
├─────────────────────────────────┤
│ [Status indicators]             │
├─────────────────────────────────┤
│ [Messages]                      │
│ + [File previews if attached]   │
├─────────────────────────────────┤
│ [📎] [💬Chat ▼] [Input] [➤]    │
│      [🎯Plan]                   │
│      [✨Create]                 │
│      [📖Reflect]                │
│      [❓Ask]                    │
└─────────────────────────────────┘
```

---

## 4️⃣ Implementação (Prioritário)

### **Phase 1: Upload + File Preview** (Essencial)
- [ ] File input + validation
- [ ] File preview in chat
- [ ] File processing (extract text)
- [ ] Storage in state + cleanup

### **Phase 2: Mode Selector** (Alto)
- [ ] Mode dropdown
- [ ] Mode indicator badges
- [ ] Different prompts per mode
- [ ] Ash personality adjustment por modo

### **Phase 3: Mode-Specific Processing** (Alto)
- [ ] PLAN mode: context enrichment + task creation
- [ ] CREATE mode: structure generation
- [ ] REFLECT mode: holistic analysis
- [ ] ASK mode: search integration

### **Phase 4: File + Mode Combo** (Médio)
- [ ] "Upload + Analyze" flow
- [ ] File as context para cada mode
- [ ] Extraction inteligente por tipo

---

## 5️⃣ API Modifications Needed

### **Endpoint: POST /ai/chat**
Add to request:
```javascript
{
  message: '...',
  mode: 'chat' | 'plan' | 'create' | 'reflect' | 'ask',
  files: [{
    name: '...',
    type: 'pdf' | 'text' | 'image',
    content: '...',
    summary: '...'
  }],
  holisticContext: {...},
  context: {...}
}
```

---

## 6️⃣ Files to Create/Modify

### **New Files:**
- `src/hooks/useChatModes.js` - Hook para gerenciar modes
- `src/utils/fileProcessing.js` - Extract text, process files
- `src/components/chat/FilePreviews.jsx` - Componente para preview

### **Modified Files:**
- `src/components/chat/SideChat.jsx` - Add modes + upload UI
- `src/stores/useChatStore.js` - Add mode support
- `src/api/aiRoutes.js` - Handle mode logic in backend

---

## 7️⃣ What Makes Sense?

✅ **PLANEJAR**: Sim! Ash já tem acesso a tarefas, calendar, time sessions
✅ **CRIAR**: Sim! Pode gerar outlines, mind maps, projetos
✅ **REFLEXÃO**: Sim! Tem dados de energy, mood, diários, astrologia
✅ **PERGUNTAR**: Sim! Q&A básico, sempre útil
✅ **UPLOAD**: Sim! PDF analysis, document import, data import

**Todas fazem sentido no contexto do Prana!** 🎯

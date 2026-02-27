# 🚀 Phase 3 - Backend Processing Roadmap

**Status:** PLANEJAMENTO  
**Início Estimado:** Próxima sessão  
**Objetivo:** Processar requisições com modo-específico, usando arquivos como contexto

---

## 📋 Objetivos Phase 3

O backend (Ash AI) receberá:
- ✅ `content` - mensagem do usuário
- ✅ `mode` - um dos 5 modos (chat, plan, create, reflect, ask)
- ✅ `files` - array com arquivos (name, type, size, content, preview)
- ✅ `holistic` - contexto holístico (energia, mood, rituals, astro)

Deverá:
- [ ] Adaptar system prompt por modo
- [ ] Usar arquivo como contexto adicional
- [ ] Retornar resposta modo-específica
- [ ] Criar artifacts (tasks, ideas, análises)
- [ ] Link tasks com arquivos origem

---

## 🎯 Modo Processing Details

### 1. 💬 CHAT Mode
**System Prompt:**
```
Você é Ash, assistente holístico do Prana.
Converse naturalmente, considerando:
- Contexto holístico (energia, humor, rituais)
- Arquivos anexados (se houver)
- Histórico da conversa
```

**Processamento:**
- [ ] Análise simples do conteúdo
- [ ] Resposta conversacional
- [ ] Sugestões baseadas em contexto

**Output:**
- Mensagem de resposta
- Sugestões simples
- Emojis contextuais

---

### 2. 🎯 PLAN Mode
**System Prompt:**
```
Você é especialista em planejamento do Prana.
Quando o usuário pedir ajuda para planejar:
1. Analise o objetivo/tarefa
2. Quebre em subtarefas
3. Crie timeline com deadlines
4. Considere energia disponível
5. Use arquivo como contexto se houver
```

**Processamento:**
- [ ] Extrair objetivos do arquivo (se houver)
- [ ] Quebrar em tarefas atômicas
- [ ] Calcular duração estimada
- [ ] Gerar timeline visual
- [ ] Criar tasks no database

**Output:**
```json
{
  "type": "plan",
  "title": "Semana do [data]",
  "timeline": [
    {
      "day": "Segunda",
      "tasks": [
        {
          "id": "task_1",
          "title": "Tarefa 1",
          "duration": "2h",
          "energy": "high",
          "linkedFiles": ["documento.pdf"]
        }
      ]
    }
  ],
  "totalHours": 20,
  "energyDistribution": {}
}
```

---

### 3. ✨ CREATE Mode
**System Prompt:**
```
Você é especialista em criatividade do Prana.
Quando usuário solicitar criação/brainstorm:
1. Gere ideias variadas
2. Estruture as melhores
3. Crie outline/framework
4. Use arquivo como inspiração se houver
5. Sugira próximos passos
```

**Processamento:**
- [ ] Análise do tema/objetivo
- [ ] Brainstorm automático (10-20 ideias)
- [ ] Ranking de viabilidade
- [ ] Estruturação da ideia top
- [ ] Geração de outline

**Output:**
```json
{
  "type": "create",
  "ideas": [
    { "idea": "Ideia 1", "score": 9.2, "feasibility": "Alta" },
    { "idea": "Ideia 2", "score": 8.7, "feasibility": "Média" }
  ],
  "selectedIdea": "Ideia 1",
  "outline": {
    "title": "...",
    "sections": [ ... ]
  },
  "nextSteps": [ ... ]
}
```

---

### 4. 📖 REFLECT Mode
**System Prompt:**
```
Você é especialista em reflexão holística.
Quando usuário pedir reflexão:
1. Analise o contexto holístico completo
2. Conecte com energia/mood atual
3. Extraia insights do arquivo se houver
4. Sugira ações baseadas em Human Design
5. Crie plano de desenvolvimento
```

**Processamento:**
- [ ] Análise holística (energia, mood, astro, HD)
- [ ] Correlação com histórico
- [ ] Extração de padrões
- [ ] Geração de insights
- [ ] Recomendações personalizadas

**Output:**
```json
{
  "type": "reflect",
  "currentState": {
    "energy": "...",
    "mood": "...",
    "humanDesign": "..."
  },
  "insights": [ ... ],
  "patterns": [ ... ],
  "recommendations": [ ... ],
  "developmentPlan": { ... }
}
```

---

### 5. ❓ ASK Mode
**System Prompt:**
```
Você é especialista em Q&A contextualizado.
Quando usuário fazer pergunta:
1. Processe a pergunta
2. Busque contexto relevante (arquivo, histórico, holistic)
3. Responda diretamente e concisamente
4. Forneça referências se aplicável
```

**Processamento:**
- [ ] Parse da pergunta
- [ ] Busca de contexto relevante
- [ ] Geração de resposta
- [ ] Verificação de confiança

**Output:**
```json
{
  "type": "ask",
  "question": "...",
  "answer": "...",
  "confidence": 0.95,
  "sources": ["arquivo.pdf", "histórico"],
  "relatedTopics": [ ... ]
}
```

---

## 🔗 Integration Points

### 1. Endpoint `/ai/chat` Modifications
```javascript
// Current
router.post('/chat', async (req, res) => {
  const { content, userId, nexusId } = req.body;
  // Send to Ash...
});

// Should become
router.post('/chat', async (req, res) => {
  const { 
    content, 
    mode = 'chat',        // NEW
    files = [],           // NEW
    userId, 
    nexusId 
  } = req.body;
  
  // Get holistic context
  const holistic = await getHolisticContext(userId);
  
  // Build system prompt based on mode
  const systemPrompt = buildModePrompt(mode, holistic);
  
  // Add file context to messages
  const messages = buildMessages(content, files, systemPrompt);
  
  // Send to Ash with mode-specific instructions
  const response = await ash.chat(messages, { mode, files });
  
  // Process response based on mode
  const processed = processResponse(response, mode);
  
  // Save to database
  await saveChatMessage(processed);
  
  res.json(processed);
});
```

### 2. File Context Integration
```javascript
// Build file context string for system prompt
function buildFileContext(files) {
  return files.map(f => 
    `[Arquivo: ${f.name}]\n${f.preview}...\n[Conteúdo completo: ${f.content.slice(0, 2000)}...]`
  ).join('\n\n');
}

// Add to messages
const userMessage = `
${content}

${files.length > 0 ? buildFileContext(files) : ''}
`;
```

### 3. Database Changes (If needed)
```javascript
// Extend ChatMessages table
- mode: string (chat|plan|create|reflect|ask)
- attachedFiles: json (file metadata)
- artifacts: json (plan, ideas, insights, etc)
- linkedTasks: array (if mode=plan, create task_ids)
```

---

## 📝 Implementation Checklist

### Phase 3.1: System Prompts (Low Risk)
- [ ] Create prompt templates for each mode
- [ ] Test with different inputs
- [ ] Fine-tune based on Ash responses
- [ ] Document best practices

### Phase 3.2: File Context Integration
- [ ] Modify `/ai/chat` to accept files
- [ ] Build file context strings
- [ ] Add file content to message body
- [ ] Test with sample files

### Phase 3.3: Mode-Specific Processing
- [ ] Implement PLAN mode processing
- [ ] Implement CREATE mode processing
- [ ] Implement REFLECT mode processing
- [ ] Implement ASK mode processing
- [ ] Each mode returns structured response

### Phase 3.4: Database & Artifacts
- [ ] Extend ChatMessages schema
- [ ] Create artifacts table
- [ ] Link artifacts to messages
- [ ] Store mode-specific data

### Phase 3.5: Testing & Polish
- [ ] E2E testing (upload file → receive artifact)
- [ ] Mode switching validation
- [ ] Performance optimization
- [ ] Error handling

---

## 🧪 Test Cases

### Test 1: Chat Mode with File
```
Input:
- Mode: chat
- Content: "Como você analisa este arquivo?"
- File: documento.pdf (200KB)

Expected:
- Natural conversation response
- References the file content
- Provides insights
```

### Test 2: Plan Mode
```
Input:
- Mode: plan
- Content: "Planejar meu mês"
- File: goals.txt

Expected:
- Structured plan with tasks
- Timeline with dates
- Energy distribution
- Subtasks breakdown
```

### Test 3: Create Mode
```
Input:
- Mode: create
- Content: "Brainstorm novo produto"
- File: market_research.pdf

Expected:
- 10+ ideas
- Top idea detailed outline
- Next steps
- Feasibility scores
```

### Test 4: Reflect Mode
```
Input:
- Mode: reflect
- Content: "Análise profunda do que passei"
- File: diary_entries.txt

Expected:
- Holistic analysis
- Pattern recognition
- HD recommendations
- Development plan
```

### Test 5: Ask Mode
```
Input:
- Mode: ask
- Content: "Como implementar isso?"
- File: technical_docs.pdf

Expected:
- Direct answer
- References to file
- Confidence score
- Related topics
```

---

## ⚠️ Potential Challenges

1. **Token Limits**
   - Large files may exceed token limits
   - Solution: Chunk files, send summaries

2. **Mode Context Switching**
   - User switches mode mid-conversation
   - Solution: Save mode per message, provide warning

3. **File Processing Speed**
   - Large PDF extraction could be slow
   - Solution: Cache extracted content, use background workers

4. **Artifact Storage**
   - Structured responses need database schema
   - Solution: Use JSON storage, index important fields

---

## 📈 Success Metrics

- ✅ 5 modes return mode-appropriate responses
- ✅ Files used as context in responses
- ✅ Artifacts created and stored
- ✅ Response time < 2s for files < 5MB
- ✅ User finds mode-specific output helpful (survey)

---

## 🔄 Iteration Plan

1. **MVP** (Phase 3.1-3.2)
   - Basic file acceptance
   - Simple system prompts
   - No artifact storage

2. **v2** (Phase 3.3-3.4)
   - Mode-specific processing
   - Artifact creation
   - Database integration

3. **v3** (Phase 3.5+)
   - Fine-tuning based on feedback
   - Performance optimization
   - Advanced features (multi-file analysis, etc)

---

**Next:** User approval → Implementation of Phase 3.1


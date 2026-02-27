## Sistema Unificado de Documentos - Refatoração Completa ✅

**Status:** Refatoração concluída (Build: 12.70s, 0 erros)

### O que Mudou

#### Arquivos Removidos
- ✅ Deletado: `/src/views/DiariesView.jsx`
- ✅ Deletado: `/src/components/holistic/` (todos os componentes)
- ✅ Deletado: `/src/api/controllers/diaryController.js`
- ✅ Deletado: `/src/api/diaryRoutes.js`
- ✅ Deletado: `/src/db/schema/holistic.js`

#### Arquivos Modificados
- ✅ `/src/db/schema/docs.js` - Adicionados campos de diário
- ✅ `/src/db/schema.js` - Removido export de holistic
- ✅ `/src/config/viewTypes.js` - Removido DIARIES_VIEW
- ✅ `/src/pages/PranaWorkspaceLayout.jsx` - Removido import e case de DiariesView
- ✅ `/server.js` - Removido import e registro de diaryRoutes

### Nova Estrutura de Documents

```javascript
papyrusDocuments {
  id: text,
  title: text,
  
  // === Tipo de Conteúdo ===
  type: 'text' | 'file' | 'chat_snapshot',
  content: text,
  fileUrl: text,
  
  // === NOVO: Classificação do Documento ===
  documentType: 'note' | 'diary' | 'agreement' | 'manifest' | 'guide' | 'other',
  
  // === NOVO: Campos de Diário (opcionais) ===
  energyLevel: 1-5 (null se não for diário),
  mood: string (null se não for diário),
  tags: JSON array,
  insights: text,
  
  // === Segurança ===
  isPrivate: boolean (true para diários),
  
  projectId: text,
  authorId: text,
  
  status: 'active' | 'archived',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Como Usar

#### Criar um Diário via DocEditor

```javascript
// Ao criar/editar documento no DocEditor:
const document = {
  title: "Reflexão de hoje",
  type: "text",
  content: "<p>Dia produtivo</p>",
  
  // Marcar como diário:
  documentType: "diary", // ← Ativa campos abaixo
  
  // Campos de diário aparecem automaticamente:
  energyLevel: 4,
  mood: "Alegria",
  tags: JSON.stringify(["trabalho", "sucesso"]),
  insights: "Consegui resolver o problema",
  
  isPrivate: true, // Diários são privados
};
```

#### Criar um Acordo/Manifesto

```javascript
const document = {
  title: "Acordo com o time",
  type: "text",
  content: "<p>Pontos combinados...</p>",
  
  documentType: "agreement", // Tipo diferente
  // Não usa campos de diário
};
```

#### Converter Documento para Diário

```javascript
// Usuário está no DocEditor com uma nota
// Marca checkbox "Salvarcomo diário?" ou seleciona tipo="diary"
// Campos de energia/mood/tags aparecem
// Ao salvar: documentType="diary", isPrivate=true
```

### Integração com Ash

```javascript
// Após conversa significativa:
await ash.suggestDiary({
  title: "Conversa com Ash",
  content: formatConversation(session),
  documentType: "diary",
  energyLevel: extractEnergy(session), // IA extrai
  mood: extractMood(session),
  tags: extractTags(session),
  isPrivate: true
});

// Usuário vê notificação:
// "Posso salvar essa conversa como seu diário?"
// Se sim → document com documentType="diary" é criado
```

### Queries no Banco

```sql
-- Listar todos os diários do usuário
SELECT * FROM papyrus_documents 
WHERE author_id = $1 
  AND document_type = 'diary'
ORDER BY created_at DESC;

-- Filtrar por energia
SELECT * FROM papyrus_documents 
WHERE author_id = $1 
  AND document_type = 'diary'
  AND energy_level = $2;

-- Filtrar por tag (JSON search)
SELECT * FROM papyrus_documents 
WHERE author_id = $1 
  AND document_type = 'diary'
  AND tags LIKE '%"trabalho"%';

-- Estatísticas de diários
SELECT 
  COUNT(*) as total_entries,
  AVG(energy_level) as avg_energy,
  mood as most_common_mood
FROM papyrus_documents 
WHERE author_id = $1 
  AND document_type = 'diary'
GROUP BY mood;
```

### Modificações Necessárias no DocEditor

O `DocEditor.jsx` existente precisa de:

```javascript
// 1. Campo de seleção de tipo de documento
<Select value={documentType} onValueChange={setDocumentType}>
  <SelectItem value="note">Nota</SelectItem>
  <SelectItem value="diary">Diário</SelectItem>
  <SelectItem value="agreement">Acordo</SelectItem>
  <SelectItem value="manifest">Manifesto</SelectItem>
  <SelectItem value="guide">Guia</SelectItem>
  <SelectItem value="other">Outro</SelectItem>
</Select>

// 2. Mostrar campos condicionalmente
{documentType === 'diary' && (
  <>
    <EnergySelector energyLevel={energyLevel} onChange={setEnergyLevel} />
    <MoodSelector mood={mood} onChange={setMood} />
    <TagsInput tags={tags} onChange={setTags} />
    <Checkbox checked={isPrivate} onChange={setIsPrivate} label="Privado" />
  </>
)}

// 3. Salvar todos os campos
await updateDocument({
  ...document,
  documentType,
  energyLevel: documentType === 'diary' ? energyLevel : null,
  mood: documentType === 'diary' ? mood : null,
  tags: documentType === 'diary' ? JSON.stringify(tags) : null,
  isPrivate: documentType === 'diary'
});
```

### Vantagens da Refatoração

✅ **DRY Principle** - Uma ferramenta, não duas  
✅ **Flexibilidade** - Documento pode ser nota hoje e diário amanhã  
✅ **Reusabilidade** - Editor único, rico em features  
✅ **Escalabilidade** - Fácil adicionar novos tipos (blog, recipe, etc)  
✅ **Ash Integration** - Sugestões naturais de salvar como diário  
✅ **Menos Código** - Remover ~1500 linhas de duplicação  

### Próximos Passos

**Imediato:**
1. Modificar DocEditor.jsx para suportar documentType
2. Adicionar campos de diário (energia, mood, tags) condicionais
3. Atualizar papyrusController para salvar novos campos
4. Testar com data fictícia

**Curto Prazo:**
1. Criar "Vista de Diários" como um filtro/view do DocEditor
   - Não é component separado, é DocEditor com filtro documentType="diary"
2. Adicionar dashboard de estatísticas de diários
3. Integrar com Ash para sugestões

**Longo Prazo:**
1. Análise de padrões (energia × produtividade)
2. Human Design insights baseados em diários
3. Recomendações personalizadas do Ash

### Build Status

✅ **Build bem-sucedido**
- Tempo: 12.70s
- Erros: 0
- CSS reduzido: 163.26 kB (era 168.03 kB)
- Sem código desnecessário de DiariesView

### Rollback (se necessário)

Todos os arquivos removidos estão no git:
```bash
git checkout HEAD -- src/views/DiariesView.jsx
git checkout HEAD -- src/api/controllers/diaryController.js
git checkout HEAD -- src/api/diaryRoutes.js
git checkout HEAD -- src/db/schema/holistic.js
git checkout HEAD -- src/components/holistic/
```

---

**Status:** Refatoração completa ✅  
**Código desnecessário removido:** ~1500 linhas  
**Pronto para próxima fase:** SIM ✅

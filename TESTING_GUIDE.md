# 🧪 Testes - Migrações Entre Plataformas

## 1. CSV Import Test

### Prerequisites:
- Arquivo CSV com colunas: `title`, `description`, `status`, `priority`
- Exemplo:
  ```
  title,description,status,priority
  Task 1,Test task,todo,high
  Task 2,Another task,done,medium
  Task 3,Third task,todo,low
  ```

### Test Steps:

#### Step 1: Upload & Parse ✅
1. Vá para **Settings → Migrations**
2. Clique **Importar CSV** (card verde)
3. Upload do arquivo
4. **Expected**: Headers extraídos e listados

#### Step 2: Mapping ✅
1. Mapeie `title` → coluna "title"
2. Mapeie `description` → coluna "description"
3. Mapeie `status` → coluna "status"
4. Mapeie `priority` → coluna "priority"
5. **Expected**: Dropdowns funcionando

#### Step 2.5: Preview ✅
1. Clique "📋 Ver Prévia"
2. **Expected**:
   - Loader mostra enquanto carrega
   - Tabela com 3 primeiras linhas
   - Cada linha mostra: title, status, priority
   - Texto "Total: 3 items"
   - Se houver duplicatas: aviso amarelo

#### Step 3: Import ✅
1. Clique "Prosseguir"
2. **Expected**:
   - Barra de progresso aparece
   - Texto "Importando dados..."
   - Contador: "X de Y processados"
3. Após conclusão:
   - Status "Importação Concluída!"
   - Botão "Concluir" disponível

---

## 2. Notion Import Test

### Prerequisites:
- Account Notion com API integration criada
- Database com tasks
- Token API (`secret_...`)
- Database ID (da URL)

### Test Steps:

#### Step 1: Credenciais ✅
1. Vá para **Settings → Migrations**
2. Clique **Importar Notion** (card azul)
3. Insira token inválido propositalmente
4. Clique "🔗 Testar Conexão"
5. **Expected**: Aviso vermelho "❌ Token inválido"
6. Clique "Voltar"

#### Step 1: Credenciais (Válidas) ✅
1. Insira token **válido**
2. Insira **Database ID válido**
3. Clique "🔗 Testar Conexão"
4. **Expected**:
   - Loader desaparece
   - Feedback verde: "✅ Conexão validada com sucesso!"
   - Preview table aparece com até 5 tasks
   - Botão "Prosseguir com Importação" disponível

#### Step 1.5: Preview & Dedup ✅
1. Verifique preview:
   - Primeira coluna: "Título" (text)
   - Segunda coluna: "Status" (blue text)
   - Rodapé: "Total: X items"
2. **Expected**: Se tiver duplicata da sessão anterior, não haverá aviso (nova import)

#### Step 3: Import ✅
1. Clique "Prosseguir com Importação"
2. Aguarde conclusão
3. **Expected**: Toast com "✅ Importação concluída!"
4. Botão "Concluir" finaliza

---

## 3. Asana Import Test

### Prerequisites:
- Account Asana com Personal Access Token
- Project com tasks
- Token API (`0/...`)
- Project ID (da URL)

### Test Steps:

#### Step 1: Credenciais ✅
1. Vá para **Settings → Migrations**
2. Clique **Importar Asana** (card roxo)
3. Insira token inválido
4. Clique "🔗 Testar Conexão"
5. **Expected**: Aviso vermelho

#### Step 1: Credenciais (Válidas) ✅
1. Insira **token válido**
2. Insira **Project ID válido**
3. Clique "🔗 Testar Conexão"
4. **Expected**: 
   - Feedback verde
   - Preview table com 5 tasks
   - Coluna "Status" em roxo (cor Asana)

#### Step 3: Import ✅
1. Clique "Prosseguir"
2. Aguarde conclusão
3. **Expected**: Confirmação e stats

---

## 4. Duplicate Detection Test

### Setup:
1. Criar CSV com 2x mesma task:
   ```
   title,description
   Duplicated Task,This is duplicated
   Other Task,Different
   Duplicated Task,This is duplicated
   ```

### Test:
1. Upload CSV
2. Mapeie `title` e `description`
3. Clique "📋 Ver Prévia"
4. **Expected**: Aviso "⚠️ 1 item pode ser duplicata"
5. Clique "Prosseguir" mesmo assim
6. **Expected**: Import funciona, duplicata pulada

---

## 5. Error Scenarios Test

### CSV: Arquivo Inválido
1. Upload arquivo vazio
2. **Expected**: Erro "CSV vazio ou inválido"

### CSV: Nenhuma Coluna Mapeada
1. Upload válido
2. Não mapeie nenhuma coluna
3. Clique "Ver Prévia"
4. **Expected**: Erro "Por favor, mapeie a coluna de Título"

### Notion: Token Expirado
1. Insira token expirado
2. Clique "Testar Conexão"
3. **Expected**: Erro específico do Notion

### Asana: Project Não Encontrado
1. Insira project ID inválido
2. Clique "Testar Conexão"
3. **Expected**: Erro "Projeto não encontrado"

---

## 6. API Endpoint Test (cURL)

### CSV Validation
```bash
curl -X POST http://localhost:3000/api/import/validate/csv \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "csvData": [
      ["title", "status"],
      ["Task 1", "todo"]
    ]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "rowCount": 1,
  "headers": ["title", "status"]
}
```

### Duplicate Check
```bash
curl -X POST http://localhost:3000/api/import/check-duplicates \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "csvData": "[{\"title\":\"Task\",\"description\":\"Desc\"}]"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "duplicateCount": 0,
  "duplicates": []
}
```

### Notion Validation
```bash
curl -X POST http://localhost:3000/api/import/validate/notion \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "secret_...",
    "databaseId": "abc123..."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Conexão validada"
}
```

### Notion Preview
```bash
curl -X POST http://localhost:3000/api/import/preview/notion \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "secret_...",
    "databaseId": "abc123..."
  }'
```

**Expected Response:**
```json
{
  "data": {
    "preview": [
      {
        "id": "xxx",
        "title": "Task 1",
        "status": "todo"
      }
    ],
    "total": 42
  }
}
```

---

## 7. UX Flow Test

### CSV Full Flow
```
Upload CSV
  → Step 1 ✅
    ↓
Mapeie Colunas
  → Step 2 ✅
    ↓
Ver Prévia
  → Step 2.5 ✅
    ↓ (see preview + duplicates if any)
Prosseguir
  → Step 3 ✅ (progress bar)
    ↓
Concluir
  → Modal fecha ✅
```

### Notion Full Flow
```
Insira Credenciais
  → Step 1 ✅
    ↓
Testar Conexão
  → Step 1.5 ✅ (validation + preview)
    ↓
Prosseguir
  → Step 3 ✅ (progress bar)
    ↓
Concluir
  → Modal fecha ✅
```

---

## 8. Performance Test

### Measure Time:
1. **CSV**: 100-line file
   - Expected: < 5 seconds
2. **Notion**: 50-item database
   - Expected: < 10 seconds
3. **Asana**: 100-task project
   - Expected: < 15 seconds

### Memory:
- Watch browser DevTools
- Expected: No memory leaks

---

## 9. Accessibility Test

- [ ] Tab navigation works through all inputs
- [ ] Error messages are announced
- [ ] Buttons have proper aria-labels (se aplicável)
- [ ] Colors not the only indicator (also text)
- [ ] All text readable (contrast OK)

---

## 10. Cross-Browser Test

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## ✅ Test Completion Checklist

| Test | CSV | Notion | Asana | Status |
|------|-----|--------|-------|--------|
| Credentials | ✅ | ✅ | ✅ | |
| Validation | ✅ | ✅ | ✅ | |
| Preview | ✅ | ✅ | ✅ | |
| Duplicates | ✅ | N/A | N/A | |
| Error Cases | ✅ | ✅ | ✅ | |
| API Endpoints | ✅ | ✅ | ✅ | |
| UX Flow | ✅ | ✅ | ✅ | |
| Performance | ✅ | ✅ | ✅ | |

---

## 🚨 Known Issues / Notes

- [ ] History table não criada yet (função pronta apenas)
- [ ] Rate limit: 5 requests por minuto (ajustável)
- [ ] Hash dedup: Case-sensitive (title case matters)
- [ ] Preview limita a 5 items (by design, para perf)

---

**Last Updated**: Dezembro 2024  
**Test Environment**: Chrome 131.0 + localhost:5173  
**Status**: Ready for QA  

---

# 🧪 TODOs Implementation Testing Guide (Dec 18, 2025)

## 1️⃣ JWT/Session Validation Testing

### Manual Test
```bash
# With valid token
curl -H "Authorization: Bearer <valid_jwt>" http://localhost:5000/api/protected
# Expected: 200 OK with user data

# With invalid token
curl -H "Authorization: Bearer invalid_token" http://localhost:5000/api/protected
# Expected: 401 Unauthorized
```

## 2️⃣ File Unlinking Testing
1. Open TaskWorkspaceOverlay with linked file
2. Click "Desvincular" button
3. Expected: File disappears from list + success toast

## 3️⃣ Task Workspace Refresh Testing
1. Edit task in TaskWorkspaceOverlay
2. Click "Salvar"
3. Expected: Parent component updates via CustomEvent + success toast

## 4️⃣ Ritual Efficiency Calculation Testing
1. Create ritual with user
2. Create 10 tasks, complete 7
3. Call `/api/rituals/<id>/efficiency`
4. Expected: Returns ~0.7 (70%)

## 5️⃣ Email Sending Testing
1. Send team invite
2. Check Resend dashboard: https://resend.com/emails
3. Expected: Email sent with invite link

## 6️⃣ RAG Route Testing
```bash
curl -X POST http://localhost:5000/api/ai/rag \
  -H "Authorization: Bearer <token>" \
  -d '{"query": "meditação"}'
# Expected: { context: { documents: [...], rituals: [...], recentCheckIns: [...] } }
```

## 7️⃣ Mobile Navigation Testing
1. Open app on mobile device
2. Click menu → Settings
3. Expected: Navigate to /settings
4. Test Favorites, Recents, Logout similarly

## 8️⃣ Task Creation Toast Testing
1. Create new task
2. Expected: Green toast "Tarefa criada com sucesso!"

## 9️⃣ Push Notifications Token Testing
1. Allow notifications when prompted
2. Check console logs
3. Expected: "✅ Device token salvo no backend"
4. Verify in database: SELECT deviceToken FROM users WHERE id = 'user-id'

---

**Last Updated**: December 18, 2025
**Status**: All 9 TODOs implemented and ready for QA testing

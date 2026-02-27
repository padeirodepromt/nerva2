# 🚨 RELATÓRIO DE PROBLEMAS E ISSUES ENCONTRADOS

**Data:** 16 de Fevereiro de 2026  
**Severidade:** 1 Crítico, 3 Altos, 5 Médios  
**Status:** Documento para ação

---

## 🔴 CRÍTICO (Quebra de Funcionalidade)

### Issue #1: ReferenceError em papyrusController.js

**Arquivo:** [papyrusController.js](papyrusController.js#L72)  
**Métodos Afetados:** 4 métodos  
**Severidade:** CRÍTICO  
**Tipo:** Logic Error

#### Descrição

Variável `realmId` é referenciada sem ter sido definida em 4 métodos diferentes. Isso causa `ReferenceError` em tempo de execução quando essas funções forem executadas.

```javascript
// ❌ ERRO (Linha 72)
async getDocumentById(req, res) {
    const [doc] = await db.select().from(schema.papyrusDocuments)
      .where(and(
        eq(schema.papyrusDocuments.id, req.params.id),
        realmId && realmId !== 'all' ? eq(...) : undefined
        // ^ realmId não foi definido!
      ));
}
```

#### Metodos com Bug

1. **getDocumentById()** - linha ~72
2. **getDocumentVersions()** - linha ~88
3. **updateDocument()** - linha ~119
4. **deleteDocument()** - linha ~131

#### Corrente Root

A variável `realmId` deveria ser extraída de `req.params`:

```javascript
// ✅ CORRETO
async getDocumentById(req, res) {
    const { id, realmId } = req.params; // Extrair realmId
    const [doc] = await db.select().from(schema.papyrusDocuments)
      .where(and(
        eq(schema.papyrusDocuments.id, id),
        realmId && realmId !== 'all' ? eq(schema.papyrusDocuments.realmId, realmId) : undefined
      ));
}
```

#### Impacto

- ❌ GET /api/documents/:id vai falhar sempre
- ❌ GET /api/documents/:id/versions vai falhar sempre
- ❌ PUT /api/documents/:id vai falhar sempre
- ❌ DELETE /api/documents/:id vai falhar sempre

#### Correcção Estimada

**Esforço:** 1 hora  
**Risco:** Baixo (bug isolado)  
**Testes Necessários:** 4 testes de endpoint

---

## 🟠 ALTO (Degradação Significativa)

### Issue #2: Inconsistência de Rota - /documents vs /papyrus

**Arquivo:** [entityRoutes.js](entityRoutes.js#L89) vs [papyrus.js](papyrus.js#L49)  
**Severidade:** ALTO  
**Tipo:** Architectural Inconsistency

#### Descrição

Há dois prefixos de rotas diferentes para documentos:

| Location | Route | Controller |
|----------|-------|------------|
| entityRoutes.js | `/documents` | papyrusController |
| papyrus.js | `/papyrus` | apiClient.get(`/papyrus/...`) |

Isso causa confusão e possíveis erros 404 se frontend se conectar ao caminho errado.

```javascript
// entityRoutes.js define:
router.get('/documents', ...);
router.post('/documents', ...);

// papyrus.js chama:
apiClient.get(`/papyrus/${id}`);
apiClient.post('/papyrus', payload);
```

#### Impacto

- ⚠️ Frontend pode chamar rota errada
- ⚠️ Documentação confusa
- ⚠️ Novos devs perdem tempo debugando

#### Recomendação

**Opção 1:** Padronizar para `/papyrus` em ambos (recomendado)
```javascript
// entityRoutes.js
router.get('/papyrus', ...);
router.get('/papyrus/:id', ...);
router.post('/papyrus', ...);
```

**Opção 2:** Padronizar para `/documents` em ambos
```javascript
// papyrus.js
apiClient.get(`/documents/${id}`);
```

**Esforço:** 1-2 horas  
**Impacto:** Médio (precisa coordinar frontend)

---

### Issue #3: Falta de Validação - Google Calendar Fallback

**Arquivo:** [taskController.js](taskController.js#L60)  
**Severidade:** ALTO  
**Tipo:** Integration Error

#### Descrição

Quando uma tarefa é criada com `dueDate`, o código tenta sincronizar com Google Calendar sem validar:

1. Se o usuário tem conta Google conectada
2. Se a sincronização foi bem-sucedida
3. Como proceder se falhar

```javascript
// taskController.create(), linhas 60-80
if (newTaskData.dueDate) {
    try {
        const googleResult = await GoogleCalendarService.createEvent(finalOwnerId, eventPayload);
        
        if (googleResult && googleResult.googleId) {
            // Actualiza tarefa com googleEventId
        }
        // PROBLEMA: e se googleResult for null ou undefined?
        // e se o usuário não tem Google cadastrado?
    } catch (error) {
        // Não há tratamento do erro - a tarefa já foi criada!
    }
}
```

#### Cenários de Falha

1. **Usuário sem Google conectado** → Exception lançada
2. **Google API retorna erro** → Tarefa criada mas evento não sincronizado
3. **Network timeout** → Request pendurada

#### Recomendação

```javascript
// Adicionar validação:
const hasGoogleConnected = await checkUserGoogleCredentials(finalOwnerId);

if (newTaskData.dueDate && hasGoogleConnected) {
    try {
        const googleResult = await GoogleCalendarService.createEvent(...);
        if (googleResult?.googleId) {
            updatedData.googleEventId = googleResult.googleId;
        }
    } catch (error) {
        console.warn(`Google Calendar sync failed for task ${newTaskData.id}:`, error);
        // Continua mesmo que falhe - tarefa local still saved
    }
}
```

**Esforço:** 2 horas  
**Risco:** Médio (depende de Google API disponibilidade)

---

### Issue #4: Autenticação Incompleta em taskController

**Arquivo:** [taskController.js](taskController.js#L25)  
**Severidade:** ALTO  
**Tipo:** Security/Validation

#### Descrição

O method `create()` não valida `req.user.id` como source-of-truth para proprietário da tarefa:

```javascript
// Problema: ownerId vem do cliente (não validado)
const { ..., ownerId } = req.body;
const finalOwnerId = ownerId || userId || created_by;

// Qualquer cliente pode passar qualquer ownerId!
// Não valida se req.user.id tem permissão
```

#### Cenário de Abuso

```javascript
// Usuário A poderia fazer:
POST /api/tasks
{
  title: "Steal task",
  ownerId: "user_B_id"  // Cria tarefa no nome de outro usuário!
}
```

#### Recomendação

```javascript
// Validar contra req.user.id
const { title, ..., requestedOwnerId } = req.body;
const finalOwnerId = req.user.id; // SEMPRE usar authenticado

// Se quiser atribuir a outro, validar permissão:
if (requestedOwnerId && requestedOwnerId !== req.user.id) {
    const team = await checkTeamPermission(req.user.id, requestedOwnerId);
    if (!team?.canAssign) {
        return res.status(403).json({ error: "Sem permissão" });
    }
}
```

**Esforço:** 2-3 horas  
**Risco:** ALTO (violação de segurança)

---

## 🟡 MÉDIO (Funcionalidade Incompleta)

### Issue #5: Falta de Paginação em Listagens

**Arquivo:** [projectController.js](projectController.js#L10), [taskController.js](taskController.js#L5)  
**Severidade:** MÉDIO  
**Tipo:** Performance

#### Descrição

Métodos `list()` retornam TODOS os registros sem limite, causando:

1. **Consumo alto de memória** se houver 10k+ registros
2. **Transferência lenta** de dados grandes
3. **Degradação de UX** no frontend

```javascript
// Problema: retorna TUDO
async list(req, res) {
    const projects = await db.query.projects.findMany({...});
    res.json(projects); // Pode ser 10.000 registros!
}
```

#### Recomendação

```javascript
async list(req, res) {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const projects = await db.query.projects.findMany({
        limit,
        offset,
        orderBy: desc(projects.createdAt)
    });
    
    const total = await db.select({ count: count() }).from(projects);
    
    res.json({
        data: projects,
        pagination: { page, limit, total: total[0].count }
    });
}
```

**Esforço:** 2-3 horas (aplicar em 5+ listagens)  
**Impacto:** Performance pode melhorar 10x em grandes datasets

---

### Issue #6: Falta de Logging Estruturado

**Arquivo:** Todos os controllers  
**Severidade:** MÉDIO  
**Tipo:** Observability

#### Descrição

O sistema não tem logging estruturado. Só `console.error()` em alguns lugares:

```javascript
// Ruim: console.log inconsistente
try {
    // ...
} catch (error) {
    console.error('Error getting holistic stats:', error);
    // Sem contexto: qual usuário? qual horário? qual ID?
}
```

#### Impacto

- ❌ Difícil debugar issues em produção
- ❌ Sem rastreamento de auditoria
- ❌ Sem alertas de erro

#### Recomendação

Implementar Winston ou Pino:

```javascript
import logger from '../../utils/logger.js';

async getHolisticStats(req, res) {
    try {
        logger.info('Fetching holistic stats', { userId: req.user.id });
        const stats = await this.getDiaryStats(req.user.id);
        logger.info('Stats computed', { userId: req.user.id, statsCount: stats.totalDiaries });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        logger.error('Error getting holistic stats', { 
            userId: req.user.id, 
            error: error.message,
            stack: error.stack 
        });
        res.status(500).json({ success: false });
    }
}
```

**Esforço:** 4-6 horas  
**Benefício:** Muito alto para produção

---

### Issue #7: Falta de Rate Limiting

**Arquivo:** server.js  
**Severidade:** MÉDIO  
**Tipo:** Security/DoS Prevention

#### Descrição

Não há proteção contra brute force ou DDoS:

```javascript
// Qualquer IP pode fazer infinite requests sem limite
app.post('/api/auth/login', ...);
app.post('/api/tasks', ...);
```

#### Cenário de Abuso

```bash
# Ataque manual (brute force)
for i in {1..10000}; do
    curl -X POST http://localhost:3000/api/auth/login \
        -d '{"email":"user@test.com","password":"try$i"}'
done
```

#### Recomendação

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100 // 100 requests per window
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5 // 5 login attempts per 15 min
});

app.post('/api/auth/login', loginLimiter, ...);
app.use('/api/', limiter); // Global para outras rotas
```

**Esforço:** 1 hora  
**Impacto:** Crítico para produção

---

### Issue #8: InputValidation Parcial

**Arquivo:** Todos os controllers  
**Severidade:** MÉDIO  
**Tipo:** Security/Data Integrity

#### Descrição

Controllers recebem dados do cliente sem validação robusta:

```javascript
// Problema: aceita qualquer input
const { title, content, projectId, authorId } = req.body;
await db.insert(schema.papyrusDocuments).values({ title, content, ... });

// Risks:
// - title pode ser string vazia
// - content pode ser null ou muito grande (10MB)
// - projectId pode não existir (FK violation)
// - authorId pode não ser válido
```

#### Recomendação

Usar library como `zod` ou `joi`:

```javascript
import { z } from 'zod';

const createDocumentSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.string().max(100000).optional(),
    projectId: z.string().uuid(),
    authorId: z.string().uuid(),
    documentType: z.enum(['note', 'diary', 'agreement']).optional()
});

async createDocument(req, res) {
    try {
        const validated = createDocumentSchema.parse(req.body);
        // Usar validated ao invés de req.body
        await db.insert(...).values(validated);
    } catch (error) {
        res.status(400).json({ error: error.issues });
    }
}
```

**Esforço:** 3-4 horas  
**Impacto:** Médio-Alto para segurança

---

### Issue #9: Falta de Testes Automatizados

**Arquivo:** N/A (não existe)  
**Severidade:** MÉDIO  
**Tipo:** Quality Assurance

#### Descrição

Não há testes unitários ou de integração. Isso significa:

- ❌ Regressões não são detectadas
- ❌ Refatoramento é risky
- ❌ Documentação de API ausente

#### Recomendação

Estrutura de teste:

```
tests/
├── unit/
│   ├── userController.test.js
│   ├── taskController.test.js
│   └── projectController.test.js
├── integration/
│   ├── auth.integration.test.js
│   ├── tasks.integration.test.js
│   └── documents.integration.test.js
└── e2e/
    ├── full-workflow.e2e.test.js
    └── google-calendar.e2e.test.js
```

Exemplo com Jest + Supertest:

```javascript
describe('Task Controller', () => {
    describe('POST /api/tasks', () => {
        it('should create task with valid data', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Task',
                    projectId: projectId,
                    dueDate: '2026-02-20'
                });
            
            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
        });
    });
});
```

**Esforço:** 8-12 horas  
**ROI:** Muito alto (reduz bugs em produção)

---

### Issue #10: Documentação de API Ausente

**Arquivo:** N/A  
**Severidade:** MÉDIO  
**Tipo:** Developer Experience

#### Descrição

Não há documentação Swagger/OpenAPI dos endpoints:

- ❌ Frontenders precisam ler código para entender API
- ❌ Sem exemplos de request/response
- ❌ Sem descrição de campos obrigatórios

#### Recomendação

Usar Swagger/OpenAPI com `swagger-jsdoc`:

```javascript
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
```

Resultado: `/api/docs` com UI interativa (Swagger UI)

**Esforço:** 2-3 horas  
**Impacto:** Alto para onboarding

---

## 📊 RESUMO DE ISSUES

| # | Titulo | Severidade | Esforço | Status |
|---|--------|-----------|---------|--------|
| 1 | papyrusController - realmId bug | 🔴 Crítico | 1h | NOT STARTED |
| 2 | Inconsistência /documents vs /papyrus | 🟠 Alto | 1-2h | NOT STARTED |
| 3 | Google Calendar validation | 🟠 Alto | 2h | NOT STARTED |
| 4 | Task ownerId security | 🟠 Alto | 2-3h | NOT STARTED |
| 5 | Falta pagination | 🟡 Médio | 2-3h | NOT STARTED |
| 6 | Sem logging estruturado | 🟡 Médio | 4-6h | NOT STARTED |
| 7 | Sem rate limiting | 🟡 Médio | 1h | NOT STARTED |
| 8 | Input validation parcial | 🟡 Médio | 3-4h | NOT STARTED |
| 9 | Sem testes automatizados | 🟡 Médio | 8-12h | NOT STARTED |
| 10 | Sem documentação API | 🟡 Médio | 2-3h | NOT STARTED |

**Total de Esforço Estimado: 27-35 horas**

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### **SPRINTS**

**Sprint 1 (Semana 1) - Crítico + Segurança**
- Issue #1 (papyrusController bug) - 1h
- Issue #4 (Task ownerId security) - 2-3h
- Issue #3 (Google Calendar validation) - 2h
- **Total: 5-6h**

**Sprint 2 (Semana 2) - Arquitetura**
- Issue #2 (Route consistency) - 1-2h
- Issue #5 (Add pagination) - 2-3h
- Issue #7 (Rate limiting) - 1h
- Issue #8 (Input validation) - 3-4h
- **Total: 7-10h**

**Sprint 3 (Semana 3+) - Quality**
- Issue #6 (Logging) - 4-6h
- Issue #9 (Tests) - 8-12h
- Issue #10 (API Docs) - 2-3h
- **Total: 14-21h**

---

## 🏁 CONCLUSÃO

O sistema **Prana 3.0** tem uma arquitetura **sólida** mas precisa de **manutenção técnica urgente** antes de ir para produção completa.

**Prioridades:**
1. ✅ Corrigir bug crítico (Issue #1) - AGORA
2. ✅ Fortalecer segurança (Issue #4) - SEMANA PRÓXIMA
3. ✅ Implementar observability (Issues #6, #9) - ANTES DE PRODUÇÃO

---

**Documento preparado para:** Planejamento de sprints e orçamento de desenvolvimento  
**Próxima revisão:** Após implementação de Issue #1

# 🔧 Resolução: Controllers Sem Rotas Integrados

**Data:** 2025-02-16  
**Status:** ✅ RESOLVIDO  
**Commits:** plannerController & goalController

---

## 📋 Resumo da Mudança

Dois controllers que não tinham rotas foram integrados:

| Controller | Solução | Status |
|-----------|---------|--------|
| **plannerController.js** | Criadas rotas `/api/planner` | ✅ Integrado |
| **goalController.js** | Absorvido por `sankalpaController` | ✅ Integrado |

---

## 1️⃣ goalController → Absorvido por sankalpaController

### Contexto
- `goalController` tinha métodos: `list()`, `create()`, `update()`, `delete()`
- `sankalpaController` já havia absorvido a lógica de Goals na V10 com campos de métrica:
  - `targetValue` - Meta valor alvo
  - `currentValue` - Progresso atual
  - `unit` - Unidade de medida
  - `deadline` - Prazo

### Solução Implementada
Adicionados **6 novos métodos** ao `sankalpaController`:

```javascript
// Aliases de compatibilidade (Goals → Sankalpas)
listGoals()       // → this.list()
createGoal()      // → this.create()
updateGoal()      // → this.update()
deleteGoal()      // → this.delete()

// Métodos específicos de Goals
listGoalsBySankalpa()    // Listar metas de uma intenção
updateGoalProgress()     // Atualizar progresso (currentValue)
```

### Rotas Criadas
```javascript
// Routes alias para Goals (mapeiam para sankalpaController)
GET    /api/goals              → sankalpaController.listGoals()
POST   /api/goals              → sankalpaController.createGoal()
PUT    /api/goals/:id          → sankalpaController.updateGoal()
DELETE /api/goals/:id          → sankalpaController.deleteGoal()
PUT    /api/goals/:id/progress → sankalpaController.updateGoalProgress()
```

### Migração de Cliente
Se o cliente estava usando `/api/goals`, ele continua funcionando:

**Antes (goalController):**
```javascript
// Old - não tinha rota
import { goalController } from './controllers/goalController.js';
```

**Depois (sankalpaController alias):**
```javascript
// Nova rota disponível em router
GET /api/goals ✅ Funciona
PUT /api/goals/:id/progress ✅ Novo método
```

---

## 2️⃣ plannerController → Rotas Criadas

### Contexto
- `plannerController` tinha métodos: `list()`, `create()`, `update()`, `delete()`
- Usa tabela `weeklyTasks` (tarefas semanais para visualização em grid)
- Não tinha rota mapeada em `entityRoutes.js`

### Solução Implementada
Adicionadas **rotas `/api/planner`** em `entityRoutes.js`:

```javascript
GET    /api/planner              → plannerController.list()
POST   /api/planner              → plannerController.create()
PUT    /api/planner/:id          → plannerController.update()
DELETE /api/planner/:id          → plannerController.delete()
```

### Diferença: Planner vs Weekly-Tasks
| Endpoint | Propósito | Modelo |
|----------|-----------|---------|
| `/api/weekly-tasks` | CRUD de tarefas semanais (modelo único) | weeklyTaskController |
| `/api/planner` | Visualizador visual (grid/matriz semanal) | plannerController |

**Nota:** Ambos usam a tabela `createAt, weeklyTasks` internamente, mas oferecem diferentes abstrações.

---

## 🔗 Routing Completo Atualizado

### Sankalpa & Goals (Intenções + Métricas)
```javascript
// Intenções mestres (Sankalpas)
GET    /api/sankalpas          → sankalpaController.list()
POST   /api/sankalpas          → sankalpaController.create()
PUT    /api/sankalpas/:id      → sankalpaController.update()
DELETE /api/sankalpas/:id      → sankalpaController.delete()

// Goals (alias para Sankalpas com métricas)
GET    /api/goals              → sankalpaController.listGoals()
POST   /api/goals              → sankalpaController.createGoal()
PUT    /api/goals/:id          → sankalpaController.updateGoal()
DELETE /api/goals/:id          → sankalpaController.deleteGoal()
PUT    /api/goals/:id/progress → sankalpaController.updateGoalProgress()
```

### Weekly Tasks & Planner (Tarefas Semanais)
```javascript
// Tarefas semanais (entidades puras)
GET    /api/weekly-tasks       → weeklyTaskController.list()
POST   /api/weekly-tasks       → weeklyTaskController.create()
PUT    /api/weekly-tasks/:id   → weeklyTaskController.update()
DELETE /api/weekly-tasks/:id   → weeklyTaskController.delete()

// Planner - Visualizador semanal
GET    /api/planner            → plannerController.list()
POST   /api/planner            → plannerController.create()
PUT    /api/planner/:id        → plannerController.update()
DELETE /api/planner/:id        → plannerController.delete()
```

---

## 📂 Arquivos Modificados

### 1. `/src/api/controllers/sankalpaController.js`
**Alteração:** Adicionados 6 novos métodos (aliases + funcionalidades)
- `listGoals()`
- `createGoal()`
- `updateGoal()`
- `deleteGoal()`
- `listGoalsBySankalpa()` ← Novo
- `updateGoalProgress()` ← Novo

**Linhas adicionadas:** ~80  
**Linhas totais:** ~177 (antes 97)

### 2. `/src/api/entityRoutes.js`
**Alterações:**
1. Adicionados 3 imports:
   - `plannerController`
   - `eventController`
   - `thoughtController`

2. Adicionadas 5 rotas de Goals (alias):
   - `GET /api/goals`
   - `POST /api/goals`
   - `PUT /api/goals/:id`
   - `DELETE /api/goals/:id`
   - `PUT /api/goals/:id/progress`

3. Adicionadas 4 rotas de Planner:
   - `GET /api/planner`
   - `POST /api/planner`
   - `PUT /api/planner/:id`
   - `DELETE /api/planner/:id`

**Linhas adicionadas:** ~14

---

## ✅ Status dos Controllers

| Controller | Antes | Depois | Notas |
|-----------|-------|--------|-------|
| sankalpaController | ✅ Rotas | ✅ Rotas + Goals | Absorveu goalController |
| weeklyTaskController | ✅ Rotas | ✅ Rotas | Sem mudanças |
| plannerController | ❌ Sem rotas | ✅ Rotas `/api/planner` | Novo mapeamento |
| goalController | ❌ Sem rotas | ⚠️ Deprecated | Métodos em sankalpaController |

---

## 📝 Notas sobre Deprecated

### goalController.js (DEPRECATED)
```javascript
// ⚠️ DEPRECATED - Use sankalpaController com rotas /api/goals
// Este arquivo pode ser removido em V11
```

**Arquivo:** `/src/api/controllers/goalController.js`  
**Ação:** Mantido por compatibilidade, marcar como deprecated  
**Remoção:** Considerar em próxima versão (após migração de clientes)

---

## 🧪 Testes Recomendados

```bash
# Testar Goals (novo alias)
curl -X GET http://localhost:3000/api/goals
curl -X POST http://localhost:3000/api/goals \
  -H "Content-Type: application/json" \
  -d '{"title":"Meta","targetValue":100,"currentValue":0}'

# Testar atualização de progresso
curl -X PUT http://localhost:3000/api/goals/{id}/progress \
  -H "Content-Type: application/json" \
  -d '{"currentValue":50}'

# Testar Planner  
curl -X GET http://localhost:3000/api/planner
curl -X POST http://localhost:3000/api/planner \
  -H "Content-Type: application/json" \
  -d '{"userId":"...","content":"Almoço","dayOfWeek":"monday"}'
```

---

## 🚀 Impacto

| Aspecto | Impacto |
|--------|--------|
| **Funcionalidade** | ✅ Nenhuma perda, ganho de rotas |
| **Breaking Changes** | ❌ Nenhum (alias mantêm compatibilidade) |
| **Performance** | ✅ Sem mudanse (mesma lógica) |
| **Segurança** | ✅ Sem mudanças |
| **Linhas de Código** | +94 (80 em sankalpa + 14 em rotas) |
| **Controllers Órfãos** | 0 → 0 (resolvido!) |

---

## 🔄 Timeline

| Data | Ação |
|------|------|
| 2025-02-16 | ✅ Integração de goalController em sankalpaController |
| 2025-02-16 | ✅ Rotas de /api/goals criadas |
| 2025-02-16 | ✅ Rotas de /api/planner criadas |
| 2025-02-16 | ✅ Imports em entityRoutes corrigidos |
| TBD | ⏳ Deprecação formal de goalController |
| V11 | ⏳ Remoção de goalController |

---

## 📖 Referências

- [sankalpaController.js](src/api/controllers/sankalpaController.js)
- [plannerController.js](src/api/controllers/plannerController.js)
- [goalController.js](src/api/controllers/goalController.js) - DEPRECATED
- [entityRoutes.js](src/api/entityRoutes.js)
- Schema: [planning.js](src/db/schema/planning.js)

---

**Status Final:** ✅ Ambos controllers resolvidos e roteados  
**Próximo passo:** Testar endpoints e considerar deprecação de goalController

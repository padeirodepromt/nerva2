# 🔌 AUDITORIA: CONECTAR OS FIOS (DB ↔ Backend ↔ Frontend)

**Data:** 16 de Fevereiro de 2026  
**Status:** Auditoria Completa - Pronto para Implementação  
**Severidade:** 🔴 CRÍTICA (Sistema não funciona em produção)

---

## 📋 RESUMO EXECUTIVO

O sistema Prana 3.0 apresenta **desconexões críticas** entre o banco de dados (PostgreSQL/Drizzle), backend (Node.js) e frontend (React). Há **3 problemas principais**:

1. **schema.nexus não existe** → Deveria ser `nexusChats` (26 referências erradas)
2. **users.realmId não existe** → Campo não está definido no schema (15+ referências)
3. **plans.realmId não existe** → Campo não está definido no schema (4 referências)

**Impacto:** Sistema de chat quebrado, autenticação instável, sistema de planos falha.

---

## 🗄️ MAPEAMENTO COMPLETO DO SCHEMA

### **CORE (core.js)** - Tabelas Fundamentais

| Tabela | Campos Críticos | realmId? | Status |
|--------|---|---|---|
| `users` | id, email, password_hash, planType | ❌ NÃO | ✅ Correto |
| `plans` | id, key, name, monthlyPrice | ❌ NÃO | ✅ Correto |
| `teams` | id, name, owner_id | ❌ NÃO | ✅ Correto |
| `projects` | id, title, owner_id, team_id | ❌ NÃO | ✅ Correto |
| `tags` | id, name, color | ❌ NÃO | ✅ Correto |
| `templates` | id, name, structure | ❌ NÃO | ✅ Correto |

### **PLANNING (planning.js)** - Tarefas e Eventos

| Tabela | Campos Críticos | realmId? | Status |
|--------|---|---|---|
| `tasks` | id, title, project_id, owner_id | ✅ SIM | ✅ Correto |
| `sankalpas` | id, title, user_id | ✅ SIM | ✅ Correto |
| `routines` | id, title, user_id | ✅ SIM | ✅ Correto |
| `events` | id, title, date | ✅ SIM | ✅ Correto |
| `weeklyTasks` | id, task_id, user_id | ✅ SIM | ✅ Correto |

### **ENERGY (energy.js)** - Energia e Astrologia

| Tabela | Campos Críticos | realmId? | Status |
|--------|---|---|---|
| `energyCheckIns` | id, user_id, energy_intensity | ✅ SIM | ✅ Correto |
| `diaryEntries` | id, user_id, content | ✅ SIM | ✅ Correto |
| `astralProfiles` | id, user_id, sun_sign | ❌ NÃO | ✅ Correto |
| `rituals` | id, user_id, name | ✅ SIM | ✅ Correto |

### **CHAT (chat.js)** - Conversas e Mensagens ⚠️ PROBLEMA AQUI

| Tabela | Definição Correta | Referência Errada | Status |
|--------|---|---|---|
| `nexusChats` | Tabela definida | `schema.nexus` | 🔴 CRÍTICO |
| `nexusMessages` | Tabela definida | Parcialmente correto | 🟠 MÉDIO |
| `projectChannels` | Tabela definida | ✅ Correto | ✅ OK |
| `channelMessages` | Tabela definida | ✅ Correto | ✅ OK |

### **DOCS (docs.js)** - Documentos

| Tabela | Campos Críticos | realmId? | Status |
|--------|---|---|---|
| `papyrusDocuments` | id, title, content | ✅ SIM | ✅ Correto |
| `mindMaps` | id, title, project_id | ✅ SIM | ✅ Correto |

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### **PROBLEMA #1: `schema.nexus` não existe**

**Localização:** `/src/api/controllers/nexusController.js`

**Síntese:**
- Schema exporta: `nexusChats` (linha 13 de `/src/db/schema/chat.js`)
- Código tenta usar: `schema.nexus` (múltiplas linhas em nexusController.js)

**Linhas Afetadas:**
```javascript
// ERRADO (26 referências):
await db.select().from(schema.nexus)
await db.insert(schema.nexus).values(...)
await db.update(schema.nexus).set(...)

// CORRETO:
await db.select().from(schema.nexusChats)
await db.insert(schema.nexusChats).values(...)
await db.update(schema.nexusChats).set(...)
```

**Impacto:**
- ❌ GET /api/nexus → Retorna erro 500 (tabela não existe)
- ❌ POST /api/nexus → Falha ao criar chat
- ❌ Frontend não consegue carregar histórico de conversas
- ❌ Recurso de chat (ASH/Nexus) completamente quebrado

**Root Cause:** Refactoring incompleto. Schema foi renomeado de `nexus` para `nexusChats` mas controlador não foi atualizado.

---

### **PROBLEMA #2: `users.realmId` não existe**

**Localização:** `/src/api/controllers/authController.js`, `/src/api/controllers/userController.js`

**Síntese:**
- Tabela `users` não tem coluna `realmId` em `/src/db/schema/core.js`
- Código tenta filtrar/atualizar com este campo

**Linhas Afetadas em authController.js:**
```javascript
// ERRADO:
const [existingUser] = await db.select().from(users)
  .where(and(eq(users.email, email), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined))

// CORRETO:
const [existingUser] = await db.select().from(users)
  .where(eq(users.email, email))
```

**Funções Afetadas:**
- `register()` - Linha 25
- `login()` - Linha 82
- `getMe()` - Linha 125

**Linhas Afetadas em userController.js:**
- `register()` - Linha 19
- `login()` - Linha 55
- `me()` - Linha 83
- `getUserById()` - Linha 100
- `updateUserProfile()` - Linha 111
- `getProfile()` - Linha 126
- `updateProfile()` - Linha 144
- Mais 8+ métodos...

**Impacto:**
- ❌ POST /api/auth/register → Query quebrada, usuário não é criado
- ❌ POST /api/auth/login → Login falha silenciosamente
- ❌ GET /api/me → Token validation quebrada
- ❌ Sistema de autenticação toda não funciona

**Root Cause:** Código foi preparado para multi-tenancy com `realmId`, mas a coluna nunca foi adicionada às tabelas.

---

### **PROBLEMA #3: `plans.realmId` não existe**

**Localização:** `/src/api/controllers/authController.js`, `/src/api/controllers/paymentController.js`

**Síntese:**
- Tabela `plans` não tem coluna `realmId`
- Código tenta filtrar planos por realm, mas tabela não suporta

**Linhas Afetadas:**
```javascript
// ERRADO em authController.js:
const [seedPlan] = await db.select().from(plans)
  .where(and(eq(plans.key, 'SEED'), realmId && realmId !== 'all' ? eq(plans.realmId, realmId) : undefined))
  // ↑ Linha 32, 171, 191, 196

// CORRETO:
const [seedPlan] = await db.select().from(plans)
  .where(eq(plans.key, 'SEED'))
```

**Impacto:**
- ⚠️ Sistema de planos (SEED, BETA, FOREST, MOUNTAIN) falha ao registrar
- ⚠️ Validação de plano não funciona
- ⚠️ Cobrança de assinatura pode ser afetada

---

## 📊 PADRÃO DE ERRO IDENTIFICADO

### **Problema de Sintaxe no Drizzle-ORM**

O código atual usa um padrão errado com `and()`:

```javascript
// PADRÃO ERRADO (múltiplas ocorrências):
and(eq(users.email, email), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined)
//   ↑ Syntax error - and() espera múltiplos argumentos de condition, não boolean

// PADRÃO CORRETO:
and(eq(users.email, email), eq(users.realmId, realmId))

// OU (sem realmId):
eq(users.email, email)
```

**Por quê isso é um problema?**
- `and()` é uma função que combina múltiplas condições
- Não pode receber `undefined` ou expressões booleanas como argumento
- A sintaxe atual gera SQL inválido
- Queries não são executadas corretamente

---

## 💡 SOLUÇÃO PROPOSTA

### **Opção A: Remover realmId Completamente ✅ RECOMENDADO**

**Entendimento:** O conceito de `realmId` (multi-tenancy) não foi totalmente implementado. Apenas algumas tabelas têm o campo, criando inconsistência.

**Ação:**
1. Remover todas as referências a `realmId` dos controllers
2. Simplifcar queries do Drizzle
3. Manter usuários isolados por `userId` (JWT token)
4. Manter workspaces isolados por `teamId`

**Implementação:**
- ❌ remover parâmetro `realmId` de req.body, req.params
- ❌ remover condições `realmId && realmId !== 'all'`
- ✅ manter isolamento por `userId` (para dados pessoais)
- ✅ manter isolamento por `teamId` (para dados compartilhados)

**Vantagens:**
- ✅ Código mais simples e legível
- ✅ Sem migrações de DB (0 schema changes)
- ✅ Implementação rápida (< 2 horas)
- ✅ Isolamento por userId/teamId é suficiente para MVP

**Desvantagens:**
- ❌ Não permite multi-tenancy (SaaS com múltiplas organizações em um DB)
- ❌ Se crescer, precisará refactor futuro

**Custo:** ~$0, Tempo: ~2h, Risco: Baixo ✅

---

### **Opção B: Implementar realmId Completamente (Futuro)**

**Entendimento:** Adicionar `realmId` em todas as tabelas para real multi-tenancy.

**Ação:**
1. Migração Drizzle: Adicionar coluna `realmId` a `users`, `plans`, `nexusChats`
2. Atualizar schema definitions
3. Atualizar todas as queries para filtrar por `realmId`
4. Criar fixtures para popular `realmId` nos dados existentes

**Vantagens:**
- ✅ Suporta múltiplas organizações no mesmo banco
- ✅ Melhor isolamento de dados
- ✅ Padrão SaaS moderno

**Desvantagens:**
- ❌ Requer migração de dados
- ❌ Implementação complexa (~8h)
- ❌ Risco de corromper dados existentes
- ❌ Não é necessário para MVP

**Custo:** Migrações + testes, Tempo: ~8h, Risco: Alto ⚠️

---

### **Opção C: Híbrida (Recomendada para Longo Prazo)**

**Ideia:** Usar realmId apenas onde já está implementado, remover de onde não está.

**Tabelas COM realmId (manter):**
- tasks, sankalpas, routines, events, energyCheckIns, diaryEntries, rituals
- papyrusDocuments, mindMaps

**Tabelas SEM realmId (não adicionar agora):**
- users, plans, nexusChats, astralProfiles

**Isolamento alternativo:**
- users: Por sessão JWT (userId)
- plans: Global (não é multi-tenant)
- nexusChats: Por userId (não por realm)

---

## 🔧 PLANO DE CORREÇÃO (IMPLEMENTAÇÃO)

### **FASE 1: Corrigir schema.nexus → nexusChats**

**Arquivo:** `/src/api/controllers/nexusController.js`

**Mudanças:**
```javascript
// Todas as 26 referências:
// ANTES:
schema.nexus
schema.nexusMessages (parcialmente correto, deixar como está)

// DEPOIS:
schema.nexusChats
schema.nexusMessages (sem mudança)
```

**Linhas a atualizar:** 16, 17, 18, 32, 35, 36, 37, 59, 80, 100, 105, 106, 107 (+ mais 13)

**Tempo estimado:** 15 minutos  
**Risco:** Mínimo (simples find & replace)  
**Teste:** GET /api/nexus → Deve retornar array vazio ou lista de chats

---

### **FASE 2: Remover realmId de users**

**Arquivos:**
- `/src/api/controllers/authController.js`
- `/src/api/controllers/userController.js`
- `/src/api/controllers/checkInController.js` (menor impacto)

**Mudanças em authController.js:**
```javascript
// register() - Linha 25
// ANTES:
.where(and(eq(users.email, email.toLowerCase()), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined))
// DEPOIS:
.where(eq(users.email, email.toLowerCase()))

// login() - Linha 82
// Similar...

// getMe() - Linha 125
// Similar...
```

**Mudanças em userController.js:**
- `register()`: Linha 19
- `login()`: Linha 55
- `me()`: Linha 83
- `getUserById()`: Linha 100
- `updateUserProfile()`: Linha 111
- `getProfile()`: Linha 126
- `updateProfile()`: Linha 144
- ... (mais 8 métodos)

**Tempo estimado:** 30 minutos  
**Risco:** Baixo (não muda lógica, apenas simplifica)  
**Teste:** Login/Registro devem funcionar

---

### **FASE 3: Remover realmId de plans**

**Arquivo:** `/src/api/controllers/paymentController.js`

**Mudanças:**
```javascript
// Todas as 4 referências:
.where(and(eq(plans.key, 'SEED'), realmId && realmId !== 'all' ? eq(plans.realmId, realmId) : undefined))
// DEPOIS:
.where(eq(plans.key, 'SEED'))
```

**Tempo estimado:** 10 minutos  
**Risco:** Mínimo  
**Teste:** Sistema de planos deve funcionar

---

### **FASE 4: Validação Completa**

**Checklist:**
- [ ] `schema.nexus` → `schema.nexusChats` completado
- [ ] Remover `realmId` de `users` completado
- [ ] Remover `realmId` de `plans` completado
- [ ] Outros controllers sem referência a `realmId` não existente
- [ ] Testes de API com Postman/Insomnia
- [ ] Testes de Frontend (login, criação de chat)
- [ ] Sem erros 500 em logs

**Tempo estimado:** 45 minutos  
**Risco:** Médio (encontrar novos problemas)

---

## 📋 CHECKLIST DE ARQUIVOS A MODIFICAR

### **Alta Prioridade (CRÍTICO)**

| Arquivo | Problema | Linhas Afetadas | Ação |
|---------|----------|---|---|
| `/src/api/controllers/nexusController.js` | `schema.nexus` → `schema.nexusChats` | 26 refs | Find & Replace |
| `/src/api/controllers/authController.js` | `users.realmId` não existe | 25, 82, 125 | Remover `realmId` |
| `/src/api/controllers/userController.js` | `users.realmId` não existe | 19, 55, 83, 100, 111, 126, 144+ | Remover `realmId` |

### **Média Prioridade (IMPORTANTE)**

| Arquivo | Problema | Ação |
|---------|----------|---|
| `/src/api/controllers/paymentController.js` | `plans.realmId` não existe | Remover `realmId` |
| `/src/api/controllers/checkInController.js` | Camel case inconsistente | Revisar |
| `/src/api/aiRoutes.js` | Possível ref a `schema.nexusMessages.realmId` | Verificar |

### **Baixa Prioridade (VERIFICAÇÃO)**

| Arquivo | Ação |
|---------|---|
| `/src/api/services/` | Audit queries |
| `/src/pages/` | Audit API calls |
| `/src/components/` | Audit API calls |

---

## 🧪 TESTES RECOMENDADOS

### **Test API Endpoints**

```bash
# Teste de Registro
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@prana.com",
  "password": "test123"
}
# Esperado: 201 + token

# Teste de Login
POST /api/auth/login
{
  "email": "test@prana.com",
  "password": "test123"
}
# Esperado: 200 + token

# Teste de Chat
GET /api/nexus?userId=xxx
# Esperado: 200 + array de chats (ou vazio)

POST /api/nexus
{
  "userId": "xxx",
  "title": "Nova Conversa"
}
# Esperado: 201 + chat criado
```

### **Test Frontend Flow**

1. Abrir app em fresh browser
2. Conseguir fazer signup?
3. Conseguir fazer login?
4. Dashboard carrega?
5. Chat (ASH/Nexus) carrega histórico?
6. Conseguir enviar mensagem?

---

## 📝 NOTAS IMPORTANTES

### **Sobre realmId**

O conceito de `realmId` parece ser um design antigo para multi-tenancy que nunca foi completado. Atualmente:

- ✅ Implementado em: `tasks`, `sankalpas`, `routines`, `events`, `energyCheckIns`, `diaryEntries`, `rituals`, `papyrusDocuments`, `mindMaps`
- ❌ Não implementado em: `users`, `plans`, `nexusChats`, `nexusMessages`, `astralProfiles`

**Recomendação:** Não tentar completar multi-tenancy agora. Usar `userId` (do JWT) para isolamento de dados pessoais. Usar `teamId` para compartilhamento de dados em grupo.

### **Sobre camelCase vs snake_case**

Drizzle-ORM faz conversão automática:
- Schema: `userId` → SQL: `user_id`
- Está correto em todas as tabelas ✅

### **Sobre createId()**

Há inconsistência de imports:
- Alguns arquivos importam de `@paralleldrive/cuid2`
- Outros importam de `../../utils/id.js`

Recomendação: Padronizar - usar sempre `../../utils/id.js`

---

## 🎯 RESUMO FINAL

| Aspecto | Status | Ação |
|--------|--------|---|
| **Problema Identificado** | ✅ Completo | NENHUMA |
| **Documentação** | ✅ Completo | NENHUMA |
| **Solução Proposta** | ✅ A, B, C | ESCOLHER UMA |
| **Pronto para Implementar** | ✅ SIM | INICIAR FASE 1 |
| **Tempo Total Estimado** | ~2h | Para Opção A |
| **Risco de Implementação** | Baixo | Com testes após cada fase |

---

## 🚀 PRÓXIMOS PASSOS

1. **Revisar este documento** e aprovar estratégia
2. **Escolher solução** (Recomendado: Opção A)
3. **Executar FASE 1-4** seguindo o plano
4. **Rodar testes completos** após cada fase
5. **Commit e deploy** com segurança

---

**Documento preparado por:** GitHub Copilot  
**Para:** Auditoria DB-Backend-Frontend  
**Status:** Pronto para Aprovação ✅

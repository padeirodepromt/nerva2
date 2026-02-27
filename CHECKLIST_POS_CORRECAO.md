# ✅ CHECKLIST PÓS-CORREÇÃO

**Data:** 16 de Fevereiro de 2026  
**Atualizado:** 100%  

---

## 🚀 CHECKLIST DE IMPLEMENTAÇÃO

### FASE 1: Preparação (Agora)
- [x] Corrigido Bug Crítico #1 (papyrusController realmId)
- [x] Corrigido Issue #4 (Task ownerId security)
- [x] Corrigido Issue #2 (Rotas /documents→/papyrus)
- [x] Implementado Issue #7 (Rate limiting)
- [x] Implementado Issue #8 (Input validation)
- [x] Adicionada dependência express-rate-limit
- [x] Documentação completa criada

### FASE 2: Instalação (Próximo Passo)
- [ ] Execute `npm install` para instalar express-rate-limit
- [ ] Verifique se não há conflitos de dependências
- [ ] Atualize lock file (package-lock.json)

```bash
# Instalar nova dependência
npm install

# Verificar instalação
npm list express-rate-limit
# Esperado: express-rate-limit@7.1.5
```

### FASE 3: Teste Local (Antes de Deploy)
- [ ] Inicie servidor local: `npm run dev`
- [ ] Teste Endpoint 1: `curl http://localhost:3000/api/health`
- [ ] Execute Teste 1: [Criar Documento (CRÍTICO)](#teste-1-criar-documento)
- [ ] Execute Teste 2: [Task Ownership (SECURITY)](#teste-2-task-ownership)
- [ ] Execute Teste 3: [Validação Input (VALIDATION)](#teste-3-validação-input)
- [ ] Execute Teste 4: [Rate Limiting (SECURITY)](#teste-4-rate-limiting)
- [ ] Execute Teste 5: [Rota Padronizada (ROUTING)](#teste-5-rota-padronizada)

### FASE 4: Code Review
- [ ] Revisar mudanças em papyrusController.js
- [ ] Revisar mudanças em taskController.js
- [ ] Revisar mudanças em entityRoutes.js
- [ ] Revisar mudanças em server.js
- [ ] Revisar mudanças em package.json
- [ ] Aprovar rate limiting strategy
- [ ] Aprovar validation rules

### FASE 5: Deploy Staging
- [ ] Merge para branch staging
- [ ] Deploy para staging environment
- [ ] Monitorar logs de error
- [ ] Verificar rate limit behavior
- [ ] Fazer testes de integração
- [ ] Performance testing (se necessário)

### FASE 6: Deploy Production
- [ ] Tag release (ex: v1.2.5)
- [ ] Criar release notes (baseado em RELATORIO_CORRECOES_APLICADAS.md)
- [ ] Deploy para production
- [ ] Monitorar alertas
- [ ] Verificar métricas (response times, error rates)
- [ ] Comunicar com stakeholders

---

## 🧪 TESTES DETALHADOS

### Teste 1: Criar Documento (CRÍTICO)
```bash
#!/bin/bash
# Teste de criação de documento - Antes falhava com ReferenceError

TOKEN="seu_token_jwt_aqui"
AUTHOR_ID="user_123"

curl -X POST http://localhost:3000/api/papyrus \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Documento de Teste",
    "content": "Este é um documento de teste",
    "authorId": "'$AUTHOR_ID'",
    "documentType": "note",
    "realmId": "personal"
  }' | jq .

# ✅ Esperado: Retorna 201 com documento criado
# ❌ Antes: ReferenceError: realmId is not defined
```

### Teste 2: Task Ownership (SECURITY)
```bash
#!/bin/bash
# Teste de segurança - Validar que ownerId vem de req.user

TOKEN_A="token_usuario_A"
TOKEN_B="token_usuario_B"
USER_B_ID="user_B_123"

# Usuário A tenta criar tarefa atribuída a Usuário B
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarefa Suspeita",
    "ownerId": "'$USER_B_ID'",
    "projectId": "proj_123"
  }' | jq .

# ✅ Esperado: ownerId na resposta é USER_A (não USER_B)
# ❌ Antes: ownerId seria USER_B (vulnerability)
```

### Teste 3: Validação Input (VALIDATION)
```bash
#!/bin/bash
# Teste de validação - Rejeitar títulos vazios

TOKEN="seu_token_jwt_aqui"

# Tentar criar tarefa sem título
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "projectId": "proj_123"
  }' | jq .

# ✅ Esperado: 400 Bad Request com mensagem de erro
# ❌ Antes: Aceita e cria tarefa com título vazio
```

### Teste 4: Rate Limiting (SECURITY)
```bash
#!/bin/bash
# Teste de rate limiting - Proteção contra brute force

# Tentar fazer 6 login attempts rapidamente
for i in {1..6}; do
  echo "Tentativa $i..."
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "attacker@test.com",
      "password": "wrong_password"
    }' | jq '.error' 
  
  # Pausa entre requests
  if [ $i -lt 6 ]; then
    sleep 1
  fi
done

# ✅ Esperado:
# - Requests 1-5: 401 Unauthorized
# - Request 6: 429 Too Many Requests
# ❌ Antes: Todas aceitadas (no rate limit)
```

### Teste 5: Rota Padronizada (ROUTING)
```bash
#!/bin/bash
# Teste de rotas padronizadas - /papyrus em vez de /documents

DOC_ID="doc_123"
TOKEN="seu_token_jwt_aqui"
REALM="personal"

# Testar GET /api/papyrus/:id (novo padrão)
curl -X GET "http://localhost:3000/api/papyrus/$DOC_ID?realmId=$REALM" \
  -H "Authorization: Bearer $TOKEN" | jq .

# ✅ Esperado: Retorna documento (200)
# ❌ Antes: 404 Not Found (rota /documents não mapeada)

# Testar versões com nova rota
curl -X GET "http://localhost:3000/api/papyrus/$DOC_ID/versions?realmId=$REALM" \
  -H "Authorization: Bearer $TOKEN" | jq .

# ✅ Esperado: Retorna array de versões
```

---

## 📊 VERIFICAÇÃO DE DEPLOYMENT

### Antes de Fazer Deploy

```bash
# 1. Verificar erros de linting
npm run lint

# 2. Verificar build
npm run build

# 3. Verificar código está commitado
git status

# 4. Verificar branch está atualizado
git pull origin main

# 5. Executar testes (se existirem)
npm test

# 6. Build de produção
npm run build
```

### Depois de Deploy

```bash
# 1. Verificar saúde do servidor
curl https://seu-dominio.com/api/health

# 2. Verificar logs de erro
tail -f ./logs/error.log

# 3. Monitorar rate limiting
grep "rate limit" ./logs/*.log

# 4. Verificar uptime
curl -I https://seu-dominio.com/api/papyrus/test

# 5. Monitorar performance
# Use ferramentas como New Relic, DataDog, etc
```

---

## 🔍 SINAIS DE ALERTA

### Monitorar Estes Eventos

| Evento | Severidade | Ação |
|--------|-----------|------|
| ReferenceError em papyrus | 🔴 CRÍTICO | Rollback imediato |
| Rate limit muito alto | 🟠 ALTO | Investigar DDoS |
| Muitas validações rejeitadas | 🟡 MÉDIO | Revisar lógica |
| Task ownerId incorreto | 🔴 CRÍTICO | Rollback imediato |
| DocumentNotFound errors | 🟡 MÉDIO | Verificar rotas |

---

## 📞 ESCALAÇÃO

### Se houver problemas durante testes:

1. **Bug em papyrusController**
   - [ ] Verificar /workspaces/prana3.0/src/api/controllers/papyrusController.js
   - [ ] Checar linha 18, 36, 71, 128
   - [ ] Consultar RELATORIO_CORRECOES_APLICADAS.md

2. **Bug em taskController**
   - [ ] Verificar /workspaces/prana3.0/src/api/controllers/taskController.js
   - [ ] Checar validações de ownerId
   - [ ] Consultar RELATORIO_CORRECOES_APLICADAS.md

3. **Rate limiting não funciona**
   - [ ] Verificar se express-rate-limit está instalado: `npm list express-rate-limit`
   - [ ] Verificar server.js linhas 68-80
   - [ ] Testar com Teste 4 acima

4. **Rotas retornam 404**
   - [ ] Verificar se rotas foram atualizadas para /papyrus
   - [ ] Checar entityRoutes.js linhas 103-108
   - [ ] Testar GET /api/papyrus (lista)
   - [ ] Testar GET /api/papyrus/:id (detalhe)

---

## 📝 LOG DE MUDANÇAS

### Histórico de Commits (Sugerido)

```git commit -m "fix: Corrigir ReferenceError em papyrusController

- Extrair realmId de req.params em getDocumentById
- Extrair realmId de req.params em getDocumentVersions
- Corrigir duplicação de realmId em updateDocument
- Extrair realmId de req.params em deleteDocument

Fixes #1 (CRÍTICO)"

git commit -m "feat: Implementar rate limiting para proteção

- Rate limit global: 100 req/15min
- Rate limit login: 5 tentativas/15min
- Adiciona express-rate-limit como dependência

Fixes #7 (MÉDIO)"

git commit -m "feat: Adicionar validação de input em controllers

- Validar título (obrigatório, 1-255 chars)
- Validar status e priority (enums)
- Validar estimatedHours (número positivo)
- Melhorar mensagens de erro

Fixes #8 (MÉDIO)"

git commit -m "fix: Padronizar rotas de documentos para /papyrus

- Renomear GET /documents → GET /papyrus
- Renomear POST /documents → POST /papyrus
- Renomear PUT /documents/:id → PUT /papyrus/:id
- Renomear DELETE /documents/:id → DELETE /papyrus/:id
- Adicionar GET /papyrus/:id/versions

Fixes #2 (ALTO)"

git commit -m "fix: Corrigir segurança de task ownership

- Usar req.user.id como source-of-truth
- Rejeitar ownerId do cliente
- Retornar 401 se não autenticado

Fixes #4 (ALTO)"
```

---

## 🎯 KPIs para Monitorar Após Deploy

| KPI | Target | Crítico | Alertar |
|-----|--------|---------|---------|
| Error Rate (5xx) | < 0.1% | > 1% | > 0.5% |
| Rate Limit Hits | < 10/hora | > 100/hora | > 50/hora |
| Login Success Rate | > 99% | < 95% | < 98% |
| API Response Time | < 100ms | > 500ms | > 200ms |
| Database Errors | 0 | > 5 | > 2 |

---

## 🚦 STATUS DE READINESS

| Item | Status | Responsável |
|------|--------|-------------|
| Código corrigido | ✅ DONE | Dev Team |
| Testes manuais | ⏳ TODO | QA |
| Code review | ⏳ TODO | Senior Dev |
| Teste staging | ⏳ TODO | QA |
| Aprovação produção | ⏳ TODO | Product Lead |
| Deploy produção | ⏳ TODO | DevOps |
| Monitoramento | ⏳ TODO | DevOps |

---

## 📋 ASSINATURA DIGITAL

```
Correções Implementadas por: GitHub Copilot
Data: 16 de Fevereiro de 2026
Arquivos Modificados: 5
Issues Resolvidas: 5/10 (50%)
Status: PRONTO PARA TESTES

Aprovação Requerida POR:
- [ ] Code Review Lead
- [ ] QA Lead  
- [ ] DevOps Lead
- [ ] Product Owner
```

---

**Sistema pronto para próxima fase: Testes & Validação** 🚀

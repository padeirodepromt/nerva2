# 🔧 Análise de Imports Quebrados - Prana 3.0

**Data da Análise:** 26 de fevereiro de 2026  
**Arquivos Processados:** 654  
**Imports Quebrados Encontrados:** 21

---

## 📋 Resumo Executivo

Foram identificados **21 imports que apontam para caminhos inexistentes**. A maioria dos problemas está relacionada a:

1. **Imports com caminho relativo incorreto** (4 casos)
2. **Imports @ alias que não existem** (10 casos)
3. **Imports relativos mal formatados em testes** (4 casos)
4. **Imports em arquivos de documentação/guia** (2 casos)

---

## 🔴 Detalhamento Completo dos Imports Quebrados

### 1. /OLLY_GUIA_VISUAL_CODIGO.js
**Tipo:** Arquivo de guia/documentação (não é código executável)

| Import Quebrado | Caminho Esperado | Status |
|---|---|---|
| `import ... from './App'` | `/App` | ❌ Arquivo não existe em raiz |

**Ação Sugerida:** Este arquivo é apenas documentação. Se usar código real, corrigir para `'./src/App.jsx'`

---

### 2. /OLLY_QUICK_START.js
**Tipo:** Arquivo de guia/documentação

| Import Quebrado | Caminho Esperado | Status |
|---|---|---|
| `import ... from './App'` | `/App` | ❌ Arquivo não existe em raiz |

**Ação Sugerida:** Mesmo que acima - arquivo de guia. Corrigir para referência real se necessário.

---

### 3. /src/agents/agentCollaboration.js
**Tipo:** Código de agente

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import { isAgentEnabledForPlan } from '@/config/agentPersonas'` | `/src/config/agentPersonas` | Verificar se arquivo existe em `src/config/` |
| `import { isAgentEnabledForPlan } from '@/api/services/taskService'` | `/src/api/services/taskService` | ⚠️ **ARQUIVO NÃO EXISTE** |

**Ação Necessária:** 
- Criar `/src/api/services/taskService.js` OU
- Remover este import se não for necessário

---

### 4. /src/api/agents/general/tools/integrationTools.js
**Tipo:** Ferramentas de agente

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import ... from '../../../../services/emailService.js'` | `/src/services/emailService.js` | ⚠️ **ARQUIVO NÃO EXISTE** |

**Ação Necessária:**
- Criar `/src/api/services/emailService.js` OU
- Ajustar para caminho relativo correto se existir em outro lugar

---

### 5. /src/api/controllers/agentController.js
**Tipo:** Controlador de API

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import ... from '../services/billing/billingService.js'` | `/src/api/services/billing/billingService.js` | ⚠️ **NÃO ENCONTRADO** |
| `import ... from '../services/modelsService.js'` | `/src/api/services/modelsService.js` | ⚠️ **NÃO ENCONTRADO** |
| `import ... from '../services/agentLogService.js'` | `/src/api/services/agentLogService.js` | ⚠️ **NÃO ENCONTRADO** |

**Ação Necessária:** Criar os arquivos de serviço ou remover imports não utilizados.

---

### 6. /src/components/admin/PlansControlPanel.jsx
**Tipo:** Componente React

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import ... from '../config/userPlanSettings'` | `/src/components/config/userPlanSettings` | ⚠️ **CONFIG NÃO EXISTE** |
| `import ... from '../config/featuresList'` | `/src/components/config/featuresList` | ⚠️ **CONFIG NÃO EXISTE** |

**Ação Necessária:** Criar arquivos de configuração ou importar de local correto.

---

### 7. /src/components/chat/AgentSelector.jsx
**Tipo:** Componente React

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import ... from '@/hooks/useProjectSystems'` | `/src/hooks/useProjectSystems` | ⚠️ **HOOK NÃO EXISTE** |

**Ação Necessária:** Criar hook customizado ou usar import existente.

---

### 8. /src/components/layout/MainStage.jsx
**Tipo:** Componente React (layout)

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import ... from '@/components/layout/TabBar'` | `/src/components/layout/TabBar` | ⚠️ **COMPONENTE NÃO EXISTE** |

**Ação Necessária:** Criar `TabBar.jsx` ou importar componente similar existente.

---

### 9. /src/components/specialists/flor-creator/ContextTuningBar.jsx
**Tipo:** Componente especialista

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import ... from '@/components/icons/PranaIcons'` | `/src/components/icons/PranaIcons` | ⚠️ **NÃO ENCONTRADO** |

**Ação Necessária:** Verificar se existe `PranaLandscapeIcons` ou integração de ícones.

---

### 10. /src/services/olly/OllySystemIntegration.js
**Tipo:** Serviço de integração Olly

| Import Quebrado | Caminho Esperado | Solução |
|---|---|---|
| `import ... from '@/lib/db'` | `/src/lib/db` | ⚠️ database wrapper NÃO EXISTE |
| `import ... from '@/lib/schema'` | `/src/lib/schema` | ⚠️ schema NÃO EXISTE em `/src/lib/` |

**Ação Necessária:** Usar `/src/db/index.js` e `/src/db/schema.js` em vez disso.

---

### 11-15. Testes com Imports Inválidos
**Localização:** `/tests/` diretório

| Arquivo | Import Quebrado | Solução |
|---|---|---|
| `apiClient.test.js` | `'../src/components/ui/use-toast.js'` | Ajustar caminho relativo |
| `customFieldController.test.js` | `'../../src/api/controllers/customFieldController.js'` | Ajustar para `../src/...` |
| `customFieldUtils.test.js` | `'../src/ai_services/utils/customFieldUtils.js'` | Verificar se arquivo existe |
| `projectController.test.js` | `'../../src/api/controllers/projectController.js'` | Ajustar caminho |
| `taskController.test.js` | `'../../src/api/controllers/taskController.js'` | Ajustar caminho |
| `userController.test.js` | `'../../src/api/controllers/userController.js'` | Ajustar caminho |

**Ação Necessária:** Todos os arquivos de teste usam `../../src/` mas deveriam usar `../` ou `../src/`.

---

## 📊 Análise Crítica

### Problemas por Severidade

**🔴 CRÍTICOS (Vão quebrar a build Vite):**
1. `@/api/services/taskService` - Falta arquivo de serviço
2. `@/api/services/billing/billingService.js` - Falta arquivo de faturamento
3. `@/api/services/modelsService.js` - Falta arquivo de modelos
4. `@/api/services/agentLogService.js` - Falta arquivo de logs
5. `@/hooks/useProjectSystems` - Falta hook customizado
6. `@/components/layout/TabBar` - Falta componente TabBar
7. Todos os caminhos de teste com `../../src/`

**⚠️ MODERADOS (Podem quebrar durante runtime):**
1. `@/lib/db` e `@/lib/schema` - Devem usar `/src/db/` como source
2. `@/components/config/*` - Imports de configuração que não existem
3. `@/components/icons/PranaIcons` - Icionografia não mapeada corretamente

**ℹ️ INFORMATIVOS (Código de documentação):**
1. OLLY_GUIA_VISUAL_CODIGO.js - Arquivo de guia
2. OLLY_QUICK_START.js - Arquivo de documentação

---

## ✅ Recomendações de Correção

1. **Criar arquivos faltando em `/src/api/services/`:**
   - `taskService.js`
   - `billing/billingService.js`
   - `modelsService.js`
   - `agentLogService.js`
   - `emailService.js`

2. **Criar componentes e hooks faltando:**
   - `/src/components/layout/TabBar.jsx`
   - `/src/hooks/useProjectSystems.js`
   - `/src/components/config/userPlanSettings.js`
   - `/src/components/config/featuresList.js`

3. **Corrigir imports em testes** - Mudar `../../src/` para `../src/`

4. **Atualizar serviço Olly** - Usar `/src/db/` em vez de `/src/lib/`

5. **Revisar aliases de iconografia** - Consolidar `PranaIcons` vs `PranaLandscapeIcons`

---

## 🔍 Como Reproduzir a Análise

```bash
node find-broken-imports.mjs
```

Este script:
- Analisa toda a pasta `/src/` recursivamente
- Resolve aliases `@/` para `/src/`
- Verifica imports relativos `./` e `../`
- Reporta qualquer import que aponte para arquivo inexistente

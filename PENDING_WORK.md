# 📋 Trabalho Pendente - Prana 3.0

**Status Geral:** 5 problemas críticos de UI ✅ RESOLVIDOS | Múltiplos TODOs identificados ⏳ PENDENTES

---

## 🔴 Crítico (UI Issues - COMPLETADO)

Todos os 5 problemas de renderização reportados foram **RESOLVIDOS**:

| # | Issue | Status | Commit |
|---|-------|--------|--------|
| 1 | MindMap não renderizava | ✅ FIXED | 9f13cea |
| 2 | Inbox ícone errado | ✅ FIXED | 8100714 |
| 3 | TeamsView vazio | ✅ FIXED | ffac077 |
| 4 | Planner não renderiza | ✅ FIXED | ffac077 |
| 5 | Navegação com views errados | ✅ FIXED | 27cd6f2 |

---

## 🟡 Alto Impacto (Features Incompletas)

### 1. **Ritual Efficiency Calculation** 📊
**Arquivo:** [src/ai_services/ritualDetectionService.js](src/ai_services/ritualDetectionService.js#L343)  
**Problema:** TODO comentário em linha 343  
**Descrição:** Cálculo de eficiência de rituais está usando `efficiencyScore` como proxy ao invés de calcular baseado em task completion real

```javascript
// ATUAL (Línea 343)
// TODO: Implementar cálculo baseado em task completion
return ritual[0].efficiencyScore || 0.5;
```

**O que fazer:**
- Buscar tasks completadas pelo usuário
- Calcular percentage de tasks completadas quando ritual está ativo
- Usar isso como base para eficiência real

**Impacto:** Sistema de recomendação de rituais pode sugerir rituais que não estão sendo efetivos

---

### 2. **Task Workspace Overlay Refresh** 🔄
**Arquivo:** [src/components/tasks/TaskWorkspaceOverlay.jsx](src/components/tasks/TaskWorkspaceOverlay.jsx#L126)  
**Problema:** TODO em linha 126  
**Descrição:** Ao salvar tarefa, não há refresh do parent component

```javascript
// ATUAL (Línea 126)
onSave={() => {}} // TODO: Implementar refresh do parent
```

**O que fazer:**
- Implementar callback que trigger refresh dos dados da tarefa no parent
- Poderia usar event listener (`window.postMessage`) ou callback via props
- Usar toast de sucesso para confirmar

**Impacto:** Mudanças em tarefa não refletem imediatamente na lista/grid

---

### 3. **File Unlinking from Tasks** 🔗
**Arquivo:** [src/components/tasks/TaskWorkspaceOverlay.jsx](src/components/tasks/TaskWorkspaceOverlay.jsx#L173)  
**Problema:** TODO em linha 173  
**Descrição:** Botão "Desvincular" não faz nada, precisa chamada de API

```javascript
// ATUAL (Línea 173)
onClick={() => {
    // TODO: Desvincular arquivo
    toast.success('Arquivo desvinculado');
}}
```

**O que fazer:**
- Chamar API `FileTaskAssociationAPI.unlinkFileFromTask()`
- Remover arquivo da lista renderizada
- Confirmar com toast

**Impacto:** Usuário não consegue desvincular arquivos de tarefas

**API Disponível:** `FileTaskAssociationAPI.unlinkFileFromTask(associationId)`

---

## 🟠 Médio Impacto (Infrastructure)

### 4. **Email Sending - Real Implementation** 📧
**Arquivo:** [src/api/controllers/teamController.js](src/api/controllers/teamController.js#L63)  
**Problema:** TODO em linha 63  
**Descrição:** Convites de equipe não enviam email real

```javascript
// ATUAL (Línea 63)
// TODO: Enviar email real (SendGrid/Resend)
```

**O que fazer:**
- Integrar SendGrid OU Resend
- Enviar email quando `Team.inviteMember()` é chamado
- Template de email com link de aceitar convite

**Impacto:** Médio - Equipes podem ser criadas mas convites não chegam por email

**Alternativa:** Deixar como mock (usuários aceitam na UI)

---

### 5. **JWT/Session Validation** 🔐
**Arquivo:** [src/api/auth/middleware.js](src/api/auth/middleware.js#L10)  
**Problema:** TODO em linha 10  
**Descrição:** Autenticação está usando `x-user-email` header inseguro

```javascript
// ATUAL (Línea 10)
// TODO: Implement proper JWT/session validation
const email = req.headers['x-user-email'] || req.session?.user?.email || null;
```

**O que fazer:**
- Implementar JWT validation real (verificar assinatura)
- OU usar sessions com secret cookies
- Validar em middleware global

**Impacto:** Alto em produção - Segurança comprometida

**Prioridade:** ⚠️ ANTES DE DEPLOY PARA PRODUÇÃO

---

### 6. **RAG Route for AI** 🤖
**Arquivo:** [src/api/aiRoutes.js](src/api/aiRoutes.js#L95)  
**Problema:** TODO em linha 95  
**Descrição:** Rota para RAG (Retrieval-Augmented Generation) não está implementada

```javascript
// ATUAL (Línea 95)
// TODO: Adicionar rota para RAG
```

**O que fazer:**
- Implementar endpoint `/api/ai/rag`
- Buscar documentos relevantes do usuário
- Aumentar prompt do Ash com contexto

**Impacto:** Baixo - Feature avançada, não crítica

---

## 🔵 Baixo Impacto (UX Polishing)

### 7. **Mobile Navigation** 📱
**Arquivo:** [src/components/mobile/ResponsiveLayout.jsx](src/components/mobile/ResponsiveLayout.jsx#L36-L50)  
**Problemas:** 4 TODOs nas linhas 36, 39, 42, 50  
**Descrição:** Mobile menu não tem implementação completa

```javascript
// ATUAL (Líneas 36-50)
// TODO: Navegar para settings
// TODO: Mostrar favoritos
// TODO: Mostrar recentes
// TODO: Implementar logout
```

**O que fazer:**
- Ligar botões do mobile menu a funcionalidades reais
- Implementar Settings page para mobile
- Favorites/Recents podem mostrar items recentes

**Impacto:** Baixo - Mobile é secundário

---

### 8. **Task Creation Notification** 🔔
**Arquivo:** [src/hooks/useTaskData.jsx](src/hooks/useTaskData.jsx#L100)  
**Problema:** TODO em linha 100  
**Descrição:** Ao criar tarefa, não há confirmação visual

```javascript
// ATUAL (Línea 100)
// TODO: Adicionar notificação de sucesso (toast)
```

**O que fazer:**
- Chamar `toast.success('Tarefa criada com sucesso')`
- Considerar adicionar action "desfazer"

**Impacto:** Muito baixo - UX mínima

---

### 9. **Push Notifications Setup** 📲
**Arquivo:** [src/hooks/useNotifications.js](src/hooks/useNotifications.js#L36)  
**Problema:** TODO em linha 36  
**Descrição:** Token de push notifications não é enviado para backend

```javascript
// ATUAL (Línea 36)
// TODO: Enviar token para backend para salvar no perfil do usuário
```

**O que fazer:**
- Pegar token de push do browser
- Enviar para backend via API
- Salvar no perfil do usuário
- Usar para enviar notificações reais

**Impacto:** Baixo - Feature avançada

---

### 10. **Dashboard Header Spacing** 📐
**Descrito em:** UI Fixes conversation  
**Problema:** Header do Dashboard é muito grande  
**Status:** Pode ser intencional (design para "Santuário")

**Verificação Necessária:**
- Confirmar se é design intencional
- Se não: reduzir tamanho do ícone/espaçamento
- Manter consistência com outros views

---

## 📊 Resumo de Prioridades

```
┌─────────────────────────────────────────────┐
│ 🔴 CRÍTICA (deve fazer antes de deploy)    │
├─────────────────────────────────────────────┤
│ 1. JWT/Session validation                   │
│                                             │
├─────────────────────────────────────────────┤
│ 🟠 ALTA (importante para funcionalidade)   │
├─────────────────────────────────────────────┤
│ 1. Ritual efficiency calculation            │
│ 2. File unlinking API call                  │
│ 3. Task workspace refresh                   │
│                                             │
├─────────────────────────────────────────────┤
│ 🟡 MÉDIA (nice-to-have, mas útil)         │
├─────────────────────────────────────────────┤
│ 1. Email sending real                       │
│ 2. RAG route implementation                 │
│                                             │
├─────────────────────────────────────────────┤
│ 🔵 BAIXA (polishing, pode deixar depois)   │
├─────────────────────────────────────────────┤
│ 1. Mobile navigation                        │
│ 2. Task creation notification               │
│ 3. Push notifications                       │
│ 4. Dashboard header review                  │
└─────────────────────────────────────────────┘
```

---

## 🎯 Recomendações

### Para Deploy Imediato (Hoje)
1. ✅ Manter 5 UI fixes já implementados
2. ⚠️ Implementar JWT/Session validation se for produção
3. ✅ Tudo mais pode esperar

### Para Próxima Sprint
1. File unlinking (3 linhas de código, muito impacto)
2. Ritual efficiency (melhora recomendações)
3. Task workspace refresh (UX melhor)

### Para Versão Futura
1. Email real (pode deixar como mock por enquanto)
2. RAG (feature avançada)
3. Mobile (pode ser iterado depois)

---

## 🚀 Quick Wins (5-10 minutos cada)

Se quiser implementar agora:

### Rápido #1: Task Creation Toast
```jsx
// Em useTaskData.jsx linha 100
toast.success('Tarefa criada com sucesso!'); // 1 linha
```

### Rápido #2: File Unlinking
```jsx
// Em TaskWorkspaceOverlay.jsx linha 173
async onClick={() => {
    const api = new FileTaskAssociationAPI();
    await api.unlinkFileFromTask(linkedFile.id);
    setLinkedFile(null);
    toast.success('Arquivo desvinculado');
}
```

### Rápido #3: Dashboard Header Check
```jsx
// Abrir app no navegador
// Ver se header grande é intencional
// Se não, mudar tamanho do ícone (ViewHeader tem props para isso)
```

---

**Última Atualização:** 2025-12-18  
**Próximo Check:** Após implementar as mudanças críticas  
**Documento:** Ver commit 8175e74 para contexto

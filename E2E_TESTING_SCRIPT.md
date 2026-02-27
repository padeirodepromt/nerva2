# 🧪 E2E TESTING SCRIPT - Prana v0.0.0 First Deployment

**Objetivo:** Validar todos os sistemas críticos antes do deployment  
**Tempo Estimado:** 45 minutos  
**Executado por:** Manual QA  

---

## ✅ PRÉ-TEST SETUP

- [ ] Backend rodando (`npm run dev` / API online)
- [ ] Frontend rodando (`npm run dev` / Vite compilando)
- [ ] Banco de dados migrado (`npm run db:push` ou SQL manual)
- [ ] Browser console aberto (F12) - monitorar erros
- [ ] Dar refresh na página (Ctrl+F5) após cada grande operação

---

## 🧩 TESTE 1: Sistema Pessoal vs Profissional (15 min)

### T1.1 - Criar Projeto Pessoal
```
1. Clicar em "+ Criar" no Dashboard
2. Preencher: Nome = "Minha Vida Pessoal"
3. Tipo: Selecionar "Pessoal"
4. Submit
```
**Esperado:**
- ✅ Projeto criado com tipo='personal'
- ✅ Aparece no Dashboard
- ✅ Campo 'is_shared' = false (automático)

### T1.2 - Criar Projeto Profissional
```
1. Clicar em "+ Criar" no Dashboard
2. Preencher: Nome = "Projeto da Empresa"
3. Tipo: Selecionar "Profissional"
4. Compartilhado: Deixar desmarcado por enquanto
5. Submit
```
**Esperado:**
- ✅ Projeto criado com tipo='professional'
- ✅ Mostra no Dashboard

### T1.3 - Editar Tipo de Projeto
```
1. Abrir "Minha Vida Pessoal"
2. Clicar em Editar/Settings
3. Mudar tipo para "Profissional"
4. Submit
```
**Esperado:**
- ✅ Tipo mudado com sucesso
- ✅ Campo 'is_shared' continua false
- ✅ API retorna 200 OK

---

## 🏷️ TESTE 2: Sistema de Tags (12 min)

### T2.1 - Criar Tag Nova
```
1. Abrir projeto criado em T1.1
2. Na seção de Tags, digitar "Vida Pessoal"
3. Pressionar Enter
4. Aguardar tag ser criada
```
**Esperado:**
- ✅ Tag criada e adicionada ao projeto
- ✅ Aparece com cor no badge
- ✅ GET /api/tags retorna a tag

### T2.2 - Usar Tag Sugerida
```
1. Abrir outro projeto
2. Na seção de Tags, digitar "V" 
3. Autocomplete mostra "Vida Pessoal"
4. Clicar em "Vida Pessoal"
5. Tag adicionada
```
**Esperado:**
- ✅ Dropdown mostra tags sugeridas (top 10)
- ✅ Tag adicionada ao projeto
- ✅ Sem duplicação em API

### T2.3 - Remover Tag
```
1. No mesmo projeto, encontrar tag "Vida Pessoal"
2. Clicar no botão X ao lado
3. Confirmar remoção
```
**Esperado:**
- ✅ Tag removida visualmente
- ✅ DELETE /api/tags/:tagId chamado (ou remove-from-task)
- ✅ Tag continua na lista global (pode ser usada em outro projeto)

---

## 🔍 TESTE 3: Dashboard Filters (10 min)

### T3.1 - Filtro "Tudo"
```
1. Dashboard deve mostrar ambos os projetos (pessoal + profissional)
2. Clicar em botão "Tudo"
3. Verificar contagem
```
**Esperado:**
- ✅ Mostra todos os 2 projetos criados
- ✅ Botão "Tudo" destacado (secondary variant)

### T3.2 - Filtro "Pessoal"
```
1. Clicar em botão "Pessoal"
2. Aguardar re-render
3. Contar projetos visíveis
```
**Esperado:**
- ✅ Mostra apenas "Minha Vida Pessoal" (1 projeto)
- ✅ Projeto profissional desaparece
- ✅ Botão "Pessoal" destacado

### T3.3 - Filtro "Profissional"
```
1. Clicar em botão "Profissional"
2. Aguardar re-render
3. Contar projetos visíveis
```
**Esperado:**
- ✅ Mostra apenas "Projeto da Empresa" (1 projeto)
- ✅ Projeto pessoal desaparece
- ✅ Botão "Profissional" destacado

### T3.4 - Filtro Reset
```
1. Clicar "Tudo" novamente
2. Ambos os projetos reaparecem
```
**Esperado:**
- ✅ Filtro reset funcionando
- ✅ Suave transição (Framer Motion)

---

## ⌨️ TESTE 4: Command Palette (8 min)

### T4.1 - Abrir Palette
```
1. Pressionar Cmd+K (Mac) ou Ctrl+K (Windows/Linux)
2. Palette abre com animation
```
**Esperado:**
- ✅ CommandPalette aparece com backdrop
- ✅ Input focado automaticamente
- ✅ Sugestões carregadas

### T4.2 - Buscar Navegação
```
1. Digitar "Dashboard"
2. Ver resultado
3. Pressionar Enter ou clique
```
**Esperado:**
- ✅ "Dashboard" aparece nos resultados
- ✅ Clique navega para Dashboard (ou mantém se já lá)
- ✅ Palette fecha após seleção

### T4.3 - Buscar Multiple Views
```
1. Abrir Palette novamente
2. Digitar "Prana"
3. Ver resultado
```
**Esperado:**
- ✅ "Prana AI" aparece nos resultados
- ✅ Outros resultados também (settings, etc)
- ✅ Navegação funciona ao selecionar

### T4.4 - Busca Settings
```
1. Abrir Palette
2. Digitar "Settings"
3. Ver resultado
```
**Esperado:**
- ✅ Settings commands aparecem
- ✅ Mix de navegação + settings
- ✅ Ambos funcionando sem erro

---

## 📱 TESTE 5: Responsividade (8 min)

### T5.1 - Mobile (320px)
```
1. Chrome DevTools: Toggle Device Toolbar
2. iPhone SE (375x667)
3. Navegar pelo app
```
**Esperado:**
- ✅ Filtros visíveis (stack vertical se necessário)
- ✅ Modal não overflow (max-w-[90vw])
- ✅ Touches funcionam (não hover-only)
- ✅ Scroll smooth

### T5.2 - Tablet (768px)
```
1. iPad Air (820x1180)
2. Verificar layout
```
**Esperado:**
- ✅ Filtros lado a lado
- ✅ Modal responsivo
- ✅ Sem layout shifts

### T5.3 - Desktop (1920px)
```
1. Full width desktop
2. Verificar spacing
```
**Esperado:**
- ✅ Todos os elementos visíveis
- ✅ Sem overflow
- ✅ Readability ok

---

## 🎨 TESTE 6: Visual & Styling (5 min)

### T6.1 - Dark Mode
```
1. System Preferences > Dark Mode (ou toggle no app)
2. Verificar contraste
```
**Esperado:**
- ✅ Texto legível
- ✅ Ícones visíveis
- ✅ Backgrounds coerentes

### T6.2 - Animações
```
1. Abrir/fechar modais
2. Navegar entre vistas
3. Filtros mudam
```
**Esperado:**
- ✅ Transições suaves (Framer Motion)
- ✅ Sem lag ou glitches
- ✅ 60fps (devtools > Performance)

### T6.3 - Cores Accent
```
1. Verificar cor accent RGB nos elementos
2. Botões, badges, highlights
```
**Esperado:**
- ✅ Cor consistente (CSS var --accent-rgb)
- ✅ Opacity/shadows aplicados corretamente
- ✅ Glow effects funcionam

---

## 🔌 TESTE 7: Integração API (5 min)

### T7.1 - Network Tab
```
1. Chrome DevTools > Network
2. Criar novo projeto
3. Observar requests
```
**Esperado:**
- ✅ POST /api/projects → 201 Created
- ✅ GET /api/tags/suggested → 200 OK
- ✅ POST /api/tags → 201 Created (se nova tag)
- ✅ Sem CORS errors
- ✅ Response time < 500ms

### T7.2 - Console Errors
```
1. F12 > Console
2. Executar testes acima
3. Procurar por red logs
```
**Esperado:**
- ✅ Sem Uncaught errors
- ✅ Sem 404s em assets
- ✅ Sem timeout warnings
- ✅ Avisos normais apenas (deprecations, etc)

---

## 📊 TESTE 8: Performance (2 min)

### T8.1 - Load Time
```
1. Ctrl+Shift+Delete (Clear cache)
2. Hard reload (Ctrl+Shift+R)
3. Monitor Network tab
```
**Esperado:**
- ✅ Page load < 2s (DOMContentLoaded)
- ✅ Interactive < 3s (TTI)
- ✅ Largest contentful paint < 2s

### T8.2 - Bundle Size
```
1. Terminal: npm run build
2. Verificar console output
```
**Esperado:**
- ✅ Frontend bundle < 500KB
- ✅ Gzip < 150KB
- ✅ Sem huge warnings

---

## 🏁 TESTE FINAL: Smoke Test (2 min)

```
CENÁRIO COMPLETO (sem parar):
1. Abrir app
2. Clicar "+ Criar"
3. Criar "Projeto Teste Completo" (profissional)
4. Adicionar tag "smoke-test"
5. Filtrar por profissional
6. Abrir Cmd+K, navegar Dashboard
7. Refresh (F5)
8. Verificar dados persistiram
9. Deletar projeto
10. Confirmar que sumiu
```

**Esperado:**
- ✅ TODO acima funciona SEM ERRO

---

## 📝 LOG RESULTADO

**Executado em:** ___________  
**Executado por:** ___________  

### Testes Passados:
- [ ] T1 - Sistema Pessoal/Profissional (15/15 min) ___________
- [ ] T2 - Tags (12/12 min) ___________
- [ ] T3 - Filtros Dashboard (10/10 min) ___________
- [ ] T4 - Command Palette (8/8 min) ___________
- [ ] T5 - Responsividade (8/8 min) ___________
- [ ] T6 - Visual (5/5 min) ___________
- [ ] T7 - API (5/5 min) ___________
- [ ] T8 - Performance (2/2 min) ___________
- [ ] T9 - Smoke Test (2/2 min) ___________

**Total:** 67 min

### Issues Encontrados:
```
1. _________________________________________
   Severity: [ ] Critical  [ ] High  [ ] Medium  [ ] Low
   Status: [ ] Blocker  [ ] Fix in next phase  [ ] Document

2. _________________________________________
   Severity: [ ] Critical  [ ] High  [ ] Medium  [ ] Low
   Status: [ ] Blocker  [ ] Fix in next phase  [ ] Document
```

### Recomendação Final:
- [ ] ✅ **APROVADO PARA DEPLOY**
- [ ] ⚠️ **DEPLOY COM CAUTELA** (issues encontrados)
- [ ] ❌ **NÃO DEPLOY** (blockers críticos)

**Assinado:** ___________  
**Data:** ___________

---

**Próximo:** Após teste, executar `npm run build && npm run start` em produção (staging)

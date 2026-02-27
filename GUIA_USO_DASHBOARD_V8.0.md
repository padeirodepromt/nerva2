# 📖 GUIA DE USO - DashboardView V8.0 & Filtros

## 🎮 Como Usar o Dashboard

### 1️⃣ Abrir o Dashboard
```
Navegue para: Dashboard / Home
URL: /dashboard ou /
```

### 2️⃣ Acessar Filtros
```
Clique em: [🔧 Filtrar Dashboard ▼]
Local: Canto superior direito do header
```

### 3️⃣ Selecionar Filtros
```
┌─────────────────────────────┐
│ 📊 Produtividade            │  ← Clique para expandir/collapse
│   ☑ Intenção do Dia         │  
│   ☑ Projetos                │
│   ☑ Tarefas Prioritárias    │
│   ☑ Velocidade              │
│                             │
│ 🌙 Contexto Cósmico         │
│   ☑ Contexto Astral         │
│   ☑ Rituais                 │
│                             │
│ ✨ Analíticas Holísticas    │
│   ☑ Energia                 │
│   ☑ Humor                   │
│   ☑ Tags                    │
│   ☑ Insights Ash            │
│   ☑ Ciclo Menstrual         │
└─────────────────────────────┘
```

### 4️⃣ Personalizar Vista

#### Opção A: Desligar Grupo Inteiro
```
Clique na checkbox de "📊 Produtividade"
↓
Todas as 4 seções (Intenção, Projetos, Tarefas, Velocidade) desligam
```

#### Opção B: Desligar Seção Individual
```
Clique em "⚙️ Tarefas Prioritárias"
↓
Apenas aquela seção desliga
(Projetos, Intenção, Velocidade continuam ligadas)
```

#### Opção C: Mostrar Tudo
```
Clique em "☑ Mostrar Tudo"
↓
Todas as 11 seções ligam de uma vez
```

---

## 🎨 Modos de Visualização de Projetos

### Mudar Modo
```
1. Clique em um dos 3 botões:
   [≡ Lista]  [⊞ Grid]  [≋ Matriz]
   
2. Dashboard reorganiza automaticamente
```

### Lista (Vertical)
```
Ideal para: Muitos projetos
Layout: 1 projeto por linha
Uso: Desktop, quando quer ver detalhes
```

### Grid (4 Colunas)
```
Ideal para: Visão geral
Layout: 4 projetos por linha
Uso: Desktop padrão (RECOMENDADO)
```

### Matriz (8 Colunas)
```
Ideal para: Ver todos de uma vez
Layout: 8 projetos por linha, compacto
Uso: Monitor grande, visão rápida
```

---

## 🔍 Buscar Projetos

### Como Funciona
```
1. Clique na barra de busca [🔍 Filtrar...]
2. Digite nome do projeto
3. Dashboard filtra em TEMPO REAL
```

### Exemplo
```
Digitei: "marketing"
↓
Mostra apenas projetos com "marketing" no nome
```

---

## 🎯 KPIs Explicados

### ⏰ Foco Hoje
```
O que é: Horas de trabalho focado HOJE
Como é calculado: Soma de todas as TimeSession de hoje
Exemplo: Você trabalhou 3 sessões de 30, 45 e 20 minutos = 1.58 horas
Meta: 6 horas (barra de progresso)
```

### 📊 Projetos Ativos
```
O que é: Quantos projetos você tem
Como é calculado: Count de Project onde deleted_at = null
Exemplo: Você tem 8 projetos ativos = mostra 8
```

### 🌙 Contexto Cósmico
```
O que é: Situação astrológica HOJE
Como é calculado: 
  - Signo Solar = data de hoje
  - Fase Lunar = cálculo astronômico
Exemplo: "Libra + Lua Gibosa"
Nota: Muda todo dia (não é mock!)
```

---

## 🐉 Drag & Drop (Reordenar Projetos)

### Como Funciona
```
1. Clique e segure em um projeto
2. Arraste para a posição desejada
3. Solte (drop)
4. Dashboard salva a nova ordem no banco
```

### Exemplo
```
Antes:  [Projeto A] [Projeto B] [Projeto C]
        Eu quero B antes de A

Arrasto B para esquerda:
        [Projeto B] [Projeto A] [Projeto C]

Depois de soltar:
        ✅ Ordem atualizada no banco
        ✅ Retroalimentação visual
```

---

## 📱 Responsivo (Mobile/Tablet/Desktop)

### Desktop (1920px+)
```
┌─────────────────────────────────────┐
│ Grid: 4 colunas                      │
│ KPIs: 3 lado a lado                  │
│ Filtros: Dropdown completo           │
└─────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────────┐
│ Grid: 2 colunas          │
│ KPIs: Stack vertical     │
│ Filtros: Dropdown        │
└──────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────┐
│ Lista: 1    │
│ KPIs: Stack │
│ Filtro: ▼   │
└─────────────┘
```

---

## 🔐 Dados Persistidos

### O Dashboard Lembra
```
1. Filtros escolhidos
   → Salvo em localStorage
   → Próxima vez que abre, mesmos filtros

2. Modo de visualização (List/Grid/Clean)
   → NÃO persiste (reset ao recarregar)

3. Busca
   → NÃO persiste (reset ao recarregar)

4. Ordem de projetos (Drag & Drop)
   → Salvo no banco de dados
   → Persiste para sempre
```

---

## ⚙️ Troubleshooting

### "Nada aparece no Dashboard"
```
Causa 1: Todos os filtros estão desligados
Solução: Clique em "Mostrar Tudo"

Causa 2: Nenhum projeto criado
Solução: Clique em "+ Novo" para criar primeiro projeto

Causa 3: Filtros "projects" está desligado
Solução: Ligue o filtro em "Projetos"
```

### "KPIs mostram 0"
```
Causa 1: Nenhuma TimeSession registrada
Solução: Comece a trabalhar (Time Tracking) e volte

Causa 2: TimeSession não é de HOJE
Solução: KPIs só mostram dados de hoje (reset diário)

Causa 3: Filtro "velocity" está desligado
Solução: Ligue o filtro
```

### "Astrologia não muda"
```
Causa 1: Esperado (fase lunar muda cada ~1.8 dias)
Solução: Volte amanhã

Causa 2: Signo solar não é calculado diariamente
Solução: Espere até dia 23 (mudança de signo)

Nota: Se quiser testar, abra DevTools:
  → localStorage['prana:astral-date'] = 'data-diferente'
  → Reload
```

### "Drag & Drop não funciona"
```
Causa 1: Filtro "projects" está desligado
Solução: Ligue o filtro em "Projetos"

Causa 2: Nenhum projeto para arrastar
Solução: Crie um projeto novo

Causa 3: @hello-pangea/dnd não instalado
Solução: npm install @hello-pangea/dnd
```

### "Scroll está lento"
```
Causa 1: Muitos projetos renderizados
Solução: Use modo "Matriz" (menos visual, mais rápido)

Causa 2: Cards holísticos carregando
Solução: Desative cards que não usa (filtros)

Causa 3: Browser issue
Solução: Ctrl+Shift+Del → Limpar cache → Reload
```

---

## 🎓 Dicas Pro

### Dica 1: Customizar por Contexto
```
MANHÃ (Produtividade):
  ✓ Ativa: Projetos, Tarefas, Velocidade
  ✗ Desativa: Analíticas, Astrologia

TARDE (Revisão):
  ✓ Ativa: Energia, Humor, Tags
  ✗ Desativa: Projetos

NOITE (Reflexão):
  ✓ Ativa: Tudo
  ✓ Revisa todo contexto
```

### Dica 2: Usar Drag & Drop para Priorizar
```
Antes: [Low] [Medium] [High]
Arraste projetos High para o início
Depois: [High] [High] [Medium] [Low]
Prioridades visuais!
```

### Dica 3: Search para Filtro Rápido
```
Digitei: "client-x"
↓
Mostra apenas projetos com "client-x"
↓
Trabalha apenas com aquele cliente
↓
Limpa busca quando termina
```

### Dica 4: Monitorar Foco Diário
```
Olhe o KPI "Foco Hoje" regularmente
Viu que só tem 2 horas?
→ Tempo de trabalhar mais
→ Estabeleça meta (6h) e tenta bater
```

### Dica 5: Usar Ciclo Menstrual para Planejamento
```
Se está na fase MENSTRUAL:
→ Desativa projetos pesados
→ Foca em tarefas light

Se está na fase OVULATÓRIA:
→ Aumenta projetos complexos
→ Aproveita energia alta
```

---

## 📊 Dados Visíveis vs Ocultos

### Sempre Visível
- Header (Bom dia + Conselho)
- Botão de Filtros
- Barra de Busca
- Modos de Visualização
- Botão + Novo

### Condicional ao Filtro
- KPIs (se algum de: sankalpa, velocity, astral)
- Projetos (se: projects)
- Tarefas (se: tasks E tem tarefas soltas)
- Cards Holísticos (se: energy/mood/tags/ash/menstrual)

### Nunca Renderiza
- Cards vazios
- Seções desabilitadas
- Dados invalidos

---

## 🎯 Checklist Para Novo Usuário

- [ ] Abra o Dashboard
- [ ] Clique em "Filtrar Dashboard"
- [ ] Ative "Mostrar Tudo"
- [ ] Crie seu primeiro projeto (+ Novo)
- [ ] Veja projeto aparecer na grid
- [ ] Tente arrastá-lo (Drag & Drop)
- [ ] Mude para modo "Lista"
- [ ] Teste busca (tipo "projeto")
- [ ] Desative alguns filtros
- [ ] Veja seções desaparecerem
- [ ] Reative "Mostrar Tudo"
- [ ] Comece a trabalhar (TimeSession)
- [ ] Volte ao Dashboard
- [ ] Veja "Foco Hoje" atualizar

✅ **Parabéns! Você domina o Dashboard V8.0!**

---

## 📞 Suporte & Feedback

### Encontrou Bug?
```
Abra uma Issue em:
https://github.com/padeirodepromt/prana3.0/issues
```

### Quer Sugerir Feature?
```
Comente em:
https://github.com/padeirodepromt/prana3.0/discussions
```

### Precisa de Help?
```
Comunidade: Discord Prana
Email: support@pranaos.com
```

---

**Aproveite seu novo Dashboard Minimalista, Poderoso e Pronto para Produção!** 🚀

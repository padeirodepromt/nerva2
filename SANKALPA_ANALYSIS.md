# 🧘 SANKALPA & SANKALPAVIEW - ANÁLISE COMPLETA

## O QUE É SANKALPA?

**Sankalpa** = "Propósito Resolvido" (Sânscrito)
- É a **intenção profunda** por trás de cada coisa
- A **raiz espiritual** que conecta tarefas/projetos com propósito vital
- Responde: "Por que estou fazendo isto?"

---

## 📊 ESTADO ATUAL (3 Camadas)

### **1️⃣ ENTIDADE SANKALPA (Backend)**
```javascript
// src/api/entities.js - Linha 161
export class Sankalpa extends BaseEntity { 
    static resource = 'sankalpas'; 
}
```

**Status:** ✅ **Implementada**
- CRUD completo (criar, ler, atualizar, deletar)
- Comunicação com API `/sankalpas`
- **Mas:** Não está conectada a nada no frontend ainda

---

### **2️⃣ SANKALPAVIEW (Canvas em Branco)**

**Localização:** `src/views/SankalpaView.jsx`

**Propósito:** Espaço "Ponto Zero" onde o usuário **define intenções fundamentais**

**Status:** ⚠️ **Parcialmente Habilitado**

**O que está funcionando:**
- ✅ Renderiza corretamente (é a página inicial/empty state)
- ✅ Tem atalhos rápidos (SmartCreate, CommandPalette)
- ✅ Tem instrução sobre cartas (recém adicionada)
- ✅ Visual bonito com logo pulsante

**O que NÃO está funcionando:**
- ❌ **Não carrega/salva Sankalpas reais do BD**
- ❌ **Não mostra intenções criadas anteriormente**
- ❌ **Não tem interface para criar/editar Sankalpas**
- ❌ **Não conecta Sankalpas a Projetos/Tarefas**
- ❌ **Não é uma ferramenta, é só visual (Canvas em Branco)**

---

### **3️⃣ DASHBOARD SANKALPA CARD**

**Localização:** `src/views/DashboardView.jsx` - Linhas ~258-271

**Status:** ✅ **Minimamente Habilitado**

```jsx
{/* Card Sankalpa */}
{filters.sankalpa && (
<div className="glass-effect p-10 rounded-3xl...">
    <h3>Intenção do Dia</h3>
    <p>"{data.astral.advice}"</p>
</div>
)}
```

**O que faz:**
- ✅ Exibe card com toggle (filters.sankalpa)
- ✅ Mostra "Intenção do Dia" 
- ❌ **Mas vem de `data.astral.advice`** (astrologia, não de Sankalpa real)

---

## 🎯 O QUE DEVERIA ACONTECER?

### **Fluxo Ideal de Sankalpa:**

```
1️⃣ USER chega no Prana
   ↓
2️⃣ Vai para SankalpaView (canvas em branco)
   ↓
3️⃣ Define suas 3-5 Sankalpas (intenções de vida)
   Exemplo: "Viver com presença", "Criar com propósito", "Honrar meu corpo"
   ↓
4️⃣ Cria Projetos e Tarefas
   ↓
5️⃣ Cada Projeto/Tarefa é conectado a UM Sankalpa
   ↓
6️⃣ Dashboard mostra:
   - Sankalpa do Dia (qual foi escolhido hoje)
   - Progresso em cada Sankalpa
   - Tarefas alinhadas com aquele Sankalpa
   ↓
7️⃣ Ash pode sugerir tarefas baseado no Sankalpa
```

---

## ✅ O QUE ESTÁ HABILITADO AGORA

1. ✅ **Entidade Sankalpa** - Backend pronto
2. ✅ **SankalpaView visual** - Página renderiza bonita
3. ✅ **Dashboard card** - Mostra "Intenção do Dia" (de astrologia)
4. ✅ **Tutorial.jsx** - Tem card "Sankalpa" com descrição

---

## ❌ O QUE FALTA FAZER

### **Prioridade Alta:**

1. **Modal/Form para Criar Sankalpa**
   - Onde: `src/components/forms/SankalpaModal.jsx` (novo)
   - Fields: `title`, `description`, `color`, `emoji`
   - Botão: Em SankalpaView

2. **Listar Sankalpas em SankalpaView**
   - Load Sankalpas do backend
   - Mostrar como cards editáveis
   - Permitir deletar/editar

3. **Conectar Sankalpa a Project/Task**
   - Adicionar campo `sankalpa_id` em Projects e Tasks
   - Mostrar em formulários de criação
   - Filter/buscar por Sankalpa

4. **Dashboard - mostrar Sankalpa REAL**
   - Em vez de `data.astral.advice`
   - Mostrar Sankalpa selecionado para hoje
   - Com tarefas alinhadas

5. **Ash - sugerir por Sankalpa**
   - Quando user pedir algo, Ash pergunta qual Sankalpa
   - "Que tipo de tarefa? (Produção, Saúde, Relacionamento...)"

### **Prioridade Média:**

- [ ] Visualização em gráfico de Sankalpas completados
- [ ] Histórico de Sankalpas por período
- [ ] Correlação Sankalpa × Energia

### **Prioridade Baixa:**

- [ ] Integração com cartas (Oracle recomenda Sankalpa)
- [ ] AI gera Sankalpas personalizadas

---

## 🗺️ ARQUIVOS ENVOLVIDOS

### **Já Existem:**
- `src/api/entities.js` - Classe Sankalpa (CRUD)
- `src/views/SankalpaView.jsx` - Canvas visual
- `src/views/DashboardView.jsx` - Card Sankalpa (dashboard)
- `src/pages/Tutorial.jsx` - Card educacional

### **Precisam Ser Criados:**
- `src/components/forms/SankalpaModal.jsx` - Modal edição
- `src/components/dashboard/SankalpaListCard.jsx` - Listar Sankalpas
- `src/hooks/useSankalpa.js` - Hook para gerenciar Sankalpas

### **Precisam Ser Atualizados:**
- `src/views/SankalpaView.jsx` - Add load/create/list logic
- `src/views/DashboardView.jsx` - Usar Sankalpa real em vez de astrology.advice
- `src/components/forms/PranaFormModal.jsx` - Add sankalpa_id field
- `src/api/entities.js` - Add sankalpa_id a Project e Task

---

## 📋 SEQUÊNCIA DE IMPLEMENTAÇÃO

### **Fase 1: Infraestrutura (Hoje)**
1. Criar `SankalpaModal.jsx` - Form para criar/editar
2. Criar `useSankalpa.js` - Hook CRUD
3. Atualizar `SankalpaView.jsx` - Load e list Sankalpas

### **Fase 2: Integração (Amanhã)**
1. Adicionar `sankalpa_id` ao Project/Task
2. Atualizar `PranaFormModal.jsx` - Selector Sankalpa
3. Atualizar `DashboardView.jsx` - Mostrar Sankalpa real

### **Fase 3: Ash (Depois)**
1. Endpoint `/ai/suggest-by-sankalpa`
2. Ash pergunta Sankalpa ao criar tarefa
3. Recomendações baseadas em intenção

---

## 💡 EXEMPLO: COMO SANKALPA FUNCIONA (POST-IMPLEMENTAÇÃO)

```
User: "Preciso estudar React"
↓
Ash: "Que intenção conecta isto? 
  (1) Crescimento Profissional
  (2) Domínio Técnico  
  (3) Compartilhar Conhecimento"
↓
User: "1 - Crescimento Profissional"
↓
Ash cria Tarefa:
  {
    title: "Estudar React",
    sankalpa_id: <ID de Crescimento Profissional>,
    priority: "high",
    description: "Alinhado com sua intenção de crescer profissionalmente"
  }
↓
Dashboard mostra:
  "Sankalpa de Hoje: Crescimento Profissional"
  "Progresso: 3 tarefas (React, Typescript, Docker)"
```

---

## 🎨 VISUAL ESPERADO (Futuro)

```
SankalpaView
┌─────────────────────────────────────┐
│  ✦ Prana ✦                          │
│                                     │
│  Minhas Intenções                   │
│  ───────────────────────────────────│
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 🌱 Cresce│  │ 💪 Saúde │        │
│  │ Profis.  │  │         │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 🤝 Amor  │  │ 🧘 Paz   │        │
│  │         │  │         │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  [+ Criar Nova]                     │
└─────────────────────────────────────┘
```

---

**Status Resumido:**
- **Sankalpa entidade:** ✅ Pronta
- **SankalpaView visual:** ✅ Pronta
- **Sankalpa funcionalidade:** ❌ Não conectada
- **Integração Projects/Tasks:** ❌ Falta
- **Ash integration:** ❌ Falta

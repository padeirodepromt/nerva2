# 🚀 Quick Start - Sistema de Energia Dual + Diário

**Status:** ✅ Código pronto para testes  
**Última atualização:** Agora  

---

## 📋 Checklist de Implementação Completa

### ✅ Backend
- [x] Schema Database (energyCheckIns, diaryEntries, rituals)
- [x] 10 API endpoints
- [x] Validações (energy types, emotional states, intensity 1-5)
- [x] Auth middleware
- [x] Server integration
- [ ] Database migration (próximo passo)

### ✅ Frontend
- [x] useEnergy hook (11 functions)
- [x] EnergyCheckInModal component
- [x] DiaryEditor component
- [x] Dashboard integration
- [ ] Journal/Diary page (próximo passo)

### ✅ Componentes Core
- [x] Triple check-in system design
- [x] Energy types + Emotional states
- [x] Intensity scale (1-5)
- [ ] Ritual detection service (próximo passo)
- [ ] Ash proactive prompts (próximo passo)

---

## 🎯 Como Testar Agora

### 1. Testar Check-in de Energia

**Via Dashboard:**
1. Abra a aplicação
2. Clique no botão "Check-in de Energia" (topo da Dashboard)
3. Selecione uma energía (ex: foco_profundo)
4. Selecione intensidade (1-5)
5. Clique em "Registrar"

**Via API (cURL):**
```bash
curl -X POST http://localhost:5000/api/energy/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "timeOfDay": "morning",
    "energyType": "foco_profundo",
    "energyIntensity": 4,
    "secondaryType": "criativo"
  }'
```

### 2. Testar Diário com Emoções

**Via API:**
```bash
curl -X POST http://localhost:5000/api/diary/entry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "Dia muito produtivo! Consegui finalizar o projeto.",
    "emotionalStates": ["alegre", "confiante"],
    "linkedEnergyMorning": "uuid-do-check-in-da-manha"
  }'
```

### 3. Obter Histórico

```bash
# Energias de hoje
curl http://localhost:5000/api/energy/today \
  -H "Authorization: Bearer YOUR_TOKEN"

# Diário de hoje
curl http://localhost:5000/api/diary/today \
  -H "Authorization: Bearer YOUR_TOKEN"

# Semana completa
curl http://localhost:5000/api/energy/week \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📁 Arquivos Criados/Modificados

| Arquivo | Mudança | Status |
|---------|---------|--------|
| `src/db/schema/energy.js` | Novo schema (4 tabelas) | ✅ |
| `src/api/energy/routes.js` | 10 endpoints | ✅ |
| `src/components/energy/EnergyCheckInModal.jsx` | Component modal | ✅ |
| `src/components/energy/DiaryEditor.jsx` | Component editor | ✅ |
| `src/hooks/useEnergy.js` | Custom hook (11 funcs) | ✅ |
| `src/views/DashboardView.jsx` | Integração modal | ✅ |
| `server.js` | Registro de routes | ✅ |

---

## 🔧 Próximas Tarefas (Ordem Recomendada)

### Fase 12a: Database Migration (2-3 horas)
```bash
# Gerar migration
npm run db:generate

# Executar migration
npm run db:migrate

# Verificar schema
npm run db:studio
```

### Fase 12b: Ritual Detection Service (4-5 horas)
- [ ] Create `src/ai_services/ritualDetectionService.js`
- [ ] Algorithm: Analyze energy patterns after 14 days
- [ ] Calculate detection_score (frequency + consistency)
- [ ] Calculate efficiency_score (task completion rate)
- [ ] Trigger ritual creation quando score > 70%

**Exemplo:**
```javascript
// Detecção de ritual "Manhã Focada"
{
  name: "Manhã Focada",
  description: "Foco profundo regularmente pela manhã",
  morningEnergy: "foco_profundo",
  afternoonEnergy: "administrativo",
  eveningStates: ["calmo", "grato"],
  frequency: "4-5 vezes por semana",
  detection_score: 0.85,
  efficiency_score: 0.72,
  pattern_duration: "14 dias"
}
```

### Fase 12c: Ash Proactive Prompts (3-4 horas)
- [ ] Morning (6am): "Como está sua energia?"
- [ ] Afternoon (2pm): "Sua energia mudou?"
- [ ] Wire with EnergyCheckInModal
- [ ] Check if already checked-in today

### Fase 12d: Journal/Diary Page (3-4 horas)
- [ ] Create `src/views/JournalView.jsx` OR add to Dashboard
- [ ] Display today's diary entry
- [ ] Show energy context (morning + afternoon)
- [ ] Calendar view para 30 últimos dias
- [ ] Wire with DiaryEditor component

### Fase 12e: Testing & Polish (2-3 horas)
- [ ] Test all 10 endpoints
- [ ] Test modal flows end-to-end
- [ ] Test ritual detection with mock data
- [ ] UI/UX refinements
- [ ] Error handling improvements

---

## 💡 Dicas de Implementação

### Para Ritual Detection:
```javascript
// Pseudo-código
const detectRituals = (checkIns, diaryEntries, days = 14) => {
  // 1. Agrupar por padrão (manhã + tarde + noite)
  const patterns = groupByTimePattern(checkIns);
  
  // 2. Calcular frequência
  const frequency = patterns.occurrences / days * 100;
  
  // 3. Calcular consistência (desvio padrão)
  const consistency = 100 - std(intensities);
  
  // 4. Score final
  const detectionScore = (frequency * 0.6) + (consistency * 0.4);
  
  // 5. Se > 70%, criar ritual
  if (detectionScore > 0.7) {
    return createRitual(pattern);
  }
};
```

### Para Ash Prompts:
```javascript
// useAshStore.js - adicionar método
const askAboutEnergy = async (timeOfDay) => {
  const hasCheckedIn = await checkIfCheckedIn(timeOfDay);
  
  if (!hasCheckedIn) {
    addMessage({
      role: 'assistant',
      content: timeOfDay === 'morning' 
        ? 'Como está sua energia agora?'
        : 'Sua energia mudou desde a manhã?',
      action: 'open_energy_modal'
    });
  }
};
```

---

## 📊 Data Model Summary

### Energy Check-In
```javascript
{
  id: uuid,
  userId: uuid,
  timeOfDay: 'morning' | 'afternoon',
  energyType: string (9 tipos),
  energyIntensity: 1-5,
  secondaryType: string? (optional, morning only),
  createdAt: timestamp,
  diaryEntryId: uuid? (linked to evening reflection)
}
```

### Diary Entry
```javascript
{
  id: uuid,
  userId: uuid,
  content: string (rich text),
  emotionalStates: string[] (max 3, from 10 options),
  linkedEnergyMorning: uuid?,
  linkedEnergyAfternoon: uuid?,
  createdAt: timestamp
}
```

### Ritual
```javascript
{
  id: uuid,
  userId: uuid,
  name: string,
  description: string,
  morningEnergy: string?,
  afternoonEnergy: string?,
  eveningStates: string[]?,
  frequency: string,
  detectionScore: 0-1,
  efficiencyScore: 0-1,
  isActive: boolean,
  reminderTime: time?,
  createdAt: timestamp
}
```

---

## 🎓 Próximas Reuniões

**Fase 12 - Database + Rituals:**
- [ ] Migration executada
- [ ] Ritual detection service working
- [ ] Ash prompts active
- [ ] Journal page implemented
- [ ] End-to-end testing completo

---

## 🆘 Troubleshooting

### Modal não abre?
- Verificar se `EnergyCheckInModal` está importado
- Verificar se `isEnergyCheckInOpen` está no estado
- Verificar console para erros

### API retorna erro?
- Verificar token de autenticação
- Verificar se servidor está rodando
- Verificar logs: `npm run dev`

### Build falha?
- Limpar node_modules: `rm -rf node_modules && npm install`
- Verificar imports (circular dependencies)
- Verificar syntax errors

---

**Última Validação:** ✅ Build passa, 0 errors  
**Próxima Ação:** Executar migration (Fase 12a)

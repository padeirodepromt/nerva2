# 🚀 GET STARTED - Como Rodar e Testar o Sistema de Energia

## ⚡ Quick Start (5 minutos)

### 1. Instalar Dependências
```bash
cd /workspaces/prana3.0
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
Deve abrir em `http://localhost:5173` (Vite) com backend em `http://localhost:5000`

### 3. Acessar Dashboard
1. Faça login com suas credenciais
2. Vá para a Dashboard
3. Clique no botão **"Check-in de Energia"** (no topo, lado direito)

---

## 🧪 Testing Endpoints (Postman/cURL)

### Setup
1. Obtenha seu token de auth (fazer login)
2. Defina variáveis:
   ```bash
   export TOKEN="seu_token_aqui"
   export API="http://localhost:5000/api/energy"
   ```

### Teste 1: Registrar Energy Check-in
```bash
curl -X POST $API/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timeOfDay": "morning",
    "energyType": "foco_profundo",
    "energyIntensity": 4,
    "secondaryType": "criativo"
  }'
```

**Esperado:** 
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "timeOfDay": "morning",
    "energyType": "foco_profundo",
    "energyIntensity": 4
  }
}
```

### Teste 2: Obter Energias de Hoje
```bash
curl -X GET $API/today \
  -H "Authorization: Bearer $TOKEN"
```

### Teste 3: Criar Diário
```bash
curl -X POST $API/diary/entry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "Dia muito produtivo. Consegui focar na manhã e resolver problemas à tarde.",
    "emotionalStates": ["alegre", "confiante"],
    "linkedEnergyMorning": "uuid-da-manha"
  }'
```

### Teste 4: Obter Constantes (Energy Types)
```bash
curl -X GET $API/constants \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Validar no Database (Studio Drizzle)

```bash
npm run db:studio
```

Abre em `http://localhost:3000` - veja as tabelas em tempo real:
- `energyCheckIns` - seus check-ins
- `diaryEntries` - suas reflexões
- `rituals` - rituais detectados

---

## 🎯 Checklist de Funcionalidades

- [ ] Botão "Check-in de Energia" aparece na Dashboard
- [ ] Modal abre ao clicar
- [ ] Consegue selecionar tipo de energia
- [ ] Slider de intensidade funciona
- [ ] Botão de registrar funciona
- [ ] Check-in aparece no banco de dados
- [ ] Consegue criar diário com emoções
- [ ] Diário linkado a energias anteriores
- [ ] GET /api/energy/week retorna histórico

---

## 🔧 Troubleshooting

### Modal não abre
```
❌ Verifique:
1. Console do navegador (F12)
2. Se EnergyCheckInModal está importado em DashboardView
3. Se useEnergyCheckInOpen está no estado
```

### API retorna 401
```
❌ Verifique:
1. Token está válido (fazer logout/login)
2. Headers têm "Authorization: Bearer TOKEN"
3. Backend está rodando (npm run dev)
```

### Erro ao salvar
```
❌ Verifique:
1. Validações:
   - energyType é um de: foco_profundo, criativo, administrativo, 
     estrategico, colaborativo, social, restaurador, introspectivo, fisico
   - energyIntensity está entre 1-5
   - emotionalStates máx 3 (de: alegre, confiante, entusiasmado, 
     esperancoso, grato, calmo, vulneravel, ansioso, estressado, triste)
2. Logs do servidor (verifique console do npm run dev)
```

### Build falha
```
❌ Solução:
rm -rf node_modules
npm install
npm run build
```

---

## 📝 Exemplo Completo: Morning Routine

**1. Às 6am - Manhã**
```bash
curl -X POST $API/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timeOfDay": "morning",
    "energyType": "foco_profundo",
    "energyIntensity": 4,
    "secondaryType": "criativo"
  }'
# Salve o ID: MORNING_ID="..."
```

**2. Às 2pm - Tarde (mudança detectada)**
```bash
curl -X POST $API/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timeOfDay": "afternoon",
    "energyType": "administrativo",
    "energyIntensity": 3
  }'
# Salve o ID: AFTERNOON_ID="..."
```

**3. Às 8pm - Noite (reflexão)**
```bash
curl -X POST $API/diary/entry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "Comecei o dia focado em programação, consegui resolver 3 bugs importantes. À tarde precisei lidar com admin, mas sem perder o ritmo. Dia produtivo!",
    "emotionalStates": ["alegre", "confiante", "grato"],
    "linkedEnergyMorning": "'$MORNING_ID'",
    "linkedEnergyAfternoon": "'$AFTERNOON_ID'"
  }'
```

**4. Verificar Histórico**
```bash
curl -X GET $API/today \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🎓 Próximas Features (Fase 12)

### Ritual Detection (Automático após 14 dias)
```
Quando 70%+ dos dias você faz:
- Manhã: Foco Profundo + Intensidade alta
- Tarde: Administrativo
- Noite: Estados de Alegria + Gratidão

Sistema detecta automaticamente e propõe:
✨ "Seus padrões mostram uma 'Rotina Produtiva'!"
```

### Ash Prompts (Automático nos horários)
```
6am: "Oi! Como está sua energia agora?"
     → Abre EnergyCheckInModal

2pm: "Sua energia mudou desde a manhã?"
     → Abre EnergyCheckInModal

8pm: "Como foi seu dia?"
     → Abre DiaryEditor
```

### Journal Page (Nova página)
```
/journal
- Histórico de 30 dias
- Busca por energy type ou emotional state
- Gráficos de padrões
- Exportar como PDF
```

---

## 💾 Dados de Exemplo para Testes

### Energy Types
- `foco_profundo` - Deep work, concentration
- `criativo` - Brainstorming, creative tasks
- `administrativo` - Admin work, meetings
- `estrategico` - Strategic planning
- `colaborativo` - Teamwork, discussions
- `social` - Networking, social events
- `restaurador` - Recovery, rest
- `introspectivo` - Reflection, meditation
- `fisico` - Physical activity

### Emotional States
- `alegre` - Happy
- `confiante` - Confident
- `entusiasmado` - Enthusiastic
- `esperancoso` - Hopeful
- `grato` - Grateful
- `calmo` - Calm
- `vulneravel` - Vulnerable
- `ansioso` - Anxious
- `estressado` - Stressed
- `triste` - Sad

### Intensity Scale
- 1️⃣ Mínima
- 2️⃣ Baixa
- 3️⃣ Moderada
- 4️⃣ Alta
- 5️⃣ Pico

---

## 📱 Testing Checklist

### Backend
- [ ] Servidor inicia sem erros: `npm run dev`
- [ ] Endpoints respondendo: `curl http://localhost:5000/api/energy/constants`
- [ ] Database conectado: `npm run db:studio`
- [ ] Validações funcionando
- [ ] Auth middleware presente

### Frontend
- [ ] Build sem erros: `npm run build`
- [ ] Components importados corretamente
- [ ] Modal abre e fecha
- [ ] Botões funcionam
- [ ] Estado atualiza após envio

### Integration
- [ ] Dados salvos no BD após envio
- [ ] GET endpoints retornam dados corretos
- [ ] Linking entre morning/afternoon funciona
- [ ] Diário linkado a energias anteriores

---

## 🆘 Debug Tips

### Ver logs do servidor
```bash
npm run dev
# Procure por erros de validação ou database
```

### Ver logs do navegador
```
F12 → Console
Procure por erros de network ou componentes
```

### Ver dados no database
```bash
npm run db:studio
# Abra em http://localhost:3000
# Veja o conteúdo das tabelas em tempo real
```

### Testar API com Postman
1. Importar coleção: `test-energy-api.sh` como base
2. Substituir TOKEN pelos seus valores
3. Rodar requisições uma por uma

---

## 🎉 Você Está Pronto!

Toda a infraestrutura está em place:
- ✅ Backend: 10 endpoints prontos
- ✅ Frontend: 2 componentes prontos
- ✅ Database: Schema desenhado
- ✅ Integration: Wired no Dashboard

**Próximos passos:**
1. Testar endpoints (see checklist acima)
2. Validar database migrations (Fase 12a)
3. Implementar Ritual Detection (Fase 12b)
4. Adicionar Ash prompts (Fase 12c)

---

**Sucesso! 🚀**

Para dúvidas, veja:
- PHASE_11_FINAL_SUMMARY.md
- QUICK_START_ENERGY_SYSTEM.md
- IMPLEMENTATION_PHASE_11_COMPLETE.md

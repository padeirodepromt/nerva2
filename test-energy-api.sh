#!/bin/bash
# test-energy-api.sh
# Script para testar todos os endpoints da API de Energia

API_BASE="http://localhost:5000/api/energy"
TOKEN="YOUR_AUTH_TOKEN"  # Substituir com token real
USER_ID="YOUR_USER_ID"   # Substituir com user ID real

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Iniciando testes da API de Energia...${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════
# 1. Obter Constants
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}1️⃣  GET /api/energy/constants${NC}"
echo "Obtendo tipos de energia e estados emocionais..."

RESPONSE=$(curl -s -X GET "$API_BASE/constants" \
  -H "Authorization: Bearer $TOKEN")

echo "Resposta:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo -e "\n"

# ═══════════════════════════════════════════════════════════════════════════
# 2. Registrar Check-in Manhã
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}2️⃣  POST /api/energy/check-in (Manhã)${NC}"
echo "Registrando check-in de energia - MANHÃ..."

CHECKIN_MORNING=$(curl -s -X POST "$API_BASE/check-in" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timeOfDay": "morning",
    "energyType": "foco_profundo",
    "energyIntensity": 4,
    "secondaryType": "criativo"
  }')

echo "Resposta:"
echo "$CHECKIN_MORNING" | jq '.' 2>/dev/null || echo "$CHECKIN_MORNING"

# Extrair ID para usar depois
MORNING_ID=$(echo "$CHECKIN_MORNING" | jq -r '.data.id' 2>/dev/null)
echo -e "ID da manhã: ${GREEN}$MORNING_ID${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════
# 3. Registrar Check-in Tarde
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}3️⃣  POST /api/energy/check-in (Tarde)${NC}"
echo "Registrando check-in de energia - TARDE..."

CHECKIN_AFTERNOON=$(curl -s -X POST "$API_BASE/check-in" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timeOfDay": "afternoon",
    "energyType": "administrativo",
    "energyIntensity": 3
  }')

echo "Resposta:"
echo "$CHECKIN_AFTERNOON" | jq '.' 2>/dev/null || echo "$CHECKIN_AFTERNOON"

AFTERNOON_ID=$(echo "$CHECKIN_AFTERNOON" | jq -r '.data.id' 2>/dev/null)
echo -e "ID da tarde: ${GREEN}$AFTERNOON_ID${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════
# 4. Obter Energias de Hoje
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}4️⃣  GET /api/energy/today${NC}"
echo "Obtendo energias de hoje..."

curl -s -X GET "$API_BASE/today" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Erro na requisição"
echo -e "\n"

# ═══════════════════════════════════════════════════════════════════════════
# 5. Obter Histórico da Semana
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}5️⃣  GET /api/energy/week${NC}"
echo "Obtendo histórico da semana..."

curl -s -X GET "$API_BASE/week" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Erro na requisição"
echo -e "\n"

# ═══════════════════════════════════════════════════════════════════════════
# 6. Criar Entrada de Diário
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}6️⃣  POST /api/diary/entry${NC}"
echo "Criando entrada de diário com estados emocionais..."

DIARY=$(curl -s -X POST "$API_BASE/diary/entry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"content\": \"Dia muito produtivo! Consegui finalizar o projeto e ainda tive energia para conversar com o time. Sinto-me realizado e confiante sobre os próximos passos.\",
    \"emotionalStates\": [\"alegre\", \"confiante\", \"grato\"],
    \"linkedEnergyMorning\": \"$MORNING_ID\",
    \"linkedEnergyAfternoon\": \"$AFTERNOON_ID\"
  }")

echo "Resposta:"
echo "$DIARY" | jq '.' 2>/dev/null || echo "$DIARY"

DIARY_ID=$(echo "$DIARY" | jq -r '.data.id' 2>/dev/null)
echo -e "ID do diário: ${GREEN}$DIARY_ID${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════
# 7. Obter Diário de Hoje
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}7️⃣  GET /api/diary/today${NC}"
echo "Obtendo diário de hoje..."

curl -s -X GET "$API_BASE/diary/today" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Erro na requisição"
echo -e "\n"

# ═══════════════════════════════════════════════════════════════════════════
# 8. Obter Histórico de Diários (Semana)
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}8️⃣  GET /api/diary/week${NC}"
echo "Obtendo histórico de diários..."

curl -s -X GET "$API_BASE/diary/week" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Erro na requisição"
echo -e "\n"

# ═══════════════════════════════════════════════════════════════════════════
# 9. Criar Ritual
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}9️⃣  POST /api/rituals${NC}"
echo "Criando novo ritual..."

RITUAL=$(curl -s -X POST "$API_BASE/rituals" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Manhã Focada",
    "description": "Manhã dedicada a foco profundo com café e meditação",
    "morningEnergy": "foco_profundo",
    "afternoonEnergy": "administrativo",
    "eveningStates": ["calmo", "grato"],
    "frequency": "4-5 vezes por semana",
    "detectionScore": 0.85,
    "efficiencyScore": 0.78
  }')

echo "Resposta:"
echo "$RITUAL" | jq '.' 2>/dev/null || echo "$RITUAL"

RITUAL_ID=$(echo "$RITUAL" | jq -r '.data.id' 2>/dev/null)
echo -e "ID do ritual: ${GREEN}$RITUAL_ID${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════
# 10. Obter Rituais
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}🔟 GET /api/rituals${NC}"
echo "Obtendo todos os rituais..."

curl -s -X GET "$API_BASE/rituals" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Erro na requisição"
echo -e "\n"

# ═══════════════════════════════════════════════════════════════════════════
# 11. Atualizar Ritual
# ═══════════════════════════════════════════════════════════════════════════

if [ ! -z "$RITUAL_ID" ] && [ "$RITUAL_ID" != "null" ]; then
  echo -e "${YELLOW}1️⃣1️⃣ PATCH /api/rituals/:id${NC}"
  echo "Atualizando ritual..."

  curl -s -X PATCH "$API_BASE/rituals/$RITUAL_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "isActive": true,
      "reminderTime": "06:00"
    }' | jq '.' 2>/dev/null || echo "Erro na requisição"
  echo -e "\n"
fi

# ═══════════════════════════════════════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}✅ Testes Completos!${NC}\n"
echo "📋 Resumo:"
echo "  • Check-in Manhã: $MORNING_ID"
echo "  • Check-in Tarde: $AFTERNOON_ID"
echo "  • Diário: $DIARY_ID"
echo "  • Ritual: $RITUAL_ID"
echo -e "\n${YELLOW}💡 Próximos passos:${NC}"
echo "  1. Verifique os dados no banco de dados"
echo "  2. Teste os endpoints via interface gráfica"
echo "  3. Implemente a detecção de padrões (Fase 12b)"

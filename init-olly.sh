#!/bin/bash

# Script para inicializar o Olly no Prana
# Uso: chmod +x init-olly.sh && ./init-olly.sh

set -e

echo "🚀 Inicializando Olly Integration..."
echo ""

# 1. Verificar variáveis de ambiente
echo "📋 Checando variáveis de ambiente..."
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL não definida"
  echo "Usando arquivo .env local..."
  source .env
fi

if [ -z "$VITE_OLLY_API_URL" ]; then
  echo "❌ VITE_OLLY_API_URL não definida no .env"
  exit 1
fi

echo "✅ DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "✅ VITE_OLLY_API_URL: $VITE_OLLY_API_URL"
echo ""

# 2. Criar tabelas
echo "🗄️  Criando tabelas do Olly..."
if node setup-olly-db.js; then
  echo "✅ Tabelas criadas com sucesso"
else
  echo "❌ Erro ao criar tabelas"
  exit 1
fi
echo ""

# 3. Instalar dependências (se necessário)
echo "📦 Verificando dependências..."
if ! npm list pg > /dev/null 2>&1; then
  echo "⚙️  Instalando pg..."
  npm install pg
fi
echo "✅ Dependências OK"
echo ""

# 4. Verificar conexão com Olly API
echo "🔗 Testando conexão com Olly API..."
OLLY_TEST=$(curl -s -o /dev/null -w "%{http_code}" "$VITE_OLLY_API_URL/api/health" 2>/dev/null || echo "000")

if [ "$OLLY_TEST" = "200" ]; then
  echo "✅ Olly API está acessível"
elif [ "$OLLY_TEST" = "404" ]; then
  echo "⚠️  Olly API respondeu (404 é esperado se não houver rota /health)"
else
  echo "⚠️  Olly API pode estar indisponível (código: $OLLY_TEST)"
fi
echo ""

# 5. Resumo
echo "🎉 =========================================="
echo "✅ OLLY INTEGRATION INICIALIZADO COM SUCESSO!"
echo "==========================================="
echo ""
echo "📌 Próximos passos:"
echo "   1. Abra src/main.jsx"
echo "   2. Adicione <OllyProvider> ao App"
echo "   3. Use componentes:"
echo "      • OllyChatPanel"
echo "      • OllyCampaignAnalyzer"
echo "   4. Ou use hooks:"
echo "      • useOlly()"
echo "      • useOllyIntegration()"
echo ""
echo "📚 Documentação: OLLY_INTEGRATION_GUIDE.md"
echo ""

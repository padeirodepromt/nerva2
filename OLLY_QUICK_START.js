/**
 * QUICK START - Integração do Olly no Prana
 * 
 * Siga estes passos para começar a usar Olly em sua aplicação
 */

// ============================================
// PASSO 1: Crie as tabelas do banco de dados
// ============================================
/*
Execute este comando no terminal:
  node setup-olly-db.js

Esperado:
  ✅ TABELAS DO OLLY CONFIGURADAS COM SUCESSO!
  ✅ Total de 9 tabelas criadas
  ✅ 14 índices criados
  ✅ 2 triggers criados
*/

// ============================================
// PASSO 2: Configure o OllyProvider no App
// ============================================
/*
Arquivo: src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { OllyProvider } from '@/contexts/OllyContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OllyProvider>
      <App />
    </OllyProvider>
  </React.StrictMode>,
)
*/

// ============================================
// PASSO 3: Use em seus componentes
// ============================================

// Exemplo 1: Chat Simples
import { useOlly } from '@/contexts/OllyContext'

function MeuChat() {
  const { chat, messages, isLoading } = useOlly()

  const handleEnviar = async () => {
    await chat('Qual é o ROI da minha campanha?')
  }

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      <button onClick={handleEnviar} disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  )
}

// Exemplo 2: Análise de Campanha
import { OllyCampaignAnalyzer } from '@/components/olly/OllyCampaignAnalyzer'

function MinhasPaginaCampanhas() {
  return (
    <div>
      <h1>Análise de Campanha</h1>
      <OllyCampaignAnalyzer campaignId="camp_123" />
    </div>
  )
}

// Exemplo 3: Chat Completo
import { OllyChatPanel } from '@/components/olly/OllyChatPanel'

function PainelChat() {
  return <OllyChatPanel campaignId="camp_123" />
}

// Exemplo 4: Hook de Integração
import { useOllyIntegration } from '@/hooks/useOllyIntegration'

function AnaliseAvancada() {
  const { analyzeCampaign, applyAllOptimizations } = useOllyIntegration()

  const handleAnalisar = async () => {
    const { analysis, optimizations } = await analyzeCampaign('camp_123')
    console.log('Score:', analysis.results.performanceScore)
    console.log('Otimizações:', optimizations)

    // Aplicar todas as otimizações
    const resultados = await applyAllOptimizations(optimizations)
    console.log('Aplicadas:', resultados)
  }

  return <button onClick={handleAnalisar}>Analisar e Otimizar</button>
}

// ============================================
// PASSO 4: Verificação do Ambiente
// ============================================
/*
Certifique-se de que .env tem:
  DATABASE_URL=postgresql://...
  VITE_OLLY_API_URL=https://gracious-hope-production.up.railway.app

Use o script automatizado:
  chmod +x init-olly.sh
  ./init-olly.sh
*/

// ============================================
// REFERÊNCIA RÁPIDA DE MÉTODOS
// ============================================
/*
useOlly() retorna:
  - chat(message): Enviar mensagem
  - analyzeFile(file, platform): Analisar arquivo
  - getCampaigns(): Listar campanhas
  - createAnalysis(campaignId, type): Criar análise
  - getOptimizations(campaignId): Obter sugestões
  - applyOptimization(id): Aplicar sugestão
  - startSession(metadata): Iniciar sessão
  - endSession(): Finalizar sessão
  - isLoading: Boolean
  - error: String | null
  - messages: Array
  - campaigns: Array

useOllyIntegration() retorna:
  - analyzeCampaign(campaignId): Análise + otimizações
  - chatWithContext(message, campaignId): Chat contextualizado
  - applyAllOptimizations(optimizations): Aplicar em lote
  - clearCache(): Limpar cache
  - hasCachedAnalysis(campaignId): Verificar cache
  - getCachedAnalysis(campaignId): Obter do cache
  + todos os métodos de useOlly()
*/

// ============================================
// COMPONENTES PRONTOS
// ============================================
/*
<OllyChatPanel campaignId="camp_123" />
  → Painel completo de chat com upload

<OllyCampaignAnalyzer campaignId="camp_123" />
  → Análise automática e otimizações
*/

// ============================================
// TROUBLESHOOTING
// ============================================
/*
Erro: "DATABASE_URL não definido"
  → Verifique .env e reinicie o servidor

Erro: "Falha ao conectar ao Olly API"
  → Verifique VITE_OLLY_API_URL no .env
  → Teste: curl https://gracious-hope-production.up.railway.app

Erro: "Tabelas não encontradas"
  → Execute: node setup-olly-db.js

Performance lenta:
  → Use useOllyIntegration() para cache automático
  → Chame clearCache() quando dados mudarem
*/

export default {}

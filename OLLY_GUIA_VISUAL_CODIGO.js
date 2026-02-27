/**
 * 🎬 OLLY INTEGRATION - GUIA VISUAL EM CÓDIGO
 * 
 * Este arquivo mostra EXATAMENTE o que fazer, passo a passo
 * Copie e cole os códigos aqui nos seus arquivos!
 */

// ====================================================================
// PASSO 1: EXECUTAR COMANDO NO TERMINAL
// ====================================================================

/*
Abra um terminal e execute:

  node setup-olly-db.js

Esperado:
  ✅ TABELAS DO OLLY CONFIGURADAS COM SUCESSO!

Se der erro, cheque:
  - .env tem DATABASE_URL?
  - PostgreSQL está rodando?
*/

// ====================================================================
// PASSO 2: EDITAR src/main.jsx
// ====================================================================

/*
ARQUIVO: src/main.jsx

ANTES:
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/*
DEPOIS (adicione a import):
*/
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { OllyProvider } from '@/contexts/OllyContext'  // <-- ADICIONE ISTO

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OllyProvider>  {/* <-- ADICIONE ISTO */}
      <App />
    </OllyProvider>  {/* <-- ADICIONE ISTO */}
  </React.StrictMode>,
)

// ====================================================================
// PASSO 3: INICIAR SERVIDOR
// ====================================================================

/*
No terminal:
  npm run dev

Abra:
  http://localhost:5173
*/

// ====================================================================
// PASSO 4: USAR EM SEUS COMPONENTES
// ====================================================================

// OPÇÃO 1: Chat Simples
// ─────────────────────────────────────────────────────────────────

import { useOlly } from '@/contexts/OllyContext'

export default function ChatSimples() {
  const { chat, messages, isLoading } = useOlly()

  const handleEnviar = async () => {
    await chat('Olá Olly! Como estou?')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat Simples</h1>
      
      <div style={{ marginBottom: '20px', maxHeight: '300px', overflow: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <strong>{msg.role === 'user' ? 'Você' : 'Olly'}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={handleEnviar} 
        disabled={isLoading}
        style={{ padding: '10px 20px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
      >
        {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────

// OPÇÃO 2: Painel de Chat Completo
// ─────────────────────────────────────────────────────────────────

import { OllyChatPanel } from '@/components/olly/OllyChatPanel'

export default function MeuChat() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <h1>Chat com Olly - Completo</h1>
      <OllyChatPanel campaignId="minha_campanha_id" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────

// OPÇÃO 3: Análise de Campanha
// ─────────────────────────────────────────────────────────────────

import { OllyCampaignAnalyzer } from '@/components/olly/OllyCampaignAnalyzer'

export default function MinhaAnalise() {
  return (
    <div>
      <h1>Análise Automática da Campanha</h1>
      <OllyCampaignAnalyzer campaignId="minha_campanha_id" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────

// OPÇÃO 4: Chat + Análise Juntos
// ─────────────────────────────────────────────────────────────────

import { OllyChatPanel } from '@/components/olly/OllyChatPanel'
import { OllyCampaignAnalyzer } from '@/components/olly/OllyCampaignAnalyzer'

export default function DashboardCompleto() {
  const campaignId = 'minha_campanha_id'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <h2>Chat</h2>
        <OllyChatPanel campaignId={campaignId} />
      </div>
      
      <div>
        <h2>Análise</h2>
        <OllyCampaignAnalyzer campaignId={campaignId} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────

// OPÇÃO 5: Usar Hook Helper
// ─────────────────────────────────────────────────────────────────

import { useOllyIntegration } from '@/hooks/useOllyIntegration'

export default function AnaliseAvancada() {
  const { 
    analyzeCampaign, 
    chatWithContext, 
    applyAllOptimizations 
  } = useOllyIntegration()

  const handleAnalisarTudo = async () => {
    // 1. Analisar campanha
    const { analysis, optimizations } = await analyzeCampaign('minha_campanha_id')
    console.log('Performance:', analysis.results.performanceScore)
    
    // 2. Chat contextualizado
    await chatWithContext('Como posso melhorar?', 'minha_campanha_id')
    
    // 3. Aplicar todas as otimizações
    const resultados = await applyAllOptimizations(optimizations)
    console.log('Otimizações aplicadas:', resultados)
  }

  return (
    <button onClick={handleAnalisarTudo}>
      Analisar e Otimizar Tudo
    </button>
  )
}

// ====================================================================
// MÉTODOS DISPONÍVEIS (useOlly)
// ====================================================================

/*
const {
  // CHAT
  chat(message),                    // Enviar mensagem
  startSession(metadata),           // Iniciar sessão
  endSession(),                     // Finalizar sessão
  
  // ARQUIVOS
  analyzeFile(file, platform),      // Analisar arquivo
  
  // CAMPANHAS
  getCampaigns(),                   // Listar campanhas
  
  // ANÁLISES
  createAnalysis(campaignId, type), // Criar análise
  getOptimizations(campaignId),     // Obter sugestões
  applyOptimization(id),            // Aplicar sugestão
  
  // STATE
  messages,                         // Histórico de mensagens
  isLoading,                        // Está carregando?
  error,                            // Mensagem de erro
  campaigns,                        // Lista de campanhas
  currentSession                    // Sessão atual
} = useOlly()
*/

// ====================================================================
// MÉTODOS DISPONÍVEIS (useOllyIntegration)
// ====================================================================

/*
const {
  // TEM TODOS OS MÉTODOS DE useOlly() ACIMA, MAIS:
  
  analyzeCampaign(campaignId),      // Análise + otimizações (com cache)
  chatWithContext(message, campaignId), // Chat contextualizado
  applyAllOptimizations(optimizations), // Aplicar em lote
  clearCache(),                     // Limpar cache
  hasCachedAnalysis(campaignId),    // Verificar cache
  getCachedAnalysis(campaignId)     // Obter do cache
} = useOllyIntegration()
*/

// ====================================================================
// EXEMPLOS DE USO REAL
// ====================================================================

// EXEMPLO 1: Componente que envia mensagem ao montar
// ─────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { useOlly } from '@/contexts/OllyContext'

export default function ChatAutomatic() {
  const { chat } = useOlly()

  useEffect(() => {
    // Enviar mensagem automática ao carregar
    chat('Olá! Pode analisar minha campanha?')
  }, [])

  return <div>Chat automático enviado!</div>
}

// EXEMPLO 2: Componente que carrega análise ao montar
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useOllyIntegration } from '@/hooks/useOllyIntegration'

export default function AnaliseAutomatica() {
  const { analyzeCampaign } = useOllyIntegration()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarAnalise = async () => {
      try {
        const resultado = await analyzeCampaign('minha_campanha_id')
        setAnalysis(resultado)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarAnalise()
  }, [])

  if (loading) return <div>Carregando análise...</div>
  if (!analysis) return <div>Erro ao carregar</div>

  return (
    <div>
      <h2>Análise da Campanha</h2>
      <p>Performance Score: {analysis.analysis.results.performanceScore}%</p>
      <p>Otimizações sugeridas: {analysis.optimizations.length}</p>
    </div>
  )
}

// EXEMPLO 3: Componente que reage a input do usuário
// ─────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useOlly } from '@/contexts/OllyContext'

export default function ChatInterativo() {
  const { chat, messages, isLoading } = useOlly()
  const [input, setInput] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    await chat(input)
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Pergunte algo..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>

      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
    </form>
  )
}

// ====================================================================
// DICAS IMPORTANTES
// ====================================================================

/*
1. Certifique-se de que tudo está envolvido com <OllyProvider>
   - Se esquecer, useOlly() retornará undefined

2. campaignId pode ser qualquer string identificadora
   - "camp_123"
   - "meta_ads_jan_2024"
   - "google_ads_campaign"
   - etc

3. Sempre tratar erros com try/catch
   - const { error } = useOlly() também mostra erros

4. Cache automático ajuda performance
   - Não roda análise duas vezes automaticamente
   - Use clearCache() se dados mudarem

5. Loading states são importantes
   - isLoading indica se algo está sendo processado
   - Desabilite botões enquanto isLoading é true
*/

// ====================================================================
// CHECKLIST DE IMPLEMENTAÇÃO
// ====================================================================

/*
✅ Passo 1: node setup-olly-db.js
✅ Passo 2: Adicionar OllyProvider em src/main.jsx
✅ Passo 3: npm run dev
✅ Passo 4: Testar na página de exemplo
✅ Passo 5: Usar em seus próprios componentes

Quando terminar:
  - Você tem chat funcionando
  - Você tem análise de campanhas funcionando
  - Você tem otimizações sugeridas funcionando
  - Tudo integrado no seu app!
*/

// ====================================================================

export default function GuiaOlly() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🎉 Integração Olly Pronta!</h1>
      <p>Agora você pode usar:</p>
      <ul style={{ textAlign: 'left', display: 'inline-block' }}>
        <li>✅ useOlly() - Para controle total</li>
        <li>✅ useOllyIntegration() - Para facilidade</li>
        <li>✅ &lt;OllyChatPanel /&gt; - Chat pronto</li>
        <li>✅ &lt;OllyCampaignAnalyzer /&gt; - Análise pronta</li>
      </ul>
      <p style={{ marginTop: '30px' }}>
        Copie os exemplos acima e comece a usar! 🚀
      </p>
    </div>
  )
}

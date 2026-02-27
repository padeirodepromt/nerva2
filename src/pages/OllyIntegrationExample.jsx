/**
 * src/pages/OllyIntegrationExample.jsx
 * 
 * Página de exemplo mostrando todas as features do Olly integrado
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OllyChatPanel } from '@/components/olly/OllyChatPanel';
import { OllyCampaignAnalyzer } from '@/components/olly/OllyCampaignAnalyzer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  BarChart3,
  Zap,
  Code
} from '@/components/icons/PranaLandscapeIcons';

export default function OllyIntegrationExample() {
  const [selectedTab, setSelectedTab] = useState('chat');
  const [demoMode, setDemoMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          🤖 Olly no Prana
        </h1>
        <p className="text-lg text-white/70">
          Análise inteligente e otimização de campanhas de marketing
        </p>
      </motion.div>

      {/* Demo Notice */}
      {demoMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-6"
        >
          <p className="text-blue-400">
            💡 Modo demonstração ativo. Use os componentes abaixo para explorar as funcionalidades.
          </p>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="docs" className="gap-2">
            <Code className="w-4 h-4" />
            Documentação
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">Chat com Olly</h2>
              <p className="text-white/70">
                Converse com Olly sobre suas campanhas e obtenha insights automáticos.
              </p>
            </div>

            <OllyChatPanel />

            {/* Exemplo de uso */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Exemplo de Código</h3>
              <pre className="bg-gray-900/50 p-4 rounded overflow-auto text-xs text-white/80">
{`import { useOlly } from '@/contexts/OllyContext'

function MeuComponente() {
  const { chat, isLoading, messages } = useOlly();

  const handleChat = async () => {
    await chat('Analise minha campanha Meta');
  };

  return (
    <button onClick={handleChat} disabled={isLoading}>
      {isLoading ? 'Enviando...' : 'Falar com Olly'}
    </button>
  );
}`}
              </pre>
            </div>
          </motion.div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">Análise de Campanha</h2>
              <p className="text-white/70">
                Olly analisa automaticamente sua campanha e sugere otimizações.
              </p>
            </div>

            {/* Usar campaignId fictício para demo */}
            <OllyCampaignAnalyzer campaignId="demo_campaign_001" />

            {/* Exemplo de uso */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Exemplo de Código</h3>
              <pre className="bg-gray-900/50 p-4 rounded overflow-auto text-xs text-white/80">
{`import { useOllyIntegration } from '@/hooks/useOllyIntegration'

function MinhasCampanhas() {
  const { analyzeCampaign, applyAllOptimizations } = useOllyIntegration();

  const handleAnalyze = async () => {
    const { analysis, optimizations } = await analyzeCampaign('campaign_id');
    console.log('Score:', analysis.results.performanceScore);
  };

  return (
    <button onClick={handleAnalyze}>Analisar</button>
  );
}`}
              </pre>
            </div>
          </motion.div>
        </TabsContent>

        {/* Docs Tab */}
        <TabsContent value="docs" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Features Disponíveis</h3>

              <div className="space-y-3">
                {[
                  {
                    title: 'Chat em Tempo Real',
                    desc: 'Converse com Olly sobre suas campanhas'
                  },
                  {
                    title: 'Análise Automática',
                    desc: 'Análise inteligente de performance de campanhas'
                  },
                  {
                    title: 'Otimizações Sugeridas',
                    desc: 'Recomendações acionáveis para melhorar ROI'
                  },
                  {
                    title: 'Upload de Arquivos',
                    desc: 'Analise dados CSV, JSON ou XLSX'
                  },
                  {
                    title: 'Histórico de Mensagens',
                    desc: 'Contexto mantido entre mensagens'
                  },
                  {
                    title: 'Multi-plataforma',
                    desc: 'Suporte para Meta Ads, Google Ads, TikTok, LinkedIn'
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-sm text-white/70">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Hooks Disponíveis</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-indigo-400 mb-2">useOlly()</h4>
                  <p className="text-sm text-white/70 mb-2">
                    Hook principal para acessar todas as funcionalidades do Olly.
                  </p>
                  <ul className="text-xs text-white/60 space-y-1 ml-4">
                    <li>• startSession(metadata)</li>
                    <li>• chat(message)</li>
                    <li>• analyzeFile(file, platform)</li>
                    <li>• getCampaigns()</li>
                    <li>• createAnalysis(campaignId, type)</li>
                    <li>• getOptimizations(campaignId)</li>
                    <li>• applyOptimization(id)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-indigo-400 mb-2">useOllyIntegration()</h4>
                  <p className="text-sm text-white/70 mb-2">
                    Hook wrapper com funcionalidades helper adicionais.
                  </p>
                  <ul className="text-xs text-white/60 space-y-1 ml-4">
                    <li>• analyzeCampaign(campaignId)</li>
                    <li>• chatWithContext(message, campaignId)</li>
                    <li>• applyAllOptimizations(optimizations)</li>
                    <li>• clearCache()</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Componentes Prontos</h3>

              <div className="space-y-3">
                <div>
                  <h4 className="font-mono text-indigo-400 mb-1">
                    &lt;OllyChatPanel /&gt;
                  </h4>
                  <p className="text-sm text-white/70">
                    Painel completo de chat com upload de arquivos integrado.
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-indigo-400 mb-1">
                    &lt;OllyCampaignAnalyzer /&gt;
                  </h4>
                  <p className="text-sm text-white/70">
                    Analisador automático de campanhas com métricas e otimizações.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">📚 Documentação Completa</h3>
              <p className="text-sm text-blue-300/80">
                Veja <code className="bg-black/20 px-2 py-1 rounded">OLLY_INTEGRATION_GUIDE.md</code> para
                documentação detalhada, exemplos e troubleshooting.
              </p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 border-t border-white/10 pt-8 text-center"
      >
        <p className="text-white/70 text-sm">
          🚀 Olly Integration v1.0 • Pronto para Produção
        </p>
      </motion.div>
    </div>
  );
}

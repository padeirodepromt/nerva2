/**
 * src/components/olly/OllyCampaignAnalyzer.jsx
 * 
 * Componente para análise e otimização de campanhas com Olly
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOlly } from '@/contexts/OllyContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw
} from '@/components/icons/PranaLandscapeIcons';

export const OllyCampaignAnalyzer = ({ campaignId }) => {
  const { 
    createAnalysis, 
    getOptimizations, 
    applyOptimization,
    isLoading 
  } = useOlly();

  const [analysis, setAnalysis] = useState(null);
  const [optimizations, setOptimizations] = useState([]);
  const [selectedOptimizations, setSelectedOptimizations] = useState(new Set());
  const [analyzing, setAnalyzing] = useState(false);
  const [appliedOptimizations, setAppliedOptimizations] = useState(new Set());

  // Análise automática ao montar
  useEffect(() => {
    performAnalysis();
  }, [campaignId]);

  const performAnalysis = async () => {
    try {
      setAnalyzing(true);

      // Executar análise
      const analysisResult = await createAnalysis(campaignId, 'comprehensive');
      setAnalysis(analysisResult);

      // Carregar otimizações
      const opts = await getOptimizations(campaignId);
      setOptimizations(opts);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyOptimization = async (optimizationId) => {
    try {
      setAppliedOptimizations(prev => new Set([...prev, optimizationId]));

      await applyOptimization(optimizationId);

      // Remover de otimizações sugeridas
      setOptimizations(prev =>
        prev.filter(opt => opt.id !== optimizationId)
      );
    } catch (error) {
      console.error('Erro ao aplicar otimização:', error);
      setAppliedOptimizations(prev => {
        const newSet = new Set(prev);
        newSet.delete(optimizationId);
        return newSet;
      });
    }
  };

  const toggleOptimizationSelection = (id) => {
    setSelectedOptimizations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const applySelectedOptimizations = async () => {
    for (const id of selectedOptimizations) {
      await handleApplyOptimization(id);
    }
    setSelectedOptimizations(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Análise da Campanha</h2>
          <p className="text-sm text-white/70">Otimizações sugeridas por Olly</p>
        </div>
        <Button
          onClick={performAnalysis}
          disabled={analyzing || isLoading}
          className="gap-2"
          variant={analyzing ? 'secondary' : 'default'}
        >
          {analyzing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Nova Análise
            </>
          )}
        </Button>
      </div>

      {/* Métricas de Análise */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Score de Performance */}
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">Performance</h3>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">
              {analysis.results?.performanceScore || 0}%
            </p>
            <p className="text-xs text-white/60 mt-2">
              {analysis.results?.performanceLabel || 'Bom desempenho'}
            </p>
          </div>

          {/* ROI Potencial */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">ROI Potencial</h3>
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              +{analysis.results?.potentialRoiIncrease || 0}%
            </p>
            <p className="text-xs text-white/60 mt-2">
              Com as otimizações aplicadas
            </p>
          </div>

          {/* Saúde Geral */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">Saúde Geral</h3>
              <CheckCircle className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {analysis.results?.overallHealth || 'Bom'}
            </p>
            <p className="text-xs text-white/60 mt-2">
              {analysis.results?.issueCount || 0} problemas identificados
            </p>
          </div>
        </motion.div>
      )}

      {/* Otimizações Sugeridas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Otimizações Sugeridas ({optimizations.length})
          </h3>
          {selectedOptimizations.size > 0 && (
            <Button
              onClick={applySelectedOptimizations}
              size="sm"
              variant="success"
              disabled={isLoading}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Aplicar {selectedOptimizations.size}
            </Button>
          )}
        </div>

        {optimizations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-lg p-8 text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Campanha Otimizada!</p>
            <p className="text-white/70 text-sm">Nenhuma otimização pendente no momento.</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {optimizations.map((opt, idx) => (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedOptimizations.has(opt.id)}
                    onChange={() => toggleOptimizationSelection(opt.id)}
                    className="w-4 h-4 mt-1 cursor-pointer"
                  />

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-white">
                        {opt.suggestions?.title || 'Otimização'}
                      </h4>
                      <Badge variant={opt.priority === 'high' ? 'destructive' : 'secondary'}>
                        {opt.priority === 'high' ? 'Alto' : opt.priority === 'medium' ? 'Médio' : 'Baixo'}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/70 mb-3">
                      {opt.suggestions?.description}
                    </p>

                    {opt.suggestions?.impact && (
                      <div className="text-xs text-white/60 mb-3 p-2 bg-white/5 rounded">
                        <strong>Impacto esperado:</strong> {opt.suggestions.impact}
                      </div>
                    )}

                    <button
                      onClick={() => handleApplyOptimization(opt.id)}
                      disabled={isLoading || appliedOptimizations.has(opt.id)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-white/40 transition-colors"
                    >
                      {appliedOptimizations.has(opt.id) ? '✓ Aplicado' : 'Aplicar agora'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Avisos / Issues */}
      {analysis?.results?.issues && analysis.results.issues.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Problemas Detectados ({analysis.results.issues.length})
          </h3>

          <div className="space-y-2">
            {analysis.results.issues.map((issue, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-red-600/10 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-sm text-red-400 font-semibold">{issue.title}</p>
                <p className="text-xs text-red-300/70 mt-1">{issue.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OllyCampaignAnalyzer;

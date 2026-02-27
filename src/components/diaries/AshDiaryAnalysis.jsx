/* src/components/diaries/AshDiaryAnalysis.jsx
   desc: Integração com Ash para análise de padrões em diários
   feat: Detecta padrões de energia/humor, emite insights e recomendações
*/
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslations } from '@/components/LanguageProvider';
import { Button } from '@/components/ui/button';
import { IconBrainCircuit, IconLoader2, IconRefreshCw, IconCheckCircle, IconAlertTriangle } from '@/components/icons/PranaLandscapeIcons';

export const AshDiaryAnalysis = ({ diaries = [], user }) => {
  const { t } = useTranslations();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    if (diaries.length === 0) {
      toast.warning(t('diary_no_data') || 'Nenhum diário para analisar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ash/analyze-diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diaries: diaries.map(d => ({
            id: d.id,
            title: d.title,
            content: d.content,
            energyLevel: d.energyLevel,
            mood: d.mood,
            tags: d.tags,
            insights: d.insights,
            createdAt: d.createdAt
          })),
          userId: user?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        toast.success(t('analysis_complete') || 'Análise concluída!');
      } else {
        throw new Error('Falha na análise');
      }
    } catch (e) {
      console.error('Analysis error:', e);
      setError(t('analysis_error') || 'Erro ao analisar diários');
      toast.error(t('analysis_error') || 'Erro ao analisar diários');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-purple-500/20 bg-black/30 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-600/40 border border-purple-500/30">
            <IconBrainCircuit className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-100">✨ {t('ash_analysis') || 'Análise do Ash'}</h3>
            <p className="text-xs text-purple-200/60">Inteligência artificial detectando padrões</p>
          </div>
        </div>

        <Button
          onClick={runAnalysis}
          disabled={loading || diaries.length === 0}
          className="gap-2"
        >
          {loading ? (
            <>
              <IconLoader2 className="w-4 h-4 animate-spin" />
              {t('analyzing') || 'Analisando...'}
            </>
          ) : (
            <>
              <IconRefreshCw className="w-4 h-4" />
              {t('run_analysis') || 'Analisar'}
            </>
          )}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 rounded border border-red-500/30 bg-red-500/10 flex items-start gap-3">
          <IconAlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">{t('error') || 'Erro'}</p>
            <p className="text-xs text-red-200/70">{error}</p>
          </div>
        </div>
      )}

      {/* No Analysis Yet */}
      {!analysis && !loading && (
        <div className="p-6 rounded bg-purple-500/5 border border-purple-500/20 text-center space-y-3">
          <IconBrainCircuit className="w-8 h-8 text-purple-300/40 mx-auto" />
          <p className="text-sm text-purple-200/60">
            {t('click_analyze') || 'Clique em "Analisar" para que o Ash examine seus diários'}
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Energy Patterns */}
          {analysis.energyPatterns && (
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-emerald-300">
                <span>⚡</span> {t('energy_patterns') || 'Padrões de Energia'}
              </h4>
              <p className="text-sm text-emerald-200/80">{analysis.energyPatterns}</p>
            </div>
          )}

          {/* Mood Patterns */}
          {analysis.moodPatterns && (
            <div className="p-3 rounded bg-pink-500/10 border border-pink-500/20 space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-pink-300">
                <span>😊</span> {t('mood_patterns') || 'Padrões de Humor'}
              </h4>
              <p className="text-sm text-pink-200/80">{analysis.moodPatterns}</p>
            </div>
          )}

          {/* Key Insights */}
          {analysis.keyInsights && analysis.keyInsights.length > 0 && (
            <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20 space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-yellow-300">
                <span>💡</span> {t('key_insights') || 'Insights Chave'}
              </h4>
              <ul className="space-y-1">
                {analysis.keyInsights.map((insight, i) => (
                  <li key={i} className="text-sm text-yellow-200/80 flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="p-3 rounded bg-purple-500/10 border border-purple-500/20 space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-purple-300">
                <span>🎯</span> {t('recommendations') || 'Recomendações'}
              </h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-purple-200/80 flex items-start gap-2">
                    <IconCheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings (if any) */}
          {analysis.warnings && analysis.warnings.length > 0 && (
            <div className="p-3 rounded bg-orange-500/10 border border-orange-500/20 space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-orange-300">
                <span>⚠️</span> {t('warnings') || 'Alertas'}
              </h4>
              <ul className="space-y-1">
                {analysis.warnings.map((warn, i) => (
                  <li key={i} className="text-sm text-orange-200/80 flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">!</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-purple-200/40 text-right">
            {t('analyzed_at') || 'Analisado em'} {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

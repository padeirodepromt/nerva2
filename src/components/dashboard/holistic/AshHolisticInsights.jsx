/* src/components/dashboard/holistic/AshHolisticInsights.jsx
   desc: Card com insights do Ash sobre padrões holisticos
*/

import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { IconWind, IconNexus } from '@/components/icons/PranaLandscapeIcons';
import { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';

export default function AshHolisticInsights({ stats = {} }) {
  const { t } = useTranslations();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('prana_auth_user_id');
        if (!userId) {
          setInsights([]);
          return;
        }

        const response = await Promise.race([
          apiClient.get('/ai/holistic-analysis/insights', {
            params: { userId }
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);

        const data = response?.data?.data;
        setInsights(data?.insights || []);
      } catch (error) {
        console.warn('[AshHolisticInsights] Insights indisponíveis:', error.message);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [stats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-glass-pure p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 col-span-1 md:col-span-1"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 mt-1">
          <IconWind className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Leituras Holísticas do Ash
          </h3>
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            Como sua energia vem se movendo nos últimos dias
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-xs text-muted-foreground/50 italic">
            Acessando os padrões do seu ciclo, energia e diário...
          </div>
        ) : insights && insights.length > 0 ? (
          insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-100 leading-relaxed"
            >
              {insight}
            </motion.div>
          ))
        ) : (
          <div className="text-xs text-muted-foreground/50 italic">
            Quando você registra sua energia e seus dias, o Ash consegue enxergar padrões e cuidar melhor do seu ritmo.
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        className="mt-4 w-full px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 text-xs font-semibold uppercase transition-all"
      >
        Ver mapa detalhado da sua semana
      </motion.button>
    </motion.div>
  );
}

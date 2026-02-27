/* src/components/diaries/EnergyStatsCard.jsx
   desc: Card que exibe estatísticas de energia (média, máx, mín, distribuição)
*/
import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { IconGrowth, IconZap } from '@/components/icons/PranaLandscapeIcons';

const ENERGY_COLORS = {
  1: 'from-red-600 to-red-700',
  2: 'from-orange-600 to-orange-700',
  3: 'from-yellow-600 to-yellow-700',
  4: 'from-lime-600 to-lime-700',
  5: 'from-emerald-600 to-emerald-700'
};

export const EnergyStatsCard = ({ diaries = [] }) => {
  const { t } = useTranslations();

  if (diaries.length === 0) return null;

  // Calcular stats
  const energies = diaries.filter(d => d.energyLevel).map(d => d.energyLevel);
  const average = energies.length > 0 ? (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1) : 0;
  const max = Math.max(...energies, 0);
  const min = Math.min(...energies, 5);

  // Distribuição
  const distribution = {
    1: energies.filter(e => e === 1).length,
    2: energies.filter(e => e === 2).length,
    3: energies.filter(e => e === 3).length,
    4: energies.filter(e => e === 4).length,
    5: energies.filter(e => e === 5).length
  };

  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-purple-500/20 bg-black/30 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
          <IconZap className="w-5 h-5 text-emerald-300" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-100">{t('energy_level') || 'Nível de Energia'}</h3>
          <p className="text-xs text-purple-200/60">{energies.length} registros</p>
        </div>
      </div>

      {/* Main Metric */}
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-emerald-300">{average}</span>
        <span className="text-sm text-purple-200/60 mb-1">/ 5.0</span>
      </div>

      {/* Min/Max */}
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xs text-purple-200/60">{t('maximum') || 'Máximo'}</p>
          <p className="text-lg font-semibold text-emerald-300">{max}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs text-purple-200/60">{t('minimum') || 'Mínimo'}</p>
          <p className="text-lg font-semibold text-red-300">{min}</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="space-y-2">
        <p className="text-xs text-purple-200/60">{t('distribution') || 'Distribuição'}</p>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((level) => (
            <div key={level} className="flex items-center gap-2">
              <span className="text-xs text-purple-200/60 w-6">{level}</span>
              <div className="flex-1 h-2 rounded-full bg-black/50 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(distribution[level] / maxCount) * 100}%` }}
                  transition={{ delay: 0.1 * (5 - level), duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${ENERGY_COLORS[level]}`}
                />
              </div>
              <span className="text-xs text-purple-200/60 w-6">{distribution[level]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-xs text-emerald-200">
          💡 {average >= 4 ? '⚡ Energia alta! Aproveite para projetos importantes.' :
               average >= 3 ? '✓ Energia equilibrada. Bom para tarefas rotineiras.' :
               '⚠️ Energia baixa. Considere descansar ou atividades relaxantes.'}
        </p>
      </div>
    </motion.div>
  );
};

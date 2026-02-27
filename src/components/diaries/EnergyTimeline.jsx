/* src/components/diaries/EnergyTimeline.jsx
   desc: Gráfico de linha mostrando evolução de energia ao longo do tempo
*/
import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export const EnergyTimeline = ({ diaries = [] }) => {
  const { t } = useTranslations();

  const data = useMemo(() => {
    if (diaries.length === 0) return [];

    // Organizar por data
    const sorted = [...diaries]
      .filter(d => d.energyLevel)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Agrupar por semana
    const weekData = {};
    sorted.forEach(diary => {
      const date = new Date(diary.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weekData[weekKey]) {
        weekData[weekKey] = [];
      }
      weekData[weekKey].push(diary.energyLevel);
    });

    return Object.entries(weekData)
      .map(([week, energies]) => ({
        week: new Date(week).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        average: (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1),
        min: Math.min(...energies),
        max: Math.max(...energies),
        count: energies.length
      }))
      .slice(-12); // Últimas 12 semanas
  }, [diaries]);

  if (data.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-purple-500/20 bg-black/30 text-center text-purple-200/60">
        {t('no_data') || 'Sem dados suficientes'}
      </div>
    );
  }

  const maxEnergy = 5;
  const HEIGHT = 200;
  const WIDTH = Math.max(data.length * 40, 400);

  // Criar caminho SVG
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1 || 1)) * (WIDTH - 40) + 20,
    y: HEIGHT - (parseFloat(d.average) / maxEnergy) * (HEIGHT - 40) + 20
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-purple-500/20 bg-black/30 space-y-4"
    >
      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT + 60} className="min-w-full">
          {/* Grid Lines */}
          {[1, 2, 3, 4, 5].map((level) => (
            <line
              key={`grid-${level}`}
              x1="20"
              y1={HEIGHT - (level / maxEnergy) * (HEIGHT - 40) + 20}
              x2={WIDTH - 20}
              y2={HEIGHT - (level / maxEnergy) * (HEIGHT - 40) + 20}
              stroke="rgba(168,85,247,0.1)"
              strokeDasharray="4"
            />
          ))}

          {/* Y-Axis Labels */}
          {[1, 2, 3, 4, 5].map((level) => (
            <text
              key={`label-${level}`}
              x="10"
              y={HEIGHT - (level / maxEnergy) * (HEIGHT - 40) + 25}
              fontSize="12"
              fill="rgba(192,132,250,0.5)"
            >
              {level}
            </text>
          ))}

          {/* Line Chart */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#energyGradient)"
            strokeWidth="2"
          />

          {/* Gradient */}
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={`point-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="rgb(168,85,247)"
                stroke="white"
                strokeWidth="2"
              />
              {/* X-Axis Label */}
              <text
                x={p.x}
                y={HEIGHT + 40}
                fontSize="11"
                fill="rgba(192,132,250,0.6)"
                textAnchor="middle"
              >
                {data[i].week}
              </text>
              {/* Value Label on Hover */}
              <title>{`Semana: ${data[i].week}\nMédia: ${data[i].average}\nMin: ${data[i].min} | Max: ${data[i].max}`}</title>
            </g>
          ))}

          {/* X-Axis */}
          <line x1="20" y1={HEIGHT + 20} x2={WIDTH - 20} y2={HEIGHT + 20} stroke="rgba(168,85,247,0.2)" />
        </svg>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs text-emerald-200/60">{t('highest') || 'Maior'}</p>
          <p className="font-semibold text-emerald-300">{Math.max(...data.map(d => d.max))}</p>
        </div>
        <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-purple-200/60">{t('average') || 'Média'}</p>
          <p className="font-semibold text-purple-300">
            {(data.reduce((sum, d) => sum + parseFloat(d.average), 0) / data.length).toFixed(1)}
          </p>
        </div>
        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-200/60">{t('lowest') || 'Menor'}</p>
          <p className="font-semibold text-red-300">{Math.min(...data.map(d => d.min))}</p>
        </div>
      </div>
    </motion.div>
  );
};

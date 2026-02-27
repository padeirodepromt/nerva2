/* src/components/dashboard/holistic/MenstrualCycleCard.jsx
   desc: Card de Ciclo Menstrual para Dashboard.
   feat: Mostra fase atual, dia do ciclo e recomendações personalizadas.
*/

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/components/LanguageProvider';

// Mapa de fases com recomendações
const phaseData = {
  menstrual: {
    emoji: '🔴',
    color: 'from-red-500/20 to-red-600/20',
    borderColor: 'border-red-500/30',
    recommendation: 'Seu sistema está em modo de limpeza. Desacelerar, recolher-se um pouco e escutar o corpo é prioridade.',
    activities: ['Meditação suave', 'Yoga leve', 'Descanso consciente', 'Reflexão escrita']
  },
  folicular: {
    emoji: '🟢',
    color: 'from-green-500/20 to-emerald-600/20',
    borderColor: 'border-green-500/30',
    recommendation: 'Energia em retomada. Bom momento para abrir caminhos, testar ideias e reorganizar sua rotina com leveza.',
    activities: ['Esquematizar projetos', 'Explorar criatividade', 'Encontros leves', 'Planejar próximos passos']
  },
  ovulatory: {
    emoji: '🟠',
    color: 'from-orange-500/20 to-amber-600/20',
    borderColor: 'border-orange-500/30',
    recommendation: 'Expressão e contato estão favorecidos. Use esse pico para conversas importantes, trocas e movimentos para fora.',
    activities: ['Conversas importantes', 'Reuniões-chave', 'Colaboração', 'Compartilhar ideias']
  },
  luteal: {
    emoji: '🔵',
    color: 'from-blue-500/20 to-cyan-600/20',
    borderColor: 'border-blue-500/30',
    recommendation: 'Momento de fechamento e síntese. Ideal para organizar, finalizar e ir reduzindo o ritmo aos poucos.',
    activities: ['Organizar pendências', 'Revisar projetos', 'Finalizar entregas', 'Reflexão tranquila']
  }
};

export default function MenstrualCycleCard({ cycle }) {
  const { t } = useTranslations();

  if (!cycle) {
    return (
      <Card className="card-glass-pure border-white/10 bg-black/20">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
            🌸 {t('holistic_menstrual_indicator') || 'Ciclo Menstrual'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground opacity-60">
            Quando você registra o início do seu ciclo no Diário de Bordo, o sistema consegue cuidar melhor do seu ritmo ao longo do mês.
          </p>
        </CardContent>
      </Card>
    );
  }

  const phase = phaseData[cycle.phase] || phaseData.menstrual;
  const phaseName = t(`holistic_menstrual_${cycle.phase}`) || cycle.phase;

  return (
    <Card className={`card-glass-pure border-white/10 bg-gradient-to-br ${phase.color} ${phase.borderColor} border`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
            {phase.emoji} {t('holistic_menstrual_indicator') || 'Ciclo Menstrual'}
          </CardTitle>
          <span className="text-2xl font-serif font-bold text-foreground">{cycle.dayOfCycle}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Dia do ciclo</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Fase Atual */}
        <div className="p-3 bg-black/20 rounded-lg border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Fase Atual</p>
          <p className="text-sm font-semibold text-foreground capitalize">{phaseName}</p>
        </div>

        {/* Recomendação */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Recomendação</p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            {phase.recommendation}
          </p>
        </div>

        {/* Atividades Sugeridas */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Ideal para</p>
          <div className="flex flex-wrap gap-1.5">
            {phase.activities.map((activity, idx) => (
              <span 
                key={idx}
                className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded-md text-muted-foreground hover:bg-white/10 transition-colors"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>

        {/* Barra de Progresso do Ciclo */}
        <div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-current to-white/50"
              style={{ 
                width: `${(cycle.dayOfCycle / 28) * 100}%`,
                backgroundImage: `linear-gradient(90deg, currentColor, rgba(255,255,255,0.5))`
              }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground mt-1 opacity-60">
            {28 - cycle.dayOfCycle} dias até o próximo ciclo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

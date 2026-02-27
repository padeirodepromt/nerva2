/* src/components/dashboard/RitualizationStatsCard.jsx
   desc: Card com estatísticas de ritualização (check-ins) - Identidade Prana
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconSoul } from '@/components/icons/PranaLandscapeIcons';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

export default function RitualizationStatsCard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    completionRate: 0,
    streak: 0,
    lastCheckIn: null,
    trend: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        // Buscar energy check-ins dos últimos 30 dias
        const response = await fetch('/api/energy/check-ins?days=30');
        
        if (response.ok) {
          const data = await response.json();
          const checkIns = data.checkIns || [];
          
          // Calcular estatísticas
          const totalDays = 30;
          const completionRate = Math.round((checkIns.length / totalDays) * 100);
          
          // Calcular streak (dias consecutivos)
          let streak = 0;
          const today = new Date();
          for (let i = 0; i < totalDays; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            
            if (checkIns.find(c => c.date === dateStr)) {
              streak++;
            } else if (i > 0) {
              break;
            }
          }

          // Calcular trend (comparar com semana anterior)
          const lastWeek = checkIns.filter(c => {
            const checkDate = new Date(c.date);
            const daysDiff = Math.floor((today - checkDate) / (1000 * 60 * 60 * 24));
            return daysDiff >= 0 && daysDiff < 7;
          }).length;

          const previousWeek = checkIns.filter(c => {
            const checkDate = new Date(c.date);
            const daysDiff = Math.floor((today - checkDate) / (1000 * 60 * 60 * 24));
            return daysDiff >= 7 && daysDiff < 14;
          }).length;

          const trend = lastWeek - previousWeek;

          setStats({
            totalCheckIns: checkIns.length,
            completionRate,
            streak,
            lastCheckIn: checkIns[0]?.date || null,
            trend
          });
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        // Valores padrão em caso de erro
        setStats({
          totalCheckIns: 0,
          completionRate: 0,
          streak: 0,
          lastCheckIn: null,
          trend: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const getTrendLabel = () => {
    if (stats.trend > 0) return `+${stats.trend} check-ins esta semana`;
    if (stats.trend < 0) return `${stats.trend} check-ins esta semana`;
    return 'Mantendo constância';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect p-8 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden"
    >
      {/* Textura de Papel Sutil */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* Header */}
      <div className="space-y-2 mb-8 border-b border-white/5 pb-6 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--accent-rgb))] flex items-center gap-2">
          <IconSoul className="w-4 h-4" /> Ritmo de Check-ins
        </h3>
        <p className="text-sm text-muted-foreground">
          Como você vem se encontrando com o próprio dia nos últimos 30 dias
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40 opacity-40">
          <div className="animate-spin">
            <IconSoul className="w-6 h-6" />
          </div>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          
          {/* Main Metric: Completion Rate */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif text-foreground">
                {stats.completionRate}%
              </span>
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground/60">
                Presença registrada
              </span>
            </div>
            <Progress 
              value={stats.completionRate} 
              className="h-2 bg-white/10"
              indicatorClassName="bg-gradient-to-r from-[rgb(var(--accent-rgb))] to-orange-400"
            />
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
              {stats.totalCheckIns} check-ins registrados
            </p>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Streak */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 flex items-center gap-1">
                🔥 Sequência de cuidado
              </div>
              <div className="text-2xl font-serif text-foreground">
                {stats.streak}
              </div>
              <div className="text-[9px] text-muted-foreground/50 mt-1">
                dias consecutivos em que você olhou para sua energia
              </div>
            </motion.div>

            {/* Trend */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 flex items-center gap-1">
                📈 Movimento
              </div>
              <div className={`text-lg font-serif ${
                stats.trend > 0 ? 'text-emerald-400' : stats.trend < 0 ? 'text-red-400' : 'text-muted-foreground'
              }`}>
                {stats.trend > 0 ? '+' : ''}{stats.trend}
              </div>
              <div className="text-[9px] text-muted-foreground/50 mt-1">
                variação em relação à semana anterior
              </div>
            </motion.div>
          </div>

          {/* Last Check-in Info */}
          {stats.lastCheckIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-4 border-t border-white/5"
            >
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
                Último check-in: {new Date(stats.lastCheckIn).toLocaleDateString('pt-BR')}
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

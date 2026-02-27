/* src/views/DiaryDashboardView.jsx
   desc: Dashboard de Diários com stats, gráficos e análise do Ash
   feat: Timeline de energia, Mood heatmap, Top tags, Insights personalizados
*/
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';
import { Papyrus } from '@/api/papyrus';
import PranaLoader from '@/components/PranaLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconCalendar, IconFilter, IconRefreshCw, IconChevronDown, IconChevronUp,
  IconBarChart3, IconTrendingUp, IconZap, IconSmile, IconTag, IconLoader2
} from '@/components/icons/PranaLandscapeIcons';

// Stats Components
import { EnergyStatsCard } from '@/components/diaries/EnergyStatsCard';
import { MoodStatsCard } from '@/components/diaries/MoodStatsCard';
import { TagsCloudCard } from '@/components/diaries/TagsCloudCard';
import { EnergyTimeline } from '@/components/diaries/EnergyTimeline';
import { MoodHeatmap } from '@/components/diaries/MoodHeatmap';
import { AshDiaryAnalysis } from '@/components/diaries/AshDiaryAnalysis';
import { DiaryCard } from '@/components/diaries/DiaryCard';

export default function DiaryDashboardView() {
  const { user } = useAuth();
  const { t } = useTranslations();

  // States
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [energyFilter, setEnergyFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // UI States
  const [showStats, setShowStats] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showAshAnalysis, setShowAshAnalysis] = useState(true);

  // Load diaries on mount
  useEffect(() => {
    if (user?.id) {
      loadDiaries();
    }
  }, [user?.id]);

  const loadDiaries = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/diaries?authorId=${user.id}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setDiaries(data);
      }
    } catch (e) {
      console.error('Failed to load diaries:', e);
      toast.error(t('diary_load_error') || 'Erro ao carregar diários');
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDiaries();
    setRefreshing(false);
    toast.success(t('diary_refreshed') || 'Diários atualizados');
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setMoodFilter('');
    setEnergyFilter('');
    setSearchText('');
  };

  // Filter diaries
  const filteredDiaries = diaries.filter(diary => {
    // Search in title and insights
    if (searchText && !diary.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !diary.insights?.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    // Date range filter
    if (dateFrom && new Date(diary.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(diary.createdAt) > new Date(dateTo)) return false;

    // Mood filter
    if (moodFilter && diary.mood !== moodFilter) return false;

    // Energy filter
    if (energyFilter && diary.energyLevel !== parseInt(energyFilter)) return false;

    return true;
  });

  if (loading) {
    return <PranaLoader text={t('diary_loading') || 'Carregando diários...'} />;
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      
      {/* HEADER */}
      <div className="border-b border-white/5 bg-card/50 backdrop-blur-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
              <IconBarChart3 className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-purple-100">
                📖 {t('diary_dashboard') || 'Dashboard de Diários'}
              </h1>
              <p className="text-sm text-purple-200/60">
                {filteredDiaries.length} {filteredDiaries.length === 1 ? 'diário' : 'diários'} encontrados
              </p>
            </div>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="gap-2"
          >
            {refreshing ? <IconLoader2 className="w-4 h-4 animate-spin" /> : <IconRefreshCw className="w-4 h-4" />}
            {t('refresh') || 'Atualizar'}
          </Button>
        </div>

        {/* FILTER SECTION */}
        <div className="space-y-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-semibold text-purple-200 hover:text-purple-100 transition-colors"
          >
            {showFilters ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
            <IconFilter className="w-4 h-4" />
            Filtros
          </button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 rounded-lg bg-card/30 border border-white/10"
            >
              <Input
                type="text"
                placeholder={t('search') || 'Pesquisar...'}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="bg-card/50 border-white/10 text-foreground"
              />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-card/50 border-white/10 text-foreground"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-card/50 border-white/10 text-foreground"
              />
              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="px-3 py-2 bg-card/50 border border-white/10 text-foreground rounded-lg"
              >
                <option value="">{t('all_moods') || 'Todos os humores'}</option>
                <option value="calm">😌 {t('diary_mood_calm')}</option>
                <option value="joy">😊 {t('diary_mood_joy')}</option>
                <option value="focus">🎯 {t('diary_mood_focus')}</option>
                <option value="creativity">✨ {t('diary_mood_creativity')}</option>
                <option value="anxiety">😰 {t('diary_mood_anxiety')}</option>
                <option value="confusion">🤔 {t('diary_mood_confusion')}</option>
                <option value="gratitude">🙏 {t('diary_mood_gratitude')}</option>
                <option value="sadness">😢 {t('diary_mood_sadness')}</option>
              </select>
              <select
                value={energyFilter}
                onChange={(e) => setEnergyFilter(e.target.value)}
                className="px-3 py-2 bg-card/50 border border-white/10 text-foreground rounded-lg"
              >
                <option value="">{t('all_energy') || 'Todos os níveis'}</option>
                <option value="1">1 - {t('diary_energy_1')}</option>
                <option value="2">2 - {t('diary_energy_2')}</option>
                <option value="3">3 - {t('diary_energy_3')}</option>
                <option value="4">4 - {t('diary_energy_4')}</option>
                <option value="5">5 - {t('diary_energy_5')}</option>
              </select>

              {(searchText || dateFrom || dateTo || moodFilter || energyFilter) && (
                <Button
                  onClick={handleClearFilters}
                  variant="ghost"
                  className="text-purple-200"
                >
                  {t('clear_filters') || 'Limpar'}
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6">

          {/* STATS SECTION */}
          {showStats && filteredDiaries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 text-sm font-semibold text-purple-200"
              >
                {showStats ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                📊 {t('statistics') || 'Estatísticas'}
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnergyStatsCard diaries={filteredDiaries} />
                <MoodStatsCard diaries={filteredDiaries} />
                <TagsCloudCard diaries={filteredDiaries} />
              </div>
            </motion.div>
          )}

          {/* TIMELINE SECTION */}
          {showTimeline && filteredDiaries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="flex items-center gap-2 text-sm font-semibold text-purple-200"
              >
                {showTimeline ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                ⚡ {t('energy_timeline') || 'Timeline de Energia'}
              </button>

              <EnergyTimeline diaries={filteredDiaries} />
            </motion.div>
          )}

          {/* MOOD HEATMAP */}
          {filteredDiaries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                <IconSmile className="w-4 h-4" /> {t('mood_distribution') || 'Distribuição de Humores'}
              </h3>
              <MoodHeatmap diaries={filteredDiaries} />
            </motion.div>
          )}

          {/* ASH ANALYSIS */}
          {showAshAnalysis && filteredDiaries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setShowAshAnalysis(!showAshAnalysis)}
                className="flex items-center gap-2 text-sm font-semibold text-purple-200"
              >
                {showAshAnalysis ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                ✨ {t('ash_analysis') || 'Análise do Ash'}
              </button>

              <AshDiaryAnalysis diaries={filteredDiaries} user={user} />
            </motion.div>
          )}

          {/* DIARIES LIST */}
          {filteredDiaries.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                <IconCalendar className="w-4 h-4" /> {t('diaries') || 'Diários'}
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {filteredDiaries.map((diary) => (
                  <DiaryCard key={diary.id} diary={diary} />
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconSmile className="w-12 h-12 text-purple-300/40 mb-4" />
              <p className="text-purple-200/60">
                {t('no_diaries') || 'Nenhum diário encontrado com esses filtros'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

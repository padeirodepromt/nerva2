/* src/hooks/useBioSync.js
   desc: Nexus de Sincronização V8.6 (Full Duplex).
   feat: Leitura (Metrics) + Escrita (Checkin/Diary) + Astrologia Integrada.
*/

import { useMemo, useCallback } from 'react';
import { useProjectEntities } from './useProjectEntities'; // Seu hook de banco de dados
import { calculateSupply, getRecommendedArchetype } from '@/lib/energyEngine.js'; // Sua matemática
import { bioEnergyService } from '@/api/services/bioEnergyService.js';
import { startOfDay, isSameDay } from 'date-fns';

export function useBioSync() {
    // 1. Buscamos registros. 
    // DICA DE PERFORMANCE: No futuro, filtrar isso na query do banco (ex: "last 30 days")
    const { items: allRecords, loading, actions } = useProjectEntities(null, 'records');

    // 2. O Cérebro: Calcula o Estado Atual (Read-Only)
    const bioState = useMemo(() => {
        const today = new Date();
        const start = startOfDay(today);
        
        // -- Extração de Dados --
        // Encontra o último check-in de hoje
        const todayCheckin = allRecords?.find(r => 
            r.properties?.record_type === 'energy_checkin' && 
            isSameDay(new Date(r.created_at), today)
        );

        // Pega perfil estático e trânsito dinâmico
        const astralProfile = allRecords?.find(r => r.properties?.record_type === 'astral_profile');
        const transit = allRecords?.find(r => r.properties?.record_type === 'cosmic_transit'); // Ou fetch de API externa
        
        // Ciclo menstrual (assume o último registro de estado)
        const cycleData = allRecords?.find(r => r.properties?.record_type === 'menstrual_cycle');

        // -- Cálculos Energéticos --
        // Calcula bateria baseada no histórico recente (deltas dos diários)
        const diaryDeltas = allRecords
            ?.filter(r => r.properties?.record_type === 'diary' && new Date(r.created_at) >= start)
            .map(r => r.properties?.energy_delta || 0) || [];

        const currentLevel = todayCheckin?.properties?.level || 3; // Default: Moderado
        const battery = calculateSupply(
            todayCheckin?.properties, 
            diaryDeltas, 
            { physical: 1.0 }, // Exemplo de modificador simples
            cycleData?.properties
        );

        // -- Recomendações do Ash --
        const archetype = getRecommendedArchetype(currentLevel, transit?.properties);
        
        // -- Retorno Estruturado para o DashboardView --
        return {
            metrics: {
                energyLevel: currentLevel,
                battery: battery,
                lastUpdate: todayCheckin?.created_at
            },
            astral: {
                moon: transit?.properties?.moonSign || 'Desconhecido',
                phase: transit?.properties?.moonPhase || 'Nova',
                sun: astralProfile?.properties?.sunSign
            },
            cycle: {
                phase: cycleData?.properties?.currentPhase || 'Não rastreado',
                day: cycleData?.properties?.cycleDay
            },
            recommendations: [
                { id: 'arch', text: `Arquétipo do dia: ${archetype?.label || 'Fluxo Livre'}`, icon: 'brain' },
                { id: 'astro', text: `Lua em ${transit?.properties?.moonSign || '...'}: ${transit?.properties?.advice || 'Observe'}` }
            ]
        };
    }, [allRecords]);

    // 3. As Mãos: Ações de Escrita (Action Methods)
    
    // Ação 1: Check-in de Energia (Usado pelo BiomeSelectorCard)
    const submitCheckIn = useCallback(async (level, type) => {
        // Cria ou Atualiza o registro de hoje
        await actions.create({
            title: `Check-in Energia: ${level}`,
            properties: {
                record_type: 'energy_checkin',
                level: level,
                energyType: type,
                timestamp: new Date().toISOString()
            }
        });
        // O useMemo acima vai rodar de novo automaticamente quando 'allRecords' mudar
    }, [actions]);

    // Ação 2: Diário (Usado pelos Cards de Reflexão)
    const syncDiaryEntry = useCallback(async (content) => {
        const analysis = await bioEnergyService.analyzeDiaryImpact(content);
        
        await actions.create({
            title: `Reflexão Diária`,
            properties: {
                record_type: 'diary',
                content,
                energy_delta: analysis.energy_delta,
                ash_insight: analysis.insight,
                emotional_states: [analysis.mood_shift]
            }
        });
        return analysis;
    }, [actions]);

    return {
        // Dados (Leitura)
        metrics: bioState.metrics,
        astral: bioState.astral,
        cycle: bioState.cycle,
        recommendations: bioState.recommendations,
        
        // Ações (Escrita)
        submitCheckIn,
        syncDiaryEntry,
        
        // Estado
        isLoading: loading,
        refresh: actions.refresh
    };
}
/* src/hooks/useDashboardPreferences.js
   desc: Hook para gerenciar preferências de filtros do Dashboard
*/

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { User } from '@/api/entities';

// Filtros padrão (tudo visível)
const DEFAULT_FILTERS = {
    sankalpa: true,
    projects: true,
    tasks: true,
    velocity: true,
    astral: true,
    rituals: true,
    energy: true,
    mood: true,
    tags: true,
    ash: true,
    menstrualCycle: true
};

export function useDashboardPreferences() {
    const { user } = useAuth();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [loading, setLoading] = useState(true);

    // Carregar preferências do usuário
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const loadPreferences = async () => {
            try {
                // Usar dashboard_preferences já carregadas no User
                const savedFilters = user?.dashboard_preferences || DEFAULT_FILTERS;
                setFilters({ ...DEFAULT_FILTERS, ...savedFilters });
            } catch (err) {
                console.error('Erro ao sincronizar filtros:', err);
                setFilters(DEFAULT_FILTERS);
            } finally {
                setLoading(false);
            }
        };

        loadPreferences();
    }, [user]);

    // Atualizar filtros e salvar na API
    const updateFilters = useCallback(async (newFilters) => {
        if (!user) return;

        try {
            // Atualizar estado local imediatamente
            setFilters(newFilters);

            // Salvar via API (User.update)
            await User.update(user.id, {
                dashboard_preferences: newFilters
            });
        } catch (err) {
            console.error('Erro ao atualizar filtros:', err);
        }
    }, [user]);

    return {
        filters,
        setFilters: updateFilters,
        loading,
        isFilterActive: (section) => filters[section] ?? true
    };
}

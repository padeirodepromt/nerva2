/* src/hooks/useRoutines.js
   desc: Motor de Gestão de Ciclos e Slots Temporais V10.
   feat: Separação por Realms, distinção entre Hábito e Bloco, e filtragem neural.
*/
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Routine } from '@/api/entities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { toast } from 'sonner';

export function useRoutines() {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // [V10] Puxa a consciência ativa do sistema
    const { activeRealmId } = useWorkspaceStore();

    // 1. CARREGAMENTO CENTRALIZADO
    const fetchRoutines = useCallback(async () => {
        setLoading(true);
        try {
            // Busca todas as rotinas do usuário
            const data = await Routine.list();
            setRoutines(data || []);
        } catch (error) {
            console.error("Routine Engine Error:", error);
            toast.error("Falha ao sincronizar biorritmo.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    // 2. A PODA DE CONSCIÊNCIA (Filtering & Classification)
    const processedRoutines = useMemo(() => {
        // Filtra conforme o Universo selecionado
        const filtered = routines.filter(r => {
            if (activeRealmId === 'all') return true;
            return r.realmId === activeRealmId;
        });

        // Organiza em categorias para o Planner/Ash
        return {
            all: filtered,
            habits: filtered.filter(r => r.type === 'habit'), // Âncoras (Meditar, Almoço)
            blocks: filtered.filter(r => r.type === 'block'), // Territórios (Trabalho, Estudo)
        };
    }, [routines, activeRealmId]);

    // 3. AÇÕES DE MANIFESTAÇÃO (CRUD)
    const createRoutine = async (payload) => {
        try {
            // Injeta contexto se não for fornecido
            const realmToInject = activeRealmId === 'all' ? 'personal' : activeRealmId;
            const finalPayload = {
                ...payload,
                realmId: payload.realmId || realmToInject,
                type: payload.type || 'habit'
            };

            const newItem = await Routine.create(finalPayload);
            await fetchRoutines();
            toast.success(`Rotina "${newItem.title}" estabelecida.`);
            return newItem;
        } catch (e) {
            toast.error("Erro ao criar ciclo temporal.");
            throw e;
        }
    };

    const updateRoutine = async (id, payload) => {
        try {
            await Routine.update(id, payload);
            setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...payload } : r));
            toast.success("Ciclo atualizado.");
        } catch (e) {
            toast.error("Falha na reconfiguração do tempo.");
        }
    };

    const deleteRoutine = async (id) => {
        try {
            await Routine.delete(id);
            setRoutines(prev => prev.filter(r => r.id !== id));
            toast.success("Ciclo removido.");
        } catch (e) {
            toast.error("Erro ao deletar rotina.");
        }
    };

    return {
        routines: processedRoutines.all,
        habits: processedRoutines.habits,
        blocks: processedRoutines.blocks,
        loading,
        actions: {
            refresh: fetchRoutines,
            create: createRoutine,
            update: updateRoutine,
            delete: deleteRoutine
        }
    };
}
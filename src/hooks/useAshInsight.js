import { useState, useEffect } from 'react';
import { Ash } from '@/api/entities';

export function useAshInsight(stats) {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchInsight = async () => {
            if (!stats) return;
            setLoading(true);
            try {
                // Chama a IA real
                const result = await Ash.getDailyInsight(stats);
                
                if (mounted) {
                    setInsight({
                        text: result.text || "O silêncio também é resposta.",
                        type: result.energyType || 'deep_work'
                    });
                }
            } catch (error) {
                console.error("Ash offline:", error);
                // Fallback gracioso se a IA falhar
                if (mounted) setInsight({ 
                    text: "Sua energia flui, mesmo quando invisível.", 
                    type: 'deep_work' 
                });
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchInsight();

        return () => { mounted = false; };
    }, [JSON.stringify(stats)]); // Recarrega se os stats mudarem

    return { insight, loading };
}
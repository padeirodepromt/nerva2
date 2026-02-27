/* src/components/dashboard/holistic/AshSuggestionsCard.jsx
   desc: Card com sugestões personalizadas do Ash - Identidade Prana
*/

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/components/LanguageProvider';
import { Button } from '@/components/ui/button';
import { IconSoul, IconGrowth } from '@/components/icons/PranaLandscapeIcons';
import { apiClient } from '@/api/apiClient';

export default function AshSuggestionsCard({ cycle }) {
    const { t } = useTranslations();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                const response = await Promise.race([
                    apiClient.post('/ai/holistic-analysis/suggestions', { 
                        userId: localStorage.getItem('prana_auth_user_id') 
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
                ]);
                setSuggestions(response.data?.data?.suggestions || []);
            } catch (error) {
                console.warn('[AshSuggestionsCard] Sugestões indisponíveis:', error.message);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    return (
        <div className="card-glass-pure p-8 flex flex-col h-full">
            {/* Header */}
            <div className="space-y-2 mb-6 border-b border-white/5 pb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--accent-rgb))]">
                    Roteiros do Ash para hoje
                </h3>
                <p className="text-[10px] text-muted-foreground/60">Pequenos ajustes que alinham sua energia com o que importa</p>
            </div>

            {/* Suggestions List */}
            <div className="space-y-3 flex-1">
                {loading ? (
                    <div className="flex items-center justify-center h-24">
                        <p className="text-xs text-muted-foreground/60">Sintetizando o que o seu sistema está pedindo hoje...</p>
                    </div>
                ) : suggestions.length === 0 ? (
                    <div className="flex items-center justify-center h-24">
                        <p className="text-xs text-muted-foreground/60">Quando você registra sua energia e seus dias, o Ash consegue sugerir próximos passos mais alinhados.</p>
                    </div>
                ) : (
                    suggestions.slice(0, 3).map((suggestion, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-xs text-foreground mb-1">
                                        {suggestion.title}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                                        {suggestion.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
                    Sistema Prana lendo seu ciclo, energia e fluxo de trabalho
                </p>
            </div>
        </div>
    );
}

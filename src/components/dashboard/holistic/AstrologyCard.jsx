import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import astrologyService from '@/ai_services/astrologyService';
import { 
    IconCosmos, IconHeart, IconFileText
} from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';

/**
 * @component AstrologyCard
 * @description Leitura poética e profunda dos transitos atuais e seu impacto na vida.
 * Fotografa o céu de hoje e sua influência cósmica sobre você.
 * 
 * Props: data = { sunSign, moonPhase, reading, transits, etc }
 * Simples e direto - sem múltiplas fontes de dados
 */
export default function AstrologyCard({ data = {} }) {
    const { user } = useAuth();
    const { openTab } = useWorkspaceStore();

    const {
        sunSign,
        sunElement,
        moonPhase,
        reading,
    } = data;

    // Se não tem leitura, mostra estado vazio
    if (!reading) {
        return (
            <div className="card-elevated relative overflow-hidden">
                <div className="relative z-10 text-center py-8">
                    <p className="text-xs text-muted-foreground/50">Decifrando as mensagens celestes...</p>
                </div>
            </div>
        );
    }

    return (
        <AstrologyCardGeneric data={data} onOpenDocument={() => handleOpenAstralDocument(user?.id, openTab)} />
    );
}

/**
 * Abre o documento astral no editor
 */
function handleOpenAstralDocument(userId, openTab) {
    if (!userId) return;
    openTab({
        type: 'document',
        id: `astral-${userId}`,
        label: '🌟 Seu Mapa Astrológico',
        view: 'doc-editor'
    });
}

/**
 * Versão Genérica: Transitos atuais diretos
 */
function AstrologyCardGeneric({ data, onOpenDocument }) {
    const {
        sunSign,
        sunElement,
        moonPhase,
        reading
    } = data;

    if (!reading) return null;

    return (
        <div className="card-elevated space-y-5 relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 dark:bg-white/[0.02] p-5">
            <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='astro-noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23astro-noise)'/%3E%3C/svg%3E")` }} />
            
            <div className="relative z-10 space-y-5">
                {/* Cabeçalho */}
                <div className="space-y-2 flex items-start justify-between">
                    <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400/60 dark:bg-yellow-400/80 animate-pulse"></span>
                            <h3 className="text-xs font-bold text-[rgb(var(--accent-rgb))] uppercase tracking-widest flex items-center gap-2">
                                <IconCosmos className="w-3.5 h-3.5" /> Céu de Hoje
                            </h3>
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 dark:text-muted-foreground/70">Um retrato dos movimentos do céu</p>
                    </div>
                    {onOpenDocument && (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onOpenDocument}
                        className="gap-1 text-[9px] opacity-60 hover:opacity-100 h-7 px-2"
                    >
                        <IconFileText className="w-3 h-3" />
                        Detalhes
                    </Button>
                    )}
                </div>

                {/* Leitura Poética */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/15 to-blue-500/15 dark:from-purple-500/10 dark:to-blue-500/10 border border-purple-400/25 dark:border-purple-400/30 space-y-3">
                    <div className="text-xs leading-relaxed text-muted-foreground/85 dark:text-muted-foreground/90 space-y-2">
                        {typeof reading === 'string' 
                            ? reading.split('\n').filter(line => line.trim()).map((paragraph, idx) => (
                                <p key={idx} className="italic">
                                    {paragraph.trim().replace(/\*\*/g, '')}
                                </p>
                            ))
                            : <p className="italic">{reading}</p>
                        }
                    </div>
                    <p className="text-[8px] text-muted-foreground/60 dark:text-muted-foreground/70 border-t border-white/5 pt-2">
                        ✨ Baseado em posições planetárias reais de hoje.
                    </p>
                </div>

                {/* Dados Estruturados */}
                {(sunSign || moonPhase) && (
                <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-3">
                    {sunSign && (
                    <div className="space-y-1.5">
                        <div className="text-[8px] uppercase tracking-widest text-muted-foreground/60 dark:text-muted-foreground/70 font-bold flex items-center gap-1.5">
                            <IconCosmos className="w-3 h-3" /> Sol
                        </div>
                        <div className="pl-4">
                            <p className="text-xs font-semibold text-foreground/90">{sunSign}</p>
                            {sunElement && <p className="text-[8px] text-muted-foreground/70">{sunElement}</p>}
                        </div>
                    </div>
                    )}
                    
                    {moonPhase && (
                    <div className="space-y-1.5">
                        <div className="text-[8px] uppercase tracking-widest text-muted-foreground/60 dark:text-muted-foreground/70 font-bold flex items-center gap-1.5">
                            <IconHeart className="w-3 h-3" /> Lua
                        </div>
                        <div className="pl-4">
                            <p className="text-xs font-semibold text-foreground/90">
                                {typeof moonPhase === 'object' ? moonPhase.phase : moonPhase}
                            </p>
                            {typeof moonPhase === 'object' && moonPhase.energy && (
                                <p className="text-[8px] text-muted-foreground/70">{moonPhase.energy}</p>
                            )}
                        </div>
                    </div>
                    )}
                </div>
                )}

                {/* Mensagem final */}
                <p className="text-[8px] text-muted-foreground/60 dark:text-muted-foreground/65 italic border-t border-white/5 pt-3">
                    Os transitos convidam você a observar onde há movimento e onde há repouso.
                </p>
            </div>
        </div>
    );
}


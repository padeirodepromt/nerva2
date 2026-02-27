/**
 * @file src/components/PranaMiniLoader.jsx
 * @description Loader de Onda Senoidal (Organic Wave).
 * Gera uma animação procedural de frequência variável usando Canvas/SVG.
 * Representa o fluxo de energia (Prana) em processamento.
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const PranaMiniLoaderComponent = ({ className }) => {
    const wavePathRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const wavePath = wavePathRef.current;
        if (!wavePath) return;

        const DURATION = 4000;
        const WIDTH = 48;
        const HEIGHT = 24;

        const animate = (time) => {
            if (!wavePath) return;

            // Lógica da Onda Senoidal (Frequência e Amplitude Variáveis)
            const progress = (time % DURATION) / DURATION;
            let frequency = 2, amplitude = 3;
            
            // Fase de aceleração da frequência
            if (progress >= 0.25 && progress < 0.875) {
                const phaseProgress = (progress - 0.25) / 0.625;
                frequency = 2 + 18 * phaseProgress;
                amplitude = 3 + 5 * phaseProgress;
            } 
            // Fase de desaceleração
            else if (progress >= 0.875) {
                const phaseProgress = (progress - 0.875) / 0.125;
                frequency = 20 - 18 * phaseProgress;
                amplitude = 8 - 5 * phaseProgress;
            }

            // Construção do Caminho SVG (Path Data)
            let pathD = `M 0 ${HEIGHT / 2}`;
            const segments = 50;
            for (let i = 0; i <= segments; i++) {
                const x = (i / segments) * WIDTH;
                // Fator de corda para fixar as pontas
                const ropeFactor = Math.sin((i / segments) * Math.PI); 
                // Equação da onda composta
                const y = (HEIGHT / 2) + Math.sin((i / 20) * frequency + time / 200) * amplitude * ropeFactor;
                pathD += ` L ${x} ${y}`;
            }
            
            wavePath.setAttribute('d', pathD);
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <div className={cn("flex items-center justify-center", className)} title="Processando energia...">
            <svg width="48" height="24" viewBox="0 0 48 24" className="overflow-visible">
                <defs>
                    <linearGradient id="pranaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" /> {/* Emerald 500 */}
                        <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" /> {/* Blue 500 */}
                    </linearGradient>
                </defs>
                <path 
                    ref={wavePathRef} 
                    stroke="url(#pranaGradient)" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                />
            </svg>
        </div>
    );
};

// EXPORTAÇÃO DUPLA (Named e Default) para garantir compatibilidade
export const PranaMiniLoader = PranaMiniLoaderComponent;
export default PranaMiniLoaderComponent;
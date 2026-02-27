/**
 * @file src/components/PranaLoader.jsx
 * @description Loader Principal "Prana Wave".
 * Implementa uma onda senoidal com interpolação de cores e pulso rítmico.
 * Baseado na lógica proprietária do Arquiteto (No Standard Code).
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { PranaDefinitive } from '@/components/animations/PranaDefinitive';

const styles = `
    .pulse-effect {
        animation: pulse 1s ease-out forwards;
    }

    @keyframes pulse {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
`;

export const PranaLoader = ({ 
    text = "Sintonizando frequências...", 
    fullScreen = false, 
    className,
    variant = "definitive" // "wave" ou "definitive"
}) => {
    const wavePathRef = useRef(null);
    const pulseCircleRef = useRef(null);
    const animationFrameId = useRef(null);

    // Se for variant "definitive", usar o novo componente
    if (variant === "definitive") {
        return (
            <div 
                className={cn(
                    "flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-50",
                    fullScreen ? "fixed inset-0 w-screen h-screen" : "w-full h-full min-h-[300px]",
                    className
                )}
            >
                {/* Tamanho 2cm ≈ 80px em resolução 96dpi */}
                <div className="w-20 h-20">
                    <PranaDefinitive className="w-full h-full" color="#D97706" />
                </div>
                
                {text && (
                    <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse tracking-widest uppercase">
                        {text}
                    </p>
                )}
            </div>
        );
    }

    // Variante padrão "wave"
    return <PranaWaveLoader text={text} fullScreen={fullScreen} className={className} />;
};

const PranaWaveLoader = ({ text, fullScreen, className }) => {
    const wavePathRef = useRef(null);
    const pulseCircleRef = useRef(null);
    const animationFrameId = useRef(null);

    useEffect(() => {
        const wavePath = wavePathRef.current;
        const pulseCircle = pulseCircleRef.current;

        const DURATION = 4000;
        const WIDTH = 300; // Reduzido pela metade (era 600)
        const HEIGHT = 150; // Reduzido pela metade (era 300)
        
        const colors = {
            calm: '#3b82f6', focus1: '#8b5cf6', focus2: '#ec4899', insight: '#f97316'
        };

        let lastPulseTime = 0;

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
        }
        function rgbToHex(rgb) {
            return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
        }
        function interpolateColor(color1, color2, factor) {
            const result = color1.slice();
            for (let i = 0; i < 3; i++) { result[i] = Math.round(result[i] + factor * (color2[i] - color1[i])); }
            return result;
        }
        
        const rgbColors = {
            calm: hexToRgb(colors.calm), 
            focus1: hexToRgb(colors.focus1), 
            focus2: hexToRgb(colors.focus2), 
            insight: hexToRgb(colors.insight)
        };

        const animate = (time) => {
            if (!wavePath || !pulseCircle) return;
            const elapsedTime = time % DURATION;
            const progress = elapsedTime / DURATION;

            // Lógica de Interpolação de Cores do Arquiteto
            let currentColor;
            if (progress < 0.25) { currentColor = rgbColors.calm; } 
            else if (progress < 0.625) {
                const phaseProgress = (progress - 0.25) / 0.375;
                if (phaseProgress < 0.5) { currentColor = interpolateColor(rgbColors.calm, rgbColors.focus1, phaseProgress * 2); } 
                else { currentColor = interpolateColor(rgbColors.focus1, rgbColors.focus2, (phaseProgress - 0.5) * 2); }
            } else if (progress < 0.875) {
                const phaseProgress = (progress - 0.625) / 0.25;
                currentColor = interpolateColor(rgbColors.focus2, rgbColors.insight, phaseProgress);
            } else {
                const phaseProgress = (progress - 0.875) / 0.125;
                currentColor = interpolateColor(rgbColors.insight, rgbColors.calm, phaseProgress);
            }
            
            // Aplica a cor calculada
            const hexColor = rgbToHex(currentColor);
            wavePath.setAttribute('stroke', hexColor);
            
            // Lógica de Pulso
            const pulseTime = DURATION * 0.75;
            if (elapsedTime >= pulseTime && lastPulseTime < pulseTime) {
                pulseCircle.setAttribute('stroke', colors.insight);
                pulseCircle.classList.add('pulse-effect');
                setTimeout(() => {
                    if (pulseCircle) pulseCircle.classList.remove('pulse-effect');
                }, 1000);
            }
            lastPulseTime = elapsedTime;

            // Lógica da Onda (Frequência e Amplitude Variáveis)
            let frequency = 2, amplitude = 20; // Reduzido pela metade (era 40)
            if (progress >= 0.25 && progress < 0.875) {
                const phaseProgress = (progress - 0.25) / 0.625;
                frequency = 2 + 18 * phaseProgress;
                amplitude = 20 + 30 * phaseProgress; // Reduzido pela metade (era 40 + 60)
            } else if (progress >= 0.875) {
                const phaseProgress = (progress - 0.875) / 0.125;
                frequency = 20 - 18 * phaseProgress;
                amplitude = 50 - 30 * phaseProgress; // Reduzido pela metade (era 100 - 60)
            }

            let pathD = `M 0 ${HEIGHT / 2}`;
            const segments = 100;
            for (let i = 0; i <= segments; i++) {
                const x = (i / segments) * WIDTH;
                const ropeFactor = Math.sin((i / segments) * Math.PI); 
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
        <>
            <style>{styles}</style>
            <div 
                className={cn(
                    "flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-50",
                    fullScreen ? "fixed inset-0 w-screen h-screen" : "w-full h-full min-h-[300px]",
                    className
                )}
            >
                <svg width="150" height="75" viewBox="0 0 300 150" className="overflow-visible"> {/* Reduzido pela metade */}
                    <path ref={wavePathRef} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle ref={pulseCircleRef} cx="225" cy="75" r="10" strokeWidth="2" fill="none" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} /> {/* Ajustado posição */}
                </svg>
                
                {text && (
                    <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse tracking-widest uppercase">
                        {text}
                    </p>
                )}
            </div>
        </>
    );
};

export default PranaLoader;
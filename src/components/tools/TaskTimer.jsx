/* src/components/tools/TaskTimer.jsx
   desc: Controlador de Foco V10.
   feat: Gatilho de Sessão Global (Opção B), Persistência de Foco e Visual Monocromático.
*/
import React, { useState, useEffect } from 'react';
import { useTimeStore } from '@/stores/useTimeStore';
import { Button } from '@/components/ui/button';
import { 
    IconPlay, 
    IconPause, 
    IconStopCircle, 
    IconZap 
} from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

export default function TaskTimer({ taskId, taskTitle, className }) {
    const { 
        activeTaskId, 
        startTimer, 
        pauseTimer, 
        stopTimer, 
        isRunning, 
        startTime, 
        elapsedRaw,
        sessionStartTime,
        startWorkSession 
    } = useTimeStore();

    const [displayTime, setDisplayTime] = useState(0);
    const isMyTaskActive = activeTaskId === taskId;

    // --- LOGICA DE TICK (Visualização em Tempo Real) ---
    useEffect(() => {
        let interval;
        if (isMyTaskActive && isRunning) {
            interval = setInterval(() => {
                const session = Date.now() - startTime;
                setDisplayTime(elapsedRaw + session);
            }, 1000);
        } else if (isMyTaskActive && !isRunning) {
            setDisplayTime(elapsedRaw);
        } else {
            setDisplayTime(0);
        }
        return () => clearInterval(interval);
    }, [isMyTaskActive, isRunning, startTime, elapsedRaw]);

    // Formatador de Tempo Industrial
    const formatTime = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // --- GATILHO V10 (Intent-Based) ---
    const handleToggle = (e) => {
        e.stopPropagation();

        // [OPÇÃO B] Se o Arquiteto dá Play na tarefa, a Sessão Global desperta
        if (!sessionStartTime) {
            console.log("Ash: Início de tarefa detectado. Despertando Sessão Global...");
            startWorkSession();
        }

        if (isMyTaskActive && isRunning) {
            pauseTimer();
        } else {
            startTimer(taskId, taskTitle);
        }
    };

    return (
        <div className={cn(
            "flex items-center gap-1.5 bg-zinc-950/40 rounded-full p-1 border border-white/5 transition-all group",
            isMyTaskActive && isRunning && "border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
            className
        )}>
            {/* Contador Mono */}
            <div className={cn(
                "font-mono text-[10px] w-[55px] text-center tracking-tighter transition-colors",
                isMyTaskActive && isRunning ? "text-emerald-400 font-bold" : "text-zinc-500"
            )}>
                {isMyTaskActive ? formatTime(displayTime) : "00:00:00"}
            </div>
            
            {/* Botão de Estado (Play/Pause) */}
            <Button 
                size="icon" 
                variant="ghost" 
                className={cn(
                    "h-6 w-6 rounded-full transition-all",
                    isMyTaskActive && isRunning 
                        ? "text-amber-500 hover:bg-amber-500/10" 
                        : "text-zinc-500 hover:bg-white/5 hover:text-emerald-400"
                )}
                onClick={handleToggle}
            >
                {isMyTaskActive && isRunning 
                    ? <IconPause className="w-3 h-3 fill-current" /> 
                    : <IconPlay className="w-3 h-3 fill-current ml-0.5" />
                }
            </Button>

            {/* Finalizador (Apenas se houver progresso) */}
            {isMyTaskActive && (elapsedRaw > 0 || isRunning) && (
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 rounded-full text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={(e) => { e.stopPropagation(); stopTimer(); }}
                    title="Encerrar e Registrar"
                >
                    <IconStopCircle className="w-3 h-3" />
                </Button>
            )}
        </div>
    );
}
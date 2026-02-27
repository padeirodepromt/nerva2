/* src/components/tools/WorkSessionTimer.jsx */
import React, { useState, useEffect } from 'react';
import { useTimeStore } from '@/stores/useTimeStore';
import { IconClock, IconZap } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

export default function WorkSessionTimer() {
    const { sessionStartTime, startWorkSession } = useTimeStore();
    const [time, setTime] = useState("00:00");

    useEffect(() => {
        // Se não houver sessão iniciada, iniciamos ao montar (Primeira interação)
        if (!sessionStartTime) startWorkSession();

        const interval = setInterval(() => {
            const diff = Date.now() - sessionStartTime;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setTime(`${h > 0 ? h + 'h ' : ''}${m}m`);
        }, 10000); // Atualiza a cada 10s para poupar processamento

        return () => clearInterval(interval);
    }, [sessionStartTime]);

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
            <IconClock className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-tighter">
                {time} <span className="text-zinc-600">SESSÃO</span>
            </span>
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>
    );
}
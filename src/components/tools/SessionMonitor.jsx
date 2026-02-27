/* src/components/tools/SessionMonitor.jsx */
import React, { useEffect } from 'react';
import { useTimeStore } from '@/stores/useTimeStore';
import { toast } from 'sonner';

export default function SessionMonitor() {
    const { sessionStartTime } = useTimeStore();

    useEffect(() => {
        if (!sessionStartTime) return;

        const checkOverload = () => {
            const elapsedMinutes = (Date.now() - sessionStartTime) / (1000 * 60);

            // Protocolo Ash: Aviso a cada 90 minutos de trabalho ininterrupto
            if (elapsedMinutes > 0 && Math.floor(elapsedMinutes) % 90 === 0) {
                toast("⚠️ Protocolo Ash: Sobrecarga Detectada", {
                    description: "Arquiteto, você ultrapassou 90min de imersão. Sugiro 5min de descompressão para manter a integridade neural.",
                    duration: 10000,
                    action: { label: "Pausar", onClick: () => console.log("User paused") },
                });
            }
        };

        const interval = setInterval(checkOverload, 60000); // Checa a cada minuto
        return () => clearInterval(interval);
    }, [sessionStartTime]);

    return null; // Componente de lógica pura
}
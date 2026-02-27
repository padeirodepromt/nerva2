/* src/hooks/useSystemInit.js
   desc: Inicializador de Consciência V10 (Opção B).
   feat: Detecta a primeira intenção de trabalho para despertar o Ash e o Timer.
*/
import { useEffect } from 'react';
import { useTimeStore } from '@/stores/useTimeStore';

export function useSystemInit() {
    const { sessionStartTime, startWorkSession } = useTimeStore();

    useEffect(() => {
        // Se a sessão já começou hoje, não fazemos nada
        if (sessionStartTime) return;

        const wakeUp = () => {
            console.log("Ash: Intenção detectada. Despertando sistemas...");
            startWorkSession();
            
            // Removemos os ouvintes para não sobrecarregar o sistema
            window.removeEventListener('mousedown', wakeUp);
            window.removeEventListener('keydown', wakeUp);
        };

        // Ouvintes de intenção (Clique ou Teclado)
        window.addEventListener('mousedown', wakeUp);
        window.addEventListener('keydown', wakeUp);

        return () => {
            window.removeEventListener('mousedown', wakeUp);
            window.removeEventListener('keydown', wakeUp);
        };
    }, [sessionStartTime, startWorkSession]);
}
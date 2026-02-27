/* src/stores/useTimeStore.js
   desc: Motor de Tempo V10 (Persistente).
   feat: Dual-Layer Timing (Task + Session), API Integration & Ash Monitoring.
*/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeSession } from '@/api/entities';
import { toast } from 'sonner';

export const useTimeStore = create(
    persist(
        (set, get) => ({
            // --- CAMADA MICRO: TAREFAS ---
            activeTaskId: null,
            activeTaskTitle: null,
            startTime: null,
            elapsedRaw: 0,
            isRunning: false,

            // --- CAMADA MACRO: JORNADA (V10) ---
            sessionStartTime: null, // Início do dia de trabalho
            lastBreakTime: null,

            // Ações de Jornada (Ash Protocol)
            startWorkSession: () => {
                if (!get().sessionStartTime) {
                    set({ sessionStartTime: Date.now(), lastBreakTime: Date.now() });
                }
            },

            endWorkSession: () => {
                set({ sessionStartTime: null, lastBreakTime: null });
                toast.success("Jornada finalizada. Ash: Descanse bem, Arquiteto.");
            },

            // Ações de Tarefa (Original Integrado)
            startTimer: (taskId, taskTitle) => {
                const { activeTaskId, stopTimer } = get();
                if (activeTaskId && activeTaskId !== taskId) {
                    stopTimer(); 
                }
                set({
                    activeTaskId: taskId,
                    activeTaskTitle: taskTitle,
                    startTime: Date.now(),
                    isRunning: true
                });
            },

            pauseTimer: () => {
                const { startTime, elapsedRaw } = get();
                if (!startTime) return;
                set({
                    startTime: null,
                    elapsedRaw: elapsedRaw + (Date.now() - startTime),
                    isRunning: false
                });
            },

            stopTimer: async () => {
                const { startTime, elapsedRaw, activeTaskId } = get();
                const currentSessionMs = startTime ? (Date.now() - startTime) : 0;
                const totalDurationMs = elapsedRaw + currentSessionMs;

                if (totalDurationMs > 1000 && activeTaskId) {
                    try {
                        await TimeSession.create({
                            task_id: activeTaskId,
                            duration_seconds: Math.floor(totalDurationMs / 1000),
                            start_time: new Date(Date.now() - totalDurationMs).toISOString(),
                            end_time: new Date().toISOString()
                        });
                        toast.success("Sessão de foco registrada.");
                    } catch (e) {
                        toast.error("Erro ao salvar tempo no Nexus.");
                    }
                }

                set({
                    activeTaskId: null,
                    activeTaskTitle: null,
                    startTime: null,
                    elapsedRaw: 0,
                    isRunning: false
                });
            },

            getDisplayTime: () => {
                const { startTime, elapsedRaw, isRunning } = get();
                if (!isRunning) return elapsedRaw;
                return elapsedRaw + (Date.now() - (startTime || Date.now()));
            }
        }),
        { name: 'prana-time-storage' }
    )
);
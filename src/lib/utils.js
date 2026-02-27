// src/lib/utils.js
// Coleção de funções utilitárias que devem ser exportadas como named exports.

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes Tailwind condicionalmente.
 * @param {...string} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formata segundos em HH:MM:SS para exibição do timer.
 * É essencial que seja um named export para o hook useTaskData.
 * @param {number} totalSeconds - Duração total em segundos.
 * @returns {string} Tempo formatado (Hh MMm SSs).
 */
export const formatDuration = (totalSeconds) => {
    if (typeof totalSeconds !== 'number' || totalSeconds < 0) return '0s';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let parts = [];
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0 || (hours > 0 && seconds === 0)) {
        parts.push(`${minutes}m`);
    }
    if (parts.length === 0 || seconds > 0) {
        parts.push(`${seconds}s`);
    }

    return parts.join(' ');
};

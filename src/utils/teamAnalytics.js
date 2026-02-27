/* src/utils/teamAnalytics.js
   desc: Algoritmos para calcular a 'Vibe' e Sinergia da equipe baseada nos check-ins dos membros.
*/

/**
 * Calcula a Sinergia do time baseada nos níveis de energia.
 * @param {Array} members - Lista de membros { id, name, energy_level (0-100), role }
 */
export const calculateTeamSynergy = (members = []) => {
    if (!members || members.length === 0) {
        return { score: 0, label: 'Neutro', color: 'text-gray-400', statusColor: 'bg-gray-500' };
    }

    // 1. Média de Energia (Potência Bruta)
    const totalEnergy = members.reduce((acc, m) => acc + (m.energy_level || 50), 0);
    const avgEnergy = Math.round(totalEnergy / members.length);

    // 2. Desvio Padrão (Coerência)
    // Mede se o time está alinhado ou se há disparidade (ex: um em burnout, outro em euforia)
    const variance = members.reduce((acc, m) => acc + Math.pow((m.energy_level || 50) - avgEnergy, 2), 0) / members.length;
    const stdDev = Math.sqrt(variance);
    
    // 3. Score de Sinergia (0-100)
    // Penaliza a média se o desvio for alto (time descompassado rende menos)
    const synergyScore = Math.max(0, Math.min(100, Math.round(avgEnergy - (stdDev * 0.4))));

    let label = 'Estável';
    let color = 'text-blue-400';
    let statusColor = 'bg-blue-500'; // Cor da bolinha de status

    if (synergyScore >= 80) {
        label = 'Alta Ressonância (Flow)';
        color = 'text-purple-400';
        statusColor = 'bg-purple-500';
    } else if (synergyScore >= 60) {
        label = 'Sincronizado';
        color = 'text-emerald-400';
        statusColor = 'bg-emerald-500';
    } else if (synergyScore <= 35) {
        label = 'Drenado / Risco';
        color = 'text-red-400';
        statusColor = 'bg-red-500';
    } else if (stdDev > 25) {
        label = 'Desalinhado (Energia Dispersa)';
        color = 'text-yellow-400';
        statusColor = 'bg-yellow-500';
    }

    return {
        avgEnergy,
        stdDev,
        synergyScore,
        label,
        color,
        statusColor
    };
};

/**
 * Gera feedback textual para o gestor.
 */
export const getTeamInsights = (metrics) => {
    if (metrics.synergyScore > 85) return "Momento ideal para Sprints intensivos. O time está com energia sobrando.";
    if (metrics.stdDev > 25) return "Atenção à distribuição de carga. Alguns membros estão sobrecarregados enquanto outros estão leves.";
    if (metrics.avgEnergy < 40) return "Energia crítica. Considere cancelar reuniões não essenciais hoje.";
    return "Operação nominal. O ritmo está sustentável.";
};
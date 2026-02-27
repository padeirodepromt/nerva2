/* src/components/forms/document/EnergySelector.jsx
   desc: Seletor de Energia Universal V2.0.
   feat: Suporta Contexto 'diary' (Oferta) e 'task' (Demanda/Custo).
*/

import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { IconZap, IconBrainCircuit } from '@/components/icons/PranaLandscapeIcons';

const ENERGY_LEVELS = [1, 2, 3, 4, 5];

const ENERGY_CONFIG = {
  1: { color: 'from-emerald-600 to-emerald-700', label: 'Mínima',  desc_task: 'Automático' }, // Inverti as cores para Tarefa (1 é bom/barato)
  2: { color: 'from-teal-600 to-teal-700',       label: 'Baixa',   desc_task: 'Leve' },
  3: { color: 'from-yellow-600 to-yellow-700',    label: 'Média',   desc_task: 'Moderado' },
  4: { color: 'from-orange-600 to-orange-700',    label: 'Alta',    desc_task: 'Intenso' },
  5: { color: 'from-red-600 to-red-700',          label: 'Máxima',  desc_task: 'Drenante' },
};

// Se for Diário (Supply), 5 é Bom (Verde). Se for Tarefa (Demand), 5 é Caro (Vermelho).
// Esta lógica visual ajuda o usuário a entender "Custo vs Recurso".
const getGradient = (level, context) => {
    if (context === 'task') return ENERGY_CONFIG[level].color; 
    // Inversão para Diário (1 = Ruim/Vermelho, 5 = Bom/Verde)
    const diaryColors = {
        1: 'from-red-600 to-red-700',
        2: 'from-orange-600 to-orange-700',
        3: 'from-yellow-600 to-yellow-700',
        4: 'from-lime-600 to-lime-700',
        5: 'from-emerald-600 to-emerald-700'
    };
    return diaryColors[level];
};

export const EnergySelector = ({ value, onChange, context = 'diary' }) => {
  const { t } = useTranslations();

  // Função Mock para simular "Ash Autopilot"
  const handleAskAsh = () => {
      // Em produção, isso chamaria a IA analisando o título da tarefa
      // Por enquanto, randomiza para demonstrar interatividade
      const estimated = Math.floor(Math.random() * 3) + 2; 
      onChange(estimated);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end px-1">
          <label className="text-[10px] font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
            {context === 'task' ? 'Custo Energético' : t('diary_energy_label')}
          </label>
          
          {/* Botão Ash Autopilot */}
          {context === 'task' && (
              <button 
                type="button"
                onClick={handleAskAsh}
                className="text-[9px] flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                title="Pedir ao Ash para estimar"
              >
                  <IconBrainCircuit className="w-3 h-3" /> Auto
              </button>
          )}
      </div>

      <div className="flex gap-1.5 h-9">
        {ENERGY_LEVELS.map((level) => (
          <motion.button
            key={level}
            type="button" // Previne submit do form
            onClick={() => onChange(level)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex-1 rounded-md font-bold text-xs flex items-center justify-center relative overflow-hidden
              transition-all duration-200
              ${value === level
                ? `bg-gradient-to-b ${getGradient(level, context)} text-white shadow-lg ring-1 ring-white/30`
                : 'bg-black/40 border border-white/5 text-muted-foreground hover:bg-white/5'
              }
            `}
          >
            <div className="flex flex-col items-center gap-1 z-10">
               {/* Raios para Tarefa, Números para Diário */}
               {context === 'task' ? (
                   <div className="flex gap-0.5">
                       {[...Array(level > 3 ? 3 : (level > 1 ? 2 : 1))].map((_, i) => (
                           <IconZap key={i} className={`w-3 h-3 ${value === level ? 'fill-white' : 'fill-none'}`} />
                       ))}
                   </div>
               ) : (
                   <span>{level}</span>
               )}
            </div>
          </motion.button>
        ))}
      </div>
      
      {value && (
        <p className="text-[10px] text-right text-muted-foreground px-1 animate-in slide-in-from-left-2">
          {context === 'task' 
            ? `${ENERGY_CONFIG[value].desc_task} (${value}/5)`
            : t(ENERGY_CONFIG[value].key)}
        </p>
      )}
    </div>
  );
};
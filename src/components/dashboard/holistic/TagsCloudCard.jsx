/* src/components/dashboard/holistic/TagsCloudCard.jsx
   desc: Cloud de tags mais usadas nos diários - Identidade Prana
*/

import { useTranslations } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { IconFlux } from '@/components/icons/PranaLandscapeIcons';

export default function TagsCloudCard({ stats = {} }) {
  const { t } = useTranslations();
  
  const tags = stats.topTags || [
    { name: 'gratidão', count: 24 },
    { name: 'produtividade', count: 18 },
    { name: 'saúde', count: 15 },
    { name: 'criatividade', count: 12 },
    { name: 'foco', count: 10 },
    { name: 'relacionamentos', count: 8 }
  ];

  const maxCount = Math.max(...tags.map(t => t.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-textured relative overflow-hidden"
    >
      {/* Textura de Papel Sutil */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='tags-noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23tags-noise)'/%3E%3C/svg%3E")` }} />
      
      {/* Conteúdo com z-index */}
      <div className="relative z-10">
      {/* Header */}
      <div className="space-y-2 mb-6 border-b border-white/5 pb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--accent-rgb))]">
          ✦ Tags Principais
        </h3>
        <p className="text-sm text-muted-foreground">Temas recorrentes de suas práticas</p>
      </div>

      {/* Tags Cloud */}
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, idx) => {
          const size = (tag.count / maxCount) * 0.5 + 0.7; // 0.7x a 1.2x
          const sizeClass = 
            size > 1.1 ? 'text-sm font-semibold px-4 py-2' :
            size > 0.9 ? 'text-xs font-medium px-3 py-1.5' :
            'text-[11px] font-medium px-2.5 py-1';
          
          return (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.08 }}
              className={`rounded-2xl bg-white/10 border border-white/10 text-foreground/80 hover:bg-white/15 hover:border-white/20 transition-all cursor-default ${sizeClass}`}
              title={`${tag.name}: ${tag.count} vezes`}
            >
              {tag.name}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-muted-foreground/60 uppercase tracking-widest">
        {tags.reduce((sum, t) => sum + t.count, 0)} tags registradas
      </div>
      </div>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { IconArrowRight } from "../../components/icons/PranaLandscapeIcons";

const LiveDemoPlanner = () => {
  const hours = [9, 10, 11, 12, 13, 14, 15, 16];
  const week = [
    { day: 'Seg', date: '12', active: false },
    { day: 'Ter', date: '13', active: true },
    { day: 'Qua', date: '14', active: false },
    { day: 'Qui', date: '15', active: false },
    { day: 'Sex', date: '16', active: false },
  ];

  const tasks = [
    { dayIndex: 0, start: 9.5, duration: 1.5, title: 'Reunião de Alinhamento', type: 'event', style: 'neutral' },
    { dayIndex: 0, start: 13, duration: 2, title: 'Deep Work: Backend', type: 'focus', style: 'accent' },
    
    { dayIndex: 1, start: 10, duration: 1, title: 'Daily', type: 'event', style: 'neutral' },
    { dayIndex: 1, start: 11.5, duration: 2.5, title: 'UI Refactoring', type: 'focus', style: 'accent' },
    
    { dayIndex: 2, start: 9, duration: 2, title: 'Marketing Sync', type: 'event', style: 'neutral' },
    { dayIndex: 2, start: 14, duration: 1.5, title: 'Review PRs', type: 'task', style: 'neutral' },
    
    { dayIndex: 3, start: 10.5, duration: 1, title: '1:1 Manager', type: 'event', style: 'neutral' },
    { dayIndex: 4, start: 13, duration: 3, title: 'Weekly Deploy', type: 'warning', style: 'outline' },
  ];

  const getStyle = (style) => {
      switch(style) {
          case 'accent': return 'bg-[var(--accent)]/10 border-l-[var(--accent)] text-[var(--text-primary)]';
          case 'outline': return 'bg-transparent border border-[var(--text-secondary)]/30 border-l-[var(--text-secondary)] text-[var(--text-secondary)] border-dashed';
          case 'neutral': default: return 'bg-[var(--text-primary)]/5 border-l-[var(--text-secondary)] text-[var(--text-primary)]';
      }
  }

  return (
    <div className="w-full h-[500px] bg-[var(--card-bg-solid)] rounded-xl border border-[var(--glass-border)] overflow-hidden flex flex-col shadow-2xl">
      {/* Header Month/Week */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)] bg-[var(--bg-color)]">
         <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif">Janeiro 2026</h3>
            <div className="flex gap-1 border border-[var(--glass-border)] rounded-lg p-0.5 bg-[var(--card-bg-solid)]">
               <button className="p-1 hover:bg-[var(--text-primary)]/5 rounded text-[var(--text-secondary)]"><IconArrowRight className="w-4 h-4 rotate-180" /></button>
               <button className="p-1 hover:bg-[var(--text-primary)]/5 rounded text-[var(--text-secondary)]"><IconArrowRight className="w-4 h-4" /></button>
            </div>
         </div>
         <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--text-primary)]/5 text-xs text-[var(--text-secondary)]">Semana</div>
            <div className="px-3 py-1.5 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-xs text-[var(--accent)] font-bold">Timeline</div>
         </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-6 border-b border-[var(--glass-border)] bg-[var(--bg-color)]">
         <div className="w-16 border-r border-[var(--glass-border)]"></div>
         {week.map((d, i) => (
             <div key={i} className={`py-3 text-center border-r border-[var(--glass-border)] relative ${d.active ? 'bg-[var(--accent)]/5' : ''}`}>
                 <div className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${d.active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{d.day}</div>
                 <div className={`text-xl font-light ${d.active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{d.date}</div>
                 {d.active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]"></div>}
             </div>
         ))}
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto relative bg-[var(--card-bg-solid)] custom-scrollbar">
         {/* Time Rows */}
         {hours.map(h => (
             <div key={h} className="grid grid-cols-6 h-24 border-b border-[var(--glass-border)] group">
                 <div className="w-16 border-r border-[var(--glass-border)] text-[10px] text-[var(--text-secondary)] p-2 text-right relative -top-3 group-hover:text-[var(--text-primary)]">
                     {h}:00
                 </div>
                 {[0,1,2,3,4].map(col => <div key={col} className="border-r border-[var(--glass-border)] h-full relative"></div>)}
             </div>
         ))}

         {/* Tasks Blocks */}
         {tasks.map((task, i) => {
             const top = (task.start - hours[0]) * 96; // 96px per hour
             const height = task.duration * 96;
             return (
                 <motion.div
                    key={i}
                    initial={{opacity: 0, scale: 0.9}}
                    whileInView={{opacity: 1, scale: 1}}
                    transition={{delay: i * 0.1}}
                    className={`absolute z-10 rounded-sm border-[var(--glass-border)] border-t border-r border-b p-2 text-xs flex flex-col shadow-sm hover:brightness-110 cursor-pointer overflow-hidden border-l-4 ${getStyle(task.style)}`}
                    style={{
                        top: `${top}px`,
                        height: `${height - 4}px`, // -4 gap
                        left: `calc(${(task.dayIndex + 1) * 16.666}% + 4px)`, // +1 because first col is time
                        width: 'calc(16.666% - 8px)'
                    }}
                 >
                     <div className={`font-bold truncate`}>{task.title}</div>
                     <div className="text-[10px] opacity-70">{task.duration}h</div>
                     {height > 60 && <div className="mt-auto flex items-center gap-1 opacity-50 text-[8px]"><div className={`w-1.5 h-1.5 rounded-full bg-current`}></div> {task.type}</div>}
                 </motion.div>
             )
         })}
         
         {/* Current Time Line */}
         <div className="absolute left-16 right-0 border-t-2 border-[var(--accent)]/50 z-20 pointer-events-none" style={{top: '300px'}}>
             <div className="absolute -left-2 -top-1.5 w-3 h-3 rounded-full bg-[var(--accent)]"></div>
         </div>
      </div>
    </div>
  );
};

export default LiveDemoPlanner;
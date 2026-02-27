/* src/components/mobile/WeekStrip.jsx
   desc: Calendário horizontal para foco imediato.
*/
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function WeekStrip({ onSelectDate }) {
  const today = startOfToday();
  const [selected, setSelected] = useState(today);
  const days = Array.from({ length: 14 }).map((_, i) => addDays(today, i));

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
      {days.map((day) => {
        const isSelected = isSameDay(day, selected);
        const isToday = isSameDay(day, today);

        return (
          <button
            key={day.toISOString()}
            onClick={() => {
              setSelected(day);
              onSelectDate?.(day);
            }}
            className={cn(
              "flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border",
              isSelected 
                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                : "bg-white/5 text-muted-foreground border-white/5",
              isToday && !isSelected && "border-primary/30"
            )}
          >
            <span className="text-[10px] uppercase font-bold opacity-60 mb-1">
              {format(day, 'eee', { locale: ptBR })}
            </span>
            <span className="text-xl font-serif font-bold">
              {format(day, 'd')}
            </span>
            {isToday && <div className={cn("w-1 h-1 rounded-full mt-1", isSelected ? "bg-white" : "bg-primary")} />}
          </button>
        );
      })}
    </div>
  );
}
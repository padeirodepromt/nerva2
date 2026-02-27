import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * CalendarBubble - Mini calendário interativo dentro do chat
 * Permite selecionar datas para agendar tasks
 */
export default function CalendarBubble({ onSelectDate, month = null, year = null }) {
  const today = new Date();
  const displayMonth = month ?? today.getMonth();
  const displayYear = year ?? today.getFullYear();

  const [currentMonth, setCurrentMonth] = useState(displayMonth);
  const [currentYear, setCurrentYear] = useState(displayYear);
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  // Calcula dias do mês
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days = [];
  
  // Dias do mês anterior
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Dias do mês atual
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && 
                   currentMonth === today.getMonth() && 
                   currentYear === today.getFullYear();
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday,
    });
  }

  // Dias do próximo mês
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day) => {
    if (day < 1 || day > daysInMonth) return;
    
    setSelectedDate(day);
    const selected = new Date(currentYear, currentMonth, day);
    onSelectDate?.(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10',
        'p-4 max-w-sm'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-sm"
        >
          ←
        </button>

        <div className="text-sm font-semibold capitalize text-center flex-1">
          {monthName}
        </div>

        <button
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-sm"
        >
          →
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
          <div key={day} className="text-xs text-center opacity-50 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayObj, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => handleDateSelect(dayObj.day)}
            disabled={!dayObj.isCurrentMonth}
            className={cn(
              'aspect-square rounded text-xs font-medium',
              'transition-all duration-200',
              'hover:scale-105 active:scale-95',
              dayObj.isCurrentMonth
                ? selectedDate === dayObj.day && currentMonth === displayMonth && currentYear === displayYear
                  ? 'bg-blue-500/40 text-blue-300 border border-blue-400'
                  : dayObj.isToday
                  ? 'bg-white/10 border border-white/20 font-bold'
                  : 'hover:bg-white/5 text-foreground'
                : 'text-muted-foreground opacity-30 cursor-default',
              !dayObj.isCurrentMonth && 'hover:bg-transparent'
            )}
          >
            {dayObj.day}
          </motion.button>
        ))}
      </div>

      {/* Selected Date Display */}
      <div className="mt-4 p-2 bg-white/5 rounded-lg text-xs text-center opacity-70">
        📅 {new Date(currentYear, currentMonth, selectedDate).toLocaleDateString('pt-BR')}
      </div>
    </motion.div>
  );
}

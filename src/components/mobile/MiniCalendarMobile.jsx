import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/api/entities';
import { 
  format, addMonths, subMonths, getDaysInMonth, startOfMonth 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  IconChevronLeft, IconChevronRight, IconCalendar 
} from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

/**
 * MiniCalendarMobile - Calendário horizontal para mobile
 * Swipe para navegar, click em dia para ver tarefas
 */
export default function MiniCalendarMobile({ onSelectDate, onCreateTask }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadTasks();
  }, [currentMonth]);

  const loadTasks = async () => {
    try {
      const tasksData = await Task.list();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const getDaysForMonth = (date) => {
    const daysInMonth = getDaysInMonth(date);
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  };

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getDate() === day.getDate() &&
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const days = getDaysForMonth(currentMonth);
  const isCurrentMonth = 
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header com navegação */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          size="icon"
          variant="ghost"
          className="w-8 h-8 hover:bg-white/10"
        >
          <IconChevronLeft className="w-4 h-4" />
        </Button>

        <h2 className="text-sm font-semibold flex-1 text-center">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>

        <Button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          size="icon"
          variant="ghost"
          className="w-8 h-8 hover:bg-white/10"
        >
          <IconChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid de dias - Horizontal scroll */}
      <div className="overflow-x-auto px-2 pb-2">
        <div className="flex gap-2 min-w-min">
          {days.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isSelected = 
              day.getDate() === selectedDate.getDate() &&
              day.getMonth() === selectedDate.getMonth() &&
              day.getFullYear() === selectedDate.getFullYear();
            const isToday = 
              day.getDate() === new Date().getDate() &&
              day.getMonth() === new Date().getMonth() &&
              day.getFullYear() === new Date().getFullYear();

            return (
              <motion.div
                key={day.toString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => {
                    setSelectedDate(day);
                    onSelectDate?.(day);
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center',
                    'w-16 h-20 rounded-lg',
                    'transition-all duration-200',
                    'border border-white/10',
                    isSelected
                      ? 'bg-[rgba(var(--accent-rgb),0.2)] border-[rgb(var(--accent-rgb))]'
                      : isToday
                      ? 'bg-white/5 border-white/20'
                      : 'bg-white/[0.02] hover:bg-white/5',
                  )}
                  variant="ghost"
                >
                  {/* Dia do mês */}
                  <span className="text-sm font-bold">
                    {format(day, 'd')}
                  </span>

                  {/* Dia da semana abreviado */}
                  <span className="text-[10px] text-muted-foreground">
                    {format(day, 'EEE', { locale: ptBR }).substring(0, 3)}
                  </span>

                  {/* Indicador de tarefas */}
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayTasks.slice(0, 2).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1 h-1 rounded-full bg-[rgb(var(--accent-rgb))]"
                        />
                      ))}
                    </div>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tarefas do dia selecionado */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">
              {format(selectedDate, 'dd MMM yyyy', { locale: ptBR })}
            </p>
            <Button
              onClick={onCreateTask}
              size="sm"
              className="h-6 px-2 text-xs"
            >
              Criar
            </Button>
          </div>

          {getTasksForDay(selectedDate).length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              Nenhuma tarefa neste dia
            </p>
          ) : (
            getTasksForDay(selectedDate).map((task) => (
              <div
                key={task.id}
                className="p-2 bg-white/5 rounded border border-white/10 text-xs"
              >
                <p className="font-medium truncate">{task.title}</p>
                {task.priority && (
                  <Badge variant="outline" className="text-[10px] mt-1">
                    {task.priority}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

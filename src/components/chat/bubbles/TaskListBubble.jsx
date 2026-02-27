import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/api/entities';
import { cn } from '@/lib/utils';

/**
 * TaskListBubble - Renderiza lista de tarefas dentro de message bubble
 * Usada quando Ash responde com lista de tasks
 */
export default function TaskListBubble({ tasks = [], onTaskSelect, onCreateTask, maxItems = 5 }) {
  const [loadedTasks, setLoadedTasks] = useState(tasks);
  const [isLoading, setIsLoading] = useState(!tasks.length);

  useEffect(() => {
    if (!tasks.length) {
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await Task.filter({ completed: false });
      setLoadedTasks(data.slice(0, maxItems));
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-1 p-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
            className="w-1 h-6 bg-blue-400 rounded-full"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10',
        'p-3 space-y-2 max-w-sm'
      )}
    >
      <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
        📋 {loadedTasks.length} Tarefas
      </div>

      <div className="space-y-2">
        {loadedTasks.map((task, idx) => (
          <motion.button
            key={task.id || idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onTaskSelect?.(task)}
            className={cn(
              'w-full text-left p-2.5 rounded-lg',
              'hover:bg-white/10 transition-colors',
              'border border-transparent hover:border-white/10'
            )}
          >
            <div className="flex items-start gap-2">
              <div className={cn(
                'w-4 h-4 rounded flex-shrink-0 mt-0.5',
                task.completed ? 'bg-green-500/30' : 'bg-white/10 border border-white/20'
              )} />

              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium truncate',
                  task.completed && 'line-through opacity-50'
                )}>
                  {task.title}
                </p>

                {task.due_date && (
                  <p className="text-xs text-muted-foreground">
                    📅 {new Date(task.due_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              {task.priority && (
                <span className={cn(
                  'text-xs px-2 py-1 rounded flex-shrink-0',
                  task.priority === 'high' && 'bg-red-500/20 text-red-400',
                  task.priority === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                  task.priority === 'low' && 'bg-green-500/20 text-green-400'
                )}>
                  {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {loadedTasks.length >= maxItems && (
        <button
          onClick={() => onTaskSelect?.({ id: 'create', title: 'Nova tarefa' })}
          className="w-full text-xs py-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          ➕ Ver mais tarefas
        </button>
      )}
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  IconCheck, IconTrash, IconChevronRight, IconPlus 
} from '@/components/icons/PranaLandscapeIcons';

/**
 * CompactListView - Lista compacta para mobile
 * Swipe esquerda = completar
 * Tap = abrir detalhes em drawer
 */
export default function CompactListView({ onTaskSelect, onCreateTask }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [swipedId, setSwipedId] = useState(null);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const tasksData = await Task.filter({ 
        completed: false,
        _sort: '-created_at'
      });
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await Task.update(taskId, { completed: true });
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Tarefa concluída!');
      setSwipedId(null);
    } catch (error) {
      toast.error('Erro ao completar tarefa');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Descartar tarefa?')) return;
    
    try {
      await Task.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Tarefa removida');
      setSwipedId(null);
    } catch (error) {
      toast.error('Erro ao remover tarefa');
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e, taskId) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe esquerda > 50px = completar
    if (diff > 50) {
      setSwipedId(taskId);
    }
    
    setTouchStart(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-6 h-6 border-2 border-[rgb(var(--accent-rgb))] rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold">Tarefas ({tasks.length})</h2>
        <Button
          onClick={onCreateTask}
          size="icon"
          className="w-8 h-8 hover:bg-white/20"
        >
          <IconPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="text-4xl mb-3 opacity-20">📭</div>
            <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente</p>
            <Button
              onClick={onCreateTask}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Criar Primeira Tarefa
            </Button>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            <AnimatePresence>
              {tasks.map((task) => {
                const isBeingSwiped = swipedId === task.id;

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={(e) => handleTouchEnd(e, task.id)}
                  >
                    {/* Swipe Background Actions */}
                    <div className={cn(
                      'absolute inset-0 rounded-lg',
                      'flex items-center justify-end gap-2 px-3',
                      'bg-red-500/20 border border-red-500/30',
                      isBeingSwiped ? 'opacity-100' : 'opacity-0'
                    )}>
                      <Button
                        onClick={() => handleDelete(task.id)}
                        size="icon"
                        className="w-7 h-7 hover:bg-red-600"
                      >
                        <IconTrash className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Task Card */}
                    <motion.div
                      animate={{ x: isBeingSwiped ? -70 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      onClick={() => !isBeingSwiped && onTaskSelect?.(task)}
                      className={cn(
                        'bg-white/5 border border-white/10 rounded-lg',
                        'p-3 cursor-pointer',
                        'transition-all duration-200',
                        'active:scale-95',
                        'flex items-center justify-between gap-3'
                      )}
                    >
                      {/* Left: Checkbox + Title */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComplete(task.id);
                          }}
                          className={cn(
                            'w-5 h-5 rounded border-2 flex-shrink-0',
                            'transition-all duration-200',
                            'flex items-center justify-center',
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-white/30 hover:border-white/60'
                          )}
                        >
                          {task.completed && (
                            <IconCheck className="w-3 h-3 text-white" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-medium truncate',
                            task.completed && 'line-through opacity-50'
                          )}>
                            {task.title}
                          </p>
                          {task.due_date && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(task.due_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Priority + Chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {task.priority && (
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              getPriorityColor(task.priority)
                            )}
                          >
                            {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                          </Badge>
                        )}
                        <IconChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

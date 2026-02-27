import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Project } from '@/api/entities';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * QuickActionBubble - Botões de ação rápida renderizados pelo Ash
 * Ex: "Criar tarefa", "Agendar reunião", "Revisar pendências"
 */
export default function QuickActionBubble({ actions = [], onActionComplete }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action) => {
    setSelectedAction(action.id);
    setIsLoading(true);

    try {
      switch (action.type) {
        case 'create_task':
          const newTask = await Task.create({
            title: action.title || 'Nova tarefa',
            description: action.description,
            due_date: action.dueDate,
            priority: action.priority || 'medium',
          });
          toast.success(`✅ Tarefa criada: ${newTask.title}`);
          onActionComplete?.({ type: 'task_created', data: newTask });
          break;

        case 'list_tasks':
          const tasks = await Task.filter({ completed: false });
          onActionComplete?.({ type: 'tasks_listed', data: tasks });
          break;

        case 'complete_task':
          if (action.taskId) {
            await Task.update(action.taskId, { completed: true });
            toast.success('✅ Tarefa concluída!');
            onActionComplete?.({ type: 'task_completed', data: { id: action.taskId } });
          }
          break;

        case 'open_view':
          window.dispatchEvent(new CustomEvent('prana:open-view', {
            detail: { type: action.viewType, data: action.viewData }
          }));
          onActionComplete?.({ type: 'view_opened', data: { viewType: action.viewType } });
          break;

        default:
          console.log('Action executed:', action);
          onActionComplete?.({ type: 'action_executed', data: action });
      }
    } catch (error) {
      console.error('Action error:', error);
      toast.error(`❌ Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSelectedAction(null), 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10',
        'p-3 space-y-2 max-w-sm'
      )}
    >
      <div className="flex flex-wrap gap-2">
        {actions.map((action, idx) => (
          <motion.button
            key={action.id || idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handleAction(action)}
            disabled={isLoading || selectedAction === action.id}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-medium',
              'transition-all duration-200',
              'border border-white/10 hover:border-white/20',
              selectedAction === action.id
                ? 'bg-blue-500/30 text-blue-300'
                : 'bg-white/5 hover:bg-white/10 text-foreground',
              (isLoading && selectedAction === action.id) && 'opacity-50 cursor-wait'
            )}
          >
            <span className="inline-block">
              {action.icon ? `${action.icon} ` : ''}
              {action.label || action.title}
            </span>

            <AnimatePresence>
              {selectedAction === action.id && isLoading && (
                <motion.span
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  className="ml-2 inline-block animate-spin"
                >
                  ⚡
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

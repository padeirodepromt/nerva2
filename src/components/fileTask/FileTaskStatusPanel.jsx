/* src/components/fileTask/FileTaskStatusPanel.jsx
   desc: Painel para visualizar tarefas ativas e histórico de um arquivo.
   features: Mostra tarefas em andamento vs completas, criar nova tarefa.
*/

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { Task } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IconPlus,
  IconLoader2,
  IconCheckCircle,
  IconAlertCircle,
} from '@/components/icons/PranaLandscapeIcons';

const STATUS_COLORS = {
  active: 'bg-blue-500/20 text-blue-300',
  pending: 'bg-yellow-500/20 text-yellow-300',
  completed: 'bg-green-500/20 text-green-300',
  archived: 'bg-gray-500/20 text-gray-300',
};

const STATUS_LABELS = {
  active: 'Em Andamento',
  pending: 'Pendente',
  completed: 'Completa',
  archived: 'Arquivada',
};

export default function FileTaskStatusPanel({ docId, onTaskCreated }) {
  const { openPranaForm } = useWorkspaceStore();
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar tarefas do arquivo
  useEffect(() => {
    loadTasks();
  }, [docId]);

  const loadTasks = async () => {
    if (!docId) return;
    setLoading(true);
    setError(null);
    try {
      // Buscar todas as tarefas do usuário
      const allTasks = await Task.list();

      // Filtrar por fileId
      const fileTasks = allTasks.filter((task) => task.fileId === docId);

      // Separar ativas de completas
      const active = fileTasks.filter((t) => t.status === 'active');
      const completed = fileTasks.filter((t) => t.status === 'completed');

      setActiveTasks(active);
      setCompletedTasks(completed);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
      setError('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    openPranaForm({
      itemType: 'task',
      defaultValues: {
        fileId: docId,
        status: 'active',
        title: `Tarefa para: ${docId}`, // Placeholder
      },
    });
  };

  const handleTaskClick = (taskId) => {
    // Abrir TaskWorkspaceOverlay para editar
    const store = useWorkspaceStore.getState();
    store.openOverlay({
      type: 'TASK_DETAIL',
      data: { id: taskId },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        <IconLoader2 className="w-4 h-4 animate-spin mr-2" />
        Carregando tarefas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-red-300">
        <IconAlertCircle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de criar */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Tarefas do Arquivo
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCreateTask}
          className="gap-1 text-xs"
        >
          <IconPlus className="w-3 h-3" />
          Nova
        </Button>
      </div>

      {/* Tarefas Ativas */}
      <div>
        <h4 className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
          Em Andamento ({activeTasks.length})
        </h4>
        {activeTasks.length === 0 ? (
          <div className="text-xs text-muted-foreground italic p-2">
            Nenhuma tarefa ativa
          </div>
        ) : (
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task.id)}
                isCompleted={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Divisor se houver histórico */}
      {completedTasks.length > 0 && (
        <>
          <div className="h-px bg-white/10" />

          {/* Histórico */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
              Histórico ({completedTasks.length})
            </h4>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task.id)}
                  isCompleted={true}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Estado vazio */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-xs">Nenhuma tarefa vinculada a este arquivo</p>
          <p className="text-xs mt-1 opacity-70">
            Clique em "Nova" para criar uma
          </p>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para renderizar item de tarefa
function TaskItem({ task, onClick, isCompleted }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-2.5 rounded-lg border border-white/10 bg-white/5
        hover:bg-white/10 transition-colors text-left group
        ${isCompleted ? 'opacity-70' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        {/* Icon Status */}
        <div className="mt-0.5">
          {isCompleted ? (
            <IconCheckCircle className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full border border-blue-400 bg-blue-400/20" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-medium truncate ${
              isCompleted ? 'line-through text-white/60' : 'text-white'
            }`}
          >
            {task.title}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className={`text-[9px] ${STATUS_COLORS[task.status] || ''}`}
            >
              {STATUS_LABELS[task.status] || task.status}
            </Badge>

            {task.priority && (
              <Badge variant="outline" className="text-[9px]">
                {task.priority}
              </Badge>
            )}

            {isCompleted && task.completedAt && (
              <span className="text-[9px] text-muted-foreground">
                {new Date(task.completedAt).toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: '2-digit',
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

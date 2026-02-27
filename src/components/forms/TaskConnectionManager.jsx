/* canvas: src/components/forms/TaskConnectionManager.jsx
   desc: Gerenciador de Conexões de Tarefa.
   fix: Substituição do ícone inexistente 'GitBranch' por 'IconNexus'.
*/
import React, { useState, useEffect, useCallback } from 'react';
import { Task, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
// CORREÇÃO: GitBranch -> IconNexus (O ícone de rede/conexão correto)
import { IconBlock as IconX, IconPlus as Plus, IconNexus } from '@/components/icons/PranaLandscapeIcons';
import { useTranslations } from '@/components/LanguageProvider'; // Ajuste de import path se necessário

export default function TaskConnectionManager({ 
  currentTaskId, 
  connections = [], 
  onConnectionsChange 
}) {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const { t } = useTranslations();

  const loadAvailableTasks = useCallback(async () => {
    try {
      const user = await User.me();
      if (!user) return;
      
      // Busca tarefas para conectar (idealmente filtrando as já conectadas no backend)
      const tasks = await Task.filter({ created_by: user.email, _sort: '-created_at' });
      
      // Filtragem no cliente para garantir segurança
      const filtered = tasks.filter(task => 
        task.id !== currentTaskId && 
        !task.deleted_at &&
        !connections.includes(task.id)
      );
      setAvailableTasks(filtered);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, [currentTaskId, connections]);

  useEffect(() => {
    if (showSelector) {
        loadAvailableTasks();
    }
  }, [showSelector, loadAvailableTasks]);

  const handleAddConnection = (taskId) => {
    const newConnections = [...connections, taskId];
    onConnectionsChange(newConnections);
    setShowSelector(false);
  };

  const handleRemoveConnection = (taskId) => {
    const newConnections = connections.filter(id => id !== taskId);
    onConnectionsChange(newConnections);
  };

  // Para exibir os nomes, precisamos buscá-los ou tê-los em cache.
  // Simplificação: Assume que 'availableTasks' tem tudo ou fazemos uma busca rápida pelos IDs conectados.
  // Numa implementação robusta, o componente pai passaria os nomes ou faríamos um fetch específico.
  // Aqui, vamos tentar mostrar o ID se o nome não estiver disponível imediatamente, ou buscar.
  
  // Nota: Este componente precisa ser otimizado para não buscar todas as tarefas do mundo.
  // Por enquanto, mantemos a lógica simples para funcionar.

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium flex items-center gap-2 text-foreground">
          <IconNexus className="w-4 h-4 text-primary" /> {/* Ícone Corrigido */}
          {t('task_connections') || 'Conexões'}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSelector(!showSelector)}
          className="h-8 text-xs border-white/10 hover:bg-white/5"
        >
          <Plus className="w-3 h-3 mr-1" />
          {t('add_connection') || 'Adicionar'}
        </Button>
      </div>

      {/* Lista de Conexões Ativas */}
      {connections.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs opacity-60">{t('connected_tasks') || 'Conectado a'}:</p>
          {connections.map(connId => (
            <div 
              key={connId} 
              className="flex items-center justify-between p-2 rounded-lg glass-effect text-sm border border-white/5"
            >
              {/* Tenta achar o nome na lista carregada ou mostra ID */}
              <span className="truncate text-xs font-mono opacity-80">
                  {availableTasks.find(t => t.id === connId)?.name || `Tarefa #${connId.slice(0,4)}...`}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveConnection(connId)}
                className="h-6 w-6 p-0 hover:text-red-400"
              >
                <IconX className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 border border-dashed border-white/10 rounded-lg opacity-40">
            <IconNexus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs italic">{t('no_connections') || 'Nenhuma dependência.'}</p>
        </div>
      )}

      {/* Seletor de Tarefas (Dropdown/Lista) */}
      {showSelector && (
        <div className="border rounded-lg p-2 bg-black/40 border-white/10 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-xs font-medium mb-2 px-1 opacity-70">{t('select_tasks_to_connect') || 'Selecione para conectar'}:</p>
          <div className="max-h-40 overflow-y-auto space-y-1 prana-scrollbar">
            {availableTasks.length > 0 ? availableTasks.map(task => (
              <button
                key={task.id}
                type="button"
                onClick={() => handleAddConnection(task.id)}
                className="w-full text-left p-2 rounded hover:bg-primary/20 hover:text-primary transition-colors text-xs truncate flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                {task.name}
              </button>
            )) : (
                <p className="text-xs opacity-50 p-2 text-center">Carregando ou nenhuma tarefa disponível...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
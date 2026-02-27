import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Project } from '@/api/entities';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * ToolCallBubble - Renderiza tool calls do Ash
 * Permite que Ash execute ações via botões interativos com confirmação
 * 
 * Tool types:
 * - create_task
 * - create_project
 * - update_task
 * - complete_task
 * - delete_task
 * - navigate_view
 * - open_dashboard
 * - list_tasks
 * - list_projects
 */
export default function ToolCallBubble({ 
  toolCall, 
  onExecute, 
  isLoading = false 
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);

  if (!toolCall) return null;

  const { 
    id, 
    type, 
    title, 
    description, 
    icon, 
    params = {}, 
    requiresConfirmation = false 
  } = toolCall;

  const handleExecute = async () => {
    if (requiresConfirmation && !confirmed) {
      setConfirmed(true);
      return;
    }

    setExecuting(true);
    try {
      let res;

      switch (type) {
        case 'create_task':
          res = await Task.create({
            title: params.title || 'Nova tarefa',
            description: params.description,
            due_date: params.due_date,
            priority: params.priority || 'medium',
          });
          toast.success(`✅ Tarefa criada: ${res.title}`);
          setResult({ success: true, data: res });
          onExecute?.({ type, id, result: res });
          break;

        case 'create_project':
          res = await Project.create({
            title: params.title || 'Novo projeto',
            description: params.description,
            color: params.color,
          });
          toast.success(`✅ Projeto criado: ${res.title}`);
          setResult({ success: true, data: res });
          onExecute?.({ type, id, result: res });
          break;

        case 'complete_task':
          if (params.taskId) {
            res = await Task.update(params.taskId, { completed: true });
            toast.success('✅ Tarefa concluída!');
            setResult({ success: true, data: res });
            onExecute?.({ type, id, result: res });
          }
          break;

        case 'update_task':
          if (params.taskId) {
            res = await Task.update(params.taskId, {
              title: params.title,
              description: params.description,
              due_date: params.due_date,
              priority: params.priority,
            });
            toast.success('✅ Tarefa atualizada!');
            setResult({ success: true, data: res });
            onExecute?.({ type, id, result: res });
          }
          break;

        case 'delete_task':
          if (params.taskId) {
            await Task.update(params.taskId, { deleted_at: new Date() });
            toast.success('✅ Tarefa arquivada!');
            setResult({ success: true, data: { id: params.taskId } });
            onExecute?.({ type, id, result: { id: params.taskId } });
          }
          break;

        case 'navigate_view':
          window.dispatchEvent(new CustomEvent('prana:open-view', {
            detail: { type: params.viewType, data: params.viewData }
          }));
          toast.success(`🚀 Navegando para ${params.viewType}...`);
          setResult({ success: true, data: { viewType: params.viewType } });
          onExecute?.({ type, id, result: { viewType: params.viewType } });
          break;

        case 'open_dashboard':
          window.dispatchEvent(new CustomEvent('prana:open-view', {
            detail: { type: 'DASHBOARD', data: params.dashboardData }
          }));
          toast.success('📊 Dashboard aberto!');
          setResult({ success: true, data: {} });
          onExecute?.({ type, id, result: {} });
          break;

        case 'list_tasks':
          res = await Task.filter(params.filter || { completed: false });
          setResult({ success: true, data: res });
          onExecute?.({ type, id, result: res });
          break;

        case 'list_projects':
          res = await Project.filter(params.filter || {});
          setResult({ success: true, data: res });
          onExecute?.({ type, id, result: res });
          break;

        case 'custom':
          // Tool call customizado - passar para o handler
          onExecute?.({ type: 'custom', id, params });
          toast.success('✅ Ação executada!');
          setResult({ success: true, data: {} });
          break;

        default:
          console.warn('Unknown tool call type:', type);
          toast.error('❌ Tipo de ação desconhecida');
      }
    } catch (error) {
      console.error('Tool call error:', error);
      toast.error(`❌ Erro: ${error.message}`);
      setResult({ success: false, error: error.message });
      onExecute?.({ type, id, error: error.message });
    } finally {
      setExecuting(false);
    }
  };

  // Se já foi executado com sucesso
  if (result?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'rounded-2xl bg-green-500/10 border border-green-500/20',
          'p-3 max-w-sm'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-sm font-medium text-green-400">{title}</p>
            <p className="text-xs text-green-400/70">Ação executada com sucesso</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Se falhou
  if (result?.error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'rounded-2xl bg-red-500/10 border border-red-500/20',
          'p-3 max-w-sm'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">❌</span>
          <div>
            <p className="text-sm font-medium text-red-400">{title}</p>
            <p className="text-xs text-red-400/70">{result.error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Estado normal (não executado)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10',
        'p-3 max-w-sm'
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Confirmation (if needed) */}
        {requiresConfirmation && confirmed && !executing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
          >
            <p className="text-xs text-yellow-400">
              ⚠️ Tem certeza? Esta ação não pode ser desfeita.
            </p>
          </motion.div>
        )}

        {/* Action Params (if any) */}
        {Object.keys(params).length > 0 && (
          <div className="p-2 bg-white/5 rounded-lg text-xs space-y-1">
            {Object.entries(params)
              .filter(([key]) => !key.startsWith('_'))
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex gap-2 text-muted-foreground">
                  <span className="opacity-60">{key}:</span>
                  <span className="truncate">
                    {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) : String(value)}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExecute}
            disabled={executing || isLoading}
            className={cn(
              'flex-1 h-10 rounded-lg font-medium text-sm',
              'transition-all duration-200',
              'border border-white/20',
              confirmed && requiresConfirmation
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30'
                : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30',
              (executing || isLoading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {executing || isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⚡
              </motion.span>
            ) : confirmed && requiresConfirmation ? (
              '🚨 Executar'
            ) : (
              `${icon || '▶'} Executar`
            )}
          </motion.button>

          {confirmed && requiresConfirmation && (
            <motion.button
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              onClick={() => setConfirmed(false)}
              className={cn(
                'px-3 h-10 rounded-lg font-medium text-sm',
                'bg-white/5 hover:bg-white/10 text-foreground',
                'border border-white/10 hover:border-white/20',
                'transition-all duration-200'
              )}
            >
              Cancelar
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

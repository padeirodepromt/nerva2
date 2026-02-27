/* src/components/fileTask/FileTaskPanel.jsx
   desc: Painel para visualizar e gerenciar associações File-Task bidirecionais.
   Used in: TaskDetailsView, DocEditorView
*/

import React, { useState, useEffect } from 'react';
import { FileTaskAssociationAPI } from '@/api/fileTaskAssociationAPI';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  IconFileText,
  IconTrash,
  IconLink,
  IconPlus,
  IconLoader2,
} from '@/components/icons/PranaLandscapeIcons';

const RELATIONSHIP_LABELS = {
  modify: 'Modificar',
  review: 'Revisar',
  create: 'Criar',
  reference: 'Referenciar',
  depends_on: 'Depende de',
};

const RELATIONSHIP_COLORS = {
  modify: 'bg-blue-500/10 text-blue-400',
  review: 'bg-amber-500/10 text-amber-400',
  create: 'bg-green-500/10 text-green-400',
  reference: 'bg-purple-500/10 text-purple-400',
  depends_on: 'bg-red-500/10 text-red-400',
};

/**
 * @param {{ type: 'task' | 'file', id: string, onAssociate?: () => void }} props
 */
export function FileTaskPanel({ type, id, onAssociate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssociations();
  }, [id, type]);

  const loadAssociations = async () => {
    try {
      setLoading(true);
      setError(null);

      if (type === 'task') {
        const files = await FileTaskAssociationAPI.getFilesByTask(id);
        setItems(files);
      } else if (type === 'file') {
        const tasks = await FileTaskAssociationAPI.getTasksByFile(id);
        setItems(tasks);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar associações:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (associatedId) => {
    try {
      if (type === 'task') {
        await FileTaskAssociationAPI.dissociateFileFromTask(id, associatedId);
      } else if (type === 'file') {
        await FileTaskAssociationAPI.dissociateTaskFromFile(id, associatedId);
      }
      await loadAssociations();
    } catch (err) {
      console.error('Erro ao remover associação:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <IconLoader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const title = type === 'task' ? 'Arquivos Relacionados' : 'Tarefas Relacionadas';
  const emptyMessage = type === 'task'
    ? 'Nenhum arquivo vinculado. Crie uma tarefa para um arquivo.'
    : 'Nenhuma tarefa vinculada. Crie uma tarefa para este arquivo.';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase opacity-70">{title}</h3>
        {onAssociate && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onAssociate}
            className="h-7 gap-1 text-xs"
          >
            <IconPlus className="w-3 h-3" />
            Adicionar
          </Button>
        )}
      </div>

      {error && (
        <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground opacity-60 p-2">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <FileTaskItem
              key={item.id || item.associationId}
              item={item}
              type={type}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Item individual de arquivo ou tarefa vinculada
 */
function FileTaskItem({ item, type, onRemove }) {
  const {
    id,
    title,
    status,
    relationship,
    fileUrl,
    documentType,
    isDone,
    priority,
  } = item;

  const relationshipLabel = RELATIONSHIP_LABELS[relationship] || relationship;
  const relationshipColor = RELATIONSHIP_COLORS[relationship] || 'bg-gray-500/10 text-gray-400';

  return (
    <Card className="glass-effect border-white/10 bg-white/5 p-3 flex items-start justify-between group hover:bg-white/10 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {type === 'file' ? (
            <IconFileText className="w-4 h-4 text-blue-400 shrink-0" />
          ) : (
            <IconLink className="w-4 h-4 text-green-400 shrink-0" />
          )}
          <h4 className="text-sm font-medium truncate text-white">{title}</h4>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className={`px-2 py-1 rounded ${relationshipColor}`}>
            {relationshipLabel}
          </span>

          {type === 'task' && status && (
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-muted-foreground">
              {status === 'done' ? '✓ ' : ''}
              {status === 'todo' ? 'A Fazer' : status === 'doing' ? 'Em Progresso' : status}
            </span>
          )}

          {type === 'file' && documentType && (
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-muted-foreground">
              {documentType}
            </span>
          )}
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove(id)}
        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
      >
        <IconTrash className="w-3 h-3 text-red-400" />
      </Button>
    </Card>
  );
}

export default FileTaskPanel;

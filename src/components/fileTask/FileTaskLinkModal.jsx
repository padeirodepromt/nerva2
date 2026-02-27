/* src/components/fileTask/FileTaskLinkModal.jsx
   desc: Modal para vincular Arquivos a Tarefas (ou vice-versa).
   features: Search, seleção de relacionamento, preview
*/

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileTaskAssociationAPI } from '@/api/fileTaskAssociationAPI';
import { 
  IconSearch, 
  IconLoader2,
  IconFileText,
  IconCheck,
} from '@/components/icons/PranaLandscapeIcons';

const RELATIONSHIP_OPTIONS = [
  { value: 'modify', label: 'Modificar este arquivo' },
  { value: 'review', label: 'Revisar este arquivo' },
  { value: 'create', label: 'Criar este arquivo' },
  { value: 'reference', label: 'Referenciar este arquivo' },
  { value: 'depends_on', label: 'Depende deste arquivo' },
];

/**
 * @param {{
 *   open: boolean
 *   onOpenChange: (open: boolean) => void
 *   type: 'task' | 'file'
 *   id: string (task ou file id)
 *   onLink: (association) => void
 * }} props
 */
export function FileTaskLinkModal({ open, onOpenChange, type, id, onLink }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [relationship, setRelationship] = useState('modify');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (open && searchQuery.length > 0) {
      performSearch();
    }
  }, [searchQuery, open]);

  const performSearch = async () => {
    try {
      setLoading(true);
      // Implementar busca de arquivos ou tarefas
      // Por enquanto, mock data
      setItems([
        { id: 'doc_1', title: 'Manifesto 2025', type: 'file', documentType: 'manifest' },
        { id: 'doc_2', title: 'Acordo de Parceria', type: 'file', documentType: 'agreement' },
        { id: 'doc_3', title: 'Guia de Implementação', type: 'file', documentType: 'guide' },
      ]);
    } catch (err) {
      console.error('Erro ao buscar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    if (!selectedItem) return;

    try {
      setSelecting(true);

      if (type === 'task') {
        await FileTaskAssociationAPI.associateFileToTask(id, selectedItem.id, relationship);
      } else {
        await FileTaskAssociationAPI.associateTaskToFile(id, selectedItem.id, relationship);
      }

      onLink?.({ fileId: selectedItem.id, taskId: id, relationship });
      onOpenChange(false);
      setSearchQuery('');
      setSelectedItem(null);
    } catch (err) {
      console.error('Erro ao vincular:', err);
    } finally {
      setSelecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'task' ? 'Vincular Arquivo à Tarefa' : 'Vincular Tarefa ao Arquivo'}
          </DialogTitle>
          <DialogDescription>
            Selecione {type === 'task' ? 'um arquivo' : 'uma tarefa'} para vincular e escolha o tipo de relacionamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${type === 'task' ? 'arquivos' : 'tarefas'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card/50 border-white/10"
            />
          </div>

          {/* Search Results */}
          <div className="border border-white/10 rounded-lg bg-black/20 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <IconLoader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : items.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">
                {searchQuery.length === 0
                  ? `Digite para buscar ${type === 'task' ? 'arquivos' : 'tarefas'}`
                  : 'Nenhum resultado encontrado'}
              </p>
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full text-left p-3 border-b border-white/5 hover:bg-white/5 transition-colors flex items-center gap-3 ${
                      selectedItem?.id === item.id ? 'bg-primary/10 border-primary' : ''
                    }`}
                  >
                    <IconFileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.documentType || item.type}</p>
                    </div>
                    {selectedItem?.id === item.id && (
                      <IconCheck className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Relationship Selector */}
          {selectedItem && (
            <div>
              <label className="text-xs font-medium uppercase opacity-70 mb-2 block">
                Tipo de Relacionamento
              </label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger className="bg-card/50 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLink}
              disabled={!selectedItem || selecting}
              className="gap-2"
            >
              {selecting && <IconLoader2 className="w-4 h-4 animate-spin" />}
              Vincular
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileTaskLinkModal;

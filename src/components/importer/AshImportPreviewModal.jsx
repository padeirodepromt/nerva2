/**
 * src/components/importer/AshImportPreviewModal.jsx
 * Modal para visualizar otimizações feitas pelo Ash
 * Mostra antes/depois com 5 tarefas em carousel
 */

import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  IconCheck, IconX, IconLoader2, IconArrowRight, IconChevronLeft, IconChevronRight 
} from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AshImportPreviewModal({ 
  isOpen, 
  onClose, 
  preview = [], 
  onConfirm, 
  onReject,
  isConfirming = false 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !preview || preview.length === 0) return null;

  const current = preview[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === preview.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentIndex(currentIndex - 1);
  };

  const handleConfirmAll = async () => {
    try {
      await onConfirm();
    } catch (error) {
      toast.error('Erro ao aplicar otimizações');
    }
  };

  const handleRejectAll = () => {
    onReject?.();
    onClose?.();
  };

  const hasChanges = current.changed && Object.values(current.changed).some(v => v);
  const priorityColor = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-secondary/30 border-white/10 text-foreground max-h-[85vh] overflow-auto">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <span className="text-2xl">✨</span>
            Ash Otimizou Suas Tarefas
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-2">
            Veja como Ash analisou e otimizou as tarefas importadas baseado em seu contexto holístico
          </p>
        </DialogHeader>

        {/* Content */}
        <div className="py-6 space-y-6">
          {/* Counter */}
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Tarefa {currentIndex + 1} de {preview.length}
            </div>
          </div>

          {/* Before Card */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-lg flex-shrink-0">❌</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2">
                  Antes (Original)
                </div>
                <div className="text-white font-medium">{current.before.title}</div>
                <div className="text-sm text-gray-400 mt-1">
                  Prioridade: <span className={cn(priorityColor[current.before.priority] || 'text-gray-400')}>
                    {current.before.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center">
            <div className="text-gray-500">⬇️</div>
          </div>

          {/* After Card */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-lg flex-shrink-0">✨</div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">
                    Depois (Otimizado)
                  </div>
                  <div className="text-white font-medium">{current.after.title}</div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <div className="text-xs text-gray-500">Prioridade</div>
                    <div className={cn('font-semibold text-sm', priorityColor[current.after.priority])}>
                      {current.after.priority}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Energia</div>
                    <div className="text-blue-400 font-semibold text-sm">
                      {current.after.energyRequired}/5
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Melhor Em</div>
                    <div className="text-cyan-400 font-semibold text-sm">
                      {current.after.bestTimeToWork || 'any'}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {current.after.tags && current.after.tags.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="text-xs text-gray-500 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {current.after.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insight */}
                {current.after.insight && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 text-lg flex-shrink-0">💡</span>
                      <p className="text-amber-100 text-sm italic">{current.after.insight}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Changes Summary */}
          {hasChanges && (
            <div className="text-sm bg-slate-800/50 p-3 rounded border border-white/5">
              <div className="font-semibold text-white mb-2">Mudanças Detectadas:</div>
              <div className="space-y-1 text-xs text-gray-400">
                {current.changed.title_changed && <div className="text-green-400">✓ Título expandido</div>}
                {current.changed.priority_changed && <div className="text-green-400">✓ Prioridade ajustada</div>}
                {current.changed.dueDate_changed && <div className="text-green-400">✓ Data sugerida</div>}
                {current.changed.energyRequired_added && <div className="text-green-400">✓ Energia necessária adicionada</div>}
              </div>
            </div>
          )}
        </div>

        {/* Navigation & Footer */}
        <DialogFooter className="flex-col gap-4">
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className="p-2 hover:bg-white/10 disabled:opacity-30 rounded transition-colors"
              aria-label="Anterior"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 px-4">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / preview.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={isLast}
              className="p-2 hover:bg-white/10 disabled:opacity-30 rounded transition-colors"
              aria-label="Próxima"
            >
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleRejectAll}
              disabled={isConfirming}
              variant="ghost"
              className="border border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <IconX className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>

            <Button
              onClick={handleConfirmAll}
              disabled={isConfirming}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              {isConfirming ? (
                <>
                  <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  Aplicando...
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4 mr-2" />
                  Confirmar Tudo ({preview.length})
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Todas as {preview.length} tarefas serão importadas com as otimizações do Ash
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AshImportPreviewModal;

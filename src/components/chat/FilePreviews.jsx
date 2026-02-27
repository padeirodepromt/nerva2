/**
 * src/components/chat/FilePreviews.jsx
 * Componente para exibir previews de arquivos anexados
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconX } from '@/components/icons/PranaLandscapeIcons';
import { generateFilePreview, formatBytes } from '@/utils/fileProcessing';
import { cn } from '@/lib/utils';

export default function FilePreviews({ files = [], onRemove = () => {} }) {
  if (!files || files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 py-3 bg-muted/30 border-t border-border/20 space-y-2"
    >
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 px-1">
        {files.length} arquivo{files.length > 1 ? 's' : ''} anexado{files.length > 1 ? 's' : ''}
      </div>

      <div className="space-y-2">
        {files.map((file, idx) => {
          const preview = generateFilePreview(file);

          return (
            <motion.div
              key={`${file.name}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg',
                'bg-muted/50 border border-border/30',
                'hover:bg-muted/70 transition-colors group'
              )}
            >
              {/* Icon + Info */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-base shrink-0">{preview.icon}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate text-foreground">
                    {preview.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {preview.subtitle}
                  </p>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-6 w-6 shrink-0',
                  'opacity-0 group-hover:opacity-100',
                  'hover:bg-destructive/10 hover:text-destructive',
                  'transition-all'
                )}
                onClick={() => onRemove(file.name)}
                title="Remover arquivo"
              >
                <IconX className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <div className="text-[9px] text-muted-foreground/50 px-1 italic">
        Arquivos serão processados e analisados pelo Ash
      </div>
    </motion.div>
  );
}

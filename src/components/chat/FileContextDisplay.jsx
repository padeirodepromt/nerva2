/**
 * src/components/chat/FileContextDisplay.jsx
 * Mostra contexto/informação sobre arquivo atual
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { IconX } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/utils/fileProcessing';

export default function FileContextDisplay({ file = null, onClear = () => {} }) {
  if (!file) return null;

  const iconMap = {
    text: '📄',
    pdf: '📕',
    doc: '📘',
    docx: '📘',
    xls: '📊',
    xlsx: '📊',
    csv: '📋',
    json: '{ }',
    image: '🖼️'
  };

  const icon = iconMap[file.type] || '📎';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="px-4 py-3 bg-muted/30 border-b border-border/20"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-lg flex-shrink-0 mt-0.5">{icon}</div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
            Contexto: Arquivo Anexado
          </p>
          <p className="text-xs font-medium text-foreground truncate">
            {file.name}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {file.type.toUpperCase()} • {formatBytes(file.size)}
          </p>
          {file.preview && (
            <p className="text-[10px] text-muted-foreground/70 mt-1.5 line-clamp-2">
              {file.preview.slice(0, 150)}...
            </p>
          )}
        </div>

        {/* Clear Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={onClear}
          title="Remover contexto"
        >
          <IconX className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

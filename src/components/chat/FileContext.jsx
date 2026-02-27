/**
 * src/components/chat/FileContext.jsx
 * Mostra contexto visual do arquivo selecionado/anexado
 */

import React from 'react';
import { motion } from 'framer-motion';
import { IconX, IconFile } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FileContext({ file = null, onClear = () => {} }) {
  if (!file) return null;

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      txt: '📄',
      md: '📝',
      csv: '📊',
      json: '{ }',
      xlsx: '📊',
      xls: '📊',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️'
    };
    return iconMap[ext] || '📎';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        'px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10',
        'border-l-2 border-blue-500/50',
        'flex items-center gap-3 group'
      )}
    >
      {/* File Icon + Info */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0">{getFileIcon(file.name)}</span>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            Contexto: {file.name}
          </p>
          <p className="text-[9px] text-muted-foreground">
            {file.type} • {formatBytes(file.size)}
          </p>
        </div>
      </div>

      {/* Clear Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-6 w-6 shrink-0',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'hover:bg-destructive/10 hover:text-destructive'
        )}
        onClick={onClear}
        title="Remover contexto"
      >
        <IconX className="w-3.5 h-3.5" />
      </Button>
    </motion.div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

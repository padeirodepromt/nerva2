import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconSend, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

/**
 * ChatInput - Input para enviar mensagens (Mobile + Desktop)
 * Features:
 * - Campo de texto com placeholder customizável
 * - Botão enviar com ícone
 * - Loading state
 * - Enter para enviar
 * - Responsive design
 */
export default function ChatInput({
  onSendMessage,
  isLoading = false,
  isMobile = false,
  placeholder = "Escreva uma mensagem...",
  className = ""
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input);
    setInput('');
    
    // Focus de volta no input
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn(
      'flex items-center gap-2 w-full',
      'bg-background/40 backdrop-blur-md rounded-lg',
      'border border-white/10',
      'p-2',
      isMobile ? 'px-3' : 'px-4',
      className
    )}>
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className={cn(
          'flex-1 bg-transparent border-0',
          'text-sm placeholder:text-muted-foreground/60',
          'focus-visible:ring-0 focus-visible:outline-none',
          'disabled:opacity-50',
          isMobile ? 'text-xs' : 'text-sm'
        )}
      />
      
      <Button
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        size="icon"
        variant="ghost"
        className={cn(
          'flex-shrink-0',
          'hover:bg-primary/20 text-primary',
          'disabled:opacity-30 disabled:cursor-not-allowed',
          isMobile ? 'h-8 w-8' : 'h-10 w-10'
        )}
        title="Enviar (Enter)"
      >
        {isLoading ? (
          <IconLoader2 className={cn(
            'animate-spin',
            isMobile ? 'w-4 h-4' : 'w-5 h-5'
          )} />
        ) : (
          <IconSend className={cn(
            isMobile ? 'w-4 h-4' : 'w-5 h-5'
          )} />
        )}
      </Button>
    </div>
  );
}

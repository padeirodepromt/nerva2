/**
 * src/components/chat/ChatHistorySearch.jsx
 * Mini histórico com search para o SideChat
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconClock, IconSearch, IconChevronDown, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/api/apiClient';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatHistorySearch({ onSelectConversation = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar histórico ao abrir
  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Buscar conversas (endpoint pode variar dependendo do seu backend)
      const res = await apiClient.get('/nexus');
      if (res.data && Array.isArray(res.data)) {
        setConversations(res.data.slice(0, 10)); // Últimas 10
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast.error('Erro ao carregar histórico');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = conversations.filter(c =>
    (c.title || 'Conversa').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-8 w-8 shrink-0',
          'hover:bg-muted/20 transition-colors',
          isOpen && 'bg-muted/30'
        )}
        title="Histórico de conversas"
      >
        <IconClock className="w-4 h-4 text-muted-foreground" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-background/95 backdrop-blur-md',
              'border border-border/30 rounded-lg',
              'shadow-xl'
            )}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-border/20">
              <div className="relative">
                <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                <Input
                  placeholder="Buscar conversa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-7 pl-8 text-xs bg-muted/30 border-border/20"
                  autoFocus
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <IconLoader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length > 0 ? (
                <div className="space-y-1 p-2">
                  {filtered.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full text-left p-2 rounded text-xs',
                        'hover:bg-muted/40 transition-colors',
                        'border border-transparent hover:border-border/20'
                      )}
                    >
                      <p className="font-medium text-foreground truncate">
                        {conv.title || 'Conversa Sem Título'}
                      </p>
                      {conv.createdAt && (
                        <p className="text-[10px] text-muted-foreground">
                          {format(parseISO(conv.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  {conversations.length === 0 ? 'Nenhuma conversa' : 'Nenhuma conversa encontrada'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

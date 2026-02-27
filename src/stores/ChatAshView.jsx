import React, { useRef, useEffect } from 'react';
import { usePranaChat } from "@/hooks/usePranaChat";
import { useAgentStore } from "@/stores/useAgentStore";
import { AGENTS } from "@/config/agentPersonas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MessageBubble from "@/components/chat/MessageBubble";
import { cn } from "@/lib/utils";
import { IconWind } from "@/components/icons/PranaLandscapeIcons";

/**
 * CHAT ASH VIEW
 * O componente de Chat adaptado para viver dentro de uma Aba do IDE.
 * Suporta Agentes Múltiplos (Ash, Caelum, Sophia).
 */
export default function ChatAshView({ compact = false }) {
  const { messages, sendMessage, isThinking, input, setInput } = usePranaChat();
  const { activeAgentId, setActiveAgent, getActiveAgent } = useAgentStore();
  const activeAgent = getActiveAgent();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, { agentId: activeAgentId }); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans">
      
      {/* HEADER DO AGENTE */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/5 shrink-0">
        <div className="flex gap-2 items-center">
          <div className={cn("w-2 h-2 rounded-full animate-pulse", activeAgent.color.replace('text-', 'bg-'))} />
          <span className={cn("font-serif font-bold text-sm", activeAgent.color)}>{activeAgent.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider border border-border px-1.5 py-0.5 rounded">
            {activeAgent.role}
          </span>
        </div>
        
        <div className="flex gap-1">
          {Object.values(AGENTS).map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={cn(
                "text-xs w-6 h-6 flex items-center justify-center rounded transition-all border",
                activeAgentId === agent.id 
                  ? "bg-muted text-foreground border-primary/50" 
                  : "border-transparent hover:bg-muted/50 text-muted-foreground"
              )}
              title={`Mudar para ${agent.name}`}
            >
              {agent.avatar}
            </button>
          ))}
        </div>
      </div>

      {/* MENSAGENS */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm mt-10 font-serif opacity-60">
              <div className="mb-4 text-4xl opacity-20 grayscale">{activeAgent.avatar}</div>
              <p>Conectado ao núcleo {activeAgent.name}...</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <MessageBubble 
              key={msg.id || i} 
              message={msg} 
              isCompact={compact}
              agentColor={msg.role === 'assistant' ? activeAgent.color : null}
            />
          ))}
          
          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse px-2">
              <IconWind className="w-3 h-3 animate-spin" />
              <span>{activeAgent.name} está pensando...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* INPUT */}
      <div className="p-3 border-t border-border bg-background/50 shrink-0">
        <div className="relative flex items-center gap-2 max-w-3xl mx-auto">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Fale com ${activeAgent.name}...`}
            className="pr-10 focus-visible:ring-1 focus-visible:ring-primary/50 bg-muted/20 border-border font-serif shadow-sm"
            autoFocus
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={handleSend}
            disabled={isThinking}
          >
            ↑
          </Button>
        </div>
        <div className="flex justify-between mt-2 px-1 max-w-3xl mx-auto text-[10px] text-muted-foreground">
           <span>Contexto: {activeAgentId.toUpperCase()}</span>
           <span>⌘K Comandos</span>
        </div>
      </div>
    </div>
  );
}
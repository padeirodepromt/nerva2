/* src/components/chat/ProjectChat.jsx
   desc: Chat Contextual de Projeto/Time (Human-to-Human).
   style: Minimalista, estilo Slack/Discord integrado.
   feat: Conectado ao Backend (CollabRoutes).
*/

import React, { useState, useEffect, useRef } from 'react';
import { IconSend, IconRefreshCcw } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Collab } from '@/api/entities';
import { toast } from "sonner";

// Helper para Renderizar Menções
const MessageContent = ({ content }) => {
    if (!content) return null;
    const parts = content.split(/(#[\w\u00C0-\u00FF-]+)/g);
    
    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('#') && part.length > 1) {
                    return (
                        <span 
                            key={i} 
                            onClick={() => toast.info(`Navegando para projeto ${part}...`)}
                            className="text-indigo-400 font-bold cursor-pointer hover:underline bg-indigo-500/10 px-1 rounded mx-0.5 transition-colors hover:bg-indigo-500/20"
                            title="Ir para o Projeto"
                        >
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </span>
    );
};

export default function ProjectChat({ projectId, teamId, contextId, contextTitle }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Resolve o ID do contexto (Time ou Projeto)
    // Se vier do TeamsView, contextId é o teamId.
    const activeTeamId = teamId || (!projectId ? contextId : null);
    const activeProjectId = projectId;

    const loadMessages = async () => {
        if (!activeTeamId && !activeProjectId) return;
        setLoading(true);
        try {
            const msgs = await Collab.getMessages({ 
                teamId: activeTeamId, 
                projectId: activeProjectId,
                limit: 50 
            });
            setMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
            // Silencioso para não spammar toast em polling
        } finally {
            setLoading(false);
        }
    };

    // Load inicial e Polling simples (a cada 10s)
    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 10000); 
        return () => clearInterval(interval);
    }, [activeTeamId, activeProjectId]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const tempId = Date.now().toString();
        const optimisticMsg = {
            id: tempId,
            content: input,
            createdAt: new Date().toISOString(),
            sender: { 
                name: user?.name || 'Eu', 
                avatarUrl: user?.avatarUrl,
                id: user?.id 
            },
            isOptimistic: true
        };

        // Optimistic UI
        setMessages(prev => [...prev, optimisticMsg]);
        setInput('');
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        
        try {
            await Collab.sendMessage({
                content: optimisticMsg.content,
                teamId: activeTeamId,
                projectId: activeProjectId,
                senderId: user?.id
            });
            // Recarrega para obter o ID real e garantir sincronia
            loadMessages();
        } catch (error) {
            toast.error("Falha ao enviar mensagem.");
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/20 rounded-xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <span className="text-[rgb(var(--accent-rgb))]">#</span> {contextTitle || (activeTeamId ? 'time' : 'projeto')}
                </div>
                <Button size="icon" variant="ghost" onClick={loadMessages} className="h-6 w-6 text-muted-foreground hover:text-white">
                    <IconRefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Lista de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && !loading && (
                    <div className="text-center text-muted-foreground text-xs py-10 opacity-50">
                        Nenhuma mensagem ainda. Inicie a conversa.
                    </div>
                )}
                
                {messages.map(msg => {
                    const isMe = msg.sender?.id === user?.id;
                    return (
                        <div key={msg.id} className={`flex gap-3 ${msg.isOptimistic ? 'opacity-70' : ''} ${isMe ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="w-8 h-8 mt-1 border border-white/10">
                                <AvatarImage src={msg.sender?.avatarUrl} />
                                <AvatarFallback className="bg-card text-[10px] text-muted-foreground">
                                    {(msg.sender?.name || '?').charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-bold text-foreground">{msg.sender?.name}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {msg.createdAt ? format(new Date(msg.createdAt), 'HH:mm') : ''}
                                    </span>
                                </div>
                                <div className={`px-3 py-2 rounded-lg text-sm leading-relaxed ${
                                    isMe 
                                        ? 'bg-[rgba(var(--accent-rgb),0.15)] text-white border border-[rgba(var(--accent-rgb),0.2)]' 
                                        : 'bg-white/5 text-gray-300 border border-white/5'
                                }`}>
                                    <MessageContent content={msg.content} />
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white/5 border-t border-white/5 flex gap-2">
                <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Enviar mensagem...`}
                    className="bg-black/20 border-white/10 text-sm h-10 focus-visible:ring-[rgb(var(--accent-rgb))]"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button size="icon" onClick={handleSend} className="h-10 w-10 bg-[rgb(var(--accent-rgb))] hover:bg-[rgb(var(--accent-rgb))]/80 text-black">
                    <IconSend className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
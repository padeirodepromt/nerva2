/* src/components/chat/MessageBubble.jsx
   desc: Message Bubble V10 (Com Action Card, Dança e Tool Calls Nativas).
   feat: Renderiza texto, arquivos, propostas de ação e respostas de ferramentas do ecossistema Prana.
*/

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Paperclip, Folder, CheckSquare } from '@/components/icons/PranaLandscapeIcons';
import { motion } from "framer-motion";
import { format } from "date-fns";
import PranaMiniLoader from '@/components/PranaMiniLoader';
import ActionConfirmationCard from './ActionConfirmationCard'; 
import BubbleRenderer from './BubbleRenderer'; 
import ToolCallBubble from './bubbles/ToolCallBubble'; 

// [V10] Novo componente que escuta as ferramentas de backend (como o Diff do Neo)
import ToolCallResultCard from './ToolCallResultCard';

// Componente simples para anexos de arquivo
const FileAttachment = ({ fileUrl }) => {
    const fileName = fileUrl.split('/').pop() || 'Arquivo anexado';
    return (
        <div className="mt-2 p-2 glass-effect rounded-lg flex items-center gap-2 max-w-xs bg-black/20 border-white/5">
            <Paperclip className="w-4 h-4 opacity-60 text-accent" />
            <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs hover:underline flex-1 truncate text-accent/80 hover:text-accent"
            >
                {fileName}
            </a>
        </div>
    );
};

function MessageBubble({ message, isAiThinking = false, isMobile = false }) {
    const isUser = message.role === 'user';
    
    // Extração de Tool Responses (Onde o Ash guarda suas ações antigas)
    const toolResponse = message.toolResponse || {};
    const clientAction = toolResponse.client_action;
    
    // Verifica se é uma Proposta de Ação (Draft Mode)
    const isProposal = clientAction?.type === 'PROPOSE_ACTION';

    // [V10] Extração Pura de Tool Calls do Vercel SDK ou da nossa Pipeline
    const rawToolCalls = message.toolInvocations || message.toolCalls || message.tool_calls || [];

    // Lógica da "Dança" (Highlight no Canvas ao passar o mouse)
    const safeMessage = { ...message, content: message.content || '', file_urls: message.file_urls || [] };
    const highlightIds = clientAction?.data?.highlightIds || [];

    const handleHighlight = (id, active) => {
        if (!id) return;
        window.dispatchEvent(new CustomEvent('prana:highlight-item', { 
            detail: { id, active } 
        }));
    };

    const handleBubbleHover = (active) => {
        if (highlightIds.length > 0) {
            highlightIds.forEach(id => handleHighlight(id, active));
        }
    };

    // Callback quando o card é executado com sucesso pelo usuário
    const handleProposalExecuted = (result) => {
        if (result.client_action) {
            window.dispatchEvent(new CustomEvent('prana:client-action', { detail: result.client_action }));
        }
    };

    // Se não tem conteúdo visível, não é proposta, nem tool call, e não tá pensando: esconde
    if (!isUser && !safeMessage.content && !isProposal && rawToolCalls.length === 0 && !isAiThinking) return null;

    // Parser para links inteligentes [Texto](type:id) dentro do markdown
    const parseContentWithLinks = (content) => {
        const linkPattern = /\[([^\]]+)\]\((task|project):([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkPattern.exec(content)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
            }
            parts.push({
                type: 'link',
                text: match[1],
                itemType: match[2],
                itemId: match[3]
            });
            lastIndex = linkPattern.lastIndex;
        }
        if (lastIndex < content.length) {
            parts.push({ type: 'text', content: content.slice(lastIndex) });
        }
        return parts.length > 0 ? parts : [{ type: 'text', content }];
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"} w-full`}
            onMouseEnter={() => handleBubbleHover(true)} 
            onMouseLeave={() => handleBubbleHover(false)}
        >
            {/* Avatar do Assistente */}
            {!isUser && (
                <div className="h-8 w-8 mt-1 flex-shrink-0 rounded-full glass-effect flex items-center justify-center border border-white/10 shadow-sm">
                   {isAiThinking ? <PranaMiniLoader /> : <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(249,115,22,0.5)]" />}
                </div>
            )}

            <div className={`max-w-[85%] lg:max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                
                {/* 1. TEXTO DA MENSAGEM (Markdown) */}
                {(safeMessage.content || isAiThinking) && (
                    <div className={`
                        rounded-2xl px-5 py-3 shadow-sm backdrop-blur-md border transition-all duration-300 w-full
                        ${isUser 
                            ? "bg-accent/10 border-accent/20 text-foreground rounded-br-none" 
                            : "glass-effect border-white/10 text-foreground/90 rounded-bl-none bg-black/20 hover:border-white/20"
                        }
                    `}>
                        {isAiThinking && !safeMessage.content ? (
                            <div className="flex items-center gap-2 text-sm opacity-70 italic">
                                <PranaMiniLoader /> <span>Tecendo a realidade...</span>
                            </div>
                        ) : (
                            <div className="text-sm leading-relaxed prose prose-invert prose-p:my-1 prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10 max-w-none w-full">
                                <ReactMarkdown 
                                    components={{
                                        p: ({ children }) => (
                                            <p className="mb-2 last:mb-0">
                                                {typeof children === 'string' ? (
                                                    parseContentWithLinks(children).map((part, index) => (
                                                        part.type === 'link' ? (
                                                            <span 
                                                                key={index} 
                                                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/20 text-accent text-xs font-medium border border-accent/20 mx-1 cursor-pointer hover:bg-accent/30 transition-colors"
                                                                onMouseEnter={(e) => {
                                                                    e.stopPropagation(); 
                                                                    handleHighlight(part.itemId, true);
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.stopPropagation();
                                                                    handleHighlight(part.itemId, false);
                                                                }}
                                                            >
                                                                {part.itemType === 'project' ? <Folder className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}
                                                                {part.text}
                                                            </span>
                                                        ) : <span key={index}>{part.content}</span>
                                                    ))
                                                ) : children}
                                            </p>
                                        ),
                                        code: ({ inline, className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <div className="relative group/code my-3 w-full">
                                                    <div className="absolute -top-3 right-2 px-2 py-0.5 rounded-b bg-white/10 text-[10px] font-mono text-muted-foreground uppercase">
                                                        {match[1]}
                                                    </div>
                                                    <pre className="glass-effect rounded-lg p-3 overflow-x-auto border border-white/10 !bg-black/40 w-full">
                                                        <code className={className} {...props}>{children}</code>
                                                    </pre>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/code:opacity-100 hover:bg-white/10 transition-opacity"
                                                        onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                        title="Copiar Código"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <code className="px-1.5 py-0.5 rounded bg-white/10 text-accent-foreground font-mono text-xs border border-white/5">
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {safeMessage.content}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}

                {/* 🧩 1.5. TOOL CALL RESULT CARDS (V10 - NeoDiff, Grep, Web Search) */}
                {rawToolCalls.length > 0 && (
                    <div className="w-full flex flex-col gap-2 mt-2">
                        {rawToolCalls.map((tool, index) => {
                            const toolName = tool.toolName || tool.name;
                            const args = tool.args || tool.arguments;
                            const result = tool.result;

                            return (
                                <ToolCallResultCard 
                                    key={tool.toolCallId || tool.id || index}
                                    toolName={toolName}
                                    args={args}
                                    result={result}
                                    state={tool.state} 
                                />
                            );
                        })}
                    </div>
                )}

                {/* 2. CARD DE CONFIRMAÇÃO (DRAFT MODE) */}
                {isProposal && (
                    <div className="mt-2 w-full max-w-md animate-in slide-in-from-top-2 fade-in">
                        <ActionConfirmationCard 
                            proposal={clientAction.data} 
                            onExecuted={handleProposalExecuted}
                        />
                    </div>
                )}
                
                {/* 3. BUBBLE INTERATIVO DE UI (Formulários, Listas, etc) */}
                {/* Ignora 'tool_call' puro para não dar conflito com o V10 */}
                {!isMobile && message.type && !isUser && message.type !== 'tool_call' && message.type !== 'tool_calls' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 w-full"
                    >
                        <BubbleRenderer 
                            message={message}
                            onInteraction={(action, data) => {
                                window.dispatchEvent(new CustomEvent('prana:bubble-interaction', {
                                    detail: { action, data, messageId: message.id }
                                }));
                            }}
                        />
                    </motion.div>
                )}

                {/* 4. TOOL CALLS ANTIGAS (MOBILE) */}
                {isMobile && (message.type === 'tool_call' || message.type === 'tool_calls') && !isUser && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 space-y-2 w-full"
                    >
                        {message.type === 'tool_call' && (
                            <ToolCallBubble
                                toolCall={message.data?.toolCall || message.data}
                                onExecute={(result) => {
                                    window.dispatchEvent(new CustomEvent('prana:tool-call-executed', {
                                        detail: { toolCallId: result.id, result }
                                    }));
                                }}
                            />
                        )}
                        {message.type === 'tool_calls' && (
                            <div className="space-y-2 w-full">
                                {(message.data?.toolCalls || []).map((toolCall, idx) => (
                                    <ToolCallBubble
                                        key={toolCall.id || idx}
                                        toolCall={toolCall}
                                        onExecute={(result) => {
                                            window.dispatchEvent(new CustomEvent('prana:tool-call-executed', {
                                                detail: { toolCallId: result.id, result }
                                            }));
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* 5. ANEXOS */}
                {safeMessage.file_urls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1 justify-end w-full">
                        {safeMessage.file_urls.map((fileUrl, idx) => <FileAttachment key={idx} fileUrl={fileUrl} />)}
                    </div>
                )}

                {/* 6. META (Hora) */}
                {safeMessage.created_date && !isAiThinking && (
                    <span className={`text-[10px] opacity-30 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'} w-full`}>
                        {format(new Date(safeMessage.created_date), "HH:mm")}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

export default MessageBubble;
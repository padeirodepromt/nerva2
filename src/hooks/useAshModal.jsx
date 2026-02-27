import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Bot, Send } from '@/components/icons/PranaLandscapeIcons';
import { usePranaChat } from '@/hooks/usePranaChat';
import { Link } from 'react-router-dom';

// 1. Criação do Contexto
const AshModalContext = createContext(null);

// 2. Componente Provedor (Provider)
export const AshModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialPrompt, setInitialPrompt] = useState('');
    const [contextInfo, setContextInfo] = useState('');

    // Reutiliza a lógica principal do chat
    const { handleSendMessage, conversation, isAiThinking } = usePranaChat();

    const openAshModal = useCallback((prompt = '', context = '') => {
        setInitialPrompt(prompt);
        setContextInfo(context);
        setIsOpen(true);
        // Envia o prompt inicial assim que o modal abre
        if (prompt) {
            handleSendMessage(prompt);
        }
    }, [handleSendMessage]);

    const closeAshModal = useCallback(() => {
        setIsOpen(false);
        setInitialPrompt('');
        setContextInfo('');
    }, []);

    const value = { openAshModal, closeAshModal };

    return (
        <AshModalContext.Provider value={value}>
            {children}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                        onClick={closeAshModal}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl h-[70vh] bg-background/80 border border-border/50 rounded-2xl shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Cabeçalho do Modal */}
                            <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <Bot className="w-6 h-6 text-accent" />
                                    <div>
                                        <h2 className="font-bold text-lg text-foreground">Converse com Ash</h2>
                                        {contextInfo && <p className="text-xs text-muted-foreground">{contextInfo}</p>}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={closeAshModal}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Corpo do Chat (Placeholder) */}
                            <div className="flex-1 p-4 text-center text-muted-foreground overflow-y-auto">
                                <p>Interface de Chat do Modal (Em Desenvolvimento)</p>
                                <p className="mt-4 text-sm">
                                    A intenção é que aqui haja uma mini-interface de chat.
                                </p>
                                {initialPrompt && (
                                     <div className="mt-6 p-3 bg-white/5 rounded-lg text-left">
                                        <p className="text-xs font-bold uppercase text-accent">INTENÇÃO INICIAL ENVIADA:</p>
                                        <p className="text-sm font-mono mt-2">{initialPrompt}</p>
                                     </div>
                                )}
                                {isAiThinking && <p className="mt-4 text-sm animate-pulse">Ash está pensando...</p>}
                            </div>

                             {/* Input do Modal (Simplificado) */}
                             <div className="p-4 border-t border-border/50 text-center">
                                 <p className="text-xs text-muted-foreground">
                                     Continue a conversa na <Link to="/chat" className="underline text-accent" onClick={closeAshModal}>página de Chat</Link> para ver o histórico completo.
                                 </p>
                             </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AshModalContext.Provider>
    );
};

// 3. Hook Customizado
export const useAshModal = () => {
    const context = useContext(AshModalContext);
    if (!context) {
        throw new Error('useAshModal deve ser usado dentro de um AshModalProvider');
    }
    return context;
};


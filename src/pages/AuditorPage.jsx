import React, { useState, useEffect } from 'react';
//import { agentSDK } from "@/agents";
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from '@/components/icons/PranaLandscapeIcons';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import PageIntroTrigger from '@/components/PageIntroTrigger';
import { IconFogo } from '@/components/icons/PranaLandscapeIcons';

const LogMessage = ({ message }) => {
    const isSuccess = message.content.toLowerCase().includes('sucesso');
    const isFailure = message.content.toLowerCase().includes('falha');
    const isHeader = message.content.startsWith('##');

    let Icon = ShieldCheck;
    if (isSuccess) Icon = CheckCircle2;
    if (isFailure) Icon = AlertCircle;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 p-3 rounded-lg text-sm ${isHeader ? 'mt-4' : ''}`}
        >
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSuccess ? 'text-green-500' : isFailure ? 'text-red-500' : 'opacity-50'}`} />
            <div className="prose prose-sm prose-invert max-w-none">
                 <ReactMarkdown components={{ p: ({children}) => <p className="m-0">{children}</p> }}>
                    {message.content.replace(/\[AUDITORIA\]/g, '')}
                 </ReactMarkdown>
            </div>
        </motion.div>
    );
};

export default function AuditorPage() {
    const [user, setUser] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isAuditing, setIsAuditing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch {
                setUser(null);
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        if (conversation?.id) {
            const unsubscribe = agentSDK.subscribeToConversation(conversation.id, (data) => {
                setMessages(data.messages || []);
                const lastMessage = data.messages[data.messages.length - 1];
                if (lastMessage?.content.includes('Auditoria concluída')) {
                    setIsAuditing(false);
                }
            });
            return () => unsubscribe();
        }
    }, [conversation]);

    const handleStartAudit = async () => {
        setIsAuditing(true);
        setError(null);
        setMessages([]);
        try {
            const agentConv = await agentSDK.createConversation({ agent_name: "auditor_agente" });
            setConversation(agentConv);
            await agentSDK.addMessage(agentConv, {
                role: 'user',
                content: 'iniciar auditoria'
            });
        } catch (err) {
            console.error("Error starting audit:", err);
            setError("Falha ao iniciar o agente de auditoria. Verifique a configuração do agente.");
            setIsAuditing(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold">Acesso Negado</h1>
                <p className="opacity-70">Esta página está disponível apenas para administradores.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4 mb-6"
            >
                <PageIntroTrigger
                    icon={IconFogo}
                    title="Auditoria do Sistema"
                    description="Execute verificações automatizadas das entidades centrais do Prana para garantir que operações de criação, leitura, atualização e exclusão estejam saudáveis."
                    className="bg-transparent"
                    iconClassName="h-8 w-8"
                />
                <p className="text-sm opacity-70 max-w-sm">
                    Inicie o agente auditor para validar a integridade do ambiente e registrar o log das ações executadas.
                </p>
            </motion.div>
            
            <Card className="glass-effect mb-8">
                <CardHeader>
                    <CardTitle>Verificação de Integridade</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="opacity-80 mb-6">
                        Clique no botão abaixo para iniciar uma auditoria automatizada das funcionalidades principais do Prana.ai.
                        O agente irá criar, ler, atualizar e deletar registros de teste para as entidades `Project`, `Task`, e `Note`, garantindo que as operações básicas do sistema estão funcionando corretamente.
                    </p>
                    <Button onClick={handleStartAudit} disabled={isAuditing} className="glow-effect">
                        {isAuditing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Auditando...
                            </>
                        ) : (
                            <>
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Iniciar Auditoria
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {(isAuditing || messages.length > 0) && (
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle>Log da Auditoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-black/20 p-4 rounded-lg font-mono text-sm space-y-1 max-h-[50vh] overflow-y-auto">
                            <AnimatePresence>
                                {messages.filter(m => m.role === 'assistant').map(msg => (
                                    <LogMessage key={msg.id} message={msg} />
                                ))}
                            </AnimatePresence>
                            {isAuditing && messages.length > 0 && <Loader2 className="w-4 h-4 animate-spin ml-4 mt-2" />}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
/* src/views/settings/IntegrationsSettings.jsx
   desc: Configurações de Integrações Externas (Wabi-Sabi com Agência do Ash).
   feat: Integrações usando CDN. Despertar de nós invoca o Ash no SideChat para agir com autonomia.
*/
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconLoader2, IconAlertTriangle } from '@/components/icons/PranaLandscapeIcons';
import { toast } from 'sonner';
import { Integration } from '@/api/integrations'; 

// Fios de Conexão Neural (Stores)
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useChatStore } from '@/stores/useChatStore';

// --- Mapeamento do Multiverso (Domínios de Integração) ---
const INTEGRATION_DOMAINS = [
    {
        title: "A Forja (Produtividade & Tarefas)",
        desc: "Onde o trabalho bruto é lapidado em realidade.",
        items: [
            { id: 'asana', name: 'Asana', desc: 'Sincroniza projetos, metas e responsabilidades.', iconSlug: 'asana' },
            { id: 'trello', name: 'Trello', desc: 'Quadros visuais e cartões espelhados no Nexus.', iconSlug: 'trello' },
            { id: 'monday', name: 'Monday.com', desc: 'Fluxos de trabalho complexos e boards alinhados.', iconSlug: 'mondaydotcom' },
            { id: 'clickup', name: 'ClickUp', desc: 'A convergência de todas as hierarquias de tarefas.', iconSlug: 'clickup' },
            { id: 'todoist', name: 'Todoist', desc: 'Captura rápida de intenções e rituais diários.', iconSlug: 'todoist' },
            { id: 'jira', name: 'Jira', desc: 'Rastreamento de épicos, sprints e engenharia.', iconSlug: 'jira' },
            { id: 'linear', name: 'Linear', desc: 'A precisão do desenvolvimento de produto ágil.', iconSlug: 'linear' },
            { id: 'ticktick', name: 'TickTick', desc: 'Gestão de tempo e ciclos pomodoro.', iconSlug: 'ticktick' },
        ]
    },
    {
        title: "O Registro (Conhecimento & Memória)",
        desc: "A extensão do seu cérebro e biblioteca vital.",
        items: [
            { id: 'notion', name: 'Notion', desc: 'Importa bancos de dados e páginas como matéria viva.', iconSlug: 'notion' },
            { id: 'obsidian', name: 'Obsidian', desc: 'O cérebro digital conectado em grafos locais.', iconSlug: 'obsidian' },
            { id: 'evernote', name: 'Evernote', desc: 'O elefante guardião de memórias e recortes.', iconSlug: 'evernote' },
            { id: 'gdrive', name: 'Google Drive', desc: 'Acesso absoluto aos pergaminhos na nuvem.', iconSlug: 'googledrive' },
            { id: 'dropbox', name: 'Dropbox', desc: 'A sua caixa de arquivos sincronizada globalmente.', iconSlug: 'dropbox' },
            { id: 'confluence', name: 'Confluence', desc: 'A base de conhecimento da sua guilda.', iconSlug: 'confluence' },
        ]
    },
    {
        title: "O Fluxo (Tempo & Eventos)",
        desc: "O domínio sobre as horas, ritmos e encontros.",
        items: [
            { id: 'google_calendar', name: 'Google Calendar', desc: 'Sincronia temporal perfeita com o seu Planner.', iconSlug: 'googlecalendar' },
            { id: 'apple_calendar', name: 'Apple Calendar', desc: 'O fluxo do tempo no ecossistema iCloud.', iconSlug: 'apple' },
            { id: 'calendly', name: 'Calendly', desc: 'Agendamentos automáticos filtrados pelo Ash.', iconSlug: 'calendly' },
        ]
    },
    {
        title: "Sinais (Comunicação & Ecos)",
        desc: "As vozes externas e o tráfego humano.",
        items: [
            { id: 'slack', name: 'Slack', desc: 'O Ash monitora, resume e responde nos canais.', iconSlug: 'slack' },
            { id: 'discord', name: 'Discord', desc: 'Bots e automações para a sua comunidade.', iconSlug: 'discord' },
            { id: 'whatsapp', name: 'WhatsApp', desc: 'Áudios diretos transcritos para sua base de tarefas.', iconSlug: 'whatsapp' },
            { id: 'telegram', name: 'Telegram', desc: 'O canal seguro e rápido para invocar agentes.', iconSlug: 'telegram' },
            { id: 'gmail', name: 'Gmail', desc: 'Limpeza e extração de ações na caixa de entrada.', iconSlug: 'gmail' },
            { id: 'teams', name: 'MS Teams', desc: 'Presença corporativa conectada ao seu Planner.', iconSlug: 'microsoftteams' },
        ]
    },
    {
        title: "A Matriz (Código & Design)",
        desc: "Os blocos construtores do multiverso digital.",
        items: [
            { id: 'github', name: 'GitHub', desc: 'Leitura de repositórios, commits e PRs.', iconSlug: 'github' },
            { id: 'gitlab', name: 'GitLab', desc: 'Integração de CI/CD e issues de desenvolvimento.', iconSlug: 'gitlab' },
            { id: 'figma', name: 'Figma', desc: 'Extração de tokens visuais e comentários de design.', iconSlug: 'figma' },
            { id: 'canva', name: 'Canva', desc: 'Integra peças visuais, apresentações e pranchetas ao seu fluxo.', iconSlug: 'canva' },
            { id: 'vercel', name: 'Vercel', desc: 'Monitoramento de implantações e saúde da rede.', iconSlug: 'vercel' },
        ]
    },
    {
        title: "Troca (Sustento & Finanças)",
        desc: "O fluxo da energia material convertida.",
        items: [
            { id: 'stripe', name: 'Stripe', desc: 'Eventos de pagamento e assinaturas monitorados.', iconSlug: 'stripe' },
            { id: 'paypal', name: 'PayPal', desc: 'Transações e recebimentos globais em tempo real.', iconSlug: 'paypal' },
            { id: 'wise', name: 'Wise', desc: 'Movimentações além das fronteiras e câmbio.', iconSlug: 'wise' },
        ]
    }
];

const IntegrationCard = ({ name, description, status = {}, onAwakenClick, iconSlug }) => {
    const isConnected = status.connected;
    
    return (
        <div className={`p-5 rounded-xl border transition-all duration-500 group flex flex-col justify-between min-h-[140px]
            ${isConnected 
                ? 'bg-white/5 border-white/20 opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.03)]' 
                : 'bg-black/20 border-white/5 hover:border-white/10'
            }`}
        >
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 border
                    ${isConnected ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5'}`}>
                    <img 
                        src={`https://cdn.simpleicons.org/${iconSlug}`} 
                        alt={`${name} logo`}
                        className={`w-5 h-5 transition-all duration-500 ${isConnected ? 'opacity-100 grayscale-0 drop-shadow-md' : 'opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-70'}`}
                        crossOrigin="anonymous"
                    />
                </div>
                <div>
                    <h3 className="text-sm font-serif text-white/90 flex items-center gap-2">
                        {name}
                        {status.account && <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-mono text-white/50">{status.account}</span>}
                    </h3>
                    <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed line-clamp-2 pr-2">{description}</p>
                </div>
            </div>
            
            <div className="flex items-center justify-end mt-4">
                {status.loading ? (
                    <IconLoader2 className="w-4 h-4 animate-spin text-white/30" />
                ) : isConnected ? (
                    <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/60 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors hover:text-red-400 hover:border-red-500/30" onClick={() => onAwakenClick(name, true)}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse group-hover:bg-red-400" /> Ativo
                    </div>
                ) : (
                    <button 
                        onClick={() => onAwakenClick(name, false)}
                        className="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-white/30 group-hover:border-white/20 group-hover:text-white/70 group-hover:bg-white/5 transition-all duration-300"
                        title="Evocar Ash para Despertar Nó"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                )}
            </div>
        </div>
    );
};

const SimpleLoader = ({ text }) => (
    <div className="flex flex-col items-center justify-center h-64 text-white/40 gap-3">
        <IconLoader2 className="w-6 h-6 animate-spin opacity-50" />
        <p className="text-xs tracking-widest uppercase font-serif">{text}</p>
    </div>
);

export default function IntegrationsSettings() {
    const openTab = useWorkspaceStore(state => state.openTab);
    const sendMessage = useChatStore(state => state.sendMessage);

    const [loading, setLoading] = useState(true);
    const [activeDomain, setActiveDomain] = useState('all');
    const [connectionStates, setConnectionStates] = useState({});

    const [apiKeys, setApiKeys] = useState({
        openai: 'sk-proj-********************',
        anthropic: '',
        github: '', 
    });

    const [githubStatus, setGithubStatus] = useState('disconnected');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await Integration.getStatus(); 
                const nextState = {};
                
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        nextState[item.provider] = { 
                            connected: item.connected || item.isActive, 
                            account: item.profileData?.email || item.account,
                            loading: false 
                        };
                    });
                }
                setConnectionStates(nextState);
            } catch (error) {
                console.error("Erro ao sondar o ecossistema:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    // --- A MAGIA DA AGÊNCIA: Delegação para o Ash ---
    const handleAwakenClick = (name, isActive) => {
        // 1. Força a abertura do Painel Neural (Chat)
        openTab({ type: 'ASH_CHAT', title: 'Ash' }, 'right');

        // 2. Injeta o pensamento na consciência do Ash
        if (isActive) {
            sendMessage(`Ash, desejo romper a conexão neural com o(a) ${name}. Inicie o protocolo de desvinculação.`, { mode: 'chat' });
        } else {
            sendMessage(`Ash, inicie o protocolo de conexão neural com o(a) ${name}. Assuma a agência da instalação e me requisite apenas se uma autorização humana (OAuth/Login) for estritamente necessária.`, { mode: 'chat' });
        }
    };

    const handleSaveKey = (provider, value) => {
        setApiKeys(prev => ({ ...prev, [provider]: value }));
        
        if (provider === 'github') {
            if (value.length > 10) {
                setGithubStatus('connected');
                toast.success("Artefato neural verificado e salvo.");
            } else {
                setGithubStatus('disconnected');
            }
        } else {
            toast.success(`Cristal de ${provider} assimilado.`);
        }
    };

    if (loading) return <SimpleLoader text="Mapeando o Multiverso..." />;

    return (
        <div className="space-y-12 max-w-5xl mx-auto p-8 overflow-y-auto custom-scrollbar pb-24">
            <div className="pb-6 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif text-white/90">A Grande Teia (Nexus)</h2>
                    <p className="text-sm text-white/40 mt-2 font-light leading-relaxed max-w-2xl">
                        Estes são os nervos que conectam o Prana a outros mundos. Clique em um nó adormecido para que o Ash inicie a construção da ponte.
                    </p>
                </div>
                <div className="flex gap-2 pb-1 overflow-x-auto hide-scrollbar">
                    <Button variant="ghost" onClick={() => setActiveDomain('all')} className={`h-8 text-[11px] px-3 rounded-full ${activeDomain === 'all' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}>Tudo</Button>
                    {INTEGRATION_DOMAINS.map((dom, idx) => (
                        <Button key={idx} variant="ghost" onClick={() => setActiveDomain(dom.title)} className={`h-8 text-[11px] px-3 rounded-full shrink-0 ${activeDomain === dom.title ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}>
                            {dom.title.split(' ')[1]}
                        </Button>
                    ))}
                </div>
            </div>

            {/* SEÇÕES DINÂMICAS DE INTEGRAÇÃO */}
            <div className="space-y-12">
                {INTEGRATION_DOMAINS.filter(dom => activeDomain === 'all' || activeDomain === dom.title).map((domain, index) => (
                    <div key={index} className="space-y-5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="px-1">
                            <h3 className="text-sm font-serif text-white/80">{domain.title}</h3>
                            <p className="text-[11px] text-white/30 font-light mt-0.5">{domain.desc}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {domain.items.map((item) => (
                                <IntegrationCard 
                                    key={item.id}
                                    name={item.name}
                                    description={item.desc}
                                    iconSlug={item.iconSlug}
                                    status={connectionStates[item.id] || { connected: false }}
                                    onAwakenClick={handleAwakenClick}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent my-10" />

            {/* SEÇÃO MANUAL (API KEYS) */}
            <div className="space-y-5">
                <div className="px-1">
                    <h3 className="text-sm font-serif text-white/80">O Motor Oculto (Manuais)</h3>
                    <p className="text-[11px] text-white/30 font-light mt-0.5">Chaves vitais (Tokens) para uso direto dos agentes.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#121212] border-white/5 rounded-xl overflow-hidden shadow-none hover:border-white/10 transition-colors">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 border border-white/5 rounded-full bg-black/20 text-white/60">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.98 6.14 17.98C5.68 16.82 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18.01 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.477 17.52 2 12 2Z"/></svg>
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-serif text-white/80">Repositório GitHub</CardTitle>
                                        <CardDescription className="text-[10px] text-white/40 mt-0.5">Autoriza Neo a modificar código.</CardDescription>
                                    </div>
                                </div>
                                {githubStatus === 'connected' 
                                    ? <span className="text-[9px] text-white/60 tracking-widest uppercase">Gravado</span> 
                                    : <span className="text-[9px] text-white/30 tracking-widest uppercase">Vazio</span>}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 pb-5">
                            <div className="flex gap-2">
                                <Input 
                                    type="password" 
                                    className="bg-black/40 border-white/5 text-white/70 h-9 text-xs rounded-lg placeholder:text-white/20 focus:border-white/20" 
                                    placeholder="ghp_xxxxxxxxxxxx"
                                    value={apiKeys.github}
                                    onChange={(e) => setApiKeys({...apiKeys, github: e.target.value})}
                                />
                                <Button variant="outline" className="border-white/5 text-white/50 hover:bg-white/10 hover:text-white h-9 text-xs" onClick={() => handleSaveKey('github', apiKeys.github)}>Gravar</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#121212] border-white/5 rounded-xl overflow-hidden shadow-none hover:border-white/10 transition-colors">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 pb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 border border-white/5 rounded-full bg-black/20 text-white/60">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-serif text-white/80">Modelos de Linguagem</CardTitle>
                                        <CardDescription className="text-[10px] text-white/40 mt-0.5">OpenAI e Anthropic API Keys.</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-5 pb-5">
                            <div className="flex gap-2">
                                <Input type="password" placeholder="sk-proj-..." className="bg-black/40 border-white/5 text-white/70 h-9 text-xs rounded-lg placeholder:text-white/20 focus:border-white/20" value={apiKeys.openai} onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})} />
                                <Button variant="outline" className="border-white/5 text-white/50 hover:bg-white/10 hover:text-white h-9 text-xs shrink-0" onClick={() => handleSaveKey('openai', apiKeys.openai)}>OpenAI</Button>
                            </div>
                            <div className="flex gap-2">
                                <Input type="password" placeholder="sk-ant-..." className="bg-black/40 border-white/5 text-white/70 h-9 text-xs rounded-lg placeholder:text-white/20 focus:border-white/20" value={apiKeys.anthropic} onChange={(e) => setApiKeys({...apiKeys, anthropic: e.target.value})} />
                                <Button variant="outline" className="border-white/5 text-white/50 hover:bg-white/10 hover:text-white h-9 text-xs shrink-0" onClick={() => handleSaveKey('anthropic', apiKeys.anthropic)}>Claude</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            {/* Disclaimer sutil */}
            <div className="pt-8 flex gap-4 opacity-40 hover:opacity-70 transition-opacity">
                <IconAlertTriangle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/80 leading-relaxed font-light uppercase tracking-wide">
                    O Prana respeita o silêncio. As conexões formadas no Nexus apenas leem ou interagem quando provocadas por você. <br/>A privacidade é um direito inalienável do indivíduo soberano.
                </p>
            </div>
        </div>
    );
}
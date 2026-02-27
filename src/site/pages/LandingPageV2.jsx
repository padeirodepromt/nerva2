/* src/site/pages/LandingPageV2.jsx
   desc: Nova Landing Page (Foco: Ash Middleware, Smart Creation, Views & Ecosystem).
   version: 2.0 (The Intelligent Organism)
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// === COMPONENTES UI ===
import PranaLogo from '../../components/ui/PranaLogo';
import { IconChat, IconFogo, IconLua } from '../../components/icons/PranaLandscapeIcons';

// === DEMOS EXISTENTES (Mantidos para consistência) ===
import LiveDemoAsh from '../demos/LiveDemoAsh'; 
// (Nota: No código real, certifique-se que os caminhos dos Demos estão corretos)

// =============================================================================
// COMPONENTES VISUAIS EXCLUSIVOS DA LANDING V2
// =============================================================================

const ZenIcon = ({ path, className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const Icons = {
  Spark: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  Code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  Structure: <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />,
  Mobile: <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />,
  ArrowRight: <path d="M5 12h14M12 5l7 7-7 7" />
};

// --- 1. O DIAGRAMA DO MIDDLEWARE (ASH) ---
const AshMiddlewareDiagram = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center my-20">
            {/* Linhas de Conexão (Fundo) */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <line x1="10%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="currentColor" strokeWidth="2" />
                
                {/* Conexões de Contexto (Vertical) */}
                <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="var(--accent)" strokeOpacity="0.5" />
                <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="var(--accent)" strokeOpacity="0.5" />
            </svg>

            {/* NÓ ESQUERDA: USUÁRIO (Input) */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
                className="absolute left-[5%] md:left-[10%] text-center"
            >
                <div className="glass-card px-4 py-2 rounded-lg border border-[var(--glass-border)] text-xs mono-font mb-2">
                    "Criar projeto de lançamento"
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-50">Seu Input</p>
            </motion.div>

            {/* NÓ CENTRAL: ASH (Middleware) */}
            <motion.div 
                className="relative z-10 w-32 h-32 flex items-center justify-center"
            >
                {/* Aura */}
                <div className="absolute inset-0 bg-[var(--accent)] blur-[60px] opacity-20 animate-pulse" />
                
                {/* O Núcleo */}
                <div className="w-20 h-20 rounded-full glass-card border border-[var(--accent)] flex items-center justify-center shadow-[0_0_30px_rgba(217,119,6,0.2)]">
                    <IconChat className="w-10 h-10 text-[var(--accent)] animate-pulse" />
                </div>

                {/* Satélites de Contexto (A Vantagem) */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-16 bg-[#0c0a09] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[9px] mono-font text-[var(--accent)]">
                    + Memória de Projetos
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-16 bg-[#0c0a09] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[9px] mono-font text-[var(--accent)]">
                    + Nível de Energia
                </motion.div>
            </motion.div>

            {/* NÓ DIREITA: AÇÃO (Output) */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="absolute right-[5%] md:right-[10%] text-center w-48"
            >
                <div className="glass-card p-4 rounded-lg border border-[var(--accent)]/30 text-left">
                    <div className="text-[9px] text-[var(--accent)] mb-1">PROJETO CRIADO</div>
                    <div className="text-xs font-serif text-[var(--text-primary)]">Lançamento Site</div>
                    <div className="flex gap-1 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"/>
                        <span className="text-[8px] opacity-60">Tarefas geradas</span>
                    </div>
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2">Ação Executada</p>
            </motion.div>
        </div>
    );
}

// --- 2. DEMO DE SMART CREATION ---
const SmartCreationDemo = () => {
    const [text, setText] = useState("");
    const fullText = "Reunião de orçamento sexta as 14h #financeiro";
    
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-card p-6 rounded-xl border border-[var(--glass-border)] w-full max-w-lg mx-auto">
             <div className="flex items-center gap-2 mb-4 opacity-50 border-b border-[var(--glass-border)] pb-2">
                 <ZenIcon path={Icons.Spark} className="w-4 h-4" />
                 <span className="text-[10px] mono-font uppercase tracking-widest">Smart Creation Engine</span>
             </div>
             
             {/* Input Simulado */}
             <div className="text-lg serif-font text-[var(--text-primary)] mb-6 h-8">
                 {text}<span className="animate-pulse">|</span>
             </div>

             {/* Resultado Parseado */}
             {text.length > 20 && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-2">
                     <div className="bg-[var(--glass-border)] p-2 rounded text-center">
                         <span className="block text-[8px] uppercase opacity-50">O Que</span>
                         <span className="text-xs">Reunião</span>
                     </div>
                     <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-2 rounded text-center">
                         <span className="block text-[8px] uppercase text-[var(--accent)]">Quando</span>
                         <span className="text-xs text-[var(--accent)]">Sexta, 14:00</span>
                     </div>
                     <div className="bg-[var(--glass-border)] p-2 rounded text-center">
                         <span className="block text-[8px] uppercase opacity-50">Contexto</span>
                         <span className="text-xs">Financeiro</span>
                     </div>
                 </motion.div>
             )}
        </div>
    )
}

// --- 3. GALERIA DE VIEWS ---
const ViewsGallery = () => {
    const [activeView, setActiveView] = useState('nexus');
    
    const views = {
        nexus: { title: "Nexus", subtitle: "Estrutura Neural", desc: "Visualize as dependências entre projetos como um organismo vivo.", icon: "🕸️" },
        planner: { title: "Planner", subtitle: "Linha do Tempo", desc: "Não apenas uma agenda. Uma visão do fluxo de energia ao longo do dia.", icon: "📅" },
        kanban: { title: "Kanban", subtitle: "Fluxo de Trabalho", desc: "Mova a energia estagnada para a conclusão.", icon: "📋" },
        mindmap: { title: "MindMap", subtitle: "Expansão Mental", desc: "Do caos à ordem. Conecte ideias soltas ao sistema.", icon: "🧠" }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Menu */}
            <div className="md:w-1/3 flex flex-col gap-2">
                {Object.entries(views).map(([key, info]) => (
                    <button 
                        key={key}
                        onClick={() => setActiveView(key)}
                        className={`text-left p-4 rounded-lg transition-all duration-300 border ${activeView === key ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent hover:bg-[var(--glass-border)] text-[var(--text-secondary)]'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{info.icon}</span>
                            <div>
                                <div className="serif-font text-lg">{info.title}</div>
                                <div className="text-[10px] mono-font opacity-60 uppercase tracking-widest">{info.subtitle}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Display */}
            <div className="md:w-2/3 glass-card rounded-2xl border border-[var(--glass-border)] p-1 relative overflow-hidden h-[300px]">
                <div className="absolute inset-0 flex items-center justify-center">
                     <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeView}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                            className="text-center p-8 max-w-sm"
                        >
                            <div className="text-6xl mb-6 opacity-20 filter blur-sm">{views[activeView].icon}</div>
                            <h3 className="text-2xl serif-font mb-4 text-[var(--text-primary)]">{views[activeView].title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {views[activeView].desc}
                            </p>
                        </motion.div>
                     </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// PÁGINA PRINCIPAL (LandingPageV2)
// =============================================================================

const LandingPageV2 = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div className="min-h-screen w-full bg-[#0c0a09] text-white selection:bg-[var(--accent)]/30 font-sans overflow-x-hidden">
            
            {/* --- ESTILOS GLOBAIS --- */}
            <style>{`
                :root {
                    --accent: #d97706; /* Copper/Amber */
                    --glass-bg: rgba(20, 20, 20, 0.6);
                    --glass-border: rgba(255, 255, 255, 0.08);
                }
                .serif-font { font-family: 'Vollkorn', serif; }
                .mono-font { font-family: 'JetBrains Mono', monospace; }
                .glass-card {
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                }
            `}</style>

            {/* NAV */}
            <nav className="fixed top-0 w-full z-50 border-b border-[var(--glass-border)] bg-[#0c0a09]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PranaLogo className="w-8 h-8 text-[var(--accent)]" />
                        <span className="serif-font text-xl font-bold">Prana</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/auth')} className="text-xs mono-font uppercase tracking-widest hover:text-[var(--accent)] transition-colors">Login</button>
                        <button onClick={() => navigate('/plans')} className="px-4 py-2 rounded bg-[var(--accent)] text-white text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">Começar</button>
                    </div>
                </div>
            </nav>

            {/* 1. HERO SECTION (Wabi-Sabi & Emotion) */}
            <motion.header 
                style={{ opacity: opacityHero }}
                className="relative h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09] via-transparent to-[#0c0a09]" />

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                        <span className="text-[10px] mono-font uppercase tracking-widest text-[var(--accent)]">Prana 3.0</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl serif-font mb-6 leading-[1.1] font-light tracking-tight">
                        Onde sua produtividade <br />
                        <span className="italic text-[var(--text-secondary)] opacity-70">encontra sua biologia.</span>
                    </h1>

                    <p className="max-w-xl mx-auto text-lg text-[#a8a29e] mb-12 font-light leading-relaxed">
                        Pare de lutar contra sua natureza. O Prana é o primeiro sistema operacional que entende seu ritmo, seus projetos e sua energia.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/plans')} className="px-8 py-4 rounded-full bg-[var(--accent)] text-white font-medium hover:scale-105 transition-transform shadow-[0_0_30px_-5px_rgba(217,119,6,0.4)]">
                            Explorar os Biomas
                        </button>
                        <button className="px-8 py-4 rounded-full border border-[var(--glass-border)] hover:bg-[var(--glass-border)] transition-colors">
                            Ler o Manifesto
                        </button>
                    </div>
                </motion.div>
            </motion.header>


            {/* 2. ASH MIDDLEWARE (A Diferença Técnica) */}
            <section className="py-32 px-6 border-t border-[var(--glass-border)] relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl serif-font mb-4">Inteligência com <span className="italic text-[var(--accent)]">Contexto</span></h2>
                        <p className="text-[#a8a29e] max-w-2xl mx-auto">
                            LLMs comuns (como ChatGPT) são gênios sem memória. O Ash é o elo perdido.
                            Ele conecta a inteligência artificial aos dados reais da sua vida antes de responder.
                        </p>
                    </div>

                    <AshMiddlewareDiagram />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                        <div className="p-6">
                            <h4 className="serif-font text-xl mb-2">Memória Infinita</h4>
                            <p className="text-sm opacity-60">O Ash lembra o que você fez semana passada e o que planejou para o mês que vem.</p>
                        </div>
                        <div className="p-6 border-x border-[var(--glass-border)]">
                            <h4 className="serif-font text-xl mb-2">Proatividade Real</h4>
                            <p className="text-sm opacity-60">Ele não espera você perguntar. Ele avisa quando prazos entram em conflito com sua energia.</p>
                        </div>
                        <div className="p-6">
                            <h4 className="serif-font text-xl mb-2">Empatia de Dados</h4>
                            <p className="text-sm opacity-60">Ele sabe quando você está cansado e adapta as sugestões para o seu estado.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* 3. A ESTRUTURA (VIEWS & TOOLS) */}
            <section className="py-32 px-6 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-center mb-32">
                        <div className="md:w-1/2">
                            <span className="text-[10px] mono-font uppercase tracking-widest text-[var(--accent)] mb-4 block">Smart Creation</span>
                            <h2 className="text-4xl serif-font mb-6">Do pensamento à estrutura em milissegundos.</h2>
                            <p className="text-[#a8a29e] mb-8 leading-relaxed">
                                Não perca tempo preenchendo formulários. Digite naturalmente. O Prana entende datas, tags, projetos e urgência, organizando tudo automaticamente no lugar certo.
                            </p>
                            <SmartCreationDemo />
                        </div>
                        <div className="md:w-1/2 pl-0 md:pl-12 border-l border-[var(--glass-border)]">
                            <span className="text-[10px] mono-font uppercase tracking-widest text-[var(--accent)] mb-4 block">TaskCode IDE</span>
                            <h3 className="text-2xl serif-font mb-4">Para quem constrói o mundo.</h3>
                            <p className="text-sm text-[#a8a29e] mb-6">
                                Uma interface inspirada em VSCode para gerenciar sua vida com a precisão de um desenvolvedor. Comandos rápidos, atalhos de teclado e foco total.
                            </p>
                            <div className="glass-card p-4 rounded-lg font-mono text-xs opacity-70">
                                <div className="text-blue-400">task.create(</div>
                                <div className="pl-4 text-yellow-300">"Refatorar Backend"</div>
                                <div className="pl-4 text-purple-400">project: "Prana V3"</div>
                                <div className="pl-4 text-red-400">priority: "High"</div>
                                <div className="text-blue-400">)</div>
                            </div>
                        </div>
                    </div>

                    {/* GALERIA DE VIEWS */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl serif-font">Perspectivas do Sistema</h2>
                    </div>
                    <ViewsGallery />

                </div>
            </section>


            {/* 4. O BIOMA (A Alma) */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent)]/10 to-transparent pointer-events-none" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="text-[10px] mono-font uppercase tracking-widest text-[var(--accent)] mb-6 block">Digital Animism</span>
                    <h2 className="text-5xl serif-font mb-8">Um software que respira.</h2>
                    <p className="text-lg text-[#a8a29e] mb-12 leading-relaxed">
                        Minimalismo frio é passado. O Prana introduz **Biomas Dinâmicos**. 
                        A interface muda sutilmente com seu humor, hora do dia e nível de energia. 
                        Nevoa quando você precisa de foco, Sol quando é hora de expandir.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Nascente', 'Floresta', 'Oceano', 'Montanha'].map((b, i) => (
                            <div key={i} className="aspect-square rounded-full border border-[var(--glass-border)] flex items-center justify-center hover:border-[var(--accent)] transition-colors cursor-default">
                                <span className="serif-font opacity-60">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* 5. MOBILE APP */}
            <section className="py-24 px-6 border-y border-[var(--glass-border)] bg-[#050505]">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <div className="w-[300px] h-[600px] mx-auto border border-[var(--glass-border)] rounded-[40px] bg-[#000] relative overflow-hidden shadow-2xl">
                             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#1a1a1a] rounded-full z-20" />
                             {/* Mock de Screen Mobile */}
                             <div className="w-full h-full flex flex-col justify-between p-6 pt-16">
                                 <div className="space-y-4">
                                     <div className="h-8 w-2/3 bg-[var(--glass-border)] rounded animate-pulse" />
                                     <div className="h-24 w-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl" />
                                     <div className="h-12 w-full bg-[var(--glass-border)] rounded-xl" />
                                 </div>
                                 <div className="h-16 w-full glass-card rounded-full border border-[var(--glass-border)] flex items-center justify-around px-4">
                                     <div className="w-6 h-6 rounded-full bg-[var(--accent)]" />
                                     <div className="w-6 h-6 rounded-full bg-[var(--glass-border)]" />
                                     <div className="w-6 h-6 rounded-full bg-[var(--glass-border)]" />
                                 </div>
                             </div>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-4xl serif-font mb-6">O Bioma no seu bolso.</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="mt-1"><ZenIcon path={Icons.Mobile} className="text-[var(--accent)]" /></div>
                                <div>
                                    <h4 className="font-bold">App Nativo (iOS & Android)</h4>
                                    <p className="text-sm opacity-60">Desempenho fluido, gestos intuitivos e feedback tátil.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1"><ZenIcon path={Icons.Spark} className="text-[var(--accent)]" /></div>
                                <div>
                                    <h4 className="font-bold">Captura Instantânea</h4>
                                    <p className="text-sm opacity-60">Abra e fale. O Ash organiza depois.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="mt-1"><ZenIcon path={Icons.ArrowRight} className="text-[var(--accent)]" /></div>
                                <div>
                                    <h4 className="font-bold">Notificações Inteligentes</h4>
                                    <p className="text-sm opacity-60">O celular só vibra se for importante E se sua energia permitir.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>


            {/* FOOTER */}
            <footer className="py-20 text-center">
                <div className="mb-8 flex justify-center opacity-50 grayscale hover:grayscale-0 transition-all">
                    <PranaLogo className="w-12 h-12 text-[var(--accent)]" />
                </div>
                <h3 className="serif-font text-2xl mb-8">Comece a viver seu sistema.</h3>
                <button onClick={() => navigate('/plans')} className="px-10 py-4 bg-[var(--text-primary)] text-black font-bold rounded-full hover:bg-[var(--accent)] hover:text-white transition-colors">
                    Ver Planos Disponíveis
                </button>
                <div className="mt-16 text-[10px] mono-font opacity-30">
                    © 2025 PRANA OS. DESIGNED FOR HUMANS.
                </div>
            </footer>

        </div>
    );
};

export default LandingPageV2;
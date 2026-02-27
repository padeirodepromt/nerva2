/* src/pages/LandingPage.jsx
   desc: Landing Page Dual-Mode (Zen vs Developer).
   feat: Ícones locais, conteúdo rico para devs e alternância de persona.
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Mantemos apenas os ícones que temos certeza que existem na biblioteca do projeto ou são genéricos
import { 
    IconVision, IconFlux, IconCosmos, IconBrainCircuit, 
    IconUsers, IconMap, IconZap, IconStar,
    IconTerminal, IconArrowRight
} from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PranaLogo from '@/components/ui/PranaLogo';

// --- SISTEMA DE ÍCONES LOCAIS (EVITA ERROS DE IMPORTAÇÃO) ---
const Icon = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

const Icons = {
    Terminal: (p) => <Icon {...p}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></Icon>,
    Server: (p) => <Icon {...p}><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></Icon>,
    Database: (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></Icon>,
    GitBranch: (p) => <Icon {...p}><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></Icon>,
    Code: (p) => <Icon {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Icon>,
    Lock: (p) => <Icon {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>,
    Cpu: (p) => <Icon {...p}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></Icon>,
    Activity: (p) => <Icon {...p}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Icon>,
    Settings: (p) => <Icon {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Icon>,
    Layers: (p) => <Icon {...p}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></Icon>,
    Play: (p) => <Icon {...p}><polygon points="6 3 20 12 6 21 6 3"/></Icon>,
    Cloud: (p) => <Icon {...p}><path d="M17.5 19c0-1.7-1.3-3-3-3h-11a4 4 0 1 1 0-8 2.5 2.5 0 0 1 4.5 0A5 5 0 0 1 13 4a5 5 0 0 1 4.8 4h.2a4.5 4.5 0 0 1 0 9Z"/></Icon>,
    CheckCircle: (p) => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>,
    ArrowRight: (p) => <Icon {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Icon>,
    Search: (p) => <Icon {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></Icon>,
    Key: (p) => <Icon {...p}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></Icon>,
    Alert: (p) => <Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></Icon>,
    Hash: (p) => <Icon {...p}><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></Icon>,
    LayoutDashboard: (p) => <Icon {...p}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></Icon>
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, delay = 0, className = "" }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 50 + Math.random() * 30);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text, started]);

    return <span className={className}>{currentText}<span className="animate-pulse text-[var(--accent)]">_</span></span>;
};

// --- MOCKUP COMPONENTS (Live Demos Inline) ---

const LiveDemoAshDev = () => (
    <div className="p-6 font-mono text-sm space-y-4 bg-[#0a0a0a] min-h-[350px]">
        <div className="flex gap-4 items-start opacity-60">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px]">U</div>
            <div className="text-gray-400">
                <span className="text-[var(--accent)] mr-2">$</span>
                Create a microservice for user authentication using JWT and Redis.
            </div>
        </div>
        <div className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-[10px] text-black font-bold">A</div>
            <div className="space-y-3 w-full">
                <div className="text-[var(--accent)] opacity-80 text-xs flex items-center gap-2">
                    <Icons.Cpu className="w-3 h-3" /> Analyzing Context...
                </div>
                <div className="bg-[#151515] border border-white/10 rounded p-4 text-xs text-gray-300 font-mono overflow-hidden relative shadow-2xl">
                    <div className="flex justify-between border-b border-white/5 pb-2 mb-3">
                        <span className="flex items-center gap-2 text-[var(--accent)]"><Icons.Code className="w-3 h-3"/> auth-service.js</span>
                        <span className="text-gray-500">node.js</span>
                    </div>
                    <pre className="text-blue-300 leading-relaxed overflow-x-auto">
{`const jwt = require('jsonwebtoken');
const redis = require('redis');

// Initialize Redis Client
const client = redis.createClient({
    url: process.env.REDIS_URL
});

export const login = async (req, res) => {
    // 1. Verify credentials form Vector DB
    const user = await findUser(req.body.email);
    
    // 2. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    
    return res.status(200).json({ token });
};`}
                    </pre>
                </div>
            </div>
        </div>
    </div>
);

const LiveDemoDashboardDev = () => (
    <div className="relative w-full h-[400px] bg-[#0c0c0e] p-6 grid grid-cols-3 gap-4 overflow-hidden font-mono text-xs">
        {/* Load Chart */}
        <div className="col-span-2 h-36 rounded bg-white/5 border border-white/10 p-4 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-12 bg-[var(--accent)]/5 blur-xl rounded-full" />
            <div className="uppercase text-gray-500 font-bold mb-auto flex justify-between">
                <span className="flex items-center gap-2"><Icons.Activity className="w-3 h-3"/> System Load</span>
                <span className="text-[var(--accent)] animate-pulse">Running</span>
            </div>
            <div className="flex items-end gap-1 h-16 w-full">
                {[40, 60, 45, 70, 85, 60, 50, 65, 80, 75, 60, 55, 70, 90, 65, 50, 70, 80, 40, 30].map((h, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ height: '10%' }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity, repeatType: "reverse" }}
                        className="flex-1 bg-[var(--accent)]/40 hover:bg-[var(--accent)] transition-colors rounded-t-[1px]" 
                    />
                ))}
            </div>
        </div>
        
        {/* Pods Status */}
        <div className="h-36 rounded bg-white/5 border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent pointer-events-none"></div>
            <div className="uppercase text-gray-500 font-bold">Active Pods</div>
            <div className="text-4xl text-white tracking-tighter">12<span className="text-gray-600">/12</span></div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse" style={{animationDelay: `${i*0.1}s`}} />
                ))}
            </div>
        </div>

        {/* Pipeline */}
        <div className="col-span-3 h-full rounded bg-white/5 border border-white/10 p-4 relative flex flex-col gap-3">
             <div className="uppercase text-gray-500 font-bold flex justify-between">
                <span className="flex items-center gap-2"><Icons.GitBranch className="w-3 h-3"/> CI/CD Pipeline</span>
                <span className="text-[var(--accent)]">main</span>
             </div>
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5">
                    <Icons.CheckCircle className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-white">Build #4921</span>
                    <div className="flex-1 h-px bg-white/5 mx-2" />
                    <span className="text-gray-500">2m ago</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5 relative overflow-hidden">
                    <div className="absolute left-0 bottom-0 h-[2px] bg-[var(--accent)] w-2/3 animate-[loading_2s_ease-in-out_infinite]"></div>
                    <div className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
                    <span className="text-yellow-500">Running E2E Evaluation</span>
                    <div className="flex-1 h-px bg-white/5 mx-2" />
                    <span className="text-gray-500">Now</span>
                </div>
             </div>
        </div>
    </div>
);

// --- COMPONENTE DA PERSONA DEV ---
const LandingPageDeveloper = ({ onTogglePersona }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-[var(--accent)] selection:text-black" style={{"--accent": "#22c55e", "--bg-color": "#0a0a0a"}}> 
      
      {/* 1. NAVBAR - DEV MODE */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <PranaLogo className="w-8 h-8 text-[var(--accent)]" />
              <div className="flex flex-col">
                  <span className="font-bold tracking-widest text-sm text-white">PRANA</span>
                  <span className="text-[9px] uppercase tracking-widest text-[var(--accent)] opacity-80 font-mono">Build System v1.0</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
               <button onClick={onTogglePersona} className="text-xs font-mono border border-white/20 px-3 py-1 rounded hover:bg-white/5 transition-colors flex items-center gap-2 text-gray-400 hover:text-white">
                   <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                   RELAY: ZEN
               </button>
               <button className="bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/50 px-4 py-2 rounded text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                   Get Access
               </button>
           </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden min-h-[80vh] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
              <img src={HERO_IMAGE} className="w-full h-full object-cover opacity-40 mix-blend-overlay" alt="Background" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--accent)]/10 via-transparent to-transparent opacity-50"></div>
          </div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.8}}>
                  <div className="font-mono text-[var(--accent)] text-xs mb-6 flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 w-fit rounded border border-[var(--accent)]/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                      <Icons.Terminal className="w-3 h-3" /> root@prana:~/workspace
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-white h-[3.2ch] md:h-[auto]">
                      Don't just code.<br />
                      <Typewriter text="Architect Flow." delay={500} className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white" />
                  </h1>
                  <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                      Para a geração "Vibe Coding" que cria sistemas complexos com IA. 
                      O Prana não é um editor de texto. É um <strong>Game Engine para seus Projetos</strong>.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                      <button className="px-8 py-4 bg-[var(--accent)] text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform rounded flex items-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                          <Icons.Play className="w-4 h-4" /> Start Building
                      </button>
                      <button className="px-8 py-4 border border-white/20 hover:bg-white/5 font-mono text-sm rounded flex items-center gap-3 transition-colors text-gray-300">
                          <Icons.Code className="w-4 h-4" /> View Architecture
                      </button>
                  </div>
              </motion.div>

              <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.8, delay:0.2}} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/20 to-transparent blur-3xl opacity-30"></div>
                    <div className="relative border border-white/10 bg-[#111111] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
                        <div className="h-8 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/20"></div><div className="w-3 h-3 rounded-full bg-yellow-500/20"></div><div className="w-3 h-3 rounded-full bg-green-500/20"></div></div>
                        </div>
                        <LiveDemoAshDev />
                    </div>
              </motion.div>
          </div>
      </section>

      {/* 3. THE PROBLEM */}
      <section className="py-24 border-y border-white/5 bg-[#0e0e0e] relative">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                   <h2 className="text-3xl font-bold mb-4 text-white">O Fim do "Copy & Paste" Infinito</h2>
                   <p className="text-gray-400 max-w-2xl mx-auto">
                       Arquitetos modernos perdem 40% do tempo explicando contexto para LLMs.
                       O Prana resolve a <strong>Fragmentação da Stack</strong> com persistência.
                   </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-[#121212] border border-white/5 rounded-xl hover:border-[var(--accent)]/50 transition-all group hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                      <Icons.Database className="w-10 h-10 text-gray-600 mb-6 group-hover:text-[var(--accent)] transition-colors" />
                      <h3 className="text-xl font-bold mb-2 text-white">Memória Persistente</h3>
                      <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300">
                          Ash não "esquece" seu projeto. Ele indexa docs, schemas e decisões em um Vector DB local.
                      </p>
                  </div>
                  <div className="p-8 bg-[#121212] border border-white/5 rounded-xl hover:border-[var(--accent)]/50 transition-all group hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                      <Icons.Cloud className="w-10 h-10 text-gray-600 mb-6 group-hover:text-[var(--accent)] transition-colors" />
                      <h3 className="text-xl font-bold mb-2 text-white">Deploy Previews</h3>
                      <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300">
                          Cada Task gera um ambiente de preview isolado automaticamente. Validate visualmente sem rodar localhost.
                      </p>
                  </div>
                  <div className="p-8 bg-[#121212] border border-white/5 rounded-xl hover:border-[var(--accent)]/50 transition-all group hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                      <Icons.GitBranch className="w-10 h-10 text-gray-600 mb-6 group-hover:text-[var(--accent)] transition-colors" />
                      <h3 className="text-xl font-bold mb-2 text-white">Git Semântico</h3>
                      <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300">
                          Tasks = Branches. Commits = Checkpoints. O Prana traduz a gestão para a realidade do Git.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. ELO PERDIDO */}
      <section className="py-32 px-6 relative border-b border-white/5 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT: LEGACY STACK */}
                    <div className="opacity-60 hover:opacity-100 transition-opacity">
                        <div className="mb-6 flex items-center gap-2 text-red-500/80 font-mono text-xs uppercase tracking-widest">
                            <Icons.Alert className="w-4 h-4"/> Legacy Stack
                        </div>
                        <div className="space-y-2 font-mono text-sm ">
                            {[
                                {tool: "Jira", issue: "Static Tickets"},
                                {tool: "Slack", issue: "Noise & Lost Context"},
                                {tool: "Figma", issue: "Isolated Assets"},
                                {tool: "VS Code", issue: "No 'Why' Metadata"}
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between p-4 bg-[#111] border border-red-500/10 rounded text-gray-500">
                                    <span>{item.tool}</span>
                                    <span className="text-red-900/80 line-through">{item.issue}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: PRANA SYSTEM */}
                    <div className="relative pl-8 border-l border-[var(--accent)]/20">
                        <div className="mb-6 flex items-center gap-2 text-[var(--accent)] font-mono text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            <Icons.CheckCircle className="w-4 h-4"/> Prana System
                        </div>
                        <h2 className="text-4xl font-bold mb-6 text-white">Unificação Fractal</h2>
                        <ul className="space-y-8">
                            {[
                                {title: "Arquivos, não Tickets", desc: "Seu board é apenas uma visualização da estrutura de pastas do projeto."},
                                {title: "Versionamento Semântico", desc: "Ash salva o contexto (prompts) junto com o commit."},
                                {title: "Visualização React", desc: "Renderize componentes diretamente dentro do card da tarefa."}
                            ].map((item, i) => (
                                <li key={i} className="group">
                                    <h4 className="flex items-center gap-3 text-lg font-bold text-gray-200 group-hover:text-[var(--accent)] transition-colors">
                                        <span className="w-6 h-6 rounded bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-mono">{i+1}</span>
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-500 mt-2 ml-9 text-sm leading-relaxed border-l border-white/5 pl-4 group-hover:border-[var(--accent)]/30 transition-colors">
                                        {item.desc}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
          </div>
      </section>

      {/* 5. DASHBOARD */}
      <section className="py-24 px-6 bg-[#0c0c0e] border-b border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
               <div className="w-full lg:w-1/2">
                   <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-[#0a0a0a] ring-1 ring-white/5">
                       <LiveDemoDashboardDev />
                   </div>
               </div>
               <div className="w-full lg:w-1/2">
                   <div className="font-mono text-[var(--accent)] text-xs mb-4">/views/dashboard.jsx</div>
                   <h2 className="text-4xl font-bold mb-6 text-white">Painel de Controle <br/>para <span className="text-[var(--accent)]">Arquitetura Viva</span></h2>
                   <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                       Não gerencie tarefas como uma lista de compras. Visualize a topologia do seu sistema, a saúde dos seus deploys e a carga cognitiva do time em tempo real.
                   </p>
                   <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded border border-white/5">
                            <div className="text-2xl font-bold text-white mb-1">98%</div>
                            <div className="text-xs text-gray-500 uppercase font-mono">Uptime</div>
                        </div>
                        <div className="p-4 bg-[var(--accent)]/5 rounded border border-[var(--accent)]/20">
                            <div className="text-2xl font-bold text-[var(--accent)] mb-1">45ms</div>
                            <div className="text-xs text-[var(--accent)]/70 uppercase font-mono">Latency</div>
                        </div>
                   </div>
               </div>
          </div>
      </section>

      {/* 6. CODE LIFECYCLE */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">The Ash Protocol</h2>
                  <p className="font-mono text-[var(--accent)] text-sm">while(project.active) &#123; optimize() &#125;</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                      { step: "01", title: "SPEC", icon: Icons.Hash, desc: "Feature Def." },
                      { step: "02", title: "PROTOTYPE", icon: Icons.Layers, desc: "Live Preview" },
                      { step: "03", title: "INTEGRATE", icon: Icons.GitBranch, desc: "Git Sync" },
                      { step: "04", title: "DEPLOY", icon: Icons.Cloud, desc: "Vercel Push" }
                  ].map((item, i) => (
                      <div key={i} className="relative p-6 bg-[#111] border border-white/5 rounded-lg hover:border-[var(--accent)]/40 transition-all group">
                          {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-6 w-8 h-[1px] bg-white/10 z-0"></div>}
                          <div className="w-10 h-10 rounded bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-[var(--accent)] mb-4 group-hover:scale-110 transition-transform relative z-10">
                              <item.icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 7. TECH SPECS */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">Stack & Integrações</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Icons.GitBranch, title: "Git Native", desc: "GitHub, GitLab" },
                    { icon: Icons.Server, title: "Docker", desc: "Container Ready" },
                    { icon: Icons.Database, title: "Vector DB", desc: "Pinecone / Weaviate" },
                    { icon: Icons.Lock, title: "Vault", desc: "Secure Env" },
                    { icon: Icons.Cpu, title: "LLM Agnostic", desc: "GPT-4 / Claude / Llama" },
                    { icon: Icons.Activity, title: "Telemetry", desc: "OpenTelemetry" },
                    { icon: Icons.Settings, title: "Config", desc: "prana.json" },
                    { icon: Icons.Layers, title: "Monorepo", desc: "Workspaces" }
                ].map((item, i) => (
                    <div key={i} className="p-4 border border-white/5 bg-[#111] rounded hover:border-[var(--accent)]/40 transition-all text-center group hover:-translate-y-1">
                        <item.icon className="w-6 h-6 mx-auto mb-3 text-gray-500 group-hover:text-[var(--accent)] transition-colors" />
                        <h4 className="font-bold mb-1 text-sm text-gray-200">{item.title}</h4>
                        <p className="text-[10px] text-gray-500 font-mono uppercase">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 8. BENCHMARK TABLE */}
      <section className="py-24 px-6 border-b border-white/5">
          <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center text-white">Benchmark</h2>
              <div className="overflow-x-auto border border-white/10 rounded-lg bg-[#0c0c0e]">
                  <table className="w-full text-left text-sm text-gray-300">
                      <thead className="bg-white/5 uppercase tracking-widest text-[10px] font-bold text-gray-400">
                          <tr>
                              <th className="p-4">Capability</th>
                              <th className="p-4 text-[var(--accent)]">Prana</th>
                              <th className="p-4">VS Code</th>
                              <th className="p-4">Jira</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                          {[
                              ["Contexto Unificado", true, false, false],
                              ["Gestão via IA", true, false, true],
                              ["Deploy Preview", true, false, false],
                              ["Knowledge Graph", true, false, false],
                          ].map(([feat, prana, vsc, jira], i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-bold text-xs font-mono">{feat}</td>
                                  <td className="p-4 text-[var(--accent)]">{prana && <Icons.CheckCircle className="w-4 h-4" />}</td>
                                  <td className="p-4 text-gray-600">{vsc ? <Icons.CheckCircle className="w-4 h-4"/> : "-"}</td>
                                  <td className="p-4 text-gray-600">{jira ? <Icons.CheckCircle className="w-4 h-4"/> : "-"}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </section>

      {/* 9. CTA */}
      <section className="py-20 text-center border-t border-white/5 mt-12 bg-[#050505] relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--accent)]/5 blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-8">Ready to Architect?</h2>
            <button className="px-10 py-4 bg-[var(--accent)] text-black font-bold uppercase tracking-widest rounded hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all">
                Initialize Workspace
            </button>
          </div>
      </section>

    </div>
  );
};

// --- MODO ZEN (ESTRUTURA ORIGINAL) ---
const ZenLanding = ({ onTogglePersona }) => {
    return (
        <div className="min-h-screen bg-[#09090b] text-foreground font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-[120vh] overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-[#09090b]/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold font-serif">P</div>
                    <span className="font-serif font-bold text-lg tracking-tight text-white">Prana OS</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={onTogglePersona} className="text-xs border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full hover:bg-indigo-500/10 transition-colors flex items-center gap-2">
                        <IconTerminal className="w-3 h-3" />
                        DEV MODE
                    </button>
                    <Button className="bg-white text-black hover:bg-gray-200 font-medium px-5 rounded-full text-xs">
                        Começar Agora
                    </Button>
                </div>
            </nav>

            <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center items-center text-center z-10">
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-8 max-w-4xl mx-auto">
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4">
                        <IconStar className="w-3 h-3 mr-2" /> Prana 3.0 Wabi-Sabi
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight">
                        O Sistema Operacional <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-white">da Sua Vida & Obra</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Mais do que gestão de tarefas. O Prana une <strong>Gestão de Projetos</strong>, 
                        <strong>Inteligência Artificial (Ash)</strong> e <strong>Sabedoria Ancestral</strong>.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button size="lg" className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-base shadow-[0_0_20px_rgba(79,70,229,0.3)] w-full sm:w-auto">
                            Entrar no Fluxo <IconArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

// --- CONTROLLER ---
export default function LandingPage() {
    const [persona, setPersona] = useState('zen'); 

    const togglePersona = () => {
        setPersona(prev => prev === 'zen' ? 'developer' : 'zen');
    };

    return (
        <AnimatePresence mode="wait">
            {persona === 'zen' ? (
                <motion.div key="zen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <ZenLanding onTogglePersona={togglePersona} />
                </motion.div>
            ) : (
                <motion.div key="dev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <LandingPageDeveloper onTogglePersona={togglePersona} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
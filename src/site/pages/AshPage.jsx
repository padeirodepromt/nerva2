/* src/site/pages/AshPage.jsx
   desc: The Neural Engine of Prana.
   version: 38.0 (Corrected Diagram, SOCD, Textures & Content)
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PranaLogo from '../../components/ui/PranaLogo';
import AshFAQ from '../../components/AshFAQ'; 
import { 
  IconNeural, IconChat, IconZap, IconSoul, 
  IconNexus, IconLock, IconArrowRight, IconVoid,
  IconVision, IconFlux, IconPapyrus, IconGrowth,
  IconCode, IconSankalpa, IconSun, IconCheckCircle, 
  IconX, IconChevronRight, IconFogo, IconLua
} from '../../components/icons/PranaLandscapeIcons';

// ==========================================
// 1. DIAGRAMA MIDDLEWARE (1.User -> 2.Ash -> 3.LLM)
// ==========================================
const AshMiddlewareDiagram = () => {
    return (
        <div className="w-full max-w-4xl mx-auto py-24 select-none relative">
            
            {/* Linha Tracejada Central */}
            <div className="absolute top-1/2 left-12 right-12 h-px border-t-2 border-dashed border-[#d97706]/40 z-0 transform -translate-y-1/2 hidden md:block"></div>

            <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8 md:gap-0">
                
                {/* 1. USUÁRIO */}
                <div className="flex flex-col items-center group">
                    <div className="mb-4 bg-[var(--card-bg-solid)] border border-[#d97706]/30 px-4 py-3 rounded-lg text-[11px] mono-font text-[var(--text-secondary)] shadow-lg w-40 text-center transform group-hover:-translate-y-1 transition-transform">
                        "Crie o projeto Lançamento com tarefas de copy e design."
                    </div>
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-color)] border-2 border-[#d97706] flex items-center justify-center shadow-[0_0_20px_rgba(217,119,6,0.2)]">
                        <IconSoul className="w-8 h-8 text-[#d97706]" />
                    </div>
                    <span className="mt-3 text-xs font-bold uppercase tracking-widest text-[#d97706]">1. Usuário</span>
                </div>

                {/* 2. PRANA ASH (IconChat Pequeno) */}
                <div className="flex flex-col items-center relative">
                    {/* O que ele injeta */}
                    <div className="absolute -top-16 flex flex-col items-center gap-1 whitespace-nowrap opacity-0 md:opacity-100 animate-slide-up">
                        <span className="text-[9px] text-[#d97706] bg-[#d97706]/10 px-2 py-0.5 rounded border border-[#d97706]/20 font-mono">+ Contexto (Sankalpa)</span>
                        <span className="text-[9px] text-[#d97706] bg-[#d97706]/10 px-2 py-0.5 rounded border border-[#d97706]/20 font-mono">+ Energia (Baixa)</span>
                    </div>
                    
                    {/* Avatar Ash Menor */}
                    <div className="w-12 h-12 rounded-full bg-[#d97706] flex items-center justify-center shadow-[0_0_40px_rgba(217,119,6,0.6)] z-20 border-4 border-[var(--bg-color)]">
                        <IconChat className="w-6 h-6 text-[#1a1816]" />
                    </div>
                    
                    <span className="mt-5 text-xs font-bold uppercase tracking-widest text-[#d97706]">2. Prana (Ash)</span>
                    <span className="text-[9px] opacity-60 text-[var(--text-secondary)]">O Middleware</span>
                </div>

                {/* 3. LLM (Motor) */}
                <div className="flex flex-col items-center group opacity-80">
                     <div className="mb-4 bg-[var(--card-bg-solid)] border border-[var(--text-secondary)]/30 px-4 py-3 rounded-lg text-[11px] mono-font text-[var(--text-secondary)] shadow-lg w-40 text-center transform group-hover:-translate-y-1 transition-transform">
                        PROMPT EXATO:<br/>
                        [Contexto + Intenção + Estrutura de Dados]
                    </div>
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-color)] border-2 border-[var(--text-secondary)] flex items-center justify-center grayscale">
                        <IconNeural className="w-8 h-8 text-[var(--text-secondary)]" />
                    </div>
                    <span className="mt-3 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">3. LLM (Motor)</span>
                </div>

            </div>
        </div>
    );
};

// ==========================================
// 2. LISTA DE DORES (ENUMERADA & RESPONDIDA)
// ==========================================
const PainSection = () => {
    const pains = [
        {
            q: "Cansado de IAs que sofrem de 'Amnésia de Chat'?",
            a: "A maioria das ferramentas esquece quem você é assim que a janela fecha. O Ash possui memória de longo prazo (RAG). Ele conecta o histórico do mês passado com a decisão de hoje, garantindo continuidade."
        },
        {
            q: "Exausto de copiar e colar contexto entre 5 ferramentas diferentes?",
            a: "Seus projetos estão no Notion, seus arquivos no Drive e sua conversa no ChatGPT. O Prana centraliza tudo. O Ash vê o todo, eliminando a necessidade de você ser o 'transportador de dados'."
        },
        {
            q: "Irritado com conselhos genéricos que ignoram seu cansaço?",
            a: "Produtividade sem biologia é burnout. O Ash lê sua Energia Dual. Se você está esgotado, ele não sugere 'focar mais', ele sugere descanso e reorganiza sua agenda para o dia seguinte."
        },
        {
            q: "Medo de 'bugs' e inconsistência na criação de tarefas?",
            a: "O Ash não 'alucina' datas. Ele usa 'Tool Calling' preciso para consultar seu calendário real antes de sugerir um prazo, garantindo que o plano seja executável e não apenas teórico."
        },
        {
            q: "Você gasta mais tempo configurando a IA do que criando?",
            a: "Isso é 'Fadiga de Decisão'. O Ash assume a carga burocrática. Ele decide a pasta, a tag e a prioridade com base no seu padrão, para que você foque apenas na intenção criativa."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto my-32 px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl serif-font mb-4 text-[var(--text-primary)]">O Custo da Desconexão</h2>
                <div className="w-16 h-px bg-[#d97706] mx-auto opacity-50"></div>
            </div>
            
            <div className="space-y-12">
                {pains.map((p, i) => (
                    <div key={i} className="flex gap-6 items-start group border-b border-[var(--glass-border)] pb-10 last:border-0 last:pb-0">
                        <div className="mt-1 text-[#d97706] font-mono text-xl opacity-60 font-bold">0{i+1}</div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 serif-font group-hover:text-[#d97706] transition-colors">
                                {p.q}
                            </h3>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light pl-4 border-l-2 border-[var(--glass-border)]">
                                {p.a}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 3. FUNCIONALIDADES (COM TEXTURA)
// ==========================================
const FeatureBlock = ({ title, icon: Icon, children, example, caption, index }) => {
    const isEven = index % 2 === 0;

    return (
        <div className="relative mb-40 last:mb-0">
            <div className={`flex flex-col lg:flex-row gap-16 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                
                {/* Texto */}
                <div className="lg:w-1/2 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-[#d97706]/10 rounded-xl text-[#d97706] border border-[#d97706]/20">
                            <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-bold text-[var(--text-primary)] serif-font">{title}</h3>
                    </div>
                    <div className="text-lg text-[var(--text-secondary)] leading-relaxed font-light space-y-6">
                        {children}
                    </div>
                </div>
                
                {/* Exemplo Visual com Textura */}
                <div className="lg:w-1/2 w-full flex justify-center relative z-10">
                    <div 
                        className="rounded-xl border border-[var(--glass-border)] p-8 font-mono text-xs relative overflow-hidden shadow-2xl w-full max-w-md group hover:border-[#d97706]/30 transition-all duration-500"
                        style={{
                            backgroundColor: 'var(--card-bg-solid)',
                            backgroundImage: 'var(--texture-image)',
                            backgroundBlendMode: 'overlay',
                            backgroundSize: '200px'
                        }}
                    >
                        {/* Header do Terminal */}
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-[var(--glass-border)] opacity-50">
                             <div className="flex gap-1.5">
                                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                             </div>
                             <div className="text-[#d97706] uppercase tracking-widest text-[9px] font-bold">
                                 Ash Core v3.0
                             </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="relative z-10">
                            {example}
                        </div>
                    </div>
                    {caption && <p className="absolute -bottom-10 text-[10px] text-[var(--text-secondary)] italic opacity-60 w-full text-center">{caption}</p>}
                </div>
            </div>
        </div>
    );
};

const AshFeatures = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-32">
                <span className="text-[#d97706] font-bold text-xs uppercase tracking-widest mb-4 block">Manifestação</span>
                <h2 className="text-5xl serif-font text-[var(--text-primary)]">Do Pensamento à Estrutura</h2>
            </div>

            <FeatureBlock 
                index={0}
                title="Manifestação de Projetos" 
                icon={IconSankalpa} 
                caption="De uma frase para uma hierarquia completa."
                example={
                    <div className="space-y-4">
                        <div className="text-[var(--text-secondary)] border-b border-[var(--glass-border)] pb-3 mb-3 italic">
                            "Ash, crie o projeto 'Lançamento do Curso' com as fases: Gravação, Edição e Tráfego. Prazos para final de Novembro."
                        </div>
                        <div className="text-emerald-500 text-[10px] animate-pulse font-bold">[MANIFESTANDO ESTRUTURA...]</div>
                        <div className="text-[var(--text-primary)] pl-3 border-l-2 border-[#d97706] space-y-2">
                            <div className="flex items-center gap-2 font-bold"><IconNexus className="w-3 h-3 text-[#d97706]"/> PROJETO: Lançamento Curso</div>
                            <div className="pl-4 flex flex-col gap-2 opacity-80">
                                <div className="flex justify-between items-center bg-[var(--bg-color)]/50 p-1 rounded"><span>└─ F1: Gravação</span> <span className="text-[#d97706]">30 Nov</span></div>
                                <div className="flex justify-between items-center bg-[var(--bg-color)]/50 p-1 rounded"><span>└─ F2: Edição</span> <span className="text-[#d97706]">30 Nov</span></div>
                                <div className="flex justify-between items-center bg-[var(--bg-color)]/50 p-1 rounded"><span>└─ F3: Tráfego</span> <span className="text-[#d97706]">30 Nov</span></div>
                            </div>
                        </div>
                    </div>
                }
            >
                <p>O Ash poupa a energia da configuração manual. Você fornece a <strong>Intenção</strong> ("Crie X com Y"), e ele manifesta a <strong>Estrutura</strong>.</p>
                <p>Ele cria o projeto raiz, desdobra os subprojetos, gera as tarefas iniciais e define os prazos no calendário, tudo respeitando a hierarquia do seu sistema.</p>
            </FeatureBlock>

            <FeatureBlock 
                index={1}
                title="Captura de Intenção (SmartModal)" 
                icon={IconNeural}
                caption="O fim dos formulários de preenchimento."
                example={
                    <div className="space-y-4">
                        <div className="text-[var(--text-secondary)] italic border-b border-[var(--glass-border)] pb-3 mb-3">
                            Input: "Reunião de orçamento com Pedro sexta 14h #financeiro !urgente"
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center bg-[var(--glass-border)]/30 p-2 rounded"><span className="text-blue-400 font-bold">Tarefa:</span> <span className="text-[var(--text-primary)]">Reunião orçamento</span></div>
                            <div className="flex justify-between items-center bg-[var(--glass-border)]/30 p-2 rounded"><span className="text-purple-400 font-bold">Pessoa:</span> <span className="text-[var(--text-primary)]">Pedro (CRM)</span></div>
                            <div className="flex justify-between items-center bg-[var(--glass-border)]/30 p-2 rounded"><span className="text-yellow-400 font-bold">Data:</span> <span className="text-[var(--text-primary)]">Sexta, 14:00</span></div>
                            <div className="flex justify-between items-center bg-[var(--glass-border)]/30 p-2 rounded"><span className="text-red-400 font-bold">Tag:</span> <span className="text-[var(--text-primary)]">Financeiro (Alta)</span></div>
                        </div>
                    </div>
                }
            >
                <p>O Ash entende a semântica da sua digitação rápida. Através do <strong>SmartModal</strong>, ele filtra o ruído e extrai os metadados automaticamente.</p>
                <p>Você não precisa selecionar a data no calendário ou buscar a tag na lista. Basta escrever. Ele entende.</p>
            </FeatureBlock>

            <FeatureBlock 
                index={2}
                title="Biorregulação & Views" 
                icon={IconZap}
                caption="A informação se adapta à sua energia."
                example={
                    <div className="space-y-4">
                        <div className="flex justify-between text-[var(--text-secondary)] border-b border-[var(--glass-border)] pb-2">
                            <span>Energia Detectada:</span> <span className="text-red-400 font-bold">20% (Esgotado)</span>
                        </div>
                        <div className="text-[#d97706] mt-2 font-bold flex items-center gap-2">
                            <IconLock className="w-3 h-3"/> MODO PROTEÇÃO ATIVO
                        </div>
                        <div className="pl-3 border-l-2 border-red-500/30 opacity-70 text-[var(--text-secondary)] text-[10px] space-y-2">
                            <div className="flex justify-between"><span>• Tarefas complexas</span> <span className="text-red-400">[OCULTADAS]</span></div>
                            <div className="flex justify-between"><span>• Notificações</span> <span className="text-red-400">[PAUSADAS]</span></div>
                            <div className="flex justify-between font-bold text-[var(--text-primary)]"><span>➜ Sugestão:</span> <span>Ritual de Pausa</span></div>
                        </div>
                    </div>
                }
            >
                <p>O Ash não te mostra a mesma lista todos os dias. Ele altera a <strong>View</strong> baseada na sua energia.</p>
                <p>Se você está cansado, ele oculta o complexo e mostra apenas o essencial. Se está criativo, ele abre o MindMap. É um software vivo.</p>
            </FeatureBlock>

            <FeatureBlock 
                index={3}
                title="Permissão Soberana" 
                icon={IconLock}
                caption="Agência com Consentimento."
                example={
                    <div className="space-y-6 text-center py-4">
                        <div className="text-[var(--text-primary)] font-serif italic text-sm">
                            "Encontrei 5 arquivos duplicados e 2 projetos estagnados. Deseja fundir e arquivar para limpar a mente?"
                        </div>
                        <div className="flex justify-center gap-4">
                            <button className="bg-[#d97706] text-[#1a1816] px-5 py-2 rounded font-bold hover:opacity-90 text-[10px] uppercase shadow-lg border border-[#d97706]">Sim, Executar</button>
                            <button className="border border-[var(--text-secondary)] text-[var(--text-secondary)] px-5 py-2 rounded hover:bg-white/5 text-[10px] uppercase">Ignorar</button>
                        </div>
                    </div>
                }
            >
                <p>A "Agência" do Ash não significa descontrole. Tudo opera sob a <strong>Lei da Permissão</strong>.</p>
                <p>Ele observa, analisa e sugere a mudança estrutural ("Devo mover isso para 'Feito'?"), mas a execução final no banco de dados depende do seu clique. Você é o regente.</p>
            </FeatureBlock>

        </section>
    )
}

// ==========================================
// 4. MÉTODO SOCD (O SEU CÓDIGO)
// ==========================================
const SOCDMethod = () => {
    const steps = [
        { t: "SHOW (Revelar)", desc: "O Ash atua como um espelho. Ele traz à luz gargalos de projeto, quedas de energia e padrões que você ignora. A consciência precede a ação." },
        { t: "ORGANIZE (Organizar)", desc: "Ele categoriza o caos. Separa vida pessoal e profissional em Biomas distintos, mas conectados, garantindo que cada área receba a atenção devida." },
        { t: "CREATE (Estruturar)", desc: "O braço executor. O Ash escreve documentos, gera tarefas e monta cronogramas. Ele preenche a página em branco para você apenas refinar." },
        { t: "DEVELOP (Evoluir)", desc: "A melhoria contínua. O Ash analisa o que foi feito na semana e sugere ajustes de rota para alinhar sua performance à sua saúde." },
    ];

    return (
        <section className="py-32 bg-[var(--bg-color)] border-t border-[var(--glass-border)]">
             <div className="max-w-6xl mx-auto px-6">
                 <div className="text-center mb-24">
                     <span className="text-[#d97706] font-bold text-xs uppercase tracking-widest mb-4 block">Ciclo de Ação</span>
                     <h2 className="text-4xl serif-font mb-6 text-[var(--text-primary)]">Como o Ash Age?</h2>
                     <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl mx-auto">
                         Ele não é aleatório. Ele segue o ciclo orgânico de maturação de dados do Prana.
                     </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {steps.map((s, i) => (
                         <div key={i} className="flex gap-6 group">
                             <div className="text-6xl serif-font text-[var(--glass-border)] group-hover:text-[#d97706] transition-colors select-none font-light">
                                 {i + 1}
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{s.t}</h3>
                                 <p className="text-sm text-[var(--text-secondary)] leading-loose font-light">
                                     {s.desc}
                                 </p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        </section>
    )
}

// ==========================================
// 5. PÁGINA PRINCIPAL
// ==========================================

export default function AshPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("prana-dark-textured");

  const toggleTheme = () => {
    setTheme(prev => prev === "prana-dark-textured" ? "prana-light-textured" : "prana-dark-textured");
  };

  return (
    <div
      className={`min-h-screen w-full font-sans selection:bg-[#d97706]/30 ${theme}`}
      data-theme={theme}
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
    >
      {/* GLOBAL STYLES & TEXTURES */}
      <style>{`
        :root, [data-theme='prana-dark-textured'] {
          --accent-rgb: 217, 119, 6; --accent: #d97706;
          --bg-color: #1a1816;
          --text-primary: #e6e1db;
          --text-secondary: #a8a29e;
          --card-bg-solid: #262422; 
          --glass-border: rgba(255, 255, 255, 0.05); 
          --glass-bg: rgba(26, 24, 22, 0.6);
          --texture-image: url('https://www.transparenttextures.com/patterns/cartography.png');
        }
        [data-theme='prana-light-textured'] {
          --bg-color: #F0EFEA;
          --text-primary: #3d3a36; 
          --text-secondary: #6b6661; 
          --accent-rgb: 217, 119, 6; --accent: #d97706;
          --card-bg-solid: #FFFFFF;
          --glass-border: rgba(0, 0, 0, 0.05);
          --glass-bg: rgba(240, 239, 234, 0.85);
          --texture-image: url('https://www.transparenttextures.com/patterns/paper.png');
        }
        .serif-font { font-family: 'Vollkorn', serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        .glass-card { background: var(--glass-bg); backdrop-filter: blur(12px); }
        
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 1s ease-out forwards; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--glass-border)] bg-[var(--bg-color)]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <PranaLogo className="w-8 h-8 text-[#d97706] fill-current" />
                <span className="serif-font text-xl tracking-tight hidden sm:block font-bold text-[var(--text-primary)]">Prana</span>
            </div>
            <div className="flex items-center gap-6">
                 <button onClick={() => navigate('/plans')} className="text-xs font-bold uppercase tracking-widest hover:text-[#d97706] transition-colors text-[var(--text-secondary)]">Planos</button>
                 <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[#d97706]/10 text-[var(--text-secondary)] transition-colors">
                    {theme.includes('light') ? <IconLua className="w-5 h-5" /> : <IconFogo className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </nav>

      <main className="pt-32 pb-32">
          
          {/* HERO */}
          <section className="text-center px-6 max-w-5xl mx-auto mb-24 pt-20">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--glass-border)] bg-[var(--card-bg-solid)] mb-8">
                      <IconNeural className="w-4 h-4 text-[#d97706]" />
                      <span className="text-[10px] mono-font uppercase tracking-widest text-[var(--text-secondary)]">Neural Context Engine</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-8xl serif-font mb-8 leading-tight text-[var(--text-primary)] font-light tracking-tight">
                      Inteligência com <br/>
                      <span className="italic text-[#d97706] opacity-80">Memória e Alma.</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto font-light mb-12">
                      O Ash não é um chatbot. É um <strong>Middleware</strong> que conecta sua intenção, sua energia biológica e seus projetos em um único fluxo de consciência, eliminando a necessidade de explicações repetitivas.
                  </p>

                  <div className="flex justify-center gap-6">
                      <button onClick={() => navigate('/plans')} className="px-10 py-4 bg-[#d97706] text-[#1a1816] font-bold rounded shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:scale-105 transition-transform text-xs uppercase tracking-widest">
                          Habilitar Ash
                      </button>
                  </div>
              </motion.div>
          </section>

          {/* DIAGRAMA */}
          <section className="px-6 mb-32 bg-[var(--card-bg-solid)] border-y border-[var(--glass-border)]">
               <div className="text-center pt-16 mb-4">
                   <h2 className="text-3xl serif-font text-[var(--text-primary)]">O Elo Perdido (Middleware)</h2>
               </div>
               <AshMiddlewareDiagram />
               <p className="text-center text-xs mono-font text-[var(--text-secondary)] opacity-50 mb-16 pb-8">*Seus dados pessoais são processados localmente e nunca treinam modelos públicos.</p>
          </section>

          {/* DORES */}
          <PainSection />

          {/* FUNCIONALIDADES */}
          <AshFeatures />

          {/* SOCD */}
          <SOCDMethod />

          {/* FAQ */}
          <div className="py-24 border-t border-[var(--glass-border)]">
              <h2 className="text-3xl serif-font mb-16 text-center text-[var(--text-primary)]">Inquirições sobre o Agente</h2>
              <AshFAQ />
          </div>

          {/* CTA */}
          <section className="py-32 text-center border-t border-[var(--glass-border)] relative overflow-hidden bg-[var(--card-bg-solid)]">
               <div className="absolute inset-0 bg-[#d97706]/5 blur-[120px] rounded-full pointer-events-none"></div>
               <div className="relative z-10">
                   <h2 className="text-4xl md:text-6xl serif-font mb-8 text-[var(--text-primary)] font-light">Sua mente precisa de espaço.</h2>
                   <p className="text-[var(--text-secondary)] mb-12 max-w-lg mx-auto">Deixe o Ash carregar o peso da estrutura para que você possa apenas criar.</p>
                   <button onClick={() => navigate('/plans')} className="px-12 py-5 bg-[var(--text-primary)] text-[#1a1816] font-bold rounded-full hover:scale-105 transition-all shadow-2xl uppercase tracking-widest text-sm">
                       Habilitar meu Segundo Cérebro
                   </button>
               </div>
          </section>

      </main>
    </div>
  );
};
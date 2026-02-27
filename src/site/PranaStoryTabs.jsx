import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORTS ---
import { 
  IconAlertTriangle, IconFogo, IconSoul, IconDiario,
  IconCheckCircle, IconDone, IconPapyrus, IconVolumeX, IconVolume2,
} from "../components/icons/PranaLandscapeIcons";

import PranaLogo from "../components/PranaLogo";

// --- NOVO COMPONENTE: VÍDEO HORIZONTAL (RETO E SEM BORDA GROSSA) ---
const HorizontalVideoCard = () => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if(videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[var(--glass-border)] group">
             {/* Video Direct - Autoplay Clean */}
             <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                autoPlay 
                loop 
                muted={isMuted} 
                playsInline
             >
                <source src="https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/20251220_144925.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS8yMDI1MTIyMF8xNDQ5MjUubXA0IiwiaWF0IjoxNzY3OTAwMzE4LCJleHAiOjE3OTk0MzYzMTh9.F8qwe73UvbScnZtaw2I8weofI64L3fz6eJPkxEw601g" type="video/mp4" />
             </video>
             
             {/* Overlay Suave */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none"></div>

             {/* Controles UI */}
             <div className="absolute top-4 right-4 z-20">
                 <button 
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black transition-all"
                 >
                     {isMuted ? <IconVolumeX className="w-3 h-3" /> : <IconVolume2 className="w-3 h-3" />}
                 </button>
             </div>

             <div className="absolute bottom-6 left-6 z-20">
                 <div className="flex items-center gap-2 mb-1">
                     <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse"></span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">Flow State</span>
                 </div>
                 <h3 className="text-white text-xs font-serif italic opacity-90">"A estrutura sólida permite que a criatividade flua."</h3>
             </div>
        </div>
    );
};

// --- COMPONENTE DE CABEÇALHO PADRONIZADO ---
const TabHeader = ({ badgeIcon: Icon, badgeText, title, subtitle }) => (
    <div className="text-center mb-10 px-4">
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-[var(--glass-border)] bg-[var(--card-bg-solid)] shadow-sm">
             {Icon && <Icon className="w-3 h-3 text-[var(--accent)]" />}
             <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">{badgeText}</span>
        </div>
        <div className="text-3xl md:text-5xl serif-font text-[var(--text-primary)] mb-6 leading-tight">
            {title}
        </div>
        <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-3xl mx-auto">
            {subtitle}
        </p>
    </div>
);

// --- 2. CONTEÚDO DAS ABAS ---

// ABA 1: O ERRO (SEUS TEXTOS ORIGINAIS)
const TabTheError = () => (
  <div className="h-full flex flex-col justify-start pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <TabHeader 
         title={<>Por muito tempo olhamos a <span className="text-[var(--accent)] italic">produtividade</span> com olhos de esforço, de fazer mais a qualquer custo.</>}
         subtitle="Tentamos rodar software de produtividade linear em um hardware biológico cíclico. O resultado é uma epidemia silenciosa. É hora de entendermos a nossa energia e utilizá-la ao nosso favor"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full px-4">
          <div className="p-8 border-l-2 border-red-500/20 bg-red-500/5 rounded-r-2xl">
              <h3 className="text-red-400 font-bold mb-3 uppercase text-xs tracking-widest">O Velho Mundo (Força)</h3>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <li>• Agenda lotada = Sucesso</li>
                  <li>• Ignora o cansaço e a biologia</li>
                  <li>• Busca a exaustão como medalha de honra</li>
              </ul>
          </div>
          <div className="p-8 border-l-2 border-[var(--accent)] bg-[var(--accent)]/5 rounded-r-2xl">
              <h3 className="text-[var(--accent)] font-bold mb-3 uppercase text-xs tracking-widest">Mundo Prana (Energia)</h3>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                  <li>• Agenda inteligente = Resultado</li>
                  <li>• Respeita os ciclos (hormonais e mentais)</li>
                  <li>• Busca o fluxo como estado natural</li>
              </ul>
          </div>
      </div>
  </div>
);

// ABA 2: A EPIDEMIA (SEUS TEXTOS + TEXTURA CORRIGIDA)
const TabTheEpidemic = () => (
  <div className="h-full flex flex-col justify-start pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
       
       <TabHeader 
         title={<>A Produtividade Linear Falhou.<br/><span className="text-[var(--accent)] italic text-3xl md:text-4xl opacity-80">veio o esgotamento, ansiedade, estresse, burnout.</span></>}
         subtitle="O resultado de ignorar a nossa natureza não é apenas cansaço. É uma crise de saúde pública."
      />

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4">
            {/* Card 1 */}
            <div className="relative p-8 rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] text-center group hover:border-orange-500/30 transition-colors overflow-hidden">
                <div className="texture-layer absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="relative z-10">
                    <div className="text-5xl font-bold text-orange-400 mb-4 serif-font">65%</div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Ansiedade Crônica</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Da Geração Z relata sentir-se ansiosa "o tempo todo" devido a cobranças de produtividade.
                    </p>
                </div>
            </div>

            {/* Card 2 */}
            <div className="relative p-8 rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] text-center group hover:border-orange-500/30 transition-colors overflow-hidden">
                <div className="texture-layer absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="relative z-10">
                    <div className="text-5xl font-bold text-orange-400 mb-4 serif-font">3x</div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Medicação</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        O uso de medicamentos para TDAH e ansiedade triplicou na última década entre criativos.
                    </p>
                </div>
            </div>

            {/* Card 3 */}
            <div className="relative p-8 rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] text-center group hover:border-orange-500/30 transition-colors overflow-hidden">
                <div className="texture-layer absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay"></div>
                <div className="relative z-10">
                    <div className="text-5xl font-bold text-orange-400 mb-4 serif-font">80%</div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 uppercase tracking-wide">Burnout Digital</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Dos trabalhadores intelectuais relatam exaustão mental severa ao final do dia.
                    </p>
                </div>
            </div>
       </div>
  </div>
);

// ABA 3: BIOLOGIA (PROMESSA) - TEXTOS E CORES RESTAURADOS
const TabThePromise = () => (
  <div className="h-full flex flex-col justify-start pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <TabHeader 
         title={<>Nunca foi sobre <span className="line-through decoration-red-500/30 decoration-2 opacity-50">fazer mais.</span><br/>Foi sobre <span className="italic text-[var(--accent)]">fazer melhor.</span></>}
         subtitle={<>   O mundo pede velocidade. Seu corpo tem ritmos. O Prana organiza seu trabalho em torno da sua energia,
                  em ciclos claros de foco e descanso, para que a clareza surja sem ansiedade. No Prana não queremos que você trabalhe mais horas. Queremos que você trabalhe nas horas certas, com a atividade certa para o momento.<br/>No Prana você monitora a sua <strong>energia, hormonios e humor</strong>.</>}
      />


      {/* Lista Limpa (Sem Cards Vermelhos, Sem 100% Humano) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-left max-w-3xl mx-auto w-full px-4 mt-8">
          {[
              "Respeito ao Ciclo Menstrual e Hormonal",
              "Detecção de Burnout em Tempo Real",
              "Astrologia Integrada ao Fluxo de Trabalho",
              "Interface Wabi-Sabi que reduz fadiga visual"
          ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-[var(--glass-border)]">
                  <IconCheckCircle className="w-5 h-5 text-[var(--accent)] shrink-0" /> 
                  <span className="text-sm text-[var(--text-primary)]">{item}</span>
              </div>
          ))}
      </div>
  </div>
);

// ABA // ABA 4: FILOSOFIA (CORRIGIDA: TAMANHO DA IMAGEM E SEM DUPLICAÇÃO)
const TabPhilosophy = () => {
    const [subTab, setSubTab] = useState('gtc'); 

    return (
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
            
            {/* Header Flexivel: Título na Esquerda, Switcher na Direita */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[var(--glass-border)] pb-6 gap-6">
                 <div className="text-left">
                    <div className="flex items-center gap-2 mb-2 text-[var(--accent)]">
                        <IconSoul className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Filosofia do Sistema</span>
                    </div>
                    <h2 className="text-3xl serif-font text-[var(--text-primary)]">
                        A Alma da Máquina
                    </h2>
                 </div>

                 {/* Switcher Delicado */}
                 <div className="flex bg-[var(--card-bg-solid)] p-1 rounded-lg border border-[var(--glass-border)]">
                     <button 
                        onClick={() => setSubTab('gtc')}
                        className={`px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${subTab === 'gtc' ? 'bg-[var(--accent)] text-[#1a1816]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                     >
                        GTC
                     </button>
                     <button 
                        onClick={() => setSubTab('wabi')}
                        className={`px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${subTab === 'wabi' ? 'bg-[var(--accent)] text-[#1a1816]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                     >
                        Wabi-Sabi
                     </button>
                 </div>
            </div>

            {/* Conteúdo GTC */}
            {subTab === 'gtc' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500 pt-2">
                        <h3 className="text-4xl serif-font text-[var(--text-primary)] mb-6 leading-tight">
                            Esqueça o GTD. <br/>
                            <span className="italic text-[var(--accent)]">Get Things Created.</span>
                        </h3>
                        <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                            Ferramentas tradicionais focam em "riscar tarefas" para fazê-las desaparecer (Getting Things Done). 
                            O Prana foca em transformar tarefas em <strong>Legado</strong>.
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8 pl-4 border-l border-[var(--accent)]/30">
                            Quando você conclui um projeto no Prana, ele não vai para um "Arquivo Morto". Ele torna-se um ativo na sua Biblioteca de Criação.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-[var(--bg-color)] border border-[var(--glass-border)] opacity-60">
                                <IconDone className="w-5 h-5 text-[var(--text-secondary)] mb-2" />
                                <div className="text-xs text-[var(--text-secondary)] line-through decoration-red-500/50">Tarefa Concluída</div>
                                <div className="text-[10px] opacity-50">O objetivo é o vazio.</div>
                            </div>
                            <div className="p-4 rounded-lg bg-[var(--card-bg-solid)] border border-[var(--accent)]/30">
                                <IconPapyrus className="w-5 h-5 text-[var(--accent)] mb-2" />
                                <div className="text-xs font-bold text-[var(--text-primary)]">Artefato Criado</div>
                                <div className="text-[10px] text-[var(--accent)]">O objetivo é o legado.</div>
                            </div>
                        </div>
                    </div>
                    {/* Visual Vídeo (GTC) */}
                    <div className="flex justify-center animate-in fade-in slide-in-from-right-4 duration-500 pt-4">
                        <HorizontalVideoCard />
                    </div>
                </div>
            )}

            {/* Conteúdo Wabi-Sabi */}
            {subTab === 'wabi' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Coluna da Esquerda: Texto */}
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500 pt-2">
                        <h3 className="text-4xl serif-font text-[var(--text-primary)] mb-6 leading-tight">
                            Wabi Sabi: <br/>
                            <span className="italic opacity-70">A Beleza da Impermanência.</span>
                        </h3>
                        <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                            Não tentamos criar um "sistema perfeito" que gera ansiedade quando você falha. 
                            O Prana abraça o Wabi Sabi: nada dura, nada é perfeito, nada é completo.
                        </p>
                        <ul className="space-y-6">
                             <li className="flex gap-4">
                                 <div className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] text-xs font-bold font-serif shrink-0">1</div>
                                 <div>
                                     <strong className="block text-[var(--text-primary)] text-sm mb-1">Visual Calmante</strong>
                                     <p className="text-xs text-[var(--text-secondary)]">Texturas orgânicas e tons terrosos reduzem a fadiga visual.</p>
                                 </div>
                             </li>
                             <li className="flex gap-4">
                                 <div className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] text-xs font-bold font-serif shrink-0">2</div>
                                 <div>
                                     <strong className="block text-[var(--text-primary)] text-sm mb-1">Aceitação do Caos</strong>
                                     <p className="text-xs text-[var(--text-secondary)]">Ferramentas para reorganizar a bagunça rapidamente, sem culpa.</p>
                                 </div>
                             </li>
                        </ul>
                    </div>
                    
                    {/* Coluna da Direita: Imagem Única (Tamanho Reduzido) */}
                    <div className="flex justify-center animate-in fade-in slide-in-from-right-4 duration-500 pt-4">
                        <div className="relative w-full max-w-sm h-[320px] rounded-2xl overflow-hidden group shadow-2xl border border-[var(--glass-border)]">
                            <img 
                                src="https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/hanxiao-xu-Cc4ypLTqQbg-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS9oYW54aWFvLXh1LUNjNHlwTFRxUWJnLXVuc3BsYXNoLmpwZyIsImlhdCI6MTc2ODkzODM3NCwiZXhwIjoxODAwNDc0Mzc0fQ.qX4L96KByQrtOnLHVMfdG73d4lbm_YQhG8FWyL9KtRc"
                                alt="Wabi Sabi Aesthetic"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[30s] group-hover:scale-110"
                            />
                            {/* Overlay para texto legível */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
                            
                            {/* Texto na imagem */}
                            <div className="absolute bottom-6 left-6 text-white text-xs font-bold uppercase tracking-widest bg-black/30 px-3 py-1 rounded backdrop-blur-sm pointer-events-none">
                                 Pedra, Papel, Fluxo.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- COMPONENTE PRINCIPAL (SECTION COM BARRA DIVISÓRIA & LINHA COBRE) ---

export const PranaStoryTabs = () => {
  const [activeTab, setActiveTab] = useState('erro'); 

  const tabs = [
    { id: 'erro', label: '1. falsa produtividade' },
    { id: 'epidemia', label: '2. epidemia silenciosa' },
    { id: 'promessa', label: '3. fluir mais' },
    { id: 'filosofia', label: '4. filosofia prana' },
  ];

  return (
    <section className="pb-16 pt-0 bg-[var(--bg-color)] border-b border-[var(--glass-border)] relative overflow-hidden">
      
      {/* 2. A BARRA DE ABAS (STRIPE) */}
      <div className="w-full border-y border-[var(--glass-border)] bg-[var(--card-bg-solid)] relative mb-16 shadow-sm z-20">
          
          {/* DEFINIÇÃO DA VARIÁVEL DE BORDA DINÂMICA (Para o efeito Cobre no Dark Mode) */}
          <style>{`
            :root { --tab-border-color: rgba(255, 255, 255, 0.1); } /* Default Light */
            
            /* DARK MODE: Linha Cobre */
            [data-theme='prana-dark-textured'] { 
                --tab-border-color: var(--accent); 
            }
            [data-theme='prana-dark-textured'] .copper-border-bottom {
                border-bottom: 1px solid var(--accent);
            }
            
            /* LIGHT MODE: Linha Sutil */
            [data-theme='prana-light-textured'] { 
                --tab-border-color: rgba(0,0,0,0.1);
              
            }
            [data-theme='prana-light-textured'] .copper-border-bottom {
                border-bottom: 0.5px solid rgba(0,0,0,0.05);
            }

            /* Textura da Barra (Mais Visível) */
            .bar-texture {
                position: absolute;
                inset: 0;
                pointer-events: none;
                background-repeat: repeat;
                z-index: 1; 
                opacity: 0.5; 
            }
            [data-theme='prana-dark-textured'] .bar-texture {
                background-image: url('https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/maxim-boldyrev-cDLLSVxTpmg-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS9tYXhpbS1ib2xkeXJldi1jRExMU1Z4VHBtZy11bnNwbGFzaC5qcGciLCJpYXQiOjE3Njc4OTgxMDAsImV4cCI6MTc5OTQzNDEwMH0.bpM_qNjCs2MrCWSc8zk72KtHAhVDATuw9Nuz7s9biLI');
                filter: invert(1); 
            }
            [data-theme='prana-light-textured'] .bar-texture {
                background-image: url('https://www.transparenttextures.com/patterns/paper.png');
                mix-blend-mode: multiply;
            }
          `}</style>
          
          <div className="bar-texture"></div>

          {/* Container das Abas - A linha de baixo da barra é controlada pelo CSS acima (copper-border-bottom) */}
          <div className="max-w-7xl mx-auto h-16 flex items-end justify-center relative z-10 copper-border-bottom transition-colors duration-500">
              <div className="flex gap-2 h-full items-end px-4">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative px-6 py-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 outline-none rounded-t-lg
                                ${isActive 
                                    // ABA ATIVA: Borda lateral e topo Cobre (no dark). Fundo igual ao corpo da página.
                                    // A borda inferior é 'bg-[var(--bg-color)]' para "apagar" a linha da barra.
                                    ? 'bg-[var(--bg-color)] text-[var(--accent)] border-t border-x h-[calc(100%-8px)] translate-y-[1px]' 
                                    // ABA INATIVA
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] h-[calc(100%-16px)] hover:bg-black/5 dark:hover:bg-white/5 border-t border-x border-transparent'
                                }
                            `}
                            style={{
                                // A borda da aba segue a variável dinâmica (Cobre no dark, Cinza no light)
                                borderColor: isActive ? 'var(--tab-border-color)' : 'transparent'
                            }}
                        >
                            {/* "Curativo" Visual: O fundo deste div deve ser IGUAL ao fundo da SESSÃO DE CONTEÚDO abaixo.
                                Ele fica em cima da linha de borda da barra, criando a ilusão de continuidade. */}
                            {isActive && (
                                <div className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[var(--bg-color)] w-full z-30"></div>
                            )}
                            {tab.label}
                        </button>
                    )
                })}
              </div>
          </div>
      </div>

      {/* 3. ÁREA DE CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Altura Fixa para Estabilidade */}
        <div className="relative w-full h-[680px]">
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
               exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
               transition={{ duration: 0.4, ease: "easeOut" }}
               className="h-full w-full flex flex-col"
             >
               {activeTab === 'erro' && <TabTheError />}
               {activeTab === 'epidemia' && <TabTheEpidemic />}
               {activeTab === 'promessa' && <TabThePromise />}
               {activeTab === 'filosofia' && <TabPhilosophy />}
             </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PranaStoryTabs;
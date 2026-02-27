import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  // Ícones do Sistema (Confirmados)
  IconNexus,    // Para Hierarquia/Estrutura
  IconFogo,     // Para Energia (Substitui Zap)
  IconLayout,   // Para Documentos/Interface (Substitui File)
  IconMap,      // Para MindMaps
  IconVoid,     // Para Bloqueios/Limites (Substitui Lock - "Void" como container)
  IconFlux,     // Para Fluxo/Setas
  IconLua,      // Para Calendário/Ciclos (Substitui Calendar)
  IconCode,     // Para Tags/Meta-dados (Substitui Tags)
  IconCraft,    // Para Edição (Substitui Edit)
  IconLayers,   // Para Nesting/Camadas
  IconMatrix    // Para Estruturas complexas
} from "../../components/icons/PranaLandscapeIcons";

// Import do Demo Existente
import LiveDemoPlanner from "../demos/LiveDemoPlanner";

// --- SUB-COMPONENTES VISUAIS ---

// 1. Nó da Árvore (Simulação Visual)
const HierarchyNode = ({ label, type, depth, active }) => {
    const isProject = type === 'project';
    return (
        <div 
            className={`flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition-all w-full cursor-default ${active ? 'bg-white/5 border-white/10' : ''}`}
            style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        >
            {depth > 0 && <div className="absolute left-0 w-px h-full bg-white/5" style={{ left: `${depth * 1.5 - 0.5}rem` }} />}
            
            <div className={`w-6 h-6 rounded flex items-center justify-center ${isProject ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-stone-800 text-stone-400'}`}>
                {type === 'project' && <IconNexus className="w-3 h-3" />}
                {type === 'mindmap' && <IconMap className="w-3 h-3 text-purple-400" />}
                {type === 'doc' && <IconLayout className="w-3 h-3 text-blue-400" />}
                {type === 'task' && <div className="w-2 h-2 rounded-full border border-current" />}
            </div>
            
            <span className={`text-sm ${active ? 'text-stone-100 font-medium' : 'text-stone-400 font-light'}`}>
                {label}
            </span>
        </div>
    );
};

// 2. Card de Feature da Hierarquia
const HierarchyFeature = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-4 items-start p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
        <div className="mt-1 p-2 rounded-full bg-stone-900 border border-white/10 text-[var(--accent)] group-hover:scale-110 transition-transform">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <h4 className="text-stone-200 font-bold text-sm mb-1">{title}</h4>
            <p className="text-stone-400 text-xs leading-relaxed">{desc}</p>
        </div>
    </div>
);

// 3. Card de Grade (Bento Grid Item)
const GridCard = ({ title, subtitle, icon: Icon, children, className }) => (
    <div className={`bg-stone-900/40 border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden group ${className}`}>
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
            <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl serif-font text-stone-200 mb-1">{title}</h3>
            <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-6">{subtitle}</p>
            {children}
        </div>
        {/* Glow Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
);


const SectionOrganize = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} id="section-organize" className="relative py-32 bg-stone-950 text-stone-200 border-t border-white/10 overflow-hidden">
      
      {/* 1. BACKGROUND COMPLEXO (A Quebra Visual) */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 pointer-events-none">
          {/* Noise Texture para dar 'grão' */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          {/* Abstract Architecture Image Overlay - Imagem de estrutura escura */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1485628390555-1489e53833d0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay grayscale" />
          
          {/* Radial Gradient Spotlights */}
          <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-[var(--accent)]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-20">

        {/* HEADER */}
        <div className="mb-32">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 backdrop-blur-sm">
                <IconNexus className="w-3 h-3 text-[var(--accent)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Etapa 2: Organize</span>
            </div>
            <h2 className="text-5xl md:text-7xl serif-font text-stone-100 leading-[0.9]">
                Ordem no <span className="italic text-stone-500">Caos.</span>
            </h2>
            <p className="mt-6 text-lg text-stone-400 font-light max-w-2xl leading-relaxed">
                A vida não cabe em uma lista plana. O Prana oferece um sistema multidimensional 
                para estruturar seus projetos, calibrar seu tempo e contextualizar suas ações.
            </p>
        </div>

        {/* 2. HIERARQUIA DE PROJETOS (O Pilar Central) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
            {/* Esquerda: A Árvore Visual */}
            <div className="lg:col-span-5 bg-stone-900/80 rounded-2xl border border-white/10 p-6 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-2">
                        <IconNexus className="w-3 h-3" />
                        Project Hierarchy v3.0
                    </span>
                    <div className="flex gap-2">
                         <div className="w-2 h-2 rounded-full bg-red-500" />
                         <div className="w-2 h-2 rounded-full bg-yellow-500" />
                         <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                </div>
                <div className="space-y-1">
                    <HierarchyNode label="Empresa (Root)" type="project" depth={0} />
                    <HierarchyNode label="Marketing" type="project" depth={1} />
                    <HierarchyNode label="Lançamento Q3" type="project" depth={2} active={true} />
                    <HierarchyNode label="MindMap de Ideias" type="mindmap" depth={3} />
                    <HierarchyNode label="Briefing Copy" type="doc" depth={3} />
                    <HierarchyNode label="Design Assets" type="project" depth={2} />
                </div>
            </div>

            {/* Direita: As Funcionalidades Diversas */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HierarchyFeature 
                    icon={IconFlux} 
                    title="Hierarquia Fluida" 
                    desc="Arraste e solte para transformar uma tarefa em um projeto inteiro, ou arquive um projeto dentro de outro. Nada é estático." 
                />
                <HierarchyFeature 
                    icon={IconCraft} 
                    title="Renomeação Rápida" 
                    desc="Seus projetos evoluem. Renomeie, mude o ícone e a cor de qualquer nó da árvore sem quebrar links ou referências." 
                />
                <HierarchyFeature 
                    icon={IconLayers} 
                    title="Nesting Infinito" 
                    desc="Crie sub-sub-sub projetos. Organize sua vida com a profundidade necessária, sem limites artificiais de 'pastas'." 
                />
                <HierarchyFeature 
                    icon={IconMap} 
                    title="Artefatos Nativos" 
                    desc="Docs, MindMaps e Whiteboards não são anexos. Eles vivem na árvore como cidadãos de primeira classe." 
                />
            </div>
        </div>

        {/* 3. O GRID DE ORGANIZAÇÃO (Planner, Calendar, Tags) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            
            {/* Card Calendário */}
            <GridCard title="Calendário" subtitle="Tempo Linear" icon={IconLua} className="md:col-span-1 h-full min-h-[300px]">
                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                    Visualize prazos, eventos astronômicos e entregas em uma visão mensal ou semanal unificada.
                </p>
                {/* Mini representação visual abstrata de calendário */}
                <div className="mt-auto grid grid-cols-7 gap-1 opacity-50">
                    {[...Array(28)].map((_, i) => (
                        <div key={i} className={`h-6 rounded-sm ${[2, 10, 15, 22].includes(i) ? 'bg-[var(--accent)]' : 'bg-white/10'}`} />
                    ))}
                </div>
            </GridCard>

            {/* Card Tags */}
            <GridCard title="Tags Globais" subtitle="Dimensão Contextual" icon={IconCode} className="md:col-span-1 h-full min-h-[300px]">
                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                    Crie conexões transversais. Uma tag "Deep Work" ou "Delegação" agrupa tarefas de projetos completamente diferentes.
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30 flex items-center gap-1">
                        <IconCode className="w-3 h-3" /> DeepWork
                    </span>
                    <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30 flex items-center gap-1">
                        <IconCode className="w-3 h-3" /> Design
                    </span>
                    <span className="px-2 py-1 rounded-md bg-orange-500/20 text-orange-300 text-xs border border-orange-500/30 flex items-center gap-1">
                        <IconFogo className="w-3 h-3" /> Urgente
                    </span>
                </div>
            </GridCard>

             {/* Card Planner (Destaque) */}
             <GridCard title="Planner Semanal" subtitle="Alocação de Energia" icon={IconFogo} className="md:col-span-1 h-full min-h-[300px] border-[var(--accent)]/30 bg-[var(--accent)]/5">
                <p className="text-stone-300 text-sm leading-relaxed mb-4">
                    Sua ferramenta tática. Distribua o backlog nos dias da semana baseado na sua capacidade energética real.
                </p>
                <div className="mt-auto flex items-center justify-center">
                   <div className="text-[var(--accent)] text-xs uppercase font-mono border border-[var(--accent)] px-3 py-1 rounded-full animate-pulse flex items-center gap-2">
                        <IconFogo className="w-3 h-3" />
                        Sincronização Ativa
                   </div>
                </div>
            </GridCard>

        </div>

        {/* 4. O PLANNER LIVE DEMO (A Aplicação Prática) */}
        <div className="relative">
            <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl serif-font text-stone-100">
                    Planejamento Baseado em <span className="text-[var(--accent)]">Energia</span>
                </h3>
            </div>
            
            <div className="relative max-w-5xl mx-auto bg-stone-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden group">
                 {/* Gradient Top Line */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
                 
                 <div className="p-4 md:p-8 overflow-x-auto bg-stone-950/50 backdrop-blur-sm">
                    {/* Renderiza o componente funcional do Planner que já temos */}
                    <LiveDemoPlanner />
                 </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default SectionOrganize;
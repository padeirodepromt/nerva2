import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconVision, IconFogo, IconFlux, IconMatrix, IconList, IconLayout, IconLua,
  IconActivity, IconMap, IconNexus, IconCode, IconTerminal,
} from "../../components/icons/PranaLandscapeIcons";

// Imports Visuais
import LiveDemoDashboard from "../demos/LiveDemoDashboard";
import LiveDemoViews from "../demos/LiveDemoViews";

const FeaturePoint = ({ title, desc, icon: Icon }) => (
    <div className="border-l border-[var(--glass-border)] pl-6 py-4 group hover:border-[var(--accent)] transition-colors">
        <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className="w-4 h-4 text-[var(--accent)] opacity-80 group-hover:opacity-100 transition-opacity" />}
            <h4 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wide">{title}</h4>
        </div>
        <p className="text-[var(--text-secondary)] text-xs leading-relaxed font-light">{desc}</p>
    </div>
);

const SectionShow = () => {
  return (
    <section id="section-show" className="relative py-32 bg-[var(--bg-color)] border-t border-[var(--glass-border)] snap-start">
      
      {/* 1. HEADER EDITORIAL - ESTRUTURA FUNDIDA (Igual ao Hero) */}
      {/* Container e Grid na mesma DIV para garantir alinhamento exato */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-24 pb-12 border-b border-[var(--glass-border)]">
            {/* Coluna Título (Esquerda) */}
            <div>
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5">
                    <IconVision className="w-3 h-3 text-[var(--accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Etapa 1: Show</span>
                </div>
                <h2 className="text-5xl md:text-7xl serif-font text-[var(--text-primary)] leading-[0.9]">
                    O Espelho <br/>
                    <span className="italic text-[var(--accent)]">da Realidade.</span>
                </h2>
            </div>
            
            {/* Coluna Descrição (Direita) */}
            <div className="text-left lg:pl-8">
                <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-lg border-l border-[var(--glass-border)] pl-6">
                   Você não pode gerenciar o que não vê. Antes de organizar, o Prana revela o estado atual do seu sistema: 
                   sua energia biológica, seu ambiente mental e a estrutura dos seus dados.
                </p>
            </div>
      </div>

      {/* 2. O SANTUÁRIO (DASHBOARD) */}
      {/* Mantendo o max-w-7xl px-6 wrapper aqui pois os conteúdos internos variam de grid */}
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-40">
            {/* Esquerda: Narrativa */}
            <div className="lg:col-span-5 order-2 lg:order-1">
                <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 block">A fundação da produtividade sustentável</span>
                <h3 className="text-3xl serif-font text-[var(--text-primary)] mb-6">
                    Santuário: Sua Central de Comando.
                </h3>
                <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                   Esqueça os dashboards poluídos. O Santuário foi desenhado para ser o primeiro lugar que você olha ao acordar. Ele te situa no tempo, no espaço e na sua energia.
                   O Prana te ajuda a monitorar seus biorritmos, contexto ambiental e níveis de energia para sugerir <em>quando</em> executar, maximizando seu ROI cognitivo sem burnout.
                </p>

                <div className="space-y-2">
                    <FeaturePoint 
                        icon={IconActivity}
                        title="Bio-Feedback em Tempo Real" 
                        desc="Monitoramento cruzado de sono, humor e foco. Se você está drenado, o Santuário sugere recuperação, não trabalho." 
                    />
                    <FeaturePoint 
                        icon={IconFogo}
                        title="Alinhamento de Intenção" 
                        desc="Antes de abrir a lista de tarefas, defina sua intenção (Sankalpa). O sistema ajusta a interface para refletir esse foco." 
                    />
                    <FeaturePoint 
                        icon={IconLayout}
                        title="Visão Unificada" 
                        desc="Sem abas abertas. Agenda, métricas e estado mental em uma única tela de 'Pouso'. Filtre os cards que importam para ver o minimalismo em ação" 
                    />
                     <FeaturePoint 
                        icon={IconLua}
                        title="Astrologia, Ciclos e Human Design" 
                        desc="Quanto mais você aprende sobre você e seus ciclos, mas você consegue ser verdadeiramente eficiente. Isso é o que chamamos de Alta Performance."
                    />
                </div>
            </div>

            {/* Direita: Live Demo Dashboard */}
            <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="relative w-full">
                    {/* Glow Fundo */}
                    <div className="absolute inset-0 bg-purple-500/5 blur-[80px] pointer-events-none rounded-full transform scale-90"></div>
                    
                    {/* Container com padding para evitar cortes */}
                    <div className="relative z-10 w-full p-4"> 
                        <LiveDemoDashboard />
                    </div>
                    
                    <div className="text-center mt-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest flex items-center justify-center gap-2 opacity-60">
                        <IconActivity className="w-3 h-3 text-purple-500" />
                        Interface do Santuário v2.0
                    </div>
                </div>
            </div>
        </div>

        {/* 3. O EXTERNO: VIEWS (PRISMA DE DADOS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Esquerda: Live Demo Views */}
            <div className="lg:col-span-7">
                <div className="relative w-full">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[80px] pointer-events-none rounded-full"></div>
                    
                    <div className="relative z-10 w-full p-4">
                        <LiveDemoViews />
                    </div>
                    
                    <div className="text-center mt-4 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest flex items-center justify-center gap-2 opacity-60">
                        <IconLayout className="w-3 h-3 text-blue-500" />
                        Prana Workspace: Multi-View System
                    </div>
                </div>
            </div>

            {/* Direita: As 5 Views Essenciais */}
            <div className="lg:col-span-5 pl-0 lg:pl-8">
                <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 block">conheça</span>
                <h3 className="text-3xl serif-font text-[var(--text-primary)] mb-6">
                    As Views de Projetos do Prana
                </h3>
                <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                    Veja e trabalhe nos seus projetos no layout que seu cérebro pedir agora. Alterne instantaneamente para destravar insights. As View do Prana permitem que você veja seus dados sob múltiplas perspectivas, cada uma otimizada para um tipo específico de tarefa cognitiva.
                </p>

                <div className="space-y-3">
                    <FeaturePoint 
                        icon={IconList}
                        title="Lista (List View)" 
                        desc="Clareza cirúrgica. Filtre o ruído, ordene por prioridade e edite propriedades em massa. Ideal para o modo 'Execução'." 
                    />
                    <FeaturePoint 
                        icon={IconMatrix}
                        title="Planilha (Sheet View)" 
                        desc="Densidade de dados. Gerencie orçamentos, métricas complexas e atributos personalizados como em um Excel, mas integrado." 
                    />
                    <FeaturePoint 
                        icon={IconFlux}
                        title="Kanban (Board View)" 
                        desc="Fluxo visual. Mova cards entre colunas para sentir o progresso tátil. Ideal para criativos e gestores de status." 
                    />
                    <FeaturePoint 
                        icon={IconNexus}
                        title="Chain (Dependency View)" 
                        desc="Efeito Dominó. Visualize o que trava o quê. Entenda a sequência lógica e dependências antes de agir." 
                    />
                    <FeaturePoint 
                        icon={IconMap}
                        title="Mind Map (Graph View)" 
                        desc="Conexão neural. Quebre a linearidade e veja como seus projetos e ideias se conectam em uma rede viva." 
                    />
                </div>
            </div>
        </div>

                {/* 4. A FILOSOFIA IDE (Life Engineering) */}
        <div className="mb-40 max-w-5xl mx-auto text-center border-y border-[var(--glass-border)] py-20 bg-[var(--card-bg-solid)]/30 rounded-3xl">
             <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5">
                
             </div>
             
             <h3 className="text-3xl md:text-5xl serif-font text-[var(--text-primary)] mb-8 leading-tight">
                Por que parecemos um <br/>
                <span className="italic text-[var(--accent)]">Editor de Código?</span>
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto px-6">
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-3">
                        <IconTerminal className="w-4 h-4 text-[var(--accent)]" />
                        Eficiência de Teclado
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Desenvolvedores não usam o mouse. O Prana é feito para <strong>Power Users</strong> da vida. 
                        Comandos rápidos (Cmd+K), atalhos globais e navegação fluida. Menos cliques, mais fluxo.
                    </p>
                </div>
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-[var(--text-primary)] mb-3">
                        <IconLayout className="w-4 h-4 text-[var(--accent)]" />
                        Modularidade Total
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Sua vida é um sistema complexo. Assim como uma IDE (VS Code), oferecemos painéis laterais colapsáveis, terminais de comando (Ash) e áreas de trabalho limpas.
                    </p>
                </div>
             </div>
        </div>

      </div>
    </section>
  );
};

export default SectionShow;
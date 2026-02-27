import React from 'react';
import { 
  IconDashboard, IconSoul, IconFilter, IconSankalpa, IconFogo, 
  IconDone, IconCronos, IconFlux, IconCheckCircle, IconZap, 
  IconMatrix, IconCosmos, IconSun, IconLua
} from "../../components/icons/PranaLandscapeIcons";

// --- DEMO: HOLISTIC DASHBOARD (NEW) ---
const LiveDemoDashboard = () => {
    return (
        <div className="w-full h-[600px] bg-[var(--bg-color)] rounded-xl border border-[var(--glass-border)] overflow-hidden flex flex-col shadow-2xl relative font-sans text-sm">
            {/* 1. Header (Top Bar) */}
            <div className="h-16 border-b border-[var(--glass-border)] flex items-center justify-between px-6 bg-[var(--bg-color)]/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--text-primary)]/5 flex items-center justify-center text-[var(--text-secondary)] border border-[var(--glass-border)] shadow-sm">
                        <IconDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-wide uppercase">Santuário</h3>
                        <p className="text-[10px] text-[var(--text-secondary)]">Bom dia, Viajante</p>
                    </div>
                </div>
                
                {/* Right Header Stats */}
                <div className="flex items-center gap-6">
                     <div className="hidden md:flex flex-col items-end">
                         <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">
                             <IconSoul className="w-3 h-3" /> Prana Level
                         </div>
                         <div className="flex items-end gap-1">
                             <span className="text-2xl font-serif text-[var(--text-primary)] leading-none opacity-80">85%</span>
                             <div className="w-24 h-1.5 bg-[var(--glass-border)] rounded-full mb-1 overflow-hidden">
                                 <div className="h-full w-[85%] bg-[var(--text-secondary)]"></div>
                             </div>
                         </div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-[var(--text-primary)]/10 overflow-hidden border border-[var(--glass-border)] grayscale opacity-80">
                         <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Prana" alt="User" />
                     </div>
                </div>
            </div>

            {/* 2. Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 prana-scrollbar relative">
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: "radial-gradient(#999 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>
                
                {/* ROW 1: Astral Context & Controls */}
                <div className="flex flex-col md:flex-row gap-4 relative z-10">
                     {/* Ceu Agora (Mock) */}
                     <div className="flex-1 bg-[var(--card-bg-solid)]/60 border border-[var(--glass-border)] rounded-xl p-4 flex items-center gap-4">
                         <div className="flex items-center gap-2">
                             <div className="flex items-center justify-center text-[var(--accent)]" title="Sol em Capricórnio">
                                 <IconSun className="w-6 h-6" />
                             </div>
                             <div className="flex items-center justify-center text-[var(--accent)] opacity-70" title="Lua em Touro">
                                 <IconCronos className="w-5 h-5" />
                             </div>
                         </div>
                         <div>
                             <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Céu Agora</h4>
                             <p className="text-[11px] text-[var(--text-secondary)]">Sol em Capricórnio • Lua Crescente</p>
                         </div>
                     </div>

                     {/* Quick Actions */}
                     <div className="flex gap-2">
                         <button className="h-full px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--card-bg-solid)]/60 text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)] transition-all flex flex-col items-center justify-center gap-1 min-w-[80px]">
                             <IconSoul className="w-4 h-4" />
                             <span className="text-[10px] font-bold">Check-in</span>
                         </button>
                         <button className="h-full px-4 rounded-xl border border-[var(--glass-border)] bg-[var(--card-bg-solid)]/60 text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)] transition-all flex flex-col items-center justify-center gap-1 min-w-[80px]">
                             <IconFilter className="w-4 h-4" />
                             <span className="text-[10px] font-bold">Filtros</span>
                         </button>
                     </div>
                </div>

                {/* ROW 2: Main Grid */}
                <div className="grid grid-cols-12 gap-4 relative z-10">
                    {/* LEFT COL (8/12) */}
                    <div className="col-span-12 md:col-span-8 space-y-4">
                        
                        {/* Sankalpa Card */}
                        <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-2xl p-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                 <IconSankalpa className="w-32 h-32 text-[var(--text-primary)] transform rotate-12" />
                             </div>
                             <div className="relative z-10">
                                 <div className="flex items-center gap-2 mb-3 text-[var(--text-secondary)]">
                                     <IconSankalpa className="w-3 h-3" />
                                     <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Intenção do Dia</span>
                                 </div>
                                 <h2 className="text-xl md:text-2xl font-serif text-[var(--text-primary)] italic leading-relaxed opacity-90">
                                     "A disciplina é a forma mais alta de amor próprio. Mantenha o foco na construção."
                                 </h2>
                             </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Energy Stats */}
                            <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Energia Vital</span>
                                    <IconFogo className="w-3 h-3 text-[var(--text-secondary)]" />
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-[10px] mb-1 text-[var(--text-secondary)]"><span>Físico</span> <span>80%</span></div>
                                        <div className="h-px bg-[var(--glass-border)] w-full overflow-hidden"><div className="h-full w-[80%] bg-[var(--text-primary)] opacity-50"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] mb-1 text-[var(--text-secondary)]"><span>Mental</span> <span>65%</span></div>
                                        <div className="h-px bg-[var(--glass-border)] w-full overflow-hidden"><div className="h-full w-[65%] bg-[var(--text-primary)] opacity-50"></div></div>
                                    </div>
                                </div>
                            </div>

                            {/* Rituals Stats */}
                            <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Rituais</span>
                                    <IconDone className="w-3 h-3 text-[var(--text-secondary)]" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-serif text-[var(--text-primary)]">3<span className="text-sm text-[var(--text-secondary)] font-sans">/5</span></div>
                                    <div className="text-[10px] text-[var(--text-secondary)] leading-tight">
                                        Rituais completados<br/>hoje. Continue assim.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Projects List */}
                        <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--glass-border)]">
                                <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Projetos Ativos</span>
                                <IconSankalpa className="w-3 h-3 text-[var(--text-secondary)]" />
                            </div>
                            <div className="space-y-3">
                                {[
                                    {name: "Lançamento V3.0", progress: 75},
                                    {name: "Marketing Q1", progress: 30},
                                    {name: "Finanças Anuais", progress: 90}
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 group cursor-pointer hover:bg-[var(--bg-color)]/50 p-2 rounded-lg transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-50"></div>
                                        <span className="text-xs font-medium text-[var(--text-primary)] flex-1 opacity-90">{p.name}</span>
                                        <div className="w-24 flex items-center gap-2">
                                            <div className="flex-1 h-px bg-[var(--glass-border)] w-full block">
                                                <div className="h-full bg-[var(--text-primary)] opacity-50" style={{width: `${p.progress}%`}}></div>
                                            </div>
                                            <span className="text-[9px] w-6 text-right text-[var(--text-secondary)]">{p.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL (4/12) */}
                    <div className="col-span-12 md:col-span-4 space-y-4">
                        {/* Upcoming Events */}
                        <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)] opacity-80">
                                <IconCronos className="w-3 h-3" /> 
                                <span className="text-[9px] font-bold uppercase">Agenda</span>
                            </div>
                            <div className="space-y-3 relative">
                                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[var(--glass-border)]"></div>
                                {[ 
                                  {time: '10:00', title: 'Deep Work Block'},
                                  {time: '14:00', title: 'Review Semanal'},
                                  {time: '16:30', title: 'Yoga'}
                                ].map((evt, i) => (
                                    <div key={i} className="flex gap-3 relative pl-4">
                                        <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border border-[var(--text-secondary)] bg-[var(--bg-color)]"></div>
                                        <div>
                                            <div className="text-[10px] text-[var(--text-secondary)] font-mono">{evt.time}</div>
                                            <div className="text-xs font-medium text-[var(--text-primary)] opacity-90">{evt.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Routines */}
                        <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)] opacity-80">
                                <IconFlux className="w-3 h-3" /> 
                                <span className="text-[9px] font-bold uppercase">Rotinas</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 p-2 bg-[var(--bg-color)]/50 rounded-lg border border-[var(--glass-border)]">
                                    <IconCheckCircle className="w-4 h-4 text-[var(--text-secondary)] opacity-50" />
                                    <span className="text-[10px] line-through opacity-50 text-[var(--text-secondary)]">Morning Pages</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-[var(--card-bg-solid)] rounded-lg border border-[var(--glass-border)]">
                                    <div className="w-4 h-4 rounded border border-[var(--text-secondary)]/30"></div>
                                    <span className="text-[10px] text-[var(--text-primary)] opacity-90">Leitura 30min</span>
                                </div>
                            </div>
                        </div>

                        {/* Match/Suggestion */}
                        <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                                <IconZap className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase">Sintonia</span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-[var(--text-secondary)]">
                                Sua energia mental (65%) está ótima para <strong className="text-[var(--text-primary)]">Planejamento</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 3. Footer Status Bar */}
            <div className="h-8 bg-[var(--bg-color)]/80 border-t border-[var(--glass-border)] flex items-center justify-between px-4 text-[9px] text-[var(--text-secondary)] z-20">
                 <div className="flex gap-4">
                     <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> System Online</span>
                     <span>Last sync: Just now</span>
                 </div>
                 <div className="opacity-50 hover:opacity-100 cursor-pointer">
                     Customize Layout
                 </div>
            </div>
        </div>
    );
};

export default LiveDemoDashboard;
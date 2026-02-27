import React, { useState } from "react";
import { 
  IconCloud, IconFlux, IconMatrix, IconCosmos, IconNeural, IconLink,
  IconSettings, IconFolder, IconHash, IconSearch, IconDashboard, IconPapyrus,
  IconList, IconColetivo, IconArrowRight, IconMenu, IconX, IconLogOut,
  IconChevronDown, IconTrash, IconChat, IconPaperclip, IconSend, IconGitBranch,
  IconAlert, IconCheckCircle, IconSankalpa, IconCronos
} from "../../components/icons/PranaLandscapeIcons";

const LiveDemoViews = () => {
  const [activeView, setActiveView] = useState('kanban');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
      { role: 'ash', text: 'Analisei seu fluxo. Você tem 3 tarefas prioritárias.' },
      { role: 'ash', text: 'Quer que eu inicie o protocolo de foco?' }
  ]);

  // Sidebar Button Replica (Matches Orbit Layout)
  const SidebarBtn = ({ icon: Icon, active, onClick, className }) => (
      <button 
        onClick={onClick}
        className={`w-10 h-10 rounded-md flex items-center justify-center transition-all relative group ${active ? 'text-white bg-[var(--accent)]/20 shadow-sm border border-[var(--accent)]/40' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5'} ${className}`}
      >
          <Icon className={`w-6 h-6 transition-colors ${active ? 'text-[var(--accent)]' : ''}`} />
          {active && <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-[var(--accent)] rounded-r-full shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]" />}
      </button>
  );

  const explorerFiles = [
    { name: 'src', type: 'folder', open: true, icon: IconCloud, children: [
       { name: 'views', type: 'folder', open: true, icon: IconCloud, children: [
          { name: 'KanbanBoard.jsx', id: 'kanban', icon: IconFlux },
          { name: 'DataGrid.tsx', id: 'grid', icon: IconMatrix },
          { name: 'Calendar.js', id: 'cal', icon: IconCosmos },
          { name: 'MindMap.json', id: 'map', icon: IconNeural }
       ]}
    ]},
    { name: 'package.json', type: 'file', icon: IconSettings },
  ];

  const renderContent = () => {
      switch(activeView) {
          case 'kanban': 
            return (
                <div className="flex gap-4 p-6 overflow-x-auto h-full items-start">
                  {['To Do', 'Doing', 'Done'].map((col, i) => (
                    <div key={i} className="flex-shrink-0 w-60 flex flex-col gap-3">
                      <div className="flex items-center justify-between px-1 mb-1">
                         <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{col}</h4>
                         <span className="text-[10px] opacity-50 bg-[var(--text-primary)]/5 px-2 rounded-full text-[var(--text-primary)]">3</span>
                      </div>
                      <div className="p-3 bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-sm hover:border-[var(--accent)]/50 transition-colors group cursor-move shadow-sm relative">
                          <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-[var(--accent)] opacity-50 rounded-r"></div>
                          <div className="pl-2">
                              <div className="flex justify-between items-start mb-2">
                                 <span className="px-1.5 py-0.5 rounded text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] font-bold uppercase tracking-wider">Design</span>
                              </div>
                              <div className="text-xs font-medium text-[var(--text-primary)] mb-2 leading-relaxed">
                                 {col === 'Doing' ? 'Refinar Paleta de Cores UI' : 'Definir Arquitetura de DB'}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                 <div className="flex -space-x-1.5">
                                    <div className="w-4 h-4 rounded-full bg-zinc-500 border border-[var(--card-bg-solid)] opacity-50"></div>
                                 </div>
                                 <span className="text-[9px] text-[var(--text-secondary)]">#PRJ-{10+i}</span>
                              </div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
            );
          case 'grid': 
             return (
                <div className="p-0 h-full overflow-hidden flex flex-col font-mono text-xs">
                    <div className="flex border-b border-[var(--glass-border)] bg-[var(--bg-color)] text-[var(--text-secondary)] p-2">
                        <div className="w-8">#</div><div className="w-1/3">TASK</div><div className="w-32">STATUS</div>
                    </div>
                    {[1,2,3].map(i => (
                        <div key={i} className="flex border-b border-[var(--glass-border)] p-2 hover:bg-[var(--accent)]/5 text-[var(--text-primary)]">
                            <div className="w-8 opacity-50">{i}</div>
                            <div className="w-1/3">Refactor Core Loops</div>
                            <div className="w-32 text-green-400">Active</div>
                        </div>
                    ))}
                </div>
             );
          case 'cal':
             return (
                <div className="p-6 h-full flex flex-col bg-[var(--bg-color)]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] font-serif">January 2026</h3>
                      <div className="flex gap-2">
                          <div className="px-2 py-1 bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded text-xs text-[var(--text-secondary)]">Month</div>
                          <div className="px-2 py-1 bg-[var(--accent)] text-white rounded text-xs">Week</div>
                      </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 flex-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">{d}</div>
                    ))}
                    {Array(35).fill(null).map((_, i) => {
                      const day = (i % 31) + 1;
                      const hasTask = [5, 12, 19, 26].includes(day);
                      const isToday = day === 15;
                      return (
                        <div key={i} className={`rounded p-1 border ${isToday ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--glass-border)] bg-[var(--card-bg-solid)]'} relative min-h-[50px] hover:border-[var(--accent)]/30 transition-colors`}>
                          <span className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-[var(--accent)] text-white font-bold' : 'text-[var(--text-secondary)]'}`}>{day}</span>
                          {hasTask && <div className="mt-1 h-1 w-8 bg-[var(--accent)] rounded-full opacity-50"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
             );
          case 'map':
             return (
                <div className="p-6 h-full relative overflow-hidden bg-[var(--bg-color)] font-sans">
                  <div className="absolute inset-0 opacity-10" 
                       style={{backgroundImage: 'radial-gradient(circle, var(--text-primary) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <div className="relative">
                         <div className="relative z-10 px-6 py-3 bg-[var(--accent)] text-white rounded-lg text-xs font-bold shadow-lg border border-[var(--accent)]/50 ring-4 ring-[var(--accent)]/10">
                            Prana System V3.0
                         </div>
                         <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] pointer-events-none stroke-[var(--text-secondary)]" style={{zIndex:0}}>
                             <path d="M 300 250 L 150 150" fill="none" strokeWidth="1.5" />
                             <path d="M 300 250 L 450 150" fill="none" strokeWidth="1.5" />
                             <path d="M 300 250 L 150 350" fill="none" strokeWidth="1.5" />
                             <path d="M 300 250 L 450 350" fill="none" strokeWidth="1.5" />
                         </svg>
                         {[
                           { t: 'Database', x: -150, y: -100, i: IconMatrix },
                           { t: 'Ash Intelligence', x: 150, y: -100, i: IconSankalpa },
                           { t: 'Frontend Views', x: -150, y: 100, i: IconFlux },
                           { t: 'Deployment', x: 150, y: 100, i: IconCloud }
                         ].map((node, idx) => (
                            <div key={idx} className="absolute px-3 py-2 bg-[var(--card-bg-solid)] border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors rounded text-[10px] text-[var(--text-primary)] whitespace-nowrap flex items-center gap-2 shadow-sm" 
                                 style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
                                <node.i className="w-3 h-3 text-[var(--accent)]" />
                                {node.t}
                            </div>
                         ))}
                     </div>
                  </div>
                </div>
             );
          default: return null;
      }
  }

  return (
    <div className="w-full h-[650px] rounded-xl overflow-hidden shadow-2xl flex border border-[var(--glass-border)] bg-[var(--bg-color)] font-sans text-sm text-[var(--text-secondary)] relative group">
       
       {/* 1. SIDEBAR (MATCHES SIDEBAR.JSX) */}
       <div className="w-16 bg-[var(--bg-color)] backdrop-blur-xl flex flex-col items-center py-3 gap-3 border-r border-[var(--glass-border)] z-20">
           {/* Manifest Button */}
           <div className="border-b border-[var(--glass-border)] pb-3 w-full flex justify-center mb-1">
               <button className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
                   <IconSankalpa className="w-6 h-6" />
               </button>
           </div>
           
           {/* Primary Navigation */}
           <SidebarBtn icon={IconFolder} active={true} />
           <SidebarBtn icon={IconHash} />
           <SidebarBtn icon={IconSearch} />
           <div className="w-8 h-[1px] bg-[var(--text-primary)]/10 my-1 opacity-20" />
           <SidebarBtn icon={IconDashboard} />
           <SidebarBtn icon={IconCronos} />
           <SidebarBtn icon={IconCosmos} />
           <SidebarBtn icon={IconPapyrus} />
           
           <div className="w-6 h-[1px] bg-[var(--text-primary)]/10 my-1 opacity-20" />
           
           <SidebarBtn icon={IconList} />
           <SidebarBtn icon={IconColetivo} />
           <SidebarBtn icon={IconNeural} />

           {/* Footer */}
           <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-[var(--glass-border)] w-full items-center">
               <SidebarBtn icon={IconSettings} />
               <SidebarBtn icon={IconLogOut} className="hover:text-red-400 hover:bg-red-500/10" />
           </div>
       </div>

       {/* 2. EXPLORER PANEL */}
       <div className="w-60 bg-[var(--bg-color)] flex flex-col border-r border-[var(--glass-border)] hidden md:flex">
           <div className="h-10 px-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--glass-border)]">
               <span>Explorer</span>
               <IconMenu className="w-4 h-4 opacity-50" />
           </div>
           <div className="flex-1 overflow-y-auto pt-2">
               <div className="px-4 text-[11px] font-bold text-blue-400 mb-1 flex items-center gap-1">
                   <IconArrowRight className="w-3 h-3 rotate-90" /> PRANA-WORKSPACE
               </div>
               <div className="pl-4 space-y-0.5">
                   {explorerFiles.map((f, i) => (
                       <div key={i}>
                           <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-[var(--text-primary)]/5 cursor-pointer text-[var(--text-primary)]">
                               <IconArrowRight className={`w-3 h-3 opacity-70 ${f.type === 'folder' ? 'rotate-90' : 'invisible'}`} />
                               <f.icon className={`w-3.5 h-3.5 ${f.type === 'folder' ? 'text-blue-300' : 'text-gray-400'} opacity-80`} />
                               <span className="text-[12px]">{f.name}</span>
                           </div>
                           {f.children && (
                               <div className="pl-4 border-l border-[var(--glass-border)] ml-3 mt-0.5 space-y-0.5">
                                   {f.children.map((child, j) => (
                                     <div key={j}>
                                        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-[var(--text-primary)]/5 cursor-pointer text-[var(--text-secondary)]">
                                            <IconArrowRight className={`w-3 h-3 opacity-70 ${child.type === 'folder' ? 'rotate-90' : 'invisible'}`} />
                                            <child.icon className={`w-3.5 h-3.5 ${child.type === 'folder' ? 'text-blue-300' : 'text-gray-400'} opacity-80`} />
                                            <span className="text-[12px]">{child.name}</span>
                                        </div>
                                        {child.children && (
                                            <div className="pl-4 border-l border-[var(--glass-border)] ml-3 mt-0.5">
                                                {child.children.map((leaf, k) => (
                                                    <div 
                                                        key={k} 
                                                        onClick={() => setActiveView(leaf.id)}
                                                        className={`flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-colors ${leaf.id === activeView ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium' : 'hover:bg-[var(--text-primary)]/5 text-[var(--text-secondary)]'}`}
                                                    >
                                                        <leaf.icon className={`w-3.5 h-3.5 ${leaf.id === activeView ? 'text-[var(--accent)]' : 'opacity-70'}`} />
                                                        <span className="text-[12px]">{leaf.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                     </div>
                                   ))}
                               </div>
                           )}
                       </div>
                   ))}
               </div>
           </div>
       </div>

       {/* 3. MAIN EDITOR AREA */}
       <div className="flex-1 flex flex-col bg-[var(--bg-color)] relative min-w-0">
           {/* Tab Bar */}
           <div className="h-9 bg-[var(--bg-color)] flex items-end overflow-x-auto no-scrollbar border-b border-[var(--glass-border)]">
                <div className={`h-full px-4 flex items-center gap-2 border-r border-[var(--glass-border)] bg-[var(--bg-color)] text-[var(--text-primary)] border-t-2 border-t-[var(--accent)]`}>
                    <IconFlux className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="text-[12px]">KanbanBoard.jsx</span>
                    <IconX className="w-3 h-3 opacity-50 hover:opacity-100 ml-2" />
                </div>
                <div className={`h-full px-4 flex items-center gap-2 border-r border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5`}>
                    <IconMatrix className="w-3.5 h-3.5 opacity-50" />
                    <span className="text-[12px]">DataGrid.tsx</span>
                    <IconX className="w-3 h-3 opacity-0 group-hover:opacity-50 ml-2" />
                </div>
           </div>
           {/* Breadcrumbs */}
           <div className="h-8 bg-[var(--bg-color)] flex items-center px-4 gap-2 text-[11px] text-[var(--text-secondary)] opacity-70">
               <span>src</span> <IconArrowRight className="w-2 h-2" />
               <span>views</span> <IconArrowRight className="w-2 h-2" />
               <span className="text-[var(--text-primary)]">KanbanBoard.jsx</span>
           </div>
           {/* Content */}
           <div className="flex-1 overflow-hidden relative bg-[var(--bg-color)]">
               {renderContent()}
           </div>
       </div>

       {/* 4. SIDE CHAT (SIDECHAT.JSX REPLICA) */}
       {isChatOpen && (
           <div className="w-80 bg-[var(--bg-color)] backdrop-blur-xl border-l border-[var(--glass-border)] flex flex-col hidden lg:flex">
               {/* Header Agent Selector */}
               <div className="h-14 border-b border-[var(--glass-border)] flex items-center justify-between px-4 bg-[var(--text-primary)]/5">
                   <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] bg-[var(--card-bg-solid)] border border-[var(--glass-border)] px-3 py-1.5 rounded-lg shadow-sm">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                       Ash Intelligence
                       <IconChevronDown className="w-3 h-3 opacity-50 ml-1" />
                   </div>
                   <div className="flex items-center gap-1">
                       <button className="hover:bg-[var(--text-primary)]/10 p-1.5 rounded transition-colors text-[var(--text-secondary)]"><IconSearch className="w-4 h-4" /></button>
                       <button onClick={() => setChatMessages([])} className="hover:bg-red-500/10 hover:text-red-500 p-1.5 rounded transition-colors text-[var(--text-secondary)]"><IconTrash className="w-4 h-4" /></button>
                   </div>
               </div>

               {/* Messages Area (FIDELITY V6 - ASH ICON CHAT ONLY) */}
               <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {chatMessages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-30 gap-2">
                             <IconChat className="w-10 h-10" />
                             <span className="text-[10px] uppercase tracking-widest">Neural Link Active</span>
                        </div>
                    )}
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {/* Avatar - Only for Ash */}
                            {msg.role === 'ash' && (
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--glass-border)] shadow-sm bg-transparent text-[var(--accent)]">
                                        <IconChat className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                            
                            {/* Message Bubble */}
                            <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                                <div className={`flex items-center gap-2 text-[10px] font-bold opacity-50 uppercase tracking-wider`}>
                                    {msg.role === 'ash' ? 'Sankalpa Intelligence' : 'You'}
                                </div>
                                <div className={`p-3 text-xs leading-relaxed border border-[var(--glass-border)] shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-transparent text-[var(--text-primary)] rounded-2xl rounded-tr-sm' 
                                    : 'bg-transparent text-[var(--text-primary)] rounded-2xl rounded-tl-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Interactive Prompt Example */}
                    <div className="flex justify-end group cursor-pointer" onClick={() => setChatMessages(prev => [...prev, {role:'user', text:'Mostre as tarefas pendentes.'}])}>
                         <div className="space-y-1 max-w-[80%] items-end flex flex-col">
                             <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider">You</div>
                             <div className="p-3 text-xs leading-relaxed border border-[var(--accent)]/30 text-[var(--accent)] rounded-2xl rounded-tr-sm bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-colors">
                                 Mostre as tarefas pendentes.
                             </div>
                         </div>
                    </div>
               </div>

               {/* Input Area */}
               <div className="p-4 pb-6 space-y-3 bg-[var(--bg-color)] border-t border-[var(--glass-border)]">
                   <div className="flex items-center gap-2">
                       <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-[var(--text-primary)]/5 text-[var(--text-secondary)]">
                           <IconPaperclip className="w-4 h-4" />
                       </button>
                       <div className="flex-1 relative">
                           <input 
                             type="text" 
                             placeholder="Comando Neural..." 
                             className="w-full bg-[var(--text-primary)]/5 border border-[var(--glass-border)] rounded-2xl h-10 px-4 text-sm focus:outline-none focus:border-[var(--accent)]/50 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
                           />
                       </div>
                       <button className="h-10 w-10 rounded-full bg-[var(--accent)] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                           <IconSend className="w-4 h-4" />
                       </button>
                   </div>
               </div>
           </div>
       )}
       
       {/* 4. STATUS BAR (BOTTOM) */}
       <div className="absolute bottom-0 w-full h-6 bg-[var(--accent)] text-white text-[10px] flex items-center px-3 justify-between z-30">
           <div className="flex items-center gap-4">
               <div className="flex items-center gap-1"><IconGitBranch className="w-3 h-3" /> main*</div>
               <div className="flex items-center gap-1"><IconAlert className="w-3 h-3" /> 0 errors</div>
           </div>
           <div className="flex items-center gap-4">
               <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-2 rounded" onClick={() => setIsChatOpen(!isChatOpen)}>
                   <IconChat className="w-3 h-3" /> Chat
               </div>
               <span>Ln 12, Col 42</span>
               <span>UTF-8</span>
               <span>JavaScript React</span>
               <div className="flex items-center gap-1"><IconCheckCircle className="w-3 h-3" /> Prettier</div>
           </div>
       </div>
    </div>
  );
};

export default LiveDemoViews;
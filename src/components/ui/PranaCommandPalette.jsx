/* src/components/ui/PranaCommandPalette.jsx
   desc: Cérebro de Navegação V10 (Ontology-Native).
   feat: Busca Hierárquica (Pai-Filho), Facetas por Entidade e Linhagem Visual.
*/
import React, { useEffect, useState, useRef, useMemo } from "react";
import { 
    Command, CommandGroup, CommandInput, CommandItem, 
    CommandList, CommandSeparator, CommandEmpty 
} from "@/components/ui/command";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { VIEW_TYPES } from "@/config/viewTypes";
import { cn } from "@/lib/utils";

// Ícones Oficiais do Sistema
import { 
    IconDashboard, IconCosmos, IconList, IconSettings, IconZap,
    IconFolder, IconFileText, IconSearch, IconTarget, 
    IconLayers, IconHash, IconChevronRight 
} from "@/components/icons/PranaLandscapeIcons";

// Mapeamento de Entidades V10
const ENTITIES = {
    REALM: { label: 'Reinos', icon: IconHash, color: 'text-amber-500' },
    PROJECT: { label: 'Projetos', icon: IconLayers, iconColor: 'text-purple-400' },
    FOLDER: { label: 'Pastas', icon: IconFolder, color: 'text-blue-400' },
    DOCUMENT: { label: 'Documentos', icon: IconFileText, color: 'text-zinc-400' },
    TASK: { label: 'Tarefas', icon: IconTarget, color: 'text-emerald-400' },
    CHECKLIST: { label: 'Checklist', icon: IconList, color: 'text-rose-400' }
};

export function PranaCommandPalette({ className, searchData = [] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFacet, setActiveFacet] = useState('all');
  const { openTab } = useWorkspaceStore();
  const containerRef = useRef(null);

  // 1. Atalhos Globais
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 2. Lógica de Filtragem com Herança (Pai-Filho)
  const groupedResults = useMemo(() => {
    let items = searchData;

    if (activeFacet !== 'all') {
      items = items.filter(item => item.entityType === activeFacet);
    }

    if (query) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.parentName?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Agrupa pelas Entidades Exatas
    return items.reduce((acc, item) => {
      const group = item.entityType || 'OTHER';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  }, [query, activeFacet, searchData]);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <div ref={containerRef} className={cn("relative z-50 w-[220px]", className)}>
      <Command 
        className={cn(
            "rounded-xl border border-white/10 bg-background/20 backdrop-blur-md transition-all overflow-visible",
            open && "bg-[#0B0E14] border-indigo-500/30 ring-1 ring-indigo-500/20 shadow-2xl w-[480px]" 
        )}
      >
        {/* BUSCA PRINCIPAL */}
        <div className="flex items-center px-3 py-2 cursor-text w-full" onClick={() => setOpen(true)}>
            <div className="flex-1 flex items-center gap-2"> 
                <IconSearch className={cn("w-3.5 h-3.5", open ? "text-indigo-400" : "text-zinc-500")} />
                <CommandInput 
                    placeholder="Navegar no Enxame..."
                    value={query}
                    onValueChange={setQuery}
                    className="h-8 border-0 bg-transparent focus:ring-0 text-xs w-full p-0 shadow-none"
                />
            </div>
            {!open && <span className="opacity-40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono ml-2">⌘K</span>}
        </div>

        {open && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full rounded-2xl border border-white/10 bg-[#0B0E14]/98 backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden z-50">
                
                {/* BARRA DE FACETAS (ENTIDADES REAIS) */}
                <div className="flex gap-1 p-2 bg-white/[0.02] border-b border-white/5 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveFacet('all')}
                        className={cn("px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase", activeFacet === 'all' ? "bg-white/10 text-white" : "text-zinc-500")}
                    >Tudo</button>
                    {Object.entries(ENTITIES).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveFacet(key)}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all",
                                activeFacet === key ? "bg-indigo-500/20 text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <config.icon className="w-3 h-3" />
                            {config.label}
                        </button>
                    ))}
                </div>

                <CommandList className="prana-scrollbar max-h-[400px] py-2">
                    <CommandEmpty className="py-12 text-center opacity-30 text-xs italic">Nenhum rastro encontrado nesta frequência.</CommandEmpty>

                    {/* RENDERIZAÇÃO POR HIERARQUIA DE ENTIDADES */}
                    {Object.entries(groupedResults).map(([entityType, items]) => (
                        <CommandGroup 
                            key={entityType} 
                            heading={ENTITIES[entityType]?.label || entityType}
                            className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4 mb-2"
                        >
                            {items.map(item => (
                                <CommandItem 
                                    key={item.id} 
                                    onSelect={() => runCommand(() => item.onAction())}
                                    className="cursor-pointer rounded-xl px-3 py-2.5 mb-1 aria-selected:bg-white/5 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={cn("p-2 rounded-lg bg-black/40 border border-white/5", ENTITIES[entityType]?.color)}>
                                            {React.createElement(ENTITIES[entityType]?.icon || IconFileText, { className: "w-3.5 h-3.5" })}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-zinc-200 truncate">{item.name}</span>
                                            {/* LINHAGEM PAI-FILHO (BREADCRUMBS) */}
                                            {item.parentName && (
                                                <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-medium">
                                                    <span>{item.rootName}</span>
                                                    <IconChevronRight className="w-2 h-2 opacity-30" />
                                                    <span className="truncate">{item.parentName}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Badge de Status/Contexto (Opcional) */}
                                    {item.status && (
                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 opacity-0 group-aria-selected:opacity-100 transition-opacity">
                                            {item.status}
                                        </span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))}
                </CommandList>

                {/* FOOTER INFORMATIVO */}
                <div className="px-4 py-2 bg-indigo-500/[0.02] border-t border-white/5 flex items-center justify-between text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                    <div className="flex gap-4">
                        <span>↑↓ Navegar</span>
                        <span>↵ Selecionar</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400/50">
                        <span>Prana Swarm Index</span>
                        <IconZap className="w-2.5 h-2.5" />
                    </div>
                </div>
            </div>
        )}
      </Command>
    </div>
  );
}
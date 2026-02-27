/* src/components/nexus/NexusExplorer.jsx
   desc: Explorador de Entidades V10 (Multiverse Edition).
   feat: Filtragem Recursiva, Context Menu, Framer Motion e Realm Icons.
*/
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

// Ícones Oficiais do Landscape Prana
import { 
  ChevronRight, Search, IconLayers, IconHash, IconZap, IconBox,
  Folder, FolderOpen, FileText, IconTarget
} from '@/components/icons/PranaLandscapeIcons';

// Ferramentas de Monitorização
import WorkSessionTimer from '../tools/WorkSessionTimer';
import SessionMonitor from '../tools/SessionMonitor';
import NexusContextMenu from './NexusContextMenu';

// Sub-componente de Ícones com Identidade Visual V10
const EntityIcon = ({ type, isOpen, realmId }) => {
  const baseClass = "w-3.5 h-3.5 transition-all duration-500";
  const isProfessional = realmId === 'professional';
  
  // Cores desaturadas (Wabi-Sabi) para os universos
  const themeClass = isProfessional ? "text-indigo-400/70" : "text-emerald-400/70";

  switch (type) {
    case 'realm': return <IconHash className={cn(baseClass, "opacity-40")} />;
    case 'project': return <IconLayers className={cn(baseClass, themeClass)} />;
    case 'task': return <IconZap className={cn(baseClass, "text-amber-400/60")} />;
    case 'folder': 
      return isOpen 
        ? <FolderOpen className={cn(baseClass, "text-white/80")} /> 
        : <Folder className={cn(baseClass, "opacity-40")} />;
    case 'document': return <FileText className={cn(baseClass, "opacity-40")} />;
    default: return <IconBox className={cn(baseClass, "opacity-20")} />;
  }
};

// Componente Recursivo de Nó da Árvore
const TreeNode = ({ node, level, onContextMenu, activeRealmId }) => {
  const [isOpen, setIsOpen] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;

  // Se o nó tem um Realm diferente do ativo (e não estamos em 'all'), ele é podado
  if (activeRealmId !== 'all' && node.realmId && node.realmId !== activeRealmId) {
    return null;
  }

  return (
    <div className="relative">
      <div 
        className={cn(
          "group flex items-center gap-2 py-1.5 px-4 cursor-pointer transition-all duration-200",
          node.type === 'realm' ? "mt-5 mb-1 opacity-100" : "hover:bg-white/[0.03] active:bg-white/[0.05]"
        )}
        style={{ paddingLeft: `${level * 12 + 16}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, node); }}
      >
        <span className="w-3 flex items-center justify-center">
          {hasChildren && node.type !== 'realm' && (
            <ChevronRight className={cn("w-2.5 h-2.5 opacity-20 transition-transform duration-300", isOpen && "rotate-90")} />
          )}
        </span>

        <EntityIcon type={node.type} isOpen={isOpen} realmId={node.realmId} />

        <span className={cn(
          "truncate flex-1 tracking-tight transition-colors",
          node.type === 'realm' 
            ? "text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500" 
            : "text-sm text-zinc-400 group-hover:text-zinc-100"
        )}>
          {node.name || node.title}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="overflow-hidden border-l border-white/5 ml-6"
          >
            {node.children.map(child => (
              <TreeNode 
                key={child.id} 
                node={child} 
                level={level + 1} 
                onContextMenu={onContextMenu}
                activeRealmId={activeRealmId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function NexusExplorer({ data = [], onAction }) {
  const { activeRealmId } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFacet, setActiveFacet] = useState('all');
  const [contextMenu, setContextMenu] = useState(null);

  // --- LÓGICA DE FILTRAGEM V10 ---
  const filteredData = useMemo(() => {
    const filterNode = (node) => {
      // 1. Match de Realm
      const matchesRealm = activeRealmId === 'all' || !node.realmId || node.realmId === activeRealmId;
      if (!matchesRealm) return null;

      // 2. Match de Busca e Faceta
      const name = (node.name || node.title || '').toLowerCase();
      const matchesQuery = name.includes(searchQuery.toLowerCase());
      const matchesFacet = activeFacet === 'all' || node.type === activeFacet;

      let filteredChildren = [];
      if (node.children) {
        filteredChildren = node.children.map(filterNode).filter(Boolean);
      }

      if ((matchesQuery && matchesFacet) || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };

    return data.map(filterNode).filter(Boolean);
  }, [searchQuery, activeFacet, activeRealmId, data]);

  return (
    <div className="h-full flex flex-col bg-zinc-950/10 select-none font-sans">
      <SessionMonitor />

      {/* Header do Explorer */}
      <div className="p-4 space-y-4 bg-white/[0.01] border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nexus Sync</span>
          </div>
          <WorkSessionTimer />
        </div>

        {/* Input Minimalista */}
        <div className="relative group">
          <Search className="w-3 h-3 absolute left-3 top-2.5 text-zinc-600 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Navegar no enxame..." 
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-zinc-300 focus:outline-none focus:border-white/10 transition-all placeholder:text-zinc-700"
          />
        </div>

        {/* Facetas de Filtro */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {['all', 'project', 'folder', 'task', 'document'].map(facet => (
            <button
              key={facet}
              onClick={() => setActiveFacet(facet)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all",
                activeFacet === facet 
                  ? "bg-white/10 text-white border border-white/10" 
                  : "text-zinc-600 hover:text-zinc-400 border border-transparent"
              )}
            >
              {facet === 'all' ? 'Tudo' : facet + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Entidades */}
      <div className="flex-1 overflow-y-auto prana-scrollbar py-2">
        {filteredData.length > 0 ? (
          filteredData.map(node => (
            <TreeNode 
              key={node.id} 
              node={node} 
              level={0} 
              onContextMenu={(e, n) => setContextMenu({ x: e.clientX, y: e.clientY, node: n })} 
              activeRealmId={activeRealmId}
            />
          ))
        ) : (
          <div className="p-12 text-center opacity-20 flex flex-col items-center">
            <IconBox className="w-8 h-8 mb-3 stroke-[1px]" />
            <p className="text-[10px] font-black uppercase tracking-widest">Dimensão Silenciosa</p>
          </div>
        )}
      </div>

      {/* Menu de Contexto V10 */}
      {contextMenu && (
        <NexusContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          targetNode={contextMenu.node} 
          onClose={() => setContextMenu(null)} 
          onAction={onAction}
        />
      )}
    </div>
  );
}
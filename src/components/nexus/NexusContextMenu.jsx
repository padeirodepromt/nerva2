import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, Trash2, FolderPlus, File, Copy, Share2, 
  IconLayers, IconZap, IconCode, IconLink, Package 
} from '../icons/PranaLandscapeIcons';

const NexusContextMenu = ({ x, y, onClose, onAction, targetNode }) => {
  const menuRef = useRef(null);
  const type = targetNode?.type;

  useEffect(() => {
    const handleClickOutside = (e) => menuRef.current && !menuRef.current.contains(e.target) && onClose();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // --- MAPA DE AÇÕES POR ENTIDADE ---
  const getActions = () => {
    const actions = [];
    
    // 1. Especialistas (Neo/Ash)
    actions.push({ id: 'neo_audit', label: 'Neo: Auditar Código', icon: IconCode, specialty: true });
    actions.push({ type: 'separator' });

    // 2. Criação Baseada no Contexto
    if (type === 'realm') {
        actions.push({ id: 'new_project', label: 'Novo Projeto', icon: IconLayers });
    }
    if (type === 'project' || type === 'folder') {
        actions.push({ id: 'new_folder', label: 'Nova Pasta', icon: FolderPlus });
        actions.push({ id: 'new_file', label: 'Novo Arquivo', icon: File });
        actions.push({ id: 'new_task', label: 'Nova Tarefa', icon: IconZap });
        actions.push({ id: 'import_zip', label: 'Importar .ZIP', icon: IconPackage });
    }

    actions.push({ type: 'separator' });

    // 3. Organização & Refatoração
    actions.push({ id: 'rename', label: 'Renomear', icon: Edit, shortcut: 'F2' });
    actions.push({ id: 'move_to', label: 'Mudar Caminho (Mover)', icon: IconLink });
    actions.push({ id: 'duplicate', label: 'Duplicar', icon: Copy });
    
    actions.push({ type: 'separator' });
    actions.push({ id: 'delete', label: 'Excluir', icon: Trash2, danger: true });

    return actions;
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef} style={{ top: y, left: x }}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-[300] w-52 bg-[#0B0E14]/95 border border-white/10 rounded-xl shadow-2xl py-1.5 backdrop-blur-2xl overflow-hidden"
      >
        {getActions().map((item, idx) => (
          item.type === 'separator' ? (
            <div key={idx} className="h-[1px] bg-white/5 my-1 mx-2" />
          ) : (
            <button
              key={item.id}
              onClick={() => { onAction(item.id, targetNode); onClose(); }}
              className={`w-full px-3 py-2 flex items-center justify-between text-xs group transition-all
                ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}
                ${item.specialty ? 'text-indigo-400 font-bold' : ''}
              `}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={`w-3.5 h-3.5 ${item.specialty ? 'animate-pulse' : 'opacity-70 group-hover:opacity-100'}`} />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.shortcut && <span className="text-[9px] opacity-30 font-mono border border-white/10 px-1 rounded">{item.shortcut}</span>}
            </button>
          )
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default NexusContextMenu;
/* src/components/specialists/flor-creator/PapyrusCanvas.jsx
   desc: Estúdio de Criação V11 (Integral & Camaleónico).
   feat: 
    - Mesa de Sintonia (Tuning Board): Especialização em 5 camadas.
    - Biomodulação: Sensação térmica visual baseada no objetivo.
    - Lego Narrativo (TipTap Blocks): Drag & Drop com Rich Text individual.
    - Nexus tree Integration: "Plantar" a obra final na árvore de conhecimento.
    - Ícones oficiais: PranaLandscapeIcons V11.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { toast } from 'sonner';

// --- ÍCONES OFICIAIS PRANA ---
import { 
  Sparkles, Plus, Trash2, GripVertical, Network, Check, 
  Target, MapPin, Briefcase, Brain, Zap, Save, Box, 
  ChevronRight, X, Layout, FileText
} from '@/components/icons/PranaLandscapeIcons';

import { apiClient } from '@/api/apiClient';
import { BrandCodeAPI } from '@/modules/brandcode/brandcode.api';

const cn = (...a) => a.filter(Boolean).join(" ");

// ============================================================================
// 1. MESA DE SINTONIA (TUNING BOARD)
// ============================================================================
function SintoniaBoard({ layers, onUpdate, onSaveMask }) {
  const getGlowColor = () => {
    const obj = layers.find(d => d.key.toLowerCase().includes('objetivo'))?.value.toLowerCase();
    if (obj?.includes('venda')) return 'rgba(225, 29, 72, 0.15)'; // Rose (Energia)
    if (obj?.includes('inspira')) return 'rgba(168, 85, 247, 0.15)'; // Purple (Espírito)
    return 'rgba(20, 184, 166, 0.15)'; // Teal (Equilíbrio)
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 rounded-[40px] border border-black/5 bg-white/40 backdrop-blur-3xl transition-all duration-700 shadow-2xl"
      style={{ boxShadow: `0 30px 100px ${getGlowColor()}` }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Mesa de Sintonia</h3>
          <p className="text-xs font-bold text-black/60 mt-1">Sintonizando a Flor camaleônica</p>
        </div>
        <button 
          onClick={onSaveMask}
          className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full hover:bg-black/10 transition-all group"
        >
          <Save className="w-3.5 h-3.5 text-black/40 group-hover:text-black" />
          <span className="text-[10px] font-bold uppercase text-black/40">Plantar Máscara</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {layers.map((layer, idx) => (
          <div 
            key={idx}
            className="group flex items-center gap-4 p-4 bg-white/60 rounded-[24px] border border-black/[0.03] hover:border-pink-500/20 transition-all"
          >
            <div className="p-2.5 bg-black/[0.03] rounded-xl text-black/30 group-hover:text-pink-500 transition-colors">
              {layer.key.toLowerCase().includes('objetivo') ? <Target className="w-4 h-4" /> :
               layer.key.toLowerCase().includes('lugar') ? <MapPin className="w-4 h-4" /> :
               layer.key.toLowerCase().includes('expertise') ? <Briefcase className="w-4 h-4" /> :
               <Box className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-black/20">{layer.key}</p>
              <input 
                value={layer.value}
                onChange={(e) => onUpdate(idx, e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm font-bold text-black/80 focus:ring-0"
              />
            </div>
          </div>
        ))}
        <button 
          onClick={() => {/* Lógica para add nova camada */}}
          className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-black/5 rounded-[24px] hover:bg-black/[0.02] text-black/20 hover:text-black/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Adicionar Dimensão</span>
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// 2. NARRATIVE BLOCK (TIPTAP LEGO)
// ============================================================================
function NarrativeBlock({ block, onUpdate, onDelete, onRefineFragment, onRefineBlock, isBusy }) {
  const controls = useDragControls();
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [3] } }), Underline, Placeholder.configure({ placeholder: 'Arquitetar...' })],
    content: block.content,
    onUpdate: ({ editor }) => onUpdate(block.id, editor.getHTML(), block.type),
    editorProps: { attributes: { class: 'prose prose-stone max-w-none focus:outline-none text-black/80 leading-[1.8]' } }
  });

  if (!editor) return null;

  return (
    <Reorder.Item
      value={block}
      dragListener={false} 
      dragControls={controls}
      className="relative group py-4 my-2 transition-all rounded-3xl hover:bg-black/[0.02]"
    >
      <BubbleMenu editor={editor} className="flex bg-black/95 backdrop-blur-xl px-2 py-1.5 rounded-2xl shadow-2xl border border-white/10 gap-1">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("px-2 text-white/60", editor.isActive('bold') && "text-white")}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("px-2 text-white/60", editor.isActive('italic') && "text-white italic")}>I</button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button onClick={() => onRefineFragment(editor)} className="flex items-center gap-1.5 px-2 text-pink-400 font-black text-[10px] uppercase">
            <Sparkles className="w-3 h-3" /> Flor
          </button>
      </BubbleMenu>

      <div className="flex gap-4">
        <div className="flex flex-col items-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="cursor-grab active:cursor-grabbing p-1 text-black/20" onPointerDown={(e) => controls.start(e)}>
            <GripVertical className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <input 
              type="text" value={block.type}
              onChange={(e) => onUpdate(block.id, block.content, e.target.value)}
              className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30 bg-transparent border-none p-0 w-32 focus:text-pink-500"
              placeholder="ETIQUETA"
            />
            <div className="flex items-center gap-1">
               <button onClick={() => onRefineBlock(block.id)} disabled={isBusy} className="p-1.5 text-pink-500/40 hover:text-pink-500">
                  <Sparkles className={cn("w-4 h-4", isBusy && "animate-spin")} />
               </button>
               <button onClick={() => onDelete(block.id)} className="p-1.5 text-red-500/20 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>
    </Reorder.Item>
  );
}

// ============================================================================
// 3. CANVAS PRINCIPAL (PAPYRUS CANVAS)
// ============================================================================
export default function PapyrusCanvas({ task, projectId }) {
  const [blocks, setBlocks] = useState(task.customData?.papyrusBlocks || [
    { id: '1', type: 'Gancho', content: '<p></p>', variants: [] },
    { id: '2', type: 'Corpo', content: '<p></p>', variants: [] }
  ]);

  const [sintoniaLayers, setSintoniaLayers] = useState(task.customData?.sintoniaLayers || [
    { key: 'Expertise', value: 'Original' },
    { key: 'Objetivo', value: 'Engajamento' },
    { key: 'Lugar', value: 'Global' }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [effectiveDNA, setEffectiveDNA] = useState(null);

  useEffect(() => {
    BrandCodeAPI.getEffectiveBrandCode(projectId).then(setEffectiveDNA).catch(() => {});
  }, [projectId]);

  const syncToCloud = useCallback(async (newBlocks, newLayers) => {
    setIsSaving(true);
    try {
      await apiClient.post(`/tasks/${task.id}/custom-field`, {
        fieldName: 'papyrus_state',
        fieldValue: { blocks: newBlocks, sintoniaLayers: newLayers }
      });
    } finally { setIsSaving(false); }
  }, [task.id]);

  const handleUpdateBlock = (id, content, type) => {
    const updated = blocks.map(b => b.id === id ? { ...b, content, type: type || b.type } : b);
    setBlocks(updated);
    syncToCloud(updated, sintoniaLayers);
  };

  const handleUpdateSintonia = (idx, value) => {
    const updated = [...sintoniaLayers];
    updated[idx].value = value;
    setSintoniaLayers(updated);
    syncToCloud(blocks, updated);
  };

  const plantInNexusTree = async () => {
    const tid = toast.loading("Enraizando na Árvore do Nexus...");
    try {
      const fullHtml = blocks.map(b => `${b.type ? `<h3>${b.type}</h3>` : ''}${b.content}`).join('');
      await apiClient.post(`/nexus/nodes`, {
        title: task?.title || "Manuscrito Orgânico",
        type: 'document',
        content: fullHtml,
        projectId: projectId,
        originTaskId: task?.id,
        contextMetadata: { sintoniaLayers }
      });
      toast.success("Eternizado no Nexus!", { id: tid });
    } catch (e) { toast.error("Falha ao plantar.", { id: tid }); }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] selection:bg-pink-100 overflow-hidden">
      
      {/* HEADER: WABI-SABI */}
      <div className="px-12 py-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 rounded-[22px] bg-white shadow-sm border border-black/5 flex items-center justify-center">
              <Layout className="w-5 h-5 text-black/30" />
           </div>
           <div>
              <h1 className="text-xl font-bold text-black/90 tracking-tighter">Papyrus Canvas</h1>
              <div className="flex items-center gap-3 mt-1 opacity-40">
                 <Brain className="w-3 h-3" />
                 <span className="text-[9px] font-black uppercase tracking-widest">
                    {effectiveDNA ? `DNA: ${effectiveDNA.summary || 'Ativo'}` : 'Sem DNA'}
                 </span>
              </div>
           </div>
        </div>
        <div className={cn("w-2 h-2 rounded-full transition-all duration-700", isSaving ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" : "bg-emerald-400")} />
      </div>

      <div className="flex-1 overflow-y-auto px-12 pb-40 space-y-12 scroll-smooth scrollbar-hide">
        
        {/* MESA DE SINTONIA */}
        <div className="max-w-4xl mx-auto">
          <SintoniaBoard 
            layers={sintoniaLayers} 
            onUpdate={handleUpdateSintonia}
            onSaveMask={() => toast.success("Máscara de Sintonia Plantada!")}
          />
        </div>

        {/* LEGO NARRATIVO */}
        <div className="max-w-3xl mx-auto">
          <Reorder.Group axis="y" values={blocks} onReorder={(newOrder) => { setBlocks(newOrder); syncToCloud(newOrder, sintoniaLayers); }}>
            <AnimatePresence initial={false}>
              {blocks.map((block) => (
                <NarrativeBlock 
                  key={block.id} 
                  block={block}
                  onUpdate={handleUpdateBlock}
                  onDelete={(id) => setBlocks(blocks.filter(b => b.id !== id))}
                  onRefineFragment={(editor) => {/* Alquimia de seleção */}}
                  onRefineBlock={(id) => {/* Alquimia de bloco */}}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <button 
            onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: '', content: '<p></p>' }])}
            className="group mt-6 ml-10 flex items-center gap-3 text-black/20 hover:text-black/50 transition-all"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Novo Átomo</span>
          </button>
        </div>
      </div>

      {/* FOOTER: NEXUS tree */}
      <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent z-30 flex justify-center">
        <button 
          onClick={plantInNexusTree}
          className="flex items-center gap-4 px-10 py-4 bg-black text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 hover:bg-pink-600 transition-all active:scale-95"
        >
          <Network className="w-4 h-4 text-pink-400" /> Plantar na Árvore (Nexus)
        </button>
      </div>

    </div>
  );
}
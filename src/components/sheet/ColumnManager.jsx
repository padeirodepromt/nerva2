/* src/components/sheet/ColumnManager.jsx
   desc: Column Builder & Manager V10.1 (Neural OS).
   feat: Gestão completa de colunas (Lista, Criação e Exclusão).
   feat: Suporte a tipos Bio-Digital (Energy/Archetype) e Dimensional (Sankalpa).
*/
import React, { useState } from 'react';
import { 
    Dialog, DialogContent, DialogTitle 
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Project } from '../../api/entities';
import { cn } from '../../lib/utils';

import { 
    IconPlus, IconTrash2, IconSettings, IconLoader2,
    IconBold, IconHash, IconCalendar, IconList, IconStar, 
    IconCheckSquare, IconLink, IconZap, IconBrainCircuit, IconTarget,
    IconChevronRight, IconBox
} from '../icons/PranaLandscapeIcons';

// Dicionário de Tipos V10 (Neural OS)
const TYPE_OPTIONS = [
    { id: 'text', label: 'Texto', icon: IconBold, desc: 'Títulos, nomes, notas.' },
    { id: 'number', label: 'Número', icon: IconHash, desc: 'Valores, quantidades.' },
    { id: 'select', label: 'Seleção', icon: IconList, desc: 'Menu de opções único.' },
    { id: 'sankalpa', label: 'Sankalpa', icon: IconTarget, desc: 'Vincular a uma Meta do Multiverso.' }, // [V10]
    { id: 'energy', label: 'Energia', icon: IconZap, desc: 'Custo bio-digital (1-5).' }, 
    { id: 'archetype', label: 'Natureza', icon: IconBrainCircuit, desc: 'Tipo de atividade (Foco/Social).' }, 
    { id: 'rating', label: 'Avaliação', icon: IconStar, desc: 'Ranking de 1 a 5.' },
    { id: 'date', label: 'Data', icon: IconCalendar, desc: 'Prazos e eventos.' },
    { id: 'checkbox', label: 'Check', icon: IconCheckSquare, desc: 'Sim ou Não.' },
    { id: 'url', label: 'Link', icon: IconLink, desc: 'Website ou recurso.' },
];

export function ColumnManager({ projectId, currentColumns = [], onColumnChange, isOpen, onClose }) {
    // Estados: 'list' (Ver colunas) | 'type' (Escolher tipo) | 'config' (Configurar nova)
    const [mode, setMode] = useState('list'); 
    const [newCol, setNewCol] = useState({ label: '', type: 'text', options: [] });
    const [optionInput, setOptionInput] = useState('');
    const [saving, setSaving] = useState(false);

    const handleClose = () => {
        setMode('list');
        setNewCol({ label: '', type: 'text', options: [] });
        onClose();
    };

    const handleSelectType = (typeId) => {
        setNewCol(prev => ({ ...prev, type: typeId }));
        setMode('config');
    };

    const handleAddOption = () => {
        if (!optionInput.trim()) return;
        if (newCol.options.includes(optionInput.trim())) return toast.error("Opção duplicada.");
        setNewCol(prev => ({ ...prev, options: [...prev.options, optionInput.trim()] }));
        setOptionInput('');
    };

    const handleSave = async () => {
        if (!newCol.label.trim()) return toast.error("O campo precisa de um nome.");
        setSaving(true);
        try {
            const slug = newCol.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_');
            const uniqueKey = `${slug}_${Date.now().toString().slice(-4)}`;

            let width = '180px';
            if (['rating', 'checkbox', 'energy', 'archetype', 'sankalpa'].includes(newCol.type)) width = '120px';

            const columnDefinition = {
                key: uniqueKey,
                label: newCol.label,
                type: newCol.type,
                width,
                options: newCol.options,
                isDynamic: true
            };

            const updatedColumns = [...currentColumns, columnDefinition];
            await Project.updateSchema(projectId, updatedColumns);

            toast.success("Campo manifestado.");
            if (onColumnChange) onColumnChange(updatedColumns);
            setMode('list');
            setNewCol({ label: '', type: 'text', options: [] });
        } catch (e) {
            toast.error("Erro na sincronia.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (key) => {
        try {
            const updated = currentColumns.filter(c => c.key !== key);
            await Project.updateSchema(projectId, updated);
            toast.success("Campo removido.");
            if (onColumnChange) onColumnChange(updated);
        } catch (e) { toast.error("Falha ao deletar."); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#0c0a09] border border-white/10 text-foreground sm:max-w-[500px] shadow-2xl p-0 gap-0 overflow-hidden">
                
                {/* --- HEADER DINÂMICO --- */}
                <div className="bg-gradient-to-b from-white/5 to-transparent p-6 border-b border-white/5">
                    <DialogTitle className="font-serif text-xl flex items-center gap-2">
                        {mode === 'list' && <><IconSettings className="w-5 h-5 text-zinc-500"/> Atributos do Projeto</>}
                        {mode === 'type' && <><IconPlus className="w-5 h-5 text-indigo-500"/> Novo Campo</>}
                        {mode === 'config' && <><button onClick={() => setMode('type')} className="opacity-40 hover:opacity-100 transition-opacity">Tipos /</button> Configuração</>}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                        {mode === 'list' && "Gerencie as colunas e dados desta planilha."}
                        {mode === 'type' && "Selecione a natureza do dado que deseja capturar."}
                        {mode === 'config' && `Definindo detalhes para ${newCol.label}.`}
                    </p>
                </div>
                
                {/* --- CONTEÚDO --- */}
                <div className="p-6 min-h-[350px] max-h-[500px] overflow-y-auto prana-scrollbar">
                    
                    {/* LISTA DE COLUNAS EXISTENTES */}
                    {mode === 'list' && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Campos Ativos</span>
                                <Button size="sm" onClick={() => setMode('type')} className="h-7 text-[10px] bg-white/5 hover:bg-white/10 border border-white/10">
                                    <IconPlus className="w-3 h-3 mr-1" /> Adicionar
                                </Button>
                            </div>
                            {currentColumns.filter(c => c.isDynamic).length === 0 ? (
                                <div className="py-12 text-center opacity-20 flex flex-col items-center">
                                    <IconBox className="w-8 h-8 mb-2" />
                                    <p className="text-xs italic">Nenhum campo customizado.</p>
                                </div>
                            ) : (
                                currentColumns.filter(c => c.isDynamic).map((col) => (
                                    <div key={col.key} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white/5 rounded-md opacity-50 group-hover:opacity-100 transition-opacity text-indigo-400">
                                                {TYPE_OPTIONS.find(t => t.id === col.type)?.icon ? 
                                                 React.createElement(TYPE_OPTIONS.find(t => t.id === col.type).icon, { className: "w-3.5 h-3.5" }) 
                                                 : <IconBox className="w-3.5 h-3.5"/>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{col.label}</p>
                                                <p className="text-[9px] uppercase tracking-tighter opacity-30">{col.type}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(col.key)} className="p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <IconTrash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* SELEÇÃO DE TIPO */}
                    {mode === 'type' && (
                        <div className="grid grid-cols-2 gap-3">
                            {TYPE_OPTIONS.map((opt) => (
                                <button key={opt.id} onClick={() => handleSelectType(opt.id)} className="flex flex-col items-start p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 transition-all text-left group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <opt.icon className="w-4 h-4 text-indigo-400 opacity-70 group-hover:opacity-100" />
                                        <span className="text-sm font-medium">{opt.label}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground leading-tight">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* CONFIGURAÇÃO FINAL */}
                    {mode === 'config' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-bold opacity-30 ml-1">Nome do Campo</label>
                                <Input value={newCol.label} onChange={e => setNewCol({...newCol, label: e.target.value})} placeholder="Ex: Impacto, Cliente..." className="bg-white/5 border-white/10 h-11" autoFocus />
                            </div>

                            {newCol.type === 'select' && (
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-30 ml-1">Opções do Menu</label>
                                    <div className="flex gap-2">
                                        <Input value={optionInput} onChange={e => setOptionInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddOption()} placeholder="Digite e Enter..." className="bg-white/5 border-white/10" />
                                        <Button onClick={handleAddOption} variant="secondary">+</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newCol.options.map((opt, i) => (
                                            <span key={i} className="flex items-center gap-1 pl-2 pr-1 py-1 bg-white/5 border border-white/10 rounded-md text-[10px]">
                                                {opt}
                                                <button onClick={() => setNewCol(p => ({...p, options: p.options.filter((_, idx) => idx !== i)}))} className="hover:text-red-400 transition-colors"><IconTrash2 className="w-3 h-3"/></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {newCol.type === 'sankalpa' && (
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-4">
                                    <IconTarget className="w-6 h-6 text-indigo-400" />
                                    <p className="text-[11px] text-indigo-200/70 leading-relaxed">Este campo se conectará automaticamente às suas <strong>Metas V10</strong>. Na visualização, ele exibirá apenas metas do Universo ativo.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- FOOTER --- */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={handleClose}>Fechar</Button>
                    {mode === 'config' && (
                        <Button onClick={handleSave} disabled={saving || !newCol.label} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                            {saving ? <IconLoader2 className="animate-spin w-3 h-3 mr-2" /> : null}
                            Manifestar Campo
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
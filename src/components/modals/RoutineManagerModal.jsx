/* src/components/smart/RoutineManagerModal.jsx
   desc: Gestor de Ciclos V10 (Versão Sincronizada).
   logic: Delegado ao hook useRoutines para evitar redundância de estado.
*/
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
    IconLoader2, IconCheck, IconTrash, IconEdit, IconPlus, 
    IconZap, IconLayers, IconClock 
} from '@/components/icons/PranaLandscapeIcons';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useRoutines } from '@/hooks/useRoutines'; 
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ROUTINE_TYPES = [
  { value: 'work', label: 'Trabalho' },
  { value: 'wellness', label: 'Bem-estar' },
  { value: 'admin', label: 'Administrativo' },
  { value: 'sport', label: 'Esporte' },
  { value: 'leisure', label: 'Lazer' },
];

const BEHAVIORS = [
    { value: 'habit', label: 'Hábito', icon: IconZap, desc: 'Âncora fixa' },
    { value: 'block', label: 'Bloco', icon: IconLayers, desc: 'Território para o Ash' },
];

const DAYS = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sab' },
];

export default function RoutineManagerModal({ isOpen, onClose }) {
  const { routines, loading, actions } = useRoutines();
  const { activeRealmId } = useWorkspaceStore();

  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (routine) => {
    setEditingId(routine.id);
    setEditForm({ ...routine });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setEditForm({});
  };

  // REINCORPORADO: Ação de deleção com confirmação
  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente remover este ciclo do seu biorritmo?')) return;
    await actions.delete(id);
  };

  const handleSave = async (id) => {
    if (!editForm.title.trim()) return toast.error('Dê um nome ao ciclo.');
    if (editForm.endHour <= editForm.startHour) return toast.error('O fim deve ser após o início.');
    
    await actions.update(id, editForm);
    setEditingId(null);
  };

  const handleCreateSave = async () => {
    if (!editForm.title.trim()) return toast.error('Nome obrigatório.');
    try {
        const result = await actions.create(editForm);
        
        // REINCORPORADO: Sincronização com o Explorer (Seu código original)
        window.dispatchEvent(new CustomEvent('prana:refresh-explorer', { 
            detail: { itemType: 'routine', itemId: result.id } 
        }));

        setIsCreating(false);
        setEditForm({});
    } catch (e) { /* Erro já tratado no hook */ }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditForm({
      title: '',
      type: 'work',
      behavior: 'habit',
      startHour: 9,
      endHour: 10,
      days: [1, 2, 3, 4, 5],
      realmId: activeRealmId === 'all' ? 'personal' : activeRealmId
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-background border-white/10 p-0 overflow-hidden shadow-2xl rounded-[32px]">
        {/* Header Sincronizado */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-serif italic">Geografia Temporal</DialogTitle>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-30 mt-1">
                Contexto Ativo: {activeRealmId}
            </p>
          </div>
          {!isCreating && !editingId && (
            <Button onClick={handleCreateNew} size="sm" className="gap-2 rounded-full font-bold uppercase text-[10px] tracking-widest">
              <IconPlus className="w-3 h-3" /> Nova Rotina
            </Button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto prana-scrollbar p-6">
          {loading ? (
            <div className="flex items-center justify-center p-12"><IconLoader2 className="w-6 h-6 animate-spin opacity-20" /></div>
          ) : (isCreating || editingId) ? (
            /* FORMULÁRIO (Unificado para reduzir linhas) */
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase opacity-40">Título do Ciclo</Label>
                <Input
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="bg-white/5 border-white/10 font-serif italic text-lg"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-40">Tipo</Label>
                    <Select value={editForm.type} onValueChange={(v) => setEditForm({...editForm, type: v})}>
                        <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            {ROUTINE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase opacity-40">Natureza</Label>
                    <div className="flex gap-2">
                        {BEHAVIORS.map(b => (
                            <button key={b.value} onClick={() => setEditForm({...editForm, behavior: b.value})} className={cn("flex-1 p-2 rounded-xl border text-[10px] font-bold uppercase transition-all", editForm.behavior === b.value ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-transparent opacity-40")}>
                                {b.label}
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase opacity-40">Horário</Label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-10">
                    <select value={editForm.startHour} onChange={(e) => setEditForm({...editForm, startHour: parseInt(e.target.value)})} className="bg-transparent text-xs focus:outline-none">
                        {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h} className="bg-zinc-900">{h}:00</option>)}
                    </select>
                    <span className="opacity-20 text-[10px]">até</span>
                    <select value={editForm.endHour} onChange={(e) => setEditForm({...editForm, endHour: parseInt(e.target.value)})} className="bg-transparent text-xs focus:outline-none">
                        {Array.from({ length: 24 }, (_, i) => i).map(h => <option key={h} value={h} className="bg-zinc-900">{h}:00</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase opacity-40">Dias</Label>
                  <div className="flex gap-1">
                    {DAYS.map(d => (
                        <button key={d.value} onClick={() => {
                            const newDays = editForm.days.includes(d.value) ? editForm.days.filter(v => v !== d.value) : [...editForm.days, d.value].sort();
                            setEditForm({...editForm, days: newDays});
                        }} className={cn("w-7 h-7 rounded-lg text-[9px] font-bold border transition-all", editForm.days.includes(d.value) ? "bg-white text-black border-white" : "bg-white/5 text-zinc-600 border-white/5")}>
                            {d.label[0]}
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="ghost" onClick={handleCancel} className="flex-1 rounded-xl text-[10px] uppercase font-black h-11">Cancelar</Button>
                <Button onClick={() => isCreating ? handleCreateSave() : handleSave(editForm.id)} className="flex-1 rounded-xl bg-white text-black hover:bg-zinc-200 text-[10px] uppercase font-black h-11">
                    {isCreating ? "Manifestar Ciclo" : "Confirmar Mudanças"}
                </Button>
              </div>
            </div>
          ) : (
            /* LISTAGEM */
            <div className="space-y-3">
              {routines.length === 0 ? (
                <div className="p-12 text-center opacity-20 text-xs font-bold uppercase tracking-widest">Nenhum ciclo neste Universo.</div>
              ) : routines.map((r) => (
                <div key={r.id} className="group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", r.behavior === 'block' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400")}>
                        {r.behavior === 'block' ? <IconLayers className="w-5 h-5" /> : <IconZap className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-serif italic text-sm">{r.title}</h3>
                      <p className="text-[9px] uppercase font-black tracking-widest opacity-30">{r.startHour}:00 - {r.endHour}:00 • {r.days?.length} Dias</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(r)} className="h-8 w-8"><IconEdit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="h-8 w-8 hover:text-red-400"><IconTrash className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
/* src/components/forms/SankalpaFormModal.jsx
   desc: Modal de Manifestação de Intenções V10.
   feat: Auto-detecção de Realm e vinculação de prazo.
*/
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { Sankalpa } from '@/api/entities';
import { toast } from "sonner";
import { IconTarget, IconZap, IconCalendar } from '@/components/icons/PranaLandscapeIcons';

export default function SankalpaFormModal({ isOpen, onClose, onCreated, initialData = null }) {
    const { activeRealmId } = useWorkspaceStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetDate: '',
        realmId: activeRealmId === 'all' ? 'personal' : activeRealmId // [V10]
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData(prev => ({ ...prev, realmId: activeRealmId === 'all' ? 'personal' : activeRealmId }));
    }, [initialData, activeRealmId, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return toast.error("A intenção precisa de um nome.");

        setLoading(true);
        try {
            if (initialData?.id) {
                await Sankalpa.update(initialData.id, formData);
                toast.success("Sankalpa atualizado.");
            } else {
                await Sankalpa.create(formData);
                toast.success("Sankalpa manifestado no multiverso.");
            }
            if (onCreated) onCreated();
            onClose();
        } catch (err) {
            toast.error("Erro na manifestação da meta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0c0a09] border-white/10 sm:max-w-[450px] shadow-2xl p-0 overflow-hidden font-sans">
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <IconTarget className="w-5 h-5 text-indigo-400" />
                                </div>
                                <DialogTitle className="text-xl font-serif italic text-indigo-100">
                                    {initialData ? 'Refinar Intenção' : 'Nova Intenção (Sankalpa)'}
                                </DialogTitle>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Defina o Norte Magnético do seu universo <span className="text-indigo-400 uppercase font-bold">{formData.realmId}</span>.
                            </p>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Título da Meta</label>
                                <Input 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="Ex: Liberdade Criativa V10"
                                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-all h-12 text-sm"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Briefing / Porquê</label>
                                <Textarea 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Descreva o estado final desejado..."
                                    className="bg-white/5 border-white/10 focus:bg-white/10 min-h-[100px] text-xs leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Manifestar até</label>
                                    <div className="relative">
                                        <IconCalendar className="absolute left-3 top-3 w-4 h-4 opacity-20" />
                                        <Input 
                                            type="date"
                                            value={formData.targetDate}
                                            onChange={e => setFormData({...formData, targetDate: e.target.value})}
                                            className="bg-white/5 border-white/10 pl-10 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Universo</label>
                                    <div className="h-10 flex items-center px-3 bg-indigo-500/5 border border-indigo-500/10 rounded-md">
                                        <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-tighter">
                                            {formData.realmId === 'professional' ? '💼 Profissional' : '🌿 Pessoal'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="bg-white/[0.02] p-4 border-t border-white/5 flex gap-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-xs">Silenciar</Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6">
                            {loading ? <IconZap className="animate-spin w-4 h-4 mr-2" /> : null}
                            {initialData ? 'Atualizar' : 'Manifestar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
// src/components/forms/TeamFormModal.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IconX, IconSave, IconTrash, IconColetivo, IconPlus
} from '@/components/icons/PranaLandscapeIcons';
import { Team, User } from '@/api/entities';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TeamFormModal({ isOpen, onClose, team = null, onSave }) {
    const [formData, setFormData] = useState({ name: '', description: '', color: '#3B82F6' });
    const [isSaving, setIsSaving] = useState(false);
    const isEditing = !!team;

    useEffect(() => {
        if (isOpen) {
            if (team) {
                setFormData({ 
                    name: team.name || '', 
                    description: team.description || '', 
                    color: team.color || '#3B82F6' 
                });
            } else {
                setFormData({ name: '', description: '', color: '#3B82F6' });
            }
        }
    }, [isOpen, team]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.warning("O time precisa de um nome.");

        setIsSaving(true);
        try {
            const user = await User.me();
            if (!user) throw new Error("Usuário não autenticado.");

            const payload = {
                ...formData,
                ownerId: user.id, // O Criador é o dono
            };

            if (isEditing) {
                await Team.update(team.id, payload);
                toast.success("Time atualizado.");
            } else {
                await Team.create(payload);
                toast.success("Time criado com sucesso!");
            }

            onSave?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar time.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tem certeza? Isso não pode ser desfeito.")) return;
        try {
            await Team.delete(team.id);
            toast.success("Time dissolvido.");
            onSave?.();
            onClose();
        } catch (error) {
            toast.error("Erro ao excluir.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] glass-effect border-white/10 bg-card text-foreground p-0 overflow-hidden rounded-2xl">
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <DialogTitle className="text-xl font-light flex items-center gap-3">
                        <div className="p-2 rounded-full bg-[rgba(var(--accent-rgb),0.1)] text-[rgb(var(--accent-rgb))]">
                            <IconColetivo className="w-6 h-6" />
                        </div>
                        <span>{isEditing ? 'Editar Egrégora' : 'Novo Time'}</span>
                    </DialogTitle>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><IconX className="w-5 h-5"/></button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider opacity-50 font-semibold ml-1">Nome da Equipe</label>
                        <Input 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ex: Marketing, Design, Squad Alpha..."
                            className="prana-focus-ring bg-black/20 border-white/10 h-12 font-display text-lg text-white placeholder:text-white/20"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider opacity-50 font-semibold ml-1">Propósito / Descrição</label>
                        <textarea 
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm min-h-[100px] focus:border-[rgb(var(--accent-rgb))] outline-none text-white/90 resize-none prana-focus-ring"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Qual o objetivo deste grupo?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider opacity-50 font-semibold ml-1">Cor da Aura</label>
                        <div className="flex gap-3">
                            {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFormData({...formData, color: c})}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl flex justify-between items-center">
                    {isEditing ? (
                        <button onClick={handleDelete} className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm transition-colors">
                            <IconTrash className="w-4 h-4"/> Dissolver
                        </button>
                    ) : <div />}
                    
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="hover:bg-white/5 text-white/60">Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={isSaving} className="glow-effect px-6 font-bold text-white">
                            <IconSave className="w-4 h-4 mr-2" /> 
                            {isSaving ? 'Salvando...' : 'Confirmar'}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
/* src/components/forms/checklist/RoutineFormContent.jsx
   desc: Útero de Ciclos V10 (Neural OS).
   feat: Distinção entre Hábito (Âncora) e Bloco (Território).
   feat: Herança de Realm e suporte ao Tetris do Ash.
*/
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
    IconLoader2, IconCheck, IconTarget, IconZap, IconLayers, IconClock 
} from '@/components/icons/PranaLandscapeIcons';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'; // [V10]
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ROUTINE_CATEGORIES = [
    { value: 'work', label: 'Trabalho', realm: 'professional' },
    { value: 'wellness', label: 'Bem-estar', realm: 'personal' },
    { value: 'admin', label: 'Administrativo', realm: 'professional' },
    { value: 'sport', label: 'Esporte', realm: 'personal' },
    { value: 'leisure', label: 'Lazer', realm: 'personal' },
];

const BEHAVIORS = [
    { value: 'habit', label: 'Hábito (Âncora)', desc: 'Coisa certa a se fazer. Ocupa o tempo.', icon: IconZap },
    { value: 'block', label: 'Bloco (Território)', desc: 'Espaço aberto para Projetos/Tarefas.', icon: IconLayers },
];

const DAYS = [
    { value: 0, label: 'Segunda' },
    { value: 1, label: 'Terça' },
    { value: 2, label: 'Quarta' },
    { value: 3, label: 'Quinta' },
    { value: 4, label: 'Sexta' },
    { value: 5, label: 'Sábado' },
    { value: 6, label: 'Domingo' },
];

export default function RoutineFormContent({
    defaultValues = {},
    onSuccess = () => {},
    isLoading = false
}) {
    const { activeRealmId, canUseRealms } = useWorkspaceStore(); // [V10]
    const showRealms = canUseRealms();

    const [formData, setFormData] = useState({
        title: defaultValues.title || '',
        category: defaultValues.category || 'work',
        behavior: defaultValues.behavior || 'habit', // [V10] Habit vs Block
        realmId: defaultValues.realmId || (activeRealmId === 'all' ? 'personal' : activeRealmId), // [V10]
        startHour: defaultValues.startHour || 8,
        endHour: defaultValues.endHour || 9,
        days: defaultValues.days || [0, 1, 2, 3, 4],
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDayToggle = (day) => {
        setFormData(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day].sort()
        }));
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.error('O ciclo precisa de um nome');
            return;
        }

        if (formData.days.length === 0) {
            toast.error('Selecione ao menos um dia para este ritmo');
            return;
        }

        if (formData.endHour <= formData.startHour) {
            toast.error('O encerramento deve ser após o início');
            return;
        }

        try {
            onSuccess({
                ...formData,
                title: formData.title.trim(),
            });
        } catch (error) {
            console.error(error);
            toast.error('Erro na manifestação do ciclo');
        }
    };

    return (
        <div className="space-y-6 p-4 max-h-[70vh] overflow-y-auto prana-scrollbar">
            
            {/* Identificação e Realm (Sutil) */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Identidade do Ciclo</Label>
                    {showRealms && (
                      <div className="flex items-center gap-2 opacity-60">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            formData.realmId === 'professional' ? "bg-indigo-500" : "bg-emerald-500"
                        )} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                            {formData.realmId === 'professional' ? 'Universo Profissional' : 'Fluxo Pessoal'}
                        </span>
                      </div>
                    )}
                </div>
                <Input
                    autoFocus
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ex: Deep Work matinal, Meditação, Sprint Review..."
                    className="bg-white/[0.02] border-white/5 font-serif text-lg h-12 italic focus-visible:ring-primary/20"
                />
            </div>

            {/* [V10] Comportamento (Âncora vs Território) */}
            <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-zinc-500">Natureza do Tempo</Label>
                <div className="grid grid-cols-2 gap-3">
                    {BEHAVIORS.map((b) => (
                        <button
                            key={b.value}
                            type="button"
                            onClick={() => handleChange('behavior', b.value)}
                            className={cn(
                                "flex flex-col text-left p-3 rounded-2xl border transition-all duration-300",
                                formData.behavior === b.value 
                                    ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5" 
                                    : "bg-white/[0.02] border-white/5 hover:border-white/10 opacity-60"
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <b.icon className={cn("w-3.5 h-3.5", formData.behavior === b.value ? "text-primary" : "text-zinc-500")} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{b.label}</span>
                            </div>
                            <span className="text-[9px] leading-tight opacity-50">{b.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Categoria e Horários */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Categoria</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                        <SelectTrigger className="bg-white/[0.02] border-white/10 h-10 text-xs rounded-xl">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10">
                            {ROUTINE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="text-xs">
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Espaço Temporal</Label>
                    <div className="flex items-center gap-2 h-10 bg-white/[0.02] border border-white/10 rounded-xl px-3">
                        <IconClock className="w-3.5 h-3.5 opacity-30" />
                        <select 
                            value={formData.startHour} 
                            onChange={(e) => handleChange('startHour', parseInt(e.target.value))}
                            className="bg-transparent border-none text-xs focus:outline-none cursor-pointer"
                        >
                            {Array.from({ length: 24 }, (_, i) => i).map(h => (
                                <option key={h} value={h} className="bg-zinc-900">{String(h).padStart(2, '0')}:00</option>
                            ))}
                        </select>
                        <span className="opacity-20">→</span>
                        <select 
                            value={formData.endHour} 
                            onChange={(e) => handleChange('endHour', parseInt(e.target.value))}
                            className="bg-transparent border-none text-xs focus:outline-none cursor-pointer"
                        >
                            {Array.from({ length: 24 }, (_, i) => i).map(h => (
                                <option key={h} value={h} className="bg-zinc-900">{String(h).padStart(2, '0')}:00</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Dias da Semana */}
            <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Frequência Semanal</Label>
                <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                        const isSelected = formData.days.includes(day.value);
                        return (
                            <button
                                key={day.value}
                                type="button"
                                onClick={() => handleDayToggle(day.value)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all border",
                                    isSelected 
                                        ? "bg-zinc-200 text-black border-white" 
                                        : "bg-transparent text-zinc-500 border-white/5 hover:border-white/20"
                                )}
                            >
                                {day.label.slice(0, 3)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Ação Principal */}
            <div className="pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isLoading || !formData.title.trim()}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-[10px] rounded-2xl"
                >
                    {isLoading ? (
                        <IconLoader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <>Estabelecer Ciclo</>
                    )}
                </Button>
            </div>

            <div className="text-[10px] text-muted-foreground text-center opacity-40 px-6">
                {formData.behavior === 'block' 
                    ? "O Ash poderá distribuir projetos e tarefas dentro deste intervalo."
                    : "Este slot será marcado como ocupado e fixo na sua geometria semanal."}
            </div>
        </div>
    );
}

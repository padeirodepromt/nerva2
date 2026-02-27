import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconCheck } from '@/components/icons/PranaLandscapeIcons';
import { toast } from 'sonner';

export default function EventFormContent({
    defaultValues = {},
    onSuccess = () => {},
    projects = [],
    isLoading = false
}) {
    const [formData, setFormData] = useState({
        title: defaultValues.title || '',
        date: defaultValues.date || new Date().toISOString().split('T')[0],
        description: defaultValues.description || '',
        project_id: defaultValues.project_id || null,
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCreate = async () => {
        if (!formData.title.trim()) {
            toast.error('Título é obrigatório');
            return;
        }

        if (!formData.date) {
            toast.error('Data é obrigatória');
            return;
        }

        try {
            // Simular submissão do formulário
            // A lógica real de criação é feita em PranaFormModal
            onSuccess({
                ...formData,
                title: formData.title.trim(),
            });
        } catch (error) {
            console.error(error);
            toast.error('Erro ao criar evento');
        }
    };

    return (
        <div className="space-y-4 p-4">
            {/* Título */}
            <div className="space-y-2">
                <Label htmlFor="event-title" className="text-xs font-bold uppercase tracking-widest">
                    📅 Evento
                </Label>
                <Input
                    id="event-title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Título do evento (ex: Reunião com cliente)"
                    className="bg-white/5 border-white/10"
                />
            </div>

            {/* Data */}
            <div className="space-y-2">
                <Label htmlFor="event-date" className="text-xs font-bold uppercase tracking-widest">
                    Data
                </Label>
                <Input
                    id="event-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="bg-white/5 border-white/10"
                />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
                <Label htmlFor="event-description" className="text-xs font-bold uppercase tracking-widest">
                    Descrição (opcional)
                </Label>
                <Textarea
                    id="event-description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Detalhes do evento..."
                    className="bg-white/5 border-white/10 h-20"
                />
            </div>

            {/* Projeto (opcional) */}
            {projects.length > 0 && (
                <div className="space-y-2">
                    <Label htmlFor="event-project" className="text-xs font-bold uppercase tracking-widest">
                        Projeto (opcional)
                    </Label>
                    <Select
                        value={formData.project_id || ''}
                        onValueChange={(value) => handleChange('project_id', value || null)}
                    >
                        <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Selecione um projeto..." />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value="">Nenhum</SelectItem>
                            {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Botão de criação */}
            <div className="pt-4 flex gap-2">
                <Button
                    onClick={handleCreate}
                    disabled={isLoading || !formData.title.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {isLoading ? (
                        <><IconLoader2 className="w-4 h-4 animate-spin mr-2" /> Criando...</>
                    ) : (
                        <><IconCheck className="w-4 h-4 mr-2" /> Criar Evento</>
                    )}
                </Button>
            </div>
        </div>
    );
}

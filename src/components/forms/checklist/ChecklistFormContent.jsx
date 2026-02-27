/* src/components/forms/checklist/ChecklistFormContent.jsx
   desc: Formulário de Checklist (Lista de Itens) V10.
   feat: Integração com ChecklistEditor para criação de múltiplos sub-itens.
*/
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconCheck, IconPlus } from '@/components/icons/PranaLandscapeIcons';
import ChecklistEditor from '@/components/forms/ChecklistEditor'; // O componente que gerencia o array
import HierarchicalProjectSelector from '@/components/forms/HierarchicalProjectSelector';

export default function ChecklistFormContent({
    defaultValues = {},
    onSuccess = () => {},
    isLoading = false
}) {
    const [title, setTitle] = useState(defaultValues.title || '');
    const [items, setItems] = useState(defaultValues.items || []); // Aqui mora a "Lista"
    const [projectId, setProjectId] = useState(defaultValues.project_id || null);

    const handleSave = () => {
        if (!title.trim()) return;

        onSuccess({
            title: title.trim(),
            items: items, // Enviando o enxame de sub-itens
            projectId: projectId,
            type: 'checklist',
            status: 'inbox'
        });
    };

    return (
        <div className="space-y-6">
            {/* Título da Lista */}
            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Título da Lista</Label>
                <Input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Itens para o Evento, Lista de Compras..."
                    className="bg-white/5 border-white/10 text-xl font-serif italic h-12"
                />
            </div>

            {/* O Editor de Itens (A "Lista" propriamente dita) */}
            <div className="space-y-2 border-t border-white/5 pt-4">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Itens da Checklist</Label>
                <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                    <ChecklistEditor 
                        items={items} 
                        onChange={setItems} 
                        placeholder="Adicionar item à lista..."
                    />
                </div>
            </div>

            {/* Contexto de Projeto */}
            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Vincular a Projeto</Label>
                <HierarchicalProjectSelector
                    value={projectId}
                    onChange={setProjectId}
                />
            </div>

            <Button
                onClick={handleSave}
                disabled={isLoading || !title.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl"
            >
                {isLoading ? <IconLoader2 className="animate-spin mr-2" /> : <IconPlus className="mr-2 w-4 h-4" />}
                Salvar Lista na Inbox
            </Button>
        </div>
    );
}
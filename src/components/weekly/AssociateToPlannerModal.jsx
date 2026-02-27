/* src/components/weekly/AssociateToPlannerModal.jsx
   desc: Modal para preencher um slot de tempo.
   feat: Permite associar itens existentes ou criar novos.
*/
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, Project } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconX, IconPlus, IconCalendar, IconCheckSquare, IconFolder } from "@/components/icons/PranaLandscapeIcons";
import { toast } from "sonner";
import { createId } from '@/utils/id';

export default function AssociateToPlannerModal({ day, hour, projects, tasks, onSave, onCancel }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false); // Modo de criação rápida
  const [newItemTitle, setNewItemTitle] = useState("");
  
  const weekDayMap = {
    'Sunday': 'Domingo', 'Monday': 'Segunda-feira', 'Tuesday': 'Terça-feira', 
    'Wednesday': 'Quarta-feira', 'Thursday': 'Quinta-feira', 'Friday': 'Sexta-feira', 
    'Saturday': 'Sábado'
  };

  // Filtra itens que AINDA NÃO têm horário nesse dia/hora
  const availableTasks = tasks.filter(t => !t.planner_slot || 
    (t.planner_slot.day !== day || t.planner_slot.time !== `${hour}:00`));

  const filteredItems = availableTasks.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (item) => {
    if (selectedItems.find(si => si.id === item.id)) {
      setSelectedItems(selectedItems.filter(si => si.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSave = async () => {
    const plannerSlot = { day, time: `${hour}:00` };
    
    try {
        // 1. Salva itens selecionados
        for (const item of selectedItems) {
            await Task.update(item.id, { plannerSlot });
        }

        // 2. Cria novo item (se houver)
        if (newItemTitle.trim()) {
             await Task.create({
                 id: createId('task'),
                 title: newItemTitle,
                 status: 'todo',
                 plannerSlot, // Já nasce agendada
                 createdAt: new Date()
             });
             toast.success("Nova tarefa agendada.");
        } else if (selectedItems.length > 0) {
             toast.success(`${selectedItems.length} itens agendados.`);
        }

        onSave();
    } catch (e) {
        console.error(e);
        toast.error("Erro ao salvar.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onCancel}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="prana-surface-elevated rounded-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 text-[rgb(var(--accent-rgb))] mb-1">
                    <IconCalendar className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">Agendar</span>
                </div>
                <h2 className="text-xl font-serif text-foreground">
                    {weekDayMap[day]}, {hour}:00
                </h2>
            </div>
            <button onClick={onCancel} className="text-muted-foreground hover:text-white transition-colors"><IconX className="w-5 h-5" /></button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            {/* Opção 1: Criar Novo */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider opacity-70">Criar para este horário</label>
                <div className="flex gap-2">
                    <Input 
                        placeholder="O que você vai fazer?" 
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="bg-black/20 border-white/10 focus:border-[rgb(var(--accent-rgb))]"
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 my-2">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] text-muted-foreground uppercase">OU</span>
                <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* Opção 2: Selecionar do Backlog */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider opacity-70">Puxar do Backlog</label>
                <Input
                    placeholder="Buscar tarefas existentes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-white/5 h-9 text-xs mb-2"
                />
                <div className="max-h-48 overflow-y-auto space-y-1 prana-scrollbar border border-white/5 rounded-lg p-1 bg-black/20">
                    {filteredItems.length === 0 ? (
                        <p className="text-xs text-center py-4 opacity-40">Nenhuma tarefa disponível.</p>
                    ) : (
                        filteredItems.map(item => {
                            const isSelected = selectedItems.find(si => si.id === item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleItem(item)}
                                    className={`
                                        flex items-center justify-between p-2 rounded cursor-pointer transition-all border border-transparent
                                        ${isSelected ? 'bg-[rgba(var(--accent-rgb),0.1)] border-[rgba(var(--accent-rgb),0.3)]' : 'hover:bg-white/5'}
                                    `}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <IconCheckSquare className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[rgb(var(--accent-rgb))]' : 'opacity-50'}`} />
                                        <span className={`text-sm truncate ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{item.title}</span>
                                    </div>
                                    {isSelected && <IconPlus className="w-3 h-3 text-[rgb(var(--accent-rgb))]" />}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <Button variant="ghost" onClick={onCancel} className="text-muted-foreground hover:text-white">Cancelar</Button>
            <Button 
                onClick={handleSave}
                disabled={!newItemTitle && selectedItems.length === 0}
                className="glow-effect text-white font-bold px-6"
            >
                Confirmar Agendamento
            </Button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
/* src/components/modals/RenameProjectModal.jsx
   desc: Modal para renomear projeto E alterar sua hierarquia (parentId)
   feat: Validação de ciclos, limite de profundidade, seleção inteligente
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RenameProjectModal({ 
    project, 
    allProjects = [], 
    onSave, 
    onCancel, 
    isLoading = false 
}) {
    const [title, setTitle] = useState(project?.title || '');
    const [parentId, setParentId] = useState(project?.parentId || null);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');

    // Filtrar projetos elegíveis como pais (evitar ciclos)
    const getEligibleParents = () => {
        return allProjects.filter(p => {
            // Não pode ser ele mesmo
            if (p.id === project.id) return false;
            
            // Não pode ser seu descendente (evitar ciclos)
            let current = p.parentId;
            while (current) {
                if (current === project.id) return false;
                const parent = allProjects.find(proj => proj.id === current);
                current = parent?.parentId;
            }
            
            return true;
        });
    };

    // Contar profundidade do novo parentId
    const getDepth = (pId) => {
        let depth = 0;
        let current = pId;
        const maxDepth = 20;
        
        while (current && depth < maxDepth) {
            const parent = allProjects.find(p => p.id === current);
            if (!parent) break;
            current = parent.parentId;
            depth++;
        }
        
        return depth;
    };

    // Validar mudança de parentId
    const validateParentIdChange = (newParentId) => {
        setError('');
        setWarning('');

        if (!newParentId) {
            setWarning('Este projeto será movido para o nível raiz (sem pai)');
            return true;
        }

        const currentDepth = getDepth(newParentId);
        const newTotalDepth = currentDepth + 1;

        if (newTotalDepth > 7) {
            setError(`⚠️ Limite de profundidade atingido! Você já tem ${currentDepth} níveis. Máximo: 7`);
            return false;
        }

        if (newTotalDepth >= 6) {
            setWarning(`⚠️ Você está próximo ao limite de profundidade (${newTotalDepth}/7)`);
        }

        return true;
    };

    const handleParentIdChange = (value) => {
        const newParentId = value === 'null' ? null : value;
        setParentId(newParentId);
        validateParentIdChange(newParentId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Nome do projeto é obrigatório');
            return;
        }

        if (!validateParentIdChange(parentId)) {
            return;
        }

        // Preparar dados para salvar
        const updates = {
            title: title.trim()
        };

        // Só incluir parentId se mudou
        if (parentId !== project.parentId) {
            updates.parentId = parentId;
        }

        await onSave(updates);
    };

    const eligibleParents = getEligibleParents();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-purple-500/20 rounded-2xl shadow-2xl w-full max-w-md mx-4"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-purple-500/20">
                    <h2 className="text-xl font-semibold text-white">
                        Renomear & Reorganizar
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Altere o nome e/ou a hierarquia do projeto
                    </p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Campo: Nome */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Nome do Projeto
                        </label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError('');
                            }}
                            placeholder="Ex: Planning Phase"
                            className="bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-500"
                            autoFocus
                        />
                    </div>

                    {/* Campo: Projeto Pai (Hierarquia) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Projeto Pai (Hierarquia)
                        </label>
                        <Select value={parentId || 'null'} onValueChange={handleParentIdChange}>
                            <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                                <SelectValue placeholder="Selecione um projeto pai..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-purple-500/30">
                                {/* Opção: Raiz (sem pai) */}
                                <SelectItem value="null" className="text-slate-300">
                                    <div className="flex items-center gap-2">
                                        📁 Projeto Raiz (sem pai)
                                    </div>
                                </SelectItem>

                                {/* Separador */}
                                <div className="my-1 h-px bg-purple-500/20" />

                                {/* Opções de pais elegíveis */}
                                {eligibleParents.length > 0 ? (
                                    eligibleParents.map((p) => {
                                        const depth = getDepth(p.parentId);
                                        const indent = '  '.repeat(depth);
                                        const depthColor = depth >= 5 ? 'text-orange-400' : 'text-slate-400';

                                        return (
                                            <SelectItem
                                                key={p.id}
                                                value={p.id}
                                                className={`text-slate-300 pl-${depth * 4}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={depthColor}>
                                                        {indent}├─ {p.title}
                                                    </span>
                                                    {depth >= 5 && (
                                                        <span className="text-xs text-orange-400 ml-1">
                                                            (profundo)
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        );
                                    })
                                ) : (
                                    <div className="px-2 py-2 text-sm text-slate-500">
                                        Nenhum projeto elegível disponível
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500 mt-1">
                            💡 Altere para reorganizar na hierarquia de projetos
                        </p>
                    </div>

                    {/* Alertas */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {warning && !error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{warning}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Info: Profundidade Atual */}
                    <div className="text-xs text-slate-500 bg-slate-800/30 p-2 rounded">
                        📊 Profundidade atual: {getDepth(parentId)} de 7 níveis máximos
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                            disabled={isLoading || !!error}
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block animate-spin mr-2">⏳</span>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Salvar Mudanças
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

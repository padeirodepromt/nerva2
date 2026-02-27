/* src/views/SankalpaView.jsx
   desc: Sankalpa View V2.0 - Ferramenta Real de Trabalho com Intenções
   feat: Criar, editar, listar e conectar Sankalpas a projetos/tarefas
*/
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sankalpa } from '@/api/entities';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';
import ViewHeader from '@/components/ViewHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import PranaLoader from '@/components/PranaLoader';
import { 
    IconSankalpa, IconPlus, IconX, IconEdit, IconTrash2, IconLoader2
} from '@/components/icons/PranaLandscapeIcons';

export default function SankalpaView() {
    const { user } = useAuth();
    const { t } = useTranslations();
    const [sankalpas, setSankalpas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', emoji: '✨' });

    // Carregar Sankalpas do backend
    const loadSankalpas = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await Sankalpa.filter({ user_id: user.id });
            setSankalpas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erro ao carregar Sankalpas:', error);
            toast.error('Erro ao carregar intenções');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadSankalpas();
    }, [loadSankalpas]);

    // Criar novo Sankalpa
    const handleCreate = async () => {
        if (!formData.title.trim()) {
            toast.error('Digite um título para sua intenção');
            return;
        }

        setIsCreating(true);
        try {
            const newSankalpa = await Sankalpa.create({
                title: formData.title,
                description: formData.description,
                emoji: formData.emoji,
                user_id: user.id
            });
            setSankalpas([...sankalpas, newSankalpa]);
            setFormData({ title: '', description: '', emoji: '✨' });
            toast.success('Intenção criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar Sankalpa:', error);
            toast.error('Erro ao criar intenção');
        } finally {
            setIsCreating(false);
        }
    };

    // Atualizar Sankalpa
    const handleUpdate = async (id) => {
        if (!formData.title.trim()) {
            toast.error('Digite um título para sua intenção');
            return;
        }

        try {
            await Sankalpa.update(id, {
                title: formData.title,
                description: formData.description,
                emoji: formData.emoji
            });
            setSankalpas(sankalpas.map(s => 
                s.id === id ? { ...s, ...formData } : s
            ));
            setEditingId(null);
            setFormData({ title: '', description: '', emoji: '✨' });
            toast.success('Intenção atualizada!');
        } catch (error) {
            console.error('Erro ao atualizar Sankalpa:', error);
            toast.error('Erro ao atualizar intenção');
        }
    };

    // Deletar Sankalpa
    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta intenção?')) {
            try {
                await Sankalpa.delete(id);
                setSankalpas(sankalpas.filter(s => s.id !== id));
                toast.success('Intenção deletada');
            } catch (error) {
                console.error('Erro ao deletar Sankalpa:', error);
                toast.error('Erro ao deletar intenção');
            }
        }
    };

    // Iniciar edição
    const startEditing = (sankalpa) => {
        setEditingId(sankalpa.id);
        setFormData({
            title: sankalpa.title,
            description: sankalpa.description || '',
            emoji: sankalpa.emoji || '✨'
        });
    };

    // Cancelar edição
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', emoji: '✨' });
    };

    if (loading) return <PranaLoader text="Carregando suas intenções..." />;

    return (
        <div className="h-full w-full p-6 md:p-8 flex flex-col gap-8 overflow-auto bg-transparent prana-scrollbar">
            
            {/* HEADER */}
            <ViewHeader 
                icon={IconSankalpa}
                title="Sankalpa"
                subtitle="Intenções que alinham seu dia com o que importa"
                iconClassName="w-20 h-20"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLUNA ESQUERDA - CRIAR/EDITAR */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-effect rounded-3xl p-8 border border-white/10 space-y-4 sticky top-8"
                    >
                        <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                            <span className="text-2xl">{editingId ? '✏️' : '✨'}</span>
                            {editingId ? 'Ajustar Intenção' : 'Criar uma nova intenção'}
                        </h2>

                        {/* Emoji Selector */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold opacity-70">Emoji</label>
                            <Input
                                value={formData.emoji}
                                onChange={(e) => setFormData({ ...formData, emoji: e.target.value.slice(0, 2) })}
                                placeholder="✨"
                                maxLength={2}
                                className="text-2xl text-center h-12 bg-white/5 border-white/20 rounded-xl"
                            />
                        </div>

                        {/* Título */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold opacity-70">Título da intenção</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ex: Crescimento Profissional"
                                className="bg-white/5 border-white/20 rounded-xl h-10"
                                disabled={isCreating}
                            />
                        </div>

                        {/* Descrição */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold opacity-70">Descrição (opcional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="O que essa intenção protege, nutre ou convida para a sua vida?"
                                className="bg-white/5 border border-white/20 rounded-xl p-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                                disabled={isCreating}
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex gap-2 pt-4">
                            {editingId ? (
                                <>
                                    <Button
                                        onClick={() => handleUpdate(editingId)}
                                        disabled={isCreating}
                                        className="flex-1 bg-gradient-to-r from-[rgb(var(--accent-rgb))] to-orange-400 hover:from-[rgb(var(--accent-rgb))]/90 hover:to-orange-400/90"
                                    >
                                        {isCreating ? <IconLoader2 className="w-4 h-4 animate-spin" /> : 'Salvar intenção'}
                                    </Button>
                                    <Button
                                        onClick={cancelEdit}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancelar edição
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={handleCreate}
                                    disabled={isCreating}
                                    className="w-full bg-gradient-to-r from-[rgb(var(--accent-rgb))] to-orange-400 hover:from-[rgb(var(--accent-rgb))]/90 hover:to-orange-400/90 gap-2"
                                >
                                    <IconPlus className="w-4 h-4" />
                                    {isCreating ? 'Criando...' : 'Criar intenção'}
                                </Button>
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-[10px] text-muted-foreground/60 italic border-t border-white/10 pt-4 mt-4">
                            Cada intenção é um eixo de alinhamento. Conectar projetos e tarefas a ela ajuda seu dia a servir ao que é essencial.
                        </div>
                    </motion.div>
                </div>

                {/* COLUNA DIREITA - LISTA DE SANKALPAS */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {sankalpas.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-effect rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center text-center min-h-96"
                            >
                                <div className="text-6xl mb-4 opacity-30">🌱</div>
                                <h3 className="text-xl font-serif font-bold mb-2">Nenhuma intenção criada ainda</h3>
                                <p className="text-muted-foreground/70 max-w-sm leading-relaxed">
                                    Sankalpa é uma decisão interna clara. Comece nomeando uma intenção que faça sentido para este momento da sua vida.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid gap-4">
                                {sankalpas.map((sankalpa, idx) => (
                                    <motion.div
                                        key={sankalpa.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{sankalpa.emoji || '✨'}</span>
                                                    <h3 className="text-lg font-serif font-bold group-hover:text-[rgb(var(--accent-rgb))] transition-colors">
                                                        {sankalpa.title}
                                                    </h3>
                                                </div>
                                                {sankalpa.description && (
                                                    <p className="text-sm text-muted-foreground/70 pl-11 leading-relaxed">
                                                        {sankalpa.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => startEditing(sankalpa)}
                                                    className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400"
                                                >
                                                    <IconEdit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(sankalpa.id)}
                                                    className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400"
                                                >
                                                    <IconTrash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* FOOTER INFO */}
            {sankalpas.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-effect rounded-2xl p-6 border border-white/10 text-sm text-muted-foreground/70 space-y-2"
                >
                    <p className="font-semibold text-foreground">Próximos passos sugeridos:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Crie projetos ou tarefas e conecte a uma intenção específica</li>
                        <li>Peça ao Ash uma reflexão curta para a intenção do dia</li>
                        <li>Acompanhe como suas intenções aparecem no Dashboard ao longo das semanas</li>
                    </ul>
                </motion.div>
            )}
        </div>
    );
}
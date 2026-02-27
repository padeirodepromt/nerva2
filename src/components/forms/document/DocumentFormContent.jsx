/* src/components/forms/document/DocumentFormContent.jsx
   desc: Formulário para criar/editar Documentos com identidade visual Prana.
   feat: glassmorphism, Framer Motion, gradients temáticos (blue).
*/
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconFileText, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';

export default function DocumentFormContent({ 
    initialData = {}, 
    onSave, 
    onCancel, 
    isLoading = false 
}) {
    const [title, setTitle] = React.useState(initialData.title || '');
    const [content, setContent] = React.useState(initialData.content || '');
    const [status, setStatus] = React.useState(initialData.status || 'draft');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        await onSave({
            title: title.trim(),
            content: content.trim(),
            status
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass-effect border border-white/10 rounded-2xl bg-card prana-form-modal overflow-hidden"
        >
            {/* Header com Gradient */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <IconFileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-serif font-semibold text-white text-glow">Novo Documento</h3>
                        <p className="text-xs text-muted-foreground/70">Escreva e organize suas ideias</p>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Título do Documento
                    </label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Análise de Mercado..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400"
                        autoFocus
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Conteúdo
                    </label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Comece a escrever..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-blue-400 min-h-[120px]"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Status
                    </label>
                    <Select value={status} onValueChange={setStatus} disabled={isLoading}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-blue-400">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-effect border-white/10">
                            <SelectItem value="draft">Rascunho</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                            <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button 
                        type="submit"
                        disabled={!title.trim() || isLoading}
                        className="flex-1 glow-effect gap-2"
                    >
                        {isLoading && <IconLoader2 className="w-4 h-4 animate-spin" />}
                        Criar Documento
                    </Button>
                    <Button 
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}

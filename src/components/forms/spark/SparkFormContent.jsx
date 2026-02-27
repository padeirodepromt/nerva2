/* src/components/forms/spark/SparkFormContent.jsx
   desc: Formulário rápido para criar Thoughts/Sparks com identidade visual Prana.
   feat: glassmorphism, Framer Motion, gradients temáticos (yellow), animações.
*/
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconZap, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';

export default function SparkFormContent({ 
    initialData = {}, 
    onSave, 
    onCancel, 
    isLoading = false 
}) {
    const [title, setTitle] = React.useState(initialData.title || '');
    const [isEmpty, setIsEmpty] = React.useState(!title.trim());

    const handleChange = (e) => {
        setTitle(e.target.value);
        setIsEmpty(!e.target.value.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        await onSave({
            title: title.trim(),
            status: 'inbox',
            customData: { type: 'spark' }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="glass-effect border border-white/10 rounded-2xl bg-card prana-form-modal overflow-hidden shadow-xl"
        >
            {/* Header com Gradient Yellow/Amber */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent">
                <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <IconZap className="w-5 h-5 text-yellow-400" />
                        </motion.div>
                    </div>
                    <div>
                        <h3 className="font-serif font-semibold text-white text-glow">Nova Faísca</h3>
                        <p className="text-xs text-muted-foreground/70">Capture sua ideia rapidamente</p>
                    </div>
                </motion.div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Sua Ideia
                    </label>
                    <Input
                        type="text"
                        value={title}
                        onChange={handleChange}
                        placeholder="Descreva sua ideia, pensamento ou inspiração..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all"
                        autoFocus
                        disabled={isLoading}
                    />
                </motion.div>

                {/* Help Text */}
                <motion.p 
                    className="text-xs text-muted-foreground/70 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Sua ideia será salva na caixa de entrada para você processar, editar ou converter em tarefa.
                </motion.p>

                {/* Footer */}
                <motion.div 
                    className="flex gap-3 pt-4 border-t border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <Button 
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit"
                        disabled={isEmpty || isLoading}
                        className="flex-1 glow-effect gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <IconLoader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? 'Capturando...' : 'Capturar Faísca'}
                    </Button>
                </motion.div>
            </form>
        </motion.div>
    );
}

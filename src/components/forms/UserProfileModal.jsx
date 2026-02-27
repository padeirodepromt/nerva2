import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IconX, IconSave, IconCalendar, IconClock, IconSparkles 
} from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/api/apiClient';
import { Astral, User } from '@/api/entities';
import { toast } from "sonner";

export default function UserProfileModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        birthDate: '', 
        birthTime: '', 
        birthPlace: ''
    });
    const [calculatedData, setCalculatedData] = useState({
        sunSign: '', 
        moonSign: '', 
        risingSign: '',
        humanDesign: { type: '', authority: '', profile: '' }
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (isOpen) {
                try {
                    const user = await User.me();
                    // Lógica de carga futura aqui
                } catch (e) {}
            }
        };
        loadProfile();
    }, [isOpen]);

    // ✅ Auto-calcula dados astrológicos quando data/hora/local mudam
    useEffect(() => {
        if (formData.birthDate) {
            const dateObj = new Date(`${formData.birthDate}T${formData.birthTime || '12:00'}`);
            const sun = astrologyService.getSunSign(dateObj);
            const moon = astrologyService.getMoonPhase(dateObj);
            
            setCalculatedData(prev => ({ 
                ...prev, 
                sunSign: sun.sign,
                moonSign: moon // Aproximação: usar fase como pseudo-signo lunar
            }));
        }
    }, [formData.birthDate, formData.birthTime, formData.birthPlace]);

    const handleSave = async () => {
        if (!formData.birthDate) {
            toast.error("Data de nascimento é obrigatória.");
            return;
        }

        setIsLoading(true);
        try {
            const user = await User.me();
            // 💾 Salva dados brutos + calculados automaticamente
            const payload = {
                userId: user.id,
                birthDate: formData.birthDate,
                birthTime: formData.birthTime || '12:00',
                birthPlace: formData.birthPlace || 'Desconhecido'
            };

            // Usa o endpoint correto: /api/astral-profiles (POST)
            const response = await apiClient.post('/astral-profiles', payload);
            
            toast.success("✨ Perfil Cósmico Sincronizado!");
            console.log('[UserProfileModal] Perfil salvo:', response.data);
            
            // Gerar documento astral automaticamente
            try {
                const docResponse = await apiClient.get('/astral-profiles/document', {
                    params: { userId: user.id }
                });
                toast.success("📫 Seu Relatório Astrológico foi criado!");
                console.log('[UserProfileModal] Documento criado:', docResponse.data);
            } catch (docErr) {
                console.warn('[UserProfileModal] Erro ao gerar documento (não crítico):', docErr);
                // Não é crítico - perfil foi salvo mesmo que documento falhe
            }
            
            onSave?.(response.data);
            onClose();
        } catch (error) {
            console.error('[UserProfileModal] Erro ao salvar:', error);
            toast.error("Erro ao salvar perfil: " + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg glass-effect rounded-2xl border border-white/10 bg-card text-foreground flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-xl font-serif flex items-center gap-2">
                            <IconSparkles className="w-5 h-5 text-[rgb(var(--accent-rgb))]" />
                            Identidade Cósmica
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}><IconX className="w-5 h-5"/></Button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="space-y-6">
                            {/* SEÇÃO 1: Dados Básicos de Nascimento */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                                    <IconCalendar className="w-4 h-4 text-[rgb(var(--accent-rgb))]" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                        Dados de Nascimento
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs opacity-70 mb-2 block font-medium">📅 Data</label>
                                        <Input 
                                            type="date" 
                                            value={formData.birthDate} 
                                            onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                                            className="bg-black/30 border-white/10 focus:border-[rgb(var(--accent-rgb))] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs opacity-70 mb-2 block font-medium">🕐 Hora (Opcional)</label>
                                        <Input 
                                            type="time" 
                                            value={formData.birthTime} 
                                            onChange={e => setFormData({...formData, birthTime: e.target.value})} 
                                            className="bg-black/30 border-white/10 focus:border-[rgb(var(--accent-rgb))] transition-colors"
                                            placeholder="Se souber"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs opacity-70 mb-2 block font-medium">📍 Local de Nascimento (Opcional)</label>
                                    <Input 
                                        placeholder="Cidade, País (Ex: São Paulo, Brasil)" 
                                        value={formData.birthPlace} 
                                        onChange={e => setFormData({...formData, birthPlace: e.target.value})} 
                                        className="bg-black/30 border-white/10 focus:border-[rgb(var(--accent-rgb))] transition-colors"
                                    />
                                </div>
                            </div>

                            {/* SEÇÃO 2: Dados Calculados Automaticamente */}
                            {calculatedData.sunSign && (
                                <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-orange-500/10 border border-white/10">
                                    <div className="flex items-center gap-2 pb-3 border-b border-white/20">
                                        <IconSparkles className="w-4 h-4 text-yellow-400" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                            Mapa Astrológico Calculado
                                        </h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-center">
                                            <p className="text-xs opacity-60 mb-1 uppercase tracking-wider font-bold">Signo Solar ☉</p>
                                            <p className="text-lg font-serif font-bold text-yellow-300">{calculatedData.sunSign}</p>
                                            <p className="text-[10px] opacity-50 mt-1">Sua Essência</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-center">
                                            <p className="text-xs opacity-60 mb-1 uppercase tracking-wider font-bold">Fase Lunar 🌙</p>
                                            <p className="text-sm font-serif font-bold text-purple-300">{calculatedData.moonSign}</p>
                                            <p className="text-[10px] opacity-50 mt-1">Emoções</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-center">
                                            <p className="text-xs opacity-60 mb-1 uppercase tracking-wider font-bold">Ascendente ↑</p>
                                            <p className="text-sm font-serif font-bold text-orange-300">Em breve</p>
                                            <p className="text-[10px] opacity-50 mt-1">Sua Máscara</p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground/80 italic text-center pt-2 border-t border-white/10">
                                        ✨ O sistema analisará seu mapa completo e fornecerá insights personalizados em tempo real.
                                    </p>
                                </div>
                            )}

                            {/* SEÇÃO 3: Informações Adicionais */}
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <strong>💡 Como funciona:</strong> Você fornece apenas sua data, hora e local de nascimento. O Prana calcula seu mapa astral completo e usa essas informações para:<br/>
                                    • Análises astrológicas dinâmicas<br/>
                                    • Recomendações personalizadas<br/>
                                    • Ciclos e fases (menstruação, lunar, etc)<br/>
                                    • Sincronização com seu "Human Design"
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-white/5">
                        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isLoading} className="glow-effect">
                            <IconSave className="w-4 h-4 mr-2" /> Sincronizar Dados Cósmicos
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
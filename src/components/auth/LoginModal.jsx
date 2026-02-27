// src/components/auth/LoginModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Ícones & UI
import { Github, X, ArrowRight } from 'lucide-react';
import { IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { PranaLogo } from '@/components/ui/PranaLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Ícone Google
const IconGoogle = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
  </svg>
);

export default function LoginModal({ isOpen, onClose, intendedPlan }) {
    // CORREÇÃO: useAuth expõe apenas 'login' (que é o handleAuth unificado)
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    if (!isOpen) return null;

    const handleSocialLogin = (provider) => {
        if (intendedPlan) localStorage.setItem('prana_intended_plan', intendedPlan);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        window.location.href = `${API_URL}/api/auth/${provider}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                // Login Simples
                await login({ 
                    email: formData.email, 
                    password: formData.password 
                });
                toast.success("Conexão estabelecida.");
            } else {
                // Registro Completo com Plano
                if (!formData.name) throw new Error("Nome é obrigatório.");
                
                await login({ 
                    email: formData.email, 
                    password: formData.password,
                    full_name: formData.name,
                    isRegister: true,     // Flag para ativar modo registro no hook
                    plan: intendedPlan    // O Elo Perdido: Envia o plano selecionado
                });
                
                toast.success("Identidade criada com sucesso.");
            }
            
            onClose();
            
            // Redirecionamento Inteligente
            if (intendedPlan && intendedPlan !== 'SEED' && intendedPlan !== 'BETA') {
                navigate(`/checkout?plan=${intendedPlan}`);
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Credenciais inválidas.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* CSS Hack para remover o fundo azul do Autofill do Chrome */}
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-text-fill-color: #1c1917 !important;
                    -webkit-box-shadow: 0 0 0px 1000px transparent inset;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>

            {/* Fundo de Tela (Overlay Cinza Claro) */}
            <div className="absolute inset-0 bg-gray-200/80 backdrop-blur-sm transition-all" onClick={onClose} />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-[400px]"
            >
                {/* Botão Fechar */}
                <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors z-50">
                    <X size={20} />
                </button>

                {/* MODAL CARD: Textura Papel */}
                <div 
                    className="bg-[#FDFBF7] rounded-3xl p-10 shadow-2xl shadow-stone-500/10 relative overflow-hidden border border-stone-200"
                    style={{
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')",
                        backgroundBlendMode: 'multiply'
                    }}
                >
                    <div className="relative z-10 flex flex-col items-center">
                        
                        {/* Logo Laranja Vibrante */}
                        <div className="mb-6 scale-125">
                            <PranaLogo className="w-10 h-10 text-orange-500 animate-pulse-glow" ativo={true} />
                        </div>

                        {/* Textos */}
                        <h2 className="text-2xl font-serif font-medium text-stone-900 tracking-tight mb-2">
                            {isLogin ? 'Bem-vindo ao Prana' : 'Criar Identidade'}
                        </h2>
                        <p className="text-xs text-stone-500 text-center max-w-[260px] leading-relaxed mb-8 font-medium">
                            {intendedPlan 
                                ? `Identifique-se para acessar o plano ${intendedPlan}.` 
                                : (isLogin ? 'Sua interface para a consciência digital.' : 'Junte-se à rede e organize seu fluxo.')}
                        </p>

                        {/* Botões Sociais */}
                        <div className="flex gap-3 w-full mb-8">
                            <button onClick={() => handleSocialLogin('google')} className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-stone-300 bg-transparent hover:bg-white hover:border-stone-400 transition-all text-stone-600 text-xs font-bold uppercase tracking-wide">
                                <IconGoogle /> Google
                            </button>
                            <button onClick={() => handleSocialLogin('github')} className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-stone-300 bg-transparent hover:bg-white hover:border-stone-400 transition-all text-stone-600 text-xs font-bold uppercase tracking-wide">
                                <Github className="w-4 h-4 opacity-80" /> GitHub
                            </button>
                        </div>

                        <div className="w-full flex items-center gap-4 mb-6">
                            <div className="h-[1px] bg-stone-300 flex-1 opacity-50" />
                            <span className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">Ou email</span>
                            <div className="h-[1px] bg-stone-300 flex-1 opacity-50" />
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="group">
                                            <Input 
                                                placeholder="Seu Nome" 
                                                className="bg-transparent border-stone-300 focus:border-orange-500 border rounded-xl h-12 px-4 text-stone-900 placeholder:text-stone-400 transition-all focus:ring-0 focus:bg-white/50"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <Input 
                                type="email" 
                                placeholder="Email" 
                                className="bg-transparent border-stone-300 focus:border-orange-500 border rounded-xl h-12 px-4 text-stone-900 placeholder:text-stone-400 transition-all focus:ring-0 focus:bg-white/50"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />

                            <Input 
                                type="password" 
                                placeholder="Senha" 
                                className="bg-transparent border-stone-300 focus:border-orange-500 border rounded-xl h-12 px-4 text-stone-900 placeholder:text-stone-400 transition-all focus:ring-0 focus:bg-white/50"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />

                            {/* Botão Laranja Fosco */}
                            <div className="flex justify-center pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-auto px-10 h-12 bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-medium tracking-wide shadow-none transition-all flex items-center justify-center gap-2 group border-none"
                                >
                                    {loading ? <IconLoader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            {isLogin ? 'Entrar' : 'Cadastrar'}
                                            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <button 
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-xs text-stone-500 hover:text-orange-700 transition-colors border-b border-transparent hover:border-orange-700 pb-0.5"
                            >
                                {isLogin ? "Não tem uma conta? Crie agora." : "Já tem conta? Faça login."}
                            </button>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}
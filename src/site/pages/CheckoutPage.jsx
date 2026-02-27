/* src/site/pages/CheckoutPage.jsx
   desc: Página de Checkout v2 (Integração Asaas + Auth)
*/
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { IconLock, IconCheckCircle, IconLayout, IconLoader2, IconArrowLeft, IconHash } from '@/components/icons/PranaLandscapeIcons';
import { getAllPlansList } from '@/config/plansConfig'; // Use a função helper existente

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, token, updateUser } = useAuth(); // Hook de autenticação
    
    // Config do Plano
    const planKey = searchParams.get('plan') || 'SEED';
    
    // Busca detalhes do plano usando a config centralizada
    const allPlans = getAllPlansList();
    const planDetails = allPlans.find(p => p.key === planKey) || allPlans.find(p => p.key === 'SEED');
    
    // Preço (Lógica defensiva para mensal/anual se necessário, aqui simplificado para mensal)
    const planPrice = planDetails?.price?.monthly || 0;

    // Estado do Formulário
    const [formData, setFormData] = useState({
        name: '', email: '', cpfCnpj: '',
        cardNumber: '', cardHolder: '', cardExpiry: '', cardCcv: ''
    });

    // Estados de UI
    const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD'); 
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState(null); 
    const [success, setSuccess] = useState(false);

    // 1. Verifica Autenticação e Preenche Dados
    useEffect(() => {
        if (!user) {
            // Se não estiver logado, manda pro login com a intenção de voltar
            const redirectUrl = `/checkout?plan=${planKey}`;
            navigate(`/?redirect=${encodeURIComponent(redirectUrl)}`); // Redireciona para home que abre o modal
            return;
        }

        // Preenche dados se o usuário existir
        setFormData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || ''
        }));
    }, [user, navigate, planKey]);

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        // Formatação simples de data (MM/AA)
        if (name === 'cardExpiry' && value.length === 2 && !formData.cardExpiry.includes('/')) {
            value = value + '/';
        }
        setFormData({ ...formData, [name]: value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPixData(null);

        // URL da API
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

        try {
            // Simulamos um delay de UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Separa Mês/Ano
            const [expMonth, expYear] = formData.cardExpiry ? formData.cardExpiry.split('/') : ['', ''];

            const payload = {
                planId: planKey,
                paymentMethod,
                name: formData.name,
                email: formData.email,
                cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''), // Remove não-números
                creditCard: paymentMethod === 'CREDIT_CARD' ? {
                    holderName: formData.cardHolder,
                    number: formData.cardNumber.replace(/\s/g, ''),
                    expiryMonth: expMonth,
                    expiryYear: `20${expYear}`, // Assume século 21
                    ccv: formData.cardCcv
                } : null,
                creditCardHolderInfo: {
                    name: formData.name,
                    email: formData.email,
                    cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
                    postalCode: '00000-000', 
                    addressNumber: 'SN',
                    phone: '00000000000'
                }
            };

            const response = await fetch(`${API_URL}/payment/transparent`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // VITAL: Autentica a requisição
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (paymentMethod === 'PIX') {
                    setPixData({ payload: data.payload, image: data.encodedImage });
                    toast.success('QRCode Gerado com Sucesso!');
                } else {
                    // SUCESSO CARTÃO
                    if (data.user && updateUser) {
                        updateUser(data.user); // Atualiza o contexto global do React
                    }
                    setSuccess(true);
                    toast.success(`Bem-vindo ao ${planDetails.name}!`);
                }
            } else {
                throw new Error(data.error || 'Erro ao processar pagamento.');
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Falha na comunicação com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    if (success) return <SuccessScreen navigate={navigate} />;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans">
            
            {/* Esquerda: Resumo */}
            <div className="w-full md:w-1/3 bg-[#0a0a0c] border-r border-white/5 p-8 flex flex-col justify-center relative overflow-hidden">
                <div onClick={() => navigate('/home/plans')} className="absolute top-8 left-8 cursor-pointer text-muted-foreground hover:text-white flex items-center gap-2 transition-colors z-20">
                    <IconArrowLeft className="w-4 h-4" /> Voltar aos Planos
                </div>
                
                <div className="mt-12 bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-xl relative">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-3xl rounded-full" />

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                            <IconCheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-serif text-xl tracking-wide">{planDetails?.name || 'Plano Prana'}</h3>
                            <p className="text-sm text-emerald-400 font-medium">
                                R$ {planPrice},00 <span className="text-muted-foreground">/ mês</span>
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-white/10 my-4" />
                    <ul className="space-y-3 text-sm text-stone-400">
                        <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Desbloqueio imediato do Bioma</li>
                        <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Acesso completo ao Ash (IA)</li>
                        <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Ferramentas Holísticas avançadas</li>
                    </ul>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-stone-600">
                    <IconLock className="w-3 h-3" /> Ambiente Seguro Criptografado
                </div>
            </div>

            {/* Direita: Formulário */}
            <div className="w-full md:w-2/3 p-6 md:p-12 flex items-center justify-center bg-[#050505]">
                <div className="w-full max-w-md space-y-8">
                    
                    <div className="text-center md:text-left mb-8">
                        <h1 className="text-3xl font-light tracking-tight mb-2 text-stone-100">Finalizar Assinatura</h1>
                        <p className="text-stone-500">
                            Você está logado como <span className="text-emerald-400 font-medium">{formData.email}</span>
                        </p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        
                        {/* Seletor de Método */}
                        <div className="space-y-3">
                            <Label className="text-xs uppercase text-stone-500 font-bold tracking-widest">Método de Pagamento</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <MethodButton 
                                    active={paymentMethod === 'CREDIT_CARD'} 
                                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                                    icon={IconLayout} label="Cartão de Crédito"
                                />
                                <MethodButton 
                                    active={paymentMethod === 'PIX'} 
                                    onClick={() => setPaymentMethod('PIX')}
                                    icon={IconHash} label="Pix Instantâneo"
                                />
                            </div>
                        </div>

                        {/* Campos Dinâmicos */}
                        <div className="space-y-4 pt-2">
                             <div className="grid gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-stone-400">CPF / CNPJ (Para Nota Fiscal)</Label>
                                    <Input 
                                        name="cpfCnpj" placeholder="000.000.000-00" required 
                                        value={formData.cpfCnpj} onChange={handleInputChange}
                                        className="bg-stone-900/50 border-stone-800 text-stone-200 focus:border-emerald-500/50 h-12"
                                    />
                                </div>

                                <AnimatePresence mode="wait">
                                    {paymentMethod === 'CREDIT_CARD' ? (
                                        <motion.div 
                                            key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1">
                                                <Label className="text-xs text-stone-400">Número do Cartão</Label>
                                                <Input 
                                                    name="cardNumber" placeholder="0000 0000 0000 0000" required 
                                                    value={formData.cardNumber} onChange={handleInputChange}
                                                    className="bg-stone-900/50 border-stone-800 text-stone-200 focus:border-emerald-500/50 h-12"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                     <Label className="text-xs text-stone-400">Validade</Label>
                                                    <Input 
                                                        name="cardExpiry" placeholder="MM/AA" required maxLength="5"
                                                        value={formData.cardExpiry} onChange={handleInputChange}
                                                        className="bg-stone-900/50 border-stone-800 text-stone-200 focus:border-emerald-500/50 h-12"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-stone-400">CVC</Label>
                                                    <Input 
                                                        name="cardCcv" placeholder="123" required maxLength="4"
                                                        value={formData.cardCcv} onChange={handleInputChange}
                                                        className="bg-stone-900/50 border-stone-800 text-stone-200 focus:border-emerald-500/50 h-12"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-stone-400">Nome no Cartão</Label>
                                                <Input 
                                                    name="cardHolder" placeholder="Como impresso no cartão" required 
                                                    value={formData.cardHolder} onChange={handleInputChange}
                                                    className="bg-stone-900/50 border-stone-800 text-stone-200 focus:border-emerald-500/50 h-12"
                                                />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="pix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="text-center p-6 bg-stone-900/30 rounded-lg border border-stone-800/50 border-dashed"
                                        >
                                            {!pixData ? (
                                                <p className="text-sm text-stone-500">
                                                    Ao confirmar, um código PIX Copy & Paste será gerado. O sistema libera o acesso em segundos após o pagamento.
                                                </p>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="bg-white p-2 w-40 h-40 mx-auto rounded-lg shadow-lg">
                                                        {pixData.image && <img src={`data:image/png;base64,${pixData.image}`} alt="Pix QRCode" className="w-full h-full object-contain" />}
                                                    </div>
                                                    <div className="text-xs break-all bg-black/30 p-3 rounded-lg select-all cursor-pointer text-stone-400 font-mono border border-stone-800 hover:border-emerald-500/50 transition-colors"
                                                         onClick={() => {navigator.clipboard.writeText(pixData.payload); toast.success('Copiado!');}}>
                                                        {pixData.payload.substring(0, 40)}...
                                                    </div>
                                                    <Button type="button" size="sm" variant="outline" className="w-full border-stone-700 text-stone-300 hover:bg-stone-800"
                                                     onClick={() => {navigator.clipboard.writeText(pixData.payload); toast.success('Código Pix Copiado!');}}>
                                                        Copiar Código Pix
                                                    </Button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Botão Final */}
                        {!pixData && (
                            <Button 
                                type="submit"
                                className="w-full h-14 text-base font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-lg shadow-emerald-900/20 mt-4" 
                                disabled={loading}
                            >
                                {loading ? <IconLoader2 className="animate-spin mr-2" /> : null}
                                {loading ? 'Processando Pagamento...' : paymentMethod === 'CREDIT_CARD' ? `Pagar R$ ${planPrice},00` : 'Gerar Pagamento Pix'}
                            </Button>
                        )}
                        
                    </form>
                </div>
            </div>
        </div>
    );
}

// -- Subcomponentes Visuais --

function MethodButton({ active, onClick, icon: Icon, label }) {
    return (
        <div 
            onClick={onClick}
            className={`cursor-pointer border rounded-xl p-4 flex flex-row items-center justify-center gap-3 transition-all duration-200
                ${active 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-stone-900/30 border-stone-800 text-stone-500 hover:bg-stone-800 hover:border-stone-700 hover:text-stone-300'}
            `}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-emerald-500' : 'text-stone-600'}`} />
            <span className="font-medium text-sm">{label}</span>
        </div>
    );
}

function SuccessScreen({ navigate }) {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#050505] to-[#050505]" />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-8 max-w-md relative z-10"
            >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <IconCheckCircle className="w-10 h-10" />
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-4xl font-light tracking-tight text-white">Pagamento Confirmado</h2>
                    <p className="text-stone-400 leading-relaxed">
                        Sua semente foi plantada com sucesso. O ecossistema Prana agora está fertilizado e pronto para cultivar suas ideias.
                    </p>
                </div>

                <div className="pt-4">
                    <Button 
                        onClick={() => navigate('/dashboard')} 
                        className="w-full h-12 bg-white text-black hover:bg-stone-200 rounded-lg font-medium tracking-wide transition-all hover:scale-[1.02]"
                    >
                        Entrar no Jardim
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PranaLogo from '../../components/ui/PranaLogo';

export default function SocialCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth(); // Certifique-se de que useAuth exporta setToken ou loginManual

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // 1. Salva o token manualmente (caso o hook demore a processar)
      localStorage.setItem('prana_token', token);
      
      // 2. Atualiza o estado global de autenticação
      if (setToken) {
          setToken(token);
      }
      
      // 3. Recupera a intenção de compra (se houver)
      const intendedPlan = localStorage.getItem('prana_intended_plan');
      
      // 4. Redireciona
      setTimeout(() => {
        if (intendedPlan && intendedPlan !== 'SEED') {
            localStorage.removeItem('prana_intended_plan'); // Limpa a intenção
            window.location.href = `/checkout?plan=${intendedPlan}`;
        } else {
            window.location.href = '/dashboard';
        }
      }, 500); // Pequeno delay para garantir que o token foi gravado

    } else {
      // Se voltou sem token, algo falhou
      console.error('Callback sem token');
      navigate('/auth?error=social_failed');
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0c0a09] text-stone-300 gap-4">
       <PranaLogo className="w-12 h-12 text-emerald-500 animate-pulse" />
       <p className="text-sm font-light tracking-widest uppercase">Sincronizando Identidade...</p>
    </div>
  );
}
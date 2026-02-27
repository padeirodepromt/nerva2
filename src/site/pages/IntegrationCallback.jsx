import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Integration } from '@/api/integrations';
import { toast } from 'sonner';

export default function IntegrationCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            toast.error('Você recusou a conexão.');
            navigate('/dashboard'); // Ou página de settings
            return;
        }

        if (code) {
            // Envia o código para o backend trocar pelo token seguro
            Integration.handleCallback('google_calendar', code)
                .then(() => {
                    toast.success('Google Calendar conectado com sucesso!');
                    navigate('/dashboard'); // Ou página de settings
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Falha ao finalizar conexão.');
                    navigate('/dashboard');
                });
        }
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-[#0c0a09] text-white">
            <p>Finalizando conexão segura...</p>
        </div>
    );
}
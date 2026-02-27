/* src/App.jsx
   desc: App Root v8.3 (All Callbacks Integrated)
*/
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Provedores
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LanguageProvider } from '@/components/LanguageProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { BiomeProvider } from './contexts/BiomeContext'; 
import { OllyProvider } from './contexts/OllyContext'; 

// Serviços
import { ashProactive } from './services/ashProactiveService';
import notificationService from './services/notificationService';

// Componentes
import PranaLoader from '@/components/PranaLoader';
import LoginModal from '@/components/auth/LoginModal';
import PranaWorkspaceLayout from '@/pages/PranaWorkspaceLayout';
import MobileWorkspaceLayout from '@/components/mobile/MobileWorkspaceLayout';
import PranaWebsite from '@/site/PranaWebsite';
import PlansPage from '@/site/pages/PlansPage';
import CheckoutPage from '@/site/pages/CheckoutPage';
import SocialCallback from '@/site/pages/SocialCallback'; 
import IntegrationCallback from '@/site/pages/IntegrationCallback'; // <--- IMPORT NOVO
import LandingPageHolistic_Backup from './site/personas/LandingPageHolistic_Backup';
import AshPage from './site/pages/AshPage';
import LandingPageHolistic from './site/personas/LandingPageHolistic';
import PranaSanctuary from './site/pages/PranaSanctuary';
import LandingPageBeta from './site/personas/LandingPageBeta';

import { registerAllProtocolAdapters } from "@/modules/protocols/registerAdapters";
registerAllProtocolAdapters();

function AppContent() {
    const { user, isLoading, userPlan } = useAuth();
    const isMobile = useIsMobile();

    // --- CONSCIÊNCIA DO ASH ---
    useEffect(() => {
        const initAsh = async () => {
            if (user) {
                await notificationService.initPushNotifications();
                ashProactive.startMonitoring(userPlan || 'SEED');
            } else {
                ashProactive.stopMonitoring();
            }
        };

        initAsh();
        
        const handleNotificationClick = (event) => {
            const { detail } = event;
            console.log("[App] Notificação clicada:", detail);
        };

        window.addEventListener('notificationTapped', handleNotificationClick);

        return () => {
            ashProactive.stopMonitoring();
            window.removeEventListener('notificationTapped', handleNotificationClick);
        };
    }, [user, userPlan]); 

    if (isLoading) return <PranaLoader fullScreen text="Carregando cockpit..." />;

    return (
        <Routes>
            {/* ROTAS PÚBLICAS (Site) */}
            <Route path="/home" element={<LandingPageHolistic />} />
            <Route path="/home/plans" element={<PlansPage />} />
            <Route path="/home/checkout" element={<CheckoutPage />} />
            <Route path="/home/beta" element={<LandingPageBeta />} />
            
            {/* --- FLUXO DE VENDAS & AUTH --- */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth/callback" element={<SocialCallback />} />
            
            {/* --- CALLBACKS DE INTEGRAÇÃO (Calendar/Github) --- */}
            <Route path="/settings/integrations/callback" element={<IntegrationCallback />} /> {/* <--- ROTA ADICIONADA */}

            {/* Rotas de Demonstração / Legado */}
            <Route path="/old-home" element={<PranaWebsite />} />
            <Route path="/backup" element={<LandingPageHolistic_Backup />} />
            <Route path="/ash" element={<AshPage />} />
            <Route path="/sanc" element={<PranaSanctuary />} />

            {/* ROTA RAIZ (Login ou Workspace) */}
            <Route path="/" element={
                !user ? (
                    <>
                         <div className="fixed inset-0 w-full h-full bg-background" />
                         <LoginModal isOpen={true} />
                    </>
                ) : (
                    isMobile ? <MobileWorkspaceLayout /> : <PranaWorkspaceLayout />
                )
            } />

            {/* FALLBACK */}
            <Route path="/*" element={
                !user ? <Navigate to="/" replace /> : (
                    isMobile ? <MobileWorkspaceLayout /> : <PranaWorkspaceLayout />
                )
            } />
        </Routes>
    );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider defaultTheme="prana-dark" storageKey="prana-ui-theme">
          <BiomeProvider>
            <OllyProvider>
              <TooltipProvider>
                <Router>
                  <AppContent />
                  <Toaster />
                </Router>
              </TooltipProvider>
            </OllyProvider>
          </BiomeProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
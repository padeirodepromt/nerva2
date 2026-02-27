// src/hooks/usePermission.js
import { useState, useEffect } from 'react';
// import { useAuth } from './useAuth'; // No futuro, pegaremos do user real
import { PLAN_DETAILS, PLANS, canUserAccess, getPlanLimit } from '@/config/plansConfig';

// Mock temporário enquanto não temos stripe
const MOCK_USER_PLAN = PLANS.SEED; // Mude aqui para testar outros planos

export function usePermission(featureKey) {
    // const { user } = useAuth();
    // const userPlan = user?.plan || PLANS.SEED;
    const userPlan = MOCK_USER_PLAN;
    
    // 1. Verificação Booleana (Acesso Sim/Não)
    const hasAccess = canUserAccess(userPlan, featureKey);

    // 2. Dados do Plano (Para mostrar "Upgrade para Floresta")
    const currentPlan = PLAN_DETAILS[userPlan];
    
    // 3. Limites (Se for uma feature baseada em consumo)
    const getLimit = (limitKey) => getPlanLimit(userPlan, limitKey);

    return {
        hasAccess,
        planName: currentPlan.name,
        getLimit,
        isFree: userPlan === 'SEED',
        isPro: userPlan === 'FOREST' || userPlan === 'MOUNTAIN'
    };
}

export function useCredits() {
    // const { user } = useAuth();
    const userPlan = MOCK_USER_PLAN;
    const limit = getPlanLimit(userPlan, 'messagesPerMonth');
    
    // Mock de uso (no futuro virá do banco de dados)
    const [used, setUsed] = useState(42); 

    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);
    const percentage = limit === Infinity ? 0 : (used / limit) * 100;

    let status = 'good'; // good, warning, danger
    if (percentage > 80) status = 'warning';
    if (percentage >= 100) status = 'danger';

    return {
        used,
        limit,
        remaining,
        percentage,
        status,
        planName: PLAN_DETAILS[userPlan].name
    };
}

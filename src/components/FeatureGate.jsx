/**
 * FeatureGate.jsx
 * 
 * Componente para bloquear/permitir acesso a features
 * baseado no plano do usuário
 */

import React from 'react';
import { usePlanValidation } from '@/hooks/usePlanValidation';
import { motion } from 'framer-motion';
import { IconLock } from '@/components/icons/PranaLandscapeIcons';
import { Button } from '@/components/ui/button';

/**
 * FeatureGate principal
 * 
 * @param {string|Array} feature - Feature(s) a validar
 * @param {React.ReactNode} children - Conteúdo a renderizar se tem acesso
 * @param {React.ReactNode} fallback - Conteúdo alternativo se não tem acesso
 * @param {boolean} silent - Se true, retorna null ao invés de mostrar fallback
 * @param {string} mode - 'all' (AND) ou 'any' (OR) para múltiplas features
 */
export const FeatureGate = ({ 
  feature, 
  children, 
  fallback = null,
  silent = false,
  mode = 'all'
}) => {
  const { hasAccess, hasAllFeatures, hasAnyFeature } = usePlanValidation();

  // Validar acesso
  let hasPermission = false;
  
  if (Array.isArray(feature)) {
    hasPermission = mode === 'all' 
      ? hasAllFeatures(feature)
      : hasAnyFeature(feature);
  } else {
    hasPermission = hasAccess(feature);
  }

  // Se tem permissão, renderizar conteúdo
  if (hasPermission) {
    return <>{children}</>;
  }

  // Se silent, retornar null
  if (silent) {
    return null;
  }

  // Mostrar fallback
  return fallback;
};

export default FeatureGate;

/**
 * Componente de bloqueio visual para features não disponíveis
 * 
 * @param {string|Array} feature - Feature(s) a validar
 * @param {React.ReactNode} children - Conteúdo a bloquear
 * @param {string} planRequired - Plano necessário (para mensagem)
 */
export const FeatureLock = ({ 
  feature, 
  children, 
  planRequired = 'Pro ou superior',
  title = 'Recurso Bloqueado'
}) => {
  const { hasAccess, hasAllFeatures, hasAnyFeature } = usePlanValidation();

  // Validar acesso
  let hasPermission = false;
  
  if (Array.isArray(feature)) {
    hasPermission = hasAllFeatures(feature);
  } else {
    hasPermission = hasAccess(feature);
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative group"
    >
      <div className="opacity-50 pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay de bloqueio */}
      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center gap-2 text-center">
          <IconLock className="w-6 h-6 text-white" />
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-white/80">{planRequired}</div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Fallback padrão para features bloqueadas
 */
export const FeatureLockedFallback = ({ 
  title = 'Recurso Disponível em Planos Premium',
  description = 'Atualize sua assinatura para acessar este recurso',
  onUpgrade,
  showButton = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 rounded-lg border border-white/10 bg-white/[0.02]"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 mb-4">
        <IconLock className="w-6 h-6 text-amber-500" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
        {description}
      </p>
      
      {showButton && onUpgrade && (
        <Button 
          onClick={onUpgrade}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          Fazer Upgrade
        </Button>
      )}
    </motion.div>
  );
};

/**
 * HOC para envolver componentes e bloquear se não tiver acesso
 */
export function withFeatureGate(Component, feature, fallback = null) {
  return function FeatureGatedComponent(props) {
    return (
      <FeatureGate feature={feature} fallback={fallback}>
        <Component {...props} />
      </FeatureGate>
    );
  };
}

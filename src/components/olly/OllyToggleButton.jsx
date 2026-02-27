import React from 'react';
import { Button } from '@/components/ui/button';
import { IconBot, IconX } from '@/components/icons/PranaLandscapeIcons';
import { useOllyStore } from '@/stores/useOllyStore';
import { useAuth } from '@/hooks/useAuth'; // Hook para pegar o usuário
import { canUserAccess } from '@/config/plansConfig'; // Lógica de permissão

/**
 * @component OllyToggleButton
 * @description Botão para ativar/desativar Olly no sistema.
 * Agora com verificação de segurança: só renderiza se o plano permitir.
 */
export default function OllyToggleButton() {
  const { isOllyEnabled, toggleOlly } = useOllyStore();
  const { user } = useAuth(); // Pegamos o usuário logado e seu plano

  // 1. Verificação de Segurança
  // Se não houver usuário ou o plano não tiver acesso ao 'olly_agent', não mostra nada.
  // Isso garante que usuários Seed/Flux/Forest nem vejam o botão.
  const hasAccess = user?.plan && canUserAccess(user.plan, 'olly_agent');

  if (!hasAccess) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant={isOllyEnabled ? 'default' : 'outline'}
      onClick={toggleOlly}
      title={isOllyEnabled ? 'Desativar Olly' : 'Ativar Olly'}
      className={`flex items-center gap-2 text-xs font-medium ${
        isOllyEnabled
          ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/40 text-blue-400'
          : 'bg-transparent hover:bg-muted/50 border-border/30 text-muted-foreground'
      }`}
    >
      {isOllyEnabled ? (
        <>
          <IconBot className="w-3.5 h-3.5" />
          <span>Olly Ativo</span>
        </>
      ) : (
        <>
          <IconX className="w-3.5 h-3.5 opacity-50" />
          <span>Olly Desativado</span>
        </>
      )}
    </Button>
  );
}
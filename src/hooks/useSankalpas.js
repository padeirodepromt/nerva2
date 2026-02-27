/* src/hooks/useSankalpas.js
   desc: Hook de Gestão de Intenções V10.
   feat: Filtragem por Realm e integração com o motor de progresso.
*/
import { useState, useEffect, useCallback } from 'react';
import { Sankalpa } from '@/api/entities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export function useSankalpas() {
  const [sankalpas, setSankalpas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeRealmId } = useWorkspaceStore();

  const fetchSankalpas = useCallback(async () => {
    try {
      setLoading(true);
      // Poda Radical: O servidor só devolve o que pertence ao Universo ativo
      const params = activeRealmId !== 'all' ? { realmId: activeRealmId } : {};
      const data = await Sankalpa.list(params);
      setSankalpas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erro ao sintonizar Sankalpas:", e);
    } finally {
      setLoading(false);
    }
  }, [activeRealmId]);

  useEffect(() => {
    fetchSankalpas();
    window.addEventListener('prana:refresh-sankalpas', fetchSankalpas);
    return () => window.removeEventListener('prana:refresh-sankalpas', fetchSankalpas);
  }, [fetchSankalpas]);

  return { sankalpas, loading, refetch: fetchSankalpas };
}
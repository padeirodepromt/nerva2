import { useEffect, useState, useCallback } from "react";
import { BrandCodeSystem } from "@/api/system/brandcode";

/**
 * Hook: carrega o estado do BrandCode do projeto
 * - usa BrandCodeSystem.getProjectState(projectId)
 * - retorna { loading, error, state, refresh }
 */
export function useBrandCodeProjectState(projectId) {
  const [loading, setLoading] = useState(!!projectId);
  const [error, setError] = useState(null);
  const [state, setState] = useState(null);

  const fetchState = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    try {
      const data = await BrandCodeSystem.getProjectState(projectId);
      setState(data || null);
    } catch (e) {
      setError(e?.message || "Falha ao carregar BrandCode.");
      setState(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return { loading, error, state, refresh: fetchState };
}
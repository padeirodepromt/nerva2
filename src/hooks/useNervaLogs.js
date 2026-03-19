// src/hooks/useNervaLogs.js
import { useEffect, useMemo, useRef, useState } from "react";
import { nervaClient } from "../api/nervaClient";

export function useNervaLogs(filters, { pollMs = 2500 } = {}) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    logs: []
  });

  const stableKey = useMemo(() => JSON.stringify(filters || {}), [filters]);
  const timerRef = useRef(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    async function loadOnce() {
      try {
        const res = await nervaClient.getLogs(filters || {});
        if (!aliveRef.current) return;
        setState({ loading: false, error: null, logs: res.logs || [] });
      } catch (e) {
        if (!aliveRef.current) return;
        setState((s) => ({ ...s, loading: false, error: e?.message || "ERROR" }));
      }
    }

    loadOnce();

    timerRef.current = setInterval(loadOnce, pollMs);

    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stableKey, pollMs]);

  return state;
}
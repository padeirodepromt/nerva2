// src/modules/protocols/useProtocolRuntime.js
import { useCallback, useMemo, useRef, useState } from "react";
import { createProtocolHost } from "./protocolHost";
import { createProtocolAdapter } from "./protocolRegistry";

function safeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useProtocolRuntime() {
  const hostRef = useRef(null);
  const [active, setActive] = useState(null); // { adapterKey, title?, context? }
  const [localMessages, setLocalMessages] = useState([]);
  const [uiHints, setUiHints] = useState(null);
  const [busy, setBusy] = useState(false);

  const start = useCallback(async ({ adapterKey, context, title }, deps = {}) => {
    setBusy(true);
    setUiHints(null);
    setLocalMessages([]);

    const adapter = createProtocolAdapter(adapterKey, deps);
    const host = createProtocolHost({ adapter });

    hostRef.current = host;
    setActive({ adapterKey, context, title: title || adapterKey });

    try {
      const out = await host.start(context);

      const msgs = (out?.messages || []).map((m) => ({
        id: safeId(),
        __local: true,
        ...m
      }));

      setLocalMessages(msgs);
      setUiHints(out?.uiHints || null);

      return out;
    } finally {
      setBusy(false);
    }
  }, []);

  const stop = useCallback(() => {
    hostRef.current?.reset?.();
    hostRef.current = null;
    setActive(null);
    setLocalMessages([]);
    setUiHints(null);
    setBusy(false);
  }, []);

  const sendUser = useCallback(async (text) => {
    if (!hostRef.current) return;

    setBusy(true);
    setUiHints(null);

    // registra msg do usuário no transcript local
    setLocalMessages((prev) => [
      ...prev,
      { id: safeId(), role: "user", content: text, __local: true }
    ]);

    try {
      const out = await hostRef.current.userMessage(text);

      const msgs = (out?.messages || []).map((m) => ({
        id: safeId(),
        __local: true,
        ...m
      }));

      if (msgs.length) {
        setLocalMessages((prev) => [...prev, ...msgs]);
      }

      setUiHints(out?.uiHints || null);
      return out;
    } finally {
      setBusy(false);
    }
  }, []);

  const action = useCallback(async (actionKey, payload) => {
    if (!hostRef.current) return;

    setBusy(true);
    try {
      const out = await hostRef.current.action(actionKey, payload);

      const msgs = (out?.messages || []).map((m) => ({
        id: safeId(),
        __local: true,
        ...m
      }));

      if (msgs.length) {
        setLocalMessages((prev) => [...prev, ...msgs]);
      }

      setUiHints(out?.uiHints || null);
      return out;
    } finally {
      setBusy(false);
    }
  }, []);

  const protocolActive = !!active;

  return {
    protocolActive,
    active,
    localMessages,
    uiHints,
    busy,
    start,
    stop,
    sendUser,
    action
  };
}
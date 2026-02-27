/* src/components/shop/ShopDrawer.jsx
   desc: Shop Drawer V1 (Right Rail)
   goal: catálogo + contratar packs
*/

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ShopAPI } from '@/api/shop';
import { IconX, IconSankalpa, IconZap } from '@/components/icons/PranaLandscapeIcons';

export default function ShopDrawer({ open, onClose, projectId, onAfterAction }) {
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);
  const [busyKey, setBusyKey] = useState(null);

  const products = useMemo(() => catalog?.products || [], [catalog]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ShopAPI.getCatalog();
      setCatalog(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const hire = async (productKey) => {
    try {
      setBusyKey(productKey);
      await ShopAPI.hire(productKey);
      await refresh();
      onAfterAction?.();
    } catch (e) {
      console.error('[ShopDrawer] hire failed', e);
      setError(e);
    } finally {
      setBusyKey(null);
    }
  };

  const unhire = async (productKey) => {
    try {
      setBusyKey(productKey);
      await ShopAPI.unhire(productKey);
      await refresh();
      onAfterAction?.();
    } catch (e) {
      console.error('[ShopDrawer] unhire failed', e);
      setError(e);
    } finally {
      setBusyKey(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={() => onClose?.()}
      />

      {/* Rail */}
      <div className={cn(
        "absolute right-0 top-0 h-full w-[420px] max-w-[92vw]",
        "border-l border-white/10",
        "bg-white/5 backdrop-blur-xl",
        "shadow-2xl"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex flex-col">
            <div className="text-zinc-100 font-semibold">Widgets</div>
            <div className="text-xs text-zinc-400">
              {projectId ? `Projeto ativo: ${projectId}` : 'Selecione um projeto para habilitar widgets'}
            </div>
          </div>

          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
            onClick={() => onClose?.()}
            title="Fechar"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {loading && (
            <div className="text-sm text-zinc-400">Carregando catálogo...</div>
          )}

          {error && (
            <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
              {error?.message || 'Erro no Shop'}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-sm text-zinc-400">Nenhum produto encontrado.</div>
          )}

          <div className="flex flex-col gap-3">
            {products.map((p) => {
              const installed = !!p?.status?.installed;
              const busy = busyKey === p.productKey;

              const Icon = p.productKey === 'brandcode_pack' ? IconSankalpa : IconZap;

              return (
                <div
                  key={p.productKey}
                  className={cn(
                    "rounded-2xl p-4 border",
                    "bg-white/5 border-white/10",
                    "hover:bg-white/7 transition-colors"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center",
                      installed ? "bg-primary/15 text-primary" : "bg-white/5 text-zinc-300"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-zinc-100 font-medium">{p.title}</div>
                        <span className={cn(
                          "text-[11px] px-2 py-1 rounded-full border",
                          installed
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-white/10 bg-white/5 text-zinc-300"
                        )}>
                          {installed ? 'Instalado' : 'Disponível'}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-400 mt-1">
                        {p.description}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        {!installed ? (
                          <button
                            onClick={() => hire(p.productKey)}
                            disabled={busy}
                            className={cn(
                              "px-3 py-2 rounded-xl text-sm",
                              "bg-primary/15 text-primary border border-primary/20",
                              "hover:bg-primary/20 transition-colors",
                              busy && "opacity-60"
                            )}
                          >
                            {busy ? 'Instalando...' : 'Contratar e Instalar'}
                          </button>
                        ) : (
                          <button
                            onClick={() => unhire(p.productKey)}
                            disabled={busy}
                            className={cn(
                              "px-3 py-2 rounded-xl text-sm",
                              "bg-white/5 text-zinc-300 border border-white/10",
                              "hover:bg-white/8 transition-colors",
                              busy && "opacity-60"
                            )}
                          >
                            {busy ? 'Pausando...' : 'Pausar'}
                          </button>
                        )}

                        <button
                          onClick={() => refresh()}
                          className="px-3 py-2 rounded-xl text-sm bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/8 transition-colors"
                        >
                          Atualizar
                        </button>
                      </div>

                      <div className="mt-3 text-[11px] text-zinc-500">
                        {p?.billing?.note || 'Cobrança por projeto habilitado.'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-xs text-zinc-500">
            Dica: instalar no workspace deixa o widget “apagado” nos projetos. Ele só ganha vida quando você habilita por projeto.
          </div>
        </div>
      </div>
    </div>
  );
}
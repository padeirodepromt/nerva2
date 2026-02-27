import React, { useEffect, useMemo, useState } from "react";
import BrandCodeDNAWidget from "@/components/system/brandcode/BrandCodeDNACanvas";
import { cn } from "@/lib/utils";
import { IconSankalpa, IconZap, IconArrowRight } from "@/components/icons/PranaLandscapeIcons";

/**
 * BrandCodeView V2 (Lego Model B)
 * - Shop installs in workspace (user_systems.brand_code = installed)
 * - Projects are dimmed until enabled (project_systems.brand_code = enabled)
 * - Protocol only starts when enabled
 *
 * Props:
 * - projectId: string (required)
 * - onOpenProtocol: function(kickoff) -> open Interview UI (optional)
 */
export default function BrandCodeView({ projectId, onOpenProtocol }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyAction, setBusyAction] = useState(null);
  const [error, setError] = useState(null);

  const installed = !!state?.installed;
  const enabled = !!state?.enabled;

  const brandCode = state?.brandCode || null;
  const status = brandCode?.status || "unknown";

  const isEmpty = status === "empty" || !brandCode;
  const isBuilding = status === "building";
  const isActive = status === "active";

  const title = useMemo(() => {
    if (!projectId) return "BrandCode";
    return "BrandCode";
  }, [projectId]);

  const fetchState = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/system/brandcode/project/${projectId}`, {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || `Falha ao carregar BrandCode (${res.status})`);
      }
      setState(json?.data || json);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const openShop = () => {
    // 1) evento global (ideal)
    window.dispatchEvent(new CustomEvent("prana:open-shop", { detail: { focus: "brandcode_pack" } }));
    // 2) fallback: se você estiver usando o ShopDrawer via Sidebar, ele pode escutar esse evento
  };

  const enableProject = async () => {
    if (!projectId) return;
    setBusyAction("enable");
    setError(null);
    try {
      const res = await fetch(`/api/system/brandcode/project/${projectId}/enable`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        const err = new Error(json?.error || `Falha ao habilitar (${res.status})`);
        err.code = json?.code || null;
        throw err;
      }
      await fetchState();
    } catch (e) {
      // Se não instalado, abre shop
      if (e?.code === "SHOP_REQUIRED" || `${e?.message || ""}`.toLowerCase().includes("shop")) {
        openShop();
      } else {
        setError(e);
      }
    } finally {
      setBusyAction(null);
    }
  };

  const startProtocol = async () => {
    if (!projectId) return;
    setBusyAction("start");
    setError(null);
    try {
      const res = await fetch(`/api/system/brandcode/project/${projectId}/start`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        const err = new Error(json?.error || `Falha ao iniciar protocolo (${res.status})`);
        err.code = json?.code || null;
        throw err;
      }

      const kickoff = json?.data?.florKickoff || json?.data || null;

      // Você controla a UI do protocolo fora daqui.
      // Passamos o kickoff pra quem sabe abrir o Interview.
      if (onOpenProtocol) onOpenProtocol(kickoff);

      // Atualiza state pra refletir "building"
      await fetchState();
    } catch (e) {
      if (e?.code === "SHOP_REQUIRED" || `${e?.message || ""}`.toLowerCase().includes("shop")) {
        openShop();
      } else {
        setError(e);
      }
    } finally {
      setBusyAction(null);
    }
  };

  // --------------------------
  // UI blocks
  // --------------------------
  const Shell = ({ children }) => (
    <div className="p-6">
      <div className={cn(
        "rounded-3xl overflow-hidden border border-white/10",
        "bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_20px_80px_rgba(0,0,0,0.15)]"
      )}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <IconSankalpa className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-zinc-100 font-semibold">{title}</div>
              <div className="text-xs text-zinc-400">
                {loading ? "Sincronizando estado..." : explainStatus(installed, enabled, status)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchState}
              className="px-3 py-2 rounded-xl text-xs bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/8 transition-colors"
              title="Atualizar"
            >
              Atualizar
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200 text-sm">
          {error?.message || "Erro desconhecido"}
        </div>
      )}
    </div>
  );

  // Guard rails
  if (!projectId) {
    return (
      <Shell>
        <EmptyState
          title="Selecione um projeto"
          subtitle="O BrandCode vive por projeto. Escolha um projeto para habilitar e iniciar o protocolo."
          primaryLabel="Abrir Projetos"
          onPrimary={() => window.dispatchEvent(new CustomEvent("prana:open-project-hub"))}
          icon={<IconZap className="w-5 h-5" />}
        />
      </Shell>
    );
  }

  if (loading && !state) {
    return (
      <Shell>
        <div className="text-sm text-zinc-400">Carregando...</div>
      </Shell>
    );
  }

  // Not installed (workspace)
  if (!installed) {
    return (
      <Shell>
        <EmptyState
          title="BrandCode não instalado"
          subtitle="Para usar o BrandCode, contrate o pack no Shop. Isso instala a Flor no seu workspace e prepara os projetos."
          primaryLabel={busyAction ? "..." : "Abrir Shop"}
          onPrimary={openShop}
          icon={<IconSankalpa className="w-5 h-5" />}
          secondaryLabel="Entendi"
          onSecondary={() => {}}
        />
      </Shell>
    );
  }

  // Installed but not enabled in this project
  if (installed && !enabled) {
    return (
      <Shell>
        <EmptyState
          title="Widget instalado, mas apagado"
          subtitle="Este projeto ainda não habilitou o BrandCode. Ao habilitar, ele passa a viver aqui e entra em cobrança por projeto."
          primaryLabel={busyAction === "enable" ? "Habilitando..." : "Habilitar neste projeto"}
          onPrimary={enableProject}
          icon={<IconZap className="w-5 h-5" />}
          secondaryLabel="Abrir Shop"
          onSecondary={openShop}
        />
      </Shell>
    );
  }

  // Enabled, but no DNA yet → start protocol
  if (enabled && (isEmpty || isBuilding)) {
    return (
      <Shell>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-zinc-100 font-medium">Protocolo Flor</div>
            <div className="text-sm text-zinc-400 mt-1">
              O DNA só nasce depois do protocolo fechar. Até lá, você está construindo as fundações.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startProtocol}
              disabled={busyAction === "start"}
              className={cn(
                "px-4 py-3 rounded-2xl text-sm font-medium",
                "bg-primary/15 text-primary border border-primary/20",
                "hover:bg-primary/20 transition-colors",
                busyAction === "start" && "opacity-60"
              )}
            >
              <span className="inline-flex items-center gap-2">
                {busyAction === "start" ? "Iniciando..." : "Iniciar protocolo"}
                <IconArrowRight className="w-4 h-4" />
              </span>
            </button>

            <button
              onClick={fetchState}
              className="px-4 py-3 rounded-2xl text-sm bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/8 transition-colors"
            >
              Ver estado
            </button>
          </div>

          {/* Preview do Widget DNA (ainda pode ser vazio) */}
          <div className="mt-4">
            <BrandCodeDNAWidget
              projectId={projectId}
              onOpenBrandCode={() => {}}
              onOpenProtocol={onOpenProtocol || (() => {})}
            />
          </div>
        </div>
      </Shell>
    );
  }

  // Active (DNA exists)
  return (
    <Shell>
      <BrandCodeDNAWidget
        projectId={projectId}
        onOpenBrandCode={() => {}}
        onOpenProtocol={onOpenProtocol || (() => {})}
      />
    </Shell>
  );
}

// --------------------------
// Presentational helpers
// --------------------------
function explainStatus(installed, enabled, status) {
  if (!installed) return "Contrate no Shop para instalar no workspace.";
  if (installed && !enabled) return "Instalado no workspace. Apagado neste projeto até habilitar.";
  if (enabled && (status === "empty")) return "Habilitado. DNA ainda não nasceu (protocolo pendente).";
  if (enabled && status === "building") return "Habilitado. Construindo fundação (Flor).";
  if (enabled && status === "active") return "Habilitado. DNA vivo disponível.";
  return "Estado sincronizado.";
}

function EmptyState({ title, subtitle, primaryLabel, onPrimary, secondaryLabel, onSecondary, icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-200">
          {icon}
        </div>

        <div className="flex-1">
          <div className="text-zinc-100 font-semibold">{title}</div>
          <div className="text-sm text-zinc-400 mt-1">{subtitle}</div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={onPrimary}
              className="px-4 py-3 rounded-2xl text-sm font-medium bg-primary/15 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {primaryLabel}
            </button>

            {secondaryLabel && (
              <button
                onClick={onSecondary}
                className="px-4 py-3 rounded-2xl text-sm bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/8 transition-colors"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
/* src/components/ui/sidebar.jsx
   desc: Activity Bar Mestre V11.1 (Neural OS Core + Lego Widgets + Shop Event Bridge).
   feat:
   - Core fixo + Widgets dinâmicos (contratados no Shop)
   - ShopDrawer (rail direito) para contratar/gerenciar packs
   - Bridge: escuta evento global "prana:open-shop" para abrir o rail a partir de qualquer View.
*/

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';
import { VIEW_TYPES } from '@/config/viewTypes';
import { PlanUsageIndicator } from '@/components/ui/PlanUsageIndicator';

// Realms
import RealmSwitcher from '@/components/layout/RealmSwitcher';

// Shop + Widgets
import ShopDrawer from '@/components/shop/ShopDrawer';
import { useProjectWidgets } from '@/hooks/useProjectWidgets';

// Backend API for enabling BrandCode
async function enableBrandCodeForProject(projectId) {
  const res = await fetch(`/api/system/brandcode/project/${projectId}/enable`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    const msg = json?.error || `Enable failed (${res.status})`;
    const code = json?.code || null;
    const err = new Error(msg);
    err.code = code;
    throw err;
  }
  return json?.data || json;
}

// Ícones Oficiais
import {
  IconDashboard, IconCosmos, IconSettings, IconList,
  IconFolder, IconHash, IconNeural, IconSankalpa, IconCronos,
  IconMatrix, IconPapyrus, IconLogOut, IconSearch, IconZap
} from '@/components/icons/PranaLandscapeIcons';

export default function Sidebar({ className, activePanel, onPanelChange, isManifestModalOpen = false }) {
  const {
    openTab,
    tabGroups,
    layout,
    toggleExplorer,
    openSmartModal,
    openPranaForm,
    activeRealmId,

    // possíveis campos no store
    activeProjectId,
    currentProjectId,
    activeProject,
    projectContext,
    selectedProjectId,
    focusedProjectId
  } = useWorkspaceStore();

  const { logout } = useAuth();
  const { t } = useTranslations();

  const [shopOpen, setShopOpen] = useState(false);
  const [shopFocus, setShopFocus] = useState(null); // ex: "brandcode_pack"
  const [busyWidgetKey, setBusyWidgetKey] = useState(null);

  // Identifica a aba ativa para highlight
  const activeTab = tabGroups.main.tabs.find(tt => tt.id === tabGroups.main.activeId);
  const activeTabType = activeTab?.type;

  // ----------------------------------------------------------
  // Bridge: Views -> Sidebar (abrir ShopDrawer)
  // ----------------------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      // evento disparado por BrandCodeView e outros
      const focus = e?.detail?.focus || null;
      setShopFocus(focus);
      setShopOpen(true);
    };
    window.addEventListener('prana:open-shop', handler);
    return () => window.removeEventListener('prana:open-shop', handler);
  }, []);

  // ----------------------------------------------------------
  // Project context (estado dos widgets por projeto)
  // ----------------------------------------------------------
  const projectId = useMemo(() => {
    return (
      activeProjectId ||
      currentProjectId ||
      selectedProjectId ||
      focusedProjectId ||
      activeProject?.id ||
      projectContext?.id ||
      layout?.projectId ||
      layout?.context?.projectId ||
      null
    );
  }, [
    activeProjectId,
    currentProjectId,
    selectedProjectId,
    focusedProjectId,
    activeProject?.id,
    projectContext?.id,
    layout?.projectId,
    layout?.context?.projectId
  ]);

  const { widgets, refresh: refreshWidgets } = useProjectWidgets(projectId);

  // ----------------------------------------------------------
  // AÇÕES DE NAVEGAÇÃO
  // ----------------------------------------------------------
  const handlePanelClick = (panelId) => {
    if (activePanel === panelId && layout?.explorer?.open) {
      toggleExplorer();
    } else {
      if (onPanelChange) onPanelChange(panelId);
      if (!layout?.explorer?.open) toggleExplorer();
    }
  };

  const handleSettingsClick = () => {
    const isSettingsActive = activeTabType === VIEW_TYPES.SETTINGS;
    if (isSettingsActive) {
      openTab({ type: VIEW_TYPES.DASHBOARD, title: t('nav_dashboard') }, 'main');
    } else {
      openTab({ type: VIEW_TYPES.SETTINGS, title: t('nav_settings') }, 'main');
    }
  };

  const handleCreate = (itemType = null) => {
    if (itemType) openPranaForm({ itemType });
    else openSmartModal();
  };

  const handleSearch = () => {
    window.dispatchEvent(new CustomEvent('prana:open-command-palette'));
  };

  const openWidgetView = (widget) => {
    if (widget?.widgetKey === 'brandcode') {
      const type = VIEW_TYPES.BRANDCODE || VIEW_TYPES.BRANDCODE_VIEW || 'BRANDCODE_VIEW';
      openTab({ type, title: 'BrandCode', meta: { route: '/brandcode', widgetKey: 'brandcode' } }, 'main');
      return;
    }

    const type = widget?.ui?.view || widget?.ui?.viewType || widget?.ui?.route || widget?.widgetKey || 'WIDGET';
    openTab({ type, title: widget?.title || 'Widget', meta: { widgetKey: widget?.widgetKey } }, 'main');
  };

  const handleWidgetClick = async (widget) => {
    if (!widget) return;

    if (!projectId) {
      setShopFocus(widget?.widgetKey === 'brandcode' ? 'brandcode_pack' : null);
      setShopOpen(true);
      return;
    }

    const st = widget.state || {};
    const isLocked = !!st.locked;
    const isDimmed = !!st.dimmed;
    const isEnabled = !!st.enabled;

    if (isLocked) {
      setShopFocus(widget?.widgetKey === 'brandcode' ? 'brandcode_pack' : null);
      setShopOpen(true);
      return;
    }

    if (isEnabled) {
      openWidgetView(widget);
      return;
    }

    if (isDimmed) {
      try {
        setBusyWidgetKey(widget.widgetKey);
        if (widget.widgetKey === 'brandcode') {
          await enableBrandCodeForProject(projectId);
          await refreshWidgets();
          openWidgetView(widget);
        } else {
          openWidgetView(widget);
        }
      } catch (e) {
        if (e?.code === 'SHOP_REQUIRED' || `${e?.message || ''}`.toLowerCase().includes('shop')) {
          setShopFocus(widget?.widgetKey === 'brandcode' ? 'brandcode_pack' : null);
          setShopOpen(true);
        } else {
          console.error('[Sidebar] widget enable failed:', e);
        }
      } finally {
        setBusyWidgetKey(null);
      }
    }
  };

  const sidebarWidgets = useMemo(() => {
    return (widgets || []).filter(w => {
      if (w?.state?.visible) return true;
      if (w?.state?.locked) return true;
      return false;
    });
  }, [widgets]);

  const hasAnyWidgets = sidebarWidgets.length > 0;

  return (
    <div className={cn(
      "h-full flex flex-col py-0 items-center w-full bg-transparent backdrop-blur-xl border-r border-white/5",
      className
    )}>

      {/* SHOP DRAWER (rail direito) */}
      <ShopDrawer
        open={shopOpen}
        onClose={() => { setShopOpen(false); setShopFocus(null); }}
        projectId={projectId}
        focusProductKey={shopFocus}   // opcional, se o drawer quiser destacar no futuro
        onAfterAction={() => refreshWidgets()}
      />

      {/* 1. SELETOR DE UNIVERSO */}
      <div className="w-full mb-2">
        <RealmSwitcher />
      </div>

      {/* 2. MANIFESTAR */}
      <div className="flex flex-col gap-1 w-full items-center pb-4 border-b border-white/10">
        <button
          onClick={() => handleCreate()}
          className={cn(
            "group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500",
            "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-105",
            "shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)]"
          )}
          title="Manifestar Intenção (Ctrl+K)"
        >
          <IconSankalpa className="w-7 h-7" ativo={isManifestModalOpen} />
          <div className={cn(
            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md",
            activeRealmId === 'professional' ? "bg-indigo-500/20" : "bg-emerald-500/20"
          )} />
        </button>
      </div>

      {/* 3. PAINÉIS LATERAIS */}
      <div className="flex flex-col gap-2 w-full items-center mt-4">
        <NavButton
          id="files"
          icon={IconFolder}
          label={t('nav_explorer')}
          isActive={activePanel === 'files' && layout?.explorer?.open}
          onClick={() => handlePanelClick('files')}
        />
        <NavButton
          id="tags"
          icon={IconHash}
          label={t('nav_tags')}
          isActive={activePanel === 'tags' && layout?.explorer?.open}
          onClick={() => handlePanelClick('tags')}
        />
        <NavButton
          id="search"
          icon={IconSearch}
          label={t('nav_search')}
          isActive={false}
          onClick={handleSearch}
        />
      </div>

      <div className="w-8 h-[1px] bg-white/5 my-3" />

      {/* 4. VISTAS PRINCIPAIS */}
      <div className="flex-1 flex flex-col gap-2 w-full items-center overflow-y-auto no-scrollbar px-2">

        <NavButton
          icon={IconDashboard}
          label={t('nav_dashboard')}
          isActive={activeTabType === VIEW_TYPES.DASHBOARD}
          onClick={() => openTab({ type: VIEW_TYPES.DASHBOARD, title: t('nav_dashboard') }, 'main')}
        />
        <NavButton
          icon={IconCronos}
          label={t('nav_planner')}
          isActive={activeTabType === VIEW_TYPES.PLANNER_WEEKLY}
          onClick={() => openTab({ type: VIEW_TYPES.PLANNER_WEEKLY, title: t('nav_planner') }, 'main')}
        />
        <NavButton
          icon={IconCosmos}
          label={t('nav_calendar')}
          isActive={activeTabType === VIEW_TYPES.CALENDAR_MONTHLY}
          onClick={() => openTab({ type: VIEW_TYPES.CALENDAR_MONTHLY, title: t('nav_calendar') }, 'main')}
        />
        <NavButton
          icon={IconPapyrus}
          label="Projetos"
          isActive={activeTabType === VIEW_TYPES.PROJECT_HUB}
          onClick={() => openTab({ type: VIEW_TYPES.PROJECT_HUB, title: 'Projetos' }, 'main')}
        />

        <div className="w-6 h-[1px] bg-white/5 my-2" />

        <NavButton
          icon={IconList}
          label="Inbox"
          isActive={activeTabType === VIEW_TYPES.INBOX_VIEW}
          onClick={() => openTab({ type: VIEW_TYPES.INBOX_VIEW, title: 'Inbox' }, 'main')}
        />
        <NavButton
          icon={IconMatrix}
          label="Sheets"
          isActive={activeTabType === VIEW_TYPES.SHEET_VIEW}
          onClick={() => openTab({ type: VIEW_TYPES.SHEET_VIEW, title: 'Data Engine' }, 'main')}
        />
        <NavButton
          icon={IconNeural}
          label="Mind Map"
          isActive={activeTabType === VIEW_TYPES.MINDMAP_VIEW}
          onClick={() => openTab({ type: VIEW_TYPES.MINDMAP_VIEW, title: 'Mind Map' }, 'main')}
        />

        {/* WIDGETS (Lego) */}
        <div className="w-6 h-[1px] bg-white/5 my-2" />

        <div className="flex flex-col items-center w-full">
          <NavButton
            icon={IconZap}
            label="Widgets / Shop"
            isActive={shopOpen}
            onClick={() => { setShopFocus(null); setShopOpen(true); }}
          />

          {hasAnyWidgets && (
            <div className="flex flex-col gap-2 w-full items-center mt-2">
              {sidebarWidgets.map((w) => {
                const st = w.state || {};
                const active = !!st.enabled && (w.widgetKey === 'brandcode'
                  ? (activeTabType === (VIEW_TYPES.BRANDCODE || VIEW_TYPES.BRANDCODE_VIEW || 'BRANDCODE_VIEW'))
                  : false);

                const dimmed = !!st.dimmed;
                const locked = !!st.locked;
                const busy = busyWidgetKey === w.widgetKey;

                const Icon = resolveWidgetIcon(w);

                return (
                  <WidgetNavButton
                    key={w.widgetKey}
                    icon={Icon}
                    label={w.title || w.widgetKey}
                    isActive={active}
                    dimmed={dimmed}
                    locked={locked}
                    busy={busy}
                    onClick={() => handleWidgetClick(w)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. RODAPÉ */}
      <div className="mt-auto flex flex-col gap-3 items-center pt-4 border-t border-white/5 w-full pb-4">
        <PlanUsageIndicator compact={true} />

        <NavButton
          icon={IconSettings}
          label={t('nav_settings')}
          isActive={activeTabType === VIEW_TYPES.SETTINGS}
          onClick={handleSettingsClick}
        />

        <button
          onClick={logout}
          className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
          title={t('logout')}
        >
          <IconLogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
}

function resolveWidgetIcon(widget) {
  if (widget?.widgetKey === 'brandcode') return IconSankalpa;
  return IconZap;
}

const NavButton = ({ id, icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "p-2 rounded-2xl transition-all relative group w-12 h-12 flex items-center justify-center active:scale-90",
      isActive
        ? "text-primary bg-primary/10 border border-primary/20 shadow-glow-sm"
        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
    )}
    title={label}
  >
    <Icon className={cn("w-6 h-6 transition-colors", isActive && "text-primary")} ativo={isActive} />
    {isActive && (
      <div className="absolute left-[-8px] top-3 bottom-3 w-[3px] bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />
    )}
  </button>
);

const WidgetNavButton = ({ icon: Icon, label, isActive, dimmed, locked, busy, onClick }) => (
  <button
    onClick={onClick}
    disabled={busy}
    className={cn(
      "p-2 rounded-2xl transition-all relative group w-12 h-12 flex items-center justify-center active:scale-90",
      isActive
        ? "text-primary bg-primary/10 border border-primary/20 shadow-glow-sm"
        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5",
      dimmed && !isActive && "opacity-70",
      locked && !isActive && "opacity-50"
    )}
    title={
      busy ? `${label}...` :
      locked ? `${label} (contrate no Shop)` :
      dimmed ? `${label} (ativar neste projeto)` :
      label
    }
  >
    <Icon className={cn("w-6 h-6 transition-colors", isActive && "text-primary")} ativo={isActive} />
    {(dimmed || locked) && !isActive && (
      <div className={cn(
        "absolute bottom-1 right-1 w-2 h-2 rounded-full",
        locked ? "bg-zinc-500/60" : "bg-primary/50"
      )} />
    )}
    {busy && <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm" />}
  </button>
);
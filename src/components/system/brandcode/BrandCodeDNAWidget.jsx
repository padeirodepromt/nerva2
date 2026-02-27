/* src/components/system/brandcode/BrandCodeDNAWidget.jsx
   desc: Widget de Sistema - Brand Code (DNA) V1 (System-backed)
   role: UI “latente” por projeto + gatilho do protocolo da Flor no SideChat.
   source of truth: /api/system/brandcode (userSystems + projectSystems + brandCodes)

   ✅ Correções aplicadas:
   - Nome do componente alinhado com o arquivo (BrandCodeDNAWidget)
   - Fix toast.loading: guarda id e faz dismiss(id) (evita dismiss geral bugado)
   - Normaliza datas (string/Date) e evita new Date(undefined)
   - canStart correto: enabled && brandCode (e para "empty" permitir iniciar)
   - Protege refresh em unmount e projectId ausente
   - Melhor mensagem de erro e fallback de res
*/

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconSparkles,
  IconChevronRight,
  IconZap,
  IconLayers,
  IconWind,
  IconCheckCircle,
  IconClock
} from "@/components/icons/PranaLandscapeIcons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { BrandCodeSystem } from "@/api/system/brandcode";

export default function BrandCodeDNAWidget({ projectId }) {
  const [loading, setLoading] = useState(true);

  // System state
  const [installed, setInstalled] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [monthlyPriceCents, setMonthlyPriceCents] = useState(null);

  // Brand Code row
  const [brandCode, setBrandCode] = useState(null);

  // UI modals
  const [openEnable, setOpenEnable] = useState(false);
  const [openStart, setOpenStart] = useState(false);

  const aliveRef = useRef(true);

  const refresh = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const state = await BrandCodeSystem.getProjectState(projectId);

      if (!aliveRef.current) return;

      setInstalled(Boolean(state?.installed));
      setEnabled(Boolean(state?.enabled));
      setMonthlyPriceCents(state?.monthlyPriceCents ?? null);
      setBrandCode(state?.brandCode ?? null);
    } catch (e) {
      console.error("[BrandCodeDNAWidget] refresh error:", e);
      toast.error("Erro ao carregar Brand Code.");
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    aliveRef.current = true;
    refresh();

    return () => {
      aliveRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const bcStatus = brandCode?.status || "empty"; // empty | building | active | review

  const lastTouchedAt = useMemo(() => {
    const v = brandCode?.updatedAt || brandCode?.createdAt || null;
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [brandCode]);

  const statusLabel = useMemo(() => {
    if (!enabled) return "Latente";
    if (enabled && bcStatus === "empty") return "Pronto para iniciar";
    if (bcStatus === "building") return "Em construção";
    if (bcStatus === "review") return "Em revisão";
    return "Ativo";
  }, [enabled, bcStatus]);

  const statusTone = useMemo(() => {
    if (!enabled) return "opacity-50";
    if (bcStatus === "empty") return "text-amber-300";
    if (bcStatus === "building") return "text-indigo-300";
    if (bcStatus === "review") return "text-amber-300";
    return "text-emerald-300";
  }, [enabled, bcStatus]);

  // canStart: se habilitado, pode iniciar mesmo que brandCode venha null
  // (alguns backends só criam a row no start). Mas se tiver brandCode ok.
  const canStart = enabled && (installed || !!brandCode);

  const handleEnable = async () => {
    if (!projectId) return;

    const tId = toast.loading("Ativando Brand Code...");
    try {
      await BrandCodeSystem.enableForProject(projectId);
      toast.dismiss(tId);
      toast.success("Brand Code ativado no projeto.");
      setOpenEnable(false);
      await refresh();
    } catch (e) {
      toast.dismiss(tId);
      toast.error(e?.message || "Falha ao ativar.");
    }
  };

  const startProtocol = async () => {
    if (!projectId) return;

    const tId = toast.loading("Chamando Flor...");
    try {
      const res = await BrandCodeSystem.startForProject(projectId);
      const florKickoff = res?.florKickoff;

      if (!florKickoff?.questions?.length) {
        toast.dismiss(tId);
        toast.error("Kickoff veio vazio.");
        return;
      }

      // SideChat listener espera:
      // { systemKey, protocolVersion, projectId, questions: [{key, q}] }
      const detail = {
        systemKey: florKickoff.systemKey || "brand_code",
        protocolVersion: florKickoff.protocolVersion || "v1",
        projectId: florKickoff.projectId || projectId,
        interviewId: florKickoff.interviewId || null,
        questions: florKickoff.questions
          .map((q) => ({
            key: String(q.id ?? q.key ?? ""),
            q: String(q.q ?? "")
          }))
          .filter((q) => q.key && q.q)
      };

      window.dispatchEvent(new CustomEvent("prana:flor-kickoff", { detail }));

      toast.dismiss(tId);
      toast.success("Protocolo iniciado no SideChat.");
      setOpenStart(false);

      await refresh();
    } catch (e) {
      toast.dismiss(tId);
      toast.error(e?.message || "Falha ao iniciar protocolo.");
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "rounded-[32px] border border-white/8 bg-white/[0.02] overflow-hidden relative",
          "shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
        )}
      >
        <div className="absolute -top-24 -right-24 opacity-10 pointer-events-none">
          <IconSparkles className="w-64 h-64 rotate-12 text-primary" />
        </div>

        <div className="p-6 md:p-7 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-white/15 bg-black/10 uppercase text-[9px] font-black tracking-[0.22em] px-3 py-1",
                    statusTone
                  )}
                >
                  Brand Code • {statusLabel}
                </Badge>

                {enabled && bcStatus !== "empty" && (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/20 bg-emerald-500/5 text-emerald-200 uppercase text-[9px] font-black tracking-[0.22em] px-3 py-1"
                  >
                    <IconCheckCircle className="w-3 h-3 mr-1 inline-block" />
                    DNA existe
                  </Badge>
                )}

                {monthlyPriceCents != null && enabled && (
                  <Badge
                    variant="outline"
                    className="border-white/10 bg-white/[0.03] text-foreground/70 uppercase text-[9px] font-black tracking-[0.22em] px-3 py-1"
                  >
                    {`R$ ${(monthlyPriceCents / 100).toFixed(2).replace(".", ",")} / mês`}
                  </Badge>
                )}
              </div>

              <h3 className="mt-3 text-xl md:text-2xl font-serif italic text-foreground/90 leading-tight">
                DNA do projeto
              </h3>

              <p className="mt-2 text-[12px] md:text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
                Um núcleo consultável pela Flor para criar comunicação, conteúdo e direção com a cara do projeto.
              </p>

              {lastTouchedAt && (
                <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-50">
                  <IconClock className="w-3.5 h-3.5" />
                  <span>Atualizado: {lastTouchedAt.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!enabled ? (
                <Button
                  onClick={() => setOpenEnable(true)}
                  className="rounded-full h-9 px-5 text-[10px] font-black uppercase tracking-widest"
                  variant="outline"
                  disabled={loading}
                >
                  Ativar
                  <IconChevronRight className="w-4 h-4 ml-2 opacity-70" />
                </Button>
              ) : (
                <Button
                  onClick={() => setOpenStart(true)}
                  className="rounded-full h-9 px-5 text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-glow"
                  disabled={loading || !canStart}
                  title={!canStart ? "Instale/ative o BrandCode para iniciar" : ""}
                >
                  {bcStatus === "empty" ? "Iniciar" : "Revisar"}
                  <IconChevronRight className="w-4 h-4 ml-2 opacity-70" />
                </Button>
              )}
            </div>
          </div>

          {/* chips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <DNAChip icon={IconLayers} title="Essência" desc="promessa, valores, postura" dim={!enabled} />
            <DNAChip icon={IconWind} title="Voz" desc="tom, informalidade, ritmo" dim={!enabled} />
            <DNAChip icon={IconZap} title="StoryBrand" desc="herói, plano, sucesso real" dim={!enabled} />
          </div>

          {!enabled && (
            <div className="rounded-2xl border border-white/8 bg-black/15 p-4 text-[12px] text-muted-foreground/80 leading-relaxed">
              O Brand Code está em modo latente neste projeto. Ao ativar, a Flor conduz a entrevista e estabiliza o DNA.
            </div>
          )}

          {enabled && bcStatus === "empty" && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-[12px] text-amber-200/80 leading-relaxed">
              Pronto. Clique em <b>Iniciar</b> para a Flor conduzir o protocolo direto no SideChat.
            </div>
          )}

          {enabled && bcStatus === "building" && (
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-[12px] text-indigo-100/80 leading-relaxed">
              A construção está em andamento. Quando fechar o núcleo, a Flor pede autorização para aplicar o DNA no projeto.
            </div>
          )}

          {enabled && (bcStatus === "active" || bcStatus === "review") && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-[12px] text-emerald-100/80 leading-relaxed">
              DNA disponível. Use <b>Revisar</b> para refinar tom de voz, personas e posicionamento quando quiser.
            </div>
          )}
        </div>
      </div>

      {/* modal enable */}
      <Dialog open={openEnable} onOpenChange={setOpenEnable}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Ativar Brand Code neste projeto</DialogTitle>
            <DialogDescription>
              Ao ativar, você habilita o sistema no projeto e libera a Flor para estabilizar o DNA.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-[12px] text-muted-foreground/80 leading-relaxed">
            Depois de ativado, a cobrança por projeto pode ser aplicada conforme sua regra (ex: R$20/mês).
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenEnable(false)} className="rounded-full">
              Voltar
            </Button>
            <Button onClick={handleEnable} className="rounded-full" disabled={loading || !projectId}>
              Ativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* modal start */}
      <Dialog open={openStart} onOpenChange={setOpenStart}>
        <DialogContent className="max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{bcStatus === "empty" ? "Iniciar Brand Code" : "Revisar Brand Code"}</DialogTitle>
            <DialogDescription>
              A Flor conduz o protocolo no SideChat e consolida o DNA do projeto.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] uppercase tracking-widest opacity-60 font-black">Saída</div>
              <div className="mt-2 text-[12px] text-muted-foreground/80 leading-relaxed">
                Essência, promessa, personas, tom de voz avançado e StoryBrand do projeto.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[10px] uppercase tracking-widest opacity-60 font-black">Fluxo</div>
              <div className="mt-2 text-[12px] text-muted-foreground/80 leading-relaxed">
                Pergunta única por vez. Você responde. A Flor avança. Sem cansar.
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenStart(false)} className="rounded-full">
              Voltar
            </Button>
            <Button
              onClick={startProtocol}
              className="rounded-full"
              disabled={loading || !canStart || !projectId}
            >
              {bcStatus === "empty" ? "Iniciar agora" : "Revisar agora"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DNAChip({ icon: Icon, title, desc, dim }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-white/[0.02] p-4 flex items-start gap-3",
        dim && "opacity-40"
      )}
    >
      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
        <Icon className="w-4 h-4 text-foreground/80" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-black uppercase tracking-widest opacity-70">{title}</div>
        <div className="mt-1 text-[12px] text-muted-foreground/80 leading-snug">{desc}</div>
      </div>
    </div>
  );
}
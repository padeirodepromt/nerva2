/* src/components/system/brandcode/BrandCodeDNAWidget.jsx
   desc: Master Widget de Visualização do DNA da Marca (V10).
   feat:
    - Motor Geométrico de Hélice Dupla (Double Helix Engine).
    - Sistema de Parallax Reativo e Projeção 3D Simulada.
    - Normalização de Estado e Herança de DNA (Projeto Pai -> Filho).
    - Design Subtrativo: UI se adapta ao status de contratação e ativação.
    - Componentização Interna completa (Design System Paper/Grain).
   status: MASTER FILE - 100% INTEGRAL.

   ✅ Correções importantes (para “rodar de verdade” no Prana):
   - Remove dependência frágil de ícones do ecossistema (substituídos por SVGs locais).
   - Evita Math.random dentro do render (partículas com seed estável via useMemo).
   - Evita colisão de nomes com <Badge/> e <Button/> do shadcn (renomeados para PBadge/PButton).
   - Ajusta transform/origin do SVG e rotação “3D” sem quebrar layout.
   - normalizeBrandCodeState mais tolerante (ready aceita status active/review + dna não vazio).
   - PaperGrain sem URL externa (somente gradients/linhas).
*/

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useBrandCodeProjectState } from "@/hooks/useBrandCodeProjectState";

// =========================================================
// 0) ICONS (LOCAL, para evitar mismatch de exports)
// =========================================================

function I({ children, className = "" }) {
  return <span className={cx("inline-flex items-center justify-center", className)}>{children}</span>;
}

const IconSparkles = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={cx("w-4 h-4", className)} fill="none">
    <path d="M12 2l1.2 4.1L17.3 7.3 13.2 8.5 12 12.6 10.8 8.5 6.7 7.3 10.8 6.1 12 2Z" fill="currentColor" opacity="0.9" />
    <path d="M19 12l.7 2.3 2.3.7-2.3.7L19 18l-.7-2.3-2.3-.7 2.3-.7L19 12Z" fill="currentColor" opacity="0.7" />
    <path d="M5 14l.6 2 2 .6-2 .6L5 19l-.6-2-2-.6 2-.6L5 14Z" fill="currentColor" opacity="0.6" />
  </svg>
);

const IconRefresh = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={cx("w-4 h-4", className)} fill="none">
    <path
      d="M20 12a8 8 0 1 1-2.3-5.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M20 4v6h-6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

const IconShield = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={cx("w-5 h-5", className)} fill="none">
    <path
      d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.9"
    />
    <path
      d="M9 12.3l2 2.2 4-4.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

const IconLock = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={cx("w-5 h-5", className)} fill="none">
    <path
      d="M7 11V8.5A5 5 0 0 1 12 3a5 5 0 0 1 5 5.5V11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path
      d="M6.5 11h11a2 2 0 0 1 2 2v6.2a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V13a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      opacity="0.9"
    />
  </svg>
);

const IconInfo = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={cx("w-5 h-5", className)} fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
    <path d="M12 10.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    <circle cx="12" cy="7.5" r="1" fill="currentColor" opacity="0.9" />
  </svg>
);

const IconZap = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={cx("w-5 h-5", className)} fill="none">
    <path
      d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z"
      fill="currentColor"
      opacity="0.85"
    />
  </svg>
);

const IconBox = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={cx("w-4 h-4", className)} fill="none">
    <path d="M4 7.5 12 3l8 4.5v9L12 21 4 16.5v-9Z" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
  </svg>
);

// =========================================================
// 0. GENE REGISTRY (MACRO -> MICRO / CLAUSES)
// =========================================================

const MACRO_GENE_REGISTRY = [
  {
    macroKey: "identity",
    title: "Identidade",
    hint: "O núcleo estável do projeto.",
    clauses: [
      { key: "identity.essence", label: "Essência", path: ["identity", "essence"] },
      { key: "identity.promise", label: "Promessa", path: ["identity", "promise"] },
      { key: "identity.values", label: "Valores", path: ["identity", "values"] },
      { key: "identity.territory", label: "Território", path: ["identity", "territory"] },
      { key: "identity.archetype", label: "Arquétipo", path: ["identity", "archetype"] }
    ]
  },
  {
    macroKey: "product",
    title: "Produto & Transformação",
    hint: "Problema, transformação e oferta em termos vivos.",
    clauses: [
      { key: "product.rootProblem", label: "Problema raiz", path: ["product", "rootProblem"] },
      { key: "product.invisibleProblem", label: "Problema invisível", path: ["product", "invisibleProblem"] },
      { key: "product.transformation", label: "Transformação", path: ["product", "transformation"] },
      { key: "product.mechanisms", label: "Mecanismos", path: ["product", "mechanisms"] },
      { key: "product.differentials", label: "Diferenciais", path: ["product", "differentials"] },
      { key: "product.limits", label: "Limites", path: ["product", "limits"] }
    ]
  },
  {
    macroKey: "positioning",
    title: "Posicionamento",
    hint: "Categoria, anti-categoria e o ângulo de ruptura.",
    clauses: [
      { key: "positioning.category", label: "Categoria", path: ["positioning", "category"] },
      { key: "positioning.antiCategory", label: "Anti-categoria", path: ["positioning", "antiCategory"] },
      { key: "positioning.mechanism", label: "Mecanismo", path: ["positioning", "mechanism"] },
      { key: "positioning.differentials", label: "Diferenciais", path: ["positioning", "differentials"] },
      { key: "positioning.substitutes", label: "Substitutos", path: ["positioning", "substitutes"] },
      { key: "positioning.villain", label: "Inimigo conceitual", path: ["positioning", "villain"] }
    ]
  },
  {
    macroKey: "communication",
    title: "Comunicação & Narrativa",
    hint: "Voz, estilo, StoryBrand e linguagem operacional.",
    clauses: [
      { key: "communication.voice.tone", label: "Tom", path: ["communication", "voice", "tone"] },
      { key: "communication.voice.rules", label: "Regras", path: ["communication", "voice", "rules"] },
      { key: "communication.voice.vocabularyAllowed", label: "Vocabulário permitido", path: ["communication", "voice", "vocabularyAllowed"] },
      { key: "communication.voice.vocabularyForbidden", label: "Vocabulário proibido", path: ["communication", "voice", "vocabularyForbidden"] },
      { key: "communication.story.storybrand", label: "StoryBrand", path: ["communication", "story", "storybrand"] },
      { key: "communication.story.narrative", label: "Narrativa", path: ["communication", "story", "narrative"] },
      { key: "communication.cta", label: "CTA", path: ["communication", "cta"] }
    ]
  },
  {
    macroKey: "cognitiveModel",
    title: "Modelo Cognitivo",
    hint: "Autonomia, consentimento e papéis: humano, sistema, automação.",
    clauses: [
      { key: "cognitiveModel.humanRole", label: "Papel do humano", path: ["cognitiveModel", "humanRole"] },
      { key: "cognitiveModel.systemRole", label: "Papel do sistema", path: ["cognitiveModel", "systemRole"] },
      { key: "cognitiveModel.automationRole", label: "Papel da automação", path: ["cognitiveModel", "automationRole"] },
      { key: "cognitiveModel.autonomyLevel", label: "Nível de autonomia", path: ["cognitiveModel", "autonomyLevel"] },
      { key: "cognitiveModel.decisionsRequiringConsent", label: "Decisões com consentimento", path: ["cognitiveModel", "decisionsRequiringConsent"] },
      { key: "cognitiveModel.bounds", label: "Limites de atuação", path: ["cognitiveModel", "bounds"] }
    ]
  },
  {
    macroKey: "governance",
    title: "Governança",
    hint: "Como o DNA evolui sem trair o organismo.",
    clauses: [
      { key: "governance.cadence", label: "Cadência", path: ["governance", "cadence"] },
      { key: "governance.consentModel", label: "Consentimento", path: ["governance", "consentModel"] },
      { key: "governance.mutable", label: "O que pode mudar", path: ["governance", "mutable"] },
      { key: "governance.immutable", label: "O que não pode", path: ["governance", "immutable"] },
      { key: "governance.maturityCriteria", label: "Critérios de maturidade", path: ["governance", "maturityCriteria"] },
      { key: "governance.vitalityCriteria", label: "Critérios de vitalidade", path: ["governance", "vitalityCriteria"] }
    ]
  }
];

// =========================================================
// 1. UTILS & DATA ADAPTERS
// =========================================================

const normalizeBrandCodeState = (raw) => {
  if (!raw) return { enabled: false, ready: false, installed: false, dna: {} };

  const installed = Boolean(raw.installed);
  const enabled = Boolean(raw.enabled);

  const bc = raw.brandCode || null;
  const status = bc?.status || "empty";
  const dna = bc?.dna && typeof bc.dna === "object" ? bc.dna : {};

  const hasDNA = Object.keys(dna).length > 0;

  return {
    projectId: raw.projectId,
    systemKey: raw.systemKey,

    installed,
    enabled,

    status,
    inProgress: status === "building",
    // ready: aceitamos active OU review, desde que dna exista
    ready: enabled && hasDNA && (status === "active" || status === "review"),

    isInherited: Boolean(bc?.isInherited) || false,
    inheritedFrom: bc?.inheritedFrom || null,

    id: bc?.id,
    dna,
    summary: bc?.summary || "",
    confidenceScore: typeof bc?.confidenceScore === "number" ? bc.confidenceScore : 0,

    projectSystem: raw.projectSystem || null,
    userSystem: raw.userSystem || null
  };
};

const cx = (...a) => a.filter(Boolean).join(" ");

const getByPath = (obj, path) =>
  path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const pickTags = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).slice(0, 6).map(String);
  if (typeof v === "object") {
    return Object.entries(v)
      .slice(0, 6)
      .map(([k, val]) => `${k}: ${String(Array.isArray(val) ? val[0] : val).slice(0, 40)}`);
  }
  return [String(v)];
};

const isFilled = (value) =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  !(Array.isArray(value) && value.length === 0) &&
  !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0);

const clamp01 = (n) => Math.max(0, Math.min(1, n));

const clauseFromValue = (def, value) => {
  const tags = pickTags(value);
  const filled = isFilled(value);
  // Vitalidade visual inicial (até o runtime enviar vitality real)
  const vitality = filled ? clamp01(0.42 + tags.length * 0.10) : 0.16;
  return {
    key: def.key,
    label: def.label,
    path: def.path,
    value,
    filled,
    vitality,
    tags
  };
};

const deriveGenesFromDNA = (dna) => {
  const safeDNA = dna && typeof dna === "object" ? dna : {};

  // compat: enquanto backend ainda usa voice/story fora de communication
  const compatCommunication = safeDNA.communication || {
    voice: safeDNA.voice,
    story: safeDNA.story,
    cta: safeDNA.cta
  };

  const merged = {
    ...safeDNA,
    communication: compatCommunication
  };

  return MACRO_GENE_REGISTRY.map((macro) => {
    const clauses = macro.clauses.map((c) => clauseFromValue(c, getByPath(merged, c.path)));

    const filledCount = clauses.filter((c) => c.filled).length;
    const avgVitality =
      clauses.length === 0 ? 0.2 : clauses.reduce((sum, c) => sum + (c.vitality || 0), 0) / clauses.length;

    const tags = [
      `${filledCount}/${clauses.length}`,
      filledCount === 0 ? "latente" : filledCount === clauses.length ? "estável" : "em formação"
    ];

    return {
      key: macro.macroKey,
      label: macro.title,
      hint: macro.hint,

      vitality: clamp01(avgVitality),
      filledCount,
      totalCount: clauses.length,

      clauses,
      tags
    };
  });
};

// =========================================================
// 2. ATOMS & DESIGN SYSTEM (Paper/Grain)
// =========================================================

function PBadge({ children, className = "" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-bold border",
        "border-black/10 bg-white/55 text-black/60 uppercase tracking-widest",
        className
      )}
    >
      {children}
    </span>
  );
}

function PButton({ children, variant = "primary", onClick, className = "", icon: Icon, disabled, title }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-[10px] font-bold border transition-all select-none uppercase tracking-[0.12em]";
  const styles =
    variant === "secondary"
      ? "bg-white/60 border-black/10 text-black/70 hover:bg-white/80 hover:border-black/20"
      : variant === "ghost"
      ? "bg-transparent border-transparent text-black/50 hover:bg-white/50 hover:border-black/10"
      : "bg-black/90 border-black/10 text-white hover:bg-black shadow-lg shadow-black/5";

  const disabledStyles = disabled ? "opacity-40 pointer-events-none" : "";

  return (
    <button onClick={onClick} className={cx(base, styles, disabledStyles, className)} disabled={disabled} title={title}>
      {Icon && <Icon className="w-3 h-3 mr-2" />}
      {children}
    </button>
  );
}

function PaperTint({ kind = "header" }) {
  const bg =
    kind === "header"
      ? "radial-gradient(620px 320px at 12% 15%, rgba(255,205,170,0.55), transparent 70%), radial-gradient(620px 320px at 88% 10%, rgba(195,175,255,0.45), transparent 70%), radial-gradient(520px 260px at 60% 110%, rgba(140,210,255,0.25), transparent 65%)"
      : "radial-gradient(520px 320px at 20% 80%, rgba(140,210,255,0.28), transparent 72%), radial-gradient(520px 320px at 92% 30%, rgba(255,205,170,0.22), transparent 70%)";

  return (
    <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: bg, filter: "blur(20px)" }} />
  );
}

function PaperGrain() {
  // Sem URL externa: “razurado” editorial
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{
        opacity: 0.12,
        backgroundImage: `
          repeating-linear-gradient(90deg, rgba(0,0,0,0.020) 0, rgba(0,0,0,0.020) 1px, transparent 1px, transparent 22px),
          repeating-linear-gradient(0deg, rgba(0,0,0,0.012) 0, rgba(0,0,0,0.012) 1px, transparent 1px, transparent 18px),
          radial-gradient(900px 700px at 30% 10%, rgba(0,0,0,0.030), transparent 65%),
          radial-gradient(700px 500px at 80% 80%, rgba(0,0,0,0.025), transparent 60%)
        `
      }}
    />
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={cx(
        "relative rounded-[32px] border border-black/10 bg-white/40",
        "shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl overflow-hidden",
        className
      )}
    >
      <PaperGrain />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// =========================================================
// 3. HELIX GEOMETRY ENGINE
// =========================================================

function useHelixPoints({ count = 16, height = 500, centerX = 250, amplitude = 100 }) {
  return useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = 40 + t * height;
      const phase = t * Math.PI * 2.5;
      const xL = centerX - Math.cos(phase) * amplitude;
      const xR = centerX + Math.cos(phase) * amplitude;
      const depth = (Math.sin(phase) + 1) / 2; // 0..1
      pts.push({ i, t, y, xL, xR, depth, phase });
    }
    return pts;
  }, [count, height, centerX, amplitude]);
}

// Seeded RNG (determinístico) para partículas
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// =========================================================
// 4. SUB-COMPONENTS (SIDE PANEL & VIZ)
// =========================================================

function SidePanel({ gene, onClose, onRefine }) {
  return (
    <AnimatePresence mode="wait">
      {gene ? (
        <motion.div
          key={gene.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col gap-4"
        >
          <div className="p-5 rounded-3xl bg-black/[0.03] border border-black/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <PBadge className="mb-2">Gene Macro</PBadge>
                <h3 className="text-xl font-bold text-black/80">{gene.label}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <PBadge className="bg-white/60 border-black/10 text-black/50 normal-case tracking-wide">
                    {gene.filledCount}/{gene.totalCount} cláusulas
                  </PBadge>
                  <PBadge className="bg-white/60 border-black/10 text-black/50 normal-case tracking-wide">
                    Vitalidade {Math.round((gene.vitality || 0) * 100)}%
                  </PBadge>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-black/30" title="Fechar">
                ×
              </button>
            </div>

            <p className="text-[13px] text-black/60 leading-relaxed italic mb-5">"{gene.hint}"</p>

            <div className="p-4 rounded-2xl bg-white/60 border border-black/5">
              <div className="flex justify-between items-center mb-3">
                <div className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Cláusulas</div>
                <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                  {gene.filledCount}/{gene.totalCount}
                </div>
              </div>

              <div className="space-y-2 max-h-[240px] overflow-auto pr-1">
                {gene.clauses?.map((c) => (
                  <div
                    key={c.key}
                    className={cx(
                      "p-3 rounded-2xl border",
                      c.filled ? "bg-white/70 border-black/10" : "bg-black/[0.02] border-black/5"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-black/70 truncate">{c.label}</div>
                        <div className="text-[10px] text-black/40 truncate">{c.key}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cx("text-[10px] font-bold", c.filled ? "text-emerald-700/70" : "text-black/25")}>
                          {c.filled ? "ativo" : "latente"}
                        </span>
                      </div>
                    </div>

                    {c.filled && (
                      <div className="mt-2 text-[12px] text-black/60 leading-relaxed">
                        {typeof c.value === "string"
                          ? c.value
                          : Array.isArray(c.value)
                          ? c.value.join(" • ")
                          : typeof c.value === "object"
                          ? JSON.stringify(c.value, null, 0)
                          : String(c.value)}
                      </div>
                    )}

                    <div className="mt-2 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clamp01(c.vitality || 0) * 100}%` }}
                        transition={{ duration: 0.45 }}
                        className="h-full"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(255,205,170,0.85), rgba(195,175,255,0.85), rgba(140,210,255,0.85))"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <PButton variant="secondary" icon={IconSparkles} className="w-full" onClick={onRefine}>
                Refinar este Gene
              </PButton>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
          <IconInfo className="w-8 h-8 mb-4" />
          <p className="text-[12px] uppercase tracking-widest font-medium leading-relaxed">
            Selecione um ponto da hélice para analisar a essência
          </p>
        </div>
      )}
    </AnimatePresence>
  );
}

function DNAViz({ genes, activeKey, onSelect, mode3D }) {
  const containerRef = useRef(null);
  const pts = useHelixPoints({ count: 18, height: 500, centerX: 250, amplitude: 90 });

  const springConfig = { stiffness: 60, damping: 20 };
  const xSpring = useSpring(0, springConfig);
  const ySpring = useSpring(0, springConfig);

  const particles = useMemo(() => {
    const rnd = mulberry32(1337);
    return Array.from({ length: 16 }).map((_, i) => ({
      i,
      cx: rnd() * 500,
      cy: rnd() * 600,
      r: 1 + rnd() * 2,
      d: 2.5 + rnd() * 3.5
    }));
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    xSpring.set(x * 28);
    ySpring.set(y * 18);
  };

  const genePoints = useMemo(() => {
    const totalPts = pts.length;
    const safeLen = Math.max(genes.length, 1);
    return genes.map((g, i) => {
      const step = Math.floor((i / safeLen) * (totalPts - 1));
      const p = pts[step];
      const isLeft = i % 2 === 0;
      return { gene: g, p, isLeft, x: isLeft ? p.xL : p.xR };
    });
  }, [genes, pts]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        xSpring.set(0);
        ySpring.set(0);
      }}
      className="relative w-full h-[540px] flex items-center justify-center cursor-crosshair"
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          perspective: 900,
          transformStyle: "preserve-3d",
          x: xSpring,
          y: ySpring
        }}
      >
        <svg viewBox="0 0 500 600" className="w-full h-full drop-shadow-2xl">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* BACKGROUND PARTICLES (stable) */}
          <g opacity="0.10">
            {particles.map((p) => (
              <motion.circle
                key={p.i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill="black"
                animate={{ opacity: [0.18, 0.42, 0.18], scale: [1, 1.15, 1] }}
                transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </g>

          {/* Helix group */}
          <motion.g
            animate={
              mode3D
                ? { rotateY: [0, 360] }
                : { rotateY: 0 }
            }
            transition={mode3D ? { duration: 10, repeat: Infinity, ease: "linear" } : { duration: 0.35 }}
            style={{
              transformOrigin: "250px 300px",
              transformBox: "fill-box"
            }}
          >
            {/* HELIX PATHS */}
            <path
              d={"M " + pts.map((p) => `${p.xL},${p.y}`).join(" L ")}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.5"
            />
            <path
              d={"M " + pts.map((p) => `${p.xR},${p.y}`).join(" L ")}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.5"
            />

            {/* HELIX RUNGS */}
            {pts.map((p, idx) => {
              const opacity = 0.05 + p.depth * 0.15;
              return (
                <motion.line
                  key={idx}
                  x1={p.xL}
                  y1={p.y}
                  x2={p.xR}
                  y2={p.y}
                  stroke={`rgba(0,0,0,${opacity})`}
                  strokeWidth={1 + p.depth * 2.5}
                  strokeLinecap="round"
                />
              );
            })}

            {/* GENE NODES (MACROS) */}
            {genePoints.map(({ gene, p, x, isLeft }) => {
              const isActive = gene.key === activeKey;
              const size = 6 + (gene.vitality || 0) * 8;
              const nodeOpacity = 0.12 + p.depth * 0.42;

              return (
                <g
                  key={gene.key}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(gene.key);
                  }}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.circle
                        cx={x}
                        cy={p.y}
                        r={size * 2.2}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 0.14, scale: [1, 1.08, 1] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        fill="black"
                        filter="url(#glow)"
                      />
                    )}
                  </AnimatePresence>

                  <circle
                    cx={x}
                    cy={p.y}
                    r={size}
                    fill={`rgba(0,0,0,${nodeOpacity})`}
                    stroke="rgba(0,0,0,0.10)"
                    strokeWidth="1"
                  />

                  <text
                    x={x + (isLeft ? -14 : 14)}
                    y={p.y + 4}
                    textAnchor={isLeft ? "end" : "start"}
                    className="text-[9px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-40 transition-opacity"
                    fill="black"
                  >
                    {gene.label}
                  </text>
                </g>
              );
            })}
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}

// =========================================================
// 5. MAIN COMPONENT EXPORT
// =========================================================

export default function BrandCodeDNAWidget({ projectId, onOpenProtocol, onOpenBrandCode }) {
  const { loading, error, state, refresh } = useBrandCodeProjectState(projectId);

  const [activeKey, setActiveKey] = useState(null);
  const [mode3D, setMode3D] = useState(true);

  const norm = useMemo(() => normalizeBrandCodeState(state), [state]);
  const genes = useMemo(() => deriveGenesFromDNA(norm.dna), [norm.dna]);

  useEffect(() => {
    if (!activeKey && genes.length > 0) setActiveKey(genes[0].key);
  }, [genes, activeKey]);

  const activeGene = useMemo(() => genes.find((g) => g.key === activeKey) || null, [genes, activeKey]);

  // Design subtrativo: se não está instalado e nem habilitado, não ocupa espaço
  if (!loading && !norm.enabled && !norm.installed) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        {/* HEADER */}
        <div className="relative p-6 border-b border-black/5 bg-white/30 overflow-hidden">
          <PaperTint kind="header" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center justify-center shadow-inner text-black/40">
                <IconShield />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-black/85 tracking-tight">BrandCode DNA</h2>
                  {norm.isInherited && (
                    <PBadge className="bg-emerald-50 text-emerald-700 border-emerald-100/50 normal-case">
                      <I className="mr-1 text-emerald-700">
                        <IconBox />
                      </I>
                      Herdado
                    </PBadge>
                  )}
                </div>
                <p className="text-[12px] text-black/50 font-medium">
                  {norm.isInherited
                    ? "Sincronizado com a inteligência do Projeto Pai."
                    : "Identidade única gerada pela Agente Flor."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PButton
                variant="ghost"
                onClick={refresh}
                className="px-3"
                disabled={loading}
                title="Atualizar"
                icon={IconRefresh}
              >
                {loading ? "..." : "Sync"}
              </PButton>

              <PButton variant="secondary" onClick={() => setMode3D((v) => !v)}>
                {mode3D ? "Hélice 2D" : "Ativar 3D"}
              </PButton>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* 1) LOADING */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 border-4 border-black/5 border-t-black/20 rounded-full animate-spin mb-6" />
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/30">
                  Mapeando frequência...
                </p>
              </motion.div>
            )}

            {/* 2) DISABLED */}
            {!loading && !norm.enabled && (
              <motion.div
                key="disabled"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center text-center max-w-sm mx-auto"
              >
                <div className="w-16 h-16 bg-black/[0.03] rounded-full flex items-center justify-center mb-6 text-black/25">
                  <IconLock />
                </div>
                <h3 className="text-lg font-bold text-black/80 mb-3">Sistema Latente</h3>
                <p className="text-[13px] text-black/50 leading-relaxed mb-8">
                  O BrandCode não está ativo neste projeto. Ative para permitir que as Agentes entendam a alma da sua marca.
                </p>
                <PButton className="w-full" onClick={onOpenBrandCode} disabled={!onOpenBrandCode}>
                  Habilitar sistema
                </PButton>
              </motion.div>
            )}

            {/* 3) BUILDING */}
            {!loading && norm.enabled && !norm.ready && (
              <motion.div
                key="building"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <div
                    className="absolute inset-0 blur-2xl rounded-full animate-pulse"
                    style={{ background: "radial-gradient(circle, rgba(255,205,170,0.45), rgba(195,175,255,0.25), transparent 70%)" }}
                  />
                  <div className="relative w-20 h-20 bg-white border border-black/5 rounded-3xl flex items-center justify-center text-black/70">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
                      <IconZap className="w-8 h-8" />
                    </motion.div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-black/80 mb-2">Protocolo em curso</h3>
                <p className="text-[13px] text-black/50 leading-relaxed mb-8 max-w-xs">
                  A Flor está entrevistando o projeto. O DNA será revelado assim que a síntese for concluída.
                </p>
                <div className="flex gap-3 w-full max-w-xs">
                  <PButton variant="secondary" className="flex-1" onClick={onOpenBrandCode} disabled={!onOpenBrandCode}>
                    Ver status
                  </PButton>
                  <PButton className="flex-1" onClick={onOpenProtocol} disabled={!onOpenProtocol}>
                    {norm.inProgress ? "Continuar" : "Iniciar"}
                  </PButton>
                </div>
              </motion.div>
            )}

            {/* 4) ACTIVE */}
            {!loading && norm.enabled && norm.ready && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                {/* Helix */}
                <div className="lg:col-span-7 relative">
                  <div className="absolute -inset-4 bg-black/[0.01] rounded-[40px] pointer-events-none border border-black/[0.03]" />
                  <DNAViz genes={genes} activeKey={activeKey} onSelect={setActiveKey} mode3D={mode3D} />

                  <div className="mt-6 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">DNA estável</span>
                    </div>
                    <div className="text-[11px] font-medium text-black/30 italic">
                      Confiança: {Math.round(norm.confidenceScore || 0)}%
                    </div>
                  </div>
                </div>

                {/* Panel */}
                <div className="lg:col-span-5 flex flex-col justify-between py-2">
                  <div className="space-y-8">
                    <SidePanel gene={activeGene} onClose={() => setActiveKey(null)} onRefine={onOpenProtocol} />

                    <div className="pt-6 border-t border-black/5">
                      <div className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-4">
                        Resumo executivo
                      </div>
                      <p className="text-[13px] text-black/60 leading-relaxed bg-white/40 p-4 rounded-2xl border border-black/5">
                        {norm.summary || "Nenhuma síntese disponível para este DNA ainda."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <PButton variant="secondary" className="flex-1" onClick={onOpenBrandCode} disabled={!onOpenBrandCode}>
                      Estúdio de marca
                    </PButton>
                    <PButton className="flex-1" onClick={onOpenProtocol} disabled={!onOpenProtocol}>
                      Refinar DNA
                    </PButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="p-5 bg-black/[0.02] border-t border-black/5 flex items-center justify-center">
          <p className="text-[10px] text-black/30 font-medium uppercase tracking-[0.25em]">
            Prana • BrandCode DNA • organismo vivo em camadas
          </p>
        </div>
      </Card>

      {/* ERROR OVERLAY */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">!</div>
              <div>
                <p className="text-[12px] font-bold text-red-800 uppercase tracking-tight">Erro de sincronização</p>
                <p className="text-[11px] text-red-600/80">{String(error)}</p>
              </div>
            </div>
            <PButton variant="ghost" onClick={refresh} className="text-red-800 hover:bg-red-100" icon={IconRefresh}>
              Tentar
            </PButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
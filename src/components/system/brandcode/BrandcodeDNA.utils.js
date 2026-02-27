/**
 * Helpers para normalizar o shape do "DNA" vindo do backend.
 * A gente não assume schema rígido, porque você ainda está consolidando.
 */

export function normalizeBrandCodeState(raw) {
  const state = raw || {};

  const enabled =
    state?.enabled ??
    state?.isEnabled ??
    state?.active ??
    (state?.status ? state.status !== "disabled" : false);

  const protocol =
    state?.protocol ??
    state?.questionnaire ??
    state?.onboarding ??
    null;

  const dna =
    state?.dna ??
    state?.brandCode?.dna ??
    state?.brandcode?.dna ??
    null;

  // "ready" significa: existe DNA consolidado (primeira geração concluída)
  const ready =
    !!dna &&
    (dna?.status === "ready" ||
      dna?.isReady === true ||
      dna?.version >= 1 ||
      Array.isArray(dna?.genes));

  // "inProgress" significa: protocolo rodando, mas DNA ainda não nasceu
  const inProgress =
    !ready &&
    (protocol?.status === "in_progress" ||
      protocol?.completed === false ||
      protocol?.progress >= 0);

  return {
    enabled,
    ready,
    inProgress,
    protocol,
    dna,
    raw: state,
  };
}

export function deriveGenesFromDNA(dna) {
  // Aceita vários formatos:
  // - dna.genes: [{ key,label,vitality,hint,tags }]
  // - dna.map: { identity: {...}, voice: {...} }
  // - dna.fields: {...}
  if (!dna) return [];

  if (Array.isArray(dna.genes)) {
    return dna.genes.map((g, i) => ({
      key: g.key || g.id || `gene_${i}`,
      label: g.label || g.name || g.key || `Gene ${i + 1}`,
      hint: g.hint || g.description || "",
      vitality: typeof g.vitality === "number" ? g.vitality : 0.65,
      tags: Array.isArray(g.tags) ? g.tags : [],
    }));
  }

  const obj = dna.map || dna.fields || dna;
  if (obj && typeof obj === "object") {
    return Object.entries(obj)
      .filter(([k, v]) => v && typeof v === "object")
      .map(([k, v], i) => ({
        key: v.key || k || `gene_${i}`,
        label: v.label || v.name || k,
        hint: v.hint || v.description || "",
        vitality: typeof v.vitality === "number" ? v.vitality : 0.62,
        tags: Array.isArray(v.tags) ? v.tags : [],
      }));
  }

  return [];
}
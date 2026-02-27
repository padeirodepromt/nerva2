// src/utils/planValidation.js
// Função para validar dependências de features em um plano
import { featuresList } from '../config/featuresList';

/**
 * Valida se todas as dependências das features habilitadas estão presentes no plano.
 * @param {string[]} enabledFeatures - Lista de ids de features habilitadas no plano
 * @returns {Object} { valid: boolean, missing: Array<{feature, missingDeps}> }
 */
export function validatePlanFeatures(enabledFeatures) {
  const enabledSet = new Set(enabledFeatures);
  const missing = [];
  for (const feature of featuresList) {
    if (enabledSet.has(feature.id) && feature.dependsOn) {
      const missingDeps = feature.dependsOn.filter(dep => !enabledSet.has(dep));
      if (missingDeps.length > 0) {
        missing.push({ feature: feature.id, missingDeps });
      }
    }
  }
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Exemplo de uso:
// const { valid, missing } = validatePlanFeatures(['kaban-view']);
// if (!valid) { ... }

/* src/api/agents/packages/neo/telemetry.js */
export const Telemetry = {
  /**
   * 📏 AUDITAR: Checagem de integridade bruta de código.
   */
  verify(originalFile, newCode) {
    const oldLines = originalFile?.split('\n').length || 0;
    const newLines = newCode.split('\n').length;
    
    // 1. Check de Preguiça Semântica
    const lazyMarkers = ['resto do código', 'mesma lógica', 'continua igual', '...'];
    const hasLazyStrings = lazyMarkers.some(marker => newCode.toLowerCase().includes(marker));

    // 2. Check de Delta (Perda de massa)
    const lineDrop = oldLines > 0 ? (newLines / oldLines) : 1;
    
    const report = {
      isValid: !hasLazyStrings && (lineDrop > 0.85 || oldLines === 0),
      stats: { oldLines, newLines, dropRatio: lineDrop },
      error: hasLazyStrings ? 'Preguiça detectada' : (lineDrop <= 0.85 ? 'Perda massiva de código' : null)
    };

    if (!report.isValid) {
      throw new Error(`[Neo Telemetry] Bloqueio: ${report.error}.`);
    }

    return report;
  }
};
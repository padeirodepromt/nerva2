/**
 * @file src/utils/id.js
 * @description Gerador de IDs únicos para o sistema (UUID v4).
 * Implementa Fallback para ambientes sem crypto nativo e Alias para compatibilidade.
 */

/**
 * Gera um ID único (UUID v4).
 * Função principal do sistema.
 */
export const createId = () => {
  // Verifica se o ambiente possui crypto (Node.js moderno ou Browsers recentes)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback robusto para ambientes legados ou inconsistentes
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * ALIAS DE COMPATIBILIDADE (Ritual de Preservação)
 * O Drizzle ORM e os schemas antigos (src/db/schema/*.js) chamam esta função de 'generateId'.
 * Mantemos este export para não quebrar o banco de dados existente.
 */
export const generateId = createId;
/**
 * Converte de forma segura um objeto JavaScript para uma string JSON,
 * focando em campos que podem ser complexos (como 'tool_calls').
 * @param {object} data O objeto para converter.
 * @param {string[]} fieldsToProcess Uma lista de chaves cujos valores devem ser convertidos para string.
 * @returns {object} O objeto com os campos especificados convertidos em string JSON.
 */
export function stringifyComplexFields(data, fieldsToProcess = []) {
  const result = { ...data };
  for (const field of fieldsToProcess) {
    // 🚩 CRÍTICO: Só serializa se o valor NÃO for null/undefined e for um objeto (ou array)
    if (result[field] !== null && result[field] !== undefined && typeof result[field] === 'object') {
      try {
        result[field] = JSON.stringify(result[field]);
      } catch (error) {
        console.error(`Falha ao converter o campo '${field}' para string JSON:`, error);
        result[field] = null;
      }
    } else if (result[field] === null || result[field] === undefined) {
        // Garante que null/undefined se mantenham como null
        result[field] = null;
    }
  }
  return result;
}

/**
 * Realiza o parse seguro de campos que são strings JSON dentro de um objeto.
 * @param {object} data O objeto com campos para parsear.
 * @param {string[]} fieldsToProcess Uma lista de chaves cujos valores devem ser parseados de JSON.
 * @returns {object} O objeto com os campos especificados convertidos de volta para objetos JavaScript.
 */
export function parseComplexFields(data, fieldsToProcess = []) {
  const result = { ...data };
  for (const field of fieldsToProcess) {
    // 🚩 CRÍTICO: Só faz o parse se for uma string (evita tentar parsear null, quebra o JSON.parse)
    if (typeof result[field] === 'string' && result[field].length > 0) {
      try {
        result[field] = JSON.parse(result[field]);
      } catch (error) {
        console.error(`Falha ao parsear o campo '${field}' do JSON:`, error);
        // Se o parse falhar, mantém o valor original (a string, que o componente terá que lidar)
      }
    } else if (result[field] === null || result[field] === undefined) {
        // Garante que campos nulos permaneçam como um objeto vazio para evitar erros de leitura aninhada (ex: data.planner_slot.day)
         result[field] = {};
    }
  }
  return result;
}

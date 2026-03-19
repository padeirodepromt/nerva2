/* src/db/schema.js
   desc: Agregador de Schemas. Exporta todas as tabelas para o Drizzle.
*/

export * from './schema/nerva_routines.js';
export * from './schema/nerva_operators.js';
export * from './schema/nerva_logs.js';
export * from './schema/nerva_approvals.js';
export { nervaConnectorsCatalog } from "./schema/nerva_connectors_catalog.js";
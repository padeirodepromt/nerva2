/* src/db/schema.js
   desc: Agregador de Schemas. Exporta todas as tabelas para o Drizzle.
*/

export * from './schema/core.js';     // Users, Projects, Tasks
export * from './schema/planning.js'; // Routines, Events, Tasks // Routines, Sankalpas, WeeklyTasks
export * from './schema/docs.js';     // Papyrus, Versions, MindMapNodes
export * from './schema/associations.js';
export * from './schema/energy.js';   // EnergyCheckins, AstralProfiles
export * from './schema/chat.js';     // Messages, Nexus
export * from './schema/collab.js';   // TeamMessages
export * from './schema/agents.js';   
export * from './schema/inventory.js'; 
export * from './schema/finance.js'; 
export * from './schema/logs.js';
export * from './schema/system.js';   // UserSystems, ProjectSystems, BrandCodes
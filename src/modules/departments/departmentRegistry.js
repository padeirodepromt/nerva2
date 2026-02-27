// src/modules/departments/departmentRegistry.js
// Fonte única de verdade para Departamentos (ontologia operacional)

export const DEPARTMENT_KEYS = {
  CORE: 'core',
  DEV: 'dev',
  NARRATIVE: 'narrative'
};

export const departmentRegistry = {

 [DEPARTMENT_KEYS.CORE]: {
   key: 'core',
   name: 'Core (Ash)',
   description: 'Prana geral. Operação base sem especialização (Ash, core tools, workflows padrão).',
   agents: ['ash'],
   workspaces: [], // ou o workspace base do Prana, se existir
   defaultSystems: [],
   defaultPackages: [],
   seed: {
   fields: [],
   templates: { docs: [], boards: [] }
  }
},

  [DEPARTMENT_KEYS.DEV]: {
    key: 'dev',
    name: 'Departamento DEV',
    description: 'Programação e arquitetura (Neo, TaskCodeWorkspace, refactors, etc.)',
    agents: ['neo_dev'],
    workspaces: ['TaskCodeWorkspace'],
    defaultSystems: [], // futuramente: devcode, standards, etc.
    defaultPackages: ['PACK_NEO_PRO'], // opcional: se quiser sugerir no Shop
    seed: {
      // fields e templates entram no Passo 3 (installer expandido)
      fields: [],
      templates: { docs: [], boards: [] }
    }
  },

  [DEPARTMENT_KEYS.NARRATIVE]: {
    key: 'narrative',
    name: 'Departamento Narrativa',
    description: 'Conteúdo e estratégia (Flor, TaskContentWorkspace, BrandCode/ContentCode)',
    agents: ['flor'],
    workspaces: ['TaskContentWorkspace'],
    defaultSystems: ['brandcode', 'contentcode'],
    defaultPackages: [],
    seed: {
      fields: [],
      templates: { docs: [], boards: [] }
    }
  }
};

export function assertDepartmentKey(departmentKey) {
  const dept = departmentRegistry[departmentKey];
  if (!dept) throw new Error(`Departamento inválido: ${departmentKey}`);
  return dept;
}
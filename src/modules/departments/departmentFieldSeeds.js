// src/modules/departments/departmentFieldSeeds.js
// Fonte única dos seeds de fields por Departamento.
// Catálogo de colunas (UI/governança). Valores vivem em JSONB (tasks.customData / records.properties).

export const VALID_FIELD_TYPES = ['text', 'number', 'dropdown', 'date', 'member', 'checkbox'];

export const DEPARTMENT_FIELD_SEEDS = {
  dev: [
    { name: 'Tipo', slug: 'task_type', type: 'dropdown', options: { items: ['bug', 'feature', 'refactor', 'chore'] }, is_required: false, display_order: 10 },
    { name: 'Área', slug: 'area', type: 'dropdown', options: { items: ['frontend', 'backend', 'infra', 'db'] }, is_required: false, display_order: 20 },
    { name: 'Complexidade', slug: 'complexity', type: 'dropdown', options: { items: ['S', 'M', 'L', 'XL'] }, is_required: false, display_order: 30 },
    { name: 'Ambiente', slug: 'env', type: 'dropdown', options: { items: ['local', 'staging', 'prod'] }, is_required: false, display_order: 40 },
    { name: 'Repo', slug: 'repo', type: 'text', options: null, is_required: false, display_order: 50 },
    { name: 'Branch', slug: 'branch', type: 'text', options: null, is_required: false, display_order: 60 },
    { name: 'PR Link', slug: 'pr_link', type: 'text', options: null, is_required: false, display_order: 70 },
    { name: 'Review', slug: 'review_needed', type: 'checkbox', options: null, is_required: false, display_order: 80 },
  ],

  narrative: [
    { name: 'Plataforma', slug: 'platform', type: 'dropdown', options: { items: ['instagram', 'youtube', 'tiktok', 'linkedin', 'newsletter', 'blog'] }, is_required: false, display_order: 10 },
    { name: 'Intenção', slug: 'intent', type: 'dropdown', options: { items: ['atrair', 'nutrir', 'converter', 'autoridade', 'comunidade'] }, is_required: false, display_order: 20 },
    { name: 'Persona', slug: 'persona', type: 'text', options: null, is_required: false, display_order: 30 },
    { name: 'Pilar', slug: 'pillar', type: 'text', options: null, is_required: false, display_order: 40 },
    { name: 'Formato', slug: 'format', type: 'dropdown', options: { items: ['carrossel', 'reels', 'story', 'post', 'artigo', 'email'] }, is_required: false, display_order: 50 },
    { name: 'Hook', slug: 'hook', type: 'text', options: null, is_required: false, display_order: 60 },
  ],

  core: []
};

export function normalizeDepartmentKey(input) {
  if (!input) return 'core';
  const k = String(input).toLowerCase().trim();
  if (k === 'dev' || k === 'narrative' || k === 'core') return k;
  return 'core';
}
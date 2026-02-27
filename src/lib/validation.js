/* src/lib/validation.js
   desc: Schemas de validação com Zod para toda a aplicação
*/

import { z } from 'zod';

// ============================================================================
// AUTH VALIDATION
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Senhas não conferem',
  path: ['passwordConfirm']
});

export const passwordResetSchema = z.object({
  email: z.string().email('Email inválido')
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword']
});

// ============================================================================
// PROFILE VALIDATION
// ============================================================================

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100).optional(),
  email: z.string().email('Email inválido').optional(),
  avatarUrl: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
  aiSettings: z.object({
    tone: z.enum(['formal', 'casual', 'friendly', 'professional']).optional(),
    role: z.string().max(100).optional(),
    language: z.enum(['pt-BR', 'en', 'es-ES']).optional()
  }).optional()
});

// ============================================================================
// DIARY VALIDATION
// ============================================================================

export const diarySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(50000),
  mood: z.enum(['calm', 'joy', 'focus', 'creativity', 'anxiety', 'confusion', 'gratitude', 'sadness']).optional(),
  tags: z.array(z.string()).optional()
});

// ============================================================================
// ENERGY VALIDATION
// ============================================================================

export const energyCheckinSchema = z.object({
  physical: z.number().min(0).max(5, 'Valor deve estar entre 0 e 5'),
  mental: z.number().min(0).max(5, 'Valor deve estar entre 0 e 5'),
  emotional: z.number().min(0).max(5, 'Valor deve estar entre 0 e 5'),
  spiritual: z.number().min(0).max(5, 'Valor deve estar entre 0 e 5'),
  notes: z.string().max(500).optional()
});

// ============================================================================
// PROJECT VALIDATION
// ============================================================================

export const projectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um hex válido').optional()
});

// ============================================================================
// TASK VALIDATION
// ============================================================================

export const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200),
  description: z.string().max(5000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  assignedTo: z.string().optional()
});

// ============================================================================
// MENSTRUAL CYCLE VALIDATION
// ============================================================================

export const menstrualCycleSchema = z.object({
  startDate: z.string().datetime('Data inválida'),
  notes: z.string().max(500).optional()
});

// Helper para validar e retornar erros formatados
export function validateData(schema, data) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated, errors: null };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });
    return { success: false, data: null, errors };
  }
}

export default {
  loginSchema,
  registerSchema,
  passwordResetSchema,
  passwordResetConfirmSchema,
  profileUpdateSchema,
  diarySchema,
  energyCheckinSchema,
  projectSchema,
  taskSchema,
  menstrualCycleSchema,
  validateData
};

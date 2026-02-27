/*
 * =================================================================
 * RITUAL 3 (BUILD): O GUARDIÃO DOS USUÁRIOS
 *
 * INTENÇÃO:
 * Este guardião protege a "fonte da verdade" dos Usuários
 * e suas interações, como 'findUserByName' e 'assignUserToTask'.
 * =================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mockar o DB e dependências
const mockDb = {
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(() => ([{ id: 'assign_cuid_123', taskId: 'task_1', userId: 'user_1' }])),
    })),
  })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn(() => ([{ id: 'task_1', updatedAt: '...' }])),
    })),
  })),
  query: {
    users: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    taskAssignments: {
      findFirst: vi.fn(),
    },
  },
};
vi.mock('../../db/index.js', () => ({
  db: mockDb,
}));

vi.mock('../../db/schema.js', () => ({
  users: { name: 'users.name' },
  tasks: { id: 'tasks.id' },
  taskAssignments: { taskId: 'taskAssignments.taskId', userId: 'taskAssignments.userId' },
}));

vi.mock('../../utils/id.js', () => ({
  createId: vi.fn(() => 'assign_cuid_123'),
}));

// 2. Importar o controller
import { findUserByName, assignUserToTask } from '../../src/api/controllers/userController.js';

// 3. Limpar os mocks
beforeEach(() => {
  vi.clearAllMocks();
});

describe('userController', () => {

  describe('findUserByName', () => {
    it('deve encontrar um usuário pelo nome', async () => {
      const mockUser = { id: 'user_1', name: 'Djay' };
      mockDb.query.users.findFirst.mockResolvedValueOnce(mockUser);

      const result = await findUserByName({ name: 'Djay' });

      expect(result).toEqual(mockUser);
      expect(mockDb.query.users.findFirst).toHaveBeenCalledTimes(1);
    });

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      mockDb.query.users.findFirst.mockResolvedValueOnce(null);

      await expect(
        findUserByName({ name: 'Inexistente' })
      ).rejects.toThrow('Usuário com nome "Inexistente" não encontrado.');
    });
  });

  describe('assignUserToTask', () => {
    it('deve atribuir um usuário a uma tarefa', async () => {
      // Simula que a atribuição NÃO existe
      mockDb.query.taskAssignments.findFirst.mockResolvedValueOnce(null);

      const result = await assignUserToTask({ taskId: 'task_1', userId: 'user_1' });

      expect(result.success).toBe(true);
      expect(result.message).toContain('atribuído à tarefa com sucesso');
      expect(result.assignment.id).toBe('assign_cuid_123');

      // Verifica se tentou criar a atribuição
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'assign_cuid_123',
          taskId: 'task_1',
          userId: 'user_1',
        })
      );
      
      // Verifica se atualizou o 'updatedAt' da tarefa
      expect(mockDb.update).toHaveBeenCalledTimes(1);
    });

    it('deve pular se a atribuição já existir', async () => {
      const existingAssignment = { id: 'assign_999', taskId: 'task_1', userId: 'user_1' };
      // Simula que a atribuição JÁ existe
      mockDb.query.taskAssignments.findFirst.mockResolvedValueOnce(existingAssignment);

      const result = await assignUserToTask({ taskId: 'task_1', userId: 'user_1' });

      expect(result.success).toBe(true);
      expect(result.message).toContain('Usuário já estava atribuído');
      expect(result.assignment).toEqual(existingAssignment);

      // Garante que NÃO tentou inserir ou atualizar
      expect(mockDb.insert).not.toHaveBeenCalled();
      expect(mockDb.update).not.toHaveBeenCalled();
    });
  });
});

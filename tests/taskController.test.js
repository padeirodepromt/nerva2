/*
 * =================================================================
 * RITUAL 3 (BUILD): O PRIMEIRO GUARDIÃO
 *
 * INTENÇÃO:
 * Este é o nosso primeiro "guardião" para a "fonte da verdade"
 * (o taskController).
 *
 * Usamos 'vi.mock' para "fingir" (mockar) o banco de dados.
 * Isso nos permite testar a *lógica* do controller em isolamento,
 * sem precisar de um banco de dados real rodando.
 *
 * Este é um teste de fundação.
 * =================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mockar o DB ANTES de qualquer importação
// Estamos dizendo ao Vitest: "Qualquer um que importar
// '../../db/index.js', entregue este objeto falso."
const mockDb = {
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(() => ([{ id: 'task_cuid_123', name: 'Tarefa Teste' }])),
    })),
  })),
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ([{ count: 0 }])),
    })),
  })),
  query: {
    tasks: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
};
vi.mock('../../db/index.js', () => ({
  db: mockDb,
}));

// 2. Mockar o Schema (para evitar erros de 'undefined')
vi.mock('../../db/schema.js', () => ({
  tasks: {
    projectId: 'tasks.projectId',
  },
  sql: {
    count: vi.fn(() => 'count(*)'),
  },
}));

// 3. Mockar o ID
vi.mock('../../utils/id.js', () => ({
  createId: vi.fn(() => 'task_cuid_123'),
}));

// 4. Importar o controller (agora ele usará nossos mocks)
import { createTask, getTaskDetails } from '../../src/api/controllers/taskController.js';

// 5. Limpar os mocks antes de cada teste
beforeEach(() => {
  vi.clearAllMocks();
});

describe('taskController', () => {
  
  describe('createTask', () => {
    it('deve criar uma tarefa com sucesso', async () => {
      const taskData = {
        name: 'Tarefa Teste',
        description: 'Descrição da tarefa',
        projectId: 'proj_123',
      };

      const result = await createTask(taskData);

      // Verifica se o ID foi gerado
      expect(result.id).toBe('task_cuid_123');
      expect(result.name).toBe('Tarefa Teste');

      // Verifica se o DB foi chamado com os dados corretos
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'task_cuid_123',
          name: 'Tarefa Teste',
          projectId: 'proj_123',
          status: 'a_fazer', // Verifica o status padrão
        })
      );
    });

    it('deve calcular a ordem (order) se não for fornecida', async () => {
      // Simula que já existem 2 tarefas no projeto
      mockDb.select().from().where.mockResolvedValueOnce([{ count: 2 }]);

      const taskData = {
        name: 'Terceira Tarefa',
        projectId: 'proj_456',
      };

      await createTask(taskData);

      // Verifica se o DB foi chamado para contar as tarefas
      expect(mockDb.select).toHaveBeenCalledTimes(1);

      // Verifica se a nova tarefa foi inserida com a ordem correta (2)
      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Terceira Tarefa',
          projectId: 'proj_456',
          order: 2, // A contagem (0, 1) é 2, então a nova ordem é 2
        })
      );
    });
  });

  describe('getTaskDetails', () => {
    it('deve retornar detalhes da tarefa', async () => {
      const mockTask = { id: 'task_cuid_123', name: 'Tarefa Encontrada' };
      mockDb.query.tasks.findFirst.mockResolvedValueOnce(mockTask);

      const result = await getTaskDetails({ taskId: 'task_cuid_123' });

      expect(result).toEqual(mockTask);
      expect(mockDb.query.tasks.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(), // O matcher 'eq' é complexo, apenas checamos se foi chamado
        })
      );
    });

    it('deve lançar um erro se a tarefa não for encontrada', async () => {
      mockDb.query.tasks.findFirst.mockResolvedValueOnce(null);

      await expect(
        getTaskDetails({ taskId: 'id_nao_existe' })
      ).rejects.toThrow('Tarefa não encontrada.');
    });
  });
});

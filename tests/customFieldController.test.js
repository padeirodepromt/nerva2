/*
 * =================================================================
 * RITUAL 3 (BUILD): O GUARDIÃO DOS CAMPOS CUSTOMIZADOS
 *
 * INTENÇÃO:
 * Este guardião protege a lógica de 'upsert' dos campos
 * customizados, que é complexa e vital para a IA.
 * =================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mockar o DB e dependências
const mockDb = {
  insert: vi.fn(),
  update: vi.fn(),
  query: {
    customFields: {
      findFirst: vi.fn(),
    },
    taskCustomFields: {
      findFirst: vi.fn(),
    },
  },
};
vi.mock('../../db/index.js', () => ({
  db: mockDb,
}));

vi.mock('../../db/schema.js', () => ({
  customFields: { name: 'customFields.name' },
  taskCustomFields: {
    taskId: 'taskCustomFields.taskId',
    fieldId: 'taskCustomFields.fieldId',
    id: 'taskCustomFields.id',
  },
  tasks: { id: 'tasks.id' },
}));

vi.mock('../../utils/id.js', () => ({
  createId: vi.fn(() => 'cuid_field_123'),
}));

// 2. Importar o controller
import { getCustomFieldDetailsForTask, updateCustomFieldForTask } from '../../src/api/controllers/customFieldController.js';

// 3. Limpar os mocks
beforeEach(() => {
  vi.clearAllMocks();
});

describe('customFieldController', () => {

  const mockFieldDef = { id: 'field_1', name: 'Prioridade AI' };
  const mockTaskValue = { id: 'value_1', fieldId: 'field_1', taskId: 'task_1', value: '"Alta"' };

  describe('getCustomFieldDetailsForTask', () => {
    it('deve retornar um campo e seu valor', async () => {
      mockDb.query.customFields.findFirst.mockResolvedValueOnce(mockFieldDef);
      mockDb.query.taskCustomFields.findFirst.mockResolvedValueOnce(mockTaskValue);

      const result = await getCustomFieldDetailsForTask({ taskId: 'task_1', fieldName: 'Prioridade AI' });

      expect(result.field).toEqual(mockFieldDef);
      expect(result.value).toBe('"Alta"');
    });

    it('deve retornar valor nulo se o campo existir mas o valor não', async () => {
      mockDb.query.customFields.findFirst.mockResolvedValueOnce(mockFieldDef);
      mockDb.query.taskCustomFields.findFirst.mockResolvedValueOnce(null); // Valor não existe

      const result = await getCustomFieldDetailsForTask({ taskId: 'task_1', fieldName: 'Prioridade AI' });

      expect(result.field).toEqual(mockFieldDef);
      expect(result.value).toBeNull();
    });

    it('deve lançar erro se a definição do campo não existir', async () => {
      mockDb.query.customFields.findFirst.mockResolvedValueOnce(null); // Definição não existe

      await expect(
        getCustomFieldDetailsForTask({ taskId: 'task_1', fieldName: 'Inexistente' })
      ).rejects.toThrow('Campo customizado "Inexistente" não existe.');
    });
  });

  describe('updateCustomFieldForTask', () => {
    
    // Mock para a função de update (dentro do describe)
    const mockUpdateReturning = vi.fn(() => ([{...mockTaskValue, value: '"Baixa"'} ]));
    mockDb.update.mockReturnValue({ set: () => ({ where: mockUpdateReturning }) });
    
    // Mock para a função de insert (dentro do describe)
    const mockInsertReturning = vi.fn(() => ([ mockTaskValue ]));
    mockDb.insert.mockReturnValue({ values: mockInsertReturning });


    it('deve ATUALIZAR um valor se ele já existir', async () => {
      mockDb.query.customFields.findFirst.mockResolvedValueOnce(mockFieldDef);
      mockDb.query.taskCustomFields.findFirst.mockResolvedValueOnce(mockTaskValue); // Valor EXISTE

      const result = await updateCustomFieldForTask({
        taskId: 'task_1',
        fieldName: 'Prioridade AI',
        value: 'Baixa',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('atualizado com sucesso');

      // Deve chamar UPDATE, não INSERT
      expect(mockDb.update).toHaveBeenCalledTimes(2); // 1 para o campo, 1 para a tarefa
      expect(mockUpdateReturning).toHaveBeenCalledTimes(1);
      expect(mockDb.insert).not.toHaveBeenCalled();
    });

    it('deve INSERIR um valor se ele não existir', async () => {
      mockDb.query.customFields.findFirst.mockResolvedValueOnce(mockFieldDef);
      mockDb.query.taskCustomFields.findFirst.mockResolvedValueOnce(null); // Valor NÃO existe

      const result = await updateCustomFieldForTask({
        taskId: 'task_1',
        fieldName: 'Prioridade AI',
        value: 'Alta',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTaskValue);

      // Deve chamar INSERT, não UPDATE (exceto o update da tarefa)
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
      expect(mockInsertReturning).toHaveBeenCalledTimes(1);
      expect(mockUpdateReturning).not.toHaveBeenCalled();
      
      // Deve sempre atualizar o 'updatedAt' da tarefa
      expect(mockDb.update).toHaveBeenCalledTimes(1); 
    });
  });
});

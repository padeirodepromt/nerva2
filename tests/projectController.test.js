/*
 * =================================================================
 * RITUAL 3 (BUILD): O GUARDIÃO DOS PROJETOS
 *
 * INTENÇÃO:
 * Este guardião protege a "fonte da verdade" dos Projetos.
 *
 * Ele "finge" (mocka) o banco de dados para testar a lógica
 * de 'createProject' e 'getProjectDetails' em isolamento.
 * =================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mockar o DB e dependências ANTES de importar o controller
const mockDb = {
  insert: vi.fn(() => ({
    values: vi.fn(() => ({
      returning: vi.fn(() => ([{ id: 'proj_cuid_123', name: 'Projeto Teste' }])),
    })),
  })),
  query: {
    projects: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    tasks: {
      findMany: vi.fn(),
    },
  },
};
vi.mock('../../db/index.js', () => ({
  db: mockDb,
}));

vi.mock('../../db/schema.js', () => ({
  projects: { id: 'projects.id' },
  tasks: { order: 'tasks.order' },
}));

vi.mock('../../utils/id.js', () => ({
  createId: vi.fn(() => 'proj_cuid_123'),
}));

// 2. Importar o controller (agora ele usará nossos mocks)
import { createProject, getProjectDetails, getProjectHierarchy } from '../../src/api/controllers/projectController.js';

// 3. Limpar os mocks antes de cada teste
beforeEach(() => {
  vi.clearAllMocks();
});

describe('projectController', () => {

  describe('createProject', () => {
    it('deve criar um projeto com sucesso', async () => {
      const projectData = {
        name: 'Projeto Teste',
        description: 'Descrição do projeto',
        userId: 'user_123',
      };

      const result = await createProject(projectData);

      expect(result.id).toBe('proj_cuid_123');
      expect(result.name).toBe('Projeto Teste');

      // Verifica se o DB foi chamado com os dados corretos
      expect(mockDb.insert).toHaveBeenCalledTimes(1);
      expect(mockDb.insert().values).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'proj_cuid_123',
          name: 'Projeto Teste',
          ownerId: 'user_123',
          status: 'planejado',
        })
      );
    });
  });

  describe('getProjectDetails', () => {
    it('deve retornar detalhes do projeto com suas relações', async () => {
      const mockProject = { id: 'proj_cuid_123', name: 'Projeto Encontrado', tasks: [] };
      mockDb.query.projects.findFirst.mockResolvedValueOnce(mockProject);

      const result = await getProjectDetails({ projectId: 'proj_cuid_123' });

      expect(result).toEqual(mockProject);
      // Verifica se a query foi chamada corretamente
      expect(mockDb.query.projects.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(), // 'eq' é mockado
          with: expect.objectContaining({
            tasks: expect.anything(),
            subProjects: expect.anything(),
          }),
        })
      );
    });

    it('deve lançar um erro se o projeto não for encontrado', async () => {
      mockDb.query.projects.findFirst.mockResolvedValueOnce(null);

      await expect(
        getProjectDetails({ projectId: 'id_nao_existe' })
      ).rejects.toThrow('Projeto não encontrado.');
    });
  });

  describe('getProjectHierarchy', () => {
    it('deve construir a hierarquia corretamente', async () => {
      const mockProjects = [
        { id: 'p1', name: 'Projeto Pai 1', parentId: null, tasks: [] },
        { id: 'p2', name: 'Projeto Filho 1.1', parentId: 'p1', tasks: [] },
        { id: 'p3', name: 'Projeto Pai 2', parentId: null, tasks: [] },
      ];
      mockDb.query.projects.findMany.mockResolvedValueOnce(mockProjects);

      const result = await getProjectHierarchy();

      // Espera 2 projetos raiz
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Projeto Pai 1');
      expect(result[1].name).toBe('Projeto Pai 2');
      
      // Espera 1 subprojeto no primeiro pai
      expect(result[0].subProjects).toBeDefined();
      expect(result[0].subProjects.length).toBe(1);
      expect(result[0].subProjects[0].name).toBe('Projeto Filho 1.1');
      
      // Espera 0 subprojetos no segundo pai
      expect(result[1].subProjects).toBeDefined();
      expect(result[1].subProjects.length).toBe(0);
    });
  });

});

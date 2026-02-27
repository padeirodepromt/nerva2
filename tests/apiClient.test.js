// Conteúdo original de /src/tests/apiClient.test.js
// Movido para /tests/apiClient.test.js

import { describe, it, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { apiClient, handleRequest } from '../src/api/apiClient.js';
import { toast } from '../src/components/ui/use-toast.js';

// Mockar dependências
vi.mock('axios');
vi.mock('../src/components/ui/use-toast.js', () => ({
  toast: vi.fn(),
}));

describe('apiClient', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar uma instância do axios com a baseURL correta', () => {
    // A baseURL é /api, conforme definido no apiClient.js
    expect(apiClient.defaults.baseURL).toBe('/api');
  });

  describe('handleRequest', () => {
    it('deve retornar dados em caso de sucesso', async () => {
      const mockData = { id: 1, name: 'Teste' };
      const requestFunc = vi.fn().mockResolvedValue({ data: mockData });

      const result = await handleRequest(requestFunc);

      expect(result).toEqual(mockData);
      expect(requestFunc).toHaveBeenCalledTimes(1);
      expect(toast).not.toHaveBeenCalled();
    });

    it('deve mostrar toast de erro e retornar nulo em caso de falha', async () => {
      const errorMessage = 'Erro na rede';
      const requestFunc = vi.fn().mockRejectedValue(new Error(errorMessage));

      const result = await handleRequest(requestFunc);

      expect(result).toBeNull();
      expect(requestFunc).toHaveBeenCalledTimes(1);
      expect(toast).toHaveBeenCalledWith({
        title: 'Erro na Requisição',
        description: expect.stringContaining(errorMessage),
        variant: 'destructive',
      });
    });

    it('deve usar a mensagem de erro da resposta da API se disponível', async () => {
      const apiError = {
        response: {
          data: {
            error: 'ID não encontrado',
          },
        },
      };
      const requestFunc = vi.fn().mockRejectedValue(apiError);

      await handleRequest(requestFunc);

      expect(toast).toHaveBeenCalledWith({
        title: 'Erro na Requisição',
        description: 'ID não encontrado',
        variant: 'destructive',
      });
    });
  });
});

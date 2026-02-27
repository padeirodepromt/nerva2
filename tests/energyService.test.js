// Conteúdo original de /src/tests/energyService.test.js
// Movido para /tests/energyService.test.js

import { describe, it, expect, vi } from 'vitest';
import { getEnergyCheckInAnalysis } from '../src/ai_services/energyService.js';
import { handleChatRequest } from '../src/ai_services/chatService.js';

// Mock o chatService
vi.mock('../src/ai_services/chatService.js', () => ({
  handleChatRequest: vi.fn(),
}));

describe('energyService', () => {
  it('deve formatar o prompt corretamente e chamar o chatService', async () => {
    const checkInData = {
      energyLevel: 8,
      focusLevel: 7,
      mood: 'feliz',
      tags: ['produtivo', 'focado'],
      notes: 'Tive uma ótima manhã.',
    };

    const mockAnalysis = {
      analysis: 'Você está se sentindo ótimo!',
      suggestions: ['Continue assim.'],
    };

    // Simula o chatService retornando a análise
    handleChatRequest.mockResolvedValue(mockAnalysis);

    const result = await getEnergyCheckInAnalysis(checkInData);

    // Verifica se o handleChatRequest foi chamado
    expect(handleChatRequest).toHaveBeenCalledTimes(1);

    // Verifica se o prompt (primeiro argumento) foi construído corretamente
    const calls = handleChatRequest.mock.calls;
    const messages = calls[0][0];
    const systemMessage = messages.find(m => m.role === 'system').content;
    const userMessage = messages.find(m => m.role === 'user').content;

    // Verifica o System Prompt
    expect(systemMessage).toContain('Você é Prana, um assistente de bem-estar');
    expect(systemMessage).toContain('analise o check-in de energia');
    expect(systemMessage).toContain('JSON com "analysis" e "suggestions"');

    // Verifica a Mensagem do Usuário
    expect(userMessage).toContain('"energyLevel": 8');
    expect(userMessage).toContain('"mood": "feliz"');
    expect(userMessage).toContain('"tags": ["produtivo","focado"]');
    expect(userMessage).toContain('"notes": "Tive uma ótima manhã."');

    // Verifica se o modelo correto foi usado (segundo argumento)
    const model = calls[0][1];
    expect(model).toBe('claude-3-5-sonnet-20240620');

    // Verifica o resultado
    expect(result).toEqual(mockAnalysis);
  });
});

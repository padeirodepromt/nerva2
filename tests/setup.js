/*
 * =================================================================
 * RITUAL 3 (FIX): ARQUIVO DE SETUP DOS GUARDIÕES
 *
 * INTENÇÃO:
 * Este arquivo prepara o ambiente para *todos* os testes.
 * Ele é executado automaticamente pelo Vitest antes de
 * rodar qualquer "guardião".
 *
 * (Por enquanto, está simples, mas pode ser usado para
 * importar matchers globais, mocks, etc.)
 * =================================================================
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estende o 'expect' do Vitest com os matchers do jest-dom
// (ex: .toBeInTheDocument(), .toHaveTextContent())
expect.extend(matchers);

// Limpa o 'jsdom' (nosso DOM de teste) após cada teste
// para evitar que um teste "suje" o próximo.
afterEach(() => {
  cleanup();
});

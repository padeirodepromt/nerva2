// Conteúdo original de /tests/customFieldUtils.test.js
// Movido para /tests/customFieldUtils.test.js

import { describe, it, expect } from 'vitest';
import {
  parseCustomField,
  serializeCustomField,
  getSafeValue,
} from '../src/ai_services/utils/customFieldUtils.js';

describe('customFieldUtils', () => {
  // Testes do serializeCustomField
  describe('serializeCustomField', () => {
    it('deve serializar um objeto para string JSON', () => {
      const input = { key: 'value', count: 1 };
      const expected = '{"key":"value","count":1}';
      expect(serializeCustomField(input)).toBe(expected);
    });

    it('deve serializar um array para string JSON', () => {
      const input = ['a', 'b', 123];
      const expected = '["a","b",123]';
      expect(serializeCustomField(input)).toBe(expected);
    });

    it('deve retornar uma string como ela é', () => {
      const input = 'just a string';
      expect(serializeCustomField(input)).toBe(input);
    });

    it('deve serializar um número para string', () => {
      const input = 42;
      expect(serializeCustomField(input)).toBe('42');
    });

    it('deve serializar um booleano para string', () => {
      const input = true;
      expect(serializeCustomField(input)).toBe('true');
    });

    it('deve lidar com nulo', () => {
      const input = null;
      expect(serializeCustomField(input)).toBe('null');
    });

    it('deve lidar com indefinido (undefined)', () => {
      const input = undefined;
      expect(serializeCustomField(input)).toBe('null'); // ou 'undefined' dependendo da implementação
    });
  });

  // Testes do parseCustomField
  describe('parseCustomField', () => {
    it('deve parsear uma string JSON de objeto', () => {
      const input = '{"key":"value","count":1}';
      const expected = { key: 'value', count: 1 };
      expect(parseCustomField(input)).toEqual(expected);
    });

    it('deve parsear uma string JSON de array', () => {
      const input = '["a","b",123]';
      const expected = ['a', 'b', 123];
      expect(parseCustomField(input)).toEqual(expected);
    });

    it('deve retornar uma string que não é JSON como ela é', () => {
      const input = 'just a string';
      expect(parseCustomField(input)).toBe(input);
    });

    it('deve retornar um número de uma string numérica', () => {
      const input = '42';
      expect(parseCustomField(input)).toBe(42);
    });

    it('deve retornar um booleano de uma string "true"', () => {
      const input = 'true';
      expect(parseCustomField(input)).toBe(true);
    });

    it('deve retornar um booleano de uma string "false"', () => {
      const input = 'false';
      expect(parseCustomField(input)).toBe(false);
    });

    it('deve retornar nulo de uma string "null"', () => {
      const input = 'null';
      expect(parseCustomField(input)).toBeNull();
    });

    it('deve retornar nulo para uma string "undefined"', () => {
      const input = 'undefined';
      expect(parseCustomField(input)).toBeNull();
    });

    it('deve retornar a string original se o JSON for inválido', () => {
      const input = '{"key":"value",'; // JSON inválido
      expect(parseCustomField(input)).toBe(input);
    });
  });

  // Testes do getSafeValue
  describe('getSafeValue', () => {
    const mockTask = {
      customFields: [
        {
          id: 'cf1',
          customField: { name: 'TextoSimples' },
          value: 'Hello World',
        },
        {
          id: 'cf2',
          customField: { name: 'JsonObjeto' },
          value: '{"count": 10, "label": "dez"}',
        },
        {
          id: 'cf3',
          customField: { name: 'JsonArray' },
          value: '["tag1", "tag2"]',
        },
        {
          id: 'cf4',
          customField: { name: 'Numero' },
          value: '123.45',
        },
        {
          id: 'cf5',
          customField: { name: 'Booleano' },
          value: 'true',
        },
        {
          id: 'cf6',
          customField: { name: 'Nulo' },
          value: 'null',
        },
      ],
    };

    it('deve retornar o valor parseado de um campo existente (Objeto)', () => {
      const expected = { count: 10, label: 'dez' };
      expect(getSafeValue(mockTask, 'JsonObjeto')).toEqual(expected);
    });

    it('deve retornar o valor parseado de um campo existente (Array)', () => {
      const expected = ['tag1', 'tag2'];
      expect(getSafeValue(mockTask, 'JsonArray')).toEqual(expected);
    });

    it('deve retornar o valor parseado de um campo existente (String)', () => {
      expect(getSafeValue(mockTask, 'TextoSimples')).toBe('Hello World');
    });

    it('deve retornar o valor parseado de um campo existente (Numero)', () => {
      expect(getSafeValue(mockTask, 'Numero')).toBe(123.45);
    });

    it('deve retornar o valor parseado de um campo existente (Booleano)', () => {
      expect(getSafeValue(mockTask, 'Booleano')).toBe(true);
    });

    it('deve retornar o valor parseado de um campo existente (Nulo)', () => {
      expect(getSafeValue(mockTask, 'Nulo')).toBeNull();
    });

    it('deve retornar o valor default se o campo não existir', () => {
      const defaultValue = 'default';
      expect(getSafeValue(mockTask, 'CampoInexistente', defaultValue)).toBe(
        defaultValue,
      );
    });

    it('deve retornar nulo se o campo não existir e não houver default', () => {
      expect(getSafeValue(mockTask, 'CampoInexistente')).toBeNull();
    });

    it('deve retornar nulo se a task não tiver customFields', () => {
      const taskSemCampos = { id: 'task123' };
      expect(getSafeValue(taskSemCampos, 'TextoSimples')).toBeNull();
    });
  });
});

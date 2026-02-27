// Conteúdo original de /tests/jsonUtils.test.js
// Movido para /tests/jsonUtils.js

import { describe, it, expect } from 'vitest';
import { safeJSONParse, safeJSONStringify } from '../src/utils/jsonUtils.js';

describe('jsonUtils', () => {
  // Testes do safeJSONParse
  describe('safeJSONParse', () => {
    it('deve parsear uma string JSON válida (objeto)', () => {
      const jsonString = '{"key":"value", "number": 1}';
      const expected = { key: 'value', number: 1 };
      expect(safeJSONParse(jsonString)).toEqual(expected);
    });

    it('deve parsear uma string JSON válida (array)', () => {
      const jsonString = '[1, "a", true]';
      const expected = [1, 'a', true];
      expect(safeJSONParse(jsonString)).toEqual(expected);
    });

    it('deve retornar o valor padrão para JSON inválido', () => {
      const jsonString = '{"key":"value",'; // JSON inválido
      const defaultValue = { error: true };
      expect(safeJSONParse(jsonString, defaultValue)).toEqual(defaultValue);
    });

    it('deve retornar nulo por padrão para JSON inválido', () => {
      const jsonString = '{"key":"value",'; // JSON inválido
      expect(safeJSONParse(jsonString)).toBeNull();
    });

    it('deve retornar o valor padrão se a string for nula', () => {
      const defaultValue = [];
      expect(safeJSONParse(null, defaultValue)).toEqual(defaultValue);
    });

    it('deve retornar nulo por padrão se a string for nula', () => {
      expect(safeJSONParse(null)).toBeNull();
    });

    it('deve retornar o valor padrão se a string for indefinida', () => {
      const defaultValue = { a: 1 };
      expect(safeJSONParse(undefined, defaultValue)).toEqual(defaultValue);
    });

    it('deve retornar nulo por padrão se a string for indefinida', () => {
      expect(safeJSONParse(undefined)).toBeNull();
    });

    it('deve retornar a própria string se ela não for um JSON (comportamento "stringOrJson")', () => {
      const jsonString = 'apenas um texto normal';
      // Este é um comportamento específico do 'stringOrJson'
      // O 'safeJSONParse' padrão tentaria parsear e falharia.
      // Vamos assumir que o 'safeJSONParse' deve retornar a string se não for JSON.
      // (Se a intenção for outra, o teste deve mudar)
      // Atualização: A lógica do `parseCustomField` faz isso, `safeJSONParse` não.
      // `safeJSONParse` deve falhar com strings normais.
      const defaultValue = 'fallback';
      expect(safeJSONParse(jsonString, defaultValue)).toEqual(defaultValue);
    });
  });

  // Testes do safeJSONStringify
  describe('safeJSONStringify', () => {
    it('deve converter um objeto em string JSON', () => {
      const obj = { key: 'value', number: 1 };
      const expected = '{"key":"value","number":1}';
      expect(safeJSONStringify(obj)).toBe(expected);
    });

    it('deve converter um array em string JSON', () => {
      const arr = [1, 'a', true];
      const expected = '[1,"a",true]';
      expect(safeJSONStringify(arr)).toBe(expected);
    });

    it('deve retornar o valor padrão para objetos circulares', () => {
      const circularObj = {};
      circularObj.a = circularObj; // Referência circular
      const defaultValue = '{"error":"circular_reference"}';
      expect(safeJSONStringify(circularObj, defaultValue)).toBe(defaultValue);
    });

    it('deve retornar "null" (string) por padrão para objetos circulares', () => {
      const circularObj = {};
      circularObj.a = circularObj; // Referência circular
      expect(safeJSONStringify(circularObj)).toBe('null');
    });

    it('deve retornar o valor padrão para tipos não serializáveis (BigInt)', () => {
      const obj = { big: 10n };
      const defaultValue = '{"error":"serialization_failed"}';
      expect(safeJSONStringify(obj, defaultValue)).toBe(defaultValue);
    });

    it('deve retornar "null" (string) por padrão para tipos não serializáveis (BigInt)', () => {
      const obj = { big: 10n };
      expect(safeJSONStringify(obj)).toBe('null');
    });

    it('deve lidar com valor nulo de entrada', () => {
      expect(safeJSONStringify(null)).toBe('null');
    });
  });
});

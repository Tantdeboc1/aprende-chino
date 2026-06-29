// src/lib/socialStore.test.js
// Tests de las funciones puras de socialStore (las que tocan Firestore se
// importan de forma diferida y no se ejercitan aquí).
import { describe, it, expect } from 'vitest';
import { pairId, normalizeCode, formatCode } from './socialStore.js';

describe('pairId', () => {
  it('es simétrico: el mismo par produce el mismo id en cualquier orden', () => {
    expect(pairId('abc', 'xyz')).toBe(pairId('xyz', 'abc'));
  });

  it('ordena los uid de forma estable', () => {
    expect(pairId('xyz', 'abc')).toBe('abc_xyz');
  });
});

describe('normalizeCode', () => {
  it('pasa a mayúsculas y elimina separadores/espacios', () => {
    expect(normalizeCode('abc-def')).toBe('ABCDEF');
    expect(normalizeCode(' a b c ')).toBe('ABC');
  });

  it('tolera entradas vacías o nulas', () => {
    expect(normalizeCode('')).toBe('');
    expect(normalizeCode(null)).toBe('');
    expect(normalizeCode(undefined)).toBe('');
  });

  it('descarta caracteres no alfanuméricos', () => {
    expect(normalizeCode('A!B@C#1')).toBe('ABC1');
  });
});

describe('formatCode', () => {
  it('inserta un guion tras los 3 primeros caracteres', () => {
    expect(formatCode('ABCDEF')).toBe('ABC-DEF');
  });

  it('normaliza antes de formatear', () => {
    expect(formatCode('abc-def')).toBe('ABC-DEF');
  });

  it('no añade guion con 3 caracteres o menos', () => {
    expect(formatCode('AB')).toBe('AB');
    expect(formatCode('ABC')).toBe('ABC');
  });
});

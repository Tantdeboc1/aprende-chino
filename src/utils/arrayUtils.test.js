// src/utils/arrayUtils.test.js
import { describe, it, expect } from 'vitest';
import { shuffle, pickN } from './arrayUtils.js';

describe('shuffle', () => {
  it('no muta el array original', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffle(original);
    expect(original).toEqual(copy);
  });

  it('conserva todos los elementos (es una permutación)', () => {
    const input = ['a', 'b', 'c', 'd'];
    const out = shuffle(input);
    expect(out).toHaveLength(input.length);
    expect([...out].sort()).toEqual([...input].sort());
  });

  it('maneja el array vacío', () => {
    expect(shuffle([])).toEqual([]);
  });
});

describe('pickN', () => {
  it('devuelve exactamente n elementos', () => {
    expect(pickN([1, 2, 3, 4, 5], 3)).toHaveLength(3);
  });

  it('no devuelve más elementos de los que hay', () => {
    expect(pickN([1, 2], 5)).toHaveLength(2);
  });

  it('devuelve elementos del array original sin duplicar', () => {
    const out = pickN([1, 2, 3, 4, 5], 3);
    const unique = new Set(out);
    expect(unique.size).toBe(out.length);
    out.forEach(x => expect([1, 2, 3, 4, 5]).toContain(x));
  });
});

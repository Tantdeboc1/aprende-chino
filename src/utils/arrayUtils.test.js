// src/utils/arrayUtils.test.js
import { describe, it, expect } from 'vitest';
import { shuffle, pickN, pickCycle } from './arrayUtils.js';

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

describe('pickCycle', () => {
  it('no repite mientras el pool dé de sí (n <= longitud)', () => {
    const out = pickCycle([1, 2, 3, 4, 5], 5);
    expect(out).toHaveLength(5);
    expect(new Set(out).size).toBe(5);
  });

  it('recicla equitativamente cuando n > longitud (cada elemento sale igual)', () => {
    // Pool de 5, se piden 10: cada elemento debe aparecer exactamente 2 veces.
    const out = pickCycle([1, 2, 3, 4, 5], 10);
    expect(out).toHaveLength(10);
    const counts = out.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {});
    expect(Object.values(counts)).toEqual([2, 2, 2, 2, 2]);
  });

  it('reparte el resto sin repetir dentro del último ciclo', () => {
    // Pool de 4, se piden 6: 4 únicos + 2 extra distintos entre sí.
    const out = pickCycle(['a', 'b', 'c', 'd'], 6);
    expect(out).toHaveLength(6);
    expect(new Set(out.slice(0, 4)).size).toBe(4);
    expect(new Set(out.slice(4)).size).toBe(2);
  });

  it('devuelve [] con pool vacío o n = 0 (sin bucle infinito)', () => {
    expect(pickCycle([], 10)).toEqual([]);
    expect(pickCycle([1, 2], 0)).toEqual([]);
  });
});

// src/utils/pronunciationScore.test.js
import { describe, it, expect } from 'vitest';
import { scorePronunciation } from './pronunciationScore.js';

describe('scorePronunciation', () => {
  it('puntúa 100 una coincidencia exacta', () => {
    const r = scorePronunciation('你好', '你好');
    expect(r.score).toBe(100);
    expect(r.level).toBe('perfect');
    expect(r.charMatches).toEqual([true, true]);
  });

  it('ignora la puntuación y los espacios al comparar', () => {
    const r = scorePronunciation('你好！', '你 好');
    expect(r.score).toBe(100);
    expect(r.level).toBe('perfect');
  });

  it('puntúa 0 cuando no se reconoce nada', () => {
    const r = scorePronunciation('你好', '');
    expect(r.score).toBe(0);
    expect(r.level).toBe('fail');
    expect(r.charMatches).toEqual([false, false]);
  });

  it('da una puntuación parcial cuando falta un carácter', () => {
    const r = scorePronunciation('你好吗', '你好');
    // distancia 1 sobre longitud 3 → ~67 %
    expect(r.score).toBe(67);
    expect(r.level).toBe('partial');
    expect(r.charMatches).toEqual([true, true, false]);
  });

  it('devuelve fail si la frase esperada está vacía', () => {
    const r = scorePronunciation('', 'cualquier cosa');
    expect(r.score).toBe(0);
    expect(r.level).toBe('fail');
    expect(r.charMatches).toEqual([]);
  });

  it('clasifica los niveles según el umbral de score', () => {
    expect(scorePronunciation('你好', '你好').level).toBe('perfect'); // 100
    // 3/4 caracteres → 75 % → good
    expect(scorePronunciation('我很高兴', '我很高x').level).toBe('good');
  });
});

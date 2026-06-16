// src/utils/progress.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import {
  markWritingPractice,
  getWritingCount,
  getWordStatus,
  toggleWordMastered,
  markWordResult,
  getLessonStats,
} from './progress.js';

beforeEach(() => localStorage.clear());

describe('markWritingPractice / getWritingCount', () => {
  it('cuenta desde 0 para un carácter no practicado', () => {
    expect(getWritingCount({}, '好')).toBe(0);
  });

  it('incrementa el contador sin mutar el progreso original', () => {
    const p0 = {};
    const p1 = markWritingPractice(p0, '好');
    const p2 = markWritingPractice(p1, '好');
    expect(getWritingCount(p2, '好')).toBe(2);
    expect(getWritingCount(p0, '好')).toBe(0); // inmutable
  });

  it('lleva contadores independientes por carácter', () => {
    let p = markWritingPractice({}, '好');
    p = markWritingPractice(p, '你');
    expect(getWritingCount(p, '好')).toBe(1);
    expect(getWritingCount(p, '你')).toBe(1);
  });
});

describe('getWordStatus', () => {
  it('devuelve "unseen" para una palabra desconocida', () => {
    expect(getWordStatus({}, 1, '好')).toBe('unseen');
  });

  it('refleja el estado visto y dominado', () => {
    const seen = toggleWordMastered({}, 1, '好', false);
    expect(getWordStatus(seen, 1, '好')).toBe('seen');
    const mastered = toggleWordMastered({}, 1, '好', true);
    expect(getWordStatus(mastered, 1, '好')).toBe('mastered');
  });
});

describe('markWordResult', () => {
  it('marca como dominada tras 3 aciertos con ratio >= 0.75', () => {
    let p = {};
    p = markWordResult(p, 1, '好', true);
    p = markWordResult(p, 1, '好', true);
    expect(getWordStatus(p, 1, '好')).toBe('seen'); // aún no
    p = markWordResult(p, 1, '好', true);
    expect(getWordStatus(p, 1, '好')).toBe('mastered');
  });

  it('no domina si el ratio de aciertos es bajo', () => {
    let p = {};
    p = markWordResult(p, 1, '好', true);
    p = markWordResult(p, 1, '好', false);
    p = markWordResult(p, 1, '好', false);
    p = markWordResult(p, 1, '好', true);
    expect(getWordStatus(p, 1, '好')).toBe('seen');
  });
});

describe('getLessonStats', () => {
  const characters = [
    { char: '好', lesson: 1 },
    { char: '你', lesson: 1 },
    { char: '我', lesson: 1, isSupplementary: true }, // no cuenta
    { char: '他', lesson: 2 },
  ];

  it('cuenta solo los caracteres principales de la lección', () => {
    const stats = getLessonStats({}, 1, characters);
    expect(stats.total).toBe(2);
    expect(stats.seen).toBe(0);
    expect(stats.unseen).toBe(2);
  });

  it('refleja vistos y dominados', () => {
    let p = toggleWordMastered({}, 1, '好', true);
    p = markWordResult(p, 1, '你', false); // visto, no dominado
    const stats = getLessonStats(p, 1, characters);
    expect(stats.seen).toBe(2);
    expect(stats.mastered).toBe(1);
    expect(stats.unseen).toBe(0);
  });
});

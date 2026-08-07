// src/utils/minigameScores.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { loadMinigameScores, getBestScore, recordMinigameScore } from './minigameScores.js';

beforeEach(() => localStorage.clear());

describe('minigameScores', () => {
  it('sin puntuación guardada, getBestScore devuelve null', () => {
    expect(getBestScore('sov-game')).toBeNull();
  });

  it('registra una puntuación y la recupera', () => {
    recordMinigameScore('sov-game', 80);
    expect(getBestScore('sov-game')).toBe(80);
  });

  it('conserva la mejor puntuación entre partidas (no la baja)', () => {
    recordMinigameScore('sov-game', 90);
    recordMinigameScore('sov-game', 60);
    expect(getBestScore('sov-game')).toBe(90);
  });

  it('mejora la puntuación si la nueva es mayor', () => {
    recordMinigameScore('sov-game', 60);
    recordMinigameScore('sov-game', 90);
    expect(getBestScore('sov-game')).toBe(90);
  });

  it('acota valores fuera de rango a 0-100', () => {
    recordMinigameScore('sov-game', 150);
    expect(getBestScore('sov-game')).toBe(100);
    recordMinigameScore('time-race', -20);
    expect(getBestScore('time-race')).toBe(0);
  });

  it('ignora llamadas sin gameId o con un valor no numérico', () => {
    const before = loadMinigameScores();
    expect(recordMinigameScore(null, 50)).toEqual(before);
    expect(recordMinigameScore('sov-game', 'ochenta')).toEqual(before);
    expect(recordMinigameScore('sov-game', NaN)).toEqual(before);
  });

  it('sin gameId, getBestScore devuelve null', () => {
    expect(getBestScore(null)).toBeNull();
  });
});

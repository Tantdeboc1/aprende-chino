// src/utils/levelExam.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLevelMastery, isLevelExamUnlocked, saveLevelExamResult,
  loadLevelExamResult, isLevelPassed, UNLOCK_MASTERY_PCT, PASS_PCT,
} from './levelExam.js';

const characters = [
  { char: '好', lesson: 1 },
  { char: '你', lesson: 1 },
  { char: '我', lesson: 1 },
  { char: '他', lesson: 2 },
  { char: '们', lesson: 2, isSupplementary: true }, // no cuenta
];

// progress con `n` palabras principales dominadas
function progressWithMastered(chars) {
  const p = {};
  for (const c of chars) {
    p[`lesson_${c.lesson}`] = { ...(p[`lesson_${c.lesson}`] || {}), [c.char]: { mastered: true } };
  }
  return p;
}

beforeEach(() => localStorage.clear());

describe('getLevelMastery', () => {
  it('cuenta solo palabras principales', () => {
    const stats = getLevelMastery({}, characters);
    expect(stats.total).toBe(4); // 5 menos la suplementaria
    expect(stats.mastered).toBe(0);
    expect(stats.pct).toBe(0);
  });

  it('calcula el porcentaje de dominadas', () => {
    const p = progressWithMastered([characters[0], characters[1]]); // 2 de 4
    const stats = getLevelMastery(p, characters);
    expect(stats.mastered).toBe(2);
    expect(stats.pct).toBe(50);
  });
});

describe('isLevelExamUnlocked', () => {
  it('bloqueado por debajo del umbral', () => {
    const p = progressWithMastered([characters[0], characters[1]]); // 50 %
    expect(isLevelExamUnlocked(p, characters)).toBe(false);
  });

  it('desbloqueado al alcanzar el umbral', () => {
    const p = progressWithMastered([characters[0], characters[1], characters[2], characters[3]]); // 100 %
    expect(getLevelMastery(p, characters).pct).toBeGreaterThanOrEqual(UNLOCK_MASTERY_PCT);
    expect(isLevelExamUnlocked(p, characters)).toBe(true);
  });
});

describe('saveLevelExamResult', () => {
  it('aprueba al alcanzar el umbral de nota', () => {
    const { passedThisAttempt, pct } = saveLevelExamResult({ correct: 18, total: 30 });
    expect(pct).toBe(60);
    expect(pct).toBeGreaterThanOrEqual(PASS_PCT);
    expect(passedThisAttempt).toBe(true);
    expect(isLevelPassed()).toBe(true);
  });

  it('suspende por debajo del umbral', () => {
    const { passedThisAttempt } = saveLevelExamResult({ correct: 10, total: 30 });
    expect(passedThisAttempt).toBe(false);
    expect(isLevelPassed()).toBe(false);
  });

  it('conserva la mejor nota y el aprobado entre intentos', () => {
    saveLevelExamResult({ correct: 27, total: 30 }); // 90 %, aprobado
    saveLevelExamResult({ correct: 6, total: 30 });  // 20 %, suspenso
    const r = loadLevelExamResult();
    expect(r.bestPct).toBe(90);
    expect(r.lastPct).toBe(20);
    expect(r.passed).toBe(true); // una vez superado, sigue superado
    expect(r.attempts).toBe(2);
  });
});

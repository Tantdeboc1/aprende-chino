// src/utils/cefrExam.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { loadCefrResult, isCefrPass, saveCefrResult, CEFR_PASS_PCT } from './cefrExam.js';

beforeEach(() => localStorage.clear());

const perSkill = (listening, reading, writing) => ({
  listening: { correct: listening, total: 10 },
  reading: { correct: reading, total: 10 },
  writing: { correct: writing, total: 10 },
});

describe('isCefrPass', () => {
  it('global por debajo del mínimo (60%) no aprueba aunque cada destreza vaya bien', () => {
    expect(isCefrPass(CEFR_PASS_PCT - 1, perSkill(10, 10, 10))).toBe(false);
  });

  it('global suficiente pero una destreza por debajo del mínimo (40%) no aprueba', () => {
    // Global 60% pero "writing" solo al 30% — no debe colarse por la media.
    expect(isCefrPass(60, perSkill(9, 9, 3))).toBe(false);
  });

  it('global suficiente y todas las destrezas por encima del mínimo, aprueba', () => {
    expect(isCefrPass(60, perSkill(6, 6, 6))).toBe(true);
  });

  it('una destreza no evaluada (total 0) no bloquea el aprobado', () => {
    const skills = { listening: { correct: 10, total: 10 }, reading: { correct: 0, total: 0 } };
    expect(isCefrPass(60, skills)).toBe(true);
  });
});

describe('saveCefrResult', () => {
  it('sin intento previo, guarda el primero y calcula el porcentaje', () => {
    const { result, pct, passedThisAttempt } = saveCefrResult({ perSkill: perSkill(6, 6, 6), correct: 18, total: 30 });
    expect(pct).toBe(60);
    expect(passedThisAttempt).toBe(true);
    expect(result.bestPct).toBe(60);
    expect(result.attempts).toBe(1);
    expect(loadCefrResult().bestPct).toBe(60);
  });

  it('conserva la mejor nota entre intentos', () => {
    saveCefrResult({ perSkill: perSkill(9, 9, 9), correct: 27, total: 30 }); // 90%
    const { result } = saveCefrResult({ perSkill: perSkill(3, 3, 3), correct: 9, total: 30 }); // 30%
    expect(result.bestPct).toBe(90);
    expect(result.lastPct).toBe(30);
  });

  it('una vez aprobado, sigue "Apto" aunque un intento posterior suspenda', () => {
    saveCefrResult({ perSkill: perSkill(6, 6, 6), correct: 18, total: 30 }); // aprueba
    const { result, passedThisAttempt } = saveCefrResult({ perSkill: perSkill(1, 1, 1), correct: 3, total: 30 }); // suspende
    expect(passedThisAttempt).toBe(false);
    expect(result.passed).toBe(true); // el histórico se mantiene apto
  });

  it('cuenta los intentos acumulados', () => {
    saveCefrResult({ perSkill: perSkill(1, 1, 1), correct: 3, total: 30 });
    saveCefrResult({ perSkill: perSkill(1, 1, 1), correct: 3, total: 30 });
    const { result } = saveCefrResult({ perSkill: perSkill(1, 1, 1), correct: 3, total: 30 });
    expect(result.attempts).toBe(3);
  });
});

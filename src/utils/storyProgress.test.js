// src/utils/storyProgress.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

const addXPMock = vi.hoisted(() => vi.fn());
vi.mock('./streak.js', () => ({ addXP: addXPMock }));

vi.mock('@/data/stories/index.js', () => ({
  STORIES: [{ id: 't1-h1' }, { id: 't1-h2' }, { id: 't1-h3' }],
}));

import {
  computeStoryXP, recordStoryResult, getStoryStatus, getAllStatuses, loadStoryProgress, STORY_XP,
} from './storyProgress.js';

beforeEach(() => {
  localStorage.clear();
  addXPMock.mockClear();
});

describe('computeStoryXP', () => {
  it('primera vez: respuestas correctas + bonus de completar + bonus de primera vez', () => {
    const xp = computeStoryXP({ score: 8, total: 12, isFirstTime: true });
    expect(xp).toBe(8 * STORY_XP.perCorrectAnswer + STORY_XP.completionBonus + STORY_XP.firstTimeBonus);
  });

  it('primera vez y puntuación perfecta añade también el bonus de perfecto', () => {
    const xp = computeStoryXP({ score: 12, total: 12, isFirstTime: true });
    expect(xp).toBe(12 * STORY_XP.perCorrectAnswer + STORY_XP.completionBonus + STORY_XP.firstTimeBonus + STORY_XP.perfectBonus);
  });

  it('repetición: solo XP por la MEJORA sobre el mejor anterior, sin bonus de completar/primera vez', () => {
    const xp = computeStoryXP({ score: 10, total: 12, isFirstTime: false, prevBest: 7 });
    expect(xp).toBe(3 * STORY_XP.perCorrectAnswer); // mejora de 3
  });

  it('repetición sin mejora no da XP (no penaliza, tampoco resta)', () => {
    const xp = computeStoryXP({ score: 5, total: 12, isFirstTime: false, prevBest: 8 });
    expect(xp).toBe(0);
  });

  it('repetición que alcanza el perfecto por primera vez sí da el bonus de perfecto', () => {
    const xp = computeStoryXP({ score: 12, total: 12, isFirstTime: false, prevBest: 10 });
    expect(xp).toBe(2 * STORY_XP.perCorrectAnswer + STORY_XP.perfectBonus);
  });

  it('repetición que YA era perfecta antes no repite el bonus de perfecto', () => {
    const xp = computeStoryXP({ score: 12, total: 12, isFirstTime: false, prevBest: 12 });
    expect(xp).toBe(0);
  });
});

describe('recordStoryResult', () => {
  it('guarda el resultado, concede XP y avisa a addXP', () => {
    const { xpGanado, isFirstTime } = recordStoryResult('t1-h1', 10, 12);
    expect(isFirstTime).toBe(true);
    expect(xpGanado).toBeGreaterThan(0);
    expect(addXPMock).toHaveBeenCalledWith(xpGanado);
    expect(loadStoryProgress()['t1-h1'].completada).toBe(true);
  });

  it('conserva la mejor puntuación entre intentos', () => {
    recordStoryResult('t1-h1', 12, 12);
    recordStoryResult('t1-h1', 5, 12); // peor intento
    expect(loadStoryProgress()['t1-h1'].mejorPuntuacion).toBe(12);
  });

  it('sin XP ganado (repetición sin mejora), no llama a addXP', () => {
    recordStoryResult('t1-h1', 10, 12);
    addXPMock.mockClear();
    recordStoryResult('t1-h1', 3, 12); // peor, sin mejora
    expect(addXPMock).not.toHaveBeenCalled();
  });
});

describe('getStoryStatus / getAllStatuses (desbloqueo secuencial)', () => {
  it('la primera historia siempre está disponible', () => {
    expect(getStoryStatus('t1-h1')).toBe('disponible');
  });

  it('la segunda historia está bloqueada hasta que se completa la primera', () => {
    expect(getStoryStatus('t1-h2')).toBe('bloqueada');
    recordStoryResult('t1-h1', 12, 12);
    expect(getStoryStatus('t1-h2')).toBe('disponible');
  });

  it('una historia completada se marca como "completada", no "disponible"', () => {
    recordStoryResult('t1-h1', 12, 12);
    expect(getStoryStatus('t1-h1')).toBe('completada');
  });

  it('un id que no existe en STORIES se considera bloqueado', () => {
    expect(getStoryStatus('id-inventado')).toBe('bloqueada');
  });

  it('getAllStatuses refleja la cadena de desbloqueo completa', () => {
    expect(getAllStatuses()).toEqual({ 't1-h1': 'disponible', 't1-h2': 'bloqueada', 't1-h3': 'bloqueada' });
    recordStoryResult('t1-h1', 12, 12);
    recordStoryResult('t1-h2', 12, 12);
    expect(getAllStatuses()).toEqual({ 't1-h1': 'completada', 't1-h2': 'completada', 't1-h3': 'disponible' });
  });
});

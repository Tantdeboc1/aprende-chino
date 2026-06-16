// src/utils/leveling.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getLevelInfo, checkLevelUp, LEVELS } from './leveling.js';

beforeEach(() => localStorage.clear());

describe('getLevelInfo', () => {
  it('empieza en nivel 1 con 0 XP', () => {
    const info = getLevelInfo(0);
    expect(info.level).toBe(1);
    expect(info.xpInLevel).toBe(0);
    expect(info.progress).toBe(0);
    expect(info.isMaxLevel).toBe(false);
  });

  it('sube a nivel 2 justo al alcanzar su umbral de XP', () => {
    expect(getLevelInfo(49).level).toBe(1);
    expect(getLevelInfo(50).level).toBe(2);
  });

  it('calcula el progreso dentro del nivel actual', () => {
    // Nivel 1 → 2 cuesta 50 XP; con 49 estás al 98 %.
    const info = getLevelInfo(49);
    expect(info.level).toBe(1);
    expect(info.xpInLevel).toBe(49);
    expect(info.xpForNext).toBe(50);
    expect(info.progress).toBe(98);
  });

  it('marca el último nivel como máximo y progreso 100', () => {
    const max = LEVELS[LEVELS.length - 1];
    const info = getLevelInfo(max.xp + 1_000_000);
    expect(info.level).toBe(max.level);
    expect(info.isMaxLevel).toBe(true);
    expect(info.progress).toBe(100);
  });

  it('nunca devuelve un progreso mayor que 100', () => {
    for (const xp of [0, 25, 75, 500, 17000, 999999]) {
      expect(getLevelInfo(xp).progress).toBeLessThanOrEqual(100);
    }
  });
});

describe('checkLevelUp', () => {
  it('detecta una subida de nivel', () => {
    const up = checkLevelUp(40, 60); // 40 → nivel 1, 60 → nivel 2
    expect(up).not.toBeNull();
    expect(up.level).toBe(2);
  });

  it('devuelve null si no se cruza ningún umbral', () => {
    expect(checkLevelUp(60, 70)).toBeNull();   // ambos nivel 2
    expect(checkLevelUp(0, 49)).toBeNull();    // ambos nivel 1
  });

  it('no considera subida cuando el XP baja', () => {
    expect(checkLevelUp(200, 10)).toBeNull();
  });
});

// src/utils/streak.ghost.test.js
// La "racha fantasma": si la última actividad fue hace 2+ días, loadStreak
// debe leer la racha como 0 (rota) en vez de mostrar el valor antiguo hasta
// la siguiente actividad.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadStreak, markDailyActivity } from './streak.js';
import { STORAGE_KEYS } from './storageKeys.js';

const KEY = STORAGE_KEYS.STREAK;

// Fecha local YYYY-MM-DD desplazada `days` días desde "hoy" (fake).
function localDate(days = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function seed(partial) {
  localStorage.setItem(KEY, JSON.stringify({
    currentStreak: 5, longestStreak: 9, activityDates: [],
    totalXP: 100, ...partial,
  }));
}

beforeEach(() => {
  localStorage.clear();
  // Mediodía fijo: lejos de medianoche para que "hoy/ayer" sean estables.
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 6, 16, 12, 0, 0));
});
afterEach(() => vi.useRealTimers());

describe('loadStreak — racha fantasma', () => {
  it('mantiene la racha si la última actividad fue hoy', () => {
    seed({ lastActiveDate: localDate(0) });
    expect(loadStreak().currentStreak).toBe(5);
  });

  it('mantiene la racha si la última actividad fue ayer (aún recuperable)', () => {
    seed({ lastActiveDate: localDate(-1) });
    expect(loadStreak().currentStreak).toBe(5);
  });

  it('lee 0 si la última actividad fue hace 2 días (racha rota)', () => {
    seed({ lastActiveDate: localDate(-2) });
    expect(loadStreak().currentStreak).toBe(0);
  });

  it('conserva longestStreak aunque la racha actual se lea rota', () => {
    seed({ lastActiveDate: localDate(-10) });
    const s = loadStreak();
    expect(s.currentStreak).toBe(0);
    expect(s.longestStreak).toBe(9);
  });

  it('markDailyActivity tras racha rota empieza en 1 (misma conclusión)', () => {
    seed({ lastActiveDate: localDate(-3) });
    expect(markDailyActivity().currentStreak).toBe(1);
  });

  it('markDailyActivity con actividad ayer continúa la racha (5 → 6)', () => {
    seed({ lastActiveDate: localDate(-1) });
    expect(markDailyActivity().currentStreak).toBe(6);
  });
});

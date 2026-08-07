// src/utils/streak.risk.test.js
// Aviso de racha en riesgo (banner del Home): racha activa pero sin
// actividad hoy todavía, con las horas restantes hasta medianoche local.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getStreakRiskInfo } from './streak.js';

function localDate(baseDate, days = 0) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

afterEach(() => vi.useRealTimers());

describe('getStreakRiskInfo', () => {
  it('no hay riesgo sin racha activa', () => {
    expect(getStreakRiskInfo({ currentStreak: 0, lastActiveDate: null }).atRisk).toBe(false);
  });

  it('no hay riesgo si ya hubo actividad hoy', () => {
    const now = new Date(2026, 6, 16, 20, 0, 0);
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const streak = { currentStreak: 5, lastActiveDate: localDate(now, 0) };
    expect(getStreakRiskInfo(streak).atRisk).toBe(false);
  });

  it('hay riesgo si la racha está activa pero sin actividad hoy', () => {
    const now = new Date(2026, 6, 16, 20, 0, 0); // 20:00 → 4h hasta medianoche
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const streak = { currentStreak: 5, lastActiveDate: localDate(now, -1) };
    const risk = getStreakRiskInfo(streak);
    expect(risk.atRisk).toBe(true);
    expect(risk.hoursLeft).toBe(4);
  });

  it('redondea hacia arriba las horas restantes (nunca 0 mientras queda tiempo)', () => {
    const now = new Date(2026, 6, 16, 23, 45, 0); // 15 min hasta medianoche
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const streak = { currentStreak: 2, lastActiveDate: localDate(now, -1) };
    expect(getStreakRiskInfo(streak).hoursLeft).toBe(1);
  });
});

// src/utils/tour.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { armTour, isTourPending, finishTour, restartTour, TOUR_STEPS } from './tour.js';
import { STORAGE_KEYS } from './storageKeys.js';

beforeEach(() => localStorage.clear());

describe('TOUR_STEPS', () => {
  it('empieza por la bienvenida sin objetivo y acaba en Fundamentos', () => {
    expect(TOUR_STEPS[0].target).toBe(null);
    expect(TOUR_STEPS.at(-1).id).toBe('intro');
    expect(TOUR_STEPS.at(-1).target).toBe('lesson-intro');
  });

  it('todos los pasos tienen id, textos y colocación', () => {
    for (const s of TOUR_STEPS) {
      expect(s.id, 'id').toBeTruthy();
      expect(s.titleKey, `${s.id}.titleKey`).toBeTruthy();
      expect(s.descKey, `${s.id}.descKey`).toBeTruthy();
      expect(['center', 'above', 'below'], `${s.id}.place`).toContain(s.place);
    }
  });

  it('no hay ids repetidos', () => {
    const ids = TOUR_STEPS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('estado del tutorial', () => {
  it('no está pendiente mientras no se arme', () => {
    // Clave del usuario existente: nunca pasa por el WelcomeFlow, así que
    // nadie llama a armTour() y no debe verlo.
    expect(isTourPending()).toBe(false);
  });

  it('armar lo deja pendiente', () => {
    armTour();
    expect(isTourPending()).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.TOUR)).toBeTruthy();
  });

  it('terminar lo cierra', () => {
    armTour();
    finishTour();
    expect(isTourPending()).toBe(false);
  });

  it('reabrir desde Ajustes lo vuelve a dejar pendiente', () => {
    armTour();
    finishTour();
    restartTour();
    expect(isTourPending()).toBe(true);
  });

  it('sobrevive a un localStorage corrupto', () => {
    localStorage.setItem(STORAGE_KEYS.TOUR, 'no-es-json');
    expect(isTourPending()).toBe(false);
    armTour();
    expect(isTourPending()).toBe(true);
  });

  it('ignora un valor que no sea objeto', () => {
    localStorage.setItem(STORAGE_KEYS.TOUR, '"pending"');
    expect(isTourPending()).toBe(false);
  });
});

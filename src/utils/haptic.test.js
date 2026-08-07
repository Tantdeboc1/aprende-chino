// src/utils/haptic.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hapticSuccess, hapticError } from './haptic.js';

beforeEach(() => localStorage.clear());
afterEach(() => { delete navigator.vibrate; });

describe('haptic', () => {
  it('hapticSuccess vibra corto (80ms) si el dispositivo lo soporta y está activado', () => {
    navigator.vibrate = vi.fn();
    hapticSuccess();
    expect(navigator.vibrate).toHaveBeenCalledWith(80);
  });

  it('hapticError vibra con el patrón doble', () => {
    navigator.vibrate = vi.fn();
    hapticError();
    expect(navigator.vibrate).toHaveBeenCalledWith([50, 30, 50]);
  });

  it('desactivado desde Ajustes, no vibra aunque el dispositivo lo soporte', () => {
    localStorage.setItem('aprende-chino-sound-prefs', JSON.stringify({ haptics: false }));
    navigator.vibrate = vi.fn();
    hapticSuccess();
    expect(navigator.vibrate).not.toHaveBeenCalled();
  });

  it('sin soporte de vibración en el dispositivo, no revienta', () => {
    delete navigator.vibrate;
    expect(() => hapticSuccess()).not.toThrow();
  });
});

// src/utils/fontScale.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getFontScalePref, setFontScalePref, applyFontScale } from './fontScale.js';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.style.removeProperty('--font-scale');
});

describe('fontScale', () => {
  it('sin preferencia guardada, es "normal"', () => {
    expect(getFontScalePref()).toBe('normal');
  });

  it('preset desconocido en localStorage cae a "normal"', () => {
    localStorage.setItem('aprende-chino-font-scale', 'gigante');
    expect(getFontScalePref()).toBe('normal');
  });

  it('"large" fija la variable CSS --font-scale al multiplicador', () => {
    setFontScalePref('large');
    expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.15');
  });

  it('"normal" quita la variable CSS en vez de fijarla a 1 (no fuerza nada)', () => {
    setFontScalePref('large');
    setFontScalePref('normal');
    expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('');
  });

  it('setFontScalePref con un preset inválido se normaliza a "normal"', () => {
    setFontScalePref('enorme-inventado');
    expect(getFontScalePref()).toBe('normal');
  });

  it('applyFontScale sin argumento usa la preferencia guardada', () => {
    localStorage.setItem('aprende-chino-font-scale', 'xlarge');
    applyFontScale();
    expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.3');
  });
});

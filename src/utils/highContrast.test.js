// src/utils/highContrast.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getHighContrast, setHighContrast, applyHighContrast } from './highContrast.js';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('high-contrast');
});

describe('highContrast', () => {
  it('por defecto está desactivado', () => {
    expect(getHighContrast()).toBe(false);
  });

  it('activarlo añade la clase .high-contrast al <html> y persiste', () => {
    setHighContrast(true);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    expect(getHighContrast()).toBe(true);
  });

  it('desactivarlo quita la clase', () => {
    setHighContrast(true);
    setHighContrast(false);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
    expect(getHighContrast()).toBe(false);
  });

  it('applyHighContrast sin argumento aplica la preferencia guardada', () => {
    localStorage.setItem('aprende-chino-high-contrast', '1');
    applyHighContrast();
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });
});

// src/utils/theme.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getThemePref, setThemePref, resolveTheme, applyTheme, initTheme } from './theme.js';

function mockMatchMedia(matches) {
  const listeners = new Set();
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: (_, cb) => listeners.add(cb),
    removeEventListener: (_, cb) => listeners.delete(cb),
  });
  return { fire: () => listeners.forEach((cb) => cb()) };
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  document.head.innerHTML = '<meta name="theme-color" content="">';
});

afterEach(() => {
  delete window.matchMedia;
});

describe('getThemePref', () => {
  it('sin preferencia guardada, por defecto es "light"', () => {
    expect(getThemePref()).toBe('light');
  });

  it('valor corrupto/no reconocido en localStorage cae a "light"', () => {
    localStorage.setItem('aprende-chino-theme', 'no-existe');
    expect(getThemePref()).toBe('light');
  });
});

describe('setThemePref / applyTheme', () => {
  it('"dark" añade la clase .dark al <html> y persiste la preferencia', () => {
    setThemePref('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(getThemePref()).toBe('dark');
  });

  it('"light" quita la clase .dark', () => {
    setThemePref('dark');
    setThemePref('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('actualiza el meta theme-color según el tema resuelto', () => {
    setThemePref('dark');
    expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#15120d');
    setThemePref('light');
    expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#2f6b4a');
  });

  it('"system" resuelve según prefers-color-scheme del SO', () => {
    mockMatchMedia(true); // SO en oscuro
    expect(resolveTheme('system')).toBe('dark');
    applyTheme('system');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

describe('initTheme', () => {
  it('con tema "system" guardado, reacciona a cambios en vivo del SO', () => {
    localStorage.setItem('aprende-chino-theme', 'system');
    const mm = mockMatchMedia(false); // empieza en claro
    initTheme();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // El SO cambia a oscuro en caliente.
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: () => {}, removeEventListener: () => {} });
    mm.fire();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('devuelve una función de limpieza que no revienta al llamarse', () => {
    mockMatchMedia(false);
    const cleanup = initTheme();
    expect(() => cleanup()).not.toThrow();
  });
});

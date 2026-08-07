// src/utils/gameIntroPrefs.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { shouldShowIntro, hideIntro, introsEnabled, setIntrosEnabled } from './gameIntroPrefs.js';

beforeEach(() => localStorage.clear());

describe('gameIntroPrefs', () => {
  it('por defecto, la explicación de cualquier juego se muestra', () => {
    expect(shouldShowIntro('sov-game')).toBe(true);
    expect(introsEnabled()).toBe(true);
  });

  it('ocultar un juego concreto no afecta a los demás', () => {
    hideIntro('sov-game');
    expect(shouldShowIntro('sov-game')).toBe(false);
    expect(shouldShowIntro('find-intruder')).toBe(true);
  });

  it('setIntrosEnabled(false) oculta TODAS las explicaciones, aunque no se hayan ocultado individualmente', () => {
    setIntrosEnabled(false);
    expect(introsEnabled()).toBe(false);
    expect(shouldShowIntro('sov-game')).toBe(false);
    expect(shouldShowIntro('find-intruder')).toBe(false);
  });

  it('reactivar con setIntrosEnabled(true) limpia también los ocultados individualmente', () => {
    hideIntro('sov-game');
    setIntrosEnabled(false);
    setIntrosEnabled(true);
    expect(introsEnabled()).toBe(true);
    expect(shouldShowIntro('sov-game')).toBe(true); // se limpió, no queda oculto
  });
});

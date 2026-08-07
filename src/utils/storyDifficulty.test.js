// src/utils/storyDifficulty.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getStoryDifficulty, shouldShowExercisePinyin } from './storyDifficulty.js';

beforeEach(() => localStorage.clear());

describe('storyDifficulty', () => {
  it('sin preferencia guardada, la dificultad por defecto es "normal"', () => {
    expect(getStoryDifficulty()).toBe('normal');
  });

  it('lee la dificultad guardada en localStorage', () => {
    localStorage.setItem('aprende-chino-story-difficulty', 'facil');
    expect(getStoryDifficulty()).toBe('facil');
  });

  describe('shouldShowExercisePinyin', () => {
    it('difícil: nunca muestra pinyin', () => {
      expect(shouldShowExercisePinyin('dificil')).toBe(false);
    });
    it('normal: no muestra pinyin en ejercicios', () => {
      expect(shouldShowExercisePinyin('normal')).toBe(false);
    });
    it('fácil: sí muestra pinyin', () => {
      expect(shouldShowExercisePinyin('facil')).toBe(true);
    });
    it('sin argumento, usa la dificultad guardada', () => {
      localStorage.setItem('aprende-chino-story-difficulty', 'facil');
      expect(shouldShowExercisePinyin()).toBe(true);
    });
  });
});

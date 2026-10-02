import { describe, expect, it } from 'vitest';
import { exerciseReturnScreen } from './exerciseReturn.js';
describe('exercise back destination', () => {
  it('returns to the current lesson, fundamentals or profile instead of a legacy menu', () => {
    for (const parent of ['lesson-detail', 'intro-detail', 'profile']) expect(exerciseReturnScreen(parent)).toBe(parent);
    for (const missing of ['exercise', 'learn', null, undefined, 'unknown']) expect(exerciseReturnScreen(missing)).toBe('home');
  });
});

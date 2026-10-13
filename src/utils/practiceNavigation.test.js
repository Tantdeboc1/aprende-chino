import { describe, it, expect, beforeEach } from 'vitest';
import { recommendPractice, loadPracticeFavorites, savePracticeFavorites } from './practiceNavigation.js';
import { STORAGE_KEYS } from './storageKeys.js';

beforeEach(() => localStorage.clear());
describe('practice recommendations', () => {
  const now = 1700000000000;
  it('targets recent errors rather than an old high score', () => {
    const recommendation = recommendPractice([
      { activity: 'dictation-game', correct: 9, total: 10, at: now },
      { activity: 'tones-ear', correct: 2, total: 10, at: now },
      { activity: 'sov-game', correct: 0, total: 10, at: now - 31 * 86400000 },
    ], now);
    expect(recommendation).toEqual({ id: 'tones-ear', pct: 20, personalized: true });
  });
  it('does not claim a weakness with no history or too little evidence', () => {
    expect(recommendPractice([], now).personalized).toBe(false);
    expect(recommendPractice([{ activity: 'tones-ear', correct: 0, total: 1, at: now }], now).personalized).toBe(false);
  });
  it('ignores malformed and future attempts', () => {
    expect(recommendPractice([
      { activity: 'tones-ear', correct: -2, total: 10, at: now },
      { activity: 'dictation-game', correct: 0, total: 10, at: now + 100 },
    ], now).personalized).toBe(false);
  });
});
describe('practice favorites', () => {
  it('persists favorites and filters invalid or duplicate entries', () => {
    savePracticeFavorites(['tones-ear', 'dictation-game']);
    expect(loadPracticeFavorites()).toEqual(['tones-ear', 'dictation-game']);
    localStorage.setItem(STORAGE_KEYS.PRACTICE_FAVORITES, JSON.stringify(['invalid', 'tones-ear', 'tones-ear', 'sov-game', 'time-race', 'dictation-game']));
    expect(loadPracticeFavorites()).toEqual(['tones-ear', 'sov-game', 'time-race']);
  });
});

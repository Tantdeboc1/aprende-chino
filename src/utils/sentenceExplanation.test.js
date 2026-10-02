import { describe, it, expect } from 'vitest';
import completeSentenceData from '@/data/completeSentenceData.js';
import sovData from '@/data/sovData.js';
import { getSentenceExplanation } from './sentenceExplanation.js';

describe('sentence explanations', () => {
  it('covers every sentence in both games in all supported languages', () => {
    for (const item of [...completeSentenceData, ...sovData]) {
      const detail = getSentenceExplanation(item);
      for (const lang of ['es', 'en', 'fr', 'de', 'it', 'pt']) {
        expect(detail?.explanation?.[lang], `${item.sentence}: ${lang}`).toBeTruthy();
      }
    }
  });

  it('does not guess explanations for unknown sentences', () => {
    expect(getSentenceExplanation({ sentence: '未知', lesson: 1 })).toBeNull();
  });
});

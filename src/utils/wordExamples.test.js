import { describe, expect, it } from 'vitest';
import { getWordExamples } from './wordExamples.js';
import { loc } from './loc.js';

describe('complete word examples', () => {
  it('explains the reported busy examples in every supported language', () => {
    for (const lang of ['es', 'en', 'fr', 'de', 'it', 'pt']) {
      const examples = getWordExamples({ char: '忙', pinyin: 'máng', examples: ['很忙', '不忙'] }, lang);
      expect(examples.map(e => e.zh)).toEqual(['很忙', '不忙']);
      expect(examples.map(e => e.pinyin)).toEqual(['hěn máng', 'bù máng']);
      examples.forEach(e => expect(loc(e.translation, lang)).toBeTruthy());
    }
    expect(loc(getWordExamples({ char: '忙', examples: ['不忙'] }, 'es')[0].translation, 'es')).toBe('No estar ocupado/a');
  });
  it('never returns fragments missing pronunciation or translation', () => {
    expect(getWordExamples({ char: '未知', examples: ['未标注', { zh: '未知', translation: 'unknown' }] }, 'en')).toEqual([]);
    for (const e of getWordExamples({ char: '你', examples: ['你好'] }, 'es')) {
      expect(e.pinyin).toBeTruthy();
      expect(loc(e.translation, 'es')).toBeTruthy();
    }
  });
  it('keeps a full supplied example and deduplicates punctuation variants', () => {
    const examples = getWordExamples({ char: '你', examples: [{ zh: '你好', pinyin: 'nǐ hǎo', translation: 'Hola' }, '你好！'] }, 'es');
    expect(examples.filter(e => /^你好[！!]?$/u.test(e.zh))).toHaveLength(1);
  });
});

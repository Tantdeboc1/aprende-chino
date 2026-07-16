// src/utils/tts-enhanced.test.js
// Detección de pinyin para la estrategia sílaba-a-sílaba. El regex anterior
// (\d? solo al final, sin diacríticos) no casaba ni con pinyin numérico
// multi-sílaba ni con marcas de tono, y la rama nunca se ejecutaba.
import { describe, it, expect } from 'vitest';
import { looksLikePinyin } from './tts-enhanced.js';

describe('looksLikePinyin', () => {
  it('acepta pinyin numérico multi-sílaba ("ni3 hao3")', () => {
    expect(looksLikePinyin('ni3 hao3')).toBe(true);
    expect(looksLikePinyin('zhong1guo2')).toBe(true);
  });

  it('acepta pinyin con marcas de tono ("nǐ hǎo", "zhōngguó")', () => {
    expect(looksLikePinyin('nǐ hǎo')).toBe(true);
    expect(looksLikePinyin('zhōngguó')).toBe(true);
    expect(looksLikePinyin('lǜsè')).toBe(true); // ǜ (U+01DC), tono sobre ü
  });

  it('acepta separación por guiones ("zhōng-guó")', () => {
    expect(looksLikePinyin('zhōng-guó')).toBe(true);
  });

  it('rechaza hanzi y cadenas mixtas', () => {
    expect(looksLikePinyin('你好')).toBe(false);
    expect(looksLikePinyin('nǐ好')).toBe(false);
  });

  it('rechaza vacío y no-strings', () => {
    expect(looksLikePinyin('')).toBe(false);
    expect(looksLikePinyin(null)).toBe(false);
    expect(looksLikePinyin(undefined)).toBe(false);
  });
});

// src/utils/tts-enhanced.test.js
// Detección de pinyin para la estrategia sílaba-a-sílaba. El regex anterior
// (\d? solo al final, sin diacríticos) no casaba ni con pinyin numérico
// multi-sílaba ni con marcas de tono, y la rama nunca se ejecutaba.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const playAudioSmartMock = vi.hoisted(() => vi.fn());
vi.mock('./audio', () => ({ playAudioSmart: playAudioSmartMock }));

import { looksLikePinyin, speakChineseEnhanced } from './tts-enhanced.js';

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

// speakChineseEnhanced: el troceo por sílabas de palabras multi-carácter.
// El pinyin numérico o marcado de una palabra de 2+ caracteres llega
// CONCATENADO sin separador ("xièxie", "qing3wen4" en vez de "qing3 wen4"):
// dividir por espacios (como hacía antes) deja una sola "sílaba" y la
// Estrategia 2 nunca se ejecuta. Estos tests mockean playAudioSmart y
// comprueban exactamente QUÉ claves se le piden.
describe('speakChineseEnhanced', () => {
  beforeEach(() => {
    playAudioSmartMock.mockReset();
    // Estrategia 3 (fallback final): stub mínimo de Web Speech API — jsdom
    // no la implementa. speak() resuelve el onend en el acto para no dejar
    // los tests colgados de un timer real.
    window.speechSynthesis = { cancel: vi.fn(), speak: vi.fn((u) => u.onend?.()) };
    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) { this.text = text; }
    };
  });

  it('palabra de 2 caracteres con pinyinNumeric: pide cada sílaba por separado', async () => {
    playAudioSmartMock.mockImplementation((_cat, key) =>
      Promise.resolve(['qing3', 'wen4'].includes(key)));

    const onEnd = vi.fn();
    await speakChineseEnhanced(
      { hanzi: '请问', pinyin: 'qǐngwèn', pinyinNumeric: 'qing3wen4' },
      { onEnd }
    );

    const keysPedidas = playAudioSmartMock.mock.calls.map(([, key]) => key);
    expect(keysPedidas).toEqual(['qǐngwèn', 'qing3', 'wen4']);
    // No hace falta el TTS de reserva: las dos sílabas se encontraron.
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('sílaba final en tono neutro (sin dígito) también se trocea y se pide', async () => {
    playAudioSmartMock.mockImplementation((_cat, key) => Promise.resolve(key === 'xie4'));

    await speakChineseEnhanced({ hanzi: '谢谢', pinyin: 'xièxie', pinyinNumeric: 'xie4xie' });

    const keysPedidas = playAudioSmartMock.mock.calls.map(([, key]) => key);
    expect(keysPedidas).toEqual(expect.arrayContaining(['xie4', 'xie']));
    // 'xie' (neutro) no se encontró: cae al TTS de la palabra completa.
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });

  it('palabra de 1 carácter: solo una llamada (camino rápido, sin trocear)', async () => {
    playAudioSmartMock.mockImplementation((_cat, key) => Promise.resolve(key === 'nǐ'));

    await speakChineseEnhanced({ hanzi: '你', pinyin: 'nǐ', pinyinNumeric: 'ni3' });

    expect(playAudioSmartMock).toHaveBeenCalledTimes(1);
    expect(playAudioSmartMock).toHaveBeenCalledWith('pronunciation', 'nǐ', null);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it('sin pinyinNumeric (objeto antiguo): conserva el troceo por espacios de siempre', async () => {
    playAudioSmartMock.mockImplementation((_cat, key) =>
      Promise.resolve(['nǐ', 'hǎo'].includes(key)));

    await speakChineseEnhanced({ hanzi: '你好', pinyin: 'nǐ hǎo' });

    const keysPedidas = playAudioSmartMock.mock.calls.map(([, key]) => key);
    expect(keysPedidas).toEqual(['nǐ hǎo', 'nǐ', 'hǎo']);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });
});

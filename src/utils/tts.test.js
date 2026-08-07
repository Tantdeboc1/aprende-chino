// src/utils/tts.test.js
// Versión simplificada de TTS: solo la usa audio.js internamente como
// locutor de reserva (con un string ya resuelto), pero conserva su propia
// lógica de troceo/normalización de pinyin — se prueba en aislamiento.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const playAudioSmartMock = vi.hoisted(() => vi.fn());
vi.mock('./audio', () => ({ playAudioSmart: playAudioSmartMock }));

import { speakChinese, cancelSpeak } from './tts.js';

beforeEach(() => {
  playAudioSmartMock.mockReset();
});

describe('speakChinese (tts.js)', () => {
  // El detector de pinyin de este módulo es más estrecho que el de
  // tts-enhanced.js: solo casa ASCII + ü/v + UN dígito de tono final
  // (`/^[a-zA-ZüÜvV\s-]+\d?$/`), no vocales con marca de tono precompuesta
  // (nǐ, hǎo…). En la práctica no importa: audio.js —su único invocador—
  // siempre le pasa sílabas numéricas ya resueltas o el hanzi de reserva,
  // nunca pinyin con diacríticos.
  it('pinyin numérico intenta encontrar el mp3 de la sílaba', async () => {
    playAudioSmartMock.mockResolvedValue(true);
    await speakChinese('ni3');
    expect(playAudioSmartMock).toHaveBeenCalledWith('pronunciation', 'ni3', null);
  });

  it('el detector solo casa UN dígito de tono al final: multi-sílaba numérica ("ni3 hao3") no se trocea', async () => {
    // /^[a-zA-ZüÜvV\s-]+\d?$/ no admite dígitos salvo uno justo al final —
    // "ni3 hao3" tiene un dígito a mitad de cadena y no matchea, así que cae
    // directa al TTS de la cadena completa (no intenta mp3 por sílaba). Un
    // detalle propio de esta versión "simplificada"; el módulo real usado en
    // toda la app (tts-enhanced.js) sí trocea correctamente multi-sílaba.
    playAudioSmartMock.mockResolvedValue(false);
    await speakChinese('ni3 hao3');
    expect(playAudioSmartMock).toHaveBeenCalledTimes(1);
    expect(playAudioSmartMock).toHaveBeenCalledWith('pronunciation', 'ni3 hao3', 'ni3 hao3');
  });

  it('pinyin con marca de tono (diacrítico) tampoco lo reconoce como troceable: va directo al TTS', async () => {
    playAudioSmartMock.mockResolvedValue(false);
    await speakChinese('nǐ hǎo');
    expect(playAudioSmartMock).toHaveBeenCalledTimes(1);
    expect(playAudioSmartMock).toHaveBeenCalledWith('pronunciation', 'nǐ hǎo', 'nǐ hǎo');
  });

  it('si el mp3 de una sílaba simple no se encuentra, la última llamada usa el hanzi como texto de reserva', async () => {
    playAudioSmartMock.mockResolvedValue(false);
    const onEnd = vi.fn();
    await speakChinese({ hanzi: '你', pinyin: 'ni3' }, { onEnd });

    // Última llamada: TTS directo, con el hanzi como fallbackText (3er arg).
    const last = playAudioSmartMock.mock.calls.at(-1);
    expect(last[2]).toBe('你');
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('hanzi puro (no parece pinyin) va directo al TTS sin intentar mp3 por sílabas', async () => {
    playAudioSmartMock.mockResolvedValue(false);
    await speakChinese('谢谢');
    expect(playAudioSmartMock).toHaveBeenCalledTimes(1);
    expect(playAudioSmartMock).toHaveBeenCalledWith('pronunciation', '谢谢', '谢谢');
  });

  it('un error en medio de la reproducción llama a onError en vez de propagar', async () => {
    playAudioSmartMock.mockRejectedValue(new Error('audio roto'));
    const onError = vi.fn();
    await speakChinese('nǐ', { onError });
    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe('cancelSpeak', () => {
  it('cancela speechSynthesis si está disponible, sin lanzar si no lo está', () => {
    const cancel = vi.fn();
    window.speechSynthesis = { cancel };
    cancelSpeak();
    expect(cancel).toHaveBeenCalledTimes(1);

    delete window.speechSynthesis;
    expect(() => cancelSpeak()).not.toThrow();
  });
});

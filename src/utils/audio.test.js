// src/utils/audio.test.js
// `playAudioSmart(category, key, fallbackText)` es la pieza sobre la que se
// apoyan tts.js y tts-enhanced.js para probar variantes/sílabas en bucle sin
// disparar voz de por medio: pasan `fallbackText: null` como señal explícita
// de "solo comprueba si existe, no hables por tu cuenta". La condición
// `if (fallbackText || key)` ignoraba esa señal (key siempre es truthy) y
// además dejaba `isInTTSCAll` a true 500 ms, bloqueando la SIGUIENTE llamada
// del bucle aunque su audio sí existiera en el manifest — así es como el
// troceo por sílabas de palabras multi-carácter se quedaba mudo en la
// práctica aunque la lógica de troceo en sí fuera correcta.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const speakChineseMock = vi.hoisted(() => vi.fn());
vi.mock('./tts.js', () => ({ speakChinese: speakChineseMock }));

// manifest.txt falso: nombres base tal y como los generan los scripts de
// conversión de audio (sin categoría ni extensión).
const MANIFEST = ['ni3', 'hao3', 'lv4'];

function mockFetch() {
  return vi.fn(async (url) => {
    if (String(url).includes('manifest.txt')) {
      return { text: async () => MANIFEST.join('\n') };
    }
    // Cuerpo del audio real: solo relevante si algo intenta decodificarlo
    // (no debería pasar en jsdom, sin AudioContext, ver playAudioSmart tests).
    return { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
  });
}

describe('playAudioSmart', () => {
  let playAudioSmart;

  beforeEach(async () => {
    // manifestLoaded/manifestSet/isInTTSCAll son estado a nivel de módulo en
    // audio.js: sin resetModules, el manifest del primer test "ganaría" para
    // siempre y el guard isInTTSCAll de una llamada contaminaría a la siguiente.
    vi.resetModules();
    speakChineseMock.mockClear();
    globalThis.fetch = mockFetch();
    ({ playAudioSmart } = await import('./audio.js'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('fallbackText: null sin match en el manifest no habla por su cuenta', async () => {
    const result = await playAudioSmart('pronunciation', 'zzz9', null);
    expect(result).toBe(false);
    expect(speakChineseMock).not.toHaveBeenCalled();
  });

  it('fallbackText explícito sin match sí dispara el TTS de reserva', async () => {
    const result = await playAudioSmart('pronunciation', 'zzz9', 'texto de reserva');
    expect(result).toBe(false);
    expect(speakChineseMock).toHaveBeenCalledWith('texto de reserva');
  });

  it('una llamada con fallbackText:null no deja el guard isInTTSCAll bloqueado para la siguiente', async () => {
    // Si `if (fallbackText || key)` reapareciera, esta primera llamada (key
    // truthy, fallbackText null) pondría isInTTSCAll a true 500ms y la
    // siguiente —para una sílaba que SÍ existe en el manifest— se
    // devolvería false sin ni mirar el manifiesto.
    const first = await playAudioSmart('pronunciation', 'zzz9', null);
    expect(first).toBe(false);

    vi.useFakeTimers();
    class FakeAudio {
      set src(v) { this._src = v; }
      get src() { return this._src; }
      load() {}
      play() {
        const p = Promise.resolve();
        p.then(() => { this.onended && this.onended(); });
        return p;
      }
    }
    vi.stubGlobal('Audio', FakeAudio);

    const promise = playAudioSmart('pronunciation', 'ni3', null);
    await vi.advanceTimersByTimeAsync(60);
    await expect(promise).resolves.toBe(true);
  });

  it('encuentra un archivo por su clave con tono numérico exacto', async () => {
    vi.useFakeTimers();
    class FakeAudio {
      set src(v) { this._src = v; }
      get src() { return this._src; }
      load() {}
      play() {
        const p = Promise.resolve();
        p.then(() => { this.onended && this.onended(); });
        return p;
      }
    }
    vi.stubGlobal('Audio', FakeAudio);

    const promise = playAudioSmart('pronunciation', 'ni3', null);
    await vi.advanceTimersByTimeAsync(60);
    await expect(promise).resolves.toBe(true);
    expect(speakChineseMock).not.toHaveBeenCalled();
  });

  it('normaliza ü→v y pinyin con marca de tono a la clave del manifest ("lǜ" → lv4)', async () => {
    vi.useFakeTimers();
    class FakeAudio {
      set src(v) { this._src = v; }
      get src() { return this._src; }
      load() {}
      play() {
        const p = Promise.resolve();
        p.then(() => { this.onended && this.onended(); });
        return p;
      }
    }
    vi.stubGlobal('Audio', FakeAudio);

    const promise = playAudioSmart('pronunciation', 'lǜ', null);
    await vi.advanceTimersByTimeAsync(60);
    await expect(promise).resolves.toBe(true);
  });

  it('sin match y sin fallbackText ni key, devuelve false sin tocar el TTS', async () => {
    const result = await playAudioSmart('pronunciation', '', null);
    expect(result).toBe(false);
    expect(speakChineseMock).not.toHaveBeenCalled();
  });
});

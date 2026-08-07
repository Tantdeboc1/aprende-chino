// src/utils/speechRecognition.test.js
// `SpeechRecognitionClass` se resuelve a nivel de módulo
// (`window.SpeechRecognition || window.webkitSpeechRecognition`), así que
// cada test que necesite soporte disponible debe stubear el global ANTES de
// importar (resetModules + import dinámico), igual que en otros módulos que
// cachean una feature-detection al cargar.
import { describe, it, expect, vi, afterEach } from 'vitest';

class FakeRecognition {
  constructor() { FakeRecognition.instances.push(this); }
  start() { this._started = true; }
  stop() { this.onend?.(); }
  // No dispara onend: en los navegadores reales abort() lo hace de forma
  // asíncrona, y el propio recognize() ya rechaza por su cuenta al abortar
  // por timeout — disparar onend aquí de forma síncrona solo introduce una
  // carrera artificial del stub, no del código real.
  abort() {}
}
FakeRecognition.instances = [];

let recognize;
let SpeechErrorCode;
let isSpeechRecognitionSupported;

async function importWithSupport() {
  vi.resetModules();
  FakeRecognition.instances = [];
  vi.stubGlobal('SpeechRecognition', FakeRecognition);
  ({ recognize, SpeechErrorCode, isSpeechRecognitionSupported } = await import('./speechRecognition.js'));
}

async function importWithoutSupport() {
  vi.resetModules();
  vi.stubGlobal('SpeechRecognition', undefined);
  vi.stubGlobal('webkitSpeechRecognition', undefined);
  ({ recognize, SpeechErrorCode, isSpeechRecognitionSupported } = await import('./speechRecognition.js'));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('isSpeechRecognitionSupported', () => {
  it('true si el navegador expone SpeechRecognition', async () => {
    await importWithSupport();
    expect(isSpeechRecognitionSupported()).toBe(true);
  });

  it('false si no hay ninguna de las dos variantes', async () => {
    await importWithoutSupport();
    expect(isSpeechRecognitionSupported()).toBe(false);
  });
});

describe('recognize', () => {
  it('sin soporte, se rechaza de inmediato con UNSUPPORTED', async () => {
    await importWithoutSupport();
    await expect(recognize()).rejects.toMatchObject({ code: SpeechErrorCode.UNSUPPORTED });
  });

  it('onresult resuelve con transcript, alternativas y confianza', async () => {
    await importWithSupport();
    const promise = recognize({ onControls: () => {} });
    const rec = FakeRecognition.instances[0];
    rec.onresult({
      results: [[
        { transcript: '你好', confidence: 0.9 },
        { transcript: '你号', confidence: 0.4 },
      ]],
    });
    // El primer resultado tiene forma de array-like con `.length` — simulamos
    // el acceso indexado que hace el código sobre `result[i]`.
    await expect(promise).resolves.toEqual({
      transcript: '你好',
      alternatives: ['你好', '你号'],
      confidence: 0.9,
    });
  });

  it('onerror "not-allowed" se mapea a NO_PERMISSION', async () => {
    await importWithSupport();
    const promise = recognize();
    FakeRecognition.instances[0].onerror({ error: 'not-allowed' });
    await expect(promise).rejects.toMatchObject({ code: SpeechErrorCode.NO_PERMISSION });
  });

  it('onerror "network" se mapea a NETWORK', async () => {
    await importWithSupport();
    const promise = recognize();
    FakeRecognition.instances[0].onerror({ error: 'network' });
    await expect(promise).rejects.toMatchObject({ code: SpeechErrorCode.NETWORK });
  });

  it('onerror desconocido se mapea a UNKNOWN', async () => {
    await importWithSupport();
    const promise = recognize();
    FakeRecognition.instances[0].onerror({ error: 'algo-nuevo-de-chrome' });
    await expect(promise).rejects.toMatchObject({ code: SpeechErrorCode.UNKNOWN });
  });

  it('onend sin resultado previo se trata como NO_SPEECH', async () => {
    await importWithSupport();
    const promise = recognize();
    FakeRecognition.instances[0].onend();
    await expect(promise).rejects.toMatchObject({ code: SpeechErrorCode.NO_SPEECH });
  });

  it('onend DESPUÉS de onresult no pisa la resolución ya asentada', async () => {
    await importWithSupport();
    const promise = recognize();
    const rec = FakeRecognition.instances[0];
    rec.onresult({ results: [[{ transcript: 'ok', confidence: 1 }]] });
    rec.onend?.(); // no debería rechazar tras haber resuelto
    await expect(promise).resolves.toMatchObject({ transcript: 'ok' });
  });

  it('pasado el timeout sin respuesta, aborta y rechaza con NO_SPEECH', async () => {
    vi.useFakeTimers();
    await importWithSupport();
    const rec$ = recognize({ timeoutMs: 5000 });
    const rec = FakeRecognition.instances[0];
    const abortSpy = vi.spyOn(rec, 'abort');

    // El assertion se adjunta ANTES de avanzar los timers, para que la
    // promesa nunca quede "sin manejar" ni un instante (evita el
    // UnhandledRejection que vitest reporta si el reject llega antes de que
    // algo la esté escuchando).
    const assertion = expect(rec$).rejects.toMatchObject({ code: SpeechErrorCode.NO_SPEECH, message: 'timeout' });
    await vi.advanceTimersByTimeAsync(5000);
    await assertion;
    expect(abortSpy).toHaveBeenCalledTimes(1);
  });

  it('onControls expone stop/abort tras arrancar con éxito', async () => {
    await importWithSupport();
    const onControls = vi.fn();
    const promise = recognize({ onControls }).catch(() => {}); // se cierra abajo; evita timer/promesa colgados
    expect(onControls).toHaveBeenCalledTimes(1);
    const { stop, abort } = onControls.mock.calls[0][0];
    expect(typeof stop).toBe('function');
    expect(typeof abort).toBe('function');
    stop();
    await promise;
  });

  it('si start() lanza (reconocimiento ya en curso), rechaza con UNKNOWN sin colgar', async () => {
    await importWithSupport();
    FakeRecognition.prototype.start = () => { throw new Error('already started'); };
    await expect(recognize()).rejects.toMatchObject({ code: SpeechErrorCode.UNKNOWN });
  });
});

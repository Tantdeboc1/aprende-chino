// src/utils/gameAudio.test.js
// jsdom no implementa Web Audio API — se stubea un AudioContext mínimo para
// comprobar que playSound() respeta el ajuste "efectos de sonido" (lo único
// realmente testeable sin un motor de audio real) sin reventar.
//
// gameAudio.js cachea el AudioContext creado en `sharedCtx`, una variable de
// módulo — sin resetear el módulo entre tests, el de un test reutilizaría el
// contexto (y el AudioContext stub) del anterior.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

function fakeAudioContext() {
  const oscillators = [];
  class FakeOscillator {
    constructor() { this.frequency = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }; oscillators.push(this); }
    connect() {}
    start = vi.fn();
    stop = vi.fn();
  }
  class FakeGain {
    constructor() { this.gain = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }; }
    connect() {}
  }
  class FakeAudioContext {
    constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOscillator(); }
    createGain() { return new FakeGain(); }
  }
  return { FakeAudioContext, oscillators };
}

let playSound;

beforeEach(async () => {
  localStorage.clear();
  vi.resetModules();
  ({ playSound } = await import('./gameAudio.js'));
});
afterEach(() => vi.unstubAllGlobals());

describe('playSound', () => {
  it('con los efectos desactivados desde Ajustes, no crea ningún AudioContext', () => {
    localStorage.setItem('aprende-chino-sound-prefs', JSON.stringify({ effects: false }));
    const { FakeAudioContext } = fakeAudioContext();
    const ctor = vi.fn(function () { return new FakeAudioContext(); });
    vi.stubGlobal('AudioContext', ctor);

    playSound('correct');
    expect(ctor).not.toHaveBeenCalled();
  });

  it('con los efectos activados, "correct" arranca dos osciladores (ding ascendente)', () => {
    const { FakeAudioContext, oscillators } = fakeAudioContext();
    vi.stubGlobal('AudioContext', vi.fn(function () { return new FakeAudioContext(); }));

    playSound('correct');
    expect(oscillators).toHaveLength(2);
    oscillators.forEach((o) => expect(o.start).toHaveBeenCalled());
  });

  it('"incorrect" arranca un único oscilador (bong grave)', () => {
    const { FakeAudioContext, oscillators } = fakeAudioContext();
    vi.stubGlobal('AudioContext', vi.fn(function () { return new FakeAudioContext(); }));

    playSound('incorrect');
    expect(oscillators).toHaveLength(1);
  });

  it('un type desconocido no crea ningún oscilador y no revienta', () => {
    const { FakeAudioContext, oscillators } = fakeAudioContext();
    vi.stubGlobal('AudioContext', vi.fn(function () { return new FakeAudioContext(); }));

    expect(() => playSound('tipo-que-no-existe')).not.toThrow();
    expect(oscillators).toHaveLength(0);
  });

  it('sin AudioContext disponible en el navegador, no revienta (silencioso)', () => {
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', undefined);
    expect(() => playSound('correct')).not.toThrow();
  });
});

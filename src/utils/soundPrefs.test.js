// src/utils/soundPrefs.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { getSoundPrefs, setSoundPrefs, effectsEnabled, hapticsEnabled, getVoiceRate } from './soundPrefs.js';

beforeEach(() => localStorage.clear());

describe('soundPrefs', () => {
  it('por defecto: efectos y vibración activados, voz lenta (0.8)', () => {
    expect(getSoundPrefs()).toEqual({ effects: true, haptics: true, voiceRate: 0.8 });
  });

  it('setSoundPrefs fusiona el patch con lo existente (no lo reemplaza entero)', () => {
    setSoundPrefs({ effects: false });
    const next = setSoundPrefs({ voiceRate: 1.0 });
    expect(next).toEqual({ effects: false, haptics: true, voiceRate: 1.0 });
  });

  it('JSON corrupto en localStorage cae a los valores por defecto', () => {
    localStorage.setItem('aprende-chino-sound-prefs', '{roto');
    expect(getSoundPrefs()).toEqual({ effects: true, haptics: true, voiceRate: 0.8 });
  });

  it('los getters individuales reflejan el estado guardado', () => {
    setSoundPrefs({ effects: false, haptics: false, voiceRate: 1.0 });
    expect(effectsEnabled()).toBe(false);
    expect(hapticsEnabled()).toBe(false);
    expect(getVoiceRate()).toBe(1.0);
  });
});

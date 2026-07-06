// src/utils/soundPrefs.js
// Preferencias de sonido/vibración (solo locales, como music-settings):
//   - effects:   efectos de acierto/error de los minijuegos (gameAudio.js)
//   - haptics:   vibración de feedback (haptic.js)
//   - voiceRate: velocidad del TTS (tts-enhanced.js) — 0.8 lenta | 1.0 normal
// Se leen en caliente en cada uso, así el cambio en Ajustes aplica al instante
// sin recargar ni re-renderizar los juegos.
import { STORAGE_KEYS } from './storageKeys.js';

const DEFAULTS = { effects: true, haptics: true, voiceRate: 0.8 };

export function getSoundPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOUND_PREFS);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setSoundPrefs(patch) {
  const next = { ...getSoundPrefs(), ...patch };
  try { localStorage.setItem(STORAGE_KEYS.SOUND_PREFS, JSON.stringify(next)); } catch { /* noop */ }
  return next;
}

export const effectsEnabled = () => getSoundPrefs().effects;
export const hapticsEnabled = () => getSoundPrefs().haptics;
export const getVoiceRate   = () => getSoundPrefs().voiceRate;

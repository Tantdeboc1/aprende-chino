// src/utils/haptic.js
// Haptic feedback via Vibration API (Android/Chrome; no-op en iOS/desktop)
import { hapticsEnabled } from './soundPrefs.js';

function vibrate(pattern) {
  try {
    if (!hapticsEnabled()) return; // desactivado desde Ajustes
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (_) {
    // silencioso si no está disponible
  }
}

/** Vibración corta: respuesta correcta */
export function hapticSuccess() {
  vibrate(80);
}

/** Vibración doble: respuesta incorrecta */
export function hapticError() {
  vibrate([50, 30, 50]);
}

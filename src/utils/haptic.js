// src/utils/haptic.js
// Haptic feedback via Vibration API (Android/Chrome; no-op en iOS/desktop)

function vibrate(pattern) {
  try {
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

/** Vibración muy corta: tap UI (opcional) */
export function hapticTap() {
  vibrate(15);
}

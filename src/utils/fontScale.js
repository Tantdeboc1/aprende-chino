// src/utils/fontScale.js
// Ajuste de tamaño de texto (accesibilidad / baja visión). Escala el tamaño de
// fuente RAÍZ, así que todo lo que use `rem` — las clases de Tailwind y los
// `fontSize` inline (ya convertidos a rem) — crece de forma proporcional.
//
// La regla vive en index.css:  html { font-size: calc(100% * var(--font-scale)) }
// `100%` respeta además el tamaño de fuente del navegador/SO, y el multiplicador
// aplica el ajuste dentro de la app encima de eso.
//
// Preferencia LOCAL del dispositivo (no se sincroniza con la nube): depende de
// la pantalla y de la vista de cada persona, no de la cuenta. Mismo patrón que
// theme.js.
import { STORAGE_KEYS } from '@/utils/storageKeys.js';

const KEY = STORAGE_KEYS.FONT_SCALE;

// Presets → multiplicador. 'normal' = tamaño de diseño; el resto agranda.
export const FONT_SCALES = {
  normal: 1,
  large: 1.15,
  xlarge: 1.3,
};
export const FONT_SCALE_KEYS = Object.keys(FONT_SCALES);

export function getFontScalePref() {
  try {
    const v = localStorage.getItem(KEY);
    return FONT_SCALES[v] ? v : 'normal';
  } catch {
    return 'normal';
  }
}

// Aplica el multiplicador a la raíz vía variable CSS. Si es 'normal' quitamos la
// variable (queda el `var(--font-scale, 1)` por defecto) para no forzar nada.
export function applyFontScale(pref = getFontScalePref()) {
  const mult = FONT_SCALES[pref] || 1;
  const root = document.documentElement;
  if (mult === 1) root.style.removeProperty('--font-scale');
  else root.style.setProperty('--font-scale', String(mult));
  return pref;
}

export function setFontScalePref(pref) {
  const safe = FONT_SCALES[pref] ? pref : 'normal';
  try { localStorage.setItem(KEY, safe); } catch {}
  return applyFontScale(safe);
}

// Arranque: aplica el ajuste guardado antes del primer render (evita reflow).
export function initFontScale() {
  applyFontScale();
}

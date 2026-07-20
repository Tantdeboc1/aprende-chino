// src/utils/highContrast.js
// Modo de alto contraste (accesibilidad / baja visión, WCAG 1.4.6 AAA).
// Toggle INDEPENDIENTE del tema: se combina con claro u oscuro poniendo la
// clase `high-contrast` en <html>. Los overrides de tokens viven en index.css
// (.high-contrast y .high-contrast.dark), así que toda la app se adapta sola.
//
// Preferencia LOCAL del dispositivo (no se sincroniza), igual que tema y
// tamaño de texto.
import { STORAGE_KEYS } from '@/utils/storageKeys.js';

const KEY = STORAGE_KEYS.HIGH_CONTRAST;

export function getHighContrast() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function applyHighContrast(on = getHighContrast()) {
  document.documentElement.classList.toggle('high-contrast', !!on);
  return !!on;
}

export function setHighContrast(on) {
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {}
  return applyHighContrast(on);
}

// Arranque: aplica la preferencia guardada antes del primer render.
export function initHighContrast() {
  applyHighContrast();
}

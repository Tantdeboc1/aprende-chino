// src/utils/gameIntroPrefs.js
// Preferencias de las pantallas de explicación de los minijuegos.
// - Cada juego puede ocultarse individualmente ("No volver a mostrar").
// - Desde Ajustes se puede desactivar/reactivar todo de golpe; al reactivar
//   se limpian también los ocultados individuales.
const KEY = 'gameIntroPrefs';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function save(prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // localStorage no disponible — ignorar
  }
}

/** ¿Debe mostrarse la pantalla de explicación de este juego? */
export function shouldShowIntro(gameId) {
  const p = load();
  if (p.skipAll) return false;
  return !(p.skip && p.skip[gameId]);
}

/** Marca la explicación de un juego como "no volver a mostrar". */
export function hideIntro(gameId) {
  const p = load();
  p.skip = { ...(p.skip || {}), [gameId]: true };
  save(p);
}

/** Estado global del toggle de Ajustes. */
export function introsEnabled() {
  return !load().skipAll;
}

/** Activa/desactiva todas las explicaciones desde Ajustes. */
export function setIntrosEnabled(enabled) {
  save(enabled ? {} : { skipAll: true });
}

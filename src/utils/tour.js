// src/utils/tour.js
// Estado del tutorial guiado del primer arranque.
//
// El tour se ARMA solo al terminar el WelcomeFlow. Quien ya tiene nombre no
// vuelve a pasar por ahí, así que a un usuario existente nunca se le arma:
// no hace falta ninguna heurística de "es nuevo".
//
// Es preferencia de interfaz, como gameIntroPrefs: vive solo en local y no
// entra en SYNCED_EXTRA_KEYS.
import { STORAGE_KEYS } from './storageKeys.js';

const KEY = STORAGE_KEYS.TOUR;

// Los pasos del recorrido. `target` es el valor del atributo data-tour del
// elemento a iluminar; null = tarjeta centrada sin foco (bienvenida).
// `place` indica dónde cae el bocadillo respecto al hueco.
export const TOUR_STEPS = [
  { id: 'welcome',    target: null,             place: 'center', titleKey: 'tour_welcome_title', descKey: 'tour_welcome_desc' },
  { id: 'review',     target: 'nav-review',     place: 'above',  titleKey: 'tour_review_title',  descKey: 'tour_review_desc' },
  { id: 'practice',   target: 'nav-practice',   place: 'above',  titleKey: 'tour_practice_title', descKey: 'tour_practice_desc' },
  { id: 'dictionary', target: 'nav-dictionary', place: 'above',  titleKey: 'tour_dictionary_title', descKey: 'tour_dictionary_desc' },
  { id: 'profile',    target: 'nav-profile',    place: 'above',  titleKey: 'tour_profile_title', descKey: 'tour_profile_desc' },
  { id: 'home',       target: 'nav-home',       place: 'above',  titleKey: 'tour_home_title',    descKey: 'tour_home_desc' },
  { id: 'basics',     target: 'section-basics', place: 'below',  titleKey: 'tour_basics_title',  descKey: 'tour_basics_desc' },
  { id: 'intro',      target: 'lesson-intro',   place: 'below',  titleKey: 'tour_intro_title',   descKey: 'tour_intro_desc' },
];

function read() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
    return stored && typeof stored === 'object' ? stored : null;
  } catch {
    return null;
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('No se pudo guardar el estado del tutorial:', e);
  }
}

/** Deja el tutorial listo para arrancar. Lo llama el final del WelcomeFlow. */
export function armTour() {
  write({ status: 'pending' });
}

/** ¿Hay que mostrar el tutorial? */
export function isTourPending() {
  return read()?.status === 'pending';
}

/** Cierra el tutorial, tanto al terminarlo como al saltarlo. */
export function finishTour() {
  write({ status: 'done' });
}

/** Vuelve a lanzarlo desde Ajustes. */
export function restartTour() {
  armTour();
}

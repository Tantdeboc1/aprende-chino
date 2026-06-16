// src/utils/lessonFilter.js
// Filtro de lección compartido entre los mini-juegos de la misma sesión.
// Persiste en sessionStorage: dura mientras la pestaña esté abierta y se
// reinicia al cerrar el navegador.
//
// Uso típico en cada minijuego:
//   const [lessonFilter, setLessonFilter] = useLessonFilter(selectedLesson);
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'minigamesLessonFilter';

/**
 * Carga el filtro guardado. Si se pasa `fallback`, lo usa como valor inicial
 * cuando no hay nada guardado (típicamente el `selectedLesson` recibido por props).
 * Devuelve `null` o un número de lección.
 */
export function loadLessonFilter(fallback = null) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return fallback;
    if (raw === 'null') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Persiste el filtro actual. Acepta `null` (todas las lecciones) o un número.
 */
export function saveLessonFilter(value) {
  try {
    sessionStorage.setItem(STORAGE_KEY, value === null ? 'null' : String(value));
  } catch {
    /* sessionStorage puede no estar disponible (modo privado, SSR, etc.) */
  }
}

/** Limpia el filtro (vuelve a "todas las lecciones"). */
export function clearLessonFilter() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Hook que encapsula el patrón repetido en todos los minijuegos: estado del
 * filtro inicializado desde sessionStorage (con `selectedLesson` como fallback)
 * y persistencia automática en cada cambio.
 * @param {number|null} selectedLesson  lección preseleccionada (de props)
 * @returns {[number|null, Function]}   [lessonFilter, setLessonFilter]
 */
export function useLessonFilter(selectedLesson = null) {
  const [lessonFilter, setLessonFilter] = useState(() => loadLessonFilter(selectedLesson || null));
  useEffect(() => { saveLessonFilter(lessonFilter); }, [lessonFilter]);
  return [lessonFilter, setLessonFilter];
}

// src/utils/lessonFilter.js
// Filtro de lección compartido entre los mini-juegos de la misma sesión.
// Persiste en sessionStorage: dura mientras la pestaña esté abierta y se
// reinicia al cerrar el navegador.
//
// Uso típico en cada minijuego:
//   const [lessonFilter, setLessonFilter] = useState(() => loadLessonFilter(propSelectedLesson));
//   useEffect(() => saveLessonFilter(lessonFilter), [lessonFilter]);

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

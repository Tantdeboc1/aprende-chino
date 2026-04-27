// src/utils/srs.js
// Sistema de Repetición Espaciada (SRS) — algoritmo SM-2 simplificado
//
// Los datos SRS se guardan en progress.__srs[char]:
//   { interval, easeFactor, repetitions, nextReview, lastReviewed }
//
// Quality values:
//   0 = otra vez (no recuerdo)
//   3 = difícil (recuerdo con esfuerzo)
//   4 = bien (recuerdo correctamente)
//   5 = fácil (muy fácil, respuesta inmediata)

const DEFAULT_EASE = 2.5;
const MIN_EASE     = 1.3;

/**
 * Devuelve los datos SRS de un carácter, con valores por defecto si no existe.
 */
export function getSRSData(progress, char) {
  return progress?.__srs?.[char] || {
    interval:     1,
    easeFactor:   DEFAULT_EASE,
    repetitions:  0,
    nextReview:   null,  // null = nunca revisado
    lastReviewed: null,
  };
}

/**
 * Actualiza el progreso SRS para un carácter dado quality (0-5).
 * Devuelve el objeto progress actualizado (inmutable).
 */
export function updateSRS(progress, char, quality) {
  const srs = getSRSData(progress, char);
  const now = Date.now();

  let { interval, easeFactor, repetitions } = srs;

  if (quality < 3) {
    // No recuerda — reiniciar
    repetitions = 0;
    interval    = 1;
  } else {
    // Recuerda correctamente — avanzar
    if (repetitions === 0)      interval = 1;
    else if (repetitions === 1) interval = 6;
    else                        interval = Math.round(interval * easeFactor);

    // Ajuste del factor de facilidad
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(MIN_EASE, easeFactor);
    repetitions++;
  }

  // Si la palabra está marcada como difícil, limitar el intervalo a 3 días
  if (srs.difficult) interval = Math.min(interval, 3);

  // nextReview = ahora + interval días
  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  const updated = { ...progress };
  if (!updated.__srs) updated.__srs = {};
  updated.__srs = {
    ...updated.__srs,
    [char]: { interval, easeFactor, repetitions, nextReview, lastReviewed: now, difficult: srs.difficult || false },
  };
  return updated;
}

/**
 * Alterna la bandera "difícil" de una palabra en el SRS.
 * Las palabras difíciles tienen un intervalo máximo de 3 días.
 */
export function toggleWordDifficult(progress, char) {
  const srs = getSRSData(progress, char);
  const updated = { ...progress };
  if (!updated.__srs) updated.__srs = {};
  updated.__srs = {
    ...updated.__srs,
    [char]: { ...srs, difficult: !srs.difficult },
  };
  return updated;
}

/**
 * Devuelve true si la palabra está marcada como difícil.
 */
export function isWordDifficult(progress, char) {
  return progress?.__srs?.[char]?.difficult === true;
}

/**
 * Inicia una tarjeta SRS (marca como "vista por primera vez" si no existe),
 * sin cambiar el intervalo.
 * FIX: si existe pero nextReview es null (ej: marcada difícil antes de ser vista),
 * establece nextReview ahora preservando los demás datos (como la flag difficult).
 */
export function initSRSCard(progress, char) {
  const existing = progress?.__srs?.[char];
  // Si ya existe y tiene nextReview válido, no tocar
  if (existing && existing.nextReview !== null) return progress;
  const updated = { ...progress };
  if (!updated.__srs) updated.__srs = {};
  updated.__srs = {
    ...updated.__srs,
    [char]: {
      // Preservar flags existentes (ej: difficult) si la entrada ya existía
      ...(existing || {}),
      interval:     existing?.interval     ?? 1,
      easeFactor:   existing?.easeFactor   ?? DEFAULT_EASE,
      repetitions:  existing?.repetitions  ?? 0,
      nextReview:   Date.now(), // disponible para repasar ahora mismo
      lastReviewed: existing?.lastReviewed ?? null,
    },
  };
  return updated;
}

/**
 * Devuelve todos los caracteres que tienen repasos pendientes (nextReview <= ahora).
 * Solo incluye palabras que el usuario ya ha visto al menos una vez.
 */
export function getDueCards(progress, allCharacters) {
  const now  = Date.now();
  const srs  = progress?.__srs || {};
  return allCharacters.filter(c => {
    const d = srs[c.char];
    if (!d) return false;
    return d.nextReview !== null && d.nextReview <= now;
  });
}

/**
 * Devuelve cuántas tarjetas están pendientes de repaso.
 */
export function getDueCount(progress, allCharacters) {
  return getDueCards(progress, allCharacters).length;
}

/**
 * Devuelve estadísticas SRS globales.
 */
export function getSRSStats(progress, allCharacters) {
  const srs  = progress?.__srs || {};
  const now  = Date.now();
  let learned = 0, due = 0, mature = 0;
  for (const c of allCharacters) {
    if (c.isSupplementary) continue;
    const d = srs[c.char];
    if (!d) continue;
    learned++;
    if (d.nextReview !== null && d.nextReview <= now) due++;
    if (d.interval >= 21) mature++; // 3+ semanas = maduro
  }
  return { learned, due, mature, total: allCharacters.filter(c => !c.isSupplementary).length };
}

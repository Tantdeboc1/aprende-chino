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

// Una palabra se considera "leech" tras este número de fallos consecutivos.
// 3 es el estándar de Anki — suficiente para detectar palabras problemáticas
// sin ser tan paranoico como para marcar fallos puntuales.
export const LEECH_THRESHOLD = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

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
  // Contador de fallos consecutivos — usado para detección de leech.
  let consecutiveFails = srs.consecutiveFails || 0;

  if (quality < 3) {
    // No recuerda — reiniciar SRS y subir contador de fallos
    repetitions = 0;
    interval    = 1;
    consecutiveFails++;
  } else {
    // Recuerda correctamente — avanzar y reiniciar contador de fallos
    if (repetitions === 0)      interval = 1;
    else if (repetitions === 1) interval = 6;
    else                        interval = Math.round(interval * easeFactor);

    // Ajuste del factor de facilidad
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    easeFactor = Math.max(MIN_EASE, easeFactor);
    repetitions++;
    consecutiveFails = 0;
  }

  // Si la palabra está marcada como difícil, limitar el intervalo a 3 días
  if (srs.difficult) interval = Math.min(interval, 3);

  // nextReview = ahora + interval días
  const nextReview = now + interval * DAY_MS;

  // Marca leech si el usuario falla N veces seguidas (umbral configurable).
  // No suspendemos la carta — solo la flagueamos para que la UI la destaque.
  const isLeech = consecutiveFails >= LEECH_THRESHOLD;

  const updated = { ...progress };
  if (!updated.__srs) updated.__srs = {};
  updated.__srs = {
    ...updated.__srs,
    [char]: {
      interval, easeFactor, repetitions, nextReview, lastReviewed: now,
      difficult: srs.difficult || false,
      consecutiveFails,
      leech: isLeech,
    },
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
/**
 * Elimina caracteres repetidos de una lista, conservando el primero. Un mismo
 * carácter puede aparecer en varias lecciones del vocabulario (p. ej. 水 en L3
 * y L8) y, como el SRS y los exámenes se indexan por carácter, sin esto se
 * repasaría/preguntaría dos veces la misma palabra.
 */
export function dedupeByChar(chars) {
  const seen = new Set();
  return chars.filter(c => {
    if (seen.has(c.char)) return false;
    seen.add(c.char);
    return true;
  });
}

export function getDueCards(progress, allCharacters) {
  const now  = Date.now();
  const srs  = progress?.__srs || {};
  return dedupeByChar(allCharacters.filter(c => {
    const d = srs[c.char];
    if (!d) return false;
    return d.nextReview !== null && d.nextReview <= now;
  }));
}

/**
 * Devuelve cuántas tarjetas están pendientes de repaso.
 */
export function getDueCount(progress, allCharacters) {
  return getDueCards(progress, allCharacters).length;
}

/**
 * Devuelve las N tarjetas más débiles del SRS, ordenadas por debilidad.
 * Combina el easeFactor (SM-2) con el ratio de aciertos en quizzes.
 * No filtra por fecha — sirve para el modo "palabras débiles".
 */
export function getWeakCards(progress, allCharacters, limit = 20) {
  const srs = progress?.__srs || {};

  // Solo caracteres que ya están en el SRS (han sido vistos al menos una vez),
  // sin repetir un carácter presente en varias lecciones.
  const enrolled = dedupeByChar(allCharacters.filter(c => {
    const d = srs[c.char];
    return d && d.nextReview !== null;
  }));

  if (enrolled.length === 0) return [];

  const scored = enrolled.map(c => {
    const d = srs[c.char];
    const lessonKey = `lesson_${c.lesson}`;
    const wordData = progress?.[lessonKey]?.[c.char] || {};
    const correct   = wordData.correct   || 0;
    const incorrect = wordData.incorrect || 0;
    const total = correct + incorrect;

    // Ratio quiz: si no hay datos de quiz se asume 0.5 (neutral)
    const quizAccuracy = total === 0 ? 0.5 : correct / total;

    // easeFactor range: ~1.3 (muy difícil) – 2.5 (muy fácil)
    // Normalizamos a [0, 1] donde 1 = más débil
    const efNorm = 1 - Math.min(1, Math.max(0, (d.easeFactor - 1.3) / 1.2));

    // Puntuación de debilidad: 60% peso SRS + 40% peso quiz
    const weaknessScore = 0.6 * efNorm + 0.4 * (1 - quizAccuracy);

    return { ...c, _weaknessScore: weaknessScore, _easeFactor: d.easeFactor };
  });

  // Más débiles primero
  scored.sort((a, b) => b._weaknessScore - a._weaknessScore);
  return scored.slice(0, limit);
}

/**
 * Devuelve el nivel de "salud" de una palabra en el SRS.
 * Retorna un objeto { emoji, color, level, label }
 *   level: 'new' | 'critical' | 'learning' | 'known' | 'mastered'
 */
export function getWordHealth(progress, char) {
  const srs = progress?.__srs?.[char];
  if (!srs || srs.nextReview === null) {
    return { emoji: '新', color: 'text-[#928a76]', level: 'new', labelKey: 'health_new' };
  }
  // critical: interval 1, easeFactor bajo, o pendiente de repaso con muchos fallos
  if (srs.interval <= 1 || srs.easeFactor < 1.5) {
    return { emoji: '危', color: 'text-[#c8392f]', level: 'critical', labelKey: 'health_critical' };
  }
  // learning: interval < 7 días
  if (srs.interval < 7) {
    return { emoji: '习', color: 'text-[#b88a3e]', level: 'learning', labelKey: 'health_learning' };
  }
  // mastered: interval >= 21 días (3+ semanas)
  if (srs.interval >= 21) {
    return { emoji: '精', color: 'text-[#2f6b4a]', level: 'mastered', labelKey: 'health_mastered' };
  }
  // known: interval 7-20 días
  return { emoji: '知', color: 'text-[#5a8f72]', level: 'known', labelKey: 'health_known' };
}

/**
 * ¿Es una "leech"? Palabra que has fallado LEECH_THRESHOLD veces seguidas.
 */
export function isLeech(progress, char) {
  return progress?.__srs?.[char]?.leech === true;
}

/**
 * Devuelve todas las palabras leech (fallos consecutivos ≥ umbral).
 * Útil para ofrecer una sesión de "rompe el ciclo" con repaso intensivo.
 */
export function getLeechCards(progress, allCharacters) {
  const srs = progress?.__srs || {};
  return allCharacters.filter(c => srs[c.char]?.leech === true);
}

/**
 * Devuelve un descriptor del próximo repaso de una palabra:
 *   { kind: 'never' }                       → nunca vista
 *   { kind: 'due', days: 0 }                → pendiente hoy
 *   { kind: 'soon', days: n }               → en n días (n ≥ 1)
 *   { kind: 'mastered' }                    → intervalo ≥ 21 días (dominada)
 *
 * `mastered` se calcula a partir del intervalo, no del tiempo restante.
 * Una palabra "mastered" puede tener `days` alto pero la mostramos como dominada.
 */
export function getNextReviewInfo(progress, char) {
  const d = progress?.__srs?.[char];
  if (!d || d.nextReview === null) return { kind: 'never' };
  if (d.interval >= 21) return { kind: 'mastered' };
  const now = Date.now();
  const diffMs = d.nextReview - now;
  const days = Math.ceil(diffMs / DAY_MS);
  if (days <= 0) return { kind: 'due', days: 0 };
  return { kind: 'soon', days };
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

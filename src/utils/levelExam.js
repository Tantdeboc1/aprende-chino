// src/utils/levelExam.js
// Lógica del Examen Final del nivel (certificación HSK-1):
//  - Se DESBLOQUEA al dominar un % del vocabulario del nivel.
//  - Cronometrado, con umbral de aprobado estilo HSK.
//  - Al aprobar marca el nivel como "superado" (con vistas a desbloquear
//    HSK-2 en el futuro). El mejor resultado se guarda y sincroniza.
import { STORAGE_KEYS } from './storageKeys.js';

const KEY = STORAGE_KEYS.LEVEL_EXAM;

// % de vocabulario dominado necesario para desbloquear el examen final.
export const UNLOCK_MASTERY_PCT = 80;
// Nota mínima para aprobar (el HSK real aprueba con ~60 %).
export const PASS_PCT = 60;

/**
 * Mastery del nivel: palabras principales dominadas sobre el total.
 * @param {object} progress      estado de progreso ({ lesson_N: { char: {...} } })
 * @param {Array}  characters    catálogo completo de caracteres
 * @returns {{ total:number, mastered:number, pct:number }}
 */
export function getLevelMastery(progress, characters = []) {
  const main = characters.filter(c => c.char && !c.isSupplementary);
  const total = main.length;
  let mastered = 0;
  for (const c of main) {
    if (progress?.[`lesson_${c.lesson}`]?.[c.char]?.mastered) mastered++;
  }
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  return { total, mastered, pct };
}

/** ¿Está desbloqueado el examen final? */
export function isLevelExamUnlocked(progress, characters = []) {
  return getLevelMastery(progress, characters).pct >= UNLOCK_MASTERY_PCT;
}

/** Lee el resultado guardado, o null si nunca se hizo. */
export function loadLevelExamResult() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

/**
 * Registra un intento. Conserva la mejor nota y el flag de aprobado (una vez
 * superado, el nivel queda superado aunque luego saques menos).
 * @returns {{ result:object, pct:number, passedThisAttempt:boolean }}
 */
export function saveLevelExamResult({ correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passedThisAttempt = pct >= PASS_PCT;
  const prev = loadLevelExamResult();
  const result = {
    bestPct: Math.max(prev?.bestPct || 0, pct),
    lastPct: pct,
    passed: Boolean(prev?.passed) || passedThisAttempt,
    attempts: (prev?.attempts || 0) + 1,
    date: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(result));
  } catch (e) {
    console.warn('No se pudo guardar el examen de nivel:', e);
  }
  return { result, pct, passedThisAttempt };
}

/** ¿El nivel está marcado como superado? */
export function isLevelPassed() {
  return Boolean(loadLevelExamResult()?.passed);
}

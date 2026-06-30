// src/utils/cefrExam.js
// Resultado del Examen MCER (A1) por destrezas (听 oral · 读 lectura · 写 escritura).
// Espejo de levelExam.js: guarda el mejor resultado y si está "Apto", con el
// desglose por destreza. Se sincroniza con la nube (ver SYNCED_EXTRA_KEYS).
import { STORAGE_KEYS } from './storageKeys.js';

const KEY = STORAGE_KEYS.CEFR_EXAM;

// Nivel que certifica (el contenido es HSK1 ≈ A1 del MCER).
export const CEFR_LEVEL = 'A1';
// Nota global mínima para "Apto" + mínimo por destreza (que no se suspenda una
// destreza entera aprobando de rebote con las otras).
export const CEFR_PASS_PCT = 60;
export const CEFR_SKILL_MIN_PCT = 40;

// Orden y metadatos de las destrezas evaluadas.
export const CEFR_SKILLS = [
  { id: 'listening', cn: '听', i18nKey: 'minigames_section_listening', def: 'Comprensión oral' },
  { id: 'reading',   cn: '读', i18nKey: 'minigames_section_reading',   def: 'Comprensión escrita' },
  { id: 'writing',   cn: '写', i18nKey: 'minigames_section_writing',   def: 'Expresión escrita' },
];

export function loadCefrResult() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

// ¿Aprobado? Global ≥ 60 % y ninguna destreza por debajo del mínimo.
export function isCefrPass(pct, perSkill) {
  if (pct < CEFR_PASS_PCT) return false;
  return CEFR_SKILLS.every(s => {
    const sk = perSkill?.[s.id];
    if (!sk || !sk.total) return true; // destreza no evaluada: no bloquea
    return Math.round((sk.correct / sk.total) * 100) >= CEFR_SKILL_MIN_PCT;
  });
}

/**
 * Registra un intento. Conserva la mejor nota global y el flag de "Apto"
 * (una vez apto, queda apto aunque luego se saque menos).
 * @param {{ perSkill: object, correct:number, total:number }} attempt
 * @returns {{ result:object, pct:number, passedThisAttempt:boolean }}
 */
export function saveCefrResult({ perSkill, correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passedThisAttempt = isCefrPass(pct, perSkill);
  const prev = loadCefrResult();
  const result = {
    level: CEFR_LEVEL,
    bestPct: Math.max(prev?.bestPct || 0, pct),
    lastPct: pct,
    passed: Boolean(prev?.passed) || passedThisAttempt,
    perSkill,
    attempts: (prev?.attempts || 0) + 1,
    date: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(result));
  } catch (e) {
    console.warn('No se pudo guardar el examen MCER:', e);
  }
  return { result, pct, passedThisAttempt };
}

// src/utils/storyProgress.js
// Persistencia del progreso de Story Mode en localStorage + cómputo de XP.
//
// Forma del objeto guardado:
// {
//   "t1-h1": { completada: true, mejorPuntuacion: 11, maxPuntuacion: 12, ultimoIntento: 1700000000000 },
//   "t1-h2": { completada: false, mejorPuntuacion: null, maxPuntuacion: 12 },
// }

import { STORIES } from '@/data/stories/index.js';
import { addXP } from './streak.js';
import { STORAGE_KEYS } from './storageKeys.js';

const LS_KEY = STORAGE_KEYS.STORY_PROGRESS;

// ─── Tabla de XP por historia ───────────────────────────────────────────────
export const STORY_XP = {
  perCorrectAnswer: 5,   // XP por cada respuesta correcta (primera vez)
  completionBonus:  10,  // bonus por terminar el bloque de ejercicios
  perfectBonus:     20,  // bonus por 100% (la primera vez que se logra)
  firstTimeBonus:   30,  // bonus por completar la historia por primera vez
};

export function loadStoryProgress() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoryProgress(progress) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(progress));
  } catch {}
}

// Calcula cuánto XP gana el usuario por completar/repetir una historia.
// - 1ª vez: por respuestas correctas + bonus completar + (perfecto) + 1ª vez.
// - Repetición: solo por la mejora respecto al mejor anterior, + perfecto si
//   es la primera vez que lo logra.
export function computeStoryXP({ score, total, isFirstTime, prevBest = 0 }) {
  let xp = 0;
  if (isFirstTime) {
    xp += score * STORY_XP.perCorrectAnswer;
    xp += STORY_XP.completionBonus;
    xp += STORY_XP.firstTimeBonus;
    if (total > 0 && score === total) xp += STORY_XP.perfectBonus;
  } else {
    const improvement = Math.max(0, score - prevBest);
    xp += improvement * STORY_XP.perCorrectAnswer;
    if (total > 0 && score === total && prevBest < total) {
      xp += STORY_XP.perfectBonus;
    }
  }
  return xp;
}

// Guarda el resultado de UNA historia, mantiene la mejor puntuación, y
// concede el XP correspondiente al sistema de racha/nivel.
// Devuelve { progress, xpGanado, isFirstTime, prevBest }.
export function recordStoryResult(storyId, score, total) {
  const progress = loadStoryProgress();
  const prev = progress[storyId] || {};
  const isFirstTime = !prev.completada;
  const prevBest = prev.mejorPuntuacion ?? 0;

  const mejor = Math.max(prevBest, score);
  progress[storyId] = {
    completada: true,
    mejorPuntuacion: mejor,
    maxPuntuacion: total,
    ultimoIntento: Date.now(),
  };
  saveStoryProgress(progress);

  const xpGanado = computeStoryXP({ score, total, isFirstTime, prevBest });
  if (xpGanado > 0) addXP(xpGanado);

  return { progress, xpGanado, isFirstTime, prevBest };
}

// Devuelve el estado de UNA historia: 'bloqueada' | 'disponible' | 'completada'
export function getStoryStatus(storyId, progress = null) {
  const p = progress ?? loadStoryProgress();
  const idx = STORIES.findIndex(s => s.id === storyId);
  if (idx === -1) return 'bloqueada';

  // La primera siempre está disponible
  if (idx === 0) {
    return p[storyId]?.completada ? 'completada' : 'disponible';
  }

  // Para el resto: requiere que la anterior esté completada
  const prevStory = STORIES[idx - 1];
  const prevCompletada = !!p[prevStory.id]?.completada;
  if (!prevCompletada) return 'bloqueada';
  return p[storyId]?.completada ? 'completada' : 'disponible';
}

// Devuelve un mapa { storyId: 'bloqueada' | 'disponible' | 'completada' }
export function getAllStatuses(progress = null) {
  const p = progress ?? loadStoryProgress();
  return Object.fromEntries(STORIES.map(s => [s.id, getStoryStatus(s.id, p)]));
}

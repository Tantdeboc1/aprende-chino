// src/utils/readingProgress.js
// Persistencia del progreso de Comprensión lectora en localStorage.
// Es independiente de Story Mode (storyProgress.js): aquí no hay desbloqueo
// secuencial, solo "completada" + mejor puntuación por historia.
//
// Forma del objeto guardado, indexado por id de historia (rc-tN-M):
// {
//   "rc-t1-1": { completada: true, mejorPuntuacion: 3, maxPuntuacion: 3, ultimoIntento: 1700000000000 },
// }

import { STORAGE_KEYS } from './storageKeys.js';

const LS_KEY = STORAGE_KEYS.READING_PROGRESS;

export function loadReadingProgress() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveReadingProgress(progress) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(progress));
  } catch {}
}

// Guarda el resultado de UNA historia y mantiene la mejor puntuación.
// Devuelve el progreso actualizado.
export function recordReadingResult(storyId, score, total) {
  if (!storyId) return loadReadingProgress();
  const progress = loadReadingProgress();
  const prev = progress[storyId] || {};
  const mejor = Math.max(prev.mejorPuntuacion ?? 0, score);
  progress[storyId] = {
    completada: true,
    mejorPuntuacion: mejor,
    maxPuntuacion: total,
    ultimoIntento: Date.now(),
  };
  saveReadingProgress(progress);
  return progress;
}

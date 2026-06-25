// src/utils/minigameScores.js
// Mejor puntuación por minijuego, en localStorage. Independiente de
// readingProgress.js (que es por historia): aquí guardamos UNA nota 0-100
// por id de juego, la mejor conseguida. Se usa para mostrar "Mejor: X%" en
// las tarjetas de la pantalla de Destrezas.
//
// Forma del objeto guardado, indexado por id de juego (el mismo que en
// MiniGames.jsx / registry.js):
// {
//   "dictation-game": { best: 80, updatedAt: 1700000000000 },
// }

import { STORAGE_KEYS } from './storageKeys.js';

const LS_KEY = STORAGE_KEYS.MINIGAME_SCORES;

export function loadMinigameScores() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMinigameScores(scores) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(scores));
  } catch {}
}

// Mejor puntuación (0-100) de un juego, o null si nunca se jugó.
export function getBestScore(gameId) {
  if (!gameId) return null;
  const entry = loadMinigameScores()[gameId];
  return entry && typeof entry.best === 'number' ? entry.best : null;
}

// Registra una puntuación (0-100) y conserva solo la mejor. Devuelve el
// objeto actualizado. Tolera valores fuera de rango (se acotan a 0-100).
export function recordMinigameScore(gameId, pct) {
  if (!gameId || typeof pct !== 'number' || Number.isNaN(pct)) {
    return loadMinigameScores();
  }
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const scores = loadMinigameScores();
  const prevBest = scores[gameId]?.best ?? 0;
  scores[gameId] = {
    best: Math.max(prevBest, clamped),
    updatedAt: Date.now(),
  };
  saveMinigameScores(scores);
  return scores;
}

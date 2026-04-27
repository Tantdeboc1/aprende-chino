// src/utils/progress.js
// Sistema de progreso por palabra, guardado en localStorage
import { initSRSCard } from './srs.js';
import { markDailyActivity } from './streak.js';

const STORAGE_KEY = 'aprende-chino-progress-v1';

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar progreso:', e);
  }
}

// Devuelve el estado de una palabra: 'unseen' | 'seen' | 'mastered'
export function getWordStatus(progress, lessonNum, char) {
  const lessonKey = `lesson_${lessonNum}`;
  const word = progress?.[lessonKey]?.[char];
  if (!word) return 'unseen';
  if (word.mastered) return 'mastered';
  if (word.seen) return 'seen';
  return 'unseen';
}

// Marca una palabra como vista (sin nota de acierto/fallo)
// También inicializa la tarjeta SRS
export function markWordSeen(progress, lessonNum, char) {
  const lessonKey = `lesson_${lessonNum}`;
  let updated = { ...progress };
  if (!updated[lessonKey]) updated[lessonKey] = {};
  if (!updated[lessonKey][char]) updated[lessonKey][char] = { seen: false, correct: 0, incorrect: 0, mastered: false };
  updated[lessonKey][char] = { ...updated[lessonKey][char], seen: true };
  updated = initSRSCard(updated, char);
  markDailyActivity();
  return updated;
}

// Registra un resultado de quiz (correct = true/false)
// También inicializa la tarjeta SRS si aún no existe
export function markWordResult(progress, lessonNum, char, correct) {
  const lessonKey = `lesson_${lessonNum}`;
  let updated = { ...progress };
  if (!updated[lessonKey]) updated[lessonKey] = {};
  const prev = updated[lessonKey][char] || { seen: false, correct: 0, incorrect: 0, mastered: false };
  const newCorrect = prev.correct + (correct ? 1 : 0);
  const newIncorrect = prev.incorrect + (correct ? 0 : 1);
  updated[lessonKey][char] = {
    seen: true,
    correct: newCorrect,
    incorrect: newIncorrect,
    mastered: newCorrect >= 3 && newIncorrect === 0,
  };
  // Inicializar tarjeta SRS si es la primera vez que se ve la palabra
  updated = initSRSCard(updated, char);
  markDailyActivity();
  return updated;
}

// Marca manualmente como dominada o no
export function toggleWordMastered(progress, lessonNum, char, mastered) {
  const lessonKey = `lesson_${lessonNum}`;
  const updated = { ...progress };
  if (!updated[lessonKey]) updated[lessonKey] = {};
  const prev = updated[lessonKey][char] || { seen: false, correct: 0, incorrect: 0, mastered: false };
  updated[lessonKey][char] = { ...prev, seen: true, mastered };
  return updated;
}

// Guarda el resultado de un examen en el historial
export function saveExamResult(progress, lessonNum, { score, total, wrongChars }) {
  const lessonKey = `lesson_${lessonNum}`;
  const updated = { ...progress };
  if (!updated[lessonKey]) updated[lessonKey] = {};
  if (!updated[lessonKey].__examHistory) updated[lessonKey].__examHistory = [];
  updated[lessonKey].__examHistory = [
    { date: new Date().toISOString(), score, total, wrongChars },
    ...updated[lessonKey].__examHistory,
  ].slice(0, 10); // máximo 10 intentos guardados
  return updated;
}

// Devuelve el historial de exámenes de una lección
export function getExamHistory(progress, lessonNum) {
  const lessonKey = `lesson_${lessonNum}`;
  return progress?.[lessonKey]?.__examHistory || [];
}

// Estadísticas de una lección
export function getLessonStats(progress, lessonNum, characters) {
  const lessonKey = `lesson_${lessonNum}`;
  const lessonData = progress?.[lessonKey] || {};
  const lessonChars = characters.filter(c => c.lesson === lessonNum && !c.isSupplementary);
  const total = lessonChars.length;
  const seen = lessonChars.filter(c => lessonData[c.char]?.seen).length;
  const mastered = lessonChars.filter(c => lessonData[c.char]?.mastered).length;
  return { total, seen, mastered, unseen: total - seen };
}

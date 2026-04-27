// src/utils/streak.js
// Racha diaria de estudio — persiste en localStorage independiente del progreso

const STREAK_KEY = 'aprende-chino-streak-v1';

const DEFAULT_STREAK = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null, // 'YYYY-MM-DD'
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadStreak() {
  try {
    return { ...DEFAULT_STREAK, ...JSON.parse(localStorage.getItem(STREAK_KEY) || '{}') };
  } catch {
    return { ...DEFAULT_STREAK };
  }
}

function saveStreak(data) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar streak:', e);
  }
}

/**
 * Llamar una vez por sesión de ejercicio para registrar actividad.
 * Actualiza el streak y devuelve el estado actualizado.
 */
export function markDailyActivity() {
  const streak = loadStreak();
  const today = todayStr();

  if (streak.lastActiveDate === today) {
    // Ya se registró actividad hoy — no cambia nada
    return streak;
  }

  let newStreak;
  if (streak.lastActiveDate === null) {
    // Primera vez
    newStreak = 1;
  } else {
    // Calcular diferencia de días
    const last = new Date(streak.lastActiveDate);
    const now  = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Día consecutivo
      newStreak = streak.currentStreak + 1;
    } else {
      // Racha rota
      newStreak = 1;
    }
  }

  const updated = {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, streak.longestStreak),
    lastActiveDate: today,
  };
  saveStreak(updated);
  return updated;
}

/**
 * Devuelve el estado actual del streak sin modificarlo.
 */
export function getStreak() {
  return loadStreak();
}

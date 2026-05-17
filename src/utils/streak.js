// src/utils/streak.js
// Racha diaria de estudio + sistema XP — persiste en localStorage
import { trackAchievement } from '@/utils/leveling.js';

const STREAK_KEY = 'aprende-chino-streak-v1';

const DAILY_XP_GOAL = 50; // XP diario objetivo

const MILESTONES = [
  { days: 3,   icon: '🌱', key: 'milestone_3' },
  { days: 7,   icon: '🥉', key: 'milestone_7' },
  { days: 14,  icon: '🔥', key: 'milestone_14' },
  { days: 30,  icon: '🥈', key: 'milestone_30' },
  { days: 60,  icon: '💎', key: 'milestone_60' },
  { days: 100, icon: '🥇', key: 'milestone_100' },
  { days: 365, icon: '👑', key: 'milestone_365' },
];

const DEFAULT_STREAK = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,   // 'YYYY-MM-DD'
  activityDates: [],      // últimos 365 días con actividad
  // XP system
  todayXP: 0,             // XP ganado hoy
  todayXPDate: null,      // fecha del todayXP (para resetear al cambiar de día)
  totalXP: 0,             // XP acumulado total
  dailyGoal: DAILY_XP_GOAL,
  // Milestones alcanzados
  unlockedMilestones: [], // array de days alcanzados [3, 7, 14, ...]
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadStreak() {
  try {
    const stored = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
    const data = {
      ...DEFAULT_STREAK,
      ...stored,
      activityDates: Array.isArray(stored.activityDates) ? stored.activityDates : [],
      unlockedMilestones: Array.isArray(stored.unlockedMilestones) ? stored.unlockedMilestones : [],
    };
    // Reset todayXP si cambió de día
    const today = todayStr();
    if (data.todayXPDate !== today) {
      data.todayXP = 0;
      data.todayXPDate = today;
    }
    return data;
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
 * Registra actividad diaria + actualiza streak.
 */
export function markDailyActivity() {
  const streak = loadStreak();
  const today = todayStr();

  if (streak.lastActiveDate === today) {
    return streak;
  }

  let newStreak;
  if (streak.lastActiveDate === null) {
    newStreak = 1;
  } else {
    const last = new Date(streak.lastActiveDate);
    const now  = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
    newStreak = diffDays === 1 ? streak.currentStreak + 1 : 1;
  }

  const dates = [...new Set([...streak.activityDates, today])]
    .sort()
    .slice(-365);

  // Check for new milestones
  const unlocked = [...streak.unlockedMilestones];
  for (const m of MILESTONES) {
    if (newStreak >= m.days && !unlocked.includes(m.days)) {
      unlocked.push(m.days);
    }
  }

  const updated = {
    ...streak,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, streak.longestStreak),
    lastActiveDate: today,
    activityDates: dates,
    unlockedMilestones: unlocked,
  };
  saveStreak(updated);

  // Registrar racha para logros (streak_7, streak_30, etc.)
  trackAchievement('streak', newStreak);

  return updated;
}

/**
 * Añade XP al contador de hoy y al total.
 * @param {number} xp - cantidad de XP a sumar (ej: 10 por respuesta correcta)
 * @returns {object} estado actualizado del streak
 */
export function addXP(xp) {
  const streak = loadStreak();
  const today = todayStr();

  // Registrar actividad si no se ha hecho hoy
  let updated = streak;
  if (streak.lastActiveDate !== today) {
    updated = markDailyActivity();
  }

  const prevTodayXP = updated.todayXP || 0;
  updated.todayXP = prevTodayXP + xp;
  updated.todayXPDate = today;
  updated.totalXP = (updated.totalXP || 0) + xp;

  // Registrar cumplimiento de objetivo diario (solo la primera vez que se cruza)
  const goal = updated.dailyGoal || DAILY_XP_GOAL;
  if (prevTodayXP < goal && updated.todayXP >= goal) {
    trackAchievement('daily_goal_completed', 1);
  }

  saveStreak(updated);
  return updated;
}

/**
 * Devuelve el estado actual del streak sin modificarlo.
 */
export function getStreak() {
  return loadStreak();
}

/**
 * Devuelve la lista de milestones con su estado de desbloqueo.
 */
export function getMilestones() {
  const streak = loadStreak();
  return MILESTONES.map(m => ({
    ...m,
    unlocked: streak.unlockedMilestones.includes(m.days),
    current: streak.currentStreak >= m.days,
  }));
}

/**
 * Calcula el progreso del objetivo diario (0-100).
 */
export function getDailyGoalProgress() {
  const streak = loadStreak();
  const goal = streak.dailyGoal || DAILY_XP_GOAL;
  return {
    current: streak.todayXP || 0,
    goal,
    percent: Math.min(100, Math.round(((streak.todayXP || 0) / goal) * 100)),
    completed: (streak.todayXP || 0) >= goal,
  };
}

export { MILESTONES, DAILY_XP_GOAL };

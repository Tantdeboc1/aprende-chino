// src/utils/streak.js
// Racha diaria de estudio + sistema XP — persiste en localStorage
import { trackAchievement, checkLevelUp } from '@/utils/leveling.js';
import { updateChallengeProgress } from '@/utils/dailyChallenges.js';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';

const STREAK_KEY = STORAGE_KEYS.STREAK;

// XP diario objetivo. Una historia perfecta da 120 XP, así que con el daily
// goal a 50 se rompía siempre. Lo subimos para que sea un reto real: hacer
// una historia o varios quizzes.
const DAILY_XP_GOAL = 120;

// Presets de meta diaria elegibles en onboarding y Ajustes.
// El XP de referencia: una historia perfecta da 120.
export const DAILY_GOAL_PRESETS = [
  { id: 'relaxed', xp: 60,  icon: '🍵' },
  { id: 'normal',  xp: 120, icon: '🎯' },
  { id: 'intense', xp: 200, icon: '🔥' },
];

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
  xpByDay: {},            // XP por día de los últimos 7 días { 'YYYY-MM-DD': xp }
  dailyGoal: DAILY_XP_GOAL,
  // Milestones alcanzados
  unlockedMilestones: [], // array de days alcanzados [3, 7, 14, ...]
};

function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayStr() {
  return dateStr(new Date());
}

// Fecha (local) de hace 6 días: el límite inferior de la ventana "últimos
// 7 días" (hoy incluido). Las claves YYYY-MM-DD se comparan como strings.
function weekCutoffStr() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return dateStr(d);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateStr(d);
}

export function loadStreak() {
  try {
    const stored = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
    const data = {
      ...DEFAULT_STREAK,
      ...stored,
      activityDates: Array.isArray(stored.activityDates) ? stored.activityDates : [],
      unlockedMilestones: Array.isArray(stored.unlockedMilestones) ? stored.unlockedMilestones : [],
      xpByDay: (stored.xpByDay && typeof stored.xpByDay === 'object') ? stored.xpByDay : {},
    };
    // Reset todayXP si cambió de día
    const today = todayStr();
    if (data.todayXPDate !== today) {
      data.todayXP = 0;
      data.todayXPDate = today;
    }
    // Racha rota: si la última actividad no fue ni hoy ni ayer, la racha ya
    // no sigue viva — se lee como 0 en vez de mostrar el valor antiguo hasta
    // la siguiente actividad ("racha fantasma" en Home). markDailyActivity
    // llegaría a la misma conclusión (diffDays > 1 → racha = 1).
    if (data.lastActiveDate && data.lastActiveDate < yesterdayStr() && data.currentStreak > 0) {
      data.currentStreak = 0;
    }
    // Migración: si el usuario tenía el viejo daily goal (50) lo subimos
    // al nuevo (120). El usuario puede sobreescribirlo en ajustes.
    if (data.dailyGoal === 50 && DAILY_XP_GOAL !== 50) {
      data.dailyGoal = DAILY_XP_GOAL;
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
 * @returns {object} estado actualizado del streak (con .levelUp y .newAchievements si aplica)
 */
export function addXP(xp) {
  const streak = loadStreak();
  const today = todayStr();

  // Registrar actividad si no se ha hecho hoy
  let updated = streak;
  if (streak.lastActiveDate !== today) {
    updated = markDailyActivity();
  }

  const prevTotalXP = updated.totalXP || 0;
  const prevTodayXP = updated.todayXP || 0;
  updated.todayXP = prevTodayXP + xp;
  updated.todayXPDate = today;
  updated.totalXP = prevTotalXP + xp;

  // XP por día (ranking semanal de amigos): suma de hoy + poda a 7 días.
  const cutoff = weekCutoffStr();
  const byDay = { ...(updated.xpByDay || {}) };
  byDay[today] = (byDay[today] || 0) + xp;
  for (const k of Object.keys(byDay)) {
    if (k < cutoff) delete byDay[k];
  }
  updated.xpByDay = byDay;

  // Track XP earned for daily challenges
  updateChallengeProgress('earn_xp', xp);

  // Registrar cumplimiento de objetivo diario (solo la primera vez que se cruza).
  // trackAchievement ya despacha su propio evento 'achievement-unlocked', así que
  // aquí NO reenviamos los logros para no mostrar el toast dos veces.
  const goal = updated.dailyGoal || DAILY_XP_GOAL;
  const newAchievements = [];
  if (prevTodayXP < goal && updated.todayXP >= goal) {
    const unlocked = trackAchievement('daily_goal_completed', 1);
    if (unlocked.length) newAchievements.push(...unlocked);
  }

  // Check level up
  const levelUp = checkLevelUp(prevTotalXP, updated.totalXP);

  saveStreak(updated);

  // Attach notifications metadata (non-persistent, consumed by UI)
  updated._levelUp = levelUp;
  updated._newAchievements = newAchievements;

  // Solo la subida de nivel viaja por 'xp-notification'; los logros ya se
  // notificaron vía 'achievement-unlocked' desde trackAchievement.
  if (levelUp) {
    try {
      window.dispatchEvent(new CustomEvent('xp-notification', {
        detail: { levelUp, achievements: [] }
      }));
    } catch { /* SSR safety */ }
  }

  return updated;
}

/**
 * Devuelve el estado actual del streak sin modificarlo.
 */
export function getStreak() {
  return loadStreak();
}

/**
 * XP ganado en los últimos 7 días (hoy incluido). Alimenta el ranking
 * semanal de amigos vía el perfil público.
 */
export function getWeeklyXP() {
  const streak = loadStreak();
  const cutoff = weekCutoffStr();
  let sum = 0;
  for (const [day, xp] of Object.entries(streak.xpByDay || {})) {
    if (day >= cutoff) sum += xp || 0;
  }
  return sum;
}

/**
 * Cambia la meta diaria de XP (60/120/200 vía presets, o cualquier número).
 */
export function setDailyGoal(xp) {
  const streak = loadStreak();
  const updated = { ...streak, dailyGoal: xp };
  saveStreak(updated);
  return updated;
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

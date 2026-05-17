// src/utils/leveling.js
// Sistema de niveles, títulos y logros

// ── Niveles ──────────────────────────────────────────────────────────────────
const LEVELS = [
  { level: 1,  xp: 0,     title: { es: 'Curioso',     en: 'Curious',     fr: 'Curieux',      de: 'Neugierig',    it: 'Curioso',      pt: 'Curioso'     }, zh: '好奇者', icon: '🥒' },
  { level: 2,  xp: 100,   title: { es: 'Principiante', en: 'Beginner',    fr: 'Débutant',     de: 'Anfänger',     it: 'Principiante', pt: 'Principiante' }, zh: '初学者', icon: '🌱' },
  { level: 3,  xp: 300,   title: { es: 'Aprendiz',     en: 'Apprentice',  fr: 'Apprenti',     de: 'Lehrling',     it: 'Apprendista',  pt: 'Aprendiz'     }, zh: '学徒',  icon: '📖' },
  { level: 4,  xp: 600,   title: { es: 'Estudiante',   en: 'Student',     fr: 'Étudiant',     de: 'Student',      it: 'Studente',     pt: 'Estudante'    }, zh: '学生',  icon: '✏️' },
  { level: 5,  xp: 1000,  title: { es: 'Practicante',  en: 'Practitioner', fr: 'Pratiquant',   de: 'Übender',      it: 'Praticante',   pt: 'Praticante'   }, zh: '练习者', icon: '⚡' },
  { level: 6,  xp: 1800,  title: { es: 'Conocedor',    en: 'Connoisseur', fr: 'Connaisseur',  de: 'Kenner',       it: 'Conoscitore',  pt: 'Conhecedor'   }, zh: '知者',  icon: '🧠' },
  { level: 7,  xp: 3000,  title: { es: 'Erudito',      en: 'Scholar',     fr: 'Érudit',       de: 'Gelehrter',    it: 'Erudito',      pt: 'Erudito'      }, zh: '学者',  icon: '🎓' },
  { level: 8,  xp: 5000,  title: { es: 'Experto',      en: 'Expert',      fr: 'Expert',       de: 'Experte',      it: 'Esperto',      pt: 'Especialista' }, zh: '专家',  icon: '💎' },
  { level: 9,  xp: 8000,  title: { es: 'Maestro',      en: 'Master',      fr: 'Maître',       de: 'Meister',      it: 'Maestro',      pt: 'Mestre'       }, zh: '大师',  icon: '🐉' },
  { level: 10, xp: 12000, title: { es: 'Sabio',        en: 'Sage',        fr: 'Sage',         de: 'Weiser',       it: 'Saggio',       pt: 'Sábio'        }, zh: '圣人',  icon: '👑' },
];

// ── Logros que desbloquean títulos extra ──────────────────────────────────────
const ACHIEVEMENTS = [
  {
    id: 'first_quiz',
    condition: 'complete_quiz',
    threshold: 1,
    title: { es: 'Primer paso',    en: 'First step',     fr: 'Premier pas',    de: 'Erster Schritt',   it: 'Primo passo',     pt: 'Primeiro passo' },
    zh: '第一步',
    icon: '👣',
    desc:  { es: 'Completa tu primer quiz', en: 'Complete your first quiz', fr: 'Termine ton premier quiz', de: 'Schließe dein erstes Quiz ab', it: 'Completa il tuo primo quiz', pt: 'Complete seu primeiro quiz' },
  },
  {
    id: 'streak_7',
    condition: 'streak',
    threshold: 7,
    title: { es: 'Constante',      en: 'Consistent',     fr: 'Constant',       de: 'Beständig',       it: 'Costante',        pt: 'Constante' },
    zh: '坚持者',
    icon: '🔥',
    desc:  { es: '7 días de racha', en: '7 day streak', fr: '7 jours de série', de: '7 Tage Serie', it: '7 giorni di serie', pt: '7 dias de sequência' },
  },
  {
    id: 'streak_30',
    condition: 'streak',
    threshold: 30,
    title: { es: 'Imparable',      en: 'Unstoppable',    fr: 'Inarrêtable',    de: 'Unaufhaltsam',    it: 'Inarrestabile',   pt: 'Imparável' },
    zh: '不可阻挡',
    icon: '💪',
    desc:  { es: '30 días de racha', en: '30 day streak', fr: '30 jours de série', de: '30 Tage Serie', it: '30 giorni di serie', pt: '30 dias de sequência' },
  },
  {
    id: 'perfect_exam',
    condition: 'perfect_score',
    threshold: 1,
    title: { es: 'Sin fallos',     en: 'Flawless',       fr: 'Sans faute',     de: 'Fehlerlos',       it: 'Senza errori',    pt: 'Sem falhas' },
    zh: '完美',
    icon: '💯',
    desc:  { es: '100% en un examen', en: '100% on an exam', fr: '100% à un examen', de: '100% bei einer Prüfung', it: '100% in un esame', pt: '100% num exame' },
  },
  {
    id: 'master_50',
    condition: 'words_mastered',
    threshold: 50,
    title: { es: 'Políglota',      en: 'Polyglot',       fr: 'Polyglotte',     de: 'Polyglott',       it: 'Poliglotta',      pt: 'Poliglota' },
    zh: '多语者',
    icon: '🌍',
    desc:  { es: 'Domina 50 palabras', en: 'Master 50 words', fr: 'Maîtrise 50 mots', de: '50 Wörter meistern', it: 'Padroneggia 50 parole', pt: 'Domine 50 palavras' },
  },
  {
    id: 'speed_demon',
    condition: 'time_race_score',
    threshold: 80,
    title: { es: 'Velocista',      en: 'Speed demon',    fr: 'Véloce',         de: 'Blitzschnell',    it: 'Velocista',       pt: 'Velocista' },
    zh: '飞速',
    icon: '⚡',
    desc:  { es: '80+ puntos en Carrera Contrarreloj', en: '80+ points in Time Race', fr: '80+ points en Course', de: '80+ Punkte im Zeitrennen', it: '80+ punti nella Corsa', pt: '80+ pontos na Corrida' },
  },
  {
    id: 'all_lessons',
    condition: 'lessons_seen',
    threshold: 4,
    title: { es: 'Explorador',     en: 'Explorer',       fr: 'Explorateur',    de: 'Entdecker',       it: 'Esploratore',     pt: 'Explorador' },
    zh: '探索者',
    icon: '🗺️',
    desc:  { es: 'Visita las 4 lecciones', en: 'Visit all 4 lessons', fr: 'Visite les 4 leçons', de: 'Alle 4 Lektionen besuchen', it: 'Visita tutte le 4 lezioni', pt: 'Visite as 4 lições' },
  },
  {
    id: 'daily_goal_7',
    condition: 'daily_goals_completed',
    threshold: 7,
    title: { es: 'Disciplinado',   en: 'Disciplined',    fr: 'Discipliné',     de: 'Diszipliniert',   it: 'Disciplinato',    pt: 'Disciplinado' },
    zh: '自律者',
    icon: '🎯',
    desc:  { es: 'Cumple el objetivo diario 7 veces', en: 'Complete daily goal 7 times', fr: 'Atteins l\'objectif quotidien 7 fois', de: 'Tagesziel 7 Mal erreichen', it: 'Raggiungi l\'obiettivo quotidiano 7 volte', pt: 'Cumpra a meta diária 7 vezes' },
  },
];

// ── Persistencia ─────────────────────────────────────────────────────────────
const LEVEL_KEY = 'aprende-chino-leveling-v1';

const DEFAULT_STATE = {
  selectedTitle: null,          // id del título equipado (null = usa el de nivel)
  unlockedAchievements: [],     // ids de logros desbloqueados
  // Contadores para condiciones de logros
  counters: {
    complete_quiz: 0,
    perfect_score: 0,
    time_race_score: 0,
    lessons_seen: [],           // array de lesson nums vistos
    daily_goals_completed: 0,
  },
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(LEVEL_KEY) || '{}');
    return {
      ...DEFAULT_STATE,
      ...stored,
      unlockedAchievements: Array.isArray(stored.unlockedAchievements) ? stored.unlockedAchievements : [],
      counters: { ...DEFAULT_STATE.counters, ...(stored.counters || {}) },
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LEVEL_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('No se pudo guardar leveling:', e);
  }
}

// ── API pública ──────────────────────────────────────────────────────────────

/**
 * Calcula el nivel actual a partir del XP total.
 * @param {number} totalXP
 * @returns {{ level, title, zh, icon, xpCurrent, xpForNext, xpInLevel, progress }}
 */
export function getLevelInfo(totalXP) {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xp) {
      current = LEVELS[i];
      break;
    }
  }

  const next = LEVELS.find(l => l.level === current.level + 1);
  const xpInLevel = totalXP - current.xp;
  const xpForNext = next ? next.xp - current.xp : 0;
  const progress = next ? Math.min(100, Math.round((xpInLevel / xpForNext) * 100)) : 100;

  return {
    level: current.level,
    title: current.title,
    zh: current.zh,
    icon: current.icon,
    xpCurrent: totalXP,
    xpInLevel,
    xpForNext,
    progress,
    isMaxLevel: !next,
  };
}

/**
 * Devuelve el título actualmente equipado (o el de nivel si no hay selección).
 */
export function getEquippedTitle(totalXP) {
  const state = loadState();
  const levelInfo = getLevelInfo(totalXP);

  if (state.selectedTitle) {
    // Buscar en logros desbloqueados
    const achievement = ACHIEVEMENTS.find(a => a.id === state.selectedTitle);
    if (achievement && state.unlockedAchievements.includes(achievement.id)) {
      return { title: achievement.title, zh: achievement.zh, icon: achievement.icon, source: 'achievement' };
    }
    // Buscar en títulos de nivel (formato: "level_N")
    const levelMatch = state.selectedTitle.match(/^level_(\d+)$/);
    if (levelMatch) {
      const lvl = LEVELS.find(l => l.level === parseInt(levelMatch[1]));
      if (lvl && totalXP >= lvl.xp) {
        return { title: lvl.title, zh: lvl.zh, icon: lvl.icon, source: 'level' };
      }
    }
  }

  // Default: título del nivel actual
  return { title: levelInfo.title, zh: levelInfo.zh, icon: levelInfo.icon, source: 'level' };
}

/**
 * Devuelve todos los títulos disponibles (desbloqueados).
 */
export function getAvailableTitles(totalXP) {
  const state = loadState();
  const titles = [];

  // Títulos de nivel
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.xp) {
      titles.push({
        id: `level_${lvl.level}`,
        title: lvl.title,
        zh: lvl.zh,
        icon: lvl.icon,
        source: 'level',
        level: lvl.level,
      });
    }
  }

  // Títulos de logros
  for (const ach of ACHIEVEMENTS) {
    if (state.unlockedAchievements.includes(ach.id)) {
      titles.push({
        id: ach.id,
        title: ach.title,
        zh: ach.zh,
        icon: ach.icon,
        source: 'achievement',
        desc: ach.desc,
      });
    }
  }

  return titles;
}

/**
 * Establece el título equipado.
 */
export function setEquippedTitle(titleId) {
  const state = loadState();
  state.selectedTitle = titleId;
  saveState(state);
}

/**
 * Registra un evento y comprueba si se desbloquean logros nuevos.
 * @returns {Array} array de logros recién desbloqueados (puede estar vacío)
 */
export function trackAchievement(eventType, value) {
  const state = loadState();
  const newlyUnlocked = [];

  // Actualizar contadores
  switch (eventType) {
    case 'complete_quiz':
      state.counters.complete_quiz = (state.counters.complete_quiz || 0) + 1;
      break;
    case 'perfect_score':
      state.counters.perfect_score = (state.counters.perfect_score || 0) + 1;
      break;
    case 'time_race_score':
      state.counters.time_race_score = Math.max(state.counters.time_race_score || 0, value || 0);
      break;
    case 'lesson_seen': {
      const seen = Array.isArray(state.counters.lessons_seen) ? state.counters.lessons_seen : [];
      if (value && !seen.includes(value)) {
        seen.push(value);
        state.counters.lessons_seen = seen;
      }
      break;
    }
    case 'daily_goal_completed':
      state.counters.daily_goals_completed = (state.counters.daily_goals_completed || 0) + 1;
      break;
    default:
      break;
  }

  // Comprobar logros
  for (const ach of ACHIEVEMENTS) {
    if (state.unlockedAchievements.includes(ach.id)) continue;

    let met = false;
    switch (ach.condition) {
      case 'complete_quiz':
        met = (state.counters.complete_quiz || 0) >= ach.threshold;
        break;
      case 'streak':
        met = (value || 0) >= ach.threshold && eventType === 'streak';
        break;
      case 'perfect_score':
        met = (state.counters.perfect_score || 0) >= ach.threshold;
        break;
      case 'words_mastered':
        met = (value || 0) >= ach.threshold && eventType === 'words_mastered';
        break;
      case 'time_race_score':
        met = (state.counters.time_race_score || 0) >= ach.threshold;
        break;
      case 'lessons_seen': {
        const seen = Array.isArray(state.counters.lessons_seen) ? state.counters.lessons_seen : [];
        met = seen.length >= ach.threshold;
        break;
      }
      case 'daily_goals_completed':
        met = (state.counters.daily_goals_completed || 0) >= ach.threshold;
        break;
    }

    if (met) {
      state.unlockedAchievements.push(ach.id);
      newlyUnlocked.push(ach);
    }
  }

  saveState(state);
  return newlyUnlocked;
}

/**
 * Comprueba si subió de nivel comparando XP anterior vs actual.
 * @returns {object|null} info del nuevo nivel si subió, null si no
 */
export function checkLevelUp(prevXP, currentXP) {
  const prevLevel = getLevelInfo(prevXP);
  const currLevel = getLevelInfo(currentXP);
  if (currLevel.level > prevLevel.level) {
    return currLevel;
  }
  return null;
}

/**
 * Devuelve todos los logros con su estado.
 */
export function getAllAchievements() {
  const state = loadState();
  return ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: state.unlockedAchievements.includes(ach.id),
  }));
}

export { LEVELS, ACHIEVEMENTS };

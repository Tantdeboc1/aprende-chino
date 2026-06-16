// src/utils/dailyChallenges.js
// Sistema de retos diarios — 3 misiones rotativas por día
import { STORAGE_KEYS } from './storageKeys.js';

const CHALLENGE_KEY = STORAGE_KEYS.CHALLENGES;

// ── Tipos de reto disponibles ─────────────────────────────────────────────────
const CHALLENGE_TEMPLATES = [
  {
    type: 'correct_answers',
    targets: [5, 10, 15, 20],
    icon: '✅',
    titleKey: 'challenge_correct_answers',
    xpReward: 20,
  },
  {
    type: 'complete_quizzes',
    targets: [1, 2, 3],
    icon: '📝',
    titleKey: 'challenge_complete_quizzes',
    xpReward: 25,
  },
  {
    type: 'earn_xp',
    targets: [30, 50, 80, 100],
    icon: '⚡',
    titleKey: 'challenge_earn_xp',
    xpReward: 15,
  },
  {
    type: 'perfect_score',
    targets: [1, 2],
    icon: '💯',
    titleKey: 'challenge_perfect_score',
    xpReward: 30,
  },
  {
    type: 'review_mistakes',
    targets: [3, 5],
    icon: '🔄',
    titleKey: 'challenge_review_mistakes',
    xpReward: 20,
  },
  {
    type: 'play_different_games',
    targets: [2, 3],
    icon: '🎮',
    titleKey: 'challenge_different_games',
    xpReward: 25,
  },
];

// ── Seed determinista por fecha ───────────────────────────────────────────────
function dateHash(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Generar 3 retos del día ───────────────────────────────────────────────────
function generateDailyChallenges(dateStr) {
  const seed = dateHash(dateStr);
  const rng = seededRandom(seed);

  // Seleccionar 3 tipos diferentes
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => rng() - 0.5);
  const selected = shuffled.slice(0, 3);

  return selected.map((template, idx) => {
    const targetIdx = Math.floor(rng() * template.targets.length);
    const target = template.targets[targetIdx];
    return {
      id: `${dateStr}_${idx}`,
      type: template.type,
      icon: template.icon,
      titleKey: template.titleKey,
      target,
      progress: 0,
      completed: false,
      claimed: false,
      xpReward: template.xpReward,
    };
  });
}

// ── Persistencia ──────────────────────────────────────────────────────────────
function loadChallenges() {
  try {
    const stored = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}');
    return stored;
  } catch {
    return {};
  }
}

function saveChallenges(data) {
  try {
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar challenges:', e);
  }
}

// ── API Pública ───────────────────────────────────────────────────────────────

/**
 * Devuelve los 3 retos del día actual, generándolos si es un día nuevo.
 */
export function getDailyChallenges() {
  const today = todayStr();
  const stored = loadChallenges();

  if (stored.date === today && Array.isArray(stored.challenges)) {
    return {
      date: today,
      challenges: stored.challenges,
      allCompleted: stored.challenges.every(c => c.completed),
      bonusClaimed: stored.bonusClaimed || false,
    };
  }

  // Nuevo día → generar nuevos retos
  const challenges = generateDailyChallenges(today);
  const data = { date: today, challenges, bonusClaimed: false };
  saveChallenges(data);
  return { ...data, allCompleted: false };
}

/**
 * Actualiza el progreso de un tipo de reto.
 * @param {string} type - tipo de reto (correct_answers, complete_quizzes, etc.)
 * @param {number} amount - cantidad a incrementar (o valor absoluto para earn_xp)
 * @returns {{ updated: boolean, completed: Array }} retos que se acaban de completar
 */
export function updateChallengeProgress(type, amount = 1) {
  const today = todayStr();
  const stored = loadChallenges();

  if (stored.date !== today || !Array.isArray(stored.challenges)) {
    return { updated: false, completed: [] };
  }

  const newlyCompleted = [];

  for (const challenge of stored.challenges) {
    if (challenge.type !== type || challenge.completed) continue;

    if (type === 'earn_xp') {
      challenge.progress = (challenge.progress || 0) + amount;
    } else if (type === 'play_different_games') {
      // amount es el nombre del juego, progress guarda array de juegos jugados
      if (!Array.isArray(challenge.progress)) challenge.progress = [];
      if (!challenge.progress.includes(amount)) {
        challenge.progress.push(amount);
      }
    } else {
      challenge.progress = (challenge.progress || 0) + amount;
    }

    // Comprobar si se completó
    const currentValue = Array.isArray(challenge.progress) ? challenge.progress.length : challenge.progress;
    if (currentValue >= challenge.target && !challenge.completed) {
      challenge.completed = true;
      newlyCompleted.push(challenge);
    }
  }

  saveChallenges(stored);
  return { updated: true, completed: newlyCompleted };
}

/**
 * Marca un reto como reclamado (XP cobrado).
 */
export function claimChallengeReward(challengeId) {
  const stored = loadChallenges();
  if (!Array.isArray(stored.challenges)) return 0;

  const challenge = stored.challenges.find(c => c.id === challengeId);
  if (!challenge || !challenge.completed || challenge.claimed) return 0;

  challenge.claimed = true;
  saveChallenges(stored);
  return challenge.xpReward;
}

/**
 * Reclama el bonus por completar los 3 retos.
 * @returns {number} XP bonus (50) o 0 si ya reclamado
 */
export function claimAllCompletedBonus() {
  const stored = loadChallenges();
  if (!Array.isArray(stored.challenges)) return 0;
  if (stored.bonusClaimed) return 0;
  if (!stored.challenges.every(c => c.completed)) return 0;

  stored.bonusClaimed = true;
  saveChallenges(stored);
  return 50; // Bonus XP por completar los 3
}

export { CHALLENGE_TEMPLATES };

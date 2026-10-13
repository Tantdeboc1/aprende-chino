import { STORAGE_KEYS } from './storageKeys.js';
import { bumpLocalDataRev } from '@/hooks/useLocalSnapshot.js';

// Activity names and destinations shared by recommendations and breadcrumbs.
export const PRACTICE_ACTIVITIES = {
  'sov-game': ['escritura', 'minigames_sov_title'],
  'translation-game': ['escritura', 'minigames_translation_title'],
  'complete-sentence': ['escritura', 'minigames_complete_title'],
  'dialogue-order': ['lectura', 'minigames_dialogue_title'],
  'reading-comprehension': ['lectura', 'minigames_reading_title'],
  'dictation-game': ['oral_comp', 'minigames_dictation_title'],
  'tones-ear': ['oral_comp', 'tones_ear_title'],
  'pronunciation-practice': ['oral_exp', 'minigames_pronunciation_title'],
  'echo-speaking': ['oral_exp', 'echo_title'],
  'time-race': ['base', 'minigames_time_race_title'],
  'pinyin-connection': ['base', 'minigames_pinyin_connection_title'],
  'find-intruder': ['base', 'minigames_intruder_title'],
  'daily-characters': ['base', 'daily_character_challenge_title'],
  'daily-tones': ['base', 'daily_tones_challenge_title'],
  'daily-radicals': ['base', 'daily_radicals_challenge_title'],
  'global-exam': ['examen', 'minigames_global_exam_title'],
  'level-exam': ['examen', 'level_exam_title'],
  'cefr-exam': ['examen', 'cefr_card_title'],
  stories: ['lectura', 'minigames_stories_card_title'],
};
export const PRACTICE_CATEGORY_KEY = 'hanyupath-practice-category';
export const practiceScrollPositions = new Map();

export function rememberPracticeCategory(category) {
  try {
    if (category) sessionStorage.setItem(PRACTICE_CATEGORY_KEY, category);
    else sessionStorage.removeItem(PRACTICE_CATEGORY_KEY);
  } catch { /* Preferences are optional. */ }
}

export function loadPracticeFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRACTICE_FAVORITES) || '[]');
    return Array.isArray(stored) ? [...new Set(stored)].filter(id => PRACTICE_ACTIVITIES[id]).slice(0, 3) : [];
  } catch { return []; }
}

export function savePracticeFavorites(ids) {
  try { localStorage.setItem(STORAGE_KEYS.PRACTICE_FAVORITES, JSON.stringify(ids.slice(0, 3))); }
  catch { /* The current view remains usable. */ }
  bumpLocalDataRev();
}

// Use actual recent attempts, never the all-time best score. Require enough
// answers to avoid treating a single mistake as a pattern.
export function recommendPractice(sessions, now = Date.now()) {
  const stats = new Map();
  for (const s of sessions) {
    if (!PRACTICE_ACTIVITIES[s.activity] || !Number.isFinite(s.at) || s.at > now || s.at < now - 30 * 86400000
      || !Number.isFinite(s.total) || !Number.isFinite(s.correct) || s.total <= 0 || s.correct < 0 || s.correct > s.total) continue;
    const item = stats.get(s.activity) || { id: s.activity, correct: 0, total: 0, at: 0 };
    item.correct += s.correct; item.total += s.total; item.at = Math.max(item.at, s.at);
    stats.set(s.activity, item);
  }
  const weak = [...stats.values()].filter(s => s.total >= (PRACTICE_ACTIVITIES[s.id][0] === 'oral_exp' ? 300 : 5) && s.correct < s.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total || b.at - a.at)[0];
  return weak ? { id: weak.id, pct: Math.round(100 * weak.correct / weak.total), personalized: true }
    : { id: 'dictation-game', personalized: false };
}

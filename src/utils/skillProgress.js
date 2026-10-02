import { STORAGE_KEYS } from './storageKeys.js';
import { bumpLocalDataRev } from '@/hooks/useLocalSnapshot.js';

export const SKILL_ACTIVITIES = {
  listening: ['dictation-game', 'tones-ear', 'cefr-listening'],
  reading: ['reading-comprehension', 'dialogue-order', 'cefr-reading'],
  grammar: ['complete-sentence', 'sov-game', 'translation-game', 'cefr-grammar'],
  vocabulary: ['time-race', 'pinyin-connection', 'find-intruder', 'global-exam', 'level-exam', 'lesson-exam', 'character-quiz'],
  speaking: ['pronunciation-practice', 'echo-speaking'],
};
const skillFor = activity => Object.keys(SKILL_ACTIVITIES).find(key => SKILL_ACTIVITIES[key].includes(activity));
const valid = s => s && typeof s.id === 'string' && skillFor(s.activity)
  && Number.isFinite(s.at) && Number.isFinite(s.correct) && Number.isFinite(s.total)
  && s.total > 0 && s.correct >= 0 && s.correct <= s.total;

export function loadSkillSessions() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILL_PROGRESS) || '[]');
    return Array.isArray(data) ? data.filter(valid).sort((a, b) => a.at - b.at).slice(-200) : [];
  } catch { return []; }
}

// A stable attempt id makes effect replay safe. Only bounded, plain error labels
// are retained; audio, recognized speech and entire content objects are omitted.
export function recordSkillSession({ id, activity, correct, total, score, mistakes = [], at = Date.now() }) {
  if (skillFor(activity) === 'speaking') {
    if (!Number.isFinite(score) || score < 0 || score > 100) return;
    correct = score; total = 100;
  }
  const session = { id, activity, correct, total, at };
  if (!valid(session)) return;
  session.errors = (Array.isArray(mistakes) ? mistakes : []).filter(Boolean).slice(0, 20).map(m => {
    if (Number.isInteger(m.tone) && Number.isInteger(m.chosenTone)) return `${m.chosenTone} → ${m.tone}`;
    return m.word?.char || m.sentenceItem?.sentence || '';
  }).filter(x => typeof x === 'string' && x.length).map(x => x.slice(0, 100));
  try {
    const sessions = loadSkillSessions().filter(s => s.id !== id);
    const serialized = JSON.stringify([...sessions, session].sort((a, b) => a.at - b.at).slice(-200));
    if (localStorage.getItem(STORAGE_KEYS.SKILL_PROGRESS) === serialized) return;
    localStorage.setItem(STORAGE_KEYS.SKILL_PROGRESS, serialized);
    bumpLocalDataRev();
    window.dispatchEvent(new CustomEvent('skill-progress-saved'));
  } catch { /* Storage unavailable: practice still works. */ }
}

export function summarizeSkill(skill, sessions, now = Date.now()) {
  const recent = sessions.filter(s => valid(s) && skillFor(s.activity) === skill && s.at <= now && s.at >= now - 30 * 86400000)
    .sort((a, b) => b.at - a.at);
  const total = recent.reduce((n, s) => n + s.total, 0);
  const correct = recent.reduce((n, s) => n + s.correct, 0);
  const activityStats = SKILL_ACTIVITIES[skill].map(activity => {
    const items = recent.filter(s => s.activity === activity);
    const count = items.reduce((n, s) => n + s.total, 0);
    const average = group => 100 * group.reduce((n, s) => n + s.correct, 0) / group.reduce((n, s) => n + s.total, 0);
    const trend = items.length >= 6 ? Math.round(average(items.slice(0, 3)) - average(items.slice(3, 6))) : null;
    return { activity, count, trend, pct: count ? Math.round(average(items)) : null };
  });
  const weakest = activityStats.filter(s => s.count >= (skill === 'speaking' ? 300 : 5)).sort((a, b) => a.pct - b.pct)[0];
  const errors = new Map();
  recent.forEach(s => (Array.isArray(s.errors) ? s.errors : []).forEach(e => {
    if (typeof e === 'string') errors.set(e, (errors.get(e) || 0) + 1);
  }));
  return {
    recent, total, correct, pct: total ? Math.round(100 * correct / total) : null,
    enough: recent.length >= 3 && total >= (skill === 'speaking' ? 300 : 20),
    activityStats, practice: weakest?.activity || SKILL_ACTIVITIES[skill][0],
    errors: [...errors].sort((a, b) => b[1] - a[1]).slice(0, 3),
  };
}

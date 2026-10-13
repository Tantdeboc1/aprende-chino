import { STORAGE_KEYS } from './storageKeys.js';
import { bumpLocalDataRev } from '@/hooks/useLocalSnapshot.js';

export function getLearningPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEARNING_PREFS) || '{}');
    return Object.fromEntries(['pinyin', 'translation'].map(key => [key, ['activity', 'always', 'tap'].includes(raw[key]) ? raw[key] : 'activity']));
  } catch { return { pinyin: 'activity', translation: 'activity' }; }
}
export function setLearningPrefs(patch) {
  const next = { ...getLearningPrefs(), ...patch };
  try { localStorage.setItem(STORAGE_KEYS.LEARNING_PREFS, JSON.stringify(next)); } catch { /* Optional preference. */ }
  bumpLocalDataRev();
  return getLearningPrefs();
}
export function aidInitiallyVisible(pref, defaultVisible) {
  return pref === 'always' || (pref === 'activity' && defaultVisible);
}

export function getMotionPref() {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.MOTION);
    return ['system', 'reduced', 'full'].includes(value) ? value : 'system';
  } catch { return 'system'; }
}
export function motionReduced() {
  const pref = getMotionPref();
  return pref === 'reduced' || (pref === 'system' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}
function applyMotion() {
  document.documentElement.classList.toggle('reduce-motion', motionReduced());
  document.documentElement.classList.toggle('motion-full', getMotionPref() === 'full');
}
export function setMotionPref(pref) {
  if (!['system', 'reduced', 'full'].includes(pref)) return;
  try { localStorage.setItem(STORAGE_KEYS.MOTION, pref); } catch { /* Apply to this session. */ }
  applyMotion(); bumpLocalDataRev();
}
export function initMotion() {
  applyMotion();
  const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  media?.addEventListener?.('change', () => { applyMotion(); bumpLocalDataRev(); });
}

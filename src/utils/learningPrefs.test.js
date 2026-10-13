import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { getLearningPrefs, setLearningPrefs, aidInitiallyVisible, getMotionPref, setMotionPref, motionReduced } from './learningPrefs.js';
import { getSyncStatus, recordSyncStatus } from './syncStatus.js';

beforeEach(() => { localStorage.clear(); vi.stubGlobal('matchMedia', () => ({ matches: true })); });
afterEach(() => { vi.unstubAllGlobals(); document.documentElement.classList.remove('reduce-motion', 'motion-full'); });
describe('learning preferences', () => {
  it('preserves activity defaults and persists reading choices independently', () => {
    expect(getLearningPrefs()).toEqual({ pinyin: 'activity', translation: 'activity' });
    setLearningPrefs({ pinyin: 'tap' });
    expect(getLearningPrefs()).toEqual({ pinyin: 'tap', translation: 'activity' });
    expect(aidInitiallyVisible('tap', true)).toBe(false);
    expect(aidInitiallyVisible('always', false)).toBe(true);
  });
  it('follows the device unless an explicit motion preference is selected', () => {
    expect(getMotionPref()).toBe('system');
    expect(motionReduced()).toBe(true);
    setMotionPref('full');
    expect(motionReduced()).toBe(false);
    expect(document.documentElement.classList.contains('motion-full')).toBe(true);
    setMotionPref('reduced');
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
  });
});
describe('sync status', () => {
  it('keeps the last successful save after a failure and isolates accounts', () => {
    recordSyncStatus('account-a', 'synced');
    const at = getSyncStatus('account-a').lastSuccess;
    recordSyncStatus('account-a', 'pending');
    expect(getSyncStatus('account-a')).toMatchObject({ status: 'pending', lastSuccess: at });
    expect(getSyncStatus('account-b')).toEqual({ status: 'unknown', lastSuccess: null });
  });
});

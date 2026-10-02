import { beforeEach, describe, expect, it } from 'vitest';
import { loadSkillSessions, recordSkillSession, summarizeSkill } from './skillProgress.js';
import { STORAGE_KEYS, SYNCED_EXTRA_KEYS } from './storageKeys.js';
import { buildBackup, restoreBackup } from './backup.js';

const now = 1800000000000;
const session = (id, correct = 8, total = 10, activity = 'time-race', at = now) => ({ id, correct, total, activity, at });
beforeEach(() => localStorage.clear());

describe('skill progress', () => {
  it('preserves best scores without inventing past attempts', () => {
    localStorage.setItem(STORAGE_KEYS.MINIGAME_SCORES, JSON.stringify({ 'time-race': { best: 100 } }));
    expect(loadSkillSessions()).toEqual([]);
    expect(summarizeSkill('vocabulary', [], now).pct).toBeNull();
  });
  it('weights answers, excludes old/future sessions and chooses the weakest supported activity', () => {
    const summary = summarizeSkill('vocabulary', [session('a', 1, 5), session('b', 90, 100, 'pinyin-connection'), session('old', 0, 100, 'time-race', now - 31 * 86400000), session('future', 0, 100, 'time-race', now + 1)], now);
    expect(summary.pct).toBe(87);
    expect(summary.total).toBe(105);
    expect(summary.practice).toBe('time-race');
    expect(summary.enough).toBe(false);
  });
  it('compares two groups of three attempts in the same activity only', () => {
    const sessions = Array.from({ length: 6 }, (_, i) => session(`${i}`, i < 3 ? 9 : 5, 10, 'time-race', now - i));
    sessions.push(session('other', 0, 100, 'pinyin-connection'));
    const data = summarizeSkill('vocabulary', sessions, now);
    expect(data.activityStats.find(a => a.activity === 'time-race').trend).toBe(40);
    expect(data.activityStats.find(a => a.activity === 'pinyin-connection').trend).toBeNull();
  });
  it('deduplicates attempt ids and retains at most 200 sessions', () => {
    for (let i = 0; i < 205; i++) recordSkillSession(session(`${i}`));
    recordSkillSession(session('204', 9));
    const sessions = loadSkillSessions();
    expect(sessions).toHaveLength(200);
    expect(sessions[0].id).toBe('5');
    expect(sessions.at(-1).correct).toBe(9);
  });
  it('rejects invalid measurements and survives malformed storage', () => {
    for (const data of [session('x', 11), session('x', -1), session('x', 0, 0), session('x', Infinity), session('x', 5, 10, 'unknown')]) recordSkillSession(data);
    expect(loadSkillSessions()).toEqual([]);
    localStorage.setItem(STORAGE_KEYS.SKILL_PROGRESS, '{broken');
    expect(loadSkillSessions()).toEqual([]);
    localStorage.setItem(STORAGE_KEYS.SKILL_PROGRESS, '{}');
    expect(loadSkillSessions()).toEqual([]);
  });
  it('stores speech recognition separately and limits error data to teaching labels', () => {
    recordSkillSession({ id: 'voice', activity: 'echo-speaking', score: 75, at: now });
    recordSkillSession({ ...session('tone', 2, 5, 'tones-ear'), mistakes: [{ tone: 3, chosenTone: 2, transcript: 'private' }, { word: { char: '水', meaning: 'water' } }] });
    const sessions = loadSkillSessions();
    expect(summarizeSkill('speaking', sessions, now).pct).toBe(75);
    expect(summarizeSkill('listening', sessions, now).errors).toEqual([['2 → 3', 1], ['水', 1]]);
    expect(JSON.stringify(sessions)).not.toContain('private');
    expect(JSON.stringify(sessions)).not.toContain('water');
  });
  it('includes the history in synced user data and backup round trips', () => {
    expect(SYNCED_EXTRA_KEYS).toContain(STORAGE_KEYS.SKILL_PROGRESS);
    recordSkillSession(session('backup'));
    const backup = buildBackup();
    localStorage.clear();
    restoreBackup(JSON.stringify(backup));
    expect(loadSkillSessions()[0].id).toBe('backup');
  });
});

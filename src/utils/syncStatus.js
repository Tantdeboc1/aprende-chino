import { STORAGE_KEYS } from './storageKeys.js';
import { bumpLocalDataRev } from '@/hooks/useLocalSnapshot.js';

export function getSyncStatus(uid) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.SYNC_STATUS) || '{}');
    return uid && stored.uid === uid ? stored : { status: 'unknown', lastSuccess: null };
  } catch { return { status: 'unknown', lastSuccess: null }; }
}
export function recordSyncStatus(uid, status) {
  const previous = getSyncStatus(uid);
  const next = { uid, status, lastSuccess: status === 'synced' ? Date.now() : previous.lastSuccess };
  try { localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(next)); } catch { /* Display remains usable. */ }
  bumpLocalDataRev();
}

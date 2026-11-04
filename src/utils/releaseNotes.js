import { assetUrl } from './assets.js';

// Se consulta la última publicación, no el JS que todavía está en memoria.
// El archivo queda fuera del precache y del runtime cache de /data/.
export async function loadReleaseNotes(lang) {
  const response = await fetch(assetUrl(`release-notes.json?t=${Date.now()}`), { cache: 'no-store' });
  if (!response.ok) throw new Error('Release notes unavailable');
  const data = await response.json();
  const baseLanguage = (lang || 'en').split('-')[0];
  const selected = data?.notes?.[baseLanguage] || data?.notes?.en;
  if (typeof data?.version !== 'string' || !Array.isArray(selected) || !selected.length ||
      !selected.every(item => typeof item === 'string' && item.trim())) {
    throw new Error('Invalid release notes');
  }
  return { version: data.version, notes: selected };
}

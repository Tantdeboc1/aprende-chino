// src/utils/dataCache.js
// Caché en localStorage para los JSON estáticos del arranque (libro-data,
// radicals-data). Solo cambian entre releases, así que se invalidan por
// APP_VERSION: al subir versión, la primera visita refresca la caché.
import { APP_VERSION } from './version.js';
import { STORAGE_KEYS } from './storageKeys.js';

const PREFIX = STORAGE_KEYS.DATACACHE_PREFIX;

function readCache(name) {
  try {
    const raw = localStorage.getItem(PREFIX + name);
    if (!raw) return null;
    const { v, data } = JSON.parse(raw);
    return v === APP_VERSION ? data : null;
  } catch {
    return null;
  }
}

function writeCache(name, data) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify({ v: APP_VERSION, data }));
  } catch {
    // localStorage lleno o bloqueado: la app funciona igual, solo sin caché.
  }
}

// fetch + JSON con caché versionada. Si hay hit, no toca la red.
export async function fetchJsonCached(name, url) {
  const cached = readCache(name);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
  const data = await res.json();
  writeCache(name, data);
  return data;
}

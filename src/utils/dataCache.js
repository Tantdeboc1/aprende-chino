// src/utils/dataCache.js
// Caché de los JSON estáticos del arranque (libro-data, radicals-data) usando la
// Cache API en vez de localStorage:
//   - asíncrona y fuera del hilo principal (localStorage es síncrono y bloquea),
//   - sin el límite de ~5 MB de localStorage,
//   - se guarda la Response tal cual (no hay que serializar/re-parsear a mano).
// Se invalida por APP_VERSION: el nombre de la caché lleva la versión, así al
// subir release la primera visita usa una caché nueva y las viejas se borran.
import { APP_VERSION } from './version.js';
import { STORAGE_KEYS } from './storageKeys.js';

const CACHE_PREFIX = 'aprende-chino-data-';
const CACHE_NAME = `${CACHE_PREFIX}${APP_VERSION}`;
const LEGACY_PREFIX = STORAGE_KEYS.DATACACHE_PREFIX; // caché anterior en localStorage

const hasCacheApi = typeof caches !== 'undefined';

// Borra cachés de versiones anteriores y los restos del antiguo caché en
// localStorage (migración desde la implementación previa). En segundo plano.
async function cleanup() {
  try {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME)
        .map((n) => caches.delete(n)),
    );
  } catch { /* noop */ }
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith(LEGACY_PREFIX)) localStorage.removeItem(k);
    }
  } catch { /* noop */ }
}

// fetch + JSON con caché versionada. Si hay hit, no toca la red.
// `name` se conserva por compatibilidad con las llamadas; la clave real es la URL.
export async function fetchJsonCached(name, url) {
  if (!hasCacheApi) {
    // Navegador sin Cache API (o contexto no seguro): fetch directo. En prod el
    // service worker ya cachea estos JSON a nivel de red.
    const res = await fetch(url);
    if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
    return res.json();
  }

  let cache;
  try {
    cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url);
    if (cached) return cached.json();
  } catch { /* si falla la caché, seguimos con la red */ }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
  // Clonamos porque el body de una Response solo se consume una vez.
  if (cache) {
    try { await cache.put(url, res.clone()); } catch { /* cuota/opaque: seguir */ }
    cleanup(); // no await: limpieza de versiones viejas en segundo plano
  }
  return res.json();
}

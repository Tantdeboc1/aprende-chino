// src/data/provinces/loader.js
// Carga dinámica de los textos de provincias por idioma. Solo se descarga el
// chunk del idioma activo (~5 kB gzip) en lugar de los 6 idiomas juntos.
// Los datos neutros (id, cn, pinyin, población) van aparte en base.js (estático).
import { withChunkRetry } from '@/utils/lazyWithRetry.js';

const loaders = {
  es: () => import('./es.js'),
  en: () => import('./en.js'),
  fr: () => import('./fr.js'),
  de: () => import('./de.js'),
  it: () => import('./it.js'),
  pt: () => import('./pt.js'),
};

const cache = new Map();

/**
 * Devuelve los textos de provincias del idioma indicado.
 * @param {string} lang  Código de idioma (es/en/fr/de/it/pt; admite 'es-ES').
 * @returns {Promise<Record<string, {name,capital,region,gastronomia,dialectos,turismo}>>}
 */
export async function loadProvinces(lang) {
  const base = String(lang || '').split('-')[0];
  if (cache.has(base)) return cache.get(base);
  const pick = loaders[base] || loaders.en || loaders.es;
  const mod = await withChunkRetry(pick)();
  cache.set(base, mod.default);
  return mod.default;
}

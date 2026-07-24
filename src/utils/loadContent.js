// src/utils/loadContent.js
// Carga dinámica de los datos de Gramática y Cultura por idioma.
//
// Los archivos en src/data/grammar/{lang}.js y src/data/cultural/{lang}.js
// son auto-generados por scripts/split-i18n-data.mjs a partir de los archivos
// multi-idioma. El cliente solo descarga el chunk del idioma activo.
//
// Vite produce un chunk separado por cada `import('./grammar/xx.js')`.
import { withChunkRetry } from './lazyWithRetry.js';

// Mapa de loaders. Definir las claves explícitamente permite a Vite generar
// un chunk por idioma con nombre estable.
const grammarLoaders = {
  es: () => import('@/data/grammar/es.js'),
  en: () => import('@/data/grammar/en.js'),
  fr: () => import('@/data/grammar/fr.js'),
  de: () => import('@/data/grammar/de.js'),
  it: () => import('@/data/grammar/it.js'),
  pt: () => import('@/data/grammar/pt.js'),
};

const culturalLoaders = {
  es: () => import('@/data/cultural/es.js'),
  en: () => import('@/data/cultural/en.js'),
  fr: () => import('@/data/cultural/fr.js'),
  de: () => import('@/data/cultural/de.js'),
  it: () => import('@/data/cultural/it.js'),
  pt: () => import('@/data/cultural/pt.js'),
};

const readingLoaders = {
  es: () => import('@/data/reading/es.js'),
  en: () => import('@/data/reading/en.js'),
  fr: () => import('@/data/reading/fr.js'),
  de: () => import('@/data/reading/de.js'),
  it: () => import('@/data/reading/it.js'),
  pt: () => import('@/data/reading/pt.js'),
};

const phrasesLoaders = {
  es: () => import('@/data/phrases/es.js'),
  en: () => import('@/data/phrases/en.js'),
  fr: () => import('@/data/phrases/fr.js'),
  de: () => import('@/data/phrases/de.js'),
  it: () => import('@/data/phrases/it.js'),
  pt: () => import('@/data/phrases/pt.js'),
};

// Caché en memoria para no re-descargar el mismo idioma varias veces.
const grammarCache = new Map();
const culturalCache = new Map();
const readingCache = new Map();
const phrasesCache = new Map();

function pickLoader(loaders, lang) {
  // Normaliza códigos regionales ('es-ES' → 'es'): sin esto, un locale
  // regional no encontraba su loader y caía al fallback en inglés.
  const base = String(lang || '').split('-')[0];
  return loaders[base] || loaders.en || loaders.es;
}

/**
 * Devuelve los datos de gramática del idioma indicado.
 * @param {string} lang  Código de idioma (es/en/fr/de/it/pt)
 * @returns {Promise<object>}  Mapa lessonNum → { intro, patterns, structures, tip }
 */
export async function loadGrammarData(lang) {
  if (grammarCache.has(lang)) return grammarCache.get(lang);
  const mod = await withChunkRetry(pickLoader(grammarLoaders, lang))();
  grammarCache.set(lang, mod.default);
  return mod.default;
}

/**
 * Devuelve los datos culturales del idioma indicado.
 * @param {string} lang
 * @returns {Promise<object>}  Mapa lessonNum → [ { id, emoji, title, content } ]
 */
export async function loadCulturalData(lang) {
  if (culturalCache.has(lang)) return culturalCache.get(lang);
  const mod = await withChunkRetry(pickLoader(culturalLoaders, lang))();
  culturalCache.set(lang, mod.default);
  return mod.default;
}

/**
 * Devuelve las historias de comprensión lectora del idioma indicado.
 * @param {string} lang
 * @returns {Promise<Array>}  Array de historias (textos ya resueltos al idioma)
 */
export async function loadReadingStories(lang) {
  if (readingCache.has(lang)) return readingCache.get(lang);
  const mod = await withChunkRetry(pickLoader(readingLoaders, lang))();
  readingCache.set(lang, mod.default);
  return mod.default;
}

/**
 * Devuelve las frases de traducción/pronunciación del idioma indicado.
 * @param {string} lang
 * @returns {Promise<Array>}  Array de frases ({ id, lesson, hanzi, pinyin, translations: string })
 */
export async function loadTranslationPhrases(lang) {
  if (phrasesCache.has(lang)) return phrasesCache.get(lang);
  const mod = await withChunkRetry(pickLoader(phrasesLoaders, lang))();
  phrasesCache.set(lang, mod.default);
  return mod.default;
}

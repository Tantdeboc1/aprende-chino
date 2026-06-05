// src/utils/i18nContent.js
// Helper para campos de contenido multi-idioma en data estática.
//
// Formato esperado de un campo "traducible":
//   { es: "...", en: "...", fr: "...", de: "...", it: "...", pt: "..." }
//
// Si el valor es un string suelto, se asume que está en español (compatible con
// data "vieja" en proceso de migración).
//
// Fallback: si falta el idioma actual, intenta EN, luego ES, luego cualquier
// otro idioma disponible. Nunca devuelve undefined.

const PREFERRED_FALLBACKS = ['en', 'es'];

/**
 * Devuelve la traducción adecuada de `value` según `lang`.
 * @param {string|object|undefined|null} value
 * @param {string} lang  Código de idioma (es, en, fr, de, it, pt...)
 * @returns {string}
 */
export function tr(value, lang) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return String(value);

  // Coincidencia exacta
  if (value[lang]) return value[lang];

  // Fallbacks preferidos
  for (const fb of PREFERRED_FALLBACKS) {
    if (fb !== lang && value[fb]) return value[fb];
  }

  // Cualquier idioma disponible
  for (const k of Object.keys(value)) {
    if (typeof value[k] === 'string' && value[k]) return value[k];
  }

  return '';
}

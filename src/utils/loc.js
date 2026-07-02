// src/utils/loc.js
// Resuelve un campo localizable: puede ser un string neutro (p. ej. hanzi,
// o texto ya resuelto por scripts/split-i18n-data.mjs) o un objeto
// { es, en, it, fr, de, pt }. Cae a inglés y luego a español si falta el idioma.
export function loc(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.en || value.es || Object.values(value)[0] || '';
}

// Normaliza un código de idioma a su base: 'es-ES' → 'es', 'pt-BR' → 'pt'.
// i18next puede mantener el código regional en i18n.language (con
// nonExplicitSupportedLngs), pero nuestros mapas de contenido y loaders
// están indexados por código base. Indexar con el regional hacía caer al
// fallback (inglés o español) aunque el idioma estuviera traducido.
export function baseLang(lng, fallback = 'es') {
  return String(lng || fallback).split('-')[0] || fallback;
}

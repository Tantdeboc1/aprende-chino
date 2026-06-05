// scripts/split-i18n-data.mjs
// Lee grammarData.js y culturalData.js (con campos `{es,en,fr,de,it,pt}`)
// y genera 12 archivos: src/data/grammar/{lang}.js y src/data/cultural/{lang}.js
// con strings planos del idioma correspondiente.
//
// Sirve para que el cliente solo descargue el idioma actual.
//
// Ejecutar:  node scripts/split-i18n-data.mjs

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const LANGS = ['es', 'en', 'fr', 'de', 'it', 'pt'];

/**
 * Devuelve true si el valor parece un objeto multilang { es, en, ... }
 * (tiene como mínimo `es` y `en` y todos los valores son string).
 */
function isMultilang(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const keys = Object.keys(v);
  if (!keys.includes('es') || !keys.includes('en')) return false;
  return keys.every(k => typeof v[k] === 'string');
}

/**
 * Recorre el árbol y reemplaza cada objeto multilang por el string del idioma
 * indicado. Devuelve una copia limpia.
 */
function resolveLang(value, lang) {
  if (isMultilang(value)) {
    return value[lang] ?? value.es ?? value.en ?? '';
  }
  if (Array.isArray(value)) return value.map(v => resolveLang(v, lang));
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) out[k] = resolveLang(value[k], lang);
    return out;
  }
  return value;
}

/**
 * Convierte un objeto JS a literal de JS legible (similar a JSON pero sin
 * comillas en las claves cuando son identificadores válidos).
 */
function toJs(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const padIn = '  '.repeat(indent + 1);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') {
    // escapado seguro: usamos JSON.stringify y luego "des-escapamos" los chars
    // que son seguros en JS pero JSON escapa innecesariamente.
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return '[\n' + value.map(v => padIn + toJs(v, indent + 1)).join(',\n') + '\n' + pad + ']';
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    return '{\n' + keys.map(k => {
      const keyStr = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
      return padIn + keyStr + ': ' + toJs(value[k], indent + 1);
    }).join(',\n') + '\n' + pad + '}';
  }
  return JSON.stringify(value);
}

async function writeLangFiles(name, sourceData) {
  const outDir = join(ROOT, 'src', 'data', name);
  await mkdir(outDir, { recursive: true });
  for (const lang of LANGS) {
    const resolved = resolveLang(sourceData, lang);
    const body = `// src/data/${name}/${lang}.js
// AUTO-GENERADO por scripts/split-i18n-data.mjs — no editar a mano.
// Fuente: src/data/${name}Data.js (estructura multilingüe).
//
// Este archivo solo contiene los textos en ${lang}. El loader dinámico carga
// el archivo del idioma activo para minimizar el chunk descargado por el cliente.

const data = ${toJs(resolved, 0)};

export default data;
`;
    await writeFile(join(outDir, `${lang}.js`), body, 'utf8');
    process.stdout.write(`  ✓ ${name}/${lang}.js\n`);
  }
}

async function main() {
  // Importa los datos. Como los archivos están en ESM, dynamic import los carga
  // con T() ya evaluado a objetos {es, en, ...}.
  const grammarMod = await import(pathToFileURL(join(ROOT, 'src', 'data', 'grammarData.js')).href);
  const culturalMod = await import(pathToFileURL(join(ROOT, 'src', 'data', 'culturalData.js')).href);

  console.log('Generando archivos por idioma…');
  await writeLangFiles('grammar', grammarMod.default);
  await writeLangFiles('cultural', culturalMod.default);
  console.log('Listo. 12 archivos generados.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

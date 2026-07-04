// scripts/china-map/split-provinces.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Parte la fuente multilingüe src/data/provinces.source.js en:
//   · src/data/provinces/base.js        → datos neutros (id, cn, pinyin, poblacion)
//   · src/data/provinces/{lang}.js      → textos ya resueltos por idioma
//
//   node scripts/china-map/split-provinces.mjs
//
// Así el cliente solo descarga el idioma activo (el resto se carga en demanda),
// en lugar de los 6 idiomas inline. Mismo patrón que src/data/cultural/.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';

const SRC = new URL('../../src/data/provinces.source.js', import.meta.url);
const OUT_DIR = new URL('../../src/data/provinces/', import.meta.url);

const { PROVINCES, loc } = await import(SRC);
const LANGS = ['es', 'en', 'fr', 'de', 'it', 'pt'];

fs.mkdirSync(OUT_DIR, { recursive: true });

// base.js — orden y datos neutros al idioma.
const base = PROVINCES.map((p) => ({ id: p.id, cn: p.cn, pinyin: p.pinyin, poblacion: p.poblacion }));
fs.writeFileSync(
  new URL('./base.js', OUT_DIR),
  `// src/data/provinces/base.js
// AUTO-GENERADO por scripts/china-map/split-provinces.mjs — no editar a mano.
export const PROVINCE_BASE = ${JSON.stringify(base, null, 0)};
`,
  'utf8',
);

// {lang}.js — textos resueltos.
for (const lang of LANGS) {
  const obj = {};
  for (const p of PROVINCES) {
    obj[p.id] = {
      name: loc(p.name, lang),
      capital: loc(p.capital, lang),
      region: loc(p.region, lang),
      gastronomia: loc(p.gastronomia, lang),
      dialectos: loc(p.dialectos, lang),
      turismo: loc(p.turismo, lang),
    };
  }
  fs.writeFileSync(
    new URL(`./${lang}.js`, OUT_DIR),
    `// src/data/provinces/${lang}.js
// AUTO-GENERADO por scripts/china-map/split-provinces.mjs — no editar a mano.
export default ${JSON.stringify(obj)};
`,
    'utf8',
  );
}

console.log('OK: base +', LANGS.length, 'idiomas ×', PROVINCES.length, 'provincias');

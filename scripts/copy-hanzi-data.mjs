// scripts/copy-hanzi-data.mjs
// Auto-aloja los datos de trazos de HanziWriter.
//
// HanziWriter, por defecto, descarga cada carácter desde cdn.jsdelivr.net en
// tiempo de ejecución (no funciona offline y depende de un tercero). Este
// script copia desde el paquete `hanzi-writer-data` SOLO los caracteres que la
// app usa de verdad a public/hanzi-data/, para servirlos desde nuestro dominio.
//
// El conjunto se obtiene escaneando todo el código y los datos (src/ y
// public/data/) en busca de caracteres Han: es un superconjunto seguro de
// cualquier carácter que la app pueda llegar a animar (vocabulario, radicales,
// historias, el 学 del splash, etc.).
//
// Salida (public/hanzi-data/) está gitignorada: la regenera predev/prebuild,
// igual que scripts/split-i18n-data.mjs.
//
// Ejecutar:  node scripts/copy-hanzi-data.mjs

import { readdir, readFile, mkdir, copyFile, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_PKG = join(ROOT, 'node_modules', 'hanzi-writer-data');
const OUT_DIR = join(ROOT, 'public', 'hanzi-data');

// Rangos Unicode con datos de trazos en hanzi-writer-data:
//   U+2E80–U+2EFF  CJK Radicals Supplement (radicales como ⺗ ⺼)
//   U+2F00–U+2FDF  Kangxi Radicals
//   U+3400–U+4DBF  CJK Unified Ideographs Extension A
//   U+4E00–U+9FFF  CJK Unified Ideographs (HSK-1/2 y la mayoría)
// Incluir los bloques de radicales es CLAVE: la app anima radicales que viven
// fuera del rango común y, si no se copiaran, darían 404 (antes los servía el CDN).
const HAN_RE = /[⺀-⻿⼀-⿟㐀-䶿一-鿿]/g;
const SCAN_EXT = new Set(['.js', '.jsx', '.json']);
const SCAN_DIRS = [join(ROOT, 'src'), join(ROOT, 'public', 'data')];

async function collectChars(dir, chars) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'hanzi-data') continue;
      await collectChars(p, chars);
    } else if (SCAN_EXT.has(extname(e.name))) {
      const content = await readFile(p, 'utf8');
      const matches = content.match(HAN_RE);
      if (matches) for (const c of matches) chars.add(c);
    }
  }
}

async function main() {
  if (!existsSync(SRC_PKG)) {
    console.error('[copy-hanzi-data] Falta el paquete hanzi-writer-data. Ejecuta `npm install`.');
    process.exit(1);
  }

  const chars = new Set();
  for (const dir of SCAN_DIRS) await collectChars(dir, chars);

  // Empezamos limpio para no dejar caracteres obsoletos de builds anteriores.
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  let copied = 0, missing = 0, bytes = 0;
  for (const c of chars) {
    const from = join(SRC_PKG, `${c}.json`);
    if (!existsSync(from)) { missing++; continue; }
    const to = join(OUT_DIR, `${c}.json`);
    await copyFile(from, to);
    bytes += (await stat(to)).size;
    copied++;
  }

  console.log(
    `[copy-hanzi-data] ${copied} caracteres copiados ` +
    `(${(bytes / 1024 / 1024).toFixed(1)} MB), ${missing} sin datos de trazos.`,
  );
}

main().catch((e) => { console.error('[copy-hanzi-data]', e); process.exit(1); });

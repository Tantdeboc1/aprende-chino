// scripts/convert-audio.mjs
// Convierte en masa los mp3 de pronunciación a un códec más ligero.
//
// REQUIERE ffmpeg en el PATH (https://ffmpeg.org/download.html).
//
// Uso:
//   node scripts/convert-audio.mjs            # Opus 32k mono (recomendado)
//   node scripts/convert-audio.mjs --aac      # AAC 48k mono (compat. máxima)
//   node scripts/convert-audio.mjs --keep-mp3 # no borrar los .mp3 originales
//
// ── Por qué Opus y no AAC ──────────────────────────────────────────────────
// Son clips de voz cortos a bitrate bajo. Opus es el mejor códec para voz a
// bitrates bajos con diferencia: a 32 kbps mono suena transparente y deja los
// ~35 MB en ~8-10 MB. AAC necesita ~48-64 kbps para algo parecido (~15 MB).
// Soporte de navegador (2026): Opus en .opus/.webm va en todos los modernos
// (Chrome, Firefox, Edge, Safari 11+). Si necesitas soportar Safari muy viejo
// o WebViews antiguos, usa --aac (.m4a, soporte universal).
//
// ── Recableado tras convertir ──────────────────────────────────────────────
// 1. En src/utils/audio.js, el candidato se construye como
//      `audio/${category}/${name}.mp3`
//    Cambia la extensión a '.opus' (o '.m4a' si usaste --aac). Idealmente
//    extrae la extensión a una constante AUDIO_EXT para tenerla en un sitio.
// 2. El runtime cache del service worker ya casa por ruta /audio/ (sin filtrar
//    extensión), así que no hay que tocar vite.config.js.
// 3. Borra el manifest.txt viejo si lista extensiones .mp3.

import { readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Usa el binario de ffmpeg-static (devDependency) si está; si no, el del PATH.
let FFMPEG = 'ffmpeg';
try { FFMPEG = (await import('ffmpeg-static')).default || 'ffmpeg'; } catch { /* usa PATH */ }

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public', 'audio');
const useAac = process.argv.includes('--aac');
const keepMp3 = process.argv.includes('--keep-mp3');

const EXT = useAac ? 'm4a' : 'opus';
// Argumentos de ffmpeg por códec (mono, bitrate bajo orientado a voz).
const codecArgs = useAac
  ? ['-c:a', 'aac', '-b:a', '48k', '-ac', '1']
  : ['-c:a', 'libopus', '-b:a', '32k', '-ac', '1', '-application', 'voip'];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (extname(full).toLowerCase() === '.mp3') out.push(full);
  }
  return out;
}

function ensureFfmpeg() {
  try { execFileSync(FFMPEG, ['-version'], { stdio: 'ignore' }); }
  catch { console.error('✗ ffmpeg no está en el PATH. Instálalo primero.'); process.exit(1); }
}

ensureFfmpeg();
const files = walk(ROOT);
console.log(`Convirtiendo ${files.length} archivos a ${EXT.toUpperCase()}…`);

let before = 0, after = 0, done = 0;
for (const mp3 of files) {
  const out = mp3.replace(/\.mp3$/i, `.${EXT}`);
  before += statSync(mp3).size;
  try {
    execFileSync(FFMPEG, ['-y', '-i', mp3, ...codecArgs, out], { stdio: 'ignore' });
    after += statSync(out).size;
    if (!keepMp3) unlinkSync(mp3);
    if (++done % 100 === 0) console.log(`  ${done}/${files.length}`);
  } catch (e) {
    console.warn(`  ✗ falló ${mp3}: ${e.message}`);
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`\n✓ Hecho. ${mb(before)} MB → ${mb(after)} MB (${Math.round((1 - after / before) * 100)}% menos).`);
if (!keepMp3) console.log('  Originales .mp3 borrados. Recuerda cambiar la extensión en src/utils/audio.js.');

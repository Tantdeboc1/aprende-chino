// Convierte PNGs a WebP en las carpetas de Story Mode:
//   - src/assets/avatares/story/  (bustos de personajes)
//   - src/assets/fondos/story/    (fondos de escena por historia)
//
// Para FONDOS: además recorta el % inferior configurado (cropBottomPct)
// para eliminar marcas de agua de IA (ej. sparkle de Gemini en esquina inferior).
// En la app el cuadro de diálogo tapa esa zona, así que el recorte es invisible.
//
// Uso: node scripts/convert-story-avatars.mjs
// El script borra el PNG original tras convertir.
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, parse } from 'node:path';

const DIRS = [
  {
    path: 'src/assets/avatares/story/',
    label: 'AVATARES STORY',
    quality: 85,
    cropBottomPct: 0, // bustos: no recortar
  },
  {
    path: 'src/assets/avatares/avatares_HD/',
    label: 'AVATARES PERFIL 1',
    quality: 85,
    cropBottomPct: 0,
  },
  {
    path: 'src/assets/avatares/avatares2_HD/',
    label: 'AVATARES PERFIL 2',
    quality: 85,
    cropBottomPct: 0,
  },
  {
    path: 'src/assets/fondos/story/',
    label: 'FONDOS',
    quality: 85,
    cropBottomPct: 10, // recorta 10% inferior para quitar marca de Gemini con margen
    sharpen: true,     // realce ligero para mantener nitidez tras compresión webp
  },
];

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\//, '');

async function processDir({ path, label, quality, cropBottomPct, sharpen = false }) {
  const dir = join(ROOT, path);
  let files;
  try { files = (await readdir(dir)).filter(f => f.toLowerCase().endsWith('.png')); }
  catch { console.log(`(${label}) carpeta no existe: ${dir} — saltando`); return; }

  if (files.length === 0) { console.log(`(${label}) sin PNGs en ${path}`); return; }

  console.log(`\n=== ${label} === (${files.length} PNGs, q=${quality}${cropBottomPct ? `, crop -${cropBottomPct}% inferior` : ''})`);
  let totalBefore = 0, totalAfter = 0;
  for (const file of files) {
    const inPath = join(dir, file);
    const outPath = join(dir, parse(file).name + '.webp');
    const before = (await stat(inPath)).size;

    let img = sharp(inPath);

    if (cropBottomPct > 0) {
      const meta = await img.metadata();
      const newHeight = Math.round(meta.height * (1 - cropBottomPct / 100));
      img = img.extract({ left: 0, top: 0, width: meta.width, height: newHeight });
      console.log(`  ${file.padEnd(20)} ${meta.width}×${meta.height} → ${meta.width}×${newHeight}`);
    }

    if (sharpen) img = img.sharpen({ sigma: 0.6 });
    await img.webp({ quality, effort: 6 }).toFile(outPath);
    const after = (await stat(outPath)).size;
    totalBefore += before;
    totalAfter += after;
    const pct = ((1 - after / before) * 100).toFixed(0);
    console.log(`  ${file.padEnd(20)} ${(before/1024).toFixed(0).padStart(5)} KB → ${(after/1024).toFixed(0).padStart(5)} KB  (-${pct}%)`);
    await unlink(inPath); // borra el PNG original
  }
  console.log(`  TOTAL: ${(totalBefore/1024).toFixed(0)} KB → ${(totalAfter/1024).toFixed(0)} KB  (-${((1-totalAfter/totalBefore)*100).toFixed(0)}%)`);
}

for (const d of DIRS) await processDir(d);
console.log('\nListo.');

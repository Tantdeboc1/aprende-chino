// scripts/convert-png-to-webp.mjs
// Convierte todos los .png de una carpeta a .webp usando sharp.
// Los WebP rondan 85-95% más pequeños con calidad equivalente.
//
// Uso:  node scripts/convert-png-to-webp.mjs <carpeta>
// Ejemplo:  node scripts/convert-png-to-webp.mjs src/assets/avatares/avatares3_HD
//
// Tras convertir, el script imprime un resumen y deja los .png originales
// en su sitio (por si quieres comparar). Bórralos manualmente cuando confirmes.

import { readdir, stat } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import sharp from 'sharp';

const dir = process.argv[2];
if (!dir) {
  console.error('Falta el argumento de carpeta. Ej: node scripts/convert-png-to-webp.mjs src/assets/avatares/avatares3_HD');
  process.exit(1);
}

async function main() {
  const files = (await readdir(dir)).filter(f => f.toLowerCase().endsWith('.png'));
  if (files.length === 0) {
    console.log('No hay archivos .png en', dir);
    return;
  }

  let totalIn = 0;
  let totalOut = 0;
  const results = [];

  for (const file of files) {
    const inPath = join(dir, file);
    const outPath = join(dir, basename(file, extname(file)) + '.webp');

    const inSize = (await stat(inPath)).size;
    // quality 82 es un buen punto medio para retrato/avatar: muy poca pérdida visible.
    await sharp(inPath).webp({ quality: 82, effort: 5 }).toFile(outPath);
    const outSize = (await stat(outPath)).size;

    totalIn += inSize;
    totalOut += outSize;

    const ratio = Math.round((1 - outSize / inSize) * 100);
    results.push({ file, inSize, outSize, ratio });
  }

  console.log('\nConversión completada:');
  for (const r of results) {
    const kbIn = (r.inSize / 1024).toFixed(1);
    const kbOut = (r.outSize / 1024).toFixed(1);
    console.log(`  ${r.file.padEnd(20)} ${kbIn.padStart(7)} kB → ${kbOut.padStart(6)} kB  (-${r.ratio}%)`);
  }
  const totalRatio = Math.round((1 - totalOut / totalIn) * 100);
  console.log(`  ${'TOTAL'.padEnd(20)} ${(totalIn / 1024).toFixed(1).padStart(7)} kB → ${(totalOut / 1024).toFixed(1).padStart(6)} kB  (-${totalRatio}%)`);
  console.log('\nLos PNG originales NO se han borrado. Bórralos manualmente cuando verifiques que los WebP se ven bien.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

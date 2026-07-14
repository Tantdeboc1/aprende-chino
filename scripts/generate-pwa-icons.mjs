// scripts/generate-pwa-icons.mjs
// Genera los iconos PWA (192/512 + maskable 192/512) a partir del icono maestro
// diseñado `design/icono-clean.png` (路 dorado sobre jade con patrón, marca
// HanyuPath). El maestro vive FUERA de public/ para que no se envíe ni se
// precachee (pesa ~428 kB). Ejecutar cuando cambie el icono:
//   node scripts/generate-pwa-icons.mjs
//
// - normal (purpose "any"): el maestro tal cual (tiene esquinas redondeadas y
//   transparencia), solo reescalado.
// - maskable: Android recorta a círculo/squircle, así que necesita ir A SANGRE
//   sin transparencia. Rellenamos las esquinas transparentes con el mismo jade
//   del fondo del icono para que no se vea el recorte.
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const MASTER = path.join(root, 'design', 'icono-clean.png');
if (!existsSync(MASTER)) {
  console.error('Falta design/icono-clean.png (icono maestro).');
  process.exit(1);
}

// Jade del fondo del propio icono (muestreado) — relleno de esquinas en maskable.
const BG = { r: 72, g: 117, b: 88 };

const jobs = [
  { file: 'icon-192.png',          size: 192, maskable: false },
  { file: 'icon-512.png',          size: 512, maskable: false },
  { file: 'icon-maskable-192.png', size: 192, maskable: true  },
  { file: 'icon-maskable-512.png', size: 512, maskable: true  },
];

for (const { file, size, maskable } of jobs) {
  let img = sharp(MASTER).resize(size, size, { fit: 'cover' });
  // maskable: aplanamos sobre el jade del icono → rellena las esquinas
  // transparentes y queda a sangre completa (sin canal alfa).
  if (maskable) img = img.flatten({ background: BG });
  await img.png().toFile(path.join(outDir, file));
  console.log(`  ✓ icons/${file}`);
}
console.log('Iconos PWA generados desde icono-clean.png.');

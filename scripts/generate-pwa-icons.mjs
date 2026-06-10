// scripts/generate-pwa-icons.mjs
// Genera los iconos PWA (192/512 + maskable) a partir de un SVG inline:
// el logo 学 en butter sobre el jade de la marca. Ejecutar manualmente
// cuando cambie el diseño: node scripts/generate-pwa-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'icons');
mkdirSync(outDir, { recursive: true });

const JADE = '#2f6b4a';
const BUTTER = '#f0c862';

// rounded: esquinas redondeadas (icono normal). Para maskable el sistema
// recorta la forma, así que va a sangre completa y el glifo más pequeño
// (zona segura del 80 %).
function logoSvg(size, { rounded, glyphRatio }) {
  const radius = rounded ? Math.round(size * 0.22) : 0;
  const fontSize = Math.round(size * glyphRatio);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${JADE}"/>
  <text x="50%" y="50%" dy="${Math.round(fontSize * 0.36)}"
    text-anchor="middle" fill="${BUTTER}" font-size="${fontSize}" font-weight="700"
    font-family="Noto Sans SC, Microsoft YaHei, PingFang SC, SimHei, sans-serif">学</text>
</svg>`);
}

const jobs = [
  { file: 'icon-192.png',          size: 192, rounded: true,  glyphRatio: 0.58 },
  { file: 'icon-512.png',          size: 512, rounded: true,  glyphRatio: 0.58 },
  { file: 'icon-maskable-512.png', size: 512, rounded: false, glyphRatio: 0.46 },
];

for (const { file, size, rounded, glyphRatio } of jobs) {
  await sharp(logoSvg(size, { rounded, glyphRatio }))
    .png()
    .toFile(path.join(outDir, file));
  console.log(`  ✓ icons/${file}`);
}
console.log('Iconos PWA generados.');

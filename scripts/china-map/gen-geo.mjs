// scripts/china-map/gen-geo.mjs
// ─────────────────────────────────────────────────────────────────────────────
// Genera src/data/chinaGeo.js a partir del GeoJSON de provincias de China
// (fuente: DataV/Aliyun, ./china.json).
//
//   node scripts/china-map/gen-geo.mjs
//
// Salida: CHINA_VIEWBOX, CHINA_PATHS ({id: pathD}) y CHINA_LABELS
// ({id: [x, y, w]} → ancla del nombre y anchura proyectada para decidir
// cuándo mostrar la etiqueta según el zoom).
//
// Proyección Mercator web (norte arriba), bbox ajustado al contorno y
// simplificación Douglas-Peucker con coords enteras (~22 kB).
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';

const IN = new URL('./china.json', import.meta.url);
const OUT = new URL('../../src/data/chinaGeo.js', import.meta.url);

const geo = JSON.parse(fs.readFileSync(IN, 'utf8'));

// Mapa nombre GeoJSON (中文) → id usado en los datos de provincias.
const NAME_TO_ID = {
  '北京市': 'beijing', '天津市': 'tianjin', '河北省': 'hebei', '山西省': 'shanxi',
  '内蒙古自治区': 'neimenggu', '辽宁省': 'liaoning', '吉林省': 'jilin', '黑龙江省': 'heilongjiang',
  '上海市': 'shanghai', '江苏省': 'jiangsu', '浙江省': 'zhejiang', '安徽省': 'anhui',
  '福建省': 'fujian', '江西省': 'jiangxi', '山东省': 'shandong', '河南省': 'henan',
  '湖北省': 'hubei', '湖南省': 'hunan', '广东省': 'guangdong', '广西壮族自治区': 'guangxi',
  '海南省': 'hainan', '重庆市': 'chongqing', '四川省': 'sichuan', '贵州省': 'guizhou',
  '云南省': 'yunnan', '西藏自治区': 'xizang', '陕西省': 'shaanxi', '甘肃省': 'gansu',
  '青海省': 'qinghai', '宁夏回族自治区': 'ningxia', '新疆维吾尔自治区': 'xinjiang',
  '台湾省': 'taiwan', '香港特别行政区': 'hongkong', '澳门特别行政区': 'macau',
};

// Proyección Mercator web (norte arriba, igual que Google Maps).
const toMercX = (lon) => (lon * Math.PI) / 180;
const toMercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

// 1ª pasada: bounding box real en coordenadas Mercator.
let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
for (const f of geo.features) {
  if (!NAME_TO_ID[f.properties.name]) continue;
  const { type, coordinates } = f.geometry;
  const polys = type === 'Polygon' ? [coordinates] : coordinates;
  for (const poly of polys) for (const ring of poly) for (const [lon, lat] of ring) {
    const x = toMercX(lon), y = -toMercY(lat); // y negada → norte arriba
    if (x < bx0) bx0 = x; if (x > bx1) bx1 = x;
    if (y < by0) by0 = y; if (y > by1) by1 = y;
  }
}

const PAD = 12;
const bw = bx1 - bx0, bh = by1 - by0;
const W = 1000;
const s = (W - PAD * 2) / bw;
const H = Math.round(bh * s + PAD * 2);

const px = (lon) => PAD + (toMercX(lon) - bx0) * s;
const py = (lat) => PAD + (-toMercY(lat) - by0) * s;

// ── Simplificación ───────────────────────────────────────────────────────────
const TOL = 1.4;         // tolerancia Douglas-Peucker (px)
const MIN_AREA = 6;      // px² mínimos para conservar un anillo
const round = (n) => Math.round(n);

function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
function douglasPeucker(pts, tol) {
  if (pts.length < 3) return pts;
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > tol) {
    const left = douglasPeucker(pts.slice(0, idx + 1), tol);
    const right = douglasPeucker(pts.slice(idx), tol);
    return left.slice(0, -1).concat(right);
  }
  return [pts[0], pts[pts.length - 1]];
}
function ringArea(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]);
  }
  return Math.abs(a) / 2;
}
function ringToPath(ring) {
  let pts = ring.map(([lon, lat]) => [px(lon), py(lat)]);
  pts = douglasPeucker(pts, TOL).map(([x, y]) => [round(x), round(y)]);
  const dedup = [];
  for (const p of pts) {
    const last = dedup[dedup.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) dedup.push(p);
  }
  if (dedup.length < 3) return { d: '', area: 0 };
  let d = 'M' + dedup[0][0] + ' ' + dedup[0][1];
  for (let i = 1; i < dedup.length; i++) d += 'L' + dedup[i][0] + ' ' + dedup[i][1];
  return { d: d + 'Z', area: ringArea(dedup) };
}
function geomToPath(geometry) {
  const { type, coordinates } = geometry;
  const polys = type === 'Polygon' ? [coordinates] : coordinates;
  const rings = [];
  for (const poly of polys) for (const ring of poly) rings.push(ringToPath(ring));
  let kept = rings.filter((r) => r.area >= MIN_AREA);
  if (kept.length === 0) {
    const biggest = rings.reduce((a, b) => (b.area > (a?.area || 0) ? b : a), null);
    if (biggest && biggest.d) kept = [biggest];
  }
  return kept.map((r) => r.d).join('');
}
function markerAt(lon, lat) {
  const x = round(px(lon)), y = round(py(lat)), r = 4;
  return `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;
}

// Ancho proyectado de la geometría (para decidir cuándo mostrar la etiqueta).
function projectedWidth(geometry) {
  const { type, coordinates } = geometry;
  const polys = type === 'Polygon' ? [coordinates] : coordinates;
  let x0 = Infinity, x1 = -Infinity;
  for (const poly of polys) for (const ring of poly) for (const [lon] of ring) {
    const x = px(lon);
    if (x < x0) x0 = x; if (x > x1) x1 = x;
  }
  return round(x1 - x0);
}

const paths = {};
const labels = {};
for (const f of geo.features) {
  const id = NAME_TO_ID[f.properties.name];
  if (!id) { console.warn('sin id:', f.properties.name); continue; }
  let d = geomToPath(f.geometry);
  const c = f.properties.centroid || f.properties.center;
  if (!d) {
    if (c) d = markerAt(c[0], c[1]);
    console.warn('marcador para:', id);
  }
  paths[id] = d;
  if (c) labels[id] = [round(px(c[0])), round(py(c[1])), projectedWidth(f.geometry)];
}

const header = `// src/data/chinaGeo.js
// AUTO-GENERADO por scripts/china-map/gen-geo.mjs desde GeoJSON de DataV (aliyun).
// No editar a mano; re-generar con: node scripts/china-map/gen-geo.mjs
export const CHINA_VIEWBOX = '0 0 ${W} ${H}';
export const CHINA_PATHS = ${JSON.stringify(paths)};
export const CHINA_LABELS = ${JSON.stringify(labels)};
`;
fs.writeFileSync(OUT, header, 'utf8');

const kb = (JSON.stringify(paths).length / 1024).toFixed(0);
console.log('OK provincias:', Object.keys(paths).length, '| paths ~' + kb + ' kB | viewBox 0 0', W, H);

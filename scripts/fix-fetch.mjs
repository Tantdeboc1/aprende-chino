
/**
 * ESM version (compatible with "type":"module" in package.json)
 * Rewrites:
 *   fetch('/data/xxx.json') | "/data/..." | `/data/...`
 * to:
 *   fetch(assetUrl('data/xxx.json'))
 *
 * USO:
 *   node scripts/fix-fetch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const projectRoot = process.cwd();
const SRC_DIR = path.join(projectRoot, 'src');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);

function listFiles(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(listFiles(p));
    else if (exts.has(path.extname(entry.name))) out.push(p);
  }
  return out;
}

function rewriteFetch(code) {
  const patterns = [
    { re: /fetch\(\s*'\/data\/([^']+)'\s*\)/g, rep: (_, p1) => `fetch(assetUrl('data/${p1}'))` },
    { re: /fetch\(\s*"\/data\/([^"]+)"\s*\)/g, rep: (_, p1) => `fetch(assetUrl('data/${p1}'))` },
    { re: /fetch\(\s*`\/data\/([^`]+)`\s*\)/g, rep: (_, p1) => `fetch(assetUrl('data/${p1}'))` },
  ];
  let out = code, changed = false;
  for (const { re, rep } of patterns) {
    out = out.replace(re, (...args) => { changed = true; return rep(...args); });
  }
  return { out, changed };
}

function processFile(fp) {
  const code = fs.readFileSync(fp, 'utf8');
  const { out, changed } = rewriteFetch(code);
  if (!changed) return false;

  // Compute relative import path to src/utils/assets.js (without extension)
  const rel = path.relative(path.dirname(fp), path.join(projectRoot, 'src', 'utils', 'assets')).replace(/\\/g, '/');
  const importLine = `import { assetUrl } from '${rel.startsWith('.') ? rel : './' + rel}';\n`;

  // Only add import if file doesn't already import assetUrl
  let updated = out;
  if (!/assetUrl\s*\(/.test(code)) {
    updated = importLine + out;
  }
  fs.writeFileSync(fp, updated, 'utf8');
  return true;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error("No se encontró carpeta 'src'");
    process.exit(1);
  }
  const files = listFiles(SRC_DIR);
  let total = 0;
  for (const f of files) if (processFile(f)) total++;
  console.log(`Reescrituras aplicadas en ${total} archivo(s).`);
}

main();

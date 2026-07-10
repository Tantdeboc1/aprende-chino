// scripts/deploy-pages.mjs
// Publica dist/ en la rama gh-pages con git puro.
//
// Sustituye al paquete `gh-pages`, que en Windows falla con ENAMETOOLONG:
// pasa los miles de archivos del sitio (hanzi-data, fuentes troceadas, audio)
// como argumentos de UN solo `git rm` y supera el límite de longitud de la
// línea de comandos. Aquí git opera sobre el árbol completo (`add -A`), así
// que el número de archivos da igual.
//
// Estrategia: rama huérfana de un solo commit, force-push. La rama gh-pages
// no acumula historial (cada deploy la reemplaza entera) — el historial real
// vive en main; gh-pages es solo un artefacto de publicación.
import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('[deploy] No hay dist/index.html — ejecuta antes el build (npm run predeploy).');
  process.exit(1);
}

const run = (cmd, cwd = dist) => execSync(cmd, { cwd, stdio: 'inherit' });
const remoteUrl = execSync('git remote get-url origin', { cwd: root, encoding: 'utf8' }).trim();

// Repo efímero dentro de dist: se crea, se sube y se borra en cada deploy.
const distGit = join(dist, '.git');
if (existsSync(distGit)) rmSync(distGit, { recursive: true, force: true });

try {
  run('git init -b gh-pages');
  run('git add -A');
  run('git commit -m "deploy"');
  run(`git push -f "${remoteUrl}" gh-pages`);
  console.log('\n[deploy] Publicado en la rama gh-pages ✔');
} finally {
  // Sin esto, el siguiente `vite build` borraría dist/.git a medias y el
  // repo padre podría confundirse con un repo anidado.
  if (existsSync(distGit)) rmSync(distGit, { recursive: true, force: true });
}

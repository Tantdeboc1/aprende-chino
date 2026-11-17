import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

function parseVersion(value) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(value || '');
  return match ? match.slice(1).map(Number) : null;
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index++) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

const packageVersion = parseVersion(packageJson.version);
if (!packageVersion) throw new Error(`Invalid package.json version: ${packageJson.version}`);

const tags = execFileSync('git', ['tag', '--list', 'v[0-9]*'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .map(tag => ({ tag, version: parseVersion(tag) }))
  .filter(entry => entry.version);

const tagsOnHead = execFileSync('git', ['tag', '--points-at', 'HEAD'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .map(tag => ({ tag, version: parseVersion(tag) }))
  .filter(entry => entry.version)
  .sort((left, right) => compareVersions(right.version, left.version));

// Reusing an existing tag makes a rerun of an already released commit idempotent.
const releasedHeadTag = tagsOnHead.find(entry => compareVersions(entry.version, packageVersion) >= 0);
if (releasedHeadTag) {
  process.stdout.write(releasedHeadTag.tag);
  process.exit(0);
}

const latest = tags.reduce(
  (best, entry) => compareVersions(entry.version, best) > 0 ? entry.version : best,
  packageVersion,
);
const next = [latest[0], latest[1], latest[2] + 1];
process.stdout.write(`v${next.join('.')}`);

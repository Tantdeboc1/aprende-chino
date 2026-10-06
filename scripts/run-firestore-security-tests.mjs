import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

// Official metadata from firebase-tools 15.32.1; avoid unrelated CLI dependencies.
const version = '1.22.0';
const checksum = '9b6498b7f62714d67f48f59b3818883cd682dbcd46b9f59511de81c97bb5166c';
const jar = path.resolve(`node_modules/.cache/firestore/cloud-firestore-emulator-v${version}.jar`);
await fs.mkdir(path.dirname(jar), { recursive: true });
let bytes;
try { bytes = await fs.readFile(jar); } catch { /* Download below. */ }
if (!bytes || createHash('sha256').update(bytes).digest('hex') !== checksum) {
  console.log('Downloading the official Firestore emulator…');
  const response = await fetch(`https://storage.googleapis.com/firebase-preview-drop/emulator/cloud-firestore-emulator-v${version}.jar`, { signal: AbortSignal.timeout(180000) });
  if (!response.ok) throw new Error(`Emulator download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
  if (createHash('sha256').update(bytes).digest('hex') !== checksum) throw new Error('Emulator checksum mismatch.');
  await fs.writeFile(jar, bytes);
}
const portServer = net.createServer();
await new Promise(resolve => portServer.listen(0, '127.0.0.1', resolve));
const port = portServer.address().port;
await new Promise(resolve => portServer.close(resolve));
const host = `127.0.0.1:${port}`;
// On Windows the Oracle PATH entry can be a launcher that spawns another JVM.
// Launch the real executable so shutdown does not leave an orphan emulator.
const javaInfo = spawnSync('java', ['-XshowSettings:properties', '-version'], { encoding: 'utf8', windowsHide: true });
if (javaInfo.error || javaInfo.status !== 0) throw javaInfo.error || new Error(javaInfo.stderr);
const javaHome = javaInfo.stderr.match(/^\s*java.home\s*=\s*(.+)$/m)?.[1].trim();
if (!javaHome) throw new Error('Could not locate Java runtime.');
const javaBinary = path.join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
const emulator = spawn(javaBinary, ['-Duser.language=en', '-jar', jar, '--host', '127.0.0.1', '--port', String(port), '--project_id', 'demo-hanyupath-security', '--rules', path.resolve('firestore.rules')], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '', spawnError;
emulator.stdout.on('data', b => { logs = (logs + b).slice(-12000); });
emulator.stderr.on('data', b => { logs = (logs + b).slice(-12000); });
emulator.on('error', error => { spawnError = error; });
try {
  let ready = false;
  for (let i = 0; i < 120; i++) {
    if (spawnError) throw spawnError;
    if (emulator.exitCode !== null) throw new Error(logs);
    try { await fetch(`http://${host}/`, { signal: AbortSignal.timeout(500) }); ready = true; break; } catch { /* Still starting. */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Emulator failed to start: ' + logs);
  const tests = spawn(process.execPath, ['--test', '--test-force-exit', '--test-concurrency=1', 'security/firestore.test.mjs'], {
    stdio: 'inherit', windowsHide: true,
    env: { ...process.env, FIRESTORE_EMULATOR_HOST: host, GCLOUD_PROJECT: 'demo-hanyupath-security' },
  });
  const exitCode = await new Promise((resolve, reject) => { tests.on('error', reject); tests.on('exit', resolve); });
  process.exitCode = exitCode ?? 1;
} finally {
  emulator.kill();
  await fs.writeFile(path.join(path.dirname(jar), 'emulator.log'), logs);
}

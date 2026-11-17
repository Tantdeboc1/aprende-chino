import { readFile, writeFile } from 'node:fs/promises';

const version = process.env.APP_VERSION;
if (!/^v\d+\.\d+\.\d+$/.test(version || '')) {
  throw new Error(`APP_VERSION is missing or invalid: ${version || '(empty)'}`);
}

const notesUrl = new URL('../dist/release-notes.json', import.meta.url);
const notes = JSON.parse(await readFile(notesUrl, 'utf8'));
notes.version = version;
await writeFile(notesUrl, `${JSON.stringify(notes, null, 2)}\n`);

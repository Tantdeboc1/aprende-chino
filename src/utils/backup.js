// src/utils/backup.js
// Exportar/importar el progreso del usuario a/desde un archivo JSON.
//
// Pensado sobre todo para el modo invitado: su progreso vive solo en
// localStorage y borrarlo (limpiar datos del navegador) lo pierde todo.
// El backup incluye exactamente las claves de usuario que userStore
// sincroniza con la nube (única fuente de verdad: storageKeys.js).
import { STORAGE_KEYS, SYNCED_EXTRA_KEYS } from './storageKeys.js';
import { APP_VERSION } from './version.js';

const USER_KEYS = [
  STORAGE_KEYS.USERNAME,
  STORAGE_KEYS.PROFILE,
  STORAGE_KEYS.PROGRESS,
  ...SYNCED_EXTRA_KEYS,
];

/** Construye el objeto de backup con las claves de usuario presentes. */
export function buildBackup() {
  const data = {};
  for (const k of USER_KEYS) {
    const v = localStorage.getItem(k);
    if (v !== null) data[k] = v; // valores tal cual (strings JSON serializados)
  }
  return {
    app: 'aprende-chino',
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

/** Descarga el backup como archivo .json. */
export function downloadBackup() {
  const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aprende-chino-progreso-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Restaura un backup desde el texto del archivo. Solo escribe claves de la
 * lista blanca USER_KEYS (un JSON manipulado no puede tocar otras claves).
 * @returns {number} nº de claves restauradas.
 * @throws {Error} con message 'invalid-json' | 'invalid-backup' | 'empty-backup'.
 */
export function restoreBackup(text) {
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('invalid-json'); }
  if (!parsed || parsed.app !== 'aprende-chino' || typeof parsed.data !== 'object' || parsed.data === null) {
    throw new Error('invalid-backup');
  }
  const entries = Object.entries(parsed.data)
    .filter(([k, v]) => USER_KEYS.includes(k) && typeof v === 'string');
  if (entries.length === 0) throw new Error('empty-backup');
  for (const [k, v] of entries) localStorage.setItem(k, v);
  return entries.length;
}

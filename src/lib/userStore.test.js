// src/lib/userStore.test.js
// Tests de la capa de sincronización usuario↔Firestore con un Firestore
// falso en memoria. Protegen los invariantes de los que depende el progreso
// del usuario (perderlo es el peor bug posible):
//   - snapshot/hidratación son inversos (round-trip sin pérdida)
//   - pushRemoteUser REEMPLAZA campos (mergeFields): "Borrar progreso" no
//     debe resucitar el progreso viejo del doc remoto
//   - el listener ignora las escrituras propias (clientId) y las pendientes
//   - cerrar sesión limpia todas las claves del dispositivo
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';

// ─── Firestore falso en memoria ───────────────────────────────────────────────
// Estado compartido con los mocks de abajo (vi.mock se iza por encima de los
// imports, por eso se define con vi.hoisted).
const fake = vi.hoisted(() => ({
  docs: new Map(),      // path → data del doc
  listeners: new Map(), // path → Set<callback de onSnapshot>
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  doc: (_db, col, id) => ({ path: `${col}/${id}` }),
  getDoc: async (ref) => ({
    exists: () => fake.docs.has(ref.path),
    data: () => fake.docs.get(ref.path),
  }),
  // Reproduce la semántica de mergeFields que usa pushRemoteUser: cada campo
  // listado se REEMPLAZA entero (no se fusiona en profundidad).
  setDoc: async (ref, data, opts) => {
    const prev = fake.docs.get(ref.path) || {};
    const next = { ...prev };
    for (const field of opts?.mergeFields ?? Object.keys(data)) {
      if (field in data) next[field] = data[field];
    }
    fake.docs.set(ref.path, next);
  },
  serverTimestamp: () => 'server-ts',
  onSnapshot: (ref, cb) => {
    if (!fake.listeners.has(ref.path)) fake.listeners.set(ref.path, new Set());
    fake.listeners.get(ref.path).add(cb);
    return () => fake.listeners.get(ref.path).delete(cb);
  },
}));

// firebase.js inicializa la app real (API keys, initializeApp) — aquí basta
// un objeto vacío porque el Firestore falso lo ignora.
vi.mock('./firebase.js', () => ({ firebaseApp: {} }));

// Simula que OTRO dispositivo (u otro cliente) escribió el doc.
function emitSnapshot(path, data, { pendingWrites = false } = {}) {
  for (const cb of fake.listeners.get(path) ?? []) {
    cb({
      exists: () => true,
      data: () => data,
      metadata: { hasPendingWrites: pendingWrites },
    });
  }
}

import {
  fetchRemoteUser, pushRemoteUser, subscribeRemoteUser,
  hydrateLocalFromRemote, snapshotLocal, clearLocalUserData, getClientId,
} from './userStore.js';

// Estado local de ejemplo: un invitado con progreso real en el dispositivo.
function seedLocalGuest() {
  localStorage.setItem(STORAGE_KEYS.USERNAME, 'Ana');
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify({ avatarId: 'a1', gender: 'f' }));
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({ lesson_1: { done: 5 } }));
  localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ currentStreak: 3 }));
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['你']));
}

beforeEach(() => {
  localStorage.clear();
  fake.docs.clear();
  fake.listeners.clear();
});

describe('snapshotLocal ↔ hydrateLocalFromRemote', () => {
  it('round-trip sin pérdida: snapshot → limpiar → hidratar restaura todo', () => {
    seedLocalGuest();
    const snap = snapshotLocal();

    clearLocalUserData();
    expect(localStorage.getItem(STORAGE_KEYS.PROGRESS)).toBeNull();

    hydrateLocalFromRemote(snap);
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBe('Ana');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS))).toEqual({ lesson_1: { done: 5 } });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK))).toEqual({ currentStreak: 3 });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES))).toEqual(['你']);
  });

  it('un remoto sin nombre borra el nombre local (no hereda el del usuario anterior)', () => {
    localStorage.setItem(STORAGE_KEYS.USERNAME, 'Anterior');
    hydrateLocalFromRemote({ userName: '', profile: null, progress: {}, extra: {} });
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBeNull();
  });

  it('hidratar con null no toca nada (doc remoto inexistente)', () => {
    seedLocalGuest();
    hydrateLocalFromRemote(null);
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBe('Ana');
  });
});

describe('pushRemoteUser / fetchRemoteUser', () => {
  it('sube el snapshot y lo devuelve intacto, con clientId para dedupe', async () => {
    seedLocalGuest();
    await pushRemoteUser('u1', snapshotLocal());

    const remote = await fetchRemoteUser('u1');
    expect(remote.userName).toBe('Ana');
    expect(remote.progress).toEqual({ lesson_1: { done: 5 } });
    expect(remote.extra[STORAGE_KEYS.STREAK]).toBe(JSON.stringify({ currentStreak: 3 }));
    expect(remote.clientId).toBe(getClientId());
  });

  it('devuelve null si el doc no existe (primer login)', async () => {
    expect(await fetchRemoteUser('nadie')).toBeNull();
  });

  it('REEMPLAZA el progreso en vez de fusionarlo: "Borrar progreso" no resucita', async () => {
    // Doc remoto con progreso viejo
    seedLocalGuest();
    await pushRemoteUser('u1', snapshotLocal());

    // El usuario borra su progreso en el dispositivo y se vuelve a subir
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({}));
    await pushRemoteUser('u1', snapshotLocal());

    const remote = await fetchRemoteUser('u1');
    // Con merge:true (el bug histórico) lesson_1 seguiría aquí.
    expect(remote.progress).toEqual({});
  });

  it('conserva campos desconocidos del doc (versiones futuras) al hacer push', async () => {
    fake.docs.set('users/u1', { campoFuturo: 'x', progress: { lesson_9: {} } });
    seedLocalGuest();
    await pushRemoteUser('u1', snapshotLocal());

    const remote = await fetchRemoteUser('u1');
    expect(remote.campoFuturo).toBe('x');            // no listado en mergeFields → intacto
    expect(remote.progress).toEqual({ lesson_1: { done: 5 } }); // listado → reemplazado
  });
});

describe('subscribeRemoteUser', () => {
  it('entrega cambios de OTROS dispositivos', async () => {
    const onChange = vi.fn();
    await subscribeRemoteUser('u1', onChange);

    emitSnapshot('users/u1', { clientId: 'otro-dispositivo', progress: { lesson_2: {} } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ progress: { lesson_2: {} } }),
    );
  });

  it('ignora las escrituras propias (mismo clientId) — evita el loop de hidratación', async () => {
    const onChange = vi.fn();
    await subscribeRemoteUser('u1', onChange);

    emitSnapshot('users/u1', { clientId: getClientId(), progress: {} });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ignora snapshots con escrituras pendientes (aún no confirmadas por el server)', async () => {
    const onChange = vi.fn();
    await subscribeRemoteUser('u1', onChange);

    emitSnapshot('users/u1', { clientId: 'otro' }, { pendingWrites: true });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('la función devuelta desuscribe', async () => {
    const onChange = vi.fn();
    const unsub = await subscribeRemoteUser('u1', onChange);
    unsub();
    emitSnapshot('users/u1', { clientId: 'otro' });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('clearLocalUserData', () => {
  it('borra TODAS las claves de usuario (la siguiente cuenta empieza limpia)', () => {
    seedLocalGuest();
    clearLocalUserData();
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.PROFILE)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.PROGRESS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.STREAK)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.FAVORITES)).toBeNull();
  });
});

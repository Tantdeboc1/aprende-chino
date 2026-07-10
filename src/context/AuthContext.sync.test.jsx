// src/context/AuthContext.sync.test.jsx
// Tests de integración del flujo más delicado de la app: qué pasa con el
// progreso del usuario al entrar con Google, migrar desde invitado y cerrar
// sesión. Un fallo aquí = usuario que pierde su progreso.
//
// Firebase entero (auth + firestore + app) está mockeado; userStore corre de
// verdad contra un Firestore falso en memoria, así que se ejercita el árbol
// de decisiones real de AuthContext (líneas del handler onAuthStateChanged).
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';

// ─── Estado compartido de los mocks (izado por encima de los imports) ────────
const fake = vi.hoisted(() => ({
  docs: new Map(),   // Firestore falso: path → data
  authCb: null,      // callback registrado en onAuthStateChanged
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  doc: (_db, col, id) => ({ path: `${col}/${id}` }),
  getDoc: async (ref) => ({
    exists: () => fake.docs.has(ref.path),
    data: () => fake.docs.get(ref.path),
  }),
  setDoc: async (ref, data, opts) => {
    const prev = fake.docs.get(ref.path) || {};
    const next = { ...prev };
    for (const field of opts?.mergeFields ?? Object.keys(data)) {
      if (field in data) next[field] = data[field];
    }
    fake.docs.set(ref.path, next);
  },
  serverTimestamp: () => 'server-ts',
  onSnapshot: () => () => {},
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth, cb) => { fake.authCb = cb; return () => {}; },
  signInWithPopup: async () => ({}),
  signInWithRedirect: async () => ({}),
  signOut: async () => {},
  deleteUser: async () => {},
}));

// '@/lib/firebase.js' resuelve al mismo módulo que './firebase.js' en
// userStore → un solo mock cubre ambos imports.
vi.mock('@/lib/firebase.js', () => ({
  firebaseApp: {}, auth: {}, googleProvider: {},
}));

// El perfil social (código de amigo) no es objeto de estos tests.
vi.mock('@/lib/socialStore.js', () => ({
  syncPublicProfile: vi.fn(async () => {}),
  clearSocialCache: vi.fn(),
}));

import { AuthProvider, useAuth } from './AuthContext.jsx';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

// Progreso local de ejemplo (el que un invitado lleva en su dispositivo).
function seedLocalProgress() {
  localStorage.setItem(STORAGE_KEYS.USERNAME, 'Ana');
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({ lesson_1: { done: 5 } }));
  localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ currentStreak: 3 }));
}

// Doc remoto de una cuenta Google que YA tenía progreso propio.
const REMOTE_WITH_PROGRESS = {
  userName: 'Nube',
  profile: { avatarId: 'a2' },
  progress: { lesson_3: { done: 9 } },
  extra: { [STORAGE_KEYS.STREAK]: JSON.stringify({ currentStreak: 30 }) },
};

// Dispara el login como lo haría Firebase Auth al completarse el popup.
async function fireLogin(uid = 'u1') {
  await waitFor(() => expect(fake.authCb).toBeTruthy());
  await act(async () => { await fake.authCb({ uid, photoURL: null }); });
}

beforeEach(() => {
  localStorage.clear();
  fake.docs.clear();
  fake.authCb = null;
});

describe('migración invitado → Google', () => {
  it('cuenta nueva (sin doc remoto): el progreso local se sube y se conserva', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'guest');
    seedLocalProgress();
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('guest'));

    await act(async () => { await result.current.migrateGuestToGoogle(); });
    await fireLogin('u1');

    // El progreso del dispositivo acabó en la nube, intacto.
    expect(fake.docs.get('users/u1').progress).toEqual({ lesson_1: { done: 5 } });
    expect(fake.docs.get('users/u1').userName).toBe('Ana');
    // Y sigue en el dispositivo.
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS))).toEqual({ lesson_1: { done: 5 } });
    expect(result.current.mode).toBe('google');
  });

  it('cuenta con progreso previo + usuario elige NUBE: lo local se descarta', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'guest');
    seedLocalProgress();
    fake.docs.set('users/u1', { ...REMOTE_WITH_PROGRESS });
    vi.spyOn(window, 'confirm').mockReturnValue(true); // Aceptar = nube

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('guest'));
    await act(async () => { await result.current.migrateGuestToGoogle(); });
    await fireLogin('u1');

    // El dispositivo quedó hidratado con la versión de la nube…
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS))).toEqual({ lesson_3: { done: 9 } });
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBe('Nube');
    // …y la nube NO fue sobrescrita.
    expect(fake.docs.get('users/u1').progress).toEqual({ lesson_3: { done: 9 } });
  });

  it('cuenta con progreso previo + usuario elige DISPOSITIVO: la nube se sobrescribe', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'guest');
    seedLocalProgress();
    fake.docs.set('users/u1', { ...REMOTE_WITH_PROGRESS });
    vi.spyOn(window, 'confirm').mockReturnValue(false); // Cancelar = dispositivo

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.mode).toBe('guest'));
    await act(async () => { await result.current.migrateGuestToGoogle(); });
    await fireLogin('u1');

    expect(fake.docs.get('users/u1').progress).toEqual({ lesson_1: { done: 5 } });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS))).toEqual({ lesson_1: { done: 5 } });
  });
});

describe('usuario Google que vuelve', () => {
  it('hidrata el dispositivo desde la nube sin preguntar', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'google');
    const confirmSpy = vi.spyOn(window, 'confirm');
    fake.docs.set('users/u1', { ...REMOTE_WITH_PROGRESS });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await fireLogin('u1');

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS))).toEqual({ lesson_3: { done: 9 } });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAK))).toEqual({ currentStreak: 30 });
    expect(result.current.mode).toBe('google');
  });

  it('doc antiguo sin `extra`: se completa con lo local del dispositivo', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'google');
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({ currentStreak: 7 }));
    // Doc de una versión anterior a la sincronización de racha/historias.
    fake.docs.set('users/u1', { userName: 'Nube', progress: { lesson_2: {} } });

    renderHook(() => useAuth(), { wrapper });
    await fireLogin('u1');

    const doc = fake.docs.get('users/u1');
    expect(doc.extra[STORAGE_KEYS.STREAK]).toBe(JSON.stringify({ currentStreak: 7 }));
  });
});

describe('cerrar sesión', () => {
  it('borra todos los datos locales y vuelve a modo null (LoginScreen)', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_MODE, 'google');
    fake.docs.set('users/u1', { ...REMOTE_WITH_PROGRESS });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await fireLogin('u1');
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBe('Nube');

    await act(async () => { await result.current.signOut(); });

    expect(result.current.mode).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.PROGRESS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.AUTH_MODE)).toBeNull();
    // La nube conserva la copia del usuario (solo se limpia el dispositivo).
    expect(fake.docs.get('users/u1').progress).toEqual({ lesson_3: { done: 9 } });
  });
});

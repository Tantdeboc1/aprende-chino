// src/lib/socialStore.js
// Capa de datos "social": perfil público, código de amigo, invitaciones y
// amistades. Vive aparte de userStore.js (que gestiona el doc PRIVADO
// users/{uid}) porque aquí se cruzan datos entre usuarios distintos.
//
// Modelo en Firestore (todo controlado por firestore.rules, sin Cloud Functions):
//   publicProfiles/{uid}   → datos mínimos visibles por cualquier autenticado
//                            (nombre, avatar, nivel, XP, racha, código).
//   friendCodes/{code}     → { uid }. Lookup código→uid. Crear-si-no-existe
//                            garantiza unicidad del código.
//   friendRequests/{from_to} → { from, to, ... }. Invitación pendiente.
//   friendships/{pairId}   → { members:[a,b] }. Amistad confirmada (pairId =
//                            los dos uid ordenados y unidos por '_').
//
// Solo lo usan usuarios con cuenta Google. Firestore se importa de forma
// diferida (igual que userStore) para no penalizar el arranque de invitados.
import { STORAGE_KEYS } from '@/utils/storageKeys.js';
import { getStreak, getWeeklyXP } from '@/utils/streak.js';
import { getLevelInfo } from '@/utils/leveling.js';
import { loadUserProfile } from '@/utils/userProfile.js';

let _fsPromise = null;
function loadFirestore() {
  if (!_fsPromise) {
    _fsPromise = Promise.all([
      import('firebase/firestore'),
      import('./firebase.js'),
    ]).then(([fs, { firebaseApp }]) => ({
      fs,
      db: fs.getFirestore(firebaseApp),
    }));
  }
  return _fsPromise;
}

// ─── Código de amigo ────────────────────────────────────────────────────────
// Alfabeto sin caracteres ambiguos (sin I, L, O, 0, 1) para que sea fácil de
// dictar/teclear. 6 caracteres → ~887M combinaciones, colisiones improbables.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LEN = 6;

function randomCode() {
  let out = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(CODE_LEN);
    crypto.getRandomValues(buf);
    for (let i = 0; i < CODE_LEN; i++) out += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length];
  } else {
    for (let i = 0; i < CODE_LEN; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

// Normaliza lo que teclea el usuario: mayúsculas, sin separadores ni espacios.
export function normalizeCode(input) {
  return String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Formato bonito para mostrar: "ABC-DEF".
export function formatCode(code) {
  const c = normalizeCode(code);
  if (c.length <= 3) return c;
  return `${c.slice(0, 3)}-${c.slice(3)}`;
}

// Caché en memoria del código del usuario para no releer publicProfile en
// cada sync. Se limpia al cerrar sesión (clearSocialCache).
let _codeCache = {};
export function clearSocialCache() { _codeCache = {}; }

// ─── pairId / helpers ───────────────────────────────────────────────────────
// Id determinista y simétrico de una amistad: los dos uid ordenados. Así ambos
// extremos calculan el mismo id sin coordinarse.
export function pairId(a, b) {
  return [a, b].sort().join('_');
}

function requestId(fromUid, toUid) {
  return `${fromUid}_${toUid}`;
}

// ─── Perfil público ─────────────────────────────────────────────────────────
function readLocalUserName() {
  try { return localStorage.getItem(STORAGE_KEYS.USERNAME) || ''; } catch { return ''; }
}

// Garantiza que el usuario tiene un código único y devuelve dicho código.
// Reusa el existente (en publicProfile o caché); si no hay, genera uno nuevo
// reservándolo en friendCodes con create (que falla si ya existe → reintenta).
async function ensureFriendCode(uid) {
  if (_codeCache[uid]) return _codeCache[uid];
  const { fs, db } = await loadFirestore();

  // ¿Ya tiene código guardado en su perfil público?
  try {
    const snap = await fs.getDoc(fs.doc(db, 'publicProfiles', uid));
    const existing = snap.exists() ? snap.data().friendCode : null;
    if (existing) {
      _codeCache[uid] = existing;
      return existing;
    }
  } catch { /* sin perfil aún: generamos abajo */ }

  // Genera y reserva un código libre. create() falla si el doc ya existe, lo
  // que nos da unicidad sin transacciones.
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = randomCode();
    try {
      await fs.setDoc(
        fs.doc(db, 'friendCodes', code),
        { uid, createdAt: fs.serverTimestamp() },
      );
      _codeCache[uid] = code;
      return code;
    } catch {
      // Colisión o carrera: probamos con otro código.
    }
  }
  throw new Error('No se pudo generar un código de amigo libre');
}

// Sube/actualiza el perfil público con el estado actual (lee de localStorage).
// `photoURL` es la foto de Google del usuario (o null); decidimos aquí si se
// expone según su preferencia useGooglePhoto.
export async function syncPublicProfile({ uid, photoURL }) {
  if (!uid) return;
  const { fs, db } = await loadFirestore();
  const code = await ensureFriendCode(uid);

  const streak = getStreak();
  const totalXP = streak.totalXP || 0;
  const level = getLevelInfo(totalXP).level;
  const profile = loadUserProfile();
  const useGoogle = profile?.useGooglePhoto !== false && !!photoURL;

  await fs.setDoc(
    fs.doc(db, 'publicProfiles', uid),
    {
      uid,
      displayName: (readLocalUserName() || '').slice(0, 100),
      avatarId: profile?.avatarId || null,
      photoURL: useGoogle ? photoURL : null,
      level,
      totalXP,
      weeklyXP: getWeeklyXP(),
      currentStreak: streak.currentStreak || 0,
      friendCode: code,
      updatedAt: fs.serverTimestamp(),
    },
    { merge: true },
  );
  return code;
}

export async function fetchPublicProfile(uid) {
  const { fs, db } = await loadFirestore();
  const snap = await fs.getDoc(fs.doc(db, 'publicProfiles', uid));
  return snap.exists() ? snap.data() : null;
}

// Resuelve un código de amigo a su uid (o null si no existe).
export async function resolveFriendCode(code) {
  const norm = normalizeCode(code);
  if (norm.length !== CODE_LEN) return null;
  const { fs, db } = await loadFirestore();
  const snap = await fs.getDoc(fs.doc(db, 'friendCodes', norm));
  return snap.exists() ? (snap.data().uid || null) : null;
}

// ─── Invitaciones ───────────────────────────────────────────────────────────
// Envía una invitación de `fromUid` a `toUid`. `fromPublic` es el perfil
// público del emisor (para pintar la tarjeta sin un read extra en el
// receptor) y `toPublic` el del destinatario (para que el emisor vea a quién
// invitó en "enviadas", también sin read extra).
export async function sendFriendRequest({ fromUid, toUid, fromPublic, toPublic }) {
  if (!fromUid || !toUid) throw new Error('uid faltante');
  if (fromUid === toUid) { const e = new Error('self'); e.code = 'self'; throw e; }
  const { fs, db } = await loadFirestore();

  // Si ya sois amigos, no tiene sentido invitar.
  const friendSnap = await fs.getDoc(fs.doc(db, 'friendships', pairId(fromUid, toUid)));
  if (friendSnap.exists()) { const e = new Error('already-friends'); e.code = 'already-friends'; throw e; }

  // Idempotente: si ya hay una invitación pendiente para esa persona no la
  // reescribimos (las reglas solo permiten create, no update → daría error).
  const reqRef = fs.doc(db, 'friendRequests', requestId(fromUid, toUid));
  const existing = await fs.getDoc(reqRef);
  if (existing.exists()) return;

  await fs.setDoc(
    reqRef,
    {
      from: fromUid,
      to: toUid,
      fromName: (fromPublic?.displayName || '').slice(0, 100),
      fromAvatarId: fromPublic?.avatarId || null,
      fromPhotoURL: fromPublic?.photoURL || null,
      toName: (toPublic?.displayName || '').slice(0, 100),
      toAvatarId: toPublic?.avatarId || null,
      toPhotoURL: toPublic?.photoURL || null,
      createdAt: fs.serverTimestamp(),
    },
  );
}

// El receptor acepta: crea la amistad y borra la invitación en un batch.
// La regla de creación de friendships comprueba que existe esta invitación.
export async function acceptFriendRequest({ fromUid, toUid }) {
  const { fs, db } = await loadFirestore();
  const batch = fs.writeBatch(db);
  batch.set(fs.doc(db, 'friendships', pairId(fromUid, toUid)), {
    members: [fromUid, toUid].sort(),
    createdAt: fs.serverTimestamp(),
  });
  batch.delete(fs.doc(db, 'friendRequests', requestId(fromUid, toUid)));
  await batch.commit();
}

// Rechazar (receptor) o cancelar (emisor): ambas borran la invitación.
export async function deleteFriendRequest({ fromUid, toUid }) {
  const { fs, db } = await loadFirestore();
  await fs.deleteDoc(fs.doc(db, 'friendRequests', requestId(fromUid, toUid)));
}

// Eliminar amigo: borra la arista. Cualquiera de los dos puede hacerlo.
export async function removeFriend({ myUid, otherUid }) {
  const { fs, db } = await loadFirestore();
  await fs.deleteDoc(fs.doc(db, 'friendships', pairId(myUid, otherUid)));
}

// ─── Borrado de cuenta (derecho de supresión / requisito de Google Play) ────
// Borra TODOS los datos del usuario en Firestore: código de amigo, invitaciones
// (enviadas y recibidas), amistades, perfil público y el doc privado users/{uid}.
// Best-effort por documento: un fallo puntual no impide borrar el resto.
// Requiere las reglas con `allow delete` en users/ y publicProfiles/ (ver
// firestore.rules — hay que desplegarlas a mano).
export async function deleteAccountData(uid) {
  const { fs, db } = await loadFirestore();
  let failures = 0;
  const attempt = async (fn) => {
    try { await fn(); } catch (e) { failures++; console.warn('[deleteAccount]', e); }
  };

  // 1. Código de amigo (el code está en el perfil público).
  await attempt(async () => {
    const snap = await fs.getDoc(fs.doc(db, 'publicProfiles', uid));
    const code = snap.exists() ? snap.data().friendCode : null;
    if (code) await fs.deleteDoc(fs.doc(db, 'friendCodes', code));
  });

  // 2. Invitaciones enviadas y recibidas.
  await attempt(async () => {
    const sent = await fs.getDocs(fs.query(fs.collection(db, 'friendRequests'), fs.where('from', '==', uid)));
    await Promise.all(sent.docs.map(d => fs.deleteDoc(d.ref)));
  });
  await attempt(async () => {
    const received = await fs.getDocs(fs.query(fs.collection(db, 'friendRequests'), fs.where('to', '==', uid)));
    await Promise.all(received.docs.map(d => fs.deleteDoc(d.ref)));
  });

  // 3. Amistades.
  await attempt(async () => {
    const friendships = await fs.getDocs(fs.query(fs.collection(db, 'friendships'), fs.where('members', 'array-contains', uid)));
    await Promise.all(friendships.docs.map(d => fs.deleteDoc(d.ref)));
  });

  // 4. Perfil público y doc privado (al final: si algo de arriba falla,
  //    reintentar el borrado completo sigue siendo posible con la sesión viva).
  await attempt(() => fs.deleteDoc(fs.doc(db, 'publicProfiles', uid)));
  await attempt(() => fs.deleteDoc(fs.doc(db, 'users', uid)));

  clearSocialCache();
  return failures === 0;
}

// ─── Suscripciones en tiempo real ───────────────────────────────────────────
// Cada una es async por el import dinámico de Firestore: resuelve a la función
// de desuscripción. El caller debe gestionar el caso "se desmontó antes".
export async function subscribeIncomingRequests(uid, cb) {
  const { fs, db } = await loadFirestore();
  const q = fs.query(fs.collection(db, 'friendRequests'), fs.where('to', '==', uid));
  return fs.onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, (e) => console.warn('Listener invitaciones entrantes:', e));
}

export async function subscribeOutgoingRequests(uid, cb) {
  const { fs, db } = await loadFirestore();
  const q = fs.query(fs.collection(db, 'friendRequests'), fs.where('from', '==', uid));
  return fs.onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, (e) => console.warn('Listener invitaciones salientes:', e));
}

export async function subscribeFriendships(uid, cb) {
  const { fs, db } = await loadFirestore();
  const q = fs.query(fs.collection(db, 'friendships'), fs.where('members', 'array-contains', uid));
  return fs.onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, (e) => console.warn('Listener amistades:', e));
}

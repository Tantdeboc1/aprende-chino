// src/lib/userStore.js
// Capa de datos del usuario logueado: lectura/escritura del documento
// `users/{uid}` en Firestore. El modo invitado NO pasa por aquí — sigue
// usando localStorage directamente vía utils/progress.js y utils/userProfile.js.
import { STORAGE_KEYS, SYNCED_EXTRA_KEYS } from '@/utils/storageKeys.js';

// Firestore Y firebase.js (initializeApp) se importan dinámicamente: así el
// SDK de Firebase no entra en el bundle de arranque. Solo se descarga cuando
// hay un usuario Google que toca Firestore — invitados y visitantes nuevos
// no lo pagan.
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

// ID aleatorio único por pestaña del navegador. Se incluye en cada
// escritura a Firestore para que el listener onSnapshot pueda distinguir
// "esto lo escribí yo" de "esto lo escribió otro dispositivo".
let _clientId = null;
export function getClientId() {
  if (_clientId) return _clientId;
  _clientId = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return _clientId;
}

const LS_USERNAME = STORAGE_KEYS.USERNAME;
const LS_PROFILE  = STORAGE_KEYS.PROFILE;
const LS_PROGRESS = STORAGE_KEYS.PROGRESS;

// Resto de claves localStorage que componen el estado del usuario. Se
// sincronizan como strings crudos (en el campo `extra` del doc) para no
// acoplar este módulo al formato interno de cada subsistema.
// Origen de verdad: STORAGE_KEYS / SYNCED_EXTRA_KEYS en utils/storageKeys.js.
const LS_EXTRA_KEYS = SYNCED_EXTRA_KEYS;

function readLocalSnapshot() {
  let profile = null, progress = {}, userName = '';
  try { userName = localStorage.getItem(LS_USERNAME) || ''; } catch {}
  try { const raw = localStorage.getItem(LS_PROFILE);  if (raw) profile  = JSON.parse(raw); } catch {}
  try { const raw = localStorage.getItem(LS_PROGRESS); if (raw) progress = JSON.parse(raw); } catch {}
  const extra = {};
  for (const key of LS_EXTRA_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) extra[key] = raw;
    } catch {}
  }
  return { userName, profile, progress, extra };
}

function writeLocalSnapshot({ userName, profile, progress, extra }) {
  try {
    // userName vacío también se aplica (borra el local): si el remoto no
    // tiene nombre, este dispositivo no debe conservar el del usuario anterior.
    if (typeof userName === 'string') {
      if (userName) localStorage.setItem(LS_USERNAME, userName);
      else localStorage.removeItem(LS_USERNAME);
    }
    if (profile)  localStorage.setItem(LS_PROFILE,  JSON.stringify(profile));
    if (progress) localStorage.setItem(LS_PROGRESS, JSON.stringify(progress));
    if (extra) {
      for (const key of LS_EXTRA_KEYS) {
        if (typeof extra[key] === 'string') localStorage.setItem(key, extra[key]);
      }
    }
  } catch {}
}

// Borra todos los datos de usuario del dispositivo. Se llama al cerrar
// sesión para que la siguiente cuenta (Google o invitado) empiece limpia
// y no herede —ni suba a su doc— los datos del usuario anterior.
export function clearLocalUserData() {
  const all = [LS_USERNAME, LS_PROFILE, LS_PROGRESS, ...LS_EXTRA_KEYS];
  for (const key of all) {
    try { localStorage.removeItem(key); } catch {}
  }
}

// Carga el doc remoto. Si no existe, devuelve null (caller decide si subir
// el snapshot local para inicializarlo).
export async function fetchRemoteUser(uid) {
  const { fs, db } = await loadFirestore();
  const snap = await fs.getDoc(fs.doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// Sobrescribe el doc remoto con el snapshot dado.
// mergeFields (no merge:true): cada campo listado se REEMPLAZA entero en vez
// de fusionarse. Con merge:true, Firestore fusiona mapas recursivamente, así
// que subir `progress: {}` tras un "Borrar progreso" no borraba nada del doc
// y el progreso viejo resucitaba en el siguiente login. Con mergeFields el
// doc remoto queda siempre igual al snapshot local, y los campos desconocidos
// (de versiones futuras) se conservan.
// Incluye el clientId para dedupear en el listener (sin esto, cada push
// dispararía nuestro propio onSnapshot y entraríamos en un loop de hidratación).
export async function pushRemoteUser(uid, data) {
  const { fs, db } = await loadFirestore();
  await fs.setDoc(
    fs.doc(db, 'users', uid),
    { ...data, clientId: getClientId(), updatedAt: fs.serverTimestamp() },
    { mergeFields: ['userName', 'profile', 'progress', 'extra', 'clientId', 'updatedAt'] },
  );
}

// Suscribe a cambios en tiempo real del doc del usuario. El callback recibe
// solo cambios externos (otros dispositivos); los nuestros se filtran por
// clientId. ASYNC por el import dinámico de Firestore: resuelve a la
// función de desuscripción.
export async function subscribeRemoteUser(uid, onExternalChange) {
  const { fs, db } = await loadFirestore();
  const ref = fs.doc(db, 'users', uid);
  const myClient = getClientId();
  return fs.onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    // Las escrituras propias se ignoran. metadata.hasPendingWrites
    // cubre además el caso "yo acabo de escribir y aún no llegó al server".
    if (snap.metadata.hasPendingWrites) return;
    if (data.clientId === myClient) return;
    onExternalChange(data);
  });
}

// Hidrata localStorage con el contenido remoto. Usado al iniciar sesión:
// el resto de la app sigue leyendo de localStorage sin cambios.
export function hydrateLocalFromRemote(remote) {
  if (!remote) return;
  writeLocalSnapshot({
    userName: remote.userName,
    profile:  remote.profile,
    progress: remote.progress,
    extra:    remote.extra,
  });
}

// Snapshot actual de localStorage — lo que subiremos a Firestore.
export function snapshotLocal() {
  return readLocalSnapshot();
}

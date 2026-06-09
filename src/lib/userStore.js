// src/lib/userStore.js
// Capa de datos del usuario logueado: lectura/escritura del documento
// `users/{uid}` en Firestore. El modo invitado NO pasa por aquí — sigue
// usando localStorage directamente vía utils/progress.js y utils/userProfile.js.
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.js';

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

const LS_USERNAME = 'aprende-chino-username';
const LS_PROFILE  = 'aprende-chino-profile';
const LS_PROGRESS = 'aprende-chino-progress-v1';

function readLocalSnapshot() {
  let profile = null, progress = {}, userName = '';
  try { userName = localStorage.getItem(LS_USERNAME) || ''; } catch {}
  try { const raw = localStorage.getItem(LS_PROFILE);  if (raw) profile  = JSON.parse(raw); } catch {}
  try { const raw = localStorage.getItem(LS_PROGRESS); if (raw) progress = JSON.parse(raw); } catch {}
  return { userName, profile, progress };
}

function writeLocalSnapshot({ userName, profile, progress }) {
  try {
    if (userName) localStorage.setItem(LS_USERNAME, userName);
    if (profile)  localStorage.setItem(LS_PROFILE,  JSON.stringify(profile));
    if (progress) localStorage.setItem(LS_PROGRESS, JSON.stringify(progress));
  } catch {}
}

// Carga el doc remoto. Si no existe, devuelve null (caller decide si subir
// el snapshot local para inicializarlo).
export async function fetchRemoteUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// Sobrescribe el doc remoto con el snapshot dado. Usar merge:true para no
// borrar campos que añadamos en el futuro desde otros dispositivos.
// Incluye el clientId para dedupear en el listener (sin esto, cada push
// dispararía nuestro propio onSnapshot y entraríamos en un loop de hidratación).
export async function pushRemoteUser(uid, data) {
  await setDoc(
    doc(db, 'users', uid),
    { ...data, clientId: getClientId(), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

// Suscribe a cambios en tiempo real del doc del usuario. El callback recibe
// solo cambios externos (otros dispositivos); los nuestros se filtran por
// clientId. Devuelve la función para desuscribirse.
export function subscribeRemoteUser(uid, onExternalChange) {
  const ref = doc(db, 'users', uid);
  const myClient = getClientId();
  return onSnapshot(ref, (snap) => {
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
  });
}

// Snapshot actual de localStorage — lo que subiremos a Firestore.
export function snapshotLocal() {
  return readLocalSnapshot();
}

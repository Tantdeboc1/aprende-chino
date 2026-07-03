// src/hooks/useIncomingRequestCount.js
// Contador global de invitaciones de amistad recibidas, para el badge de la
// bottom nav. Es un store singleton a nivel de módulo: la suscripción a
// Firestore sobrevive a los remounts de BottomNav (que se desmonta en cada
// cambio de pantalla) y solo se rehace si cambia el uid (login/logout).
// Para invitados no se suscribe nada y el contador es 0.
import { useEffect, useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';

let count = 0;
let currentUid = null;
let unsubPromise = null; // Promise<función de desuscripción> | null
const listeners = new Set();

function emit() {
  for (const l of [...listeners]) l();
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getCount = () => count;

function ensureSubscribed(uid) {
  if (uid === currentUid) return;
  // Cierra la suscripción del uid anterior (si la promesa aún no resolvió,
  // desuscribimos al llegar).
  if (unsubPromise) {
    unsubPromise.then((u) => { try { u?.(); } catch { /* ya cerrada */ } });
    unsubPromise = null;
  }
  currentUid = uid;
  count = 0;
  emit();
  if (!uid) return;

  unsubPromise = import('@/lib/socialStore.js')
    .then((m) => m.subscribeIncomingRequests(uid, (list) => {
      count = list.length;
      emit();
    }))
    .catch((e) => {
      console.warn('Badge de invitaciones no disponible:', e);
      return null;
    });
}

export function useIncomingRequestCount() {
  const { mode, user } = useAuth();
  const uid = mode === 'google' ? (user?.uid || null) : null;

  useEffect(() => { ensureSubscribed(uid); }, [uid]);

  return useSyncExternalStore(subscribe, getCount);
}

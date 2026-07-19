// src/context/AuthContext.jsx
// Contexto global de autenticación. Tres estados posibles para `mode`:
//   - 'loading'  → aún resolviendo onAuthStateChanged (mostrar splash/loader)
//   - 'google'   → usuario logueado con Google, datos sincronizan con Firestore
//   - 'guest'    → usuario eligió "continuar como invitado", todo en localStorage
//   - null       → no ha pasado por LoginScreen aún
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  fetchRemoteUser, pushRemoteUser, subscribeRemoteUser,
  hydrateLocalFromRemote, snapshotLocal, clearLocalUserData,
} from '@/lib/userStore.js';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';
import { bumpLocalDataRev } from '@/hooks/useLocalSnapshot.js';
import i18n from '@/i18n.js';

const LS_MODE = STORAGE_KEYS.AUTH_MODE; // 'google' | 'guest'

// Carga diferida del SDK de Firebase Auth + la app inicializada. Importar
// 'firebase/auth' y 'firebase.js' de forma estática metía ~50 kB gzip en el
// arranque para TODOS. Con import() dinámico, solo se descarga cuando hace
// falta: usuarios Google que vuelven (auth-mode='google') o cualquiera que
// pulse "Continuar con Google". Invitados y visitantes nuevos no lo pagan.
let _authPromise = null;
function loadFirebaseAuth() {
  if (!_authPromise) {
    _authPromise = Promise.all([
      import('firebase/auth'),
      import('@/lib/firebase.js'),
    ]).then(([fbAuth, fb]) => ({
      onAuthStateChanged: fbAuth.onAuthStateChanged,
      signInWithPopup: fbAuth.signInWithPopup,
      signInWithRedirect: fbAuth.signInWithRedirect,
      signOut: fbAuth.signOut,
      deleteUser: fbAuth.deleteUser,
      auth: fb.auth,
      googleProvider: fb.googleProvider,
    }));
  }
  return _authPromise;
}

const AuthContext = createContext(null);

// Considera "tiene progreso" si hay al menos una lección con datos.
// Lo usamos para decidir si advertir al usuario antes de sobreescribir.
function remoteHasProgress(remote) {
  if (!remote) return false;
  const p = remote.progress || {};
  return Object.keys(p).some(k => k.startsWith('lesson_'));
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);     // FirebaseUser | null
  const [mode, setMode]   = useState('loading'); // 'loading' | 'google' | 'guest' | null
  const [error, setError] = useState(null);
  // Cuando localStorage se hidrata desde fuera (login inicial o sync remoto)
  // se llama a bumpLocalDataRev(): los componentes suscritos con
  // useLocalSnapshot/useLocalDataRev releen su estado (ver useLocalSnapshot.js).

  // Flag activado por migrateGuestToGoogle() para que el handler de auth
  // sepa que viene de modo invitado y aplique merge/confirm en vez de
  // dejar ganar al remoto automáticamente.
  const pendingMigrationRef = useRef(false);
  // unsubscribe del listener onAuthStateChanged y flag de "ya enganchado",
  // para no engancharlo dos veces (mount + signInWithGoogle).
  const authUnsubRef = useRef(null);
  const listenerAttachedRef = useRef(false);

  // Engancha el listener onAuthStateChanged (cargando Firebase de forma
  // diferida). Idempotente: solo lo hace una vez. Lo llaman tanto el efecto
  // de montaje (para usuarios Google que vuelven) como signInWithGoogle.
  const attachAuthListener = useCallback(async () => {
    if (listenerAttachedRef.current) return;
    listenerAttachedRef.current = true;
    const fb = await loadFirebaseAuth();
    authUnsubRef.current = fb.onAuthStateChanged(fb.auth, async (fbUser) => {
      if (fbUser) {
        const isMigrating = pendingMigrationRef.current;
        pendingMigrationRef.current = false;
        try {
          const remote = await fetchRemoteUser(fbUser.uid);
          if (isMigrating && remoteHasProgress(remote)) {
            // El usuario invitado ya tenía cuenta Google con datos.
            // Le preguntamos qué versión conservar.
            const keepCloud = window.confirm(i18n.t('auth_sync_conflict'));
            if (keepCloud) {
              hydrateLocalFromRemote(remote);
            } else {
              await pushRemoteUser(fbUser.uid, snapshotLocal());
            }
          } else if (remote) {
            hydrateLocalFromRemote(remote);
            // Docs creados antes de sincronizar racha/historias/etc. no
            // tienen `extra`: se completa con lo local de este dispositivo.
            if (!remote.extra) {
              await pushRemoteUser(fbUser.uid, snapshotLocal());
            }
          } else {
            // Primer login con esta cuenta: subimos el snapshot local
            // (sea de invitado o de un dispositivo vacío).
            await pushRemoteUser(fbUser.uid, snapshotLocal());
          }
        } catch (e) {
          console.warn('Sync inicial falló:', e);
        }
        // Publica el perfil social (código de amigo + stats visibles). Best
        // effort y diferido: si falla, la app sigue; se reintenta en cada push.
        import('@/lib/socialStore.js')
          .then(s => s.syncPublicProfile({ uid: fbUser.uid, photoURL: fbUser.photoURL }))
          .catch(e => console.warn('Sync perfil público falló:', e));
        setUser(fbUser);
        setMode('google');
        bumpLocalDataRev();
      } else {
        setUser(null);
        let stored = null;
        try { stored = localStorage.getItem(LS_MODE); } catch {}
        setMode(stored === 'guest' ? 'guest' : null);
      }
    });
  }, []);

  // Resolución del modo al arrancar SIN cargar Firebase salvo que haga falta:
  //   - 'guest'  → resolvemos al instante, Firebase nunca se carga.
  //   - 'google' → enganchamos el listener (carga Firebase) para restaurar sesión.
  //   - null     → visitante nuevo: mostramos LoginScreen ya; Firebase se
  //                cargará solo si pulsa "Continuar con Google".
  useEffect(() => {
    let stored = null;
    try { stored = localStorage.getItem(LS_MODE); } catch {}

    if (stored === 'guest') {
      setMode('guest');
    } else if (stored === 'google') {
      attachAuthListener();
    } else {
      setMode(null);
    }

    return () => {
      if (authUnsubRef.current) authUnsubRef.current();
    };
  }, [attachAuthListener]);

  // Listener en tiempo real del doc del usuario logueado. Si otro dispositivo
  // escribe (clientId distinto), hidratamos localStorage y avisamos vía
  // bumpLocalDataRev para que los componentes suscritos vuelvan a leer estado.
  useEffect(() => {
    if (mode !== 'google' || !user) return;
    // subscribeRemoteUser es async (import dinámico de Firestore): si el
    // efecto se limpia antes de que resuelva, desuscribimos al llegar.
    let unsub = null;
    let cancelled = false;
    subscribeRemoteUser(user.uid, (data) => {
      hydrateLocalFromRemote(data);
      bumpLocalDataRev();
    }).then((u) => {
      if (cancelled) u();
      else unsub = u;
    }).catch((e) => console.warn('Listener remoto falló:', e));
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [mode, user]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    // Aseguramos el listener ANTES de loguear: para visitantes nuevos
    // (mode=null) no se enganchó al montar, y sin él no se procesaría el
    // resultado del login.
    await attachAuthListener();
    const fb = await loadFirebaseAuth();
    try {
      await fb.signInWithPopup(fb.auth, fb.googleProvider);
      try { localStorage.setItem(LS_MODE, 'google'); } catch {}
    } catch (e) {
      // Muchos navegadores móviles bloquean popups: caemos a redirect.
      // Tras el redirect, onAuthStateChanged se dispara al volver a cargar
      // la app, así que no hace falta gestionar getRedirectResult aparte.
      if (e?.code === 'auth/popup-blocked' ||
          e?.code === 'auth/operation-not-supported-in-this-environment') {
        try {
          try { localStorage.setItem(LS_MODE, 'google'); } catch {}
          await fb.signInWithRedirect(fb.auth, fb.googleProvider);
          return;
        } catch (e2) {
          console.error('Login Google (redirect) falló:', e2);
          setError(e2.message || 'Login failed');
          return;
        }
      }
      // Cancelado por el usuario: no es un error que mostrar.
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') return;
      console.error('Login Google falló:', e);
      setError(e.message || 'Login failed');
    }
  }, [attachAuthListener]);

  // Versión "desde invitado": marca el flag para que el handler de auth
  // aplique merge en vez de dejar ganar al remoto silenciosamente.
  const migrateGuestToGoogle = useCallback(async () => {
    pendingMigrationRef.current = true;
    await signInWithGoogle();
  }, [signInWithGoogle]);

  const continueAsGuest = useCallback(() => {
    try { localStorage.setItem(LS_MODE, 'guest'); } catch {}
    setMode('guest');
  }, []);

  const signOut = useCallback(async () => {
    try { const fb = await loadFirebaseAuth(); await fb.signOut(fb.auth); } catch {}
    try { localStorage.removeItem(LS_MODE); } catch {}
    // Borra los datos locales: la copia del usuario vive en su doc de
    // Firestore. Sin esto, la siguiente cuenta que entre en este
    // dispositivo heredaría (y subiría a su doc) el progreso del anterior.
    clearLocalUserData();
    // Limpia la caché social (código de amigo memorizado) para que la
    // siguiente cuenta no reutilice el código del usuario anterior.
    try { const s = await import('@/lib/socialStore.js'); s.clearSocialCache(); } catch {}
    setMode(null);
  }, []);

  // Borrado de cuenta (requisito de Google Play y derecho de supresión):
  // 1) borra todos los datos en Firestore, 2) intenta borrar la cuenta de
  // Firebase Auth (puede requerir login reciente — si falla, los DATOS ya no
  // existen, que es lo importante), 3) cierra sesión y limpia lo local.
  const deleteAccount = useCallback(async () => {
    if (mode !== 'google' || !user) return { ok: false };
    let dataOk = false;
    try {
      const s = await import('@/lib/socialStore.js');
      dataOk = await s.deleteAccountData(user.uid);
    } catch (e) {
      console.warn('Borrado de datos falló:', e);
    }
    try {
      const fb = await loadFirebaseAuth();
      if (fb.auth.currentUser) await fb.deleteUser(fb.auth.currentUser);
    } catch (e) {
      // p. ej. auth/requires-recent-login: la cuenta de Auth queda, pero sin
      // ningún dato asociado. El usuario puede reintentar tras re-loguear.
      console.warn('Borrado de cuenta Auth falló (los datos sí se borraron):', e);
    }
    await signOut();
    return { ok: dataOk };
  }, [mode, user, signOut]);

  const pushSnapshot = useCallback(async () => {
    if (mode !== 'google' || !user) return;
    try {
      await pushRemoteUser(user.uid, snapshotLocal());
    } catch (e) {
      console.warn('Push remoto falló:', e);
    }
    // Mantiene el perfil público (nivel, XP, racha) al día para los amigos.
    try {
      const s = await import('@/lib/socialStore.js');
      await s.syncPublicProfile({ uid: user.uid, photoURL: user.photoURL });
    } catch (e) {
      console.warn('Sync perfil público falló:', e);
    }
  }, [mode, user]);

  return (
    <AuthContext.Provider value={{
      user, mode, error,
      signInWithGoogle, migrateGuestToGoogle, continueAsGuest,
      signOut, pushSnapshot, deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

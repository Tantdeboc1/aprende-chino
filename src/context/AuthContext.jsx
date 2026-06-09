// src/context/AuthContext.jsx
// Contexto global de autenticación. Tres estados posibles para `mode`:
//   - 'loading'  → aún resolviendo onAuthStateChanged (mostrar splash/loader)
//   - 'google'   → usuario logueado con Google, datos sincronizan con Firestore
//   - 'guest'    → usuario eligió "continuar como invitado", todo en localStorage
//   - null       → no ha pasado por LoginScreen aún
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase.js';
import {
  fetchRemoteUser, pushRemoteUser, subscribeRemoteUser,
  hydrateLocalFromRemote, snapshotLocal,
} from '@/lib/userStore.js';

const LS_MODE = 'aprende-chino-auth-mode'; // 'google' | 'guest'

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
  // Contador que App.jsx observa para re-hidratar su useState cuando
  // localStorage cambia desde fuera (login inicial o sync remoto).
  const [remoteRev, setRemoteRev] = useState(0);

  // Flag activado por migrateGuestToGoogle() para que el handler de auth
  // sepa que viene de modo invitado y aplique merge/confirm en vez de
  // dejar ganar al remoto automáticamente.
  const pendingMigrationRef = useRef(false);

  // Subscribe a cambios de sesión. onAuthStateChanged dispara una vez al
  // montar con el usuario restaurado (o null) → resolvemos `mode` ahí.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isMigrating = pendingMigrationRef.current;
        pendingMigrationRef.current = false;
        try {
          const remote = await fetchRemoteUser(fbUser.uid);
          if (isMigrating && remoteHasProgress(remote)) {
            // El usuario invitado ya tenía cuenta Google con datos.
            // Le preguntamos qué versión conservar.
            const keepCloud = window.confirm(
              'Ya tienes progreso guardado en la nube con esta cuenta.\n\n' +
              'Aceptar = mantener el de la nube (descarta lo de este dispositivo).\n' +
              'Cancelar = sobrescribir la nube con lo de este dispositivo.',
            );
            if (keepCloud) {
              hydrateLocalFromRemote(remote);
            } else {
              await pushRemoteUser(fbUser.uid, snapshotLocal());
            }
          } else if (remote) {
            hydrateLocalFromRemote(remote);
          } else {
            // Primer login con esta cuenta: subimos el snapshot local
            // (sea de invitado o de un dispositivo vacío).
            await pushRemoteUser(fbUser.uid, snapshotLocal());
          }
        } catch (e) {
          console.warn('Sync inicial falló:', e);
        }
        setUser(fbUser);
        setMode('google');
        setRemoteRev(r => r + 1);
      } else {
        setUser(null);
        let stored = null;
        try { stored = localStorage.getItem(LS_MODE); } catch {}
        setMode(stored === 'guest' ? 'guest' : null);
      }
    });
    return () => unsub();
  }, []);

  // Listener en tiempo real del doc del usuario logueado. Si otro dispositivo
  // escribe (clientId distinto), hidratamos localStorage y subimos remoteRev
  // para que App vuelva a leer estado.
  useEffect(() => {
    if (mode !== 'google' || !user) return;
    const unsub = subscribeRemoteUser(user.uid, (data) => {
      hydrateLocalFromRemote(data);
      setRemoteRev(r => r + 1);
    });
    return () => unsub();
  }, [mode, user]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      try { localStorage.setItem(LS_MODE, 'google'); } catch {}
    } catch (e) {
      console.error('Login Google falló:', e);
      setError(e.message || 'Login failed');
    }
  }, []);

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
    try { await fbSignOut(auth); } catch {}
    try { localStorage.removeItem(LS_MODE); } catch {}
    setMode(null);
  }, []);

  const pushSnapshot = useCallback(async () => {
    if (mode !== 'google' || !user) return;
    try {
      await pushRemoteUser(user.uid, snapshotLocal());
    } catch (e) {
      console.warn('Push remoto falló:', e);
    }
  }, [mode, user]);

  return (
    <AuthContext.Provider value={{
      user, mode, error, remoteRev,
      signInWithGoogle, migrateGuestToGoogle, continueAsGuest,
      signOut, pushSnapshot,
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

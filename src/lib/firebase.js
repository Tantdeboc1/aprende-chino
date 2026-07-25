// src/lib/firebase.js
// Inicialización única del SDK de Firebase. El resto de la app importa
// `auth` y `db` desde aquí — no llamar a initializeApp en otros sitios.
// Firestore NO se importa aquí: solo lo usan los usuarios con cuenta
// Google y se carga bajo demanda desde userStore.js (ahorra ~70 kB gzip
// del arranque a los invitados).
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// La config web de Firebase NO es secreta: viaja en el bundle del cliente
// igualmente y la seguridad la dan las reglas de Firestore y los dominios
// autorizados de OAuth. Los valores hardcodeados son el fallback para
// builds sin .env (CI de GitHub Pages, Vercel); las variables de entorno,
// si existen, tienen prioridad.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDB3ppzDuW1eB1wemRCEE7pzQ0p7WsGAik',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hsk-academy-53806.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hsk-academy-53806',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hsk-academy-53806.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '614465016047',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:614465016047:web:0823369eaa152d6e3d0b1a',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-CXHFB0GJZ9',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// ─── App Check ──────────────────────────────────────────────────────────────
// La config de arriba es pública, así que cualquiera puede copiarla y hablar
// con nuestro Firestore desde un script. Las reglas impiden que lea datos
// ajenos, pero no que cree cuentas en masa y nos queme la cuota. App Check ata
// cada petición a esta app: reCAPTCHA firma la petición y el backend rechaza
// las que no traen token (cuando se activa el enforcement en la consola).
//
// La site key de reCAPTCHA es pública por diseño (viaja en el bundle igual que
// la config). Si no está definida, App Check simplemente no se inicializa: la
// app sigue funcionando igual mientras no se active el enforcement.
// Fallback hardcodeado por el mismo motivo que la config de arriba: el workflow
// de GitHub Pages no pasa variables de entorno al build, así que sin esto App
// Check funcionaría en local y NO se activaría nunca en producción, y encima
// sin dar ningún error. La site key es pública por diseño (viaja en el bundle);
// la que no debe salir de la consola de Firebase es la secret key.
// Comprobación con `undefined` y no con `||`: así poner la variable VACÍA en
// .env.local apaga App Check en desarrollo (evita el ruido de 403 mientras no
// haya token de depuración registrado), mientras que NO definirla —el caso de
// CI— usa el fallback y App Check sí se activa en producción.
const envSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const appCheckSiteKey = envSiteKey !== undefined
  ? envSiteKey
  : '6LfqaWQtAAAAAEHHy0qLC4HTlLTzYt4IF7LXLcTT';

// Import dinámico: el módulo de App Check no entra en el bundle de arranque
// (mismo criterio que Firestore). `appCheckReady` se espera antes de la primera
// petición a Firestore — ver loadFirestore() en userStore.js y socialStore.js —
// para que ninguna salga sin token.
export const appCheckReady = appCheckSiteKey
  ? import('firebase/app-check')
      .then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
        // En desarrollo reCAPTCHA no puede validar localhost: el SDK imprime
        // en consola un token de depuración que hay que registrar en
        // Firebase → App Check → Apps → Gestionar tokens de depuración.
        // Solo en DEV: en producción esto sería una puerta trasera.
        if (import.meta.env.DEV) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        return initializeAppCheck(firebaseApp, {
          provider: new ReCaptchaV3Provider(appCheckSiteKey),
          isTokenAutoRefreshEnabled: true,
        });
      })
      .catch((e) => {
        // Sin App Check la app sigue operando (hasta que se active el
        // enforcement). Lo tragamos para no soltar un unhandled rejection.
        console.warn('[appcheck] no se pudo inicializar:', e);
        return null;
      })
  : Promise.resolve(null);

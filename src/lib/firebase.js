// src/lib/firebase.js
// Inicialización única del SDK de Firebase. El resto de la app importa
// `auth` y `db` desde aquí — no llamar a initializeApp en otros sitios.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

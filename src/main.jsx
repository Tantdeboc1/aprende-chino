// src/main.jsx
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LevelUpHost from './components/LevelUpHost.jsx';
import UpdateToast from './components/ui/UpdateToast.jsx';
import { MusicProvider } from './context/MusicContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './i18n';
import { registerSW } from 'virtual:pwa-register';
import { initErrorTracking } from './utils/errorTracking.js';
import { initTheme } from './utils/theme.js';
import { initFontScale } from './utils/fontScale.js';
import { initHighContrast } from './utils/highContrast.js';
import { setNeedRefresh, setRegistration } from './utils/pwaUpdate.js';

// Aplica el tema guardado ANTES del primer render para evitar parpadeo
// (no se puede usar script inline en index.html por la CSP).
initTheme();
// Aplica el tamaño de texto guardado (accesibilidad) antes del primer render.
initFontScale();
// Aplica el modo de alto contraste guardado (accesibilidad) antes del render.
initHighContrast();

// Service worker PWA — solo existe en builds de producción (en dev el
// plugin está desactivado y registerSW es un no-op). En modo 'prompt'
// (ver vite.config.js) el SW nuevo queda EN ESPERA sin recargar a mitad de
// sesión; onNeedRefresh muestra un toast (UpdateToast) con el botón
// "Actualizar" — si el usuario lo ignora, la versión nueva entra igualmente
// en el próximo arranque.
const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    // Expuesto para el botón "Buscar actualización" de Ajustes.
    setRegistration(registration);
    // registerSW solo comprueba versión nueva UNA vez, al registrar. GitHub
    // Pages sirve sw.js detrás de una CDN con caché de unos minutos, así que
    // justo después de un despliegue el primer check puede no ver la
    // versión nueva todavía. Repetimos el check al volver a la pestaña y
    // cada 5 min mientras la app sigue abierta, en vez de obligar a cerrar
    // y reabrir para enterarse.
    const CHECK_INTERVAL_MS = 5 * 60 * 1000;
    // update() puede rechazar durante una transición de ciclo de vida
    // (pestaña restaurada/cerrándose o Service Worker reemplazándose). No es
    // un fallo de la app: la comprobación se puede reintentar más tarde. Si
    // dejamos la promesa sin capturar, el handler global de Sentry lo reporta
    // como unhandledrejection (InvalidStateError).
    const safeUpdate = () => registration.update().catch(() => {});
    setInterval(safeUpdate, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') safeUpdate();
    });
  },
  onNeedRefresh() {
    // updateSW(true) activa el SW en espera y recarga con los assets nuevos.
    setNeedRefresh(() => updateSW(true));
  },
});

// Seguimiento de errores: handlers globales siempre; Sentry solo si hay DSN.
initErrorTracking();

const Spinner = () => (
  <div className="fixed inset-0 bg-[var(--paper)] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[var(--red)] border-t-transparent rounded-full animate-spin" />
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <MusicProvider>
          <Suspense fallback={<Spinner />}>
            <App />
          </Suspense>
          {/* Host global: muestra LevelUpModal cuando se dispara 'xp-notification' */}
          <LevelUpHost />
          {/* Aviso de nueva versión del SW (modo 'prompt') */}
          <UpdateToast />
        </MusicProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

// Fuentes chinas (@fontsource, ver src/fonts.js): se cargan justo DESPUÉS de
// arrancar el render — sus ~500 @font-face (~195 kB gzip) no bloquean el
// primer pintado. Mientras llegan, el texto usa la fuente de sistema (igual
// que ya ocurría mientras bajaban los woff2, que siempre fueron async con
// font-display:swap). En visitas repetidas el SW las sirve de caché al instante.
import('./fonts.js').catch(() => { /* sin fuentes propias: fallback del sistema */ });

// src/main.jsx
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import LevelUpHost from './components/LevelUpHost.jsx';
import { MusicProvider } from './context/MusicContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './i18n';
import { registerSW } from 'virtual:pwa-register';
import { initErrorTracking } from './utils/errorTracking.js';
import { initTheme } from './utils/theme.js';

// Aplica el tema guardado ANTES del primer render para evitar parpadeo
// (no se puede usar script inline en index.html por la CSP).
initTheme();

// Service worker PWA — solo existe en builds de producción (en dev el
// plugin está desactivado y registerSW es un no-op). En modo 'prompt'
// (ver vite.config.js) NO pasamos onNeedRefresh: el SW nuevo se queda en
// espera sin recargar a mitad de sesión y entra en el próximo arranque.
registerSW({ immediate: true });

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
        </MusicProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

// src/utils/errorTracking.js
// Seguimiento de errores en producción.
//
// - Instala siempre handlers globales (window.onerror + unhandledrejection)
//   para cazar errores que React no atrapa (async, eventos, promesas).
// - Carga Sentry SOLO si hay VITE_SENTRY_DSN configurado, y de forma dinámica,
//   así sin DSN el coste es cero (ni se descarga el SDK).
//
// Para activarlo: pon VITE_SENTRY_DSN en tu .env (ver .env.example). Para ver
// stacks legibles en producción, sube las sourcemaps (se generan 'hidden')
// con @sentry/vite-plugin, que necesita un auth token de Sentry.

let _sentry = null;
let _initialized = false;

export async function initErrorTracking() {
  if (_initialized || typeof window === 'undefined') return;
  _initialized = true;

  window.addEventListener('error', (e) => {
    captureError(e.error || e.message, { source: 'window.onerror' });
  });
  window.addEventListener('unhandledrejection', (e) => {
    captureError(e.reason, { source: 'unhandledrejection' });
  });

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // Sin DSN → solo handlers locales; no se carga el SDK.

  try {
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      // Solo errores (sin performance tracing) para minimizar ruido y coste.
      tracesSampleRate: 0,
    });
    _sentry = Sentry;
  } catch (e) {
    console.warn('[errorTracking] Sentry no se pudo inicializar:', e);
  }
}

/**
 * Reporta un error manualmente (p. ej. desde el ErrorBoundary o un catch).
 * @param {unknown} error
 * @param {object} [context]  datos extra para el reporte
 */
export function captureError(error, context) {
  if (_sentry) {
    const err = error instanceof Error ? error : new Error(String(error));
    _sentry.captureException(err, { extra: context });
  } else if (import.meta.env.DEV) {
    console.error('[errorTracking]', error, context || '');
  }
}

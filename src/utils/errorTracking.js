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

  // El DSN de Sentry es PÚBLICO por diseño (solo permite ENVIAR errores, no
  // leer nada). Lo dejamos como fallback hardcodeado para el build de CI/Pages,
  // que no tiene acceso al .env — mismo criterio que la config de Firebase.
  // Una variable de entorno VITE_SENTRY_DSN lo sobreescribe si la defines.
  const dsn = import.meta.env.VITE_SENTRY_DSN
    || 'https://29142858b727601a7b68d32ea2c16254@o4511574932783104.ingest.de.sentry.io/4511574936911952';

  // Solo activamos Sentry en PRODUCCIÓN: en desarrollo local no queremos
  // inundar el panel con nuestros propios errores y pruebas.
  if (!dsn || !import.meta.env.PROD) return;

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

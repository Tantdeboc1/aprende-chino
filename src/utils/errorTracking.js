// src/utils/errorTracking.js
// Seguimiento de errores en producción — transporte propio, SIN el SDK de Sentry.
//
// El SDK @sentry/browser pesaba ~150 kB gzip para lo único que usamos:
// enviar excepciones. Aquí construimos el evento a mano y lo mandamos al
// endpoint "envelope" de Sentry con un fetch (keepalive), así el coste de
// descarga para el usuario es cero.
//
// - Instala siempre handlers globales (window.onerror + unhandledrejection)
//   para cazar errores que React no atrapa (async, eventos, promesas).
// - Solo ENVÍA a Sentry en producción y desde el dominio oficial (el DSN es
//   público y viaja en el bundle; ver gating abajo).
//
// Para desactivar el envío en un fork: pon VITE_SENTRY_DSN='' o cambia
// VITE_SENTRY_ALLOWED_HOSTS.

import { APP_VERSION } from './version.js';

let _enabled = false;      // ¿podemos enviar a Sentry? (gating pasado)
let _initialized = false;
let _dsn = null;           // { key, endpoint } o null
let _sentCount = 0;        // tope por sesión para no inundar
const _seen = new Set();   // dedup por firma de error
const MAX_EVENTS = 25;

// Descompone el DSN `https://KEY@HOST/PROJECT_ID` en el endpoint de ingesta.
function parseDsn(dsn) {
  const m = /^https:\/\/([0-9a-f]+)@([^/]+)\/(\d+)$/i.exec(String(dsn || ''));
  if (!m) return null;
  const [, key, host, projectId] = m;
  return {
    key,
    endpoint: `https://${host}/api/${projectId}/envelope/?sentry_key=${key}&sentry_version=7`,
  };
}

// Parseo mínimo del stack a frames de Sentry. Cubre los dos formatos comunes:
//   Chrome/Edge:  "    at fn (url:line:col)"  /  "    at url:line:col"
//   Firefox/Safari: "fn@url:line:col"
function parseStack(stack) {
  if (!stack || typeof stack !== 'string') return [];
  const frames = [];
  for (const raw of stack.split('\n')) {
    const line = raw.trim();
    let m = /^at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/.exec(line);
    if (!m) m = /^(.*?)@(.+?):(\d+):(\d+)$/.exec(line);
    if (!m) continue;
    frames.push({
      function: m[1] || '?',
      filename: m[2],
      lineno: Number(m[3]),
      colno: Number(m[4]),
      in_app: !m[2].includes('node_modules'),
    });
  }
  // Sentry espera los frames de más antiguo a más reciente (el que rompe, último).
  return frames.reverse();
}

function eventId() {
  try {
    return crypto.randomUUID().replace(/-/g, '');
  } catch {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
}

function buildEvent(error, context) {
  const err = error instanceof Error ? error : new Error(String(error));
  const frames = parseStack(err.stack);
  return {
    event_id: eventId(),
    timestamp: Date.now() / 1000,
    platform: 'javascript',
    level: 'error',
    logger: 'errorTracking',
    release: APP_VERSION,
    environment: import.meta.env.MODE,
    exception: {
      values: [{
        type: err.name || 'Error',
        value: err.message || String(error),
        ...(frames.length ? { stacktrace: { frames } } : {}),
      }],
    },
    request: {
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      headers: typeof navigator !== 'undefined' ? { 'User-Agent': navigator.userAgent } : undefined,
    },
    ...(context ? { extra: context } : {}),
    ...(context?.source ? { tags: { source: context.source } } : {}),
  };
}

function send(event) {
  if (!_dsn) return;
  // Formato "envelope": cabecera + item header + payload, separados por \n.
  const body =
    JSON.stringify({ event_id: event.event_id, sent_at: new Date().toISOString() }) + '\n' +
    JSON.stringify({ type: 'event' }) + '\n' +
    JSON.stringify(event);
  try {
    fetch(_dsn.endpoint, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      keepalive: true, // sobrevive a la descarga de la página
    }).catch(() => {});
  } catch { /* noop */ }
}

export function initErrorTracking() {
  if (_initialized || typeof window === 'undefined') return;
  _initialized = true;

  window.addEventListener('error', (e) => {
    captureError(e.error || e.message, { source: 'window.onerror' });
  });
  window.addEventListener('unhandledrejection', (e) => {
    captureError(e.reason, { source: 'unhandledrejection' });
  });

  // El DSN de Sentry es PÚBLICO por diseño (solo permite ENVIAR errores, no
  // leer nada). Fallback hardcodeado para el build de CI/Pages, que no tiene
  // acceso al .env — mismo criterio que la config de Firebase. VITE_SENTRY_DSN
  // lo sobreescribe.
  const dsn = import.meta.env.VITE_SENTRY_DSN
    || 'https://29142858b727601a7b68d32ea2c16254@o4511574932783104.ingest.de.sentry.io/4511574936911952';

  // Solo enviamos en PRODUCCIÓN: en desarrollo no queremos inundar el panel.
  if (!dsn || !import.meta.env.PROD) return;

  // Y solo desde el dominio oficial: como el DSN viaja en el bundle, cualquier
  // fork desplegado en otro github.io enviaría sus errores a NUESTRO Sentry.
  const allowedHosts = (import.meta.env.VITE_SENTRY_ALLOWED_HOSTS || 'tantdeboc1.github.io')
    .split(',').map((h) => h.trim()).filter(Boolean);
  if (!allowedHosts.includes(window.location.hostname)) return;

  _dsn = parseDsn(dsn);
  _enabled = !!_dsn;
}

/**
 * Reporta un error manualmente (p. ej. desde el ErrorBoundary o un catch).
 * @param {unknown} error
 * @param {object} [context]  datos extra para el reporte
 */
export function captureError(error, context) {
  if (!_enabled) {
    if (import.meta.env.DEV) console.error('[errorTracking]', error, context || '');
    return;
  }
  if (_sentCount >= MAX_EVENTS) return;
  // Dedup por firma simple (nombre+mensaje+primera línea del stack).
  const err = error instanceof Error ? error : null;
  const sig = `${err?.name || ''}:${err?.message || String(error)}:${(err?.stack || '').split('\n')[1] || ''}`;
  if (_seen.has(sig)) return;
  _seen.add(sig);
  _sentCount += 1;
  send(buildEvent(error, context));
}

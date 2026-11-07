// src/utils/analytics.js
// Analítica ligera: registra eventos de uso (vídeos vistos, etc.) sin SDK pesado.
// En producción envía a VITE_ANALYTICS_ENDPOINT si está configurado; si no, no hace nada.
// En desarrollo, loguea en consola para depuración.

const ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT || '';

export function trackEvent(name, props = {}) {
  const payload = {
    name,
    props,
    ts: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    lang: typeof navigator !== 'undefined' ? navigator.language : undefined,
  };

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, props);
  }

  if (!ENDPOINT || typeof window === 'undefined') return;

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    }
  } catch {
    // noop
  }
}
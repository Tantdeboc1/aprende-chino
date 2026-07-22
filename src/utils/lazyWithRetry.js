// src/utils/lazyWithRetry.js
// React.lazy() endurecido contra el fallo de chunk tras un despliegue.
//
// El problema: los chunks llevan hash en el nombre (LoginScreen-BSjhDean.js) y
// GitHub Pages solo sirve los del último build. Si el usuario tiene abierto (o
// cacheado) un index.html anterior, el import() dinámico apunta a un archivo que
// ya no existe → "Failed to fetch dynamically imported module". La misma
// excepción sale con un corte de red puntual a mitad de descarga.
//
// Por qué no basta con dejarlo caer al ErrorBoundary: React.lazy MEMORIZA la
// promesa rechazada, así que volver a renderizar el mismo componente re-lanza el
// error para siempre. En una pantalla de paso sería molesto; en LoginScreen —que
// es la puerta de entrada— deja al usuario sin app hasta que vacía el caché.
//
// Estrategia, de menos a más agresiva:
//   1. Reintentar el import una vez (basta para el corte de red puntual).
//   2. Si el SW tiene una versión en espera, activarla: recarga con el
//      index.html nuevo, cuyos hashes sí existen.
//   3. Si no hay versión en espera, recargar a secas.
// Con un único intento por ventana de tiempo, para no entrar en bucle de
// recargas si el fallo es de otra naturaleza.
import { lazy } from 'react';
import { getPendingUpdate } from './pwaUpdate.js';

const RELOAD_KEY = 'chunkReloadAt';
const RELOAD_COOLDOWN_MS = 60_000;

// Mensaje del fallo según el motor: Chrome/Edge, Firefox y Safari lo redactan
// distinto. Se compara en minúsculas.
const CHUNK_ERROR_RE =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|'text\/html' is not a valid javascript mime type/;

/** ¿Es este error un chunk que no se pudo descargar (y no un fallo del módulo)? */
export function isChunkLoadError(error) {
  return CHUNK_ERROR_RE.test(String(error?.message || '').toLowerCase());
}

/**
 * Recarga forzando la versión nueva. Devuelve false si ya se intentó hace poco
 * (el guardarraíl anti-bucle) y por tanto NO se ha recargado.
 */
export function reloadForFreshBuild() {
  let last = 0;
  try { last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0; } catch { /* modo privado */ }
  if (Date.now() - last < RELOAD_COOLDOWN_MS) return false;
  try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())); } catch { /* modo privado */ }

  const activateWaitingSW = getPendingUpdate();
  // updateSW(true) activa el SW en espera y recarga él mismo.
  if (activateWaitingSW) activateWaitingSW();
  else window.location.reload();
  return true;
}

/**
 * Envuelve una factory de import() con la política de recuperación. Se exporta
 * aparte de lazyWithRetry para poder probarla como una promesa normal, sin
 * montar React ni hurgar en los internals del componente lazy.
 * @param {() => Promise<unknown>} factory
 * @returns {() => Promise<unknown>}
 */
export function withChunkRetry(factory) {
  return () =>
    factory().catch((error) => {
      if (!isChunkLoadError(error)) throw error;

      return factory().catch((retryError) => {
        if (!isChunkLoadError(retryError) || !reloadForFreshBuild()) throw retryError;
        // La recarga ya está en marcha. Devolvemos una promesa que nunca
        // resuelve para que Suspense mantenga su fallback en lugar de enseñar
        // la pantalla de error durante el parpadeo previo a la recarga.
        return new Promise(() => {});
      });
    });
}

/**
 * Igual que React.lazy(), pero se recupera de un chunk perdido.
 * @param {() => Promise<{default: React.ComponentType}>} factory
 */
export function lazyWithRetry(factory) {
  return lazy(withChunkRetry(factory));
}

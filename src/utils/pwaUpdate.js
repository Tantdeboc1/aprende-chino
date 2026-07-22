// src/utils/pwaUpdate.js
// Puente entre registerSW (main.jsx) y el toast de "nueva versión" (UpdateToast).
//
// registerSW detecta que hay un SW nuevo EN ESPERA (modo 'prompt') y llama a
// setNeedRefresh() con la función que lo activa. El toast se suscribe con
// onNeedRefresh(); si el aviso llegó antes de que React montara, se entrega
// al suscribirse (no se pierde).

let pendingUpdate = null;
const listeners = new Set();

/** Llamado por main.jsx cuando hay una versión nueva esperando. */
export function setNeedRefresh(updateFn) {
  pendingUpdate = updateFn;
  for (const l of listeners) l(updateFn);
}

/**
 * Suscribe un listener; recibe la función `update()` que activa el SW nuevo
 * (y recarga la página). Devuelve la función de desuscripción.
 */
export function onNeedRefresh(listener) {
  listeners.add(listener);
  if (pendingUpdate) listener(pendingUpdate);
  return () => listeners.delete(listener);
}

/**
 * La función de activación pendiente, o null si no hay versión en espera.
 * La usa lazyWithRetry: cuando un chunk no carga porque el despliegue cambió
 * bajo los pies del usuario, activar el SW nuevo arregla la sesión de raíz
 * (trae el index.html nuevo, con los hashes que sí existen).
 */
export function getPendingUpdate() {
  return pendingUpdate;
}

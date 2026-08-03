// src/utils/pwaUpdate.js
// Puente entre registerSW (main.jsx) y el toast de "nueva versión" (UpdateToast).
//
// registerSW detecta que hay un SW nuevo EN ESPERA (modo 'prompt') y llama a
// setNeedRefresh() con la función que lo activa. El toast se suscribe con
// onNeedRefresh(); si el aviso llegó antes de que React montara, se entrega
// al suscribirse (no se pierde).

let pendingUpdate = null;
const listeners = new Set();
let registrationRef = null;

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

/** Llamado por main.jsx con el registration del SW, para poder forzar checks manuales. */
export function setRegistration(registration) {
  registrationRef = registration;
}

/**
 * Fuerza una comprobación de actualización bajo demanda (botón "Buscar
 * actualización" en Ajustes). No es más fiable que el check automático — GH
 * Pages puede seguir sirviendo el sw.js viejo desde su CDN — pero da control
 * percibido: el usuario no tiene que esperar al siguiente ciclo de 5 min.
 * Devuelve: true (hay versión nueva), false (ya tiene la última) o null (SW
 * no disponible, p.ej. en dev).
 */
export function checkForUpdate() {
  if (!registrationRef) return Promise.resolve(null);
  return registrationRef.update().catch(() => { /* offline u otro fallo de red */ }).then(() => {
    if (pendingUpdate) return true;
    return new Promise((resolve) => {
      let done = false;
      let unsub;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        unsub();
        resolve(false);
      }, 4000);
      unsub = onNeedRefresh(() => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        unsub();
        resolve(true);
      });
    });
  });
}

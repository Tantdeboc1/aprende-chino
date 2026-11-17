// La versión de producción llega desde el flujo de despliegue (VITE_APP_VERSION).
// En desarrollo, Vite usa el valor base de package.json.
export const APP_VERSION = import.meta.env.VITE_APP_VERSION;

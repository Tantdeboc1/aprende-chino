// src/utils/lazyWithRetry.test.js
// Cubre el fallo de chunk tras un despliegue (el error de Sentry
// "Failed to fetch dynamically imported module" en LoginScreen).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isChunkLoadError, reloadForFreshBuild, withChunkRetry, lazyWithRetry } from './lazyWithRetry.js';
import { setNeedRefresh } from './pwaUpdate.js';

const chunkError = () => new TypeError(
  'Failed to fetch dynamically imported module: https://x/assets/LoginScreen-BSjhDean.js',
);

let reloadSpy;

beforeEach(() => {
  sessionStorage.clear();
  setNeedRefresh(null); // sin versión del SW en espera, salvo que el test la ponga
  reloadSpy = vi.fn();
  // location.reload no es sustituible en jsdom sin redefinir la propiedad.
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, reload: reloadSpy },
  });
});

afterEach(() => vi.restoreAllMocks());

describe('isChunkLoadError', () => {
  it('reconoce el mensaje de los tres motores', () => {
    for (const msg of [
      'Failed to fetch dynamically imported module: https://x/assets/a-1.js', // Chrome
      'error loading dynamically imported module: https://x/assets/a-1.js',   // Firefox
      'Importing a module script failed.',                                    // Safari
    ]) {
      expect(isChunkLoadError(new TypeError(msg))).toBe(true);
    }
  });

  it('no confunde un error del propio módulo con un chunk perdido', () => {
    expect(isChunkLoadError(new TypeError("Cannot read properties of undefined"))).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });
});

describe('reloadForFreshBuild', () => {
  it('recarga cuando no hay versión del SW en espera', () => {
    expect(reloadForFreshBuild()).toBe(true);
    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  it('prefiere activar el SW en espera (trae el index.html nuevo)', () => {
    const activate = vi.fn();
    setNeedRefresh(activate);
    expect(reloadForFreshBuild()).toBe(true);
    expect(activate).toHaveBeenCalledOnce();
    expect(reloadSpy).not.toHaveBeenCalled(); // updateSW(true) recarga por su cuenta
  });

  it('no entra en bucle: un solo intento por ventana de tiempo', () => {
    expect(reloadForFreshBuild()).toBe(true);
    expect(reloadForFreshBuild()).toBe(false);
    expect(reloadForFreshBuild()).toBe(false);
    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  it('vuelve a permitir recargar pasada la ventana', () => {
    reloadForFreshBuild();
    sessionStorage.setItem('chunkReloadAt', String(Date.now() - 61_000));
    expect(reloadForFreshBuild()).toBe(true);
    expect(reloadSpy).toHaveBeenCalledTimes(2);
  });
});

describe('withChunkRetry', () => {
  it('reintenta una vez: un corte de red puntual no llega al usuario', async () => {
    const mod = { default: () => null };
    const factory = vi.fn()
      .mockRejectedValueOnce(chunkError())
      .mockResolvedValueOnce(mod);

    await expect(withChunkRetry(factory)()).resolves.toBe(mod);
    expect(factory).toHaveBeenCalledTimes(2);
    expect(reloadSpy).not.toHaveBeenCalled(); // el reintento bastó
  });

  it('si el reintento también falla, recarga para traer el build nuevo', async () => {
    const factory = vi.fn().mockRejectedValue(chunkError());

    // La promesa se queda pendiente a propósito mientras el navegador recarga:
    // así Suspense mantiene su fallback en vez de parpadear a la pantalla de error.
    const settled = await Promise.race([
      withChunkRetry(factory)().then(() => 'resuelta', () => 'rechazada'),
      new Promise(r => setTimeout(() => r('pendiente'), 20)),
    ]);

    expect(factory).toHaveBeenCalledTimes(2);
    expect(reloadSpy).toHaveBeenCalledOnce();
    expect(settled).toBe('pendiente');
  });

  it('con el guardarraíl agotado propaga el error (lo verá el ErrorBoundary)', async () => {
    sessionStorage.setItem('chunkReloadAt', String(Date.now())); // ya se recargó
    const factory = vi.fn().mockRejectedValue(chunkError());

    await expect(withChunkRetry(factory)()).rejects.toThrow(/dynamically imported module/);
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it('un error real del módulo no se reintenta ni recarga', async () => {
    const boom = new TypeError('x is not a function');
    const factory = vi.fn().mockRejectedValue(boom);

    await expect(withChunkRetry(factory)()).rejects.toThrow(boom);
    expect(factory).toHaveBeenCalledOnce(); // sin reintento: no es un chunk perdido
    expect(reloadSpy).not.toHaveBeenCalled();
  });
});

describe('lazyWithRetry', () => {
  it('devuelve un componente lazy utilizable por React', () => {
    const Comp = lazyWithRetry(() => Promise.resolve({ default: () => null }));
    expect(Comp.$$typeof).toBe(Symbol.for('react.lazy'));
  });
});

// src/utils/pwaUpdate.test.js
// Estado a nivel de módulo (pendingUpdate, listeners, registrationRef) —
// se resetea el módulo entre tests para que no se contaminen entre sí.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let setNeedRefresh, onNeedRefresh, getPendingUpdate, setRegistration, checkForUpdate;

beforeEach(async () => {
  vi.resetModules();
  ({ setNeedRefresh, onNeedRefresh, getPendingUpdate, setRegistration, checkForUpdate } =
    await import('./pwaUpdate.js'));
});

afterEach(() => vi.useRealTimers());

describe('setNeedRefresh / onNeedRefresh', () => {
  it('sin ninguna actualización pendiente, no hay nada que reportar', () => {
    expect(getPendingUpdate()).toBeNull();
  });

  it('notifica a los listeners ya suscritos cuando llega una actualización', () => {
    const listener = vi.fn();
    onNeedRefresh(listener);
    const updateFn = () => {};
    setNeedRefresh(updateFn);
    expect(listener).toHaveBeenCalledWith(updateFn);
    expect(getPendingUpdate()).toBe(updateFn);
  });

  it('un suscriptor tardío recibe la actualización pendiente al suscribirse (no se pierde)', () => {
    const updateFn = () => {};
    setNeedRefresh(updateFn);
    const listener = vi.fn();
    onNeedRefresh(listener);
    expect(listener).toHaveBeenCalledWith(updateFn);
  });

  it('desuscribirse detiene notificaciones futuras', () => {
    const listener = vi.fn();
    const unsub = onNeedRefresh(listener);
    unsub();
    setNeedRefresh(() => {});
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('checkForUpdate', () => {
  it('sin registration (SW no disponible, p.ej. en dev), resuelve null', async () => {
    await expect(checkForUpdate()).resolves.toBeNull();
  });

  it('si ya hay una actualización pendiente tras el update(), resuelve true de inmediato', async () => {
    setRegistration({ update: vi.fn().mockResolvedValue() });
    setNeedRefresh(() => {});
    await expect(checkForUpdate()).resolves.toBe(true);
  });

  it('si llega una actualización mientras se espera, resuelve true', async () => {
    setRegistration({ update: vi.fn().mockResolvedValue() });
    const promise = checkForUpdate();
    setNeedRefresh(() => {}); // llega justo después de pedir el check
    await expect(promise).resolves.toBe(true);
  });

  it('si no llega nada en 4s, resuelve false (ya tiene la última versión)', async () => {
    vi.useFakeTimers();
    setRegistration({ update: vi.fn().mockResolvedValue() });
    const promise = checkForUpdate();
    const assertion = expect(promise).resolves.toBe(false);
    await vi.advanceTimersByTimeAsync(4000);
    await assertion;
  });

  it('si update() falla (offline), no revienta: sigue esperando y resuelve false pasado el timeout', async () => {
    vi.useFakeTimers();
    setRegistration({ update: vi.fn().mockRejectedValue(new Error('offline')) });
    const promise = checkForUpdate();
    const assertion = expect(promise).resolves.toBe(false);
    await vi.advanceTimersByTimeAsync(4000);
    await assertion;
  });
});

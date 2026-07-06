// src/utils/backup.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { buildBackup, restoreBackup } from './backup.js';
import { STORAGE_KEYS } from './storageKeys.js';

beforeEach(() => localStorage.clear());

describe('buildBackup', () => {
  it('incluye solo las claves de usuario presentes', () => {
    localStorage.setItem(STORAGE_KEYS.USERNAME, 'Test');
    localStorage.setItem(STORAGE_KEYS.PROGRESS, '{"1":{}}');
    localStorage.setItem('clave-ajena', 'no debe entrar');
    const b = buildBackup();
    expect(b.app).toBe('aprende-chino');
    expect(b.data[STORAGE_KEYS.USERNAME]).toBe('Test');
    expect(b.data[STORAGE_KEYS.PROGRESS]).toBe('{"1":{}}');
    expect(b.data['clave-ajena']).toBeUndefined();
    expect(b.data[STORAGE_KEYS.STREAK]).toBeUndefined(); // ausente → no se exporta
  });
});

describe('restoreBackup', () => {
  it('restaura un backup válido (round-trip)', () => {
    localStorage.setItem(STORAGE_KEYS.USERNAME, 'Test');
    localStorage.setItem(STORAGE_KEYS.PROGRESS, '{"1":{"visto":true}}');
    const json = JSON.stringify(buildBackup());
    localStorage.clear();
    const n = restoreBackup(json);
    expect(n).toBe(2);
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBe('Test');
    expect(localStorage.getItem(STORAGE_KEYS.PROGRESS)).toBe('{"1":{"visto":true}}');
  });

  it('ignora claves fuera de la lista blanca', () => {
    const json = JSON.stringify({
      app: 'aprende-chino',
      data: { [STORAGE_KEYS.USERNAME]: 'X', 'aprende-chino-auth-mode': 'google', otra: 'y' },
    });
    restoreBackup(json);
    expect(localStorage.getItem(STORAGE_KEYS.USERNAME)).toBe('X');
    expect(localStorage.getItem('aprende-chino-auth-mode')).toBeNull(); // solo-local, no restaurable
    expect(localStorage.getItem('otra')).toBeNull();
  });

  it('rechaza JSON inválido', () => {
    expect(() => restoreBackup('no es json')).toThrow('invalid-json');
  });

  it('rechaza backups de otra app o sin data', () => {
    expect(() => restoreBackup('{"app":"otra","data":{}}')).toThrow('invalid-backup');
    expect(() => restoreBackup('{"app":"aprende-chino"}')).toThrow('invalid-backup');
  });

  it('rechaza backups sin claves útiles', () => {
    expect(() => restoreBackup('{"app":"aprende-chino","data":{"x":"y"}}')).toThrow('empty-backup');
  });
});

// src/utils/hanziCharData.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { hanziCharDataLoader, runWriterOp } from './hanziCharData.js';

afterEach(() => vi.unstubAllGlobals());

describe('hanziCharDataLoader', () => {
  it('en éxito, llama a onComplete con el JSON de trazos', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ strokes: ['M1'] }) })));
    const onComplete = vi.fn();
    const onError = vi.fn();

    hanziCharDataLoader('你', onComplete, onError);
    await new Promise((r) => setTimeout(r, 0));

    expect(onComplete).toHaveBeenCalledWith({ strokes: ['M1'] });
    expect(onError).not.toHaveBeenCalled();
  });

  it('respuesta no-ok llama a onError, no a onComplete', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404 })));
    const onComplete = vi.fn();
    const onError = vi.fn();

    hanziCharDataLoader('谢', onComplete, onError);
    await new Promise((r) => setTimeout(r, 0));

    expect(onComplete).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('codifica el carácter en la URL', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({}) }));
    vi.stubGlobal('fetch', fetchMock);

    hanziCharDataLoader('你', () => {}, () => {});
    await new Promise((r) => setTimeout(r, 0));

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent('你')));
  });
});

describe('runWriterOp', () => {
  it('devuelve el valor si la operación no es una promesa', () => {
    expect(runWriterOp(() => 42)).toBe(42);
  });

  it('si la operación lanza de forma síncrona, devuelve undefined sin propagar', () => {
    expect(runWriterOp(() => { throw new Error('sin datos de trazos'); })).toBeUndefined();
  });

  it('si la operación devuelve una promesa rechazada, no deja una unhandled rejection', async () => {
    const result = runWriterOp(() => Promise.reject(new Error('falló a medias')));
    await expect(result).resolves.toBeUndefined();
  });

  it('si la operación devuelve una promesa resuelta, la conserva', async () => {
    const result = runWriterOp(() => Promise.resolve('ok'));
    await expect(result).resolves.toBe('ok');
  });
});

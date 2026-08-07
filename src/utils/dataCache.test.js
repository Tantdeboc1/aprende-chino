// src/utils/dataCache.test.js
// jsdom no implementa la Cache Storage API. `dataCache.js` decide si usarla
// con `const hasCacheApi = typeof caches !== 'undefined'` A NIVEL DE MÓDULO
// (se evalúa una sola vez, al importar) — stubear `global.caches` DESPUÉS de
// importar no tendría ningún efecto. Por eso cada test resetea los módulos y
// re-importa dinámicamente tras aplicar el stub.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { APP_VERSION } from './version.js';

function fakeCaches() {
  const stores = new Map(); // cacheName -> Map(url -> Response)
  return {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async match(url) { return store.get(url); },
        async put(url, res) { store.set(url, res); },
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
  };
}

let fetchJsonCached;

beforeEach(async () => {
  vi.resetModules();
  vi.stubGlobal('caches', fakeCaches());
  ({ fetchJsonCached } = await import('./dataCache.js'));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchJsonCached', () => {
  it('añade ?v=<APP_VERSION> a la URL y devuelve el JSON', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      clone: function () { return this; },
      json: async () => ({ hola: 'mundo' }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const data = await fetchJsonCached('libro-data', '/data/libro-data.json');
    expect(data).toEqual({ hola: 'mundo' });
    expect(fetchMock).toHaveBeenCalledWith(`/data/libro-data.json?v=${APP_VERSION}`);
  });

  it('en la segunda llamada con la misma URL, sirve desde caché sin volver a llamar a fetch', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      clone: function () { return this; },
      json: async () => ({ n: 1 }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchJsonCached('x', '/data/x.json');
    await fetchJsonCached('x', '/data/x.json');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('respuesta no-ok lanza un error en vez de devolver JSON silenciosamente', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })));
    await expect(fetchJsonCached('x', '/data/roto.json')).rejects.toThrow();
  });

  it('URL que ya trae query string usa "&" en vez de "?" para el parámetro de versión', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      clone: function () { return this; },
      json: async () => ({}),
    }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchJsonCached('x', '/data/x.json?lang=es');
    expect(fetchMock).toHaveBeenCalledWith(`/data/x.json?lang=es&v=${APP_VERSION}`);
  });

  it('sin Cache API disponible (fallback), no revienta y sigue funcionando con fetch directo', async () => {
    vi.stubGlobal('caches', undefined);
    vi.resetModules();
    ({ fetchJsonCached } = await import('./dataCache.js'));

    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ ok: 1 }) }));
    vi.stubGlobal('fetch', fetchMock);

    const data = await fetchJsonCached('x', '/data/x.json');
    expect(data).toEqual({ ok: 1 });
    // Sin caché, cada llamada repite la petición de red.
    await fetchJsonCached('x', '/data/x.json');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

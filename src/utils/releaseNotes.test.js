import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadReleaseNotes } from './releaseNotes.js';

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('loadReleaseNotes', () => {
  it('consulta la publicación sin caché y elige el idioma base', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ version: 'v2', notes: { es: ['Mejora'], en: ['Improvement'] } }) });
    vi.stubGlobal('fetch', fetchMock);
    expect(await loadReleaseNotes('es-ES')).toEqual({ version: 'v2', notes: ['Mejora'] });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/release-notes\.json\?t=\d+$/), { cache: 'no-store' });
  });

  it('rechaza un archivo incompleto y usa inglés si falta el idioma', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ version: 'v2', notes: { en: ['New'] } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ version: 'v2', notes: { en: [] } }) }));
    expect((await loadReleaseNotes('fr')).notes).toEqual(['New']);
    await expect(loadReleaseNotes('en')).rejects.toThrow();
  });
});

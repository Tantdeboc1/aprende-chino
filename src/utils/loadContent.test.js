// src/utils/loadContent.test.js
// Usa los chunks reales generados por scripts/split-i18n-data.mjs (el hook de
// pre-commit los regenera vía `pretest`) — no hace falta mockear los imports
// dinámicos para probar la resolución de idioma y la caché en memoria.
import { describe, it, expect } from 'vitest';
import { loadGrammarData, loadCulturalData, loadReadingStories, loadTranslationPhrases } from './loadContent.js';

describe('loadContent', () => {
  it('carga los datos de gramática en español', async () => {
    const data = await loadGrammarData('es');
    expect(data).toBeTruthy();
    expect(typeof data).toBe('object');
  });

  it('un código de idioma regional ("es-MX") se normaliza a su base ("es")', async () => {
    const regional = await loadGrammarData('es-MX');
    const base = await loadGrammarData('es');
    expect(regional).toEqual(base);
  });

  it('un idioma no soportado cae al inglés', async () => {
    const unsupported = await loadGrammarData('zh');
    const en = await loadGrammarData('en');
    expect(unsupported).toEqual(en);
  });

  it('llamadas repetidas para el mismo idioma devuelven el mismo objeto cacheado', async () => {
    const first = await loadGrammarData('fr');
    const second = await loadGrammarData('fr');
    expect(first).toBe(second); // misma referencia: no se ha vuelto a importar
  });

  it('carga datos culturales, historias de lectura y frases de traducción', async () => {
    const [cultural, reading, phrases] = await Promise.all([
      loadCulturalData('es'),
      loadReadingStories('es'),
      loadTranslationPhrases('es'),
    ]);
    expect(cultural).toBeTruthy();
    expect(Array.isArray(reading)).toBe(true);
    expect(Array.isArray(phrases)).toBe(true);
  });

  it('las cachés de cada tipo de contenido son independientes entre sí', async () => {
    const grammar = await loadGrammarData('de');
    const cultural = await loadCulturalData('de');
    expect(grammar).not.toBe(cultural);
  });
});

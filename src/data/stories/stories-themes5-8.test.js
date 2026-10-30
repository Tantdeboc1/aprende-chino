import { describe, expect, it } from 'vitest';
import { newStories } from './stories-themes5-8.js';

describe('new stories', () => {
  it('provides two translated stories for each remaining lesson with valid exercises', () => {
    expect(newStories).toHaveLength(8);
    for (const lesson of [5, 6, 7, 8]) expect(newStories.filter(s => s.tema === lesson)).toHaveLength(2);
    for (const story of newStories) {
      expect(story.escenas.length).toBeGreaterThanOrEqual(5);
      expect(story.ejercicios.completar).toHaveLength(2);
      for (const q of story.ejercicios.completar) {
        expect(q.frase).toContain('___');
        expect(q.opciones).toHaveLength(4);
        expect(story.escenas.some(scene => scene.chino === q.frase.replace('___', q.opciones[q.correcta]))).toBe(true);
      }
      for (const lang of ['es', 'en', 'fr', 'de', 'it', 'pt']) {
        expect(story.tituloTr[lang]).toBeTruthy();
        for (const scene of story.escenas) expect(lang === 'es' ? scene.traduccion : scene.traduccionTr[lang]).toBeTruthy();
        for (const q of story.ejercicios.traduccion) {
          const options = lang === 'es' ? q.opciones : q.opcionesTr[lang];
          expect(options).toHaveLength(4);
          expect(new Set(options).size).toBe(4);
          expect(options.every(Boolean)).toBe(true);
        }
      }
      expect(story.ejercicios.comprension[0].opciones[0]).toBeTruthy();
    }
  });
});

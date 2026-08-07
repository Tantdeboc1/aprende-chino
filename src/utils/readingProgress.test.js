// src/utils/readingProgress.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { loadReadingProgress, recordReadingResult } from './readingProgress.js';

beforeEach(() => localStorage.clear());

describe('readingProgress', () => {
  it('sin progreso guardado, devuelve un objeto vacío', () => {
    expect(loadReadingProgress()).toEqual({});
  });

  it('registra el resultado de una historia', () => {
    const progress = recordReadingResult('rc-t1-1', 2, 3);
    expect(progress['rc-t1-1']).toMatchObject({ completada: true, mejorPuntuacion: 2, maxPuntuacion: 3 });
    expect(loadReadingProgress()['rc-t1-1'].completada).toBe(true);
  });

  it('conserva la mejor puntuación entre intentos (no la baja)', () => {
    recordReadingResult('rc-t1-1', 3, 3);
    const progress = recordReadingResult('rc-t1-1', 1, 3); // peor intento después
    expect(progress['rc-t1-1'].mejorPuntuacion).toBe(3);
  });

  it('mejora la puntuación si el nuevo intento es mejor', () => {
    recordReadingResult('rc-t1-1', 1, 3);
    const progress = recordReadingResult('rc-t1-1', 3, 3);
    expect(progress['rc-t1-1'].mejorPuntuacion).toBe(3);
  });

  it('sin storyId no hace nada y devuelve el progreso tal cual', () => {
    recordReadingResult('rc-t1-1', 2, 3);
    const before = loadReadingProgress();
    const after = recordReadingResult(null, 5, 5);
    expect(after).toEqual(before);
  });
});

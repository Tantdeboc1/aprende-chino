// src/utils/quizEngine.test.js
import { describe, it, expect } from 'vitest';
import { meaningOf, buildMeaningQuestions } from './quizEngine.js';

const pool = [
  { char: '好', meaning: 'good' },
  { char: '我', meaning: 'I' },
  { char: '你', meaning: 'you' },
  { char: '是', meaning: 'to be' },
  { char: '人', meaning: 'person' },
];

describe('meaningOf', () => {
  it('lee meaning plano', () => expect(meaningOf({ meaning: 'good' })).toBe('good'));
  it('cae a meanings.es', () => expect(meaningOf({ meanings: { es: 'bueno' } })).toBe('bueno'));
  it('tolera null', () => expect(meaningOf(null)).toBe(''));
});

describe('buildMeaningQuestions', () => {
  it('genera el número pedido de preguntas', () => {
    expect(buildMeaningQuestions(pool, 3).length).toBe(3);
  });

  it('acota al tamaño del pool', () => {
    expect(buildMeaningQuestions(pool, 99).length).toBe(5);
  });

  it('la respuesta es el significado del correcto y está entre las opciones', () => {
    for (const q of buildMeaningQuestions(pool, 5)) {
      expect(q.answer).toBe(meaningOf(q.correct));
      expect(q.options).toContain(q.answer);
    }
  });

  it('4 opciones por defecto, sin duplicados', () => {
    for (const q of buildMeaningQuestions(pool, 5)) {
      expect(q.options.length).toBe(4);
      expect(new Set(q.options).size).toBe(4);
    }
  });

  it('descarta caracteres sin char o sin significado', () => {
    const dirty = [...pool, { char: '', meaning: 'x' }, { char: '空' }];
    expect(buildMeaningQuestions(dirty, 99).length).toBe(5);
  });
});

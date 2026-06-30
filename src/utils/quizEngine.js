// src/utils/quizEngine.js
// Motor de quiz reutilizable: genera preguntas de opción múltiple
// "carácter → significado" a partir de un pool de caracteres. Lo comparten los
// exámenes/minijuegos (GlobalExam, CefrExam…) que antes duplicaban esta lógica.
import { shuffle } from './arrayUtils.js';

// Significado del carácter, tolerando ambas formas del dato (`meaning` plano o
// `meanings.es` del formato multilingüe).
export function meaningOf(c) {
  return c?.meaning || c?.meanings?.es || '';
}

/**
 * Genera preguntas de opción múltiple carácter→significado.
 * @param {Array}  pool          caracteres candidatos
 * @param {number} count         nº de preguntas (se acota al tamaño del pool)
 * @param {number} optionsPerQ   opciones por pregunta (1 correcta + distractores)
 * @returns {Array<{correct, answer, options}>}
 */
export function buildMeaningQuestions(pool, count, optionsPerQ = 4) {
  const valid = pool.filter(c => c.char && meaningOf(c));
  const picked = shuffle([...valid]).slice(0, Math.min(count, valid.length));
  return picked.map(correct => {
    const distractors = shuffle(valid.filter(c => c.char !== correct.char))
      .slice(0, optionsPerQ - 1)
      .map(meaningOf);
    return {
      correct,
      answer: meaningOf(correct),
      options: shuffle([meaningOf(correct), ...distractors]),
    };
  });
}

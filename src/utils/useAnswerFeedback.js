// src/utils/useAnswerFeedback.js
// Estado de "pregunta con feedback" compartido por los minijuegos de opción
// múltiple de ronda única (Dictado, Tonos al oído, Conexión Pinyin, Carrera
// Contrarreloj): qué se eligió, si acertó, y los contadores de acierto/fallo.
// NO decide CUÁNDO pasar a la siguiente pregunta — cada juego tiene su propio
// ritmo (rondas fijas vs. cuenta atrás), eso se queda en el propio juego.
import { useState, useCallback } from 'react';
import { hapticSuccess, hapticError } from './haptic.js';

export function useAnswerFeedback() {
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Registra la elección y dispara el feedback háptico correspondiente.
  const answer = useCallback((choice, isCorrect) => {
    setSelected(choice);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setCorrectCount(c => c + 1);
      hapticSuccess();
    } else {
      setWrongCount(w => w + 1);
      hapticError();
    }
  }, []);

  // Al empezar una partida nueva.
  const resetCounts = useCallback(() => {
    setCorrectCount(0);
    setWrongCount(0);
  }, []);

  // Al pasar a la siguiente pregunta dentro de la misma partida.
  const nextQuestion = useCallback(() => {
    setFeedback(null);
    setSelected(null);
  }, []);

  return { feedback, selected, correctCount, wrongCount, answer, resetCounts, nextQuestion };
}
